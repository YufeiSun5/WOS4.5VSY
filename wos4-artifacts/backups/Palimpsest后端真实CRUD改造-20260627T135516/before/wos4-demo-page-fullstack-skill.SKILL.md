---
name: wos4-demo-page-fullstack
description: WOS4 可用演示页构建和回归。用于创建标题、按钮/搜索、表格、曲线图组成的人类可读页面，并验证布局、样式、数据持久化、按钮变量联动、提交和预览。
---

# WOS4 演示页构建

## 适用场景

当用户要求“别挤在一起”“做一个可用页面”“保存并预览”“测试组件属性和交互”时使用。

前置 skill：

- 登录：`D:\DEV_D\WOS4.5\.ai\skills\wos4-login\SKILL.md`
- 布局：`D:\DEV_D\WOS4.5\.ai\skills\wos4-layout-devtools-skill\SKILL.md`
- 持久化：`D:\DEV_D\WOS4.5\.ai\skills\wos4-component-persistence\SKILL.md`
- 样式：`D:\DEV_D\WOS4.5\.ai\skills\wos4-style-config\SKILL.md`
- 按钮联动：`D:\DEV_D\WOS4.5\.ai\skills\wos4-button-variable-flow\SKILL.md`

## Layout Authority

本 skill 不再维护自己的布局规则。

布局的唯一有效来源是：

- `D:\DEV_D\WOS4.5\.ai\skills\wos4-layout-devtools-skill\SKILL.md`

这里的职责改为：

- 在布局已经稳定后做组件、样式、变量和交互回归
- 验证保存、重开、预览、联动
- 记录失败边界

## 布局尺寸要求

本节只保留调用约束，不再定义布局细节：

- 必须先完成布局，再放组件。
- 任何高度、宽度、命名、rowsManager 重写规则，都以 `wos4-layout-devtools-skill` 为准。
- 本 skill 中历史提到的 `标题 + 搜索 + 表格 + 曲线` 只是演示页业务目标，不是布局实现规范。

推荐执行顺序：

1. 先按 `wos4-layout-devtools-skill` 完成布局阶段。
2. 重新读取 `comMap.$Children`，确认目标槽位为空且尺寸正确。
3. 组件阶段：放输入框、按钮、树、表格、图表。
4. 配置阶段：写 `detailConfig/styleConfig/linkList` 和页面变量。
5. 提交预览：验证高度、可见性和按钮联动。

## 浏览器控制边界

本流程分两段：

- 登录：使用 `wos4-login` 的脚本注入或原生 value setter，成功到 `#/main` 即停止登录动作。
- 页面设计和验证：使用 Chrome MCP 接管编辑器和预览页。

Chrome MCP 接管编辑器前必须先验证：

- 页面不是空 `#app`。
- 不是顶层直接打开的 `GetFileContent/.../index.html`。
- `#page_edit_view_area.__vue__._data.comMap.$Children` 存在且非空。

如果接管检查失败，记录到 `wos4-artifacts/snapshots/`，不要继续改布局，也不要重新登录。

## 组件配置原则

不要只做运行态赋值。需要保存后有效时：

- 表格：`detailConfig = "this.table({ columns, totalData })"`
- 图表：`detailConfig = "option=" + JSON.stringify(option)`
- 样式：`styleConfig` + `#domId`
- 按钮事件：`linkList[0].enable = true` + `linkList[0].script`

## 页面精灵图端到端流程

2026-06-27 Palimpsest 页面精灵图开发后，当前推荐顺序如下：

```text
建模系统客户端
-> 目标前端模型
-> 图形模型 / 页面精灵图
-> 编辑页面精灵图
-> 布局阶段
-> 组件阶段
-> 持久化脚本和样式阶段
-> 顶部工具栏提交
-> 顶部工具栏预览
-> 在预览页真实点击按钮验证
```

关键约束：

