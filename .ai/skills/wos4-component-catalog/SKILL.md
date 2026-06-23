---
name: wos4-component-catalog
description: Catalog verified and explored WOS4 frontend components for page-sprite editing. Use when choosing which component to place, deciding between verified and only-explored widgets, or recalling what a component is for and which properties/detailConfig/styleConfig fields are currently proven.
---

# WOS4 组件目录

## 作用

这个 skill 只回答三件事：

1. 这个组件是干什么的。
2. 这个组件现在是“已验证可用”还是“只探索过”。
3. 当前已知该怎么配属性、怎么持久化。

它不替代布局 skill，也不替代组件插入 skill。

先读：

- `D:\DEV_D\WOS4.5\.ai\skills\wos4-layout-devtools-skill\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-component-persistence\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-style-config\SKILL.md`

## 状态分级

### A. 已验证

满足以下全部条件才算已验证：

- 已通过代码或可见 UI 插入到页面。
- 已保存/提交。
- 重开编辑页或预览后仍能看到。
- 已知至少一组关键属性写法。

### B. 只探索过

满足以下任一情况：

- 见过组件面板、旧页面、旧运行态。
- 曾经插入过，但没有在当前主线页面上重新验收。
- 只知道大致用途，不知道稳定持久化字段。

### C. 仅面板发现

只在组件面板快照里见过名称和 toolkit id，还没有做运行验证。

## 证据来源

主证据：

- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\frontend_component_palette_0618.json`
- `D:\DEV_D\WOS4.5\wos4-artifacts\reports\frontend_component_palette_0618.md`
- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\frontend_components_submit_0618.json`
- `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\component_add_submit_0618.png`
- `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\wos4_style_preview_verify_0618.png`

当前主验证页面：

- `建模系统客户端_0518 -> 盛云_孙宇飞_前端_查询Demo_0618 -> 查询列表`

## A. 已验证组件

### 1. 输入框

- toolkit id: `input`
- prototype: `ElementInput`
- 典型用途：
  - 顶部关键字输入
  - 查询条件输入
- 当前已验证关键属性：

```js
inst.UIName = "demo_filter_input"
inst.propData.placeholder = "\u8bf7\u8f93\u5165\u540d\u79f0\u6216\u5173\u952e\u5b57"
inst.propData.clearable = true
inst.propData.disabled = false
```

- 样式入口：

```js
inst.propData.styleConfig = "..."
```

### 2. 按钮

- toolkit id: `button`
- prototype: `ElementButton`
- 典型用途：
  - 查询
  - 刷新
  - 打开弹窗
  - 触发中转变量
- 当前已验证关键属性：

```js
inst.UIName = "demo_query_button"
inst.propData.detailConfig = "this.button({ text: '\\u67e5\\u8be2' })"
inst.propData.linkList = inst.propData.linkList || []
inst.propData.linkList[0] = {
  linkId: 200001,
  linkName: "Click",
  enable: true,
  script: "..."
}
```

- 样式入口：

```js
inst.propData.styleConfig = "..."
```

- 说明：
  - 按钮脚本里不要写顶层 `await`。
  - 复用模式优先是“按钮只改变量，业务逻辑放变量改变脚本”。

### 3. 表格

- toolkit id: `table`
- prototype: `ElementTable`
- 典型用途：
  - 管理列表
  - 查询结果表
  - 简单分页浏览
- 当前已验证关键属性：

```js
inst.UIName = "demo_table"
inst.propData.detailConfig = "this.table(" + JSON.stringify({
  border: true,
  fit: true,
  showHeader: true,
  emptyText: "\u6682\u65e0\u5339\u914d\u6570\u636e",
  columns: [...],
  totalData: [...]
}) + ")"
```

- 已验证字段：
  - `border`
  - `fit`
  - `showHeader`
  - `emptyText`
  - `columns`
  - `totalData`

- 说明：
  - 列定义和数据都应走 `detailConfig`。
  - 只调 `SetData` 不算持久化成功。

### 4. 折线图

- toolkit id: `chart/折线图`
- prototype: `ElementChart`
- 典型用途：
  - 趋势图
  - 查询结果汇总图
  - 右侧主图表
- 当前已验证关键属性：

```js
inst.UIName = "demo_chart"
inst.propData.detailConfig = "option=" + JSON.stringify(option)
inst.SetOption(option, true)
```

- 已验证字段：
  - `option.tooltip`
  - `option.grid`
  - `option.xAxis`
  - `option.yAxis`
  - `option.series`
  - `styleOption.borderRadius`
  - `styleOption.borderWidth`
  - `styleOption.shadow.enable`

