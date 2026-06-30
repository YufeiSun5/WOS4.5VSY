import json
import time
from pathlib import Path

ensure_real_tab()
result = js(r"""
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
  const label = "PalimpsestL1_0626R2";
  const rec = allDocs(window, "top", []).find(x => (x.doc.body && x.doc.body.innerText || "").includes(label));
  if (!rec) return {ok:false, error:"doc missing"};
  const doc = rec.doc;
  const textOf = el => (el.innerText || el.textContent || "").trim();
  const nodes = Array.from(doc.querySelectorAll(".el-tree-node__label,span,div"))
    .filter(visible)
    .map(e => {
      const r = e.getBoundingClientRect();
      return {e, text:textOf(e), area:r.width*r.height, x:r.x, y:r.y, w:r.width, h:r.height};
    })
    .filter(x => x.text === label)
    .sort((a,b) => a.area - b.area);
  const node = nodes[0];
  if (!node) return {ok:false, error:"node missing", path:rec.path, candidates:nodes.length, text:(doc.body.innerText || "").slice(0,1200)};
  node.e.click();
  return {ok:true, path:rec.path, clicked:node.text, rect:{x:node.x,y:node.y,w:node.w,h:node.h}};
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
      buttons: Array.from(doc.querySelectorAll("button,.el-button,a")).filter(visible).map(b => (b.innerText || b.textContent || "").trim()).filter(Boolean).slice(0,120),
      rows: Array.from(doc.querySelectorAll("tr,.el-table__row")).map(r => (r.innerText || r.textContent || "").trim()).filter(Boolean).slice(0,60)
    }];
    Array.from(doc.querySelectorAll("iframe")).forEach((f,i) => out = out.concat(walk(f.contentWindow, path + "." + i)));
    return out;
  }
  return walk(window, "top");
})()
""")
out = {"click":result, "probe":probe}
Path("wos4-artifacts/snapshots/pal_select_spacetime_node_result.json").write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
print(json.dumps({
    "click": result,
    "frames": [{"path": f.get("path"), "text": (f.get("text") or "")[:240], "buttons": (f.get("buttons") or [])[:18], "rows": (f.get("rows") or [])[:10]} for f in probe]
}, ensure_ascii=True, indent=2))
