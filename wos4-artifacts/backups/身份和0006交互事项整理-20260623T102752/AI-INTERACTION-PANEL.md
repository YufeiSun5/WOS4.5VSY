# AI 交互看板

## 状态说明

- `open`：当前事项仍在处理、等待测试、等待审阅或等待发起人关闭。
- `closed`：事项已完成，必须已经归档到 `.ai/closed-interactions/`，并从本文件“当前事项”中移出。

新事项只使用 `open` 和 `closed` 两类主状态。`approved`、`needs-change`、`blocked` 写入“最新反馈”或“结论”，不再作为新事项主状态。历史事项可以保留原状态，不强行改写。

## 记录格式

新交互项必须记录“开发人员 + 工作域 + AI 身份”，不要只写裸 AI 身份。

格式：

```text
<开发人员姓名>_<工作域>_<AI身份>
```

示例：

- `孙宇飞_页面_frontend-ai`
- `孙宇飞_后端_code-ai`
- `孙宇飞_测试_test-ai`
- `孙宇飞_审阅_review-ai`

历史事项中只写 `code-ai`、`test-ai` 的记录可以保留；新事项必须按上述格式记录操作者。

## 新事项模板

```text
### <编号> <标题>

状态：open

发起人：<开发人员姓名>

发起人 AI：<开发人员姓名>_<工作域>_<AI身份>

参与人：

- <开发人员姓名>_<工作域>_<AI身份>

创建时间：YYYY-MM-DD

关联文件：

- `<路径>`

任务工作包：

- `wos4-artifacts/tasks/<日期-中文任务名>/`

请求：

<请求内容>

最新反馈：

<approved / needs-change / blocked 等过程结论写在这里>

关闭条件：

<只有发起人 AI 确认满足后才能 close>
```

## 关闭规则

- 只有“发起人 AI”可以关闭事项。
- 参与人可以反馈 `approved`、`needs-change` 或 `blocked`，但不能直接关闭。
- close 时必须把完整事项归档到 `.ai/closed-interactions/<日期>-<编号>-<简短标题>.md`。
- 归档文件必须写明 `状态：closed`、关闭人、关闭时间、关闭原因和最终结论。
- 归档完成后，必须从本文件“当前事项”中移出该事项。

## 当前事项

### 0001 code-ai 请求 test-ai 验证项目 AI 工作区骨架

状态：open

发起方：code-ai

接收方：test-ai

创建时间：2026-06-12

关联文件：

- `AGENTS.md`
- `MEMORY.md`
- `AI-INTERACTION-PANEL.md`
- `.ai/agents/frontend-ai.md`
- `.ai/agents/code-ai.md`
- `.ai/agents/test-ai.md`
- `.ai/agents/review-ai.md`
- `.ai/docs/wos4-artifact-placement.md`

请求：

请检查项目级 AI 工作区结构是否足够简单，是否能支持 WOS4 脚本、截图、测试用例、报告和备份的后续整理。

code-ai 已完成：

- 创建单文件 AI 交互看板。
- 创建项目记忆文件。
- 更新 `AGENTS.md` 为项目路引。
- 创建 `.ai/` 下的 agents、instructions、docs、skills、closed-interactions。
- 创建 `wos4-artifacts/` 下的 scripts、screenshots、snapshots、tests、reports、backups。

test-ai 反馈：

- 目录结构足够简单，当前活跃交互使用单文件 `AI-INTERACTION-PANEL.md`，不会产生过深层级。
- WOS4 产物目录已按 scripts、screenshots、snapshots、tests、reports、backups 拆分，能覆盖脚本、截图、测试用例、回归报告和备份。
- 本地 Git 已初始化，但敏感信息扫描发现旧脚本存在明文密码，当前不适合把旧脚本和旧产物直接纳入初始基线。
- 已完成安全初始提交 `936cdfa`，范围仅包含 AI 工作区、规则文件和 WOS4 产物目录规范。
- 建议 code-ai 继续清理旧脚本，统一改为 `WOS4_PASS`，再建立 Git 初始基线。

结论：

needs-change

追加反馈（2026-06-12）：

- 已按真实链路重跑：登录注入和备份前置可用，最新备份目录为 `wos4-artifacts/backups/wos4-demo-fullstack-20260611T195736/`。
- 已确认卡住后存在两个 runbook 进程，已清理。
- 已用 Chrome MCP 验证编辑器接管问题：
  - `/public/?...#/running` 外壳页当前为空 `#app`，无 iframe，无 `#page_edit_view_area`。
  - 顶层打开 `GetFileContent/.../index.html` 会加载脚本和 `#app-master-root`，但没有父窗口初始化，仍无编辑器 runtime。
