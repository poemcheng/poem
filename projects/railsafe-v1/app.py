"""RailSafe v0.1 minimal runnable edition. Demo only; no safety controls."""
import csv,io,os,sqlite3,uuid
from contextlib import contextmanager
from datetime import datetime,timezone
from pathlib import Path
from fastapi import FastAPI,HTTPException,UploadFile,File
from fastapi.responses import FileResponse
from pydantic import BaseModel,Field
from typing import Literal
ROOT=Path(__file__).resolve().parent
DB=Path(os.environ.get("RAILSAFE_DB",str(ROOT/"railsafe.sqlite3")))
app=FastAPI(title="RailSafe Insight Prototype",version="0.1.0")
@contextmanager
def session():
    db=sqlite3.connect(DB)
    db.row_factory=sqlite3.Row
    try:
        yield db
        db.commit()
    finally: db.close()
def utc():return datetime.now(timezone.utc).isoformat()
@app.on_event("startup")
def init():
    with session() as db:
        db.executescript("""
        CREATE TABLE IF NOT EXISTS assets(id TEXT PRIMARY KEY,route TEXT,km TEXT,grade TEXT,activity TEXT,location_quality TEXT,source TEXT);
        CREATE TABLE IF NOT EXISTS evidence(id TEXT PRIMARY KEY,asset_id TEXT,kind TEXT,observed_at TEXT,value REAL,unit TEXT,source TEXT,quality TEXT);
        CREATE TABLE IF NOT EXISTS tasks(id TEXT PRIMARY KEY,asset_id TEXT,title TEXT,status TEXT,created_at TEXT,updated_at TEXT);
        CREATE TABLE IF NOT EXISTS audit(id INTEGER PRIMARY KEY AUTOINCREMENT,task_id TEXT,actor TEXT,old_status TEXT,new_status TEXT,note TEXT,at TEXT);
        """)
        if not db.execute("SELECT 1 FROM assets LIMIT 1").fetchone():
            db.executemany("INSERT INTO assets VALUES(?,?,?,?,?,?,?)",[
                ("DEMO-001","示範線","K10+200","C","中高","unverified","SYNTHETIC"),
                ("DEMO-002","示範線","K21+700","D","低","unverified","SYNTHETIC"),
                ("DEMO-003","示範線","K33+100","B","高","unverified","SYNTHETIC")])
            db.execute("INSERT INTO evidence VALUES(?,?,?,?,?,?,?,?)",("E-001","DEMO-001","rain_24h","2026-01-01T12:00:00+00:00",87.2,"mm","SYNTHETIC","demo"))
@app.get("/")
def home():return FileResponse(ROOT/"index.html")
@app.get("/api/status")
def status():
    with session() as db:
        return {"mode":"DEMO_ONLY","safety_interlock_connected":False,"validated_prediction":False,"assets":db.execute("SELECT count(*) FROM assets").fetchone()[0]}
@app.get("/api/assets")
def assets():
    with session() as db:return [dict(r) for r in db.execute("SELECT * FROM assets ORDER BY id")]
@app.get("/api/assets/{id}")
def detail(id:str):
    with session() as db:
        row=db.execute("SELECT * FROM assets WHERE id=?",(id,)).fetchone()
        if not row:raise HTTPException(404,"Unknown asset")
        return {"asset":dict(row),"evidence":[dict(r) for r in db.execute("SELECT * FROM evidence WHERE asset_id=?",(id,))]}
class NewTask(BaseModel):
    asset_id:str
    title:str=Field(min_length=3,max_length=180)
    actor:str=Field(min_length=1,max_length=80)
class Move(BaseModel):
    status:Literal["assigned","accepted","in_progress","needs_evidence","in_review","closed","cancelled"]
    actor:str=Field(min_length=1,max_length=80)
    note:str=Field(min_length=4,max_length=1000)
