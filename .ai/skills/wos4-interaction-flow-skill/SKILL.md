---
name: wos4-interaction-flow
description: WOS4 页面交互流验证。用于验证打开时初始化、按钮点击、变量变化、表格刷新、图表刷新、定时刷新等交互；区分运行态注入和提交后预览仍可用的持久化方案。
---

# WOS4 交互流

## 适用场景

当目标不是静态布局，而是要证明页面能交互时使用：

- 打开页面自动加载数据。
- 按钮点击修改变量。
- 变量变化后刷新表格。
- 变量变化后刷新曲线图。
- 定时刷新。

更细的已验证按钮变量方案见：

- `D:\DEV_D\WOS4.5\wos4-button-variable-flow\SKILL.md`

组件持久化见：

- `D:\DEV_D\WOS4.5\wos4-component-persistence\SKILL.md`

## 已知运行时入口

页面运行时常见入口：

- `PageEval(scriptString)`
- `PublicEventEval(scriptString, param)`
- `PublicEventCallBackEval(scriptString, param)`
- `PublicChildEventEval(scriptString, param)`

`PageView` 常见能力：

- `initPageVariable`
- `setVariable`
- `initPageDataSet`
- `RunDataSet`
- `initialQueryCall`

## 页面级脚本入口

页面级脚本不在 `pageProperty` 里。已确认入口在：

```js
PageView.data.linkMng.linkList
```

属性面板通过下面方法生成脚本配置：

```js
PageView.linkToPropertyJson()
```

已确认固定入口：

| linkId | 名称 | 说明 |
| --- | --- | --- |
| 0 | 创建时 | 页面创建时脚本 |
| 2 | 存在时 | 页面存在期间周期执行，带 `intervalMs` |
| 4 | 关闭时 | 页面关闭前脚本 |
| 51 | 配置进入时 | 编辑/配置进入时脚本 |
| 52 | 配置退出时 | 编辑/配置退出时脚本 |

当前页面动态分组：

- 变量改变：由 `linkId >= 1000 && linkId < 100000` 的 link 进入。
- 定时器：由 `linkId >= 100000 && linkId < 200000` 的 link 进入。
- UI 事件：由 `linkId >= 200000` 的 link 进入。

`linkMng` 当前计数器：

```text
lastDataChangeId = 1000
lastCustomizeId = 100000
lastUIId = 200000
```

保存脚本时不要直接猜字段。应让属性模型或 `upDateLink(...)` 按 `KSCGUID` 回写：

```js
PageView.upDateLink(propertyJson)
// 或
PageView.linkMng.upDateLink(propertyJson)
```

回写字段包括：

- `script`
- `enable`
- `intervalMs`

组件常见能力：

- Button：`linkList[0].script`、`SetUIEventConfig`
- Table：`SetData`、`GetData`、`table({ columns, totalData })`
- Chart：`SetOption`、`getChartData`

## 运行态和持久化的区别

运行态验证可以用：

```js
table.SetData(rows)
chart.SetOption(option, true)
```

但保存后要继续有效，必须用：

```js
table.propData.detailConfig = "this.table({...})"
chart.propData.detailConfig = "option=" + JSON.stringify(option)
button.propData.linkList[0].script = "..."
```

## 按钮脚本注意事项

按钮点击脚本会被平台 `evalFun` 执行。

不要写顶层：

```js
return data
```

否则预览时报：

```text
Illegal return statement
```

需要记录结果时写到：

```js
page.__codexLastInteraction = data
```

## 验收方式

交互必须在预览页验证：

- 点击前读取按钮文字、表格行、图表 canvas。
- 点击一次后再次读取。
- 点击两次后再次读取。
- 比较按钮文字、表格行数/内容、图表是否仍存在。

已验证证据：

- `D:\DEV_D\WOS4.5\snapshots\wos4_interaction_verify.json`
- `D:\DEV_D\WOS4.5\screenshots\wos4_interaction_preview_verify.png`

## 未完全生产化的内容

如果只是临时运行态注入，不能算生产化。

生产化至少需要：

- 提交成功。
- 重新打开编辑页配置仍在。
- 预览页点击后数据变化。
- 没有控制台脚本错误。