- 已修正规则：登录用注入脚本/skill，登录后页面设计和预览用 Chrome MCP；Chrome MCP 必须先通过 runtime 健康检查，失败时停止并记录。
- 已修正 `.ai/skills` 内旧路径和 runbook 单元测试输出位置。

结论：

needs-change

### 0002 code-ai 请求 test-ai 重跑 WOS4 创建/布局流程

状态：needs-change

发起方：code-ai

接收方：test-ai

创建时间：2026-06-12

关联文件：

- `AGENTS.md`
- `.ai/docs/wos4-artifact-placement.md`
- `wos4-demo-page-fullstack-skill/runbook.js`
- `wos4-artifacts/backups/wos4-demo-fullstack-20260611T194342/`
- `wos4-artifacts/backups/wos4-demo-fullstack-20260611T194436/`

请求：

验证新增的 WOS4 备份规则、ini 配置、布局高度规范是否能在实际创建/布局流程中工作。

test-ai 反馈：

- `AGENTS.md` 已包含备份时机：新建前、修改前、保存提交后、预览验证后。
- `wos4.local.ini` 可读取，真实 ini 已被 Git 忽略。
- runbook 修正 `direct` 为 `direct://` 后，登录成功。
- 编辑器可打开，`preflight.json` 和 `before-edit.json` 已生成。
- 旧 runbook 在布局重建阶段仍不稳定，先是固定 root 查找失败，修正后又暴露根布局行增删 API 不稳定。
- 截图显示旧页面确实存在表格/图表高度和布局挤压问题，布局尺寸规范补充是必要的。
- 用户中断后，残留 runbook 进程已清理。

结论：

needs-change

### 0003 code-ai 请求 review-ai 检查 skill 迁移

状态：approved

发起方：code-ai

接收方：review-ai

创建时间：2026-06-12

关联文件：

- `.ai/skills/`
- `AGENTS.md`
- `MEMORY.md`

请求：

检查根目录 skill 是否已经迁移到 `.ai/skills/`，以及是否把明文密码带入 Git 管理范围。

review-ai 反馈：

- 已复制 9 个 skill 到 `.ai/skills/`。
- 已扫描 `.ai/skills/`，未发现 `<密码已脱敏>` 明文密码。
- `.ai/skills/wos4-demo-page-fullstack-skill/runbook.js` 使用 `WOS4_PASS || WOS_CONFIG.password`，真实 ini 仍由 `.gitignore` 排除。
- `AGENTS.md` 已只列出 `.ai/skills/` 路径，根目录同名 skill 已删除。

结论：

approved

### 0004 code-ai 请求 test-ai 验证 WOS4 人类导航 skill

状态：open

发起方：code-ai

接收方：test-ai

创建时间：2026-06-12

关联文件：

- `AGENTS.md`
- `.ai/instructions/wos4.md`
- `.ai/skills/wos4-login/SKILL.md`
- `.ai/skills/wos4-create-new-page/SKILL.md`
- `.ai/skills/wos4-human-navigation/SKILL.md`
- `MEMORY.md`

请求：

请验证新增的人类路径导航规则是否足够约束后续 WOS4 新建页面流程：登录后进入 KingStudio、产品管理、产品组装、页面设计器必须按可见菜单层级模拟人类操作，不能再用动态 URL 作为入口。

code-ai 已完成：

- 新增 `wos4-human-navigation` skill。
- 在 `AGENTS.md` 和 `.ai/instructions/wos4.md` 写入动态 URL 禁止作为入口的规则。
- 在 `wos4-login` 中记录 Chrome MCP profile 锁定时的兜底策略。
- 在 `wos4-create-new-page` 中要求从菜单层级进入并只把 URL 作为证据。

待验证：

- Playwright/Chrome MCP 后续 runbook 是否完全改为点击菜单进入。
- 主页面 `KingStudio_V20260514` 卡片点击需要继续定位可交互容器，不能回退到动态 URL。

追加反馈（2026-06-12）：