NEXT={"triage":{"assigned","cancelled"},"assigned":{"accepted","cancelled"},"accepted":{"in_progress","cancelled"},"in_progress":{"needs_evidence","in_review"},"needs_evidence":{"in_progress","in_review"},"in_review":{"closed","needs_evidence"},"closed":set(),"cancelled":set()}
@app.get("/api/tasks")
def tasks():
    with session() as db:return [dict(r) for r in db.execute("SELECT * FROM tasks ORDER BY created_at DESC")]
@app.post("/api/tasks",status_code=201)
def create(req:NewTask):
    id="TASK-"+uuid.uuid4().hex[:10].upper();t=utc()
    with session() as db:
        if not db.execute("SELECT 1 FROM assets WHERE id=?",(req.asset_id,)).fetchone():raise HTTPException(404,"Unknown asset")
        db.execute("INSERT INTO tasks VALUES(?,?,?,?,?,?)",(id,req.asset_id,req.title,"triage",t,t))
        db.execute("INSERT INTO audit(task_id,actor,old_status,new_status,note,at) VALUES(?,?,?,?,?,?)",(id,req.actor,None,"triage","Task created",t))
    return {"id":id,"status":"triage"}
@app.post("/api/tasks/{id}/transition")
def move(id:str,req:Move):
    with session() as db:
        row=db.execute("SELECT status FROM tasks WHERE id=?",(id,)).fetchone()
        if not row:raise HTTPException(404,"Unknown task")
        old=row["status"]
        if req.status not in NEXT[old]:raise HTTPException(409,"Invalid workflow transition")
        t=utc();db.execute("UPDATE tasks SET status=?,updated_at=? WHERE id=?",(req.status,t,id))
        db.execute("INSERT INTO audit(task_id,actor,old_status,new_status,note,at) VALUES(?,?,?,?,?,?)",(id,req.actor,old,req.status,req.note,t))
    return {"id":id,"from":old,"to":req.status}
@app.get("/api/tasks/{id}/audit")
def audit(id:str):
    with session() as db:return [dict(r) for r in db.execute("SELECT * FROM audit WHERE task_id=? ORDER BY id",(id,))]
@app.post("/api/import/evidence-csv")
async def import_csv(file:UploadFile=File(...)):
    if not (file.filename or "").lower().endswith(".csv"):raise HTTPException(400,"CSV required")
    data=await file.read(2_000_001)
    if len(data)>2_000_000:raise HTTPException(413,"Max 2MB")
    try:rows=list(csv.DictReader(io.StringIO(data.decode("utf-8-sig"))))
    except UnicodeError:raise HTTPException(400,"UTF-8 CSV required")
    needed={"asset_id","kind","observed_at","value","unit","source","quality"}
    if not rows or not needed.issubset(rows[0]):raise HTTPException(400,"Missing CSV columns")
    if len(rows)>1000:raise HTTPException(413,"Max 1000 rows")
    parsed=[]
    for i,r in enumerate(rows,start=2):
        try:
            t=datetime.fromisoformat(r["observed_at"].replace("Z","+00:00"))
            if t.tzinfo is None:raise ValueError("timezone required")
            if r["quality"] not in {"verified","candidate","missing","demo"}:raise ValueError("invalid quality")
            if not r["source"].strip():raise ValueError("source required")
            parsed.append((uuid.uuid4().hex,r["asset_id"],r["kind"],t.isoformat(),float(r["value"]) if r["value"] else None,r["unit"],r["source"],r["quality"]))
        except (KeyError,ValueError) as e:raise HTTPException(422,f"row {i}: {e}")
    with session() as db:
        ids={r["id"] for r in db.execute("SELECT id FROM assets")}
        if any(r[1] not in ids for r in parsed):raise HTTPException(422,"unknown asset_id")
        db.executemany("INSERT INTO evidence VALUES(?,?,?,?,?,?,?,?)",parsed)
    return {"imported":len(parsed),"mode":"evidence_only","prediction":"not_performed"}
