---
name: wos4-login
description: 登录 WOS4 / WellinOS4.5 平台。适用于打开、访问、登录 WOS4，或通过 Chrome MCP、Playwright 控制浏览器进入 WOS4 编辑器、预览页、功能开发页面。
---

# WOS4 登录

## 登录地址

```text
http://221.239.19.118:13001/#/login
```

登录成功地址通常变为：

```text
http://221.239.19.118:13001/#/main
```

## 网络要求

访问 WOS4 时绕过 VPN/代理，优先直连：

```text
221.239.19.118
221.239.19.118:13001
221.239.19.118:13002
221.239.19.118:13003
```

Playwright 启动时使用：

```text
--proxy-server=direct://
```

PowerShell 网络请求如需直连，使用 `-Proxy $null`。

## 账号密码

- 使用用户当前对话里提供的账号密码。
- 不要把密码写进脚本文件、skill、最终回复或日志。
- 可复用脚本应从环境变量 `WOS4_PASS` 读取密码。

## 稳定选择器

```text
用户名输入框：#desktop-login-input-name
密码输入框：#desktop-login-input-password
记住密码：#desktop-login-remember-password
登录按钮：文本“登录”
```

## 推荐流程

1. 如果用户要求前台可见，先尝试 Chrome MCP。
2. 打开登录页。
3. 等待两个输入框出现。
4. 填用户名和密码。
5. 如果普通 fill/type 后密码为空或按钮仍禁用，使用原生 value setter。
6. 点击“登录”。
7. 等 URL 到 `#/main`，或页面出现 `时空功能开发`、`系统运维`、`安全管理`、`审计管理`。

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

## 失败处理

如果仍停在 `#/login`：

- 读取页面 toast 或校验提示。
- 如果出现验证码、MFA、改密、安全弹窗，停止并让用户处理。
