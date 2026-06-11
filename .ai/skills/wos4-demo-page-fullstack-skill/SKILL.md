---
name: wos4-demo-page-fullstack
description: WOS4 可用演示页构建和回归。用于创建标题、按钮/搜索、表格、曲线图组成的人类可读页面，并验证布局、样式、数据持久化、按钮变量联动、提交和预览。
---

# WOS4 演示页构建

## 适用场景

当用户要求“别挤在一起”“做一个可用页面”“保存并预览”“测试组件属性和交互”时使用。

前置 skill：

- 登录：`D:\DEV_D\WOS4.5\wos4-login\SKILL.md`
- 布局：`D:\DEV_D\WOS4.5\wos4-layout-devtools-skill\SKILL.md`
- 持久化：`D:\DEV_D\WOS4.5\wos4-component-persistence\SKILL.md`
- 样式：`D:\DEV_D\WOS4.5\wos4-style-config\SKILL.md`
- 按钮联动：`D:\DEV_D\WOS4.5\wos4-button-variable-flow\SKILL.md`

## 已验证页面结构

当前 demo 页稳定结构：

```text
第一行：标题 + 按钮/搜索
第二行：表格 + 曲线图
```

当前可用固定宽度：

```text
标题 260，按钮/搜索 980
表格 880，图表 560
```

预览首屏必须看到：

- 标题。
- 按钮或搜索框。
- 表格列头和数据行。
- 曲线图 canvas。
- 表格和曲线图具有正常可见高度，不能塌陷或挤在左上角。

## 布局尺寸要求

构建演示页时必须显式声明布局尺寸策略：

- 顶部标题区固定高度。
- 搜索/过滤区固定高度。
- 表格和图表所在主数据区必须有剩余空间策略或固定最小高度。
- 底部状态区固定高度。
- 表格和图表列宽使用响应式百分比，例如 65/35。

不要把主数据区设成 `percentage=100` 后再追加底部固定行。该组合会造成预览高度计算异常，表格和图表容易被压扁。

## 组件配置原则

不要只做运行态赋值。需要保存后有效时：

- 表格：`detailConfig = "this.table({ columns, totalData })"`
- 图表：`detailConfig = "option=" + JSON.stringify(option)`
- 样式：`styleConfig` + `#domId`
- 按钮事件：`linkList[0].enable = true` + `linkList[0].script`

## 已验证交互

当前已验证：

- 初始预览：按钮 `切换数据：A / 0`，表格显示 A 区 2 行。
- 点击一次：按钮变 `切换数据：B / 1`，表格显示 B 区 2 行，图表刷新。
- 点击两次：按钮变 `切换数据：ALL / 2`，表格显示 4 行，图表刷新。

证据：

- `D:\DEV_D\WOS4.5\snapshots\wos4_interaction_verify.json`
- `D:\DEV_D\WOS4.5\screenshots\wos4_interaction_preview_verify.png`

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

- `D:\DEV_D\WOS4.5\wos4-demo-page-fullstack-skill\unit-tests.md`

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
