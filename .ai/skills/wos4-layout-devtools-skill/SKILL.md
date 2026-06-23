---
name: wos4-layout-devtools
description: WOS4 唯一有效的布局 skill。用于把用户需求转成 RContainer/RRow/RCol 布局树，优先通过 rowsManager 数据树修改布局、命名对象、设置尺寸策略，并在布局稳定后交给其他 skill 放组件。
---

# WOS4 需求驱动布局

## 适用场景

当用户要求根据业务需求设计页面结构时使用，例如：

- 顶部标题 + 搜索区 + 表格 + 曲线。
- 左树右表。
- 上筛选下图表。
- 左右分栏，中间再嵌套上下结构。
- 仪表盘、列表详情、主从页面。

需要登录先用：

- `D:\DEV_D\WOS4.5\.ai\skills\wos4-login\SKILL.md`

## 唯一权威

本 skill 是当前项目里唯一有效的布局 skill。

含义：

- AI 只能从这里读取布局规则。
- 其他 skill 可以引用布局 skill，但不能再各自维护一套布局真相。
- 其他 skill 中出现的旧布局示例、旧 `RCol` 编号、旧 2x2/3 列示意，只能当历史证据，不能当现行规则。
- 如果本 skill 与其他文件冲突，以本 skill 为准，并回头修正文档。

## 运行时模型

WOS4 布局真实结构是：

```text
RContainer -> RRow -> RCol -> object
```

关键规则：

- 一个 `RCol` 基本就是一个单子槽。
- 空列可以放组件或子布局。
- 已有组件的列不能再直接放布局；要先清空。
- 嵌套布局的方式是：先把 `RContainer` 放进空 `RCol`，再在子容器里继续切行列。
- 必须先完成全部布局结构和尺寸策略，再放业务组件。布局阶段不要创建输入框、按钮、树、表格、图表。
- 组件放置前必须重新读取 `comMap.$Children`，用最新的 `RRow/RCol` key 和尺寸数据作为目标。
- 当前最可靠的结构源不是旧脚本里缓存的 `kids.RRow*` 引用，而是 `RContainer.data.rowsManager` 这棵数据树。
- 长期可读性依赖对象命名，不依赖运行时 key。`RCol15` 这类 key 只在当前会话临时使用，提交后应通过命名对象重新识别。

完整属性映射见：

- `D:\DEV_D\WOS4.5\.ai\skills\wos4-layout-devtools-skill\references\layout-properties.md`

## 操作顺序

1. 先把用户需求转成中立布局树，不要一上来依赖 `RCol11` 这种运行时名字。
2. 判断顶层需要几行、每行几列、哪些区域需要嵌套。
3. 打开编辑器 iframe。
4. 定位 `#page_edit_view_area.__vue__._data.comMap.$Children`。
5. 优先读取目标容器的 `data.rowsManager`，判断是“增量改”还是“按 blueprint 重写”。
6. 只执行布局：创建/复用 `RContainer/RRow/RCol`，设置行高、列宽、gap、offset、嵌套容器，并给容器/行/列命名。
7. 重新读取 `comMap.$Children` 和目标容器 `data.rowsManager`，导出布局快照，确认目标槽位为空且尺寸策略正确。
8. 保存并提交布局；跨会话继续时，必须先验证布局已持久化。
9. 再进入组件阶段，使用平台原生插入路径：`targetCol.addChild(null, [clone], "drag")`。
10. 放置组件并配置持久化属性。
11. 保存、重开、预览截图验证。

脚本复用要求：

- 布局脚本应接收“布局树/区域定义”作为输入，不为某个画面写死 `RCol11/RCol12/RCol6`。
- 可以在运行时发现当前 `RRow/RCol` key，并把发现结果写入本次快照；这些 key 只能在同一 runtime 的组件阶段临时使用。
- 频繁修改已有画面时，先按人类路径打开已有页面，再做 before 快照，然后基于当前结构增量调整或明确重建；不要默认新建一个页面。
- 如果页面结构不符合目标布局，先完成布局阶段并保存/提交，再进入组件阶段；同一 runtime 连续完成时也必须在布局后重新读取 `comMap.$Children`。
- 页面开发必须保持编辑器会话连续。不要每改一次就关闭浏览器、重跑完整登录/导航脚本；那会丢失未提交的 runtime 状态，也不符合人工开发流程。
- 标准迭代是：打开已有页面 -> 修改 -> 提交保存 -> 打开预览验证 -> 回到同一个编辑器继续修改。只有登录态失效、编辑器崩溃、runtime 不可恢复时，才重新执行登录和菜单导航。
- 自动化脚本只能作为“当前会话里的操作助手”，不能替代持续编辑会话。执行完布局/组件写入后应停留在编辑器或预览结果上，等待下一轮调整，而不是立即退出。
- 布局名必须可读。对人类没有命名习惯的画面，AI 要主动补命名，至少命名根容器、顶层行、业务列、嵌套容器和主区域行列。

