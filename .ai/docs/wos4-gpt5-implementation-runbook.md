# WOS4 GPT-5 实施路线手册

## 目的

本文件给低级模型使用。它不是一次性计划，也不是手册摘抄，而是 WOS4 demo 从参考样板到个人实现的执行合同。

当前路线改为：

```text
只读拆解已有演示 lk_客户端01_对象1
-> 结合手册确认它符合哪些平台规则
-> 对照我们自己的 盛云_孙宇飞 个人对象找差异
-> 只在 盛云_孙宇飞 命名空间内实施
-> 通过正式预览和前后端 Call 验收
-> 成功后再回收 skill
```

不要再从零硬推，也不要把手册当作已经验证的操作。

## 总原则

1. `lk_客户端01_对象1` 是参考演示，只读。
2. 任何没有 `盛云_孙宇飞` 的对象、时空、仓库、客户端、页面、模型，都不能修改、提交、更新版本、部署、启动、停止、删除或强制删除。
3. 参考演示只能做查看、打开、截图、读取运行态、读取属性、读取日志。打开属性弹窗后必须用取消或关闭退出，不能点确定。
4. `KingStudio_V20260514` 已废弃，不进入。
5. 进入 WOS4 客户端必须走可见菜单和桌面图标。动态 URL 只能作为证据；只有 UI 弹窗生成的正式预览链接可以复制后打开验证。
6. 当前前端开发入口以 `组态系统客户端0518` 为准；当前后端开发入口以 `时空功能开发` 的源语言/元语言 FU 为准。
7. 页面开发必须先布局，再放组件，再写变量和联动。
8. 前后端联通之前，先保证正式客户端能挂载页面。页面未挂载时禁止继续调按钮脚本。
9. `Call` 不支持显式传 `spaceTimeName` 或 `spaceTimeGUID` 来绕过时空约束；前端和后端必须处在同一可访问时空，或满足远程访问时空规则。
10. 每个阶段必须有证据文件、截图、结论。没有证据的成功不算成功。
11. 正式命名里不要出现 `codex`、`claudecode`、`copilot` 等产品名；正式对象用 `盛云_孙宇飞_<业务语义>_<日期或版本>`。
12. 临时试验代号可以使用非产品化的少见英文意象词，例如 `Eidolon`、`Noctiluca`，但它们只用于 pilot/过渡对象，不用于最终交付名。
13. 页面脚本和探针字段使用中性前缀，例如 `__wos4...`、`demo_...`、`temp_...`。
14. 原语言 / 元语言后端逻辑不要假设支持链式调用；优先拆成中间变量和分步语句。
15. `调试配置` 说明后端存在调试页入口，但在拿到断点 / 运行 / 观察证据前，不把它写成已验证 skill。

## 必读文件

每次开始执行前按顺序读取：

```text
D:\DEV_D\WOS4.5\AGENTS.md
D:\DEV_D\WOS4.5\.ai\skills\wos4-browser-harness\SKILL.md
D:\DEV_D\WOS4.5\.ai\skills\wos4-human-navigation\SKILL.md
D:\DEV_D\WOS4.5\.ai\skills\wos4-manual-to-skill\SKILL.md
D:\DEV_D\WOS4.5\.ai\skills\wos4-config-client-screen-create\SKILL.md
D:\DEV_D\WOS4.5\wos4-artifacts\docs\wos4-help-kb\AGENTS.md
D:\DEV_D\WOS4.5\wos4-artifacts\docs\wos4-help-kb\AI-ROUTE.md
D:\DEV_D\WOS4.5\wos4-artifacts\docs\wos4-help-kb\USAGE.md
```

按任务补读：

```text
后台 FU: wos4-meta-language-fu-create, wos4-meta-language-fu-release-package
部署启动: wos4-repository-package-deploy-start, wos4-runtime-package-update, wos4-object-create-verify
页面布局: wos4-layout-devtools-skill, wos4-component-persistence, wos4-button-variable-flow
```

## 手册依据

手册只给规则，不直接给 UI 自动化步骤。

已确认规则：

