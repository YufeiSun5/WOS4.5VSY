# AGENTS

## 项目 AI 路引

本文件是项目根目录的 AI 路引。所有 AI 在开始任务前先读本文件，再按任务类型读取对应 skill、instructions、docs 和 agent 身份文件。

根目录关键文件：

- `AGENTS.md`：执行入口、强制规则、目录位置说明。
- `README.md`：项目给人类开发者看的快速入口，说明本地 ini 新建格式、Git 根目录和常用文档。
- `MEMORY.md`：项目长期记忆和 AI 修改记录。每次 AI 修改文件后都要追加记录。
- `AI-INTERACTION-PANEL.md`：单文件 AI 协作看板，记录“开发人员 + AI 身份”之间的 open/closed 交互。

`.ai` 目录：

- `.ai/agents/`：AI 身份定义，包含 `design-ai.md`、`frontend-ai.md`、`code-ai.md`、`test-ai.md`、`review-ai.md`。
- `.ai/instructions/`：项目级规则说明，例如全局规则、WOS4 规则、Git 安全控制。
- `.ai/skills/`：项目真实 skill 源。所有项目 skill 只放这里，根目录不再保留同名 skill。
- `.ai/docs/`：设计文档、WOS4 自动化方案、产物放置规范。
- `.ai/docs/project-directory-map.md`：项目目录地图。涉及目录清理、旧产物迁移、文件应该放哪里时先读该文件。
- `.ai/docs/backup-and-version-policy.md`：备份和版本管理规则。涉及本地文件修改、批量删除、WOS4 修改前备份时先读该文件。
- `.ai/docs/mcp-and-local-tools.md`：MCP、本地浏览器工具和用户侧安装/启用要求。涉及页面操作、Chrome MCP、browser-harness、Computer Use 时先读该文件。
- `.ai/docs/ai-interaction-panel-policy.md`：AI 交互面板 open/closed、发起人、参与人和归档规则。涉及协作事项时先读该文件。
- `.ai/docs/test-and-report-policy.md`：单元测试、集成测试、回归测试和报告放置规则。涉及测试或报告时先读该文件。
- `.ai/docs/task-work-package-policy.md`：任务工作包规则。复杂任务、图片布局、前端逻辑、后端改动、分阶段执行时先读该文件。
- `.ai/docs/wos4-version-tree.md`：WOS4 前端布局、前端组件代码、后端模块、客户端发布和运维部署之间的版本树说明。涉及版本定位、导入关系或模块归属时先读该文件。
- `.ai/closed-interactions/`：从 `AI-INTERACTION-PANEL.md` 清理出来的历史关闭记录。

WOS4 产物目录：

- `wos4-artifacts/scripts/`：WOS4 自动化脚本、探针脚本、修复脚本。
- `wos4-artifacts/screenshots/`：编辑器和预览截图。
- `wos4-artifacts/snapshots/`：页面模型、运行时快照、验证 JSON。
- `wos4-artifacts/tests/`：测试用例、回归测试记录、测试数据。
- `wos4-artifacts/reports/`：阶段报告、验证报告、时间报告。
- `wos4-artifacts/backups/`：修改前后备份，必须配合 Git 作为安全控制。
- `wos4-artifacts/tasks/`：任务工作包。复杂任务一个任务一个文件夹，交互面板只指向任务目录和简要状态。
- `wos4-artifacts/config/`：本机 WOS4 连接配置。真实 `*.ini` 不进 Git，只提交示例和说明。
- `wos4-artifacts/docs/wos4-help-kb/`：WOS4 帮助手册本地知识库。AI 查询手册时先读该目录的 `AGENTS.md` 和 `AI-ROUTE.md`，再按任务索引定位章节。

Preflight 门禁：

- WOS4 操作、复杂任务实施、提交前检查前，优先运行 `wos4-artifacts/scripts/ai-preflight.ps1`。
- 常规检查：`powershell -ExecutionPolicy Bypass -File wos4-artifacts/scripts/ai-preflight.ps1`。
- WOS4 任务检查：`powershell -ExecutionPolicy Bypass -File wos4-artifacts/scripts/ai-preflight.ps1 -Wos4 -TaskPath wos4-artifacts/tasks/<任务目录>`。
- 提交前要求干净工作区时：追加 `-RequireClean`。
- preflight 失败时必须先处理失败项，不得继续 WOS4 登录、保存、提交、预览或 Git 提交。

