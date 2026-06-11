---
name: wos4-style-config
description: WOS4 样式配置规则。用于通过 styleConfig 和 detailConfig 设置标题、按钮、输入框、表格、图表样式，并在提交、重新打开、预览后验证样式是否真正生效。
---

# WOS4 样式配置

## 适用场景

当任务涉及这些内容时使用：

- 给组件设置字体、颜色、边框、背景。
- 让样式提交后预览仍生效。
- 验证样式字段不是只在编辑器里临时生效。

## 核心规则

WOS4 样式优先使用：

```js
component.propData.styleConfig = "CSS..."
component.setProperty("styleConfig", css)
```

CSS 中用 `#domId` 作为组件根节点占位符，平台会替换成真实组件 id。

只读取 `propData.color/fontSize` 不足以证明样式生效，必须看预览截图或预览 DOM 样式。

## 已验证样式

### 标题

```css
#domId {
  color: #0f172a;
  font-size: 30px;
  font-weight: 600;
  line-height: 140px;
}
```

### 按钮

```css
#domId button {
  height: 48px;
  margin-top: 46px;
  background: #2563eb;
  color: white;
  border-color: #2563eb;
  font-size: 18px;
  font-weight: 600;
}

#domId button:hover {
  background: #1d4ed8;
  border-color: #1d4ed8;
  color: white;
}
```

### 输入框

```css
#domId .el-input__inner {
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  background: #f8fafc;
  color: #0f172a;
}
```

### 表格

```css
#domId .el-table__header th,
#domId .el-table__header tr {
  background-color: #e2e8f0;
  color: #0f172a;
  font-weight: 600;
}

#domId .el-table__body tr:nth-child(even) {
  background-color: #f8fafc;
}

#domId .el-table__body td {
  color: #1f2937;
}
```

### 图表

图表样式主要写入 ECharts option，再持久化到 `detailConfig`：

```js
option = {
  color: ["#2563eb", "#16a34a"],
  grid: { left: 44, right: 44, top: 48, bottom: 52 },
  legend: { bottom: 0, textStyle: { color: "#334155" } },
  series: [
    { type: "line", smooth: true, symbolSize: 7, lineStyle: { width: 3 } }
  ]
}
chart.propData.detailConfig = "option=" + JSON.stringify(option)
chart.SetOption(option, true)
```

## 验证方法

必须做三步：

1. 编辑器运行态看到样式。
2. 提交。
3. 重新打开预览，截图或读取 DOM computed style。

证据文件：

- `D:\DEV_D\WOS4.5\snapshots\wos4_style_verify.json`
- `D:\DEV_D\WOS4.5\screenshots\wos4_style_preview_verify.png`
