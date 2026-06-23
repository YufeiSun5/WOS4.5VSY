---
name: wos4-demo-page-fullstack
description: WOS4 可用演示页构建和回归。用于创建标题、按钮/搜索、表格、曲线图组成的人类可读页面，并验证布局、样式、数据持久化、按钮变量联动、提交和预览。
---

# WOS4 演示页构建

## 适用场景

当用户要求“别挤在一起”“做一个可用页面”“保存并预览”“测试组件属性和交互”时使用。

前置 skill：

- 登录：`D:\DEV_D\WOS4.5\.ai\skills\wos4-login\SKILL.md`
- 布局：`D:\DEV_D\WOS4.5\.ai\skills\wos4-layout-devtools-skill\SKILL.md`
- 持久化：`D:\DEV_D\WOS4.5\.ai\skills\wos4-component-persistence\SKILL.md`
- 样式：`D:\DEV_D\WOS4.5\.ai\skills\wos4-style-config\SKILL.md`
- 按钮联动：`D:\DEV_D\WOS4.5\.ai\skills\wos4-button-variable-flow\SKILL.md`

## Layout Authority

本 skill 不再维护自己的布局规则。

布局的唯一有效来源是：

- `D:\DEV_D\WOS4.5\.ai\skills\wos4-layout-devtools-skill\SKILL.md`

这里的职责改为：

- 在布局已经稳定后做组件、样式、变量和交互回归
- 验证保存、重开、预览、联动
- 记录失败边界

## 布局尺寸要求

本节只保留调用约束，不再定义布局细节：

- 必须先完成布局，再放组件。
- 任何高度、宽度、命名、rowsManager 重写规则，都以 `wos4-layout-devtools-skill` 为准。
- 本 skill 中历史提到的 `标题 + 搜索 + 表格 + 曲线` 只是演示页业务目标，不是布局实现规范。

推荐执行顺序：

1. 先按 `wos4-layout-devtools-skill` 完成布局阶段。
2. 重新读取 `comMap.$Children`，确认目标槽位为空且尺寸正确。
3. 组件阶段：放输入框、按钮、树、表格、图表。
4. 配置阶段：写 `detailConfig/styleConfig/linkList` 和页面变量。
5. 提交预览：验证高度、可见性和按钮联动。

## 浏览器控制边界

本流程分两段：

- 登录：使用 `wos4-login` 的脚本注入或原生 value setter，成功到 `#/main` 即停止登录动作。
- 页面设计和验证：使用 Chrome MCP 接管编辑器和预览页。

Chrome MCP 接管编辑器前必须先验证：

- 页面不是空 `#app`。
- 不是顶层直接打开的 `GetFileContent/.../index.html`。
- `#page_edit_view_area.__vue__._data.comMap.$Children` 存在且非空。

如果接管检查失败，记录到 `wos4-artifacts/snapshots/`，不要继续改布局，也不要重新登录。

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

- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\wos4_interaction_verify.json`
- `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\wos4_interaction_preview_verify.png`

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

- `D:\DEV_D\WOS4.5\.ai\skills\wos4-demo-page-fullstack-skill\unit-tests.md`

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
