# RailSafe Insight v0.1 — Public-data and human-AI workflow prototype

**Demo-only:** no train operation, signalling, DWS, TSR or emergency controls. No validated hazard probability. All included records are synthetic.

## Start
```bash
pip install -r requirements.txt
uvicorn app:app --reload --host 127.0.0.1 --port 8000
```
Open http://127.0.0.1:8000 or API docs at /docs.

## Scope
A control-center view and field-task view, split A/B/C/D maintenance grades from InSAR activity class, evidence timestamps and provenance, a maintenance task state machine and audit history, normalized public CSV import.

The full locally tested package (with expanded front end and pytest suite) is distributed separately as railsafe-v1-source.zip. This repository branch hosts a runnable minimal edition.

## API
GET /api/status, /api/assets, /api/assets/{id}, /api/tasks, /api/tasks/{id}/audit
POST /api/tasks, /api/tasks/{id}/transition, /api/import/evidence-csv

CSV headers: `asset_id,kind,observed_at,value,unit,source,quality`.
Observed timestamp must include time zone. Not a direct importer of Taiwan Railway competition files; only normalize publicly licensed or explicitly authorized data locally.

## Not implemented
Authentication/SSO, offline persistence, actual GIS, validated slope risk prediction, equipment connection, safety certification or enterprise UAT.
