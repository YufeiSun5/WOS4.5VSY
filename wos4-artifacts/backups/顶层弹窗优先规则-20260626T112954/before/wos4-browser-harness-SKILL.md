---
name: wos4-browser-harness
description: Use browser-harness to operate WOS4 / WellinOS4.5 in the user's local Chrome session. Trigger this skill when the user asks to use browser-harness, compare it with Chrome MCP,接管本地 Chrome, operate WOS4 with visible human navigation, inspect nested WOS4 iframes, run browser-harness --doctor, or avoid Playwright / Chrome DevTools / node_repl while automating WOS4.
---

# WOS4 Browser Harness

## Purpose

Use `browser-harness` as the preferred local Chrome control path for WOS4 when the user explicitly requests it or when Chrome MCP is unstable. Keep WOS4 entry human-visible: login page is the only fixed URL entry; desktop apps, clients, groups, pages, and model rows are reached by UI actions.

Always combine this skill with:

- `D:\DEV_D\WOS4.5\.ai\skills\wos4-login\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-human-navigation\SKILL.md`

## Hard Rules

- Do not use Playwright, Chrome DevTools, or `node_repl` when the user explicitly says to use `browser-harness` and not those tools.
- Start with `browser-harness --doctor`.
- Add `C:\Users\SunYufei\.local\bin` to PATH in the current command before using `browser-harness`.
- Do not pipe PowerShell here-strings directly into `browser-harness`; PowerShell may add a BOM and break the first Python symbol.
- For multi-line Python, write an ASCII temporary `.py` file with `Set-Content -Encoding ascii`, then run `cmd /c "type 文件 | browser-harness"`.
- Because the temp file is ASCII, write Chinese string literals as Unicode escape sequences in the Python/JS source, or load Chinese values from UTF-8 files at runtime.
- Do not print passwords, cookies, tokens, or config secrets. Before login, acquire an account lock with `wos4-artifacts/scripts/wos4-lock.ps1`; then read WOS4 credentials from the locked account section in `wos4-artifacts/config/wos4.local.ini` or `WOS4_PASS`.
- If `wos4-lock.ps1` returns `status=blocked` / `reason=account_pool_exhausted`, stop and report `blocked`. Do not open another Chrome tab with a locked account.
- Release the account lock with `wos4-lock.ps1 -Action ReleaseAccount` when the current AI no longer needs the WOS4 account.
- For concurrent WOS4 work, do not share one normal Chrome profile. Start separate profile sessions with `wos4-artifacts/scripts/wos4-browser-sessions.ps1`; each session must have its own `profile_dir`, `cdp_port`, and `harness_name`.
- Starting a browser session does not claim a WOS account seat. Account seats are managed by WOS login person, not by AI agent role; use `AcquireAccount -Owner wos4:<账号别名>` only when a Chrome/profile needs to log in as that WOS account.
- Dynamic `/public/?...` and `GetFileContent/.../index.html` URLs are evidence only, not entry points.
- Save screenshots and JSON-like findings under `wos4-artifacts/screenshots/` and `wos4-artifacts/snapshots/`.

## Doctor

Run exactly:

```powershell
$env:Path = 'C:\Users\SunYufei\.local\bin;' + $env:Path
browser-harness --doctor
```

Core success criteria:

```text
[ok] chrome running
[ok] daemon alive
[ok] active browser connections
```

These are optional failures and do not block local Chrome operation:

```text
[FAIL] profile-use installed
[FAIL] BROWSER_USE_API_KEY set
```

If `browser-harness` is not recognized, check that `C:\Users\SunYufei\.local\bin\browser-harness.exe` exists and that the current command prepends `.local\bin` to PATH.

## Three Profile Sessions

Use this project script to prepare three visible, isolated Chrome profiles and matching browser-harness daemons:

```powershell
powershell -ExecutionPolicy Bypass -File wos4-artifacts/scripts/wos4-browser-sessions.ps1 -Action Start
```

The default Chrome window size is `1920x1080`:

```powershell
powershell -ExecutionPolicy Bypass -File wos4-artifacts/scripts/wos4-browser-sessions.ps1 -Action Start -WindowWidth 1920 -WindowHeight 1080
```

This is the outer Chrome window size. `page_info().w/h` reports the web viewport and will usually be shorter because Chrome's title bar and address bar consume vertical space.

The script reads `[wos4.session.*]` from `wos4-artifacts/config/wos4.local.ini`. Required fields per slot:

```ini
[wos4.session.slot1]
account=sun_yufei
driver=browser-harness
profile_dir=wos4-artifacts/config/chrome-profiles/slot1
cdp_port=13222
harness_name=wos4_slot1
```

Connect a specific browser-harness call to a slot:

