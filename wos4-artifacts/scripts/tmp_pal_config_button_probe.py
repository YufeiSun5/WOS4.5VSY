import json
from pathlib import Path

ensure_real_tab()
out = js(r"""
(() => {
  const visible = el => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.display !== "none" && s.visibility !== "hidden";
  };
  const outer = Array.from(document.querySelectorAll("iframe")).find(f => {
    try { return f.contentWindow.document.body.innerText.includes("KingFusion4.5"); } catch(e) { return false; }
  });
  const inner = outer && outer.contentWindow.document.querySelector("iframe");
  const doc = inner ? inner.contentWindow.document : (outer ? outer.contentWindow.document : document);
  const controls = Array.from(doc.querySelectorAll("button,.el-button,a,span,div"))
    .filter(visible)
    .map((el, idx) => {
      const r = el.getBoundingClientRect();
      const txt = (el.innerText || el.textContent || "").trim();
      return {
        idx,
        tag: el.tagName,
        cls: String(el.className || ""),
        text: txt.slice(0, 120),
        x: Math.round(r.x),
        y: Math.round(r.y),
        w: Math.round(r.width),
        h: Math.round(r.height),
        html: el.outerHTML.slice(0, 500)
      };
    })
    .filter(x => x.text || x.cls.includes("button"))
    .slice(0, 250);
  return {href: String(location.href), bodyText: doc.body.innerText.slice(0, 3000), controls};
})()
""")
Path("wos4-artifacts/snapshots/pal_config_button_probe.json").write_text(
    json.dumps(out, ensure_ascii=False, indent=2),
    encoding="utf-8",
)
print(json.dumps({
    "count": len(out["controls"]),
    "interesting": [x for x in out["controls"] if "返回" in x["text"] or "更新" in x["text"] or "提交" in x["text"]][:30]
}, ensure_ascii=True, indent=2))
