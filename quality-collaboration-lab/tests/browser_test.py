"""Real Chromium UI tests against a temporary loopback HTTP server.
Requires playwright and a Chromium executable (CHROMIUM_PATH, or /usr/bin/chromium).
No external application requests are expected. Does not test a physical phone.
"""
import functools, http.server, json, os, threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'verification'; OUT.mkdir(exist_ok=True)
class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(QuietHandler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{server.server_port}'
results=[]; errors=[]; requests=[]
MEMORY=os.environ.get('UI_TEST_IN_MEMORY')=='1'
def ok(name):results.append({'test':name,'passed':True})
try:
 with sync_playwright() as p:
  options={'headless':True,'args':['--no-sandbox']}
  executable=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium')
  if Path(executable).exists():options['executable_path']=executable
  browser=p.chromium.launch(**options)
  page=browser.new_page(viewport={'width':1440,'height':1000},device_scale_factor=1)
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('request',lambda r:requests.append(r.url))
  
  def load(path='index.html',tab='home'):
   if MEMORY:
    page.goto('about:blank');page.set_content((ROOT/path).read_text(encoding='utf-8'));page.locator(f'nav [data-page=\"{tab}\"]').click()
   else:page.goto(base+'/'+path+'#'+tab)
  load();page.wait_for_selector('h1')
  assert page.get_by_text('從第一站開始 →').is_visible();ok('standalone HTML home rendering')
  page.screenshot(path=str(OUT/'01-home-desktop.png'),full_page=True)
  page.get_by_role('button',name='01 工程圖重用',exact=True).click()
  page.get_by_role('button',name='檢查是否提出建議').click()
  assert '未檢查的風險：比較運算子相符' in page.locator('#draw-result').inner_text()
  page.get_by_role('button',name='模擬採納並查看狀態').click()
  assert page.get_by_text('採納結果：已有內容，但仍待審。').is_visible()
  page.get_by_role('button',name='補強規則示意').click();page.get_by_role('button',name='檢查是否提出建議').click()
  assert page.get_by_role('button',name='模擬採納並查看狀態').is_disabled();ok('DrawIQ gap, adoption stays pending, guarded rejection')
  page.screenshot(path=str(OUT/'02-drawiq-desktop.png'),full_page=True)
  page.get_by_role('button',name='02 配對模擬',exact=True).click();page.get_by_role('button',name='同時執行有／無閘門').click()
  page.wait_for_timeout(100);page.get_by_role('button',name='暫停動畫').click()
  assert page.locator('#status-gate').inner_text()!='尚未執行'
  page.get_by_role('button',name='執行 24 組教學情境').click()
  assert page.get_by_text('新產生的教學結果，與上方歷史數值分開。').is_visible()
  with page.expect_download() as d:page.get_by_role('button',name='匯出逐情境 CSV').click()
  csv=OUT/'sample-paired.csv';d.value.save_as(str(csv));assert len(csv.read_text().strip().splitlines())==25
  ok('paired animation, 24-scenario batch, full CSV export')
  page.screenshot(path=str(OUT/'03-medical-desktop.png'),full_page=True)
  page.get_by_role('button',name='03 部署驗收',exact=True).click();page.get_by_role('button',name='只跑舊檢查：9 情境').click()
  assert '9/9' in page.locator('#dep-result').inner_text()
  page.get_by_role('button',name='驗收全部 28 教案',exact=True).click();assert page.locator('[data-course]').count()==28
  page.locator('[data-course="21"]').click();assert '缺少教案結構' in page.locator('#course-detail').inner_text()
  page.get_by_role('button',name='套用完整發布修正並驗收').click();assert page.get_by_text('完整示例驗收通過',exact=True).is_visible()
  page.get_by_role('button',name='注入一個損毀檔案').click();assert page.get_by_text('尚不足以接受完整發布',exact=True).is_visible()
  ok('9/9 coverage gap, clean-install missing seeds, release fix, media corruption')
  page.screenshot(path=str(OUT/'04-deployment-desktop.png'),full_page=True)
  page.get_by_role('button',name='學習紀錄',exact=True).click()
  with page.expect_download() as d:page.get_by_role('button',name='匯出完整活動 JSON').click()
  activity=OUT/'sample-activity.json';d.value.save_as(str(activity));obj=json.loads(activity.read_text());assert set(obj['results'])=={'drawiq','medical','deployment'};assert obj['ratings'] is None
  ok('activity JSON includes all stations; ratings not auto-submitted')
  page.get_by_role('button',name='證據與開源',exact=True).click()
  with page.expect_download() as d:page.get_by_role('button',name='下載可離線使用的 HTML').click()
  saved=OUT/'exported-offline.html';d.value.save_as(str(saved));load('verification/exported-offline.html');assert page.get_by_text('從第一站開始 →').is_visible()
  ok('downloaded self-contained HTML reload')
  for tab in ['home','drawiq','medical','deployment','report','sources']:
   page.set_viewport_size({'width':390,'height':844});load(tab=tab);page.wait_for_selector('h1')
   assert not page.evaluate('document.documentElement.scrollWidth > innerWidth'),tab
   if tab in ['home','drawiq','deployment']:page.screenshot(path=str(OUT/f'05-mobile-{tab}.png'),full_page=True)
  ok('390px viewport: all six views, no horizontal document overflow')
  page.set_viewport_size({'width':1440,'height':1000});load()
  page.locator('nav [data-page=home]').focus();page.keyboard.press('Tab');assert page.evaluate('document.activeElement.tagName')=='BUTTON'
  ok('keyboard focus enters navigation')
  assert not errors,errors
  external=[u for u in requests if u.startswith(('http:','https:')) and not u.startswith(base)]
  assert not external,external;ok('no JavaScript exceptions or external network requests')
  browser.close()
 report={'browser':'Chromium on Linux','transport':'in-memory page.set_content' if MEMORY else 'loopback HTTP','physical_mobile_tested':False,'file_scheme_tested':False,'results':results,'errors':errors,'external_requests':external}
 (OUT/'browser-tests.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
 print(json.dumps(report,ensure_ascii=False,indent=2))
finally:server.shutdown()
