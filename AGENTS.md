# AGENTS

## 项目 AI 路引

本文件是项目根目录的 AI 路引。所有 AI 在开始任务前先读本文件，再按任务类型读取对应 skill、instructions、docs 和 agent 身份文件。

根目录关键文件：

- `AGENTS.md`：执行入口、强制规则、目录位置说明。
- `MEMORY.md`：项目长期记忆和 AI 修改记录。每次 AI 修改文件后都要追加记录。
- `AI-INTERACTION-PANEL.md`：单文件 AI 协作看板，记录 code-ai、frontend-ai、test-ai、review-ai 之间的 open/closed 交互。

`.ai` 目录：

- `.ai/agents/`：AI 身份定义，包含 `frontend-ai.md`、`code-ai.md`、`test-ai.md`、`review-ai.md`。
- `.ai/instructions/`：项目级规则说明，例如全局规则、WOS4 规则、Git 安全控制。
- `.ai/skills/`：可迁移 skill 的放置位置和索引。根目录已有 skill 暂不搬动，迁移时再复制到这里。
- `.ai/docs/`：设计文档、WOS4 自动化方案、产物放置规范。
- `.ai/closed-interactions/`：从 `AI-INTERACTION-PANEL.md` 清理出来的历史关闭记录。

WOS4 产物目录：

- `wos4-artifacts/scripts/`：WOS4 自动化脚本、探针脚本、修复脚本。
- `wos4-artifacts/screenshots/`：编辑器和预览截图。
- `wos4-artifacts/snapshots/`：页面模型、运行时快照、验证 JSON。
- `wos4-artifacts/tests/`：测试用例、回归测试记录、测试数据。
- `wos4-artifacts/reports/`：阶段报告、验证报告、时间报告。
- `wos4-artifacts/backups/`：修改前后备份，必须配合 Git 作为安全控制。
- `wos4-artifacts/config/`：本机 WOS4 连接配置。真实 `*.ini` 不进 Git，只提交示例和说明。

现有根目录的 WOS4 脚本、截图、快照暂时保留原位。整理旧产物前，先建立 Git 基线，再按 `.ai/docs/wos4-artifact-placement.md` 分批迁移。

## 强制规则

做任何操作前，先检查当前任务有没有匹配的 skill。

以下操作必须先查 skill：

- 登录
- 页面导航
- 浏览器自动化
- 布局编辑
- 组件测试
- 保存、提交、预览
- 代码生成
- 文档更新

每次修改文件后，必须追加更新 `MEMORY.md` 的“AI 修改记录”。

涉及 AI 身份协作时，必须更新 `AI-INTERACTION-PANEL.md`：

- code-ai 完成实现后，请求 test-ai 测试。
- test-ai 返回 `approved`、`needs-change` 或 `blocked`。
- review-ai 审阅 Git diff、安全控制和文档准确性。
- closed 的事项可以保留在看板，过长后再归档到 `.ai/closed-interactions/`。

## 工作流程

1. 先读用户需求。
2. 先检查当前工作目录里有没有匹配的 skill。
3. 必要时再检查 Codex 已加载的系统 skill。
4. 如果有匹配 skill，优先按 skill 做，不要重新猜流程。
5. 只有在没有匹配 skill，或 skill 明确被验证为不可用时，才临时探索。
6. 临时探索时，要简短说明为什么不能直接使用已有 skill。

## WOS4 专用规则

处理 WOS4 / WellinOS4.5 时，必须先检查这些 skill：

- `D:\DEV_D\WOS4.5\wos4-login\SKILL.md`
- `D:\DEV_D\WOS4.5\wos4-create-new-page\SKILL.md`
- `D:\DEV_D\WOS4.5\wos4-layout-devtools-skill\SKILL.md`
- `D:\DEV_D\WOS4.5\wos4-component-persistence\SKILL.md`
- `D:\DEV_D\WOS4.5\wos4-style-config\SKILL.md`
- `D:\DEV_D\WOS4.5\wos4-button-variable-flow\SKILL.md`
- `D:\DEV_D\WOS4.5\wos4-interaction-flow-skill\SKILL.md`
- `D:\DEV_D\WOS4.5\wos4-demo-page-fullstack-skill\SKILL.md`

不要在已有 skill 覆盖的情况下反复试登录、布局、保存、交互。

## Chrome MCP 规则

用户需要在前台看浏览器操作时，优先使用 Chrome MCP。

适用场景：

- WOS4 登录
- WOS4 编辑器操作
- 前台页面编辑
- 保存、提交、预览

如果 Chrome MCP 无法设置登录输入框、无法进入编辑器 runtime，或当前会话没有可用 Chrome MCP，再退回直连 Playwright。

退回 Playwright 时：

- 使用 `--proxy-server=direct://` 绕过代理/VPN。
- 使用 `wos4-login` 中的原生 input value setter。
- 不要把密码写进脚本文件；复用脚本应通过 `WOS4_PASS` 环境变量读取密码。
- 如需读取 WOS4 网址、账号、密码，优先读取 `wos4-artifacts/config/wos4.local.ini`；该文件不进 Git。

## 验收规则

只看编辑器当前 runtime 不算完成。WOS4 页面至少要做：

- 提交成功。
- 重新打开编辑页，确认配置还在。
- 打开预览页，确认组件可见。
- 对交互功能，必须点击或触发后比较前后数据。
- 把结论写入 `D:\DEV_D\WOS4.5\WOS4_deep_test_notes.md`。
