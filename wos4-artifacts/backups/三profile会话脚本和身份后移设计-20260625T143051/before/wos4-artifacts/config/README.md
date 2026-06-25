# `wos4-artifacts/config`

本机配置目录。

用于保存 WOS4 本机连接示例、本地真实 ini 和浏览器自动化 profile。

规则：

- `wos4.local.example.ini` 可以提交。
- `wos4.local.ini` 不进 Git。
- 当前本机工作区约定开发人员为 `孙宇飞`；本机 `wos4.local.ini` 的 `[identity] developer_name` 应填写 `孙宇飞`。
- `[identity]` 段用于声明当前配置属于哪个开发人员和工作区，至少填写 `developer_name`、`workspace_name`。
- `[wos4]` 段放 WOS4.5 共享入口、默认账号顺序和锁文件路径；旧版 `username/password` 字段只作为单账号兼容入口保留。
- 多账号放在 `[wos4.account.<账号别名>]` 段，例如 `wos4.account.sun_yufei`、`wos4.account.xiang_xuezhi`；密码只能保存在真实 `wos4.local.ini`，不能写入示例、脚本、文档或日志。
- 并发会话槽放在 `[wos4.session.<槽位>]` 段，例如 `slot1`、`slot2`；槽位只绑定默认账号和浏览器隔离信息，不绑定前端或后端职责。
- 登录前必须通过 `wos4-artifacts/scripts/wos4-lock.ps1 -Action AcquireAccount` 申请账号锁；账号池用尽时必须停止并报告 `blocked`，不得重复登录已锁账号。
- WOS4 操作结束或当前 AI 不再使用该账号时，必须通过 `wos4-lock.ps1 -Action ReleaseAccount` 归还账号使用权。
- 保存、提交、发布同一 WOS4 页面、模型、函数、客户端或部署对象前，应通过 `wos4-lock.ps1 -Action AcquireObject` 申请对象锁，完成后释放对象锁。
- 运维、部署、调试访问等账号放到 `[ops]`、`[debug_access]` 等独立段。
- 执行 WOS4 操作前必须核对 `developer_name`、`url`、`username` 与当前用户和目标环境一致。
- 如果 ini 与当前任务不符、缺字段、指向错误环境或账号不是当前开发人员，必须停止操作并报告 `blocked`。
- 浏览器 profile、账号锁本地状态文件和真实 ini 不进 Git。
- 密码、Cookie、Token 不写入脚本和文档。