```powershell
$env:Path = 'C:\Users\SunYufei\.local\bin;' + $env:Path
$env:BU_NAME = 'wos4_slot1'
$env:BU_CDP_URL = 'http://127.0.0.1:13222'
cmd /c "type %TEMP%\browser_harness_task.py | browser-harness"
```

Isolation success markers:

- `wos4-browser-sessions.ps1 -Action Status` shows every slot with `cdp.ok=true` and different `cdp_port` values.
- `wos4-browser-sessions.ps1 -Action Doctor` or `browser-harness --doctor` lists `wos4_slot1`, `wos4_slot2`, and `wos4_slot3` as separate active browser connections.
- After logging in different accounts, probing each slot still returns `#/main` and sessionStorage keys such as `IS_BS`, `clientNumber`, `desktop_storageCloud`, and `proxy_pathname`.

Current WOS4 login state is stored in the browser profile's web storage, primarily sessionStorage for the WOS4 origin. In the verified run no cookies were needed for the visible login marker. Keeping separate `--user-data-dir` folders prevents these sessionStorage/local profile files from being shared.

Foreground reality: three sessions can run concurrently, but only one Windows window is active in the foreground at a time. On a single monitor, three `1920x1080` windows overlap. For evidence, capture screenshots through each slot's CDP/browser-harness connection; use foreground viewing only for human spot checks or when multiple monitors are available.

Within one already logged-in Chrome/profile, switching between `frontend-ai`, `code-ai`, `test-ai`, and `review-ai` does not require account lock release or reacquire. Only changing the WOS login person for that profile, or ending use of that WOS login person, touches the account seat lock.

Stop only the harness daemons:

```powershell
powershell -ExecutionPolicy Bypass -File wos4-artifacts/scripts/wos4-browser-sessions.ps1 -Action StopHarness
```

Stop the test harness daemons and dedicated Chrome processes:

```powershell
powershell -ExecutionPolicy Bypass -File wos4-artifacts/scripts/wos4-browser-sessions.ps1 -Action Stop
```

## Multi-Line Command Pattern

Use this pattern for every multi-line harness run:

```powershell
$env:Path = 'C:\Users\SunYufei\.local\bin;' + $env:Path
$tmp = Join-Path $env:TEMP 'browser_harness_task.py'
Set-Content -LiteralPath $tmp -Encoding ascii -Value @(
  "ensure_real_tab()",
  "print(page_info())"
)
cmd /c "type %TEMP%\browser_harness_task.py | browser-harness"
```

For larger scripts, use a single-quoted PowerShell here-string only when writing to the temp file, not when piping to `browser-harness`:

```powershell
Set-Content -LiteralPath $tmp -Encoding ascii -Value @'
ensure_real_tab()
print(page_info())
'@
cmd /c "type %TEMP%\browser_harness_task.py | browser-harness"
```

## Useful Helpers

Verified helpers:

```python
ensure_real_tab()
list_tabs()
current_tab()
switch_tab(target_id)
new_tab(url='about:blank')
goto_url(url)
page_info()
click_at_xy(x, y, button='left', clicks=1)
type_text(text)
press_key(key, modifiers=0)
wait(seconds=1.0)
wait_for_element(selector, timeout=10.0, visible=False)
wait_for_load(timeout=15.0)
wait_for_network_idle(timeout=10.0, idle_ms=500)
capture_screenshot(path=None, full=False, max_dim=None)
iframe_target(url_substr)
js(expression, target_id=None)
```

`js()` accepts only `expression` and optional `target_id`; it does not accept Playwright-style extra arguments. Embed JSON into the script string when needed.

## Login Pattern

Use the login URL from `wos4-artifacts/config/wos4.local.ini` only. Do not hardcode a real WOS4 URL in reusable scripts or skill snippets.

First acquire an account lock outside `browser-harness`:

```powershell
$lock = powershell -ExecutionPolicy Bypass -File wos4-artifacts/scripts/wos4-lock.ps1 -Action AcquireAccount -Account sun_yufei -Session slot1 -Owner wos4:sun_yufei -Task "WOS4 登录" | ConvertFrom-Json
if ($lock.status -ne "acquired") { throw "WOS4 account lock blocked: $($lock.reason)" }
```

Then write fields with the WOS4 native value setter and click the login button by real coordinates:

