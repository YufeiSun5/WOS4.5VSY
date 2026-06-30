import json
import time
from pathlib import Path

ensure_real_tab()

def save(name, data):
    Path("wos4-artifacts/snapshots/" + name).write_text(
        json.dumps(data, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

def top_probe():
    return js(r"""
(() => {
  const visible = el => {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.display !== "none" && s.visibility !== "hidden";
  };
  const dialogs = Array.from(document.querySelectorAll(".el-message-box,.el-dialog,[role='dialog']"))
    .filter(visible)
    .map(el => ({
      text: (el.innerText || el.textContent || "").trim().slice(0, 1000),
      buttons: Array.from(el.querySelectorAll("button,.el-button"))
        .filter(visible)
        .map(b => (b.innerText || b.textContent || "").trim()).filter(Boolean)
    }));
  function walk(win, path) {
    let doc;
    try { doc = win.document; } catch(e) { return [{path, error:String(e), href:""}]; }
    let out = [{
      path,
      href: String(win.location.href),
      text: doc.body ? (doc.body.innerText || "").slice(0, 2500) : "",
      buttons: Array.from(doc.querySelectorAll("button,.el-button,a"))
        .filter(visible)
        .map(b => (b.innerText || b.textContent || "").trim()).filter(Boolean).slice(0, 80),
      rows: Array.from(doc.querySelectorAll("tr,.el-table__row"))
        .map(r => (r.innerText || r.textContent || "").trim()).filter(Boolean).slice(0, 30)
    }];
    Array.from(doc.querySelectorAll("iframe")).forEach((f, i) => {
      out = out.concat(walk(f.contentWindow, path + "." + i));
    });
    return out;
  }
  return {dialogs, frames: walk(window, "top")};
})()
""")

def click_in_config_doc(kind):
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
    Array.from(doc.querySelectorAll("iframe")).forEach((f, i) => allDocs(f.contentWindow, path + "." + i, acc));
    return acc;
  }
  const docs = allDocs(window, "top", []);
  const updateText = "\u66f4\u65b0\u7248\u672c";
  const submitText = "\u63d0\u4ea4\u7248\u672c";
  const target = (() => {
    if ("__KIND__" === "return") {
      return docs.find(x => {
        const t = x.doc.body ? (x.doc.body.innerText || "") : "";
        return t.includes("PalimpsestMenu_18") && t.includes("PalimpsestContent_82") && t.includes("PalimpsestExpandTable_82_Demo");
      });
    }
    if ("__KIND__" === "update_version") {
      return docs.find(x => {
        const t = x.doc.body ? (x.doc.body.innerText || "") : "";
        return t.includes("Palimpsest") && t.includes(updateText);
      });
    }
    if ("__KIND__" === "submit_version") {
      return docs.find(x => {
        const t = x.doc.body ? (x.doc.body.innerText || "") : "";
        return t.includes("Palimpsest") && t.includes(submitText);
      });
    }
    return null;
  })();
  if (!target) return {ok:false, error:"target doc missing", docs:docs.map(x => ({path:x.path, text:(x.doc.body && x.doc.body.innerText || "").slice(0,300)}))};
  const doc = target.doc;
  const textOf = el => (el.innerText || el.textContent || "").trim();
  let el = null;
  if ("__KIND__" === "return") {
    el = Array.from(doc.querySelectorAll("button,.el-button,a"))
      .filter(visible)
      .find(e => textOf(e).startsWith("<") && textOf(e).includes("Palimpsest"));
  } else if ("__KIND__" === "update_version") {
    const row = Array.from(doc.querySelectorAll("tr,.el-table__row,tbody tr"))
      .find(r => textOf(r).includes("Palimpsest") && textOf(r).includes(updateText));
    if (row) {
      el = Array.from(row.querySelectorAll("button,.el-button,a,span"))
        .filter(visible)
        .find(e => textOf(e) === updateText || textOf(e).includes(updateText));
    }
  } else if ("__KIND__" === "submit_version") {
    const row = Array.from(doc.querySelectorAll("tr,.el-table__row,tbody tr"))
      .find(r => textOf(r).includes("Palimpsest") && textOf(r).includes(submitText));
    if (row) {
      el = Array.from(row.querySelectorAll("button,.el-button,a,span"))
        .filter(visible)
        .find(e => textOf(e) === submitText || textOf(e).includes(submitText));
    }
  }
  if (!el) {
    return {
      ok:false,
      error:"element missing",
      kind:"__KIND__",
      path:target.path,
      text:(doc.body.innerText || "").slice(0,2500),
      buttons:Array.from(doc.querySelectorAll("button,.el-button,a,span")).filter(visible).map(textOf).filter(Boolean).slice(0,120)
    };
  }
  el.scrollIntoView({block:"center", inline:"center"});
  el.dispatchEvent(new MouseEvent("mousedown", {bubbles:true, cancelable:true, view:doc.defaultView}));
  el.dispatchEvent(new MouseEvent("mouseup", {bubbles:true, cancelable:true, view:doc.defaultView}));
  el.click();
  return {ok:true, kind:"__KIND__", path:target.path, clickedText:textOf(el)};
})()
""".replace("__KIND__", kind))

def click_dialog_positive(note):
    return js(r"""
