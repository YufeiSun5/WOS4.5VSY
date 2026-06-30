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
  const updateText = "\u66f4\u65b0\u7248\u672c";
  const rec = allDocs(window, "top", []).find(x => {
    const t = x.doc.body ? (x.doc.body.innerText || "") : "";
    return t.includes("Palimpsest") && t.includes(updateText) && !t.includes("PalimpsestMenu_18");
  });
  if (!rec) return {ok:false, error:"doc missing"};
  const doc = rec.doc;
  const textOf = el => (el.innerText || el.textContent || "").trim();
  const row = Array.from(doc.querySelectorAll("tr,.el-table__row,tbody tr")).find(r => textOf(r).includes("Palimpsest"));
  if (row) {
    const cb = row.querySelector(".el-checkbox,input[type='checkbox'],.el-checkbox__input");
    if (cb) {
      const checked = !!(cb.checked || String(cb.className || "").includes("is-checked") || (cb.closest(".el-checkbox") && String(cb.closest(".el-checkbox").className).includes("is-checked")));
      if (!checked) cb.click();
    }
  }
  const buttons = Array.from(doc.querySelectorAll("button,.el-button,a")).filter(visible).filter(b => textOf(b) === updateText);
  const btn = buttons[0];
  if (!btn) return {ok:false, error:"top update missing", buttons:Array.from(doc.querySelectorAll("button,.el-button,a")).filter(visible).map(textOf).filter(Boolean)};
  btn.click();
  return {ok:true, path:rec.path, clicked:textOf(btn), updateButtonCount:buttons.length, rowText:row ? textOf(row) : ""};
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
  const target = dialogs.find(d => d.text.includes("\u66f4\u65b0")) || dialogs[0];
  if (!target) return {ok:false, error:"dialog missing", dialogs:dialogs.map(d => ({path:d.path, text:d.text.slice(0,800)}))};
  const btn = Array.from(target.box.querySelectorAll("button,.el-button")).filter(visible).find(b => ((b.innerText || b.textContent || "").trim()).includes(okText));
  if (!btn) return {ok:false, error:"ok missing", path:target.path, dialogText:target.text};
  btn.click();
  return {ok:true, path:target.path, clicked:(btn.innerText || btn.textContent || "").trim(), dialogText:target.text.slice(0,800)};
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
  return {
    topText:(document.body.innerText || "").slice(0,1200),
    topMessages:Array.from(document.querySelectorAll(".el-message,.el-notification,.el-loading-mask")).filter(visible).map(d => (d.innerText || d.textContent || d.className || "").trim().slice(0,500))
  };
})()
""")
out = {"click":click, "confirm":confirm, "probe":probe}
Path("wos4-artifacts/snapshots/pal_client_top_update_result.json").write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
print(json.dumps(out, ensure_ascii=True, indent=2))
