# MCP 和本地工具说明

本项目的页面操作依赖用户本机工具。AI 不能假装 MCP 已安装；工具不可用时必须停止、记录原因，再按规则选择兜底方案。

## 中文优先

- 目录名、文件名、脚本名可以使用英文，便于跨平台和命令行处理。
- 面向大陆开发者的 README、规则说明、交互面板、备份说明、测试结论优先使用中文。
- 代码变量名、平台对象名、WOS4 固有字段、API 名称保持原样，不强行翻译。

## 当前会用到的工具

## 顶层弹窗优先级

- WOS4 自动化操作必须先看顶层页面弹窗，再看 iframe 或业务组件。顶层 `应用停止`、`会话失效`、`无法连接到云`、`未知错误`、确认退出、保存失败、提交失败等弹窗是阻塞状态。
- 执行登录、打开客户端、进入工程、保存、提交、预览、发布、部署、启动、关闭弹窗、读取运行态之前，都要先扫描顶层 `document.body.innerText` 和可见 `.el-message-box`、`.el-dialog`、`.el-overlay-message-box`、遮罩层按钮。
- 如果顶层弹窗存在，必须记录标题、正文、按钮文本和截图或快照。先解决弹窗，再进入 nested iframe。禁止在弹窗遮挡时继续操作旧 iframe，或把旧 iframe 中的 DOM 当作当前页面状态。
- 点击弹窗按钮必须按按钮文本定位，例如 `退出`、`立即退出`、`确定`、`取消`、`保留在当前页`。无法识别弹窗内容时停止并报告，不允许按坐标猜。

### Chrome MCP

用途：

- 前台可见地操作 WOS4 页面。
- 页面设计器、保存、提交、预览、运行页验证。
- 用户需要看到浏览器操作过程时优先使用。

用户侧要求：

- 在 Codex Desktop 的插件、连接器或工具管理入口中安装并启用 Chrome 相关 MCP/插件。
- 本机 Chrome 必须可启动，并允许 Codex 接管当前浏览器会话。
- 如果 Codex 当前会话没有暴露 Chrome MCP 工具，AI 不能继续声称“已接管 Chrome”。

使用规则：

- 登录成功到 `#/main` 后，页面入口必须按可见菜单层级点击，不把动态 URL 当入口。
- 接管编辑器前必须确认 `#page_edit_view_area.__vue__._data.comMap.$Children` 存在且非空。
- Chrome MCP 不可用时，按 `AGENTS.md` 记录原因，再按 skill 退回 `browser-harness` 或直连 Playwright。

### browser-harness

用途：

- 在 Chrome MCP 不稳定或用户明确要求时，接管用户本地 Chrome。
- 做 nested iframe 检查、截图、点击、DOM 探针和运行态验证。
- 在进入 nested iframe 前，先做顶层弹窗探针；只有顶层没有阻塞弹窗，才继续递归读取 iframe。

用户侧要求：

- 本机需要存在 `C:\Users\SunYufei\.local\bin\browser-harness.exe`。
- 使用前运行：

```powershell
$env:Path = 'C:\Users\SunYufei\.local\bin;' + $env:Path
browser-harness --doctor
```

成功标准：

```text
[ok] chrome running
[ok] daemon alive
[ok] active browser connections
```

如果命令不存在，用户需要按 browser-harness 的安装说明把可执行文件安装到上述路径，或把实际安装路径加入当前 PowerShell 的 `PATH`。

### Playwright 兜底

用途：

- Chrome MCP 和 browser-harness 都不可用时，作为 WOS4 登录或只读验证兜底。

规则：

- 使用 `--proxy-server=direct://`。
- 密码只能从环境变量或 `wos4-artifacts/config/wos4.local.ini` 读取。
- 不能把密码写进脚本文件。

### Windows Computer Use

用途：

- 操作 Windows 桌面应用，例如微信文件传输助手。

用户侧要求：

- Codex Desktop 需要启用 Computer Use 能力。
- 微信必须处于用户已登录状态。

规则：

- 只在用户明确要求发送文件时使用。
- 目标不是文件传输助手时，必须先向用户确认。

## 工具不可用时

任何页面操作工具不可用时：

1. 不继续猜测或伪造操作结果。
2. 在 `WOS4_deep_test_notes.md` 或任务备份目录记录不可用原因。
3. 如果涉及 AI 协作任务，在 `AI-INTERACTION-PANEL.md` 里追加 `blocked` 反馈。
4. 等用户安装、启用或确认兜底工具后再继续。
