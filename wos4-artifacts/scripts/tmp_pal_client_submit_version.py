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
  const submitText = "\u63d0\u4ea4\u7248\u672c";
  const docs = allDocs(window, "top", []);
  const rec = docs.find(x => {
    const t = x.doc.body ? (x.doc.body.innerText || "") : "";
    return t.includes("Palimpsest") && t.includes(submitText) && !t.includes("PalimpsestMenu_18");
  });
  if (!rec) return {ok:false, error:"client list doc missing", docs:docs.map(x => ({path:x.path, text:(x.doc.body && x.doc.body.innerText || "").slice(0,800)}))};
  const doc = rec.doc;
  const textOf = el => (el.innerText || el.textContent || "").trim();
  const row = Array.from(doc.querySelectorAll("tr,.el-table__row,tbody tr")).find(r => textOf(r).includes("Palimpsest"));
  if (!row) return {ok:false, error:"row missing", path:rec.path, text:(doc.body.innerText || "").slice(0,1200)};
  const btn = Array.from(row.querySelectorAll("button,.el-button,a,span")).filter(visible).find(e => textOf(e).includes(submitText));
  if (!btn) return {ok:false, error:"submit button missing", path:rec.path, rowText:textOf(row)};
  btn.click();
  return {ok:true, path:rec.path, clicked:textOf(btn), rowText:textOf(row)};
})()
""")

time.sleep(1)
confirm = js(r"""
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
  const dialogs = [];
  for (const x of allDocs(window, "top", [])) {
    for (const box of Array.from(x.doc.querySelectorAll(".el-message-box,.el-dialog,[role='dialog']")).filter(visible)) {
      dialogs.push({path:x.path, doc:x.doc, box, text:(box.innerText || box.textContent || "").trim()});
    }
  }
  const target = dialogs.find(d => d.text.includes("\u63d0\u4ea4") || d.text.includes("\u7248\u672c")) || dialogs[0];
  if (!target) return {ok:false, error:"submit dialog missing", dialogs:dialogs.map(d => ({path:d.path, text:d.text.slice(0,800)}))};
  const value = "pal-client-rebind-pages-20260629";
  const inputs = Array.from(target.box.querySelectorAll("textarea,input")).filter(visible);
  for (const el of inputs) {
    const desc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), "value");
    if (desc && desc.set) desc.set.call(el, value); else el.value = value;
    el.dispatchEvent(new Event("input", {bubbles:true}));
    el.dispatchEvent(new Event("change", {bubbles:true}));
  }
  const okText = "\u786e\u5b9a";
  const okText2 = "\u786e\u8ba4";
  const btn = Array.from(target.box.querySelectorAll("button,.el-button")).filter(visible)
    .find(b => {
      const t = (b.innerText || b.textContent || "").trim();
      return t.includes(okText) || t.includes(okText2) || t.includes("\u63d0\u4ea4");
    });
  if (!btn) return {ok:false, error:"confirm missing", path:target.path, dialogText:target.text, inputCount:inputs.length};
  btn.click();
  return {ok:true, path:target.path, clicked:(btn.innerText || btn.textContent || "").trim(), inputCount:inputs.length, dialogText:target.text.slice(0,1000)};
})()
""")

time.sleep(15)
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
      dialogs: Array.from(doc.querySelectorAll(".el-message-box,.el-dialog,[role='dialog']")).filter(visible).map(d => (d.innerText || d.textContent || "").trim().slice(0,1000)),
      messages: Array.from(doc.querySelectorAll(".el-message,.el-notification,.el-loading-mask")).filter(visible).map(d => (d.innerText || d.textContent || d.className || "").trim().slice(0,500)),
      buttons: Array.from(doc.querySelectorAll("button,.el-button,a")).filter(visible).map(b => (b.innerText || b.textContent || "").trim()).filter(Boolean).slice(0,80)
    }];
    Array.from(doc.querySelectorAll("iframe")).forEach((f,i) => out = out.concat(walk(f.contentWindow, path + "." + i)));
    return out;
  }
  return walk(window, "top");
})()
""")

out = {"click": click, "confirm": confirm, "probe": probe}
Path("wos4-artifacts/snapshots/pal_client_submit_version_result.json").write_text(
    json.dumps(out, ensure_ascii=False, indent=2),
    encoding="utf-8",
)
print(json.dumps({
    "click": click,
    "confirm": confirm,
    "frames": [{"path": f.get("path"), "messages": f.get("messages"), "dialogs": f.get("dialogs"), "text": (f.get("text") or "")[:180], "buttons": (f.get("buttons") or [])[:14]} for f in probe]
}, ensure_ascii=True, indent=2))
