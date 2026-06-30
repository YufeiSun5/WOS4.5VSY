import configparser
import json
import time
from pathlib import Path

ensure_real_tab()

parser = configparser.ConfigParser()
parser.read(r"D:\DEV_D\WOS4.5\wos4-artifacts\config\wos4.local.ini", encoding="utf-8")
base = parser["wos4"]
account = "sun_yufei"
section = "wos4.account." + account
cfg = parser[section] if parser.has_section(section) else parser["wos4"]

url = base.get("url", "").strip()
if not url:
    raise RuntimeError("missing wos4 url")

new_tab(url)
wait(2)

state1 = page_info()
login_present = js(r"""
(() => {
  return {
    href: String(location.href),
    hasUser: !!document.querySelector("#desktop-login-input-name"),
    hasPass: !!document.querySelector("#desktop-login-input-password"),
    hasBtn: !!document.querySelector("#desktop-login-btn"),
    text: (document.body.innerText || "").slice(0, 800)
  };
})()
""")

clicked = False
if login_present.get("hasUser") and login_present.get("hasPass"):
    payload = json.dumps({"user": cfg.get("username", ""), "pass": cfg.get("password", "")}, ensure_ascii=True)
    js(r"""
(() => {
  const payload = __PAYLOAD__;
  function setValue(selector, value) {
    const el = document.querySelector(selector);
    if (!el) throw new Error("missing " + selector);
    const desc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), "value");
    if (desc && desc.set) desc.set.call(el, value); else el.value = value;
    el.dispatchEvent(new Event("input", {bubbles:true}));
    el.dispatchEvent(new Event("change", {bubbles:true}));
    el.dispatchEvent(new Event("blur", {bubbles:true}));
  }
  setValue("#desktop-login-input-name", payload.user);
  setValue("#desktop-login-input-password", payload.pass);
  return true;
})()
""".replace("__PAYLOAD__", payload))
    rect = js(r"""
(() => {
  const b = document.querySelector("#desktop-login-btn");
  const r = b.getBoundingClientRect();
  return {x:r.x, y:r.y, w:r.width, h:r.height};
})()
""")
    click_at_xy(rect["x"] + rect["w"] / 2, rect["y"] + rect["h"] / 2)
    clicked = True

deadline = time.time() + 45
observed = []
while time.time() < deadline:
    wait(1)
    st = js(r"""
(() => {
  const visible = el => {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.display !== "none" && s.visibility !== "hidden";
  };
  const dialogs = Array.from(document.querySelectorAll(".el-message-box,.el-dialog,[role='dialog']"))
    .filter(visible)
    .map(d => ({
      text:(d.innerText || d.textContent || "").trim().slice(0,800),
      buttons:Array.from(d.querySelectorAll("button,.el-button")).filter(visible).map(b => (b.innerText || b.textContent || "").trim()).filter(Boolean)
    }));
  return {
    href: String(location.href),
    hasLogin: !!document.querySelector("#desktop-login-input-name"),
    hasMain: String(location.href).includes("#/main"),
    text: (document.body.innerText || "").slice(0,1000),
    dialogs
  };
})()
""")
    observed.append(st)
    if st.get("dialogs"):
        break
    if st.get("hasMain"):
        break

out = {
    "clickedLogin": clicked,
    "initial": state1,
    "loginPresent": login_present,
    "final": observed[-1] if observed else None,
    "observedCount": len(observed),
}
Path("wos4-artifacts/snapshots/wos4_relogin_slot1_result.json").write_text(
    json.dumps(out, ensure_ascii=False, indent=2),
    encoding="utf-8",
)
print(json.dumps({
    "clickedLogin": clicked,
    "finalHref": (observed[-1] if observed else {}).get("href"),
    "hasMain": (observed[-1] if observed else {}).get("hasMain"),
    "dialogs": (observed[-1] if observed else {}).get("dialogs"),
    "textHead": ((observed[-1] if observed else {}).get("text") or "")[:220],
}, ensure_ascii=True, indent=2))