(() => {
  const visible = el => {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.display !== "none" && s.visibility !== "hidden";
  };
  const boxes = Array.from(document.querySelectorAll(".el-message-box,.el-dialog,[role='dialog']")).filter(visible);
  const buttons = boxes.flatMap(box => Array.from(box.querySelectorAll("button,.el-button")).filter(visible).map(b => ({box, b, text:(b.innerText || b.textContent || "").trim()})));
  const ok1 = "\u786e\u5b9a";
  const ok2 = "\u786e\u8ba4";
  const submit = "\u63d0\u4ea4";
  const update = "\u66f4\u65b0";
  const target = buttons.find(x => [ok1, ok2, submit, update].includes(x.text)) || buttons.find(x => x.text.includes(ok1) || x.text.includes(ok2));
  if (!target) return {ok:false, note:"__NOTE__", dialogs:boxes.map(b => (b.innerText || "").slice(0,800)), buttons:buttons.map(x => x.text)};
  target.b.click();
  return {ok:true, note:"__NOTE__", clicked:target.text, dialogText:(target.box.innerText || "").slice(0,800)};
})()
""".replace("__NOTE__", note))

def fill_submit_dialog():
    return js(r"""
(() => {
  const visible = el => {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.display !== "none" && s.visibility !== "hidden";
  };
  const boxes = Array.from(document.querySelectorAll(".el-message-box,.el-dialog,[role='dialog']")).filter(visible);
  let inputs = boxes.flatMap(box => Array.from(box.querySelectorAll("textarea,input")).filter(visible));
  const value = "pal-client-rebind-pages-20260629";
  for (const el of inputs) {
    const desc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), "value");
    if (desc && desc.set) desc.set.call(el, value); else el.value = value;
    el.dispatchEvent(new Event("input", {bubbles:true}));
    el.dispatchEvent(new Event("change", {bubbles:true}));
  }
  return {ok:true, inputCount:inputs.length, dialogs:boxes.map(b => (b.innerText || "").slice(0,800))};
})()
""")

result = {"start": top_probe()}
save("pal_client_rebind_update_submit_start.json", result["start"])

result["returnClick"] = click_in_config_doc("return")
time.sleep(2)
result["afterReturn"] = top_probe()
save("pal_client_rebind_after_return.json", result["afterReturn"])

result["updateClick"] = click_in_config_doc("update_version")
time.sleep(1)
result["updateDialogBefore"] = top_probe()
result["updateConfirm"] = click_dialog_positive("update")
time.sleep(8)
result["afterUpdate"] = top_probe()
save("pal_client_rebind_after_update.json", result["afterUpdate"])

result["submitClick"] = click_in_config_doc("submit_version")
time.sleep(1)
result["submitDialogBefore"] = top_probe()
result["submitFill"] = fill_submit_dialog()
result["submitConfirm"] = click_dialog_positive("submit")
time.sleep(8)
result["afterSubmit"] = top_probe()

save("pal_client_rebind_update_submit_result.json", result)
print(json.dumps({
    "return": result["returnClick"],
    "update": result["updateClick"],
    "updateConfirm": result["updateConfirm"],
    "submit": result["submitClick"],
    "submitConfirm": result["submitConfirm"],
    "finalDialogs": result["afterSubmit"].get("dialogs", []),
    "finalFrames": [
        {"path": f.get("path"), "text": (f.get("text") or "")[:180], "buttons": (f.get("buttons") or [])[:14]}
        for f in result["afterSubmit"].get("frames", [])
    ]
}, ensure_ascii=True, indent=2))
