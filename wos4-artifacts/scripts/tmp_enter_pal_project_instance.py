import json
import time
from pathlib import Path

ensure_real_tab()

def click_project_enter():
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
  const target = "\u76db\u4e91_\u5b59\u5b87\u98de_Palimpsest\u5de5\u7a0b_0626";
  const enter = "\u8fdb\u5165\u5de5\u7a0b";
  for (const rec of allDocs(window, "top", [])) {
    const row = Array.from(rec.doc.querySelectorAll("tr,.el-table__row,tbody tr"))
      .find(r => (r.innerText || r.textContent || "").includes(target));
    if (row) {
      const btn = Array.from(row.querySelectorAll("button,.el-button,a,span")).filter(visible)
        .find(b => ((b.innerText || b.textContent || "").trim()).includes(enter));
      if (btn) { btn.click(); return {ok:true, path:rec.path, clicked:enter, row:(row.innerText || "").slice(0,800)}; }
    }
  }
  return {ok:false, error:"project row missing"};
})()
""")

def click_menu(label):
    payload = json.dumps(label, ensure_ascii=True)
    return js(r"""
(() => {
  const label = __LABEL__;
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
  for (const rec of allDocs(window, "top", [])) {
    const nodes = Array.from(rec.doc.querySelectorAll("li,div,span,a,button,.el-menu-item"))
      .filter(visible)
      .map(e => {
        const r = e.getBoundingClientRect();
        return {e, text:(e.innerText || e.textContent || "").trim(), area:r.width*r.height};
      })
      .filter(x => x.text === label)
      .sort((a,b) => a.area - b.area);
    if (nodes[0]) { nodes[0].e.click(); return {ok:true, path:rec.path, clicked:nodes[0].text}; }
  }
  return {ok:false, error:"menu missing", label};
})()
""".replace("__LABEL__", payload))

steps = [{"enter": click_project_enter()}]
time.sleep(8)
steps.append({"menu": click_menu("\u7ba1\u63a7\u5355\u5143\u5b9e\u4f8b\u914d\u7f6e")})
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
      rows: Array.from(doc.querySelectorAll("tr,.el-table__row")).map(r => (r.innerText || r.textContent || "").trim()).filter(Boolean).slice(0,60),
      buttons: Array.from(doc.querySelectorAll("button,.el-button,a")).filter(visible).map(b => (b.innerText || b.textContent || "").trim()).filter(Boolean).slice(0,100)
    }];
    Array.from(doc.querySelectorAll("iframe")).forEach((f,i) => out = out.concat(walk(f.contentWindow, path + "." + i)));
    return out;
  }
  return walk(window, "top");
})()
""")

out = {"steps":steps, "probe":probe}
Path("wos4-artifacts/snapshots/pal_enter_project_instance_result.json").write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
print(json.dumps({
    "steps": steps,
    "frames": [{"path": f.get("path"), "text": (f.get("text") or "")[:240], "buttons": (f.get("buttons") or [])[:18], "rows": (f.get("rows") or [])[:10]} for f in probe]
}, ensure_ascii=True, indent=2))
