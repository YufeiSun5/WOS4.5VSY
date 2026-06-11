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

- `D:\DEV_D\WOS4.5\wos4-login\SKILL.md`

需要布局时，先用：

- `D:\DEV_D\WOS4.5\wos4-layout-devtools-skill\SKILL.md`

## 核心结论

WOS4 组件有两类配置路径：

- 运行态方法：用于马上看到效果，不一定会保存。
- 持久化脚本：通常写入 `detailConfig`，提交后重新打开时执行。

不要把“当前 runtime 显示成功”当成“保存成功”。

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

- `D:\DEV_D\WOS4.5\wos4-style-config\SKILL.md`

## 验收清单

- 运行态能显示。
- 提交成功。
- 重新打开编辑页后配置仍存在。
- 预览页能看到真实组件。
- 快照和截图写入 `snapshots/`、`screenshots/`。
- 结论写入 `WOS4_deep_test_notes.md`。