```python
import configparser, json

parser = configparser.ConfigParser()
parser.read(r'D:\DEV_D\WOS4.5\wos4-artifacts\config\wos4.local.ini', encoding='utf-8')
base_cfg = parser['wos4']
account = '__LOCKED_ACCOUNT__'
section = 'wos4.account.' + account
cfg = parser[section] if parser.has_section(section) else parser['wos4']

ensure_real_tab()
if not base_cfg.get('url'):
    raise RuntimeError('missing [wos4] url in wos4.local.ini')
new_tab(base_cfg['url'])
wait_for_element('#desktop-login-input-name', 30, True)

payload = json.dumps({'user': cfg['username'], 'pass': cfg['password']}, ensure_ascii=True)
js("""
const payload = __PAYLOAD__;
function setValue(selector, value) {
  const el = document.querySelector(selector);
  const desc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value');
  desc.set.call(el, value);
  el.dispatchEvent(new Event('input', {bubbles:true}));
  el.dispatchEvent(new Event('change', {bubbles:true}));
  el.dispatchEvent(new Event('blur', {bubbles:true}));
}
setValue('#desktop-login-input-name', payload.user);
setValue('#desktop-login-input-password', payload.pass);
return true;
""".replace('__PAYLOAD__', payload))

rect = js("""
const b = document.querySelector('#desktop-login-btn');
const r = b.getBoundingClientRect();
return {x:r.x, y:r.y, w:r.width, h:r.height};
""")
click_at_xy(rect['x'] + rect['w']/2, rect['y'] + rect['h']/2)
```

Wait until `#/main` or desktop card text appears. Do not re-login because an inner client iframe is blank.

When the AI is done with this WOS4 account, release the account lock:

```powershell
powershell -ExecutionPolicy Bypass -File wos4-artifacts/scripts/wos4-lock.ps1 -Action ReleaseAccount -Account <locked-account> -Owner wos4:<locked-account>
```

## Opening 建模系统客户端

Use Unicode escapes in ASCII temp scripts:

```python
label = '\u5efa\u6a21\u7cfb\u7edf\u5ba2\u6237\u7aef'
rect = js("""
const label = '__LABEL__';
const el = Array.from(document.querySelectorAll('.data-item.card-item'))
  .find(e => e.getAttribute('title') === label || (e.innerText || '').trim() === label);
if (!el) throw new Error('modeling card missing');
const r = el.getBoundingClientRect();
return {x:r.x, y:r.y, w:r.width, h:r.height, text:el.innerText, title:el.getAttribute('title')};
""".replace('__LABEL__', label))

click_at_xy(rect['x'] + rect['w']/2, rect['y'] + 28)
wait(0.2)
click_at_xy(rect['x'] + rect['w']/2, rect['y'] + 28)
```

If the desktop app opens but the ready loop says false, inspect screenshots and frame tree before retrying. In WOS4, visible success may be inside `top -> public iframe -> GetFileContent iframe` while top-level `document.body.innerText` still lists desktop cards.

## Nested Iframe Access

`iframe_target()` may not find WOS4's nested frame. Use same-origin recursive DOM access instead:

```python
frames = js("""
function walk(win, path) {
  let out = [];
  let doc;
  try { doc = win.document; } catch(e) { return [{path, error:String(e), href:''}]; }
  let text = doc.body ? doc.body.innerText.slice(0,1200) : '';
  out.push({path, href: String(win.location.href), text, frameCount: doc.querySelectorAll('iframe').length});
  Array.from(doc.querySelectorAll('iframe')).forEach((f, i) => {
    out = out.concat(walk(f.contentWindow, path + '.' + i));
  });
  return out;
}
return walk(window, 'top');
""")
print(frames)
```

For 建模系统, the useful tree is typically:

```text
top
-> public/?id=6192730962611142710...
-> GetFileContent/.../f5f8c456-e145-4d85-b1c3-dc3a17e7b512_105/index.html
```

Operate the innermost document through:

```javascript
const outer = Array.from(document.querySelectorAll('iframe'))
  .find(f => f.src.includes('/public/') && f.getBoundingClientRect().width > 0);
const inner = outer.contentWindow.document.querySelector('iframe');
const doc = inner.contentWindow.document;
```

## Fast Toast / Message Capture

WOS4 success and error prompts may disappear before a screenshot or slow DOM read sees them. Before clicking `保存`, `提交`, `确认`, `创建`, `创建并打开`, `部署`, or `启动`, inject a capture probe into the target iframe document.

Use a MutationObserver plus console hook:

```python
js(r"""
const outer = document.querySelector('iframe');
const win = outer ? outer.contentWindow : window;
const doc = win.document;
win.__wos4AiCapture = win.__wos4AiCapture || {messages: [], console: []};
if (!win.__wos4AiCaptureInstalled) {
  const push = (kind, text, extra = {}) => {
    if (!text) return;
    win.__wos4AiCapture.messages.push({kind, text: String(text).slice(0,500), extra, t: Date.now()});
  };
  const oldLog = win.console.log;
  const oldWarn = win.console.warn;
  const oldError = win.console.error;
  win.console.log = function(...args){ win.__wos4AiCapture.console.push({level:'log', args:args.map(String), t:Date.now()}); return oldLog.apply(this,args); };
  win.console.warn = function(...args){ win.__wos4AiCapture.console.push({level:'warn', args:args.map(String), t:Date.now()}); return oldWarn.apply(this,args); };
  win.console.error = function(...args){ win.__wos4AiCapture.console.push({level:'error', args:args.map(String), t:Date.now()}); return oldError.apply(this,args); };
  const obs = new win.MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const n of Array.from(m.addedNodes || [])) {
        if (n.nodeType !== 1) continue;
        const el = n;
        const txt = (el.innerText || el.textContent || '').trim();
        const cls = String(el.className || '');
        if (txt && (/el-message|el-notification|el-message-box|el-dialog|toast|message/i.test(cls) || /成功|失败|错误|警告|保存|提交/.test(txt))) {
          push('mutation', txt, {className: cls});
        }
      }
    }
  });
  obs.observe(doc.body, {childList:true, subtree:true});
  win.__wos4AiCaptureObserver = obs;
  win.__wos4AiCaptureInstalled = true;
}
return true;
""")
```

