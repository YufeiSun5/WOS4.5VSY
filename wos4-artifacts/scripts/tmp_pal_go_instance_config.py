import json
import time
from pathlib import Path

ensure_real_tab()
click = js(r"""
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
    Array.from(doc.querySelectorAll("iframe")).forEach((f, i) => allDocs(f.contentWindow, path + "." + i, acc));
    return acc;
  }
  const label = "\u7ba1\u63a7\u5355\u5143\u5b9e\u4f8b\u914d\u7f6e";
  const rec = allDocs(window, "top", []).find(x => (x.doc.body && x.doc.body.innerText || "").includes(label));
  if (!rec) return {ok:false, error:"config doc missing"};
  const doc = rec.doc;
  const textOf = el => (el.innerText || el.textContent || "").trim();
  const candidates = Array.from(doc.querySelectorAll("li,div,span,a,button,.el-menu-item"))
    .filter(visible)
    .map(e => {
      const r = e.getBoundingClientRect();
      return {e, text:textOf(e), area:r.width * r.height, x:r.x, y:r.y, w:r.width, h:r.height};
    })
    .filter(x => x.text === label)
    .sort((a, b) => a.area - b.area);
  const el = candidates[0] && candidates[0].e;
  if (!el) return {ok:false, error:"menu missing", path:rec.path, text:(doc.body.innerText || "").slice(0,1000)};
  el.click();
  return {ok:true, path:rec.path, clicked:textOf(el)};
})()
""")
time.sleep(5)
probe = js(r"""
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
      buttons: Array.from(doc.querySelectorAll("button,.el-button,a")).filter(visible).map(b => (b.innerText || b.textContent || "").trim()).filter(Boolean).slice(0,100),
      rows: Array.from(doc.querySelectorAll("tr,.el-table__row")).map(r => (r.innerText || r.textContent || "").trim()).filter(Boolean).slice(0,40)
    }];
    Array.from(doc.querySelectorAll("iframe")).forEach((f,i) => out = out.concat(walk(f.contentWindow, path + "." + i)));
    return out;
  }
  return walk(window, "top");
})()
""")
out = {"click": click, "probe": probe}
Path("wos4-artifacts/snapshots/pal_go_instance_config_result.json").write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
print(json.dumps({
    "click": click,
    "frames": [{"path": f.get("path"), "text": (f.get("text") or "")[:240], "buttons": (f.get("buttons") or [])[:16], "rows": (f.get("rows") or [])[:5]} for f in probe]
}, ensure_ascii=True, indent=2))
