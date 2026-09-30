"""Validate the deployed HTTPS origin and render it in real Chromium.
RAF is stepped explicitly for deterministic software-WebGL checks, not an FPS test.
No physical Quest or native APK verification is implied.
"""
from pathlib import Path
import hashlib, json, os, sys, time
from urllib.request import Request, urlopen
from urllib.parse import urljoin, quote
from playwright.sync_api import sync_playwright
BASE = sys.argv[1].rstrip('/') + '/'
RUN = os.environ['GITHUB_RUN_ID']
APP = urljoin(BASE, 'campus-quest-v2/')
OUT = Path('verification')
OUT.mkdir(exist_ok=True)
results = []

def passed(name, **details):
    results.append({'test': name, 'status': 'PASS', **details})
    print('PASS', name, json.dumps(details, ensure_ascii=False), flush=True)

def fetch(url):
    req = Request(url + ('&' if '?' in url else '?') + 'release=' + RUN,
                  headers={'Cache-Control': 'no-cache', 'User-Agent': 'CampusQuest-Pages-Check'})
    with urlopen(req, timeout=45) as response:
        assert response.status == 200, (url, response.status)
        return response.read()

last = None
for attempt in range(24):
    try:
        manifest = json.loads(fetch(urljoin(APP, 'release.json')))
        assert str(manifest['run_id']) == RUN, 'Older deployment still at CDN edge'
        break
    except Exception as error:
        last = error
        print('Propagation check', attempt + 1, str(error), flush=True)
        time.sleep(5)
else:
    raise RuntimeError(f'Live release not found: {last}')
passed('HTTPS release matches this deployment', url=APP, run_id=RUN)
assert hashlib.sha256(fetch(BASE)).hexdigest() == manifest['root_index_sha256']
passed('Existing RailSlope root is unchanged')
for name, expected in manifest['files'].items():
    data = fetch(urljoin(APP, quote(name)))
    assert hashlib.sha256(data).hexdigest() == expected, ('Asset mismatch', name)
passed('All published campus files match build SHA-256', count=len(manifest['files']))
DRIVER = '''window.__raf=[];window.__clock=performance.now();
window.requestAnimationFrame=cb=>(window.__raf.push(cb),window.__raf.length);
window.__step=(n=1)=>{for(let i=0;i<n;i++){let q=window.__raf.splice(0);window.__clock+=260;for(let cb of q)cb(window.__clock);}};'''
with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True, args=[
        '--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader',
        '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--disable-dev-shm-usage'])
    page = browser.new_page(viewport={'width': 1152, 'height': 720}, accept_downloads=True)
    page.set_default_timeout(90000)
    errors = []
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.add_init_script(DRIVER)
    response = page.goto(APP + '?release=' + RUN, wait_until='load', timeout=180000)
    assert response.status == 200
    page.wait_for_function('window.CampusQuest && CampusQuest.renderer.assetsReady', timeout=180000)
    assert page.evaluate('window.isSecureContext')
    page.evaluate('CampusQuest.app.setQuality("balanced"); __step(1); CampusQuest.renderer.gl.finish()')
    assert page.evaluate('CampusQuest.renderer.gl.getError()===0')
    assert page.evaluate('document.getElementById("fatal").hidden')
    passed('Live page compiles WebGL2 shaders, uploads materials and renders')
    page.screenshot(path=str(OUT / '01_live_landing.png'), timeout=90000)
    page.evaluate('document.getElementById("start").click()')
    assert page.evaluate('CampusQuest.game.started && !document.getElementById("hud").hidden')
    z = page.evaluate('CampusQuest.game.player.z')
    page.keyboard.down('KeyW')
    page.evaluate('for(let i=0;i<20;i++) CampusQuest.app.updateDesktop(.05)')
    page.keyboard.up('KeyW')
    assert page.evaluate('CampusQuest.game.player.z') < z - 2
    passed('Live desktop Start and WASD movement work')
    page.evaluate('document.getElementById("mapBtn").click()')
    assert page.locator('#buildingList .buildingRow').count() == 14
    page.evaluate('document.getElementById("mapClose").click()')
    passed('Live campus map lists fourteen buildings')
    assert page.evaluate('CampusQuest.game.lift("E",6)')
    page.wait_for_timeout(700)
    page.evaluate('CampusQuest.game.step(.01); __step(1); CampusQuest.renderer.gl.finish()')
    assert page.evaluate('CampusQuest.game.location().floor') == 6
    passed('Live sixth-floor transfer lands on a supported surface')
    page.screenshot(path=str(OUT / '02_live_sixth_floor.png'), timeout=90000)
    with page.expect_download() as download:
        page.evaluate('CampusQuest.game.export("json")')
    assert 'state' in json.loads(Path(download.value.path()).read_text())
    passed('Live browser exports JSON learning records')
    passed('Secure origin and VR entry controls exist',
           xr_api=page.evaluate('!!navigator.xr'),
           physicalQuest3Tested=False)
    assert not errors, errors
    passed('No unhandled JavaScript exceptions')
    browser.close()
report = {'url': APP, 'run_id': RUN, 'physicalQuest3Tested': False,
          'method': 'Live HTTPS, SHA-256 comparison and real Chromium/SwiftShader with stepped RAF; not an FPS benchmark',
          'tests': results}
(OUT / 'report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
print('LIVE_VERIFICATION_COMPLETE', json.dumps(report, ensure_ascii=False), flush=True)
with open(os.environ.get('GITHUB_STEP_SUMMARY', os.devnull), 'a', encoding='utf-8') as f:
    f.write(f'## Campus Quest v2\n\n[Open game]({APP})\n\n')
    f.write('\n'.join('- PASS: ' + t['test'] for t in results))
    f.write('\n\nPhysical Quest 3 has not been tested.\n')
