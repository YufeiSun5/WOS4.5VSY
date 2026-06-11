# 项目记忆

## 项目目标

建立一个可迁移的项目级 AI 工作区，用于沉淀 WOS4 自动化、页面开发、测试验证、Git 安全控制、微信文件传输等流程。

## 已确认规则

- AI 开始任务前先读 `AGENTS.md`。
- 有匹配 skill 时必须优先使用 skill，不要重新猜流程。
- WOS4 操作优先使用 Chrome MCP；需要 Windows 微信等桌面应用时使用 Computer Use。
- Git 是安全控制方案。WOS4 页面修改前后必须保留模型、截图、测试结果和差异。
- AI 每次修改文件后，都要在本文件记录身份、时间、修改内容和验证结果。
- AI 之间的任务请求、反馈和 open/closed 状态写入 `AI-INTERACTION-PANEL.md`。

## AI 修改记录

- 2026-06-12 code-ai 创建项目级 AI 工作区骨架：`.ai/`、`AI-INTERACTION-PANEL.md`、`MEMORY.md`、`wos4-artifacts/`，并更新 `AGENTS.md` 路引。
- 2026-06-12 code-ai 规划 WOS4 产物放置方式：脚本、截图、快照、测试、报告、备份分目录管理；旧产物暂不移动，先建立 Git 基线。
- 2026-06-12 code-ai 初始化本地 Git 仓库并切换到 `main` 分支；敏感信息扫描发现旧探针/脚本仍有明文密码，因此只提交 AI 工作区和 WOS4 产物目录规范，旧脚本和旧产物暂不纳入基线。安全初始提交：`936cdfa`。

## 已验证技能

- `wos4-login`
- `wos4-create-new-page`
- `wos4-layout-devtools-skill`
- `wos4-component-persistence`
- `wos4-style-config`
- `wos4-button-variable-flow`
- `wos4-interaction-flow-skill`
- `wos4-demo-page-fullstack-skill`
- `wechat-send-file-transfer`

## 未解决事项

- 旧 WOS4 脚本、截图、快照仍分散在根目录、`screenshots/`、`snapshots/`，需要在 Git 基线后分批迁移。
- 需要补充 `wos4-page-backup-git` skill，把修改前备份、修改后验证、Git diff 固化成标准流程。
- 需要清理旧脚本中的明文密码，统一改成 `WOS4_PASS` 后再纳入 Git。
