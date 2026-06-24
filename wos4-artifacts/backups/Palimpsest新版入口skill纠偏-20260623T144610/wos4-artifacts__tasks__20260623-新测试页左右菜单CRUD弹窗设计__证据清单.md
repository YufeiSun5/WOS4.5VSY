# 证据清单

## 参考材料

| 类型 | 路径 | 说明 |
|---|---|---|
| 参考图 | `assets/参考图-人才管理考核页.png` | 用户提供的人才管理考核页视觉参考 |

## 门禁和快照

| 类型 | 路径 | 说明 |
|---|---|---|
| preflight | `snapshots/preflight-20260623T111805.json` | WOS4 任务门禁通过；工作区脏状态为警告，不阻止本设计任务 |

## 备份

| 类型 | 路径 | 说明 |
|---|---|---|
| 本地文件修改前备份 | `wos4-artifacts/backups/新测试页左右菜单CRUD弹窗设计-20260623T111805/` | 备份 `AI-INTERACTION-PANEL.md`、`MEMORY.md`，并记录任务目录新建前不存在 |
| 本地文件修改前备份 | `wos4-artifacts/backups/Palimpsest代号和双页面假设-20260623T112308/` | 备份任务文档、交互面板和记忆文件，用于记录用户指定代号和双页面优先验证假设 |
| 本地文件修改前备份 | `wos4-artifacts/backups/Palimpsest证据清单补记-20260623T112706/` | 备份本证据清单修改前版本 |
| 本地文件修改前备份 | `wos4-artifacts/backups/Palimpsest取消顶部菜单-20260623T113058/` | 备份任务文档、交互面板和记忆文件，用于记录取消顶部菜单、只保留左右两部分 |
| 本地文件修改前备份 | `wos4-artifacts/backups/Palimpsest重新创建项目和页面百分比-20260623T113544/` | 备份任务文档、交互面板和记忆文件，用于记录重新创建项目和左右页面不同百分比 |
| 本地文件修改前备份 | `wos4-artifacts/backups/Palimpsest登录skill阻塞-20260623T120549/` | 备份任务执行日志、证据清单和记忆文件，用于记录 browser-harness 接管成功但 wos4-login 返回账号/口令错误 |

## 浏览器和登录证据

| 类型 | 路径 | 说明 |
|---|---|---|
| 截图 | `wos4-artifacts/screenshots/palimpsest_harness_after_allow.png` | 用户允许远程调试后，browser-harness 可读取 WOS4 登录页 |
| 截图 | `wos4-artifacts/screenshots/palimpsest_login_probe.png` | 登录页输入框、按钮和页面状态探测截图 |
| 截图 | `wos4-artifacts/screenshots/palimpsest_login_skill_exact_result.png` | 按 `wos4-login` skill 执行登录后的结果截图；仍停留在登录页 |
| 运行输出 | 当前会话工具输出 | `browser-harness --doctor` 三项连接通过；登录请求返回提示 `用户名或口令错误` |

## 后续实施应补充

- 页面创建前基线记录。
- 编辑器 before/after JSON。
- 编辑器截图。
- 正式客户端截图。
- 按钮点击前后快照。
- 后端 CRUD 调用结果。
- 测试报告。
