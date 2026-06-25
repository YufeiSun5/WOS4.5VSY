---
name: wos4-login
description: 登录 WOS4 / WellinOS4.5 平台。适用于打开、访问、登录 WOS4，或通过 Chrome MCP、Playwright 控制浏览器进入 WOS4 编辑器、预览页、功能开发页面。
---

# WOS4 登录

## 登录地址配置

登录地址必须从本机 `wos4-artifacts/config/wos4.local.ini` 的 `[wos4] url` 读取，或由用户当次明确提供。不要在 skill、脚本或测试里写死真实 WOS4 URL。

登录成功地址通常变为同一 host 下的：

```text
<#/main>
```

## 网络要求

访问 WOS4 时绕过 VPN/代理，优先直连。具体 host、端口和登录路径以 `wos4.local.ini` 为准。

Playwright 启动时使用：

```text
--proxy-server=direct://
```

PowerShell 网络请求如需直连，使用 `-Proxy $null`。

## 账号密码

- 登录前必须先运行 `wos4-artifacts/scripts/wos4-lock.ps1 -Action AcquireAccount` 申请账号锁；没有账号锁不得登录。
- 默认按 `wos4.local.ini` 的 `[wos4] account_order` 分配账号；也可以用 `-Account <账号别名>` 或 `-Session <槽位>` 指定。
- 如果锁脚本返回 `status=blocked` 且 `reason=account_pool_exhausted`，必须明确拒绝继续并发登录，不能重复登录已锁账号。
- 使用锁脚本返回的 `account` 到 `[wos4.account.<account>]` 读取 `username/password`；旧配置没有账号段时才回退 `[wos4] username/password`。
- 不要把密码写进脚本文件、skill、最终回复或日志。
- 可复用脚本应从环境变量 `WOS4_PASS` 读取密码。
- 当前 AI 不再使用 WOS4 账号时，必须运行 `wos4-lock.ps1 -Action ReleaseAccount` 归还账号使用权；异常中断恢复后先查 `Status`，不能直接重复登录。
- 可用 `wos4-lock.ps1 -Action ReleaseOwnerAccounts -Owner <开发人员_AI身份>` 一键归还当前 AI 身份持有且没有对象锁的账号席位。
- 不做定时自动释放账号。开发过程中不能因为时间到了就释放席位，否则其他 AI 重登同一账号会顶掉当前会话。
- 独立 Chrome profile 可以预启动；预启动不认领账号，也不认领 `孙宇飞_test-ai`、`向学智_code-ai` 等 AI 身份。只有 `AcquireAccount -Owner <开发人员_AI身份>` 返回 `status=acquired` 后，才认为该 AI 身份占用了该账号。

## 稳定选择器

```text
用户名输入框：#desktop-login-input-name
密码输入框：#desktop-login-input-password
记住密码：#desktop-login-remember-password
登录按钮：`#desktop-login-btn`，或文本“登录”
```

## 推荐流程

1. 如果需要并发，先用 `wos4-browser-sessions.ps1 -Action Start` 准备独立 Chrome profile；这一步不登录、不认领账号。
2. 运行 `wos4-lock.ps1 -Action AcquireAccount -Owner <当前AI身份> -Task <任务说明>` 申请账号锁。
3. 如果锁脚本返回 `blocked`，停止登录并把锁冲突原因报告给用户。
4. 用锁结果中的 `account/session/profile_dir/cdp_port/harness_name/isolated_context` 选择浏览器上下文或独立 profile。
5. 如果用户要求前台可见，优先使用已启动的独立 profile；不要把多个账号放进同一个普通 Chrome profile。
6. 打开登录页。
7. 等待两个输入框出现。
8. 填用户名和密码。
9. 如果普通 fill/type 后密码为空或按钮仍禁用，使用原生 value setter。
10. 点击“登录”。
11. 等 URL 到 `#/main`，或页面出现 `时空功能开发`、`系统运维`、`安全管理`、`审计管理`。
12. 当前任务结束、账号不再使用、暂停并不继续操作、登录失败且本轮停止、或用户要求归还时，运行 `wos4-lock.ps1 -Action ReleaseAccount`；如果一个 AI 身份持有多个账号，可运行 `ReleaseOwnerAccounts`。

已验证当前 DOM 中登录按钮 id 是 `desktop-login-btn`，不是 `desktop-login-button`。

## 原生输入兜底

WOS4 登录页有时不接受普通输入事件。用下面方式写值：

```js
const setValue = (selector, value) => {
  const el = document.querySelector(selector)
  const desc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), "value")
  desc.set.call(el, value)
  el.dispatchEvent(new Event("input", { bubbles: true }))
  el.dispatchEvent(new Event("change", { bubbles: true }))
  el.dispatchEvent(new Event("blur", { bubbles: true }))
}

setValue("#desktop-login-input-name", user)
setValue("#desktop-login-input-password", pass)
```

## Chrome MCP 注意事项

已遇到过 Chrome MCP 输入密码失败的情况：

- 用户名能写入。
- 密码字段保持空。
- 登录按钮禁用。

这时不要反复手工试登录。改用 DevTools 页面执行原生 setter，或退回直连 Playwright。

本次补充经验：

- Chrome MCP 可能因为同一 profile 已有浏览器实例而无法 `new_page` 或 `list_pages`，报错类似 `browser is already running for ... chrome-profile`。
- 遇到 profile 锁时不要杀用户浏览器，也不要继续重复登录；记录失败证据后，退回 `headless:false` 的直连 Playwright。
- 退回 Playwright 时仍要使用本 skill 的原生 value setter，不能把密码写进脚本文件。一次性脚本从 `WOS4_PASS` 或本机不入 Git 的 `wos4-artifacts/config/wos4.local.ini` 读取。

登录和编辑器接管分开处理：

- 登录只负责拿到 `#/main` 登录态。
- 登录后进入 KingStudio、产品组装和页面设计器必须按 `.ai/skills/wos4-human-navigation/SKILL.md` 的菜单层级模拟人类操作。
- 不要因为编辑器外壳页空白就重新登录。
- 接管编辑器前必须检查 `#page_edit_view_area` 和 `comMap.$Children`。
- `GetFileContent/.../index.html` 是被父窗口加载的内容页，顶层直接打开不能作为成功接管编辑器的依据。

## 失败处理

如果仍停在 `#/login`：

- 读取页面 toast 或校验提示。
- 如果出现验证码、MFA、改密、安全弹窗，停止并让用户处理。
- 如果 toast 为 `登录失败:timeout`，先判定为 WOS4 服务端或网络超时，不继续反复点击登录。保存快照后停止当前 WOS4 自动操作，等待网络/服务恢复或用户确认。

## 2026-06-22 会话失效补充

已验证当已登录页面出现：

```text
会话失效或无法连接到云，是否退出登录页面？
```

处理方式应是刷新顶层 WOS4 页面，而不是点击 `保留在当前页` 后继续操作旧 iframe。刷新后可能直接回到 `#/login`；此时按本 skill 重新登录。如果重新登录返回 `登录失败:timeout`，说明当前不是输入框或密码写入问题，必须停止并记录证据。