- `快速入门`: 元语言 FU 开发主链路是新建个人仓库、建元语言功能单元、编译、提交、生成拷贝、自启动 APP 配置、打包、部署、启动、在时空对象管理查看日志。
- `模型库`: 模型分编辑版本和历史版本；只有历史版本可以生成拷贝。
- `App引擎介绍`: App 对象通过 App 拷贝创建；接口调用主要用于前端调用后台；`Call` 不允许跨时空调用；查询没有时空约束。
- `JS函数_App引擎`: `Call(param, input)` 调后台 App 接口函数；参数包含 `cloudID`、`areaID`、`identifierType`、`id/name`、`funcName`、`params`，没有目标时空参数。
- `错误码_App引擎`: `-210133` 是目标 App 不存在，`-210139` 是时空不匹配，`-210134` 是 App 用户未登录或登录失败。
- `任务栏应用管理` 和 `应用图标管理`: 时空功能开发、时空对象管理是运行和开发主入口；WebJS/FU 运行后可能在桌面或任务栏出现图标。

## 当前已知对象

参考对象，只读：

```text
lk_客户端01
lk_客户端01_对象1
lk测试客户端1
lk_工厂
```

个人对象，可操作：

```text
盛云_孙宇飞_仓库
盛云_孙宇飞_元语言查询Demo_0617
盛云_孙宇飞_QueryDemo_0617
盛云_孙宇飞_时空_0617
盛云_孙宇飞_时空_0617_TOPV2
盛云_孙宇飞_前端Demo_0617
盛云_孙宇飞_客户端Demo_0617
盛云_孙宇飞_画面Demo_0617
```

## 阶段 0：会话和工具冒烟

目标：确认浏览器可接管，但不改变任何 WOS 对象。

操作：

```powershell
$env:Path = 'C:\Users\SunYufei\.local\bin;' + $env:Path
browser-harness --doctor
```

验收：

- `chrome running` 为 ok。
- `daemon alive` 为 ok。
- `active browser connections` 为 ok。
- 如果 optional 项失败，不阻塞。

证据：

```text
wos4-artifacts/snapshots/<日期>_doctor.txt
```

停止条件：

- Chrome 不可接管。
- 需要重启公共对象或公共客户端。

## 阶段 1：只读拆解参考演示

目标：弄清 `lk_客户端01_对象1` 是怎么跑起来的。

只读入口假设：

```text
主桌面
-> 时空对象管理
-> 左侧时空树查找 lk_客户端01 / lk测试客户端1
-> 功能页签 我创建的 / 全部
-> 查找 lk_客户端01_对象1
-> 只读查看 视图 / 日志 / 监视 / 编辑弹窗字段
```

也允许从桌面业务图标打开：

```text
主桌面
-> lk_客户端01 或 lk_客户端01_对象1 图标
-> 打开运行窗口
-> 递归读取 iframe 和运行态对象
```

严禁：

- 对参考对象点击保存、确定、提交、更新版本。
- 对参考对象启动、停止、部署、反部署、删除。
- 修改任何字段后关闭。

必须提取的信息：

```text
1. 对象所在时空路径
2. 对象类型：WebJS / 元语言 / 客户端 / 其他
3. 运行状态
4. 模型名称、模型 GUID、拷贝名称、拷贝 GUID、版本
5. 是否有桌面图标，点击图标打开什么窗口
6. 运行窗口 frame 树
7. 运行窗口文本、主要组件、页面名称
8. 是否存在 GetPageMngInfo、pageNameToSetPageMap、CLIENTRUNINSTANCE
9. 是否有首页/默认页/导航挂载信息
10. 前端是否调用后端：Call、Query、接口函数名、对象名
11. 后端对象是否在同一时空或远程访问时空
12. 日志里是否有 onCreate、接口调用或错误码
```

证据：

```text
wos4-artifacts/snapshots/reference_lk_client01_inventory.json
wos4-artifacts/screenshots/reference_lk_client01_desktop.png
wos4-artifacts/screenshots/reference_lk_client01_runtime.png
wos4-artifacts/screenshots/reference_lk_client01_object_mgmt.png
```

验收：

- 能说明 `lk_客户端01_对象1` 从哪个时空、哪个运行对象、哪个页面或客户端窗口启动。
- 能说明它有没有页面挂载、默认页或导航配置。
- 能说明它是否通过前端 Call 后端，或只是纯前端展示。

