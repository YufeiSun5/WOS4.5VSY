---
name: wos4-create-new-page
description: WOS4 新建画面流程。用于从 KingStudio 产品组装中新建分组、新建组态页面、创建并打开页面编辑器，并记录新页面 URL、对象名、耗时和后续布局组件开发入口。
---

# WOS4 新建画面

## 适用场景

当用户要求这些任务时使用：

- 新建一个 WOS4 前端画面。
- 从 KingStudio 产品组装创建页面。
- 演示从登录到新建页面再进入编辑器的流程。
- 统计新建画面流程耗时。
- 需要给后续布局、组件、变量、脚本开发提供一个空白页面。

前置 skill：

- 登录：`D:\DEV_D\WOS4.5\wos4-login\SKILL.md`

后续常用 skill：

- 布局：`D:\DEV_D\WOS4.5\wos4-layout-devtools-skill\SKILL.md`
- 组件持久化：`D:\DEV_D\WOS4.5\wos4-component-persistence\SKILL.md`
- 样式：`D:\DEV_D\WOS4.5\wos4-style-config\SKILL.md`
- 交互：`D:\DEV_D\WOS4.5\wos4-interaction-flow-skill\SKILL.md`

## 固定入口

从主页面进入：

```text
KingStudio_V20260514 -> 产品管理 -> 进入产品 -> 产品组装
```

当前已验证产品：

```text
升级拷贝1
```

新建页面前必须先选中左侧产品组装分组/仓库。否则点击“新建”会提示：

```text
请选择仓库
```

## 推荐流程

1. 按 `wos4-login` 登录，或确认 Chrome 已登录。
2. 打开 `KingStudio_V20260514`。
3. 在产品管理页进入目标产品。
4. 切换到 `产品组装`。
5. 如果没有合适分组，点击左侧 `新增`，创建分组。
6. 选中左侧分组。
7. 点击右侧工具栏 `新建`。
8. 类型保持 `组态页面`。
9. 子类型选择 `页面`。
10. 填写名称和描述。
11. 点击 `创建并打开`。
12. 等待 `页面编辑器` 打开，并出现新页面 tab。

## 已验证字段

新建弹窗字段：

- 名称：必填。
- 类型一级：`组态页面 / 功能单元 / 数据模型 / 其他`。
- 组态页面子类型：`客户端 / 页面 / 2D / 3D / 报表 / GIS`。
- 描述：可选。
- 按钮：`确认`、`创建并打开`。

## 本次验证样例

已创建：

```text
分组：Codex自动演示_0612
页面：Codex自动演示页面_0612
```

预览 URL 中关键对象：

```text
id=6192730962611142865
guid=09faf052-b59b-4129-b3fe-0e726794b29a
guidVersion.id=1441151880758559577
runModelName=Codex自动演示页面_0612
```

证据：

- `D:\DEV_D\WOS4.5\snapshots\wos4_new_demo_run_report.json`
- `D:\DEV_D\WOS4.5\screenshots\wos4_new_demo_preview_after_click.png`

## 验收

新建画面流程完成标准：

- 新分组或目标分组存在。
- 新页面出现在产品组装列表或页面编辑器 tab。
- 页面编辑器已打开。
- 能继续通过布局/组件 skill 写入内容。
- 保存新建过程的耗时记录。

完整流程参考：

- `D:\DEV_D\WOS4.5\wos4-create-new-page\references\new-page-flow.md`