- 说明：
  - 运行时调 `SetOption` 只解决即时显示。
  - 真正持久化看 `detailConfig = "option=..."`。

## B. 只探索过的组件

### 1. 树

- toolkit id: `tree`
- prototype: 旧运行中出现过 `ElementTree`
- 用途：
  - 左侧区域树
  - 分类层级筛选
- 当前状态：
  - 在旧 0617 组态页链路里出现过 `demo_area_tree`
  - 但没有在当前 0618 主线页面重新完成“保存 -> 提交 -> 正式预览”验收

### 2. 文本

- toolkit id: `text`
- 用途：
  - 标题
  - 行内说明
  - 状态文案
- 当前状态：
  - 人工布局树里出现过 `text1`
  - 旧运行时知道可以写 `options.value`
  - 当前主线没有重新完成持久化验收

### 3. 多对象表格

- toolkit id: `chart/多对象表格`
- 用途：
  - 运行对象类数据表
  - 平台对象型列表
- 当前状态：
  - 只在人工布局树里出现过 `MultiObjectTable1`
  - 没有完成当前主线的重新验证

### 4. 其他图表模板

下面这些当前都属于“只探索过或仅面板发现”，不能默认说可用：

- `趋势曲线`
- `渐变折线图`
- `多线图`
- `普通柱状图`
- `多系列柱状图`
- `堆叠柱状图`
- `立体柱状图`
- `横向柱状图`
- `立体混合图`
- `同数据混合图`
- `渐变混合图`
- `普通饼图`
- `立体饼图`
- `仪表盘`
- `分段渐变仪表盘`
- `雷达图`
- `气泡图`
- `漏斗图`
- `甘特图`
- `水波图`
- `百分比进度条`
- `地图流向图`
- `地图气泡图`

规则：

- 当前若只是想先跑通业务页，优先 `表格 + 折线图`
- 不要先选复杂图表

## C. 仅面板发现的组件组

这些组件当前只证明“面板里有”，不证明“可稳定持久化”：

### 常用 UI

- `选择器`
- `日期时间选择器`
- `导航菜单`
- `图片`
- `上传`
- `标签页`
- `单选框`
- `多选框`
- `开关`
- `时间选择器`
- `卡片`
- `业务卡片`
- `折叠面板`
- `下拉菜单`
- `级联选择器`
- `网页容器`
- `标签`
- `穿梭框`
- `计数器`
- `时间线`
- `步骤条`
- `滑块`
- `评分`
- `轮播组件`
- `自定义轮播`
- `日历`
- `电子签名`
- `条形码`
- `脚本编辑器`
- `分页`
- `大数据表格`

### 流程和专题组件

- `流程查看器`
- `流程编辑器`
- `报警窗`
- `自定义图表`

### 移动端组件

- `移动端_输入框`
- `移动端_文件上传`
- `移动端_进度条`
- `移动端_宫格`
- `移动端_导航栏`
- `移动端_标签栏`
- `移动端_下拉菜单`
- `移动端_列表`
- `移动端_分类选择`
- `移动端_表单`

当前项目默认规则：

- 当前桌面管理页不使用移动端组件。

## 组件选择顺序

### 查询管理页

默认顺序：

```text
输入框
-> 按钮
-> 表格
-> 折线图
```

### 如果需要左侧筛选

先确认是不是必须树：

- 只是简单关键字查询：继续用输入框
- 真有层级区域：再考虑 `tree`

### 如果需要更复杂图表

只有在这两个条件同时满足时才升级：

1. 业务已经用 `表格 + 折线图` 跑通
2. 用户明确要某种图表表达

## 与其他 skill 的关系

- 选组件：先读本 skill
- 插组件：读 `wos4-component-persistence`
- 配样式：读 `wos4-style-config`
- 配按钮和变量联动：读 `wos4-button-variable-flow`
- 先布局：只认 `wos4-layout-devtools-skill`

## 卡住时怎么处理

如果一个组件满足以下任一条件，就停止自动推进并求助人类：

1. 面板里能看到，但当前主线页面无法稳定插入。
2. 插入后编辑器可见，但提交后丢失。
3. 预览里出现，但正式客户端壳里不出现。
4. 组件属性面板字段含义不清，继续猜会污染公共环境。

求助时要带上：

- 页面名
- 组件名
- toolkit id
- 当前验证层级（编辑器 / 预览 / 正式客户端）
- 截图和快照路径
