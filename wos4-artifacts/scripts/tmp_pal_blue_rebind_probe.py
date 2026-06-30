import json
import time
from pathlib import Path

ensure_real_tab()
out = {"ts": time.time(), "pageInfo": page_info()}
out["state"] = js(r"""
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
      text: (el.innerText || el.textContent || "").trim().slice(0, 1200),
      buttons: Array.from(el.querySelectorAll("button,.el-button"))
        .filter(visible)
        .map(b => (b.innerText || b.textContent || "").trim()).filter(Boolean)
    }));
  function walk(win, path) {
    let doc;
    try { doc = win.document; } catch(e) { return [{path, error:String(e), href:""}]; }
    const buttons = Array.from(doc.querySelectorAll("button,.el-button,a"))
      .filter(visible)
      .map(b => (b.innerText || b.textContent || "").trim())
      .filter(Boolean)
      .slice(0, 120);
    let rows = Array.from(doc.querySelectorAll("tr,.el-table__row"))
      .map(r => (r.innerText || r.textContent || "").trim())
      .filter(Boolean)
      .slice(0, 30);
    let out = [{
      path,
      href: String(win.location.href),
      text: doc.body ? (doc.body.innerText || "").slice(0, 4000) : "",
      buttons,
      rows,
      frameCount: doc.querySelectorAll("iframe").length
    }];
    Array.from(doc.querySelectorAll("iframe")).forEach((f, i) => {
      out = out.concat(walk(f.contentWindow, path + "." + i));
    });
    return out;
  }
  return {
    topHref: String(location.href),
    topText: (document.body.innerText || "").slice(0, 3000),
    dialogs,
    frames: walk(window, "top")
  };
})()
""")

Path("wos4-artifacts/snapshots/pal_blue_rebind_current_probe.json").write_text(
    json.dumps(out, ensure_ascii=False, indent=2),
    encoding="utf-8",
)
summary = {
    "url": out["pageInfo"].get("url"),
    "dialogs": out["state"].get("dialogs", []),
    "frames": [
        {
            "path": f.get("path"),
            "text": (f.get("text") or "")[:160],
            "buttons": (f.get("buttons") or [])[:12],
        }
        for f in out["state"].get("frames", [])
    ],
}
print(json.dumps(summary, ensure_ascii=True, indent=2))
