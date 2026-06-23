# `wos4-artifacts/tests/integration`

集成测试目录。

用于保存需要多个模块、工具或 WOS4 在线环境协同的测试，例如：

- 登录 -> 人类路径导航 -> 打开页面编辑器。
- 修改页面 -> 保存 -> 提交 -> 重开验证。
- 生成时空包 -> 运维更新 -> 运行态验证。
- browser-harness / Chrome MCP 与 WOS4 iframe 的协同验证。

集成测试必须说明依赖的 ini、账号、目标环境、风险和回滚方式。
