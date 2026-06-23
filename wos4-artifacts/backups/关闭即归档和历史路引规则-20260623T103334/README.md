# WOS4.5 AI 工作区

本仓库根目录是本地 Git 工作区：`D:\DEV_D\WOS4.5`。

## 入口文件

- `AGENTS.md`：AI 执行入口和强制规则。
- `MEMORY.md`：长期记忆和 AI 修改记录。
- `AI-INTERACTION-PANEL.md`：多人协作看板，记录“开发人员 + AI 身份”做了什么。
- `.ai/skills/`：项目真实 skill 源。
- `.ai/docs/project-directory-map.md`：当前目录地图和后续清理顺序。
- `.ai/docs/backup-and-version-policy.md`：本地 Git、WOS4 平台历史版本和修改前备份规则。
- `.ai/docs/mcp-and-local-tools.md`：MCP、本地浏览器工具和用户侧安装/启用说明。
- `.ai/docs/ai-interaction-panel-policy.md`：AI 交互面板 open/closed、发起人和参与人规则。
- `.ai/docs/test-and-report-policy.md`：单元测试、集成测试、回归测试和报告放置规则。
- `.ai/docs/task-work-package-policy.md`：任务工作包规则，复杂任务按文件夹分阶段管理。
- `.ai/docs/wos4-version-tree.md`：前端布局、组件代码、后端模块、客户端发布和运维部署的逻辑版本树。
- `wos4-artifacts/`：脚本、截图、快照、测试、报告、备份和本机配置。

## 目录怎么编排

当前根目录仍混有历史探针脚本、旧截图和旧快照，所以看起来比较乱。新的编排规则是：

- 根目录只做入口。
- `.ai/` 放 AI 身份、规则、skill 和设计文档。
- `wos4-artifacts/` 放 WOS4 脚本、截图、快照、测试、报告、备份和本机配置。
- 复杂任务放 `wos4-artifacts/tasks/<日期-中文任务名>/`，面板只指向任务目录。
- 旧的根目录 `screenshots/`、`snapshots/`、`wos4-*.js`、`probe*.js` 先不直接删除，按 `.ai/docs/project-directory-map.md` 分批迁移。

## 新建本地 ini

复制示例文件：

```powershell
Copy-Item wos4-artifacts\config\wos4.local.example.ini wos4-artifacts\config\wos4.local.ini
```

填写格式：

```ini
[identity]
developer_name=<开发人员姓名>
workspace_name=<本机或工作区名称>
note=<可选说明>

[wos4]
url=http://<wos4-host>:<port>/#/login
username=<开发人员登录用户名>
password=<开发人员登录密码>
proxy=direct

[ops]
url=http://<ops-host>:<port>/#/login
username=<运维用户名>
password=<运维密码>
cloud_id=<云编号>
host=<运维主机或云访问地址>
port=<运维端口>

[debug_access]
cloud_name=<调试云名称>
cloud_id=<云编号>
host=<调试访问地址>
port=<调试访问端口>
username=<调试访问用户名>
password=<调试访问密码>
```

`[wos4]` 是开发人员日常登录 WOS4.5 的账号。运维、部署、调试访问等账号必须放在独立段里。

真实 `wos4.local.ini` 不进 Git；只能提交 `*.example.ini`。

如果 `wos4.local.ini` 的 `developer_name`、`url`、`username` 与当前用户或目标环境不符，AI 必须停止 WOS4 操作，不能继续登录、保存、提交或预览。

## MCP 和页面操作

- WOS4 前台页面操作优先使用 Chrome MCP；用户需要先在 Codex Desktop 中安装并启用 Chrome 相关 MCP/插件。
- Chrome MCP 不可用时，按 `.ai/docs/mcp-and-local-tools.md` 检查 `browser-harness` 或 Playwright 兜底。
- 微信文件传输使用 Windows Computer Use，用户需要保持微信桌面端已登录。
- 工具不可用时，AI 必须记录 `blocked` 原因，不能伪造操作结果。

## 版本管理和备份

- 本地 Git 在 `D:\DEV_D\WOS4.5\.git`。
- WOS4 平台对象以平台历史版本、提交记录和导出模型为准。
- 每次修改、删除、迁移、覆盖或重写本地文件前，先备份到 `wos4-artifacts/backups/<中文任务名>-<时间>/`。
- 每次修改 WOS4 页面或后端模块前，先导出 `before.json` 和截图；修改后导出 `after.json`；验证后保存 `verify.json`。

## 测试和报告

- 单元测试放 `wos4-artifacts/tests/unit/`。
- 集成测试放 `wos4-artifacts/tests/integration/`。
- 回归测试放 `wos4-artifacts/tests/regression/`。
- 测试数据放 `wos4-artifacts/tests/fixtures/`。
- 人工测试清单放 `wos4-artifacts/tests/manual/`。
- 测试执行后的汇总结论、阶段报告、验证报告放 `wos4-artifacts/reports/`。

## 任务工作包

复杂任务一个任务一个文件夹：

```text
wos4-artifacts/tasks/yyyyMMdd-中文任务名/
```

适用场景：

- 用户给图片或设计稿，需要先讨论布局。
- 同时涉及前端布局、前端逻辑、后端改动、测试验收。
- 需要分阶段完成。
- 需要多个 AI 身份协作。

任务文件夹从 `wos4-artifacts/tasks/_template/` 复制。交互面板只写任务工作包路径、简要说明、改动范围、当前阶段和关闭条件；具体事件写到任务的 `执行日志.md`。