本地配置：

- 本地 WOS4 配置文件固定为 `wos4-artifacts/config/wos4.local.ini`，从 `wos4-artifacts/config/wos4.local.example.ini` 复制创建。
- `[identity]` 段必须填写 `developer_name` 和 `workspace_name`，用于确认当前本机配置属于哪个开发人员和工作区。
- `[wos4]` 段只放开发人员登录 WOS4.5 的入口、用户名和密码，是日常开发登录账号。
- 运维、部署、云访问、调试访问等其他账号必须放到独立段，例如 `[ops]`、`[debug_access]`，不得混进 `[wos4]` 开发登录段。
- 真实 `*.ini`、密码、Cookie、Token 不进 Git；文档和脚本只能引用字段名或环境变量，不能写明文密码。
- 执行任何 WOS4 登录、页面导航、保存、提交、预览、部署前，必须校验 `wos4.local.ini` 的 `developer_name`、`url`、`username` 是否与当前用户和目标环境一致。
- 如果用户的 ini 与当前任务不符、缺失关键字段、指向错误环境或账号不是当前开发人员，必须停止操作并报告 `blocked`；不能继续登录、保存、提交或预览。

语言规则：

- 文件夹和脚本名可以使用英文，便于命令行和跨平台处理。
- 面向开发者的 README、规则说明、交互面板、备份说明、测试结论优先使用中文。
- `wos4-artifacts/backups/` 下的新备份目录名、清单说明、README 和报告标题能用中文就用中文；必要的技术标识、时间戳、平台对象名、函数名、文件扩展名保持原样。
- 备份目录名建议格式：`<中文任务名>-yyyyMMddTHHmmss`，例如 `中文备份规则和知识库检查-20260623T100346`。
- 代码标识符、平台对象名、WOS4 固有字段和 API 名称保持原样。

版本管理和代码归属：

- 本地 Git 根目录是 `D:\DEV_D\WOS4.5`，用于管理 AI 规则、skill、脚本、证据、报告和可提交的导出 JSON。
- 本地 Git 元数据目录是 `D:\DEV_D\WOS4.5\.git`；查看本地版本状态使用 `git status --short`，查看修改内容使用 `git diff`。
- WOS4 平台内的前端布局、前端组件脚本、后端模块、客户端画面、运行包和运维部署不是普通本地源码目录；它们的真实版本以 WOS4 平台的历史版本、提交记录和导出模型为准。
- 本项目用 `.ai/docs/wos4-version-tree.md` 维护逻辑版本树，用 `wos4-artifacts/backups/`、`snapshots/`、`screenshots/` 保存可审计证据。
- 修改任何 WOS4 前端布局、组件脚本或后端模块前，必须先在备份目录记录对应项目、模型、页面、组件、后端函数、平台版本号和操作者。
- 每次修改、删除、迁移、覆盖或重写本地文件前，必须先按 `.ai/docs/backup-and-version-policy.md` 复制上一版本到 `wos4-artifacts/backups/<中文任务名>-<时间>/` 并写入清单。

WOS4 布局设计硬规则：

- 必须先完成布局结构，再向布局槽位放组件。布局未稳定前禁止放置表格、ECharts、树、输入框、按钮等业务组件。
- 布局阶段只做 `RContainer/RRow/RCol` 行列、宽高、gap、offset、嵌套容器；组件阶段只向已确认的空 `RCol` 放组件。
- 布局完成后必须重新读取 `comMap.$Children`，确认目标行列和尺寸策略存在，再进入组件放置。
- `wos4-layout-devtools-skill` 是唯一有效的布局 skill。其他 skill 可以引用布局结果，但不得再维护独立布局规则或把历史 `RCol` 编号当现行规范。
- 表格、ECharts、树、主内容区所在行列必须明确尺寸策略，不能只放组件不设置高度。
- 顶部标题、搜索/过滤区、底部状态区优先使用固定高度。
- 表格和图表所在数据区必须使用明确的剩余空间策略或固定最小高度，禁止把中部行设为 `percentage=100` 后再叠加额外固定行导致溢出。
- 列宽必须明确是响应式百分比还是固定尺寸；当前管理类页面默认优先使用响应式百分比。
- 进入子布局后，列宽百分比必须按子容器重新从 100% 起算，不沿用父布局的像素宽度。
- 百分比布局下，同行所有可见列的逻辑宽度和必须 `<= 100`；判断时优先看逻辑宽度字段，不拿运行时折算后的 `xlWidth` 当百分比。
- 图表和表格的父容器高度必须在预览页截图验证，不能只验证 canvas/table 存在。

