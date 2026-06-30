import json
import time
from pathlib import Path

ensure_real_tab()

def click_card(title):
    payload = json.dumps(title, ensure_ascii=True)
    return js(r"""
(() => {
  const title = __TITLE__;
  const visible = el => {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.display !== "none" && s.visibility !== "hidden";
  };
  const el = Array.from(document.querySelectorAll(".data-item.card-item,[title]"))
    .filter(visible)
    .find(e => e.getAttribute("title") === title || ((e.innerText || "").trim() === title));
  if (!el) return {ok:false, error:"card missing", title, text:(document.body.innerText || "").slice(0,1200)};
  el.dispatchEvent(new MouseEvent("mousedown", {bubbles:true, cancelable:true, view:window}));
  el.dispatchEvent(new MouseEvent("mouseup", {bubbles:true, cancelable:true, view:window}));
  el.click();
  el.dispatchEvent(new MouseEvent("dblclick", {bubbles:true, cancelable:true, view:window}));
  return {ok:true, title, text:(el.innerText || "").trim()};
})()
""".replace("__TITLE__", payload))

def click_text_exact(text, require_contains=None):
    payload = json.dumps(text, ensure_ascii=True)
    req = json.dumps(require_contains or "", ensure_ascii=True)
    return js(r"""
(() => {
  const target = __TEXT__;
  const req = __REQ__;
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
  for (const rec of allDocs(window, "top", [])) {
    const body = rec.doc.body ? (rec.doc.body.innerText || "") : "";
    if (req && !body.includes(req)) continue;
    const nodes = Array.from(rec.doc.querySelectorAll("button,.el-button,a,span,div,td"))
      .filter(visible)
      .map(e => {
        const r = e.getBoundingClientRect();
        return {e, text:(e.innerText || e.textContent || "").trim(), area:r.width*r.height};
      })
      .filter(x => x.text === target)
      .sort((a,b) => a.area - b.area);
    if (nodes[0]) {
      nodes[0].e.scrollIntoView({block:"center", inline:"center"});
      nodes[0].e.click();
      return {ok:true, path:rec.path, clicked:nodes[0].text};
    }
  }
  return {ok:false, error:"text missing", target};
})()
""".replace("__TEXT__", payload).replace("__REQ__", req))

steps = []
steps.append({"openConfig": click_card("\u7ec4\u6001\u7cfb\u7edf\u5ba2\u6237\u7aef1")})
time.sleep(8)
steps.append({"enterProject": click_text_exact("\u76db\u4e91_\u5b59\u5b87\u98de_Palimpsest\u5de5\u7a0b_0626")})
time.sleep(8)
steps.append({"instanceMenu": click_text_exact("\u7ba1\u63a7\u5355\u5143\u5b9e\u4f8b\u914d\u7f6e")})
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
      text: doc.body ? (doc.body.innerText || "").slice(0,3000) : "",
      buttons: Array.from(doc.querySelectorAll("button,.el-button,a")).filter(visible).map(b => (b.innerText || b.textContent || "").trim()).filter(Boolean).slice(0,80),
      rows: Array.from(doc.querySelectorAll("tr,.el-table__row")).map(r => (r.innerText || r.textContent || "").trim()).filter(Boolean).slice(0,40)
    }];
    Array.from(doc.querySelectorAll("iframe")).forEach((f,i) => out = out.concat(walk(f.contentWindow, path + "." + i)));
    return out;
  }
  return walk(window, "top");
})()
""")

out = {"steps": steps, "probe": probe}
Path("wos4-artifacts/snapshots/pal_relogin_open_config_project.json").write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
print(json.dumps({
    "steps": steps,
    "frames": [{"path": f.get("path"), "text": (f.get("text") or "")[:220], "buttons": (f.get("buttons") or [])[:16], "rows": (f.get("rows") or [])[:6]} for f in probe]
}, ensure_ascii=True, indent=2))
