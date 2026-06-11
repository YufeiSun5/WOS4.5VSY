# WOS4 规则

- WOS4 登录、导航、布局、组件、保存、提交、预览优先使用现有 WOS4 skill。
- 前台可见操作优先使用 Chrome MCP。
- Chrome MCP 不能处理运行时编辑时，才退回直连 Playwright。
- Playwright 访问 WOS4 时使用 `--proxy-server=direct://`。
- 页面修改不以编辑器内存状态为完成标准，必须提交并预览验证。
- 复杂页面修改前先导出模型，再改布局和组件。
