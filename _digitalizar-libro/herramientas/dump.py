import sys, json
from playwright.sync_api import sync_playwright
NM='/home/claude/tools/node_modules/'
LOCAL={'vexflow@4.2.2/build/cjs/vexflow.js':NM+'vexflow/build/cjs/vexflow.js',
       'soundfont-player@0.12.0/dist/soundfont-player.min.js':NM+'soundfont-player/dist/soundfont-player.min.js'}
def route(r):
    u=r.request.url
    for k,v in LOCAL.items():
        if k in u: return r.fulfill(path=v, content_type='application/javascript')
    if 'localhost' in u: return r.continue_()
    return r.fulfill(status=404, body='')
def run(url, js, shot=None, w=1400, h=1000, wait=2500):
    with sync_playwright() as p:
        b=p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--autoplay-policy=no-user-gesture-required'])
        pg=b.new_page(viewport={'width':w,'height':h})
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.route('**/*', route)
        pg.goto(url); pg.wait_for_timeout(wait)
        out=pg.evaluate(js)
        if shot: pg.wait_for_timeout(800); pg.screenshot(path=shot, full_page=True)
        b.close()
        return out, errs
if __name__=='__main__':
    js=open(sys.argv[2]).read() if sys.argv[2].endswith('.js') else sys.argv[2]
    o,e=run(sys.argv[1], js, sys.argv[3] if len(sys.argv)>3 else None)
    print(o if isinstance(o,str) else json.dumps(o)[:20000]); print('ERRS',e[:8])