- 用户补充：产品管理页的产品卡片里有 `进入 / 修改 / 删除`，点击 `进入` 才能跳转到下一级。
- 已验证：点击主页面 `KingStudio_V20260514` 后顶层 URL 保持 `#/main`，需要递归检查 iframe；嵌套 KingStudio frame 出现产品管理页。
- 已验证：在产品卡片中通过 exact text `进入` 可进入下一级，出现 `建模管理 / 产品组装`。
- 已验证：`产品组装` 页能看到左侧 `产品 / Codex自动演示_0612`、右侧工具栏 `新建`。
- 已发现并修复 skill 错误：新建弹窗打开后第一个 input 是列表搜索框，不是名称字段；名称字段必须按 `placeholder="请输入名称"` 在 `.el-dialog` / `.el-overlay-dialog` 内定位。
- 已更新 `wos4-human-navigation`、`wos4-create-new-page`、`references/new-page-flow.md`、`WOS4_deep_test_notes.md` 和 `MEMORY.md`。
- 用户补充并已采纳为硬约束：WOS4 页面必须先布局再放组件。已更新 `AGENTS.md`、`.ai/instructions/wos4.md`、`wos4-layout-devtools-skill`、`wos4-demo-page-fullstack-skill`，要求布局阶段和组件阶段分离。
- 用户补充并已采纳为复用约束：不能为每个画面生成一份硬编码脚本；WOS4 画面频繁修改时，默认按人类路径打开已有页面，脚本应是参数化导航/编辑驱动，页面名、分组名和模式作为输入，动态 URL/guid 只作为证据保存。
- 会话连续性实测结果：同一 Chrome 会话中完成登录、人类路径打开已有页面、编辑器内写入组件、提交保存、预览新标签打开并切回编辑器继续排查；流程不再闪退式关闭重跑。
- 本轮测试通过项：预览 iframe 内按钮、输入框、表格、树和 canvas 出现；按钮点击后从 `切换数据：A / 0` 变为 `切换数据：B / 1`，表格从泵站 A/C 变为泵站 B/D。
- 本轮测试未通过项：预览中表格可见区域约 72px、canvas 约 33px，说明表格/曲线仍被放在错误短行或 wrapped col。后续 test-ai 应要求继续修布局高度，而不是重新登录重跑入口脚本。
- 追加验证（2026-06-12）：已在同一编辑器会话继续修复布局。通过 `RRow2.setColsNumber(3)` + `initColsCompose()` 生成 `RCol15/RCol16`，将树/表格/曲线放入第二行三列，提交保存后预览通过：表格主容器约 389x716，canvas 约 270x748，按钮联动 A->B 正常。

结论：

approved

### 0005 code-ai 请求 test-ai/review-ai 验证 GPT-5 实施路线手册

状态：open

发起方：code-ai

接收方：test-ai / review-ai

创建时间：2026-06-18

关联文件：

- `.ai/docs/wos4-gpt5-implementation-runbook.md`
- `.ai/docs/wos4-current-clients-manual-plan.md`
- `.ai/docs/wos4-client-release-roadmap.md`
- `WOS4_deep_test_notes.md`
- `MEMORY.md`

请求：

请验证新的实施路线是否足够指导低级模型继续推进 WOS4 前后端联通，重点检查：

- 是否把 `lk_客户端01_对象1` 明确为只读参考演示。
- 是否禁止修改非 `盛云_孙宇飞` 对象。
- 是否把执行顺序改为参考演示拆解、手册对照、个人对象复刻、正式预览验收、前后端 Call 验收。
- 是否包含阶段验收节点、失败停止条件和证据路径。

code-ai 已完成：

- 新增 GPT-5 执行合同文档。
- 在现有路线文档中增加入口链接和路线调整说明。
- 在 deep test notes 中记录“参考演示优先”的路线变更。

追加反馈（2026-06-18）：

- 用户补充了一条自己可跑通的真实组态链路：
  - `组态系统客户端0518 -> 管控树实例配置 -> 手工层级时空 -> 管控单元实例 -> 提交`
  - `数字孪生可视化 -> 客户端双击进入 -> 分组 -> 添加 -> 勾选精灵图名称 -> 首页`
  - `运维部署客户端_0518 -> 管控单元/数字孪生画面 -> 父到子部署启动`
- code-ai 已将该链路写入 `.ai/docs/wos4-current-clients-manual-plan.md` 和 `WOS4_deep_test_notes.md`，并在 `.ai/skills/wos4-config-client-screen-create/SKILL.md` 中标为“用户已验证、AI 待复核”的高优先级下一轮复现路线。
- 新约束：在 AI 自己跑通前，不得把这条链路错误标注为“已验证 skill”；但后续浏览器复现顺序必须优先切换到这条链路，不再继续围绕旧的空壳预览症状反复猜测。

