# WOS4 组件 Skill 清单（演示页面版）

本页覆盖本次演示页面常用组件与其“可验证行为”，用于把组件行为和脚本行为写成一致的操作清单。

## 通用前提

以下组件都是在页面编辑器对象树中存在对应实例后操作：
- `ElementText`
- `ElementButton`
- `ElementTable`
- `ElementChart`
- `ElementSelect`
- `ElementInput`
- `ElementInputNumber`
- `ElementSwitch`
- `ElementTree`
- `ElementTabs`

## ElementText Skill

能力名称：
- 文本内容设置：`setProperty("value", string)`
- 文本样式：优先使用 `styleConfig` + `#domId` CSS；`setProperty("color")`、`setProperty("fontSize")` 可做运行态辅助，但必须预览截图确认
- 可见性：`setProperty("visible")`

验证属性：
- `value` 更新后，页面立即显示更新文本。
- `styleConfig` 持久化后，预览截图能看到字体大小/粗细/颜色。
- 不要只凭 `propData.color/fontSize` 判定样式生效。

建议在脚本中的用途：
- 打开时脚本写入标题/状态行
- 定时脚本刷新 `tick` 文案

## ElementButton Skill

能力名称：
- 文案设置：`setProperty("text", string)`
- 禁用切换：`setProperty("disabled", true/false)`（若面板支持）
- 事件绑定：`SetUIEventConfig` / `setBtnLinkChangePubEvent` / `setBtnLinkChangeDataSet`
- DOM 兜底监听：`btn.$el.querySelector("button").addEventListener("click", ...)`

验证属性：
- 点击按钮能触发预期函数（变量变化、表格刷新、图表刷新）。
- 按钮可见并可点（非 disabled 且启用态）。

建议用途：
- 人工点击验收：按钮->变量->刷新链
- 性能验证：快速连点 3 次，状态字段按预期递增

## ElementTable Skill

能力名称：
- 数据刷新：`SetData(array)` 仅用于运行态检查
- 取数：`GetData()`
- 元数据：`propData.totalLength`、`propData.totalData`
- 持久化：`detailConfig = "this.table({ columns, totalData, ... })"`
- 样式：`styleConfig` + `#domId .el-table...`
- 数据联动：`setTableLinkData(...)`（必要时）

验证属性：
- 运行态 `SetData` 前后 `GetData().length` 变化符合预期
- 保存后重开，`propData.columns.length`、`propData.data.length`、DOM 表头/行内容仍存在
- 表头/行可见性及分页参数生效（`pagination`）
- 过滤后 row 数量符合变量条件

建议用途：
- 过滤切换（A/B/ALL）更新行数
- 与按钮事件联动的主结果面

已验证持久化注意事项：
- 只写 `propData.columns` 或调用 `SetData`，提交后可能只保留 `totalData`，列头会丢。
- 写入 `detailConfig` 并调用 `this.table({ columns, totalData })`，提交后重开列和数据可恢复。

## ElementChart Skill

能力名称：
- 样式和数据更新：`SetOption(option, true)`
- 持久化：`detailConfig = "option=" + JSON.stringify(option)`
- 数据更新：`setChartDataSet(...)`
- 查询当前数据：`getChartData()`

验证属性：
- `option.dataset.source` 改变后图形重绘
- `series` 长度、图类型（bar/line）切换可见
- 与时间/点击状态联动（数值变化）
- 保存后预览可见 canvas，颜色、线宽、legend/grid 等 option 样式可见

建议用途：
- 自动加载时显示默认数据
- 点击后更新数值
- 定时器驱动趋势变化

## ElementSelect / ElementInput / ElementInputNumber Skill

能力名称：
- 设置值：`setProperty("value", ...)` 或通过输入法编辑值
- 清空与重置：`setProperty("value", null/\"\")`
- 输入框样式：`styleConfig` + `#domId .el-input__inner`

验证属性：
- 输入值可回写到页面状态变量
- 变更能触发绑定的数据查询或过滤逻辑
- 保存后预览中边框色、背景色、文字色可见

建议用途：
- 交互脚本中作为筛选条件输入
- 与按钮/事件脚本形成完整筛选链

## ElementSwitch Skill

能力名称：
- 切换状态值：`setProperty("value", true/false)`

验证属性：
- 布尔值变化可被脚本读取

建议用途：
- 控制是否启用定时刷新、是否显示高级字段等

## ElementTree Skill

能力名称：
- 节点赋值/读取（通过实例属性或事件回传值）
- 样式与层级配置（视面板而定）

验证属性：
- 左侧树区域独立占位，不挤压右侧内容
- 选中/清空节点行为稳定

建议用途：
- 左树展示目录、右表展示明细

## ElementTabs Skill

能力名称：
- 选项卡切换（面板内置）

验证属性：
- 选项切换不影响整体布局崩塌
- 各 tab 区域可独立显示组件

建议用途：
- 同一页面承载多个功能模块

## 组件属性完整测试与映射（优先级）

### 结构属性
- 位置：`setX`/`setY` 类方法或布局属性分配
- 对齐：`horizontal`/`vertical`

### 交互属性
- `value` / `text` / `disabled` / `visible` / `readonly`

### 数据属性
- 表格/图表特有数据更新方法（见上）

### 观测属性
- `runVisible`、`visible`、宽高策略

## 打开时脚本与其它脚本（对应本次演示目标）

1. 打开时脚本（初始化）
- 负责初始化变量、预设筛选条件、初始 table/chart 数据

2. 按钮脚本（事件脚本）
- 负责筛选变量切换 + 表格刷新 + 图表数据更新

3. 定时脚本
- 通过 `setInterval` 周期触发刷新函数

4. 输入脚本（回调）
- 选项/输入/开关变化时，触发联动查询

5. 回写脚本（公共事件）
- 通过 `PublicEventEval` 调用复用逻辑

## 强制验收项

- 页面中组件至少一个文字、一个按钮、一个表格、一个图表、一个树都能被脚本找到并操作
- 每种能力至少写一条 `已通过` 或 `失败` 测试结果
- 预览页（含 `mode=debugger`）中能直观看见上述更新
