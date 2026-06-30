import json
import time
from pathlib import Path

ensure_real_tab()

def click_refresh():
    return js(r"""
(() => {
  const visible = el => {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    const s = el.ownerDocument.defaultView.getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.display !== "none" && s.visibility !== "hidden";
  };
  function allDocs(win, path, acc) {
    let doc;
    try { doc = win.document; } catch(e) { return acc; }
    acc.push({doc, path});
    Array.from(doc.querySelectorAll("iframe")).forEach((f,i) => allDocs(f.contentWindow, path + "." + i, acc));
    return acc;
  }
  const refresh = "\u5237\u65b0";
  for (const rec of allDocs(window, "top", [])) {
    const btn = Array.from(rec.doc.querySelectorAll("button,.el-button,a")).filter(visible)
      .find(b => ((b.innerText || b.textContent || "").trim()) === refresh);
    if (btn) { btn.click(); return {ok:true, path:rec.path}; }
  }
  return {ok:false};
})()
""")

events = [{"refresh": click_refresh()}]
target = "\u76db\u4e91_\u5b59\u5b87\u98de_Palimpsest\u5de5\u7a0b_0626"
for i in range(12):
    time.sleep(3)
    state = js(r"""
(() => {
  const visible = el => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.display !== "none" && s.visibility !== "hidden";
  };
  function walk(win, path) {
    let doc;
    try { doc = win.document; } catch(e) { return [{path, error:String(e)}]; }
    let out = [{
      path,
      text: doc.body ? (doc.body.innerText || "").slice(0,3500) : "",
      rows: Array.from(doc.querySelectorAll("tr,.el-table__row")).map(r => (r.innerText || r.textContent || "").trim()).filter(Boolean).slice(0,60),
      buttons: Array.from(doc.querySelectorAll("button,.el-button,a")).filter(visible).map(b => (b.innerText || b.textContent || "").trim()).filter(Boolean).slice(0,60)
    }];
    Array.from(doc.querySelectorAll("iframe")).forEach((f,i) => out = out.concat(walk(f.contentWindow, path + "." + i)));
    return out;
  }
  return walk(window, "top");
})()
""")
    events.append({"poll": i, "state": state})
    if any(target in (f.get("text") or "") for f in state):
        break

Path("wos4-artifacts/snapshots/pal_config_wait_projects.json").write_text(json.dumps(events, ensure_ascii=False, indent=2), encoding="utf-8")
last = events[-1]["state"] if "state" in events[-1] else []
print(json.dumps({
    "refresh": events[0],
    "polls": len(events)-1,
    "found": any(target in (f.get("text") or "") for f in last),
    "frames": [{"path": f.get("path"), "text": (f.get("text") or "")[:240], "rows": (f.get("rows") or [])[:8], "buttons": (f.get("buttons") or [])[:12]} for f in last]
}, ensure_ascii=True, indent=2))
