"""Build a standalone HTML; no external fonts, CDNs, keys or services."""
from pathlib import Path
ROOT=Path(__file__).resolve().parent
css=(ROOT/'style.css').read_text(encoding='utf-8')
core=(ROOT/'core.js').read_text(encoding='utf-8')
app=(ROOT/'app.js').read_text(encoding='utf-8')
assert '</script' not in (core+app).lower()
html='''<!doctype html>
<html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="以DrawIQ、醫療器械配對模擬、虛擬人教學平台部署案例，體驗AI品質驗證與人機協作。"><meta name="referrer" content="no-referrer"><title>品質協作實驗室｜AI與機器人的品質驗證</title><style>'''+css+'''</style></head><body><header><div class="header-inner"><div class="brand"><span class="brand-mark" aria-hidden="true">Q</span><div>品質協作實驗室<small>AI 與機器人的品質驗證 · 鄭淳詩研究衍生教學</small></div></div><div class="version">2026.11 · 可攜教學版</div></div><nav aria-label="體驗導覽">'''+''.join(f'<button data-page="{k}">{v}</button>' for k,v in [('home','總覽'),('drawiq','01 工程圖重用'),('medical','02 配對模擬'),('deployment','03 部署驗收'),('report','學習紀錄'),('sources','證據與開源')])+'''</nav></header><main id="app"></main><noscript><p>本互動體驗需要啟用JavaScript；程式與教學內容均可從原始碼閱讀。</p></noscript><footer><div class="footer-line"><span>品質協作實驗室 · MIT教學程式 · 資料只在此瀏覽器</span><span>教學示例 ≠ 原始實驗重跑 ≠ 真機安全驗證 ≠ 臨床效度</span></div></footer><script>'''+core+'''</script><script>'''+app+'''</script></body></html>'''
(ROOT/'index.html').write_text(html,encoding='utf-8')
print('Built',len(html.encode()),'bytes')
import hashlib,json,os,zipfile
source_files=['core.js','app.js','style.css','build.py','README.md','LICENSE','tests/core.test.cjs','tests/browser_test.py','docs/GUIDE.md']
if (ROOT/'tests/live_test.py').exists():source_files.append('tests/live_test.py')
if (ROOT/'docs/VALIDATION.md').exists():source_files.append('docs/VALIDATION.md')
with zipfile.ZipFile(ROOT/'source.zip','w',zipfile.ZIP_DEFLATED) as z:
 for name in ['index.html']+source_files:
  z.write(ROOT/name,arcname='quality-collaboration-lab/'+name)
manifest={'version':'2026.11-teaching.1','source_commit':os.environ.get('GITHUB_SHA','local'),'files':{name:hashlib.sha256((ROOT/name).read_bytes()).hexdigest() for name in ['index.html']+source_files},'research_reproduction':False,'physical_robot_tested':False}
(ROOT/'release.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