WOS4 备份硬规则：

- 新建页面前：记录目标分组、页面名、时间、操作者、使用的 skill 和本机配置摘要。
- 修改已有页面前：必须导出 `before.json`，保存编辑器修改前截图。
- 保存提交后：必须导出 `after.json`，保存编辑器修改后截图。
- 预览验证后：必须保存 `verify.json`、预览截图和测试结论。
- 备份统一放入 `wos4-artifacts/backups/<中文页面名或中文任务名>/`，并用 Git 记录可提交的 JSON、说明和索引。

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
- 测试设计和测试执行

任务工作包规则：

- 用户给图片、设计稿、页面布局描述，或任务同时涉及前端布局、前端逻辑、后端改动、发布部署、测试验收中的两个以上部分时，必须创建任务工作包。
- 用户给草图、截图、前端交互说明、后端数据结构、已有数据利用需求或需要先讨论方案时，优先由 `design-ai` 进入方案阶段。
- 任务工作包放在 `wos4-artifacts/tasks/<日期-中文任务名>/`。
- 任务可以分阶段完成，阶段状态写入任务 `README.md` 和 `执行日志.md`。
- `AI-INTERACTION-PANEL.md` 只写简要说明、改动范围、当前阶段、参与人和任务工作包路径；具体事件、讨论、设计、执行过程写入任务工作包。
- 用户可以直接修改任务工作包文件，AI 后续按用户修改后的内容继续执行。
- 创建任务工作包时，从 `wos4-artifacts/tasks/_template/` 复制结构。

测试规则：

- 单元测试放 `wos4-artifacts/tests/unit/`，用于本地脚本、解析器、配置读取、数据转换等纯逻辑。
- 集成测试放 `wos4-artifacts/tests/integration/`，用于登录、导航、保存、提交、预览、运维更新等跨模块链路。
- 回归测试放 `wos4-artifacts/tests/regression/`，用于已修复问题和关键链路复测。
- 测试数据放 `wos4-artifacts/tests/fixtures/`。
- 无法自动化的人工测试清单放 `wos4-artifacts/tests/manual/`。
- 测试执行后的汇总结论、阶段复盘、验证报告放 `wos4-artifacts/reports/`，报告必须引用测试、截图、快照或备份证据。

每次修改文件后，必须追加更新 `MEMORY.md` 的“AI 修改记录”。

执行 WOS4 操作或提交前检查时，必须先运行 `wos4-artifacts/scripts/ai-preflight.ps1`；失败时停止并修复。

涉及 AI 身份协作时，必须更新 `AI-INTERACTION-PANEL.md`：

- 交互项的发起方和接收方必须写成“开发人员 + AI 身份”，例如 `孙宇飞_design-ai`、`孙宇飞_frontend-ai`、`孙宇飞_code-ai`、`孙宇飞_test-ai`、`孙宇飞_review-ai`。
- 同一个 AI 身份被不同开发人员使用时，必须用开发人员姓名区分，不得只写 `code-ai`、`frontend-ai` 这类裸身份。
- 新事项必须包含发起人、发起人 AI、参与人、状态、创建时间、关联文件、请求、最新反馈和关闭条件。
- 新事项当前面板状态只使用 `open`；完成后由发起人 AI 关闭并归档为 `closed`。
- design-ai 负责需求方案、系统能力核实、数据结构核实和阶段计划；不直接替代 code-ai/frontend-ai 实施。
- design-ai 完成方案后，把计划写入任务工作包，再交给 frontend-ai/code-ai。
- code-ai/frontend-ai 完成实现后，请求对应 test-ai 测试。
- test-ai 返回 `approved`、`needs-change` 或 `blocked`，这些写入反馈结论，不作为新事项主状态。
- review-ai 审阅 Git diff、安全控制、配置文件隔离和文档准确性。
- 用户明确要求 close 时，当前执行 AI 必须在同一次修改里完成归档、移出面板、更新索引和更新 `MEMORY.md`；AI 自行判断 close 时只有发起人 AI 能关闭事项，参与人只能请求发起人关闭。
- close 是原子操作：必须把事项复制到 `.ai/closed-interactions/`，写明 `状态：closed`、关闭触发、关闭人、关闭时间和最终结论，并从 `AI-INTERACTION-PANEL.md` 当前事项中移出。
- 每次归档必须更新 `.ai/closed-interactions/INDEX.md`；查询历史 closed 事项时先读 `.ai/closed-interactions/AI-ROUTE.md` 和 `INDEX.md`，不能只按日期猜归档文件。