- 布局规则只读 `wos4-layout-devtools-skill`。本 skill 不定义新的 RRow/RCol 真相。
- 页面精灵图列表中的 `编辑` 才进入页面编辑器；不要把模型列表旧文本或外层 `GetFileContent` 当成页面编辑器。
- 进入页面编辑器后，必须确认内层 iframe 存在 `#page_edit_view_area.__vue__._data.comMap.$Children`。
- 先布局后组件。布局完成后重新读取 `comMap.$Children`，再向命名槽位放 `ElementInput / ElementButton / ElementTable / ElementChart / ElementNavmenu` 等组件。
- 左右框架页先固定整体尺寸和分区比例，再放菜单。Palimpsest 当前采用 `Menu_18` 作为左侧页面精灵图、`Content_82` 作为右侧内容页；右侧应是一整块容器，不要再上下切碎。菜单项数据放在页面打开脚本或页面变量里初始化，避免把每个菜单项散落硬编码到组件属性。
- 复杂表格建议用已有表格组件承载基础表头/分页，再用持久化脚本增强展开行、操作按钮、二级菜单。不要先假设表格有原生“更多下拉菜单”；先用运行态 probe 读取 `ElementTable` 实例方法和 `linkList`。
- 表格、图表、按钮、输入框的保存后效果以 `detailConfig / styleConfig / linkList` 为准，不以当前 runtime 临时赋值为准。
- 提交/预览优先点编辑器顶部工具栏。Palimpsest 实测顶部 `预览` 会新开 `public/index.html ... runModelName=PalimpsestContent_82` tab。
- 预览 tab 选择不能简单取最后一个 tab。应按 URL 中的 `runModelName`、新 `clientnumber` 或页面文本确认。
- 预览页顶层 `body` 可能为空，必须进入预览 iframe 读取文本、按钮、表格、canvas。
- 如果按钮要调后端，必须在预览页真实点击可见按钮，再比较按钮文案、表格内容、console/message 和 `ret`。不要只用 raw iframe 控制台调用作为验收。
- 预览页按钮能返回 `ret=0` 只证明当前运行对象版本可调用；如果刚刚在建模层修改了后端函数，还需要提交模型、生成/更新运行包、部署/启动后，才能证明预览页调用到了新版本。

Palimpsest backend smoke 已验证：

```text
页面 = PalimpsestContent_82
按钮 = Backend Smoke
返回 = Smoke ret=0 data="{\"ok\":true,\"code\":\"OK\",\"message\":\"success\"..."
```

参数规则：

```js
var inParams = new StringMap({})
inParams._insert("action", "query", "string")

var callInput = new StringMap({
  identifierType: 2,
  name: "PalimpsestBackend_CUSTOMFUNC_CUSTOMFUNC@PalimpsestBack_0626R2",
  funcname: "QueryAssessmentRecords",
  params: [new Variant(inParams)]
})
```

如果后端函数元数据是 `stringMap<var> strmapPara`，`params: []` 会因为入参数量/类型不匹配而失败。

页面实施检查表：

1. 布局阶段：只做 `RContainer/RRow/RCol`、百分比、固定高度、剩余高度和槽位命名；确认同行可见列逻辑宽度和 `<=100`。
2. 组件阶段：按槽位放组件；表格和图表父容器要有可见高度，按钮和输入框不能靠 runtime 临时移动救场。
3. 数据阶段：假数据放页面打开脚本、页面变量或统一 helper 中；表格行、树节点、菜单项从 helper 生成，避免把同一份数据写进多个组件。
4. 交互阶段：按钮使用 `linkList[0].enable=true` 和脚本；二级菜单使用相对触发按钮的 DOM rect 定位，预览页验证菜单和按钮无重叠。
5. 保存提交：保存后重读编辑器 runtime，提交后观察 toast/弹窗；遇到内层 `版本提交` dialog 要在 worker iframe 内处理。
6. 预览验证：重新打开预览，确认主文本、表格行数、展开行、二级菜单、图表 canvas 和按钮点击结果。
7. 后端联调：先 `Backend Smoke`，再替换真实 Query；真实 CRUD 必须记录 `ret/errorcodes/output`，失败也返回给前端。

## 已验证交互

当前已验证：

- 初始预览：按钮 `切换数据：A / 0`，表格显示 A 区 2 行。
- 点击一次：按钮变 `切换数据：B / 1`，表格显示 B 区 2 行，图表刷新。
- 点击两次：按钮变 `切换数据：ALL / 2`，表格显示 4 行，图表刷新。

证据：

- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\wos4_interaction_verify.json`
- `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\wos4_interaction_preview_verify.png`

## 当前可复用脚本

根目录中已验证脚本：

- `wos4-write-submit-once.js`：基础页面。
- `wos4-apply-style-test.js`：样式应用。
- `wos4-verify-style-test.js`：样式验证。
- `wos4-apply-interaction-demo.js`：按钮变量联动页面。
- `wos4-verify-interaction-demo.js`：预览点击验证。

运行脚本时设置：

```powershell
$env:WOS4_PASS = "<用户提供的密码>"
node wos4-apply-interaction-demo.js
node wos4-verify-interaction-demo.js
Remove-Item Env:WOS4_PASS
```

不要把密码写进脚本文件。

## 单元测试状态

详细测试表见：

- `D:\DEV_D\WOS4.5\.ai\skills\wos4-demo-page-fullstack-skill\unit-tests.md`

已经通过：

- 基础布局。
- 表格持久化。
- 图表持久化。
- 样式持久化。
- 预览页按钮变量联动。

仍可继续扩展：

- 数据源对象。
- 定时器。
- 输入框触发过滤。
- 更复杂的嵌套布局。

## 最终验收

完成一个 WOS4 演示页时，必须提供：

- 修改前备份或新建前基线记录。
- 提交成功证据。
- 编辑页重开快照。
- 预览页截图。
- 表格和图表实际高度检查结果。
- 若有交互，点击前后快照。
- 更新 `WOS4_deep_test_notes.md`。
