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
  const updateText = "\u66f4\u65b0\u7248\u672c";
  const docRec = docs.find(x => {
    const t = x.doc.body ? (x.doc.body.innerText || "") : "";
    return t.includes("Palimpsest") && t.includes(updateText) && !t.includes("PalimpsestMenu_18");
  });
  if (!docRec) return {ok:false, error:"client list doc missing", docs:docs.map(x => ({path:x.path, text:(x.doc.body && x.doc.body.innerText || "").slice(0,800)}))};
  const doc = docRec.doc;
  const textOf = el => (el.innerText || el.textContent || "").trim();
  const row = Array.from(doc.querySelectorAll("tr,.el-table__row,tbody tr")).find(r => textOf(r).includes("Palimpsest"));
  if (!row) return {ok:false, error:"client row missing", path:docRec.path, text:(doc.body.innerText || "").slice(0,2000)};
  const checkbox = row.querySelector(".el-checkbox,input[type='checkbox'],.el-checkbox__input");
  if (checkbox) {
    const clsBefore = String(checkbox.className || "");
    const checkedBefore = !!(checkbox.checked || clsBefore.includes("is-checked") || (checkbox.closest(".el-checkbox") && String(checkbox.closest(".el-checkbox").className).includes("is-checked")));
    if (!checkedBefore) {
      checkbox.dispatchEvent(new MouseEvent("mousedown", {bubbles:true, cancelable:true, view:doc.defaultView}));
      checkbox.dispatchEvent(new MouseEvent("mouseup", {bubbles:true, cancelable:true, view:doc.defaultView}));
      checkbox.click();
    }
  }
  const rowUpdate = Array.from(row.querySelectorAll("button,.el-button,a,span"))
    .filter(visible)
    .find(e => textOf(e) === updateText || textOf(e).includes(updateText));
  const topUpdate = Array.from(doc.querySelectorAll("button,.el-button,a"))
    .filter(visible)
    .find(e => textOf(e) === updateText);
  const btn = rowUpdate || topUpdate;
  if (!btn) return {ok:false, error:"update button missing", path:docRec.path, rowText:textOf(row)};
  btn.click();
  return {ok:true, path:docRec.path, clicked:textOf(btn), rowText:textOf(row), selected:!!checkbox};
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
  const okText = "\u786e\u5b9a";
  const dialogs = [];
  for (const x of allDocs(window, "top", [])) {
    for (const box of Array.from(x.doc.querySelectorAll(".el-message-box,.el-dialog,[role='dialog']")).filter(visible)) {
      dialogs.push({path:x.path, box, text:(box.innerText || box.textContent || "").trim()});
    }
  }
  const target = dialogs.find(d => d.text.includes("\u66f4\u65b0") || d.text.includes(okText)) || dialogs[0];
  if (!target) return {ok:false, error:"dialog missing", dialogs:[]};
  const btn = Array.from(target.box.querySelectorAll("button,.el-button"))
    .filter(visible)
    .find(b => ((b.innerText || b.textContent || "").trim()).includes(okText));
  if (!btn) return {ok:false, error:"ok missing", path:target.path, dialogText:target.text};
  btn.click();
  return {ok:true, path:target.path, clicked:(btn.innerText || btn.textContent || "").trim(), dialogText:target.text.slice(0,800)};
})()
""")

time.sleep(12)
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

out = {"click": result, "confirm": confirm, "probe": probe}
Path("wos4-artifacts/snapshots/pal_client_select_update_result.json").write_text(
    json.dumps(out, ensure_ascii=False, indent=2),
    encoding="utf-8",
)
print(json.dumps({
    "click": result,
    "confirm": confirm,
    "frames": [{"path": f.get("path"), "messages": f.get("messages"), "dialogs": f.get("dialogs"), "text": (f.get("text") or "")[:180], "buttons": (f.get("buttons") or [])[:14]} for f in probe]
}, ensure_ascii=True, indent=2))
