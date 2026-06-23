---
name: wos4-component-persistence
description: WOS4 组件数据持久化规则。用于配置表格、图表、文本、输入框等组件在提交、重新打开、预览后仍生效；尤其适用于表格 columns/totalData、图表 option、组件 detailConfig 的保存验证。
---

# WOS4 组件持久化

## 适用场景

当任务涉及这些内容时使用本 skill：

- 给表格配置列和数据，并要求保存后预览仍显示。
- 给图表配置 option，并要求保存后预览仍显示。
- 判断运行态方法和持久化配置的区别。
- 修复“编辑器里能看到，刷新/预览后丢失”的问题。

需要先登录时，先用：

- `D:\DEV_D\WOS4.5\.ai\skills\wos4-login\SKILL.md`

需要布局时，先用：

- `D:\DEV_D\WOS4.5\.ai\skills\wos4-layout-devtools-skill\SKILL.md`

需要先判断该选哪个组件、哪些组件只是探索过时，先用：

- `D:\DEV_D\WOS4.5\.ai\skills\wos4-component-catalog\SKILL.md`

## 核心结论

WOS4 组件有两类配置路径：

- 运行态方法：用于马上看到效果，不一定会保存。
- 持久化脚本：通常写入 `detailConfig`，提交后重新打开时执行。

不要把“当前 runtime 显示成功”当成“保存成功”。

## 通过代码添加组件

2026-06-18 已验证当前页可通过代码把组件插入命名槽位，再提交保存。

核心链路：

```text
布局树命名槽位
-> rowsManager 读到目标列数据对象
-> 用 KSGUID 回映射到 kids.RCol* 实例
-> clone toolkit
-> targetCol.addChild(null, [clone], "drag")
-> 取 col.getObject()
-> 设置 UIName / detailConfig / 组件属性
-> 提交保存
```

关键区别：

- `rowsManager` 里的列对象更适合读布局和命名。
- 真正能 `addChild / setObject / getObject` 的是 `kids.RCol*` 实例。
- 不要直接对 `rowsManager.colsManager[*]` 调 `addChild`。

### 1. 找真实 RCol 实例

先从布局树拿命名列：

```js
const root = kids.RContainer1.data
const nested = kids.RContainer2.data
const inputColData = root.rowsManager[0].colsManager[1]
```

再用 `KSGUID` 映射回真实实例：

```js
const inputCol = Object.values(kids).find(v =>
  v && (v.KSGUID === inputColData.KSGUID || v.KSCGUID === inputColData.KSCGUID)
)
```

### 2. 克隆 toolkit

从组件面板节点取 Vue 上的 toolkit，再深拷贝：

```js
function toolkitOf(node) {
  return node?.__vue__?.$options?.propsData?.toolkit ||
    node?.__vue__?.$props?.toolkit ||
    node?.__vue__?.toolkit ||
    null
}

function cloneToolkit(info, doc) {
  const node = Array.from(doc.querySelectorAll(".toolkit_group_item")).find((el) => {
    const toolkit = toolkitOf(el)
    if (!toolkit) return false
    return (
      (el.id === info.id || el.id === info.id?.replace("chart/", "")) &&
      (info.prototypeName ? toolkit.prototypeName === info.prototypeName : true)
    )
  })
  if (!node) return null
  const toolkit = toolkitOf(node)
  return toolkit ? JSON.parse(JSON.stringify(toolkit)) : null
}
```

### 3. 插入到列里

```js
function colObject(col) {
  const obj = col.getObject ? col.getObject() : col.object
  return Array.isArray(obj) ? obj[0] : obj
}

function clearCol(col) {
  if (!col) return
  if (typeof col.clearCol === "function") col.clearCol()
  else if (typeof col.removeComponent === "function") col.removeComponent()
  else if (typeof col.setObject === "function") col.setObject([])
}

function addIntoCol(col, toolkitInfo, name, doc, configure) {
  clearCol(col)
  const clone = cloneToolkit(toolkitInfo, doc)
  if (!clone) return null
  col.addChild(null, [clone], "drag")
  const inst = colObject(col)
  if (!inst) return null
  if (typeof inst.setName === "function") inst.setName(name)
  inst.UIName = name
  if (inst.propData) inst.propData.UIName = name
  if (configure) configure(inst)
  return inst
}
```

### 4. 已验证组件类型

当前页已验证：

- `input` -> `ElementInput`
- `button` -> `ElementButton`
- `table` -> `ElementTable`
- `chart/折线图` -> `ElementChart`

注意：

- 图表类 toolkit id 可以带中文。
- 在 `browser-harness` 的 ASCII 临时脚本里，中文必须写成 Unicode 转义。
- 例如 `chart/折线图` 要写成 `chart/\u6298\u7ebf\u56fe`。