## 命名规则

布局对象命名优先表达职责，不表达运行时 key。

推荐：

- 根容器：`RootLayout` / `RootShell`
- 顶栏行：`TopBarRow` / `HeaderRow`
- 顶栏列：`TitleCol`、`SearchInputCol`、`SearchButtonCol`、`ReserveCol`
- 主内容承载：`ContentHostCol`、`MainContentContainer`
- 数据区：`TableAreaRow`、`TableAreaCol`、`ChartAreaRow`、`ChartAreaCol`
- 预埋隐藏槽位：`ReservedColA/B/C...`

不要使用：

- `新布局1`
- `容器2`
- `行3`
- `列4`

原因：

- key 会漂移，名字才是跨会话的人类锚点。
- 后续组件 skill、变量 skill、验收脚本都需要靠名字快速定位。

## 先布局后组件硬约束

WOS4 页面构建分两个阶段，不能混在一个无校验脚本块里完成：

```text
阶段 A：布局
RContainer/RRow/RCol -> 行数/列数 -> 高度/宽度策略 -> gap/offset -> 布局快照

阶段 B：组件
空 RCol -> addChild 组件 -> detailConfig/styleConfig/linkList -> 提交 -> 预览
```

禁止：

- 一边增删行列一边向列中放表格、图表、树、输入框、按钮。
- 在 `RContainer.rowsManager`、`RRow.colsManager` 还不稳定时放组件。
- 用旧的 `RCol` 引用继续放组件；布局变更后必须重新取 `kids`。
- 为了补布局而清空已有组件列，除非已备份并明确这是重建页面。

布局阶段验收：

- 记录实际 `RRow/RCol` key。
- 记录每行高度策略和高度。
- 记录每列宽度策略和宽度。
- 记录树、表格、图表目标槽位为空且高度可用。
- 如果布局阶段结束后要关闭或重开编辑器，必须先提交保存布局；否则重新打开后 `RCol` key 和尺寸可能回到旧状态，组件阶段不能复用未提交的布局快照。
- 如果不提交布局就继续做组件，必须在同一个编辑器 runtime 中重新读取 `comMap.$Children` 后立即放组件，不得跨会话使用旧 key。

## 2026-06-18 已验证主结论

在 `盛云_孙宇飞_前端_查询Demo_0618 -> 查询列表` 上，已经实测确认：

- `RContainer1.data.rowsManager` 是当前页最可靠的布局真相源。
- 根容器的 `setRowsNumber(3)`、`addRow()`、`handleDeleteRows()` 在这页不可靠，不能当主编辑入口。
- 直接重写 `RContainer1.data.rowsManager` 可以恢复顶层布局。
- 直接读取/写入 `RContainer2.data.rowsManager` 可以恢复嵌套布局。
- 用代码清空组件、提交保存、再用 `rowsManager` 恢复“布局-only”状态可行。
- 恢复后再给容器/行/列命名并提交保存可行。

因此当前默认策略改为：

1. 先导出 before 快照和 screenshot。
2. 从当前 runtime 抽取 blueprint。
3. 需要重建时，优先重写目标 `RContainer.data.rowsManager`，不要先赌 `addRow/addCol`。
4. 重建后立即命名对象。
5. 再设置高度、宽度、背景、边框等外观属性。
6. 提交保存。
7. 重开验证命名和尺寸仍在。

只有当某页实测证明 `addRow/addCol/handleDelete*` 稳定时，才允许降级使用这些 API 做增量修改。

## 编辑器定位

编辑器 iframe URL 包含：

```text
94054fd1-9b20-463a-8372-b69776349847_107/index.html
```

运行时入口：

```js
const view = document.getElementById("page_edit_view_area").__vue__
const kids = view._data.comMap.$Children
```

Chrome MCP 接管检查：

```js
const view = document.getElementById("page_edit_view_area")?.__vue__
const kids = view?._data?.comMap?.$Children
Boolean(view && kids && Object.keys(kids).length)
```

