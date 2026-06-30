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
  const docs = allDocs(window, "top", []);
  const target = docs.find(x => {
    const t = x.doc.body ? (x.doc.body.innerText || "") : "";
    return t.includes("PalimpsestMenu_18") && t.includes("PalimpsestContent_82") && t.includes("PalimpsestExpandTable_82_Demo");
  });
  if (!target) return {ok:false, error:"screen list doc missing", docs:docs.map(x => ({path:x.path, text:(x.doc.body && x.doc.body.innerText || "").slice(0,500)}))};
  const doc = target.doc;
  const textOf = el => (el.innerText || el.textContent || "").trim();
  const buttons = Array.from(doc.querySelectorAll("button,.el-button,a")).filter(visible).map(b => ({text:textOf(b), cls:String(b.className || "")}));
  const el = Array.from(doc.querySelectorAll("button,.el-button,a"))
    .filter(visible)
    .find(e => textOf(e).startsWith("<") && textOf(e).includes("Palimpsest"));
  if (!el) return {ok:false, error:"return button missing", path:target.path, buttons};
  el.scrollIntoView({block:"center", inline:"center"});
  el.dispatchEvent(new MouseEvent("mousedown", {bubbles:true, cancelable:true, view:doc.defaultView}));
  el.dispatchEvent(new MouseEvent("mouseup", {bubbles:true, cancelable:true, view:doc.defaultView}));
  el.click();
  return {ok:true, path:target.path, clickedText:textOf(el), buttons};
})()
""")
time.sleep(3)
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
      text: doc.body ? (doc.body.innerText || "").slice(0,2500) : "",
      buttons: Array.from(doc.querySelectorAll("button,.el-button,a")).filter(visible).map(b => (b.innerText || b.textContent || "").trim()).filter(Boolean).slice(0,80)
    }];
    Array.from(doc.querySelectorAll("iframe")).forEach((f,i) => out = out.concat(walk(f.contentWindow, path + "." + i)));
    return out;
  }
  return walk(window, "top");
})()
""")
out = {"click": result, "probe": probe}
Path("wos4-artifacts/snapshots/pal_config_return_only_result.json").write_text(
    json.dumps(out, ensure_ascii=False, indent=2),
    encoding="utf-8",
)
print(json.dumps({
    "click": result,
    "frames": [{"path": f.get("path"), "text": (f.get("text") or "")[:180], "buttons": (f.get("buttons") or [])[:14]} for f in probe]
}, ensure_ascii=True, indent=2))
