"""Verify anonymously accessible HTTPS and core published interactions."""
from pathlib import Path
import json, sys, urllib.request
from playwright.sync_api import sync_playwright
url=sys.argv[1].rstrip('/')+'/'
out=Path('verification');out.mkdir(exist_ok=True)
checks=[]
for name in ['','source.zip','release.json','core.js','docs/GUIDE.md']:
 with urllib.request.urlopen(url+name,timeout=30) as r:
  data=r.read();assert r.status==200 and data
  checks.append({'resource':name or 'index.html','status':r.status,'bytes':len(data)})
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True)
 page=browser.new_page(viewport={'width':1440,'height':1000})
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(url,wait_until='networkidle',timeout=60000)
 assert page.get_by_text('從第一站開始 →').is_visible()
 page.get_by_role('button',name='01 工程圖重用',exact=True).click()
 page.get_by_role('button',name='檢查是否提出建議').click();assert page.get_by_role('button',name='模擬採納並查看狀態').is_enabled()
 page.get_by_role('button',name='補強規則示意').click();page.get_by_role('button',name='檢查是否提出建議').click();assert page.get_by_role('button',name='模擬採納並查看狀態').is_disabled()
 page.get_by_role('button',name='02 配對模擬',exact=True).click();page.get_by_role('button',name='執行 24 組教學情境').click();assert page.get_by_role('button',name='匯出逐情境 CSV').is_enabled()
 page.get_by_role('button',name='03 部署驗收',exact=True).click();page.get_by_role('button',name='只跑舊檢查：9 情境').click();assert '9/9' in page.locator('#dep-result').inner_text()
 page.get_by_role('button',name='套用完整發布修正並驗收').click();assert page.get_by_text('完整示例驗收通過',exact=True).is_visible()
 page.screenshot(path=str(out/'quality-lab-live-desktop.png'),full_page=True)
 page.set_viewport_size({'width':390,'height':844});page.get_by_role('button',name='總覽',exact=True).click();assert not page.evaluate('document.documentElement.scrollWidth>innerWidth')
 page.screenshot(path=str(out/'quality-lab-live-mobile.png'),full_page=True)
 assert not errors,errors
 browser.close()
report={'url':url,'anonymous_https':True,'checked_resources':checks,'three_station_smoke_test':True,'viewport_390px':True,'physical_mobile_tested':False,'browser_errors':errors}
(out/'quality-lab-live.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(report,ensure_ascii=False,indent=2))