只有这个检查为真，才能继续改布局。若 `/public/?...#/running` 页面只有空 `#app`，或直接打开 `GetFileContent/.../index.html` 只有 `#app-master-root`，说明 Chrome 尚未接管到编辑器 runtime，应记录快照并停止，不要继续执行布局写入。

## 工具选择

- 用户要求前台可见时，优先 Chrome MCP。
- Chrome MCP 无法操作 runtime 时，退回直连 Playwright。
- Playwright 启动参数使用 `--proxy-server=direct://`。

## 已验证骨架模板

当前项目已经验证过两类布局骨架：

### 模板 A：标准顶栏 + 内容堆叠

```text
RootLayout
├─ TopBarRow
│  ├─ TitleCol
│  ├─ SearchInputCol
│  ├─ SearchButtonCol
│  └─ ReserveCol
└─ ContentStackRow
   └─ ContentHostCol
      └─ MainContentContainer
         ├─ TableAreaRow
         │  └─ TableAreaCol
         └─ ChartAreaRow
            └─ ChartAreaCol
```

适用：

- 查询页
- 管理软件列表页
- 上查询下趋势

### 模板 B：预埋隐藏槽位

适用：

- 同一页后续会频繁加减按钮、过滤条件、辅助区
- 当前页根容器行级 API 不稳定

策略：

- 保留隐藏 `RCol`
- 通过显隐和宽度切换启用
- 预留列统一命名为 `ReservedCol*`

注意：

- 所有结构变更后都要重新读取 `kids`
- 运行时 key 只作为本次写入索引，不作为长期规则

## 尺寸策略硬规则

设计 WOS4 页面时必须先决定每个区域的高度和宽度策略。

推荐：

- 顶部标题区：`heightStrategy = fixedsize`，高度 64-80。
- 搜索/过滤区：`heightStrategy = fixedsize`，高度 72-96。
- 表格/图表主数据区：使用剩余空间策略或固定最小高度，不能无高度。
- 底部状态区：`heightStrategy = fixedsize`，高度 48-72。
- 列宽默认优先用响应式百分比，不优先写死像素。
- 进入子布局后，百分比基准要重新从子容器的 100% 起算，不继承父布局的像素宽度。
- 子布局里如果一行只有一个业务列，该列默认就是这个子布局里的 `100%`。
- 左树、表格、图表列宽优先写成百分比，例如 25/75、65/35、16/58/10/16。
- 在 `colStrategy = percentage` 下，判断是否会换行，必须看这一行所有可见列的逻辑宽度和，例如 `lgWidth`；总和不能超过 `100`。
- 不要把运行时折算后的 `xlWidth` 当成逻辑百分比。`xlWidth` 可能是编辑器换算后的实际宽度，不适合拿来判断“这一行是否超过 100”。

禁止：

- 把中部主行设成 `percentage = 100` 后，再追加底部 fixedsize 行。
- 只放 ECharts 或表格组件，不设置父行/父列高度。
- 只验证组件存在，不验证预览页实际高度。
- 在百分比布局下，只改个别列的某一个断点字段，未核对同行所有可见列的逻辑宽度和。

验收时必须记录：

- 每个 `RRow.heightStrategy` 和高度。
- 每个 `RCol.widthStrategy` 是否为 `percentage`。
- 每一行所有可见列的逻辑宽度和，例如 `sumLG <= 100`。
- 表格父行、父列高度。
- 图表父行、父列高度。
- 预览页 table/canvas 的实际可见高度。
- 如果预览中按钮、表格、树都能显示但 table/canvas 高度过小，说明组件可能被放到了错误的短行或 wrapped col。必须回到同一编辑器会话读取真实 `parentGUID`、`RRow/RCol` 关系，再调整布局；不能只看组件存在。

## 间距和偏移

列偏移相关方法已确认存在：

- `setOffset`
- `getOffset`
- `setOffsetStrategy`
- `getOffsetStrategy`
- `setOffsetValid`
- `getOffsetValid`
- `getAutoOffset`
- `setOffsetAnimation`

使用原则：

- 真正需要空区域时，用结构切分。
- 只是微调位置时，用 offset。
- 先用 row/col gap，不要滥用 offset。

## 验收

必须同时满足：

- 运行时结构符合布局树。
- 预览首屏不挤、不重叠。
- 每个目标区域里组件正确。
- 截图保存到 `screenshots/`。
- 结论写入 `WOS4_deep_test_notes.md`。
