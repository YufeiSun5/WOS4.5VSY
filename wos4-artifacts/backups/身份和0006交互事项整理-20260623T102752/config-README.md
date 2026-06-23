# `wos4-artifacts/config`

本机配置目录。

用于保存 WOS4 本机连接示例、本地真实 ini 和浏览器自动化 profile。

规则：

- `wos4.local.example.ini` 可以提交。
- `wos4.local.ini` 不进 Git。
- `[identity]` 段用于声明当前配置属于哪个开发人员和工作区，至少填写 `developer_name`、`workspace_name`。
- `[wos4]` 段只放开发人员日常登录 WOS4.5 的地址、用户名和密码。
- 运维、部署、调试访问等账号放到 `[ops]`、`[debug_access]` 等独立段。
- 执行 WOS4 操作前必须核对 `developer_name`、`url`、`username` 与当前用户和目标环境一致。
- 如果 ini 与当前任务不符、缺字段、指向错误环境或账号不是当前开发人员，必须停止操作并报告 `blocked`。
- 浏览器 profile 不进 Git。
- 密码、Cookie、Token 不写入脚本和文档。
