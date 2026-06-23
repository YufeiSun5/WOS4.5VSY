# 0004 code-ai 请求 test-ai 验证 WOS4 人类导航 skill

迁移说明：本文件由旧 `AI-INTERACTION-PANEL.md` 拆分而来。历史字段保持原样；后续过程反馈请优先写入关联任务工作包的 `events/` 目录。
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
