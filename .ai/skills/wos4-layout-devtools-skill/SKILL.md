---
name: wos4-layout-devtools
description: WOS4 需求驱动布局。用于把用户需求转成 RContainer/RRow/RCol 布局树，设置行列、宽度、高度、间距、偏移、嵌套布局，并通过浏览器自动化放置组件和截图验证。
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

- `D:\DEV_D\WOS4.5\wos4-login\SKILL.md`

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

完整属性映射见：

- `D:\DEV_D\WOS4.5\wos4-layout-devtools-skill\references\layout-properties.md`

## 操作顺序

1. 先把用户需求转成中立布局树，不要一上来依赖 `RCol11` 这种运行时名字。
2. 判断顶层需要几行、每行几列、哪些区域需要嵌套。
3. 打开编辑器 iframe。
4. 定位 `#page_edit_view_area.__vue__._data.comMap.$Children`。
5. 优先使用平台原生插入路径：`targetCol.addChild(null, [clone], "drag")`。
6. 设置行高、列宽、gap、offset。
7. 放置组件。
8. 保存、重开、预览截图验证。

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

## 工具选择

- 用户要求前台可见时，优先 Chrome MCP。
- Chrome MCP 无法登录或无法操作 runtime 时，退回直连 Playwright。
- Playwright 启动参数使用 `--proxy-server=direct://`。

## 已验证布局

当前 demo 页已验证稳定路径：

```text
RRow1: RCol11 + RCol12
RRow2: RCol6  + RCol15
```

预览首屏可用宽度：

```text
RCol11 = 260
RCol12 = 980
RCol6  = 880
RCol15 = 560
```

用途：

- `RCol11`：标题。
- `RCol12`：搜索输入或按钮。
- `RCol6`：表格。
- `RCol15`：图表。

注意：

- 在当前页面上，根容器行列增删 API 并不总是可靠。
- 如果行列突变无效，先复用已稳定的 2x2 布局。
- 所有结构变更后都要重新读取 `kids`。

## 尺寸策略硬规则

设计 WOS4 页面时必须先决定每个区域的高度和宽度策略。

推荐：

- 顶部标题区：`heightStrategy = fixedsize`，高度 64-80。
- 搜索/过滤区：`heightStrategy = fixedsize`，高度 72-96。
- 表格/图表主数据区：使用剩余空间策略或固定最小高度，不能无高度。
- 底部状态区：`heightStrategy = fixedsize`，高度 48-72。
- 左树、表格、图表列宽：优先用响应式百分比，例如 25/75、65/35。

禁止：

- 把中部主行设成 `percentage = 100` 后，再追加底部 fixedsize 行。
- 只放 ECharts 或表格组件，不设置父行/父列高度。
- 只验证组件存在，不验证预览页实际高度。

验收时必须记录：

- 每个 `RRow.heightStrategy` 和高度。
- 表格父行、父列高度。
- 图表父行、父列高度。
- 预览页 table/canvas 的实际可见高度。

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
