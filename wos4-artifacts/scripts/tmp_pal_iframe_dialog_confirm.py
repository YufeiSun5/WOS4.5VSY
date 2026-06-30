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
  const dialogs = [];
  for (const x of docs) {
    const boxes = Array.from(x.doc.querySelectorAll(".el-message-box,.el-dialog,[role='dialog']"))
      .filter(visible);
    for (const box of boxes) {
      dialogs.push({path:x.path, doc:x.doc, box, text:(box.innerText || box.textContent || "").trim()});
    }
  }
  const target = dialogs.find(d => d.text.includes("\u63d0\u4ea4") || d.text.includes("\u7248\u672c") || d.text.includes("\u786e\u5b9a")) || dialogs[0];
  if (!target) {
    return {ok:false, error:"dialog missing", docs:docs.map(x => ({path:x.path, text:(x.doc.body && x.doc.body.innerText || "").slice(0,1000)}))};
  }
  const value = "pal-client-rebind-pages-20260629";
  const inputs = Array.from(target.box.querySelectorAll("textarea,input")).filter(visible);
  for (const el of inputs) {
    const desc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), "value");
    if (desc && desc.set) desc.set.call(el, value); else el.value = value;
    el.dispatchEvent(new Event("input", {bubbles:true}));
    el.dispatchEvent(new Event("change", {bubbles:true}));
  }
  const textOf = el => (el.innerText || el.textContent || "").trim();
  const ok1 = "\u786e\u5b9a";
  const ok2 = "\u786e\u8ba4";
  const buttons = Array.from(target.box.querySelectorAll("button,.el-button")).filter(visible);
  const btn = buttons.find(b => textOf(b) === ok1 || textOf(b) === ok2 || textOf(b).includes(ok1) || textOf(b).includes(ok2));
  if (!btn) {
    return {ok:false, error:"confirm button missing", path:target.path, dialogText:target.text, buttons:buttons.map(textOf), inputCount:inputs.length};
  }
  btn.click();
  return {ok:true, path:target.path, dialogText:target.text.slice(0,1000), clicked:textOf(btn), inputCount:inputs.length};
})()
""")

time.sleep(10)
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

out = {"confirm": result, "probe": probe}
Path("wos4-artifacts/snapshots/pal_client_submit_dialog_confirm_result.json").write_text(
    json.dumps(out, ensure_ascii=False, indent=2),
    encoding="utf-8",
)
print(json.dumps({
    "confirm": result,
    "frames": [{"path": f.get("path"), "dialogs": f.get("dialogs"), "messages": f.get("messages"), "text": (f.get("text") or "")[:180], "buttons": (f.get("buttons") or [])[:14]} for f in probe]
}, ensure_ascii=True, indent=2))
