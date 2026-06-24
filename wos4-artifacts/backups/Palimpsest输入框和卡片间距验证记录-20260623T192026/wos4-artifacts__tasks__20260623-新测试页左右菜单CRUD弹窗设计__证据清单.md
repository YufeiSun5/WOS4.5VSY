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
| 本地文件修改前备份 | `wos4-artifacts/backups/Palimpsest新版入口skill纠偏-20260623T144610/` | 备份相关 skill、任务文档、交互事项和记忆文件，用于记录新版入口名和 Palimpsest 应从建模系统客户端起步 |

## 浏览器和登录证据

| 类型 | 路径 | 说明 |
|---|---|---|
| 截图 | `wos4-artifacts/screenshots/palimpsest_harness_after_allow.png` | 用户允许远程调试后，browser-harness 可读取 WOS4 登录页 |
| 截图 | `wos4-artifacts/screenshots/palimpsest_login_probe.png` | 登录页输入框、按钮和页面状态探测截图 |
| 截图 | `wos4-artifacts/screenshots/palimpsest_login_skill_exact_result.png` | 按 `wos4-login` skill 执行登录后的结果截图；仍停留在登录页 |
| 运行输出 | 当前会话工具输出 | `browser-harness --doctor` 三项连接通过；登录请求返回提示 `用户名或口令错误` |

## 路线纠偏证据

| 类型 | 路径 | 说明 |
|---|---|---|
| 截图 | `wos4-artifacts/screenshots/palimpsest_kingstudio_after_refresh.png` | 刷新后 `KingStudio_V20260617` 可进入产品管理页 |
| 截图 | `wos4-artifacts/screenshots/palimpsest_kingstudio_products_probe2.png` | 产品管理页包含产品级 `新建`；用户已纠正该入口不是 Palimpsest 新项目创建入口 |

## 平台建模和页面精灵图证据

| 类型 | 路径 | 说明 |
|---|---|---|
| 备份记录 | `wos4-artifacts/backups/Palimpsest平台建模创建-20260623T151221/` | 创建前记录目标分组、模型名、操作者、工具和配置摘要 |
| 快照 | `wos4-artifacts/snapshots/palimpsest_modeling_models_created_20260623T151221.json` | 建模系统模型列表包含 Palimpsest 前端/后台两个新模型 |
| 截图 | `wos4-artifacts/screenshots/palimpsest_modeling_models_created_20260623T151221.png` | 前台 Chrome 屏幕截图，记录模型创建后状态 |
| 快照 | `wos4-artifacts/snapshots/palimpsest_page_sprites_created_20260623T151221.json` | 前端模型页面精灵图列表包含 `PalimpsestMenu_18` 与 `PalimpsestContent_82`，并记录菜单页编辑器 iframe ready |
| 截图 | `wos4-artifacts/screenshots/palimpsest_page_editor_menu_open_20260623T151221.png` | `PalimpsestMenu_18` 页面编辑器已打开的前台截图 |

## 双页面布局落地证据

| 类型 | 路径 | 说明 |
|---|---|---|
| 备份记录 | `wos4-artifacts/backups/Palimpsest双页面布局落地-20260623T155217/` | 本轮更新任务文档、深测记录和记忆前的本地备份 |
| 快照 | `wos4-artifacts/snapshots/palimpsest_menu_pagesize_resynced_20260623T154325.json` | `PalimpsestMenu_18` 页面大小 `346x1080`、根容器和两行列同步后的结构 |
| 截图 | `wos4-artifacts/screenshots/palimpsest_menu_pagesize_resynced_20260623T154325.png` | `PalimpsestMenu_18` 按 18% 宽度缩放显示的编辑器截图 |
| 快照 | `wos4-artifacts/snapshots/palimpsest_menu_submit_20260623T154443.json` | 菜单页提交捕获：`保存成功`，同时 `生成历史版本失败 -19500` |
| 截图 | `wos4-artifacts/screenshots/palimpsest_menu_submit_20260623T154443.png` | 菜单页提交后的编辑器截图 |
| 快照 | `wos4-artifacts/snapshots/palimpsest_content_layout_width_fields_20260623T155118.json` | `PalimpsestContent_82` 页面大小 `1574x1080`、三行布局和修正后列宽 |
| 截图 | `wos4-artifacts/screenshots/palimpsest_content_layout_width_fields_20260623T155118.png` | 内容页三行布局修正后的编辑器截图 |
| 快照 | `wos4-artifacts/snapshots/palimpsest_content_submit_20260623T155217.json` | 内容页提交捕获：`保存成功`，同时 `生成历史版本失败 -19500` |
| 截图 | `wos4-artifacts/screenshots/palimpsest_content_submit_20260623T155217.png` | 内容页提交后的编辑器截图 |
| 快照 | `wos4-artifacts/snapshots/palimpsest_content_reopen_verify_20260623T155508.json` | 内容页关闭后重新打开验证：`1574x1080`、三行列宽均保持 |
| 截图 | `wos4-artifacts/screenshots/palimpsest_content_reopen_verify_20260623T155508.png` | 内容页重开验证截图 |
| 快照 | `wos4-artifacts/snapshots/palimpsest_menu_height_fixed_20260623T155651.json` | 菜单页第二行列高度修正和再次保存证据 |
| 截图 | `wos4-artifacts/screenshots/palimpsest_menu_height_fixed_20260623T155651.png` | 菜单页高度修正后截图 |
| 快照 | `wos4-artifacts/snapshots/palimpsest_menu_reopen_after_height_fix_20260623T155802.json` | 菜单页关闭后重新打开验证：`346x1080`、两行高度 `72/1008` 保持 |
| 截图 | `wos4-artifacts/screenshots/palimpsest_menu_reopen_after_height_fix_20260623T155802.png` | 菜单页重开验证截图 |

## 后续实施应补充

- 复查 `PalimpsestMenu_18` 和 `PalimpsestContent_82` 版本管理，确认 `-19500` 后是否仍有可用历史版本。
- 正式客户端截图。
- 按钮点击前后快照。
- 后端 CRUD 调用结果。
- 测试报告。
