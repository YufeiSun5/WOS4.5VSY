---
name: wos4-button-variable-flow
description: WOS4 按钮变量联动流程。用于实现和验证按钮点击后修改页面变量，再触发表格和曲线图表数据刷新的交互；覆盖按钮 linkList 脚本、filterKey/clickCount 变量、点击前后快照验证。
---

# WOS4 按钮变量联动

## 适用场景

当用户要求这些功能时使用：

- 加一个按钮。
- 点击按钮修改变量。
- 变量变化后刷新表格。
- 变量变化后刷新 ECharts 曲线。
- 验证打开预览后点击仍可用。

相关前置 skill：

- 登录：`D:\DEV_D\WOS4.5\wos4-login\SKILL.md`
- 布局：`D:\DEV_D\WOS4.5\wos4-layout-devtools-skill\SKILL.md`
- 组件持久化：`D:\DEV_D\WOS4.5\wos4-component-persistence\SKILL.md`

## 已验证结论

按钮组件在预览运行态点击时会执行：

```js
this.linkList[0].enable && this.evalFun(this.linkList[0].script, this.getProperty("UIName"))
```

因此可行的持久化入口是：

- `button.propData.linkList[0].enable = true`
- `button.propData.linkList[0].script = "..."` 

注意：

- 按钮脚本里不要写顶层 `return`，否则预览时报 `Illegal return statement`。
- 需要结果时，把结果写到 `page.__xxx` 或组件属性里。
- 点击后必须在预览页验证，不要只看编辑器。

## 变量建议

已验证变量：

```js
[
  { varName: "filterKey", varType: 13, varDefaultValue: "A", varDes: "当前区域", KSCGUID: "codex_filterKey" },
  { varName: "clickCount", varType: 3, varDefaultValue: 0, varDes: "点击次数", KSCGUID: "codex_clickCount" }
]
```

在按钮脚本里也要兜底写：

```js
page.$Variable = page.$Variable || {}
page.$Variable.filterKey = state.filter
page.$Variable.clickCount = state.clickCount
```

## 按钮脚本模式

脚本结构：

```js
var page = this.KMComponentsMng.get("PageView")
var kids = this.KMComponentsMng.$Children || {}
var all = Object.values(kids)

function pdOf(obj) {
  return obj && (obj._props && obj._props.propData || obj.propData || obj)
}

function byProto(proto) {
  return all.find(function(v) {
    var pd = pdOf(v)
    return pd && pd.prototypeName === proto
  })
}

var table = byProto("ElementTable")
var chart = byProto("ElementChart")
var button = byProto("ElementButton")

var state = page.__codexInteractionState ||
  (page.__codexInteractionState = { filter: "A", clickCount: 0 })

state.clickCount += 1
state.filter = state.filter === "A" ? "B" : (state.filter === "B" ? "ALL" : "A")

page.$Variable = page.$Variable || {}
page.$Variable.filterKey = state.filter
page.$Variable.clickCount = state.clickCount

var rows = buildRowsByFilter(state.filter, state.clickCount)

table.table({ columns: columns, totalData: rows, border: true, fit: true, showHeader: true })
chart.SetOption(optionFromRows(rows), true)
button.button({ text: "切换数据：" + state.filter + " / " + state.clickCount })

page.__codexLastInteraction = {
  filter: state.filter,
  clickCount: state.clickCount,
  rows: rows.length
}
```

## 已验证结果

在预览页：

- 初始：按钮 `切换数据：A / 0`，表格 2 行，区域 A。
- 点击一次：按钮 `切换数据：B / 1`，表格 2 行，区域 B，图表刷新。
- 点击两次：按钮 `切换数据：ALL / 2`，表格 4 行，图表刷新。

证据文件：

- `D:\DEV_D\WOS4.5\snapshots\wos4_interaction_verify.json`
- `D:\DEV_D\WOS4.5\screenshots\wos4_interaction_preview_verify.png`

## 验收清单

- 编辑器中 `button.propData.linkList[0].enable === true`。
- 预览页按钮可点击。
- 点击前后按钮文案变化。
- 点击前后表格行数或内容变化。
- 点击前后图表仍有 canvas，数据随 rows 改变。
- 不出现 `Illegal return statement`。