After the action and a short wait, read:

```python
captured = js(r"""
const outer = document.querySelector('iframe');
const win = outer ? outer.contentWindow : window;
return win.__wos4AiCapture || {messages: [], console: []};
""")
```

Save the capture JSON under `wos4-artifacts/snapshots/`. This is the preferred way to prove quick prompts such as `修改成功` or `生成历史版本成功`.

## Coordinate Conversion

When clicking an element inside the nested WOS4 iframe with `click_at_xy`, convert inner-frame coordinates to top-page coordinates:

```javascript
const outerR = outer.getBoundingClientRect();
const innerR = inner.getBoundingClientRect();
const r = el.getBoundingClientRect();
return {
  x: outerR.x + innerR.x + r.x,
  y: outerR.y + innerR.y + r.y,
  w: r.width,
  h: r.height
};
```

Click:

```python
click_at_xy(rect['x'] + rect['w']/2, rect['y'] + rect['h']/2)
```

## Model List Example

Click `管控单元建模 / 测试` and wait for model rows:

```python
group = '\u6d4b\u8bd5'
grect = js("""
const label = '__GROUP__';
const outer = Array.from(document.querySelectorAll('iframe')).find(f => f.src.includes('/public/') && f.getBoundingClientRect().width > 0);
const outerR = outer.getBoundingClientRect();
const inner = outer.contentWindow.document.querySelector('iframe');
const innerR = inner.getBoundingClientRect();
const doc = inner.contentWindow.document;
const el = Array.from(doc.querySelectorAll('span,div'))
  .find(e => (e.innerText || '').trim() === label || e.getAttribute('title') === label);
const r = el.getBoundingClientRect();
return {x:outerR.x+innerR.x+r.x, y:outerR.y+innerR.y+r.y, w:r.width, h:r.height};
""".replace('__GROUP__', group))
click_at_xy(grect['x'] + grect['w']/2, grect['y'] + grect['h']/2)
```

Verified result in `测试` group:

```text
收球筒
盛云_孙宇飞_假数据设备模型_0612
```

## DOM Click for Off-Screen Buttons

Current Chrome viewport may be around `929x917`. WOS4 table actions such as `版本管理` can be beyond the visible right edge. Coordinate click will fail when `x > viewport width`.

Use DOM click only after row and action are uniquely identified:

```python
model = '\u6536\u7403\u7b52'
action = '\u7248\u672c\u7ba1\u7406'
row_text = js("""
const model = '__MODEL__';
const action = '__ACTION__';
const outer = Array.from(document.querySelectorAll('iframe')).find(f => f.src.includes('/public/') && f.getBoundingClientRect().width > 0);
const inner = outer.contentWindow.document.querySelector('iframe');
const doc = inner.contentWindow.document;
const row = Array.from(doc.querySelectorAll('tr,.el-table__row'))
  .find(el => (el.innerText || '').includes(model) && (el.innerText || '').includes(action));
if (!row) throw new Error('missing row');
const el = Array.from(row.querySelectorAll('button,span,a,div'))
  .find(e => (e.innerText || '').trim() === action);
if (!el) throw new Error('missing action');
el.click();
return row.innerText;
""".replace('__MODEL__', model).replace('__ACTION__', action))
```

This verified `收球筒` version management:

```text
版本: 1
时间: 2026-5-6 16:22:48
```

## Known Limits

- If an ASCII temp file contains raw Chinese, PowerShell will write `????`; use Unicode escapes or load UTF-8 config/docs at runtime.
- `js()` does not support extra positional args. Embed JSON with `json.dumps(..., ensure_ascii=True)`.
- WOS4 modal close buttons may exist with zero visible rect; DOM click and coordinate click can fail. Prefer one action per fresh tab/session until a reliable close strategy is verified.
- Screenshots can show success even when a text readiness predicate fails; inspect `capture_screenshot()` and recursive iframe tree before declaring failure.
- Do not use `browser-harness` to bypass the WOS4 human navigation rule by directly opening dynamic client URLs.