结论：

pending

### 0006 code-ai 请求 test-ai / review-ai 验证蓝色客户端创建 skill

状态：open

发起方：code-ai

接收方：test-ai / review-ai

创建时间：2026-06-19

关联文件：

- `.ai/skills/wos4-blue-client-object-create/SKILL.md`
- `.ai/skills/wos4-object-create-verify/SKILL.md`
- `.ai/docs/wos4-current-clients-manual-plan.md`
- `WOS4_deep_test_notes.md`
- `wos4-artifacts/snapshots/noctiluca_webjs_object_create_2026-06-19.json`

请求：

请验证“蓝色客户端对象创建”是否已经从一次性探索沉淀为可复用 skill，重点检查：

- 是否明确区分外显改名节点 `盛云_孙宇飞_Noctiluca_客户端` 与内部运行仓库节点 `客户端1`
- 是否把“从外显节点创建会报 `仓库不存在`”记录为失败路径
- 是否把“从 `客户端1 / WebJS` 创建蓝色对象”记录为唯一当前已验证路径
- 是否把 `视图` 可能只在当前 `#/main` 页注入隐藏运行壳 iframe 这一点写成验收规则
- 是否明确当前完成线是“蓝色对象已可创建并运行”，而不是“纯桌面首页已自动同步显示”

### 0007 code-ai 请求 test-ai / review-ai 验证 skill 清理和命名规则

状态：open

发起方：code-ai

接收方：test-ai / review-ai

创建时间：2026-06-19

关联文件：

- `.ai\skills\wos4-blue-client-object-create\SKILL.md`
- `.ai\skills\wos4-object-create-verify\SKILL.md`
- `.ai\skills\wos4-config-client-screen-create\SKILL.md`
- `.ai\skills\wos4-button-variable-flow\SKILL.md`
- `.ai\skills\wos4-interaction-flow-skill\SKILL.md`
- `.ai\skills\wos4-meta-language-fu-create\SKILL.md`
- `.ai\skills\wos4-demo-page-fullstack-skill\runbook.js`
- `.ai\docs\wos4-current-clients-manual-plan.md`
- `.ai\docs\wos4-gpt5-implementation-runbook.md`
- `WOS4_deep_test_notes.md`

请求：

请验证本轮 skill 清理是否完成了这三件事：

1. 把蓝色客户端对象创建链收敛为唯一主 skill，不再让通用 object skill 和 config skill 重复维护同一段创建逻辑。
2. 把 `Noctiluca` 中间试错链从主 skill 的“现行步骤”中剥离，只保留最终有效路线和边界。
3. 把正式命名禁用产品名、临时代号使用边界、页面脚本中性前缀、原语言不链式调用等规则写入后续模型可直接读取的地方。

### 0008 code-ai 请求 test-ai / review-ai 验证建模客户端后台查询 Demo 持久化边界

状态：open

发起方：code-ai

接收方：test-ai / review-ai

创建时间：2026-06-20

关联文件：

- `WOS4_deep_test_notes.md`
- `MEMORY.md`
- `wos4-artifacts/snapshots/backend_querydemo_save_compile_0620.json`
- `wos4-artifacts/snapshots/backend_querydemo_customfunc_submit_0620.json`
- `wos4-artifacts/snapshots/backend_querydemo_parent_submit_0620.json`
- `wos4-artifacts/snapshots/backend_querydemo_reopen_verify_0620.json`
- `wos4-artifacts/screenshots/backend_querydemo_versions_final_0620.png`

请求：

请验证 `盛云_孙宇飞_后台_查询Demo_0618` 这条 backend smoke 链当前的真实结论是否记录准确，重点检查：

1. `查询Demo后台_CUSTOMFUNC` 的新增函数、保存、编译、提交版本是否已有充分证据，足以视为“自定义计算持久化成功”。
2. 父模型 `版本 4 / backend-querydemo-model-fields-and-customfunc-0620` 是否已经通过版本管理回读验证。
3. `业务事 -> 查询信息` 的成员名回读是否确实回退为 `成员1..成员5`，从而必须把“业务事成员名未持久化”标记为当前阻塞，而不能误报为已完成。