### 5. 组件配置

插入后不要只看组件出现，还要马上写持久化字段。

输入框：

```js
inst.propData.placeholder = "\u8bf7\u8f93\u5165\u5173\u952e\u5b57"
inst.propData.clearable = true
inst.propData.disabled = false
```

按钮：

```js
inst.propData.detailConfig = "this.button({ text: '\\u67e5\\u8be2' })"
inst.propData.linkList = inst.propData.linkList || []
```

表格：

```js
inst.propData.detailConfig = "this.table(" + JSON.stringify(tableCfg) + ")"
```

图表：

```js
inst.propData.detailConfig = "option=" + JSON.stringify(option)
```

### 6. 当前页已验证映射

在 `盛云_孙宇飞_前端_查询Demo_0618 -> 查询列表` 中：

- `FilterInputCol -> RCol16`
- `PrimaryActionCol -> RCol18`
- `DataGridCol -> RCol20`
- `TrendChartCol -> RCol21`

当前轮已提交成功的组件：

- `demo_filter_input`
- `demo_query_button`
- `demo_table`
- `demo_chart`

## 表格持久化

已验证结论：

- `table.SetData(rows)` 只适合运行态测试。
- 直接写 `propData.columns = [...]` 可能提交后被清空。
- 表格列和数据要持久化，必须写入 `detailConfig`，内容使用 `this.table({...})`。

模板：

```js
this.table({
  border: true,
  fit: true,
  showHeader: true,
  emptyText: "暂无匹配数据",
  columns: [
    { prop: "station", label: "站点", minWidth: "160", align: "left", type: "", columnKey: "", fixed: false },
    { prop: "area", label: "区域", minWidth: "100", align: "center", type: "", columnKey: "", fixed: false },
    { prop: "status", label: "状态", minWidth: "120", align: "center", type: "", columnKey: "", fixed: false },
    { prop: "flow", label: "流量", minWidth: "120", align: "right", type: "", columnKey: "", fixed: false },
    { prop: "pressure", label: "压力", minWidth: "120", align: "right", type: "", columnKey: "", fixed: false }
  ],
  totalData: [
    { station: "泵站A", area: "A", status: "正常", flow: 128, pressure: 0.62 }
  ]
})
```

验证方式：

- 提交。
- 重新打开编辑页。
- 读取 `propData.columns.length`。
- 读取 `propData.data.length` 或 DOM 行数。
- 打开预览，看表头和行内容。

## 图表持久化

图表即时渲染：

```js
chart.SetOption(option, true)
```

图表持久化：

```js
chart.propData.detailConfig = "option=" + JSON.stringify(option)
```

验证方式：

- 预览页出现 canvas。
- `series` 数量正确。
- 颜色、线宽、坐标轴等 option 样式可见。

## 文本、按钮、输入框

文本和按钮文案可通过 `detailConfig` 设置：

```js
options.value = "标题"
this.button({ text: "切换数据：A / 0" })
```

输入框常用配置：

```js
options.placeholder = "请输入名称或关键字后查询"
options.clearable = true
options.disabled = false
```

样式走 `styleConfig`，详见：

- `D:\DEV_D\WOS4.5\.ai\skills\wos4-style-config\SKILL.md`

## 验收清单

- 运行态能显示。
- 提交成功。
- 重新打开编辑页后配置仍存在。
- 预览页能看到真实组件。
- 快照和截图写入 `snapshots/`、`screenshots/`。
- 结论写入 `WOS4_deep_test_notes.md`。

## 迭代开发规则

- 组件修改完成后必须先提交保存，再打开预览验证。
- 预览验证后回到同一个编辑器会话继续改，不要关闭浏览器后重新跑完整脚本。
- 未提交前关闭浏览器或重跑导航，会导致当前 runtime 修改丢失，不能作为有效开发流程。
- 脚本可用于批量设置当前页面，但执行后应保留浏览器状态，等待保存、预览和下一轮调整。

## 提交和预览注意事项

- 提交按钮应优先用可访问树或真实按钮定位，确认出现 `版本提交` 弹窗后再填写说明。
- `版本提交` 的提交说明字段可能是可见 `input.el-input__inner`，不一定是 `textarea`。不要把提交说明误填到对象树过滤框或属性面板输入框。
- 填写提交说明时应限定弹窗区域或根据弹窗坐标/标题定位字段，再点击弹窗内 `确定`。
- 预览页外层通常只有 `#app -> iframe`，顶层 `document.body.innerText` 可能为空。验证组件必须进入预览 iframe 的 `contentDocument` 后再查按钮、表格、树、canvas。
- 预览验证要同时记录外层 URL、iframe 文本、组件尺寸和点击前后数据。顶层空 body 不能直接判定预览失败。
