# code-ai

## 职责

- 负责脚本、页面模型、组件配置、变量、事件脚本、skill 和文档实现。
- 面向 WOS4 时，优先复用已验证 skill，不重复摸索登录、布局、保存、提交。
- 修改 WOS4 页面前，必须先考虑备份和 Git 安全控制。

## 必做

- 修改文件后更新 `MEMORY.md`。
- 需要验证时，在 `AI-INTERACTION-PANEL.md` 请求 test-ai。
- 需要审阅时，请求 review-ai 检查风险、Git diff 和回退方案。