MCP 和本地工具规则：

- WOS4 页面操作优先使用 Chrome MCP；用户需要在 Codex Desktop 中安装并启用 Chrome 相关 MCP/插件。
- Chrome MCP 不可用时，按 `.ai/docs/mcp-and-local-tools.md` 检查 `browser-harness` 或 Playwright 兜底。
- 微信文件发送使用 Windows Computer Use，要求用户已登录微信桌面端。
- 工具不可用时必须停止并记录 `blocked`，不能伪造页面操作结果。

## 工作流程

1. 先读用户需求。
2. 先检查当前工作目录里有没有匹配的 skill。
3. 必要时再检查 Codex 已加载的系统 skill。
4. 如果有匹配 skill，优先按 skill 做，不要重新猜流程。
5. 只有在没有匹配 skill，或 skill 明确被验证为不可用时，才临时探索。
6. 临时探索时，要简短说明为什么不能直接使用已有 skill。

## WOS4 专用规则

处理 WOS4 / WellinOS4.5 时，必须先检查这些 skill：

- `D:\DEV_D\WOS4.5\.ai\skills\wos4-login\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-human-navigation\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-browser-harness\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-manual-to-skill\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-create-new-page\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-layout-devtools-skill\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-component-persistence\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-component-catalog\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-style-config\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-button-variable-flow\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-interaction-flow-skill\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-demo-page-fullstack-skill\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-config-client-screen-create\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-meta-language-fu-create\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-meta-language-fu-release-package\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-repository-package-deploy-start\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-runtime-package-update\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-blue-client-publish-flow\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-object-create-verify\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-blue-client-object-create\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-modeling-reference-inspection\SKILL.md`

微信文件发送 skill：

- `D:\DEV_D\WOS4.5\.ai\skills\wechat-send-file-transfer\SKILL.md`

不要在已有 skill 覆盖的情况下反复试登录、布局、保存、交互。

如果多个 skill 都提到布局，只能以 `wos4-layout-devtools-skill` 为准，并回头清理重复规则。

## Chrome MCP 规则

用户需要在前台看浏览器操作时，优先使用 Chrome MCP。

适用场景：

- WOS4 编辑器操作
- 前台页面编辑
- 保存、提交、预览

登录与 Chrome MCP 接管分开：

- 登录阶段优先使用 `wos4-login` 中已验证的脚本注入 / 原生 value setter。
- 登录成功到 `#/main` 后，不要因为编辑器页空白而重复登录。
- `KingStudio_V20260514` 已被用户确认为废弃入口，后续不得再进入或基于它探索客户端发布/页面设计流程。历史 KingStudio 记录只作为旧证据和反例，不再作为当前操作路径。
- 进入仍有效的客户端、建模系统、页面设计器必须按菜单层级模拟人类操作，不允许把动态 URL 当作入口直接打开。URL 只能作为证据记录和校验。
- 页面设计、布局、组件、保存、提交、预览阶段优先使用 Chrome MCP；Chrome MCP 不可用或无法接管时，按 skill 记录原因后退回直连 Playwright。
- Chrome MCP 接管编辑器前，必须检查 `#page_edit_view_area.__vue__._data.comMap.$Children` 存在且非空。
- `/public/?...#/running` 如果只有空 `#app`，说明外壳未挂载；`GetFileContent/.../index.html` 顶层打开缺少父窗口初始化，也不能算接管成功。
- 接管检查失败时，保存快照并停止，不继续写布局。

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
- 确认布局高度可用：表格不塌陷，ECharts canvas 有可见高度，主要区域不挤压到左上角。
- 对交互功能，必须点击或触发后比较前后数据。
- 把结论写入 `D:\DEV_D\WOS4.5\WOS4_deep_test_notes.md`。