失败处理：

- 如果只能看到图标但打不开，记录图标状态和点击后网络请求。
- 如果打开窗口空白，记录 frame 树、console 可见错误、WebSocket 或 GetFileContent 请求。
- 如果 UI 阻塞，保存截图，不做破坏性关闭。

## 阶段 2：从参考演示抽象实现路线

目标：把参考对象的结构转换成我们的目标结构。

输出一个对照表：

```text
参考项                     我们的对应项
lk 运行时空                盛云_孙宇飞_时空_0617 或 TOPV2
lk 客户端对象              盛云_孙宇飞_客户端Demo_0617
lk 首页/默认页             盛云_孙宇飞_画面Demo_0617
lk 后端 App                盛云_孙宇飞_QueryDemo_0617
lk 前端调用方式            demo_query_button / 变量改变脚本
lk 发布/预览入口           数字孪生可视化 -> 预览链接
```

重点比较：

- 参考演示有没有 `首页` 标记。
- 参考演示正式运行时 `GetPageMngInfo()` 是否非空。
- 参考演示页面是否在 client shell 里通过 `SetPage` 或导航挂载。
- 参考演示对象所在时空和后端 App 所在时空是否一致。
- 参考演示是否需要自启动 APP 配置。

验收：

- 能列出我们当前缺失的字段或步骤。
- 能判断当前 `页面-1441151880758559638-不存在` 是首页缺失、版本映射失效、还是客户端未挂页面。

证据：

```text
wos4-artifacts/snapshots/reference_vs_sunyufei_gap_analysis.json
```

## 阶段 3：修复个人前端页面挂载

目标：让 `盛云_孙宇飞_客户端Demo_0617` 的正式预览先看到页面。

入口：

```text
主桌面
-> 组态系统客户端0518
-> 盛云_孙宇飞_前端Demo_0617
-> 数字孪生可视化
-> 盛云_孙宇飞_客户端Demo_0617
-> 画面列表
-> 盛云_孙宇飞_画面Demo_0617
```

优先排查：

```text
1. 画面列表的 首页 列是否设置
2. 客户端属性里是否有首页/默认页
3. 客户端是否有导航项或页面引用器
4. 客户端更新版本是否真的包含该页面最新历史版本
5. 正式预览链接是否引用了正确 clientGuid

本阶段要把“发布成客户端”理解为两层：

1. 包和对象层已经发布：
   - `提交 -> 拷贝 -> 自启动APP配置 -> 打包 -> 部署 -> 启动`
2. 客户端壳是否真的挂到了对的页面：
   - `客户端页面列表 -> 首页/默认页 -> 画面引用器 -> 更新版本 -> 正式预览`

第二层不通，就不能算“客户端发布成功”。
```

验收：

- 行内 `更新版本` 成功。
- 行内 `预览` 产生正式 `clientGuid` 链接。
- 打开正式链接不再弹 `页面-1441151880758559638-不存在`。
- 正式运行窗口中 `GetPageMngInfo()` 非空，或页面文本可见。
- 页面可见：顶部输入/按钮、左树、中表、右曲线。

停止条件：

- 还没挂页面时，不改按钮脚本。
- 找不到首页入口时，保存参考演示差异和 UI 截图，停在排查结论，不乱点更新或删除。
- 已经完成两轮“首页/默认页/画面引用器/更新版本/正式预览”排查，仍然只有旧错误重复出现，例如：
  - `页面-...-不存在`
  - `GetPageMngInfo() => {}`
  - `CLIENTRUNINSTANCE._data` 为空
  这时停止自动猜测，改为求助人类确认正确挂页方式。

求助人类时必须带上：

- 客户端名
- 画面名
- 正式预览链接是否还能生成
- `首页` 列当前可见状态
- 是否看到了 `画面引用器`
- 参考演示 `lk_客户端01_对象1` 的对应截图和差异说明

## 阶段 4：后端 FU 最小可调用验证

目标：确保后端对象真实运行且接口函数可被调用。

入口：

```text
主桌面
-> 时空功能开发
-> 盛云_孙宇飞_仓库
-> 盛云_孙宇飞_元语言查询Demo_0617
```

已知可复用路线：

```text
编辑 QueryDemoData
-> 提交
-> 生成拷贝
-> 自启动 APP 配置
-> 打包
-> 部署到个人时空
-> 启动
-> 时空对象管理查看已上线对象
-> 脚本日志验证 onCreate
```

2026-06-26 纠偏：`时空对象管理平台`只用于查看已上线对象、获取时空信息、日志、视图和调试；不得在其中创建或更新对象来补部署缺口。看不到对象时回到运维部署或模型/包版本链路。

验收：

- 后端对象在目标时空中运行。
- `onCreate` 日志可见。
- 接口函数名称、对象名、对象 ID/GUID 记录到快照。
- 若直接探针调用，`ret=0`，返回假数据。

失败判断：

- `-210133`: 当前调用方看不到目标 App，先查时空和对象名。
- `-210139`: 时空不匹配。
- `-210134`: 用户登录或权限问题。

## 阶段 5：前端 Call 后端

前置闸门：

- 阶段 3 已通过，正式客户端已挂页面。
- 阶段 4 已通过，后端对象已运行。

目标：按钮或变量改变脚本调用后端 `QueryDemoData`，并刷新表格和曲线。

推荐实现约束：

- 按钮、打开时、定时入口只改变中转变量。
- 业务逻辑放变量改变脚本，便于复用。
- 脚本中记录 `ret`、`errorcodes`、`returneddata`。
- 页面脚本中不要使用顶层 `await`，用 `Call(...).then(...).catch(...)`。

验收：

- 点击前记录表格和曲线状态。
- 点击后 `Call` 返回 `ret=0`。
- 表格数据来自后端返回值。
- 曲线同步刷新。
- 按钮文案或状态变量显示成功。
- 截图和 JSON 记录点击前后差异。

证据：

```text
wos4-artifacts/snapshots/frontend_backend_call_verify.json
wos4-artifacts/screenshots/frontend_backend_before_click.png
wos4-artifacts/screenshots/frontend_backend_after_click.png
```

## 阶段 6：正式发布和回归

目标：证明不是编辑器预览，而是真实运行入口可用。

验收：

- 重新登录后仍能找到入口。
- 正式预览链接可打开。
- 页面不报页面不存在。
- 表格、树、曲线高度正常。
- 前端按钮能拿到后端数据。
- 关闭再打开仍可用。

必须记录：

```text
入口路径:
对象:
时空:
仓库包:
客户端:
画面:
后端 App:
测试时间:
测试结果:
失败边界:
```

## 阶段 7：Skill 回收

只有通过验收后才新增或修订 skill。

待回收 skill：

```text
wos4-reference-demo-readonly-inspect
wos4-config-client-page-mount
wos4-frontend-backend-call-verify
wos4-release-regression-checklist
```

不能回收的情况：

- 只看了手册，没有 UI 证据。
- 只看了截图，没有运行态数据。
- 只在编辑器里成功，正式预览失败。
- 只在 `lk_` 参考对象里看到，但未在 `盛云_孙宇飞` 个人对象复现。

## 低级模型执行汇报模板

每完成一个阶段，必须用这个格式汇报：

```text
阶段:
读取的 skill:
菜单路径:
只读/写入范围:
点击目标:
网络或 iframe 证据:
截图:
快照:
结论:
是否通过验收:
下一步:
```

如果失败：

```text
失败阶段:
失败动作:
等待多久:
是否有网络请求:
frame 文本:
toast/alert/错误码:
是否触碰非盛云对象:
是否需要用户介入:
下一步建议:
```

## 当前下一步

下一位执行模型不要先改 `盛云_孙宇飞_画面Demo_0617` 的按钮脚本。

先做：

```text
只读打开 lk_客户端01_对象1
-> 截图和快照
-> 拆对象/时空/页面挂载/调用方式
-> 输出 reference_vs_sunyufei_gap_analysis.json
-> 回到 盛云_孙宇飞_客户端Demo_0617 只读检查 首页 / 画面引用器 / 默认页
-> 若两轮排查后仍不能裁决，立即求助人类确认正确挂页路径
```

确认参考演示的首页和页面挂载方式后，再修我们的客户端页面挂载。
