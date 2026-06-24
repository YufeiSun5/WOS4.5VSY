---
name: wos4-modeling-reference-inspection
description: Read-only inspection of WOS4 modeling-system reference models. Use when comparing an existing demo model, checking frontend/backend model structure, detecting left-menu switches, or extracting data/logic/graphic model contents without modifying public or reference objects.
---

# WOS4 建模参考模型只读拆解

## Scope

Use this skill when inspecting existing WOS4 models such as `lk测试` reference demos.

This skill is for read-only evidence collection:

- Enter `建模系统客户端_0518`.
- Select the visible modeling group, for example `根组 -> lk测试`.
- Open model edit pages only for inspection.
- Read the left menu tree, switches, and right-side list contents.
- Compare frontend/backend model responsibilities before copying the pattern into `盛云_孙宇飞` owned models.

Do not use this skill to save, submit, update, delete, deploy, start, stop, or force-unlock reference objects.

## Required Skills

Read these first:

- `D:\DEV_D\WOS4.5\.ai\skills\wos4-browser-harness\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-human-navigation\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-manual-to-skill\SKILL.md`

## Safety Rules

- Reference models without `孙宇飞` in the name are read-only.
- Do not click `保存`, `提交版本`, `更新`, `删除`, `强制解锁`, `部署`, `启动`, or `停止`.
- If an editor is already open, use the top-right `退出` button before opening the next model.
- Use dynamic URLs only as evidence. Navigation must be by visible desktop app, group, row, and button.
- Save evidence under `wos4-artifacts/snapshots/` and `wos4-artifacts/screenshots/`.

## Entry Path

Verified path:

```text
WOS4 主页面
-> 建模系统客户端_0518
-> 数字孪生建模分组
-> 根组
-> lk测试
-> 模型列表
-> 前端_班次管理 / 后台_班次管理 / 前端_框架
-> 编辑
```

If the page is already in an editor, click the top-right `退出` first and wait for `模型列表` to be visible again.

## Left Menu Inspection

Do not rely on screenshots to judge content. Screenshots can hide lower rows or truncate text.

For the modeling editor left menu, read code-level state:

- Rows are usually table-tree rows: `tr.el-table__row` or `.el-table__row`.
- Level is encoded in row class, for example `el-table__row--level-2`.
- Expanded nodes can be detected by `expanded` row class or `.el-table__expand-icon--expanded`.
- Switches are Element UI switches:
  - on: `.el-switch.is-checked`
  - often also `aria-checked="true"`
  - internal input `checked === true`

Use a row-local switch; do not accidentally read the first switch on the page.

```javascript
const rows = Array.from(doc.querySelectorAll("tr.el-table__row,.el-table__row"))
  .filter(row => {
    const r = row.getBoundingClientRect()
    return r.x < 280 && r.y > 75 && r.y < 900
  })
  .map(row => {
    const text = (row.innerText || "").trim().replace(/\s+/g, " ")
    const sw = row.querySelector(".el-switch,[role='switch']")
    const input = sw && sw.querySelector("input")
    const icon = row.querySelector(".el-table__expand-icon")
    return {
      text,
      rowClass: String(row.className || ""),
      expanded: String(row.className || "").includes("expanded") ||
        (icon ? String(icon.className || "").includes("expanded") : false),
      hasSwitch: !!sw,
      switchChecked: sw
        ? String(sw.className || "").includes("is-checked") ||
          sw.getAttribute("aria-checked") === "true" ||
          (input ? !!input.checked : false)
        : null,
      switchClass: sw ? String(sw.className || "") : null
    }
  })
```

## Reference Pattern Observed

For `后台_班次管理`, code-level inspection verified:

- Open switches:
  - `业务事`
  - `自定义计算`
  - `命令语言`
- `事` is expanded, and `业务事` contains business event structure.
- `逻辑模型` is expanded, and `自定义计算` contains callable custom function definitions.
- `图形模型` is expanded, but its child rows do not have meaningful on/off switches; inspect each visible child row manually by clicking it.
- `页面精灵图` can have content even when its switch is off.
- `报表精灵图`, `子模型`, and `形参配置` must be clicked and inspected because no switch does not prove emptiness.

For `前端_班次管理`, the important source content is under:

```text
图形模型 -> 页面精灵图
```

The frontend model may show empty data/logic sections by default; do not conclude until `页面精灵图` is opened.

## Right-Side Content Extraction

After clicking each candidate left-menu row, capture the right-side table/list by code:

- Restrict extraction to visible right-side content: `x > 300`, `y > 80`.
- Exclude background model-list DOM if it remains mounted behind the editor.
- Prefer table headers and row cell text over full `body.innerText`.
- If Vue data is inspected, return only shallow summaries. Do not return full Vue objects through CDP; it may fail with `Object reference chain is too long`.

For each inspected section, save:

```text
wos4-artifacts/snapshots/reference_<model>_<section>.json
wos4-artifacts/screenshots/reference_<model>_<section>.png
```

The JSON should include:

- clicked section label
- left-menu switch state
- right-side table headers
- right-side rows
- visible title/list text
- whether the section is empty

## Current Demo Interpretation

The `lk_客户端01_对象1` demo is not a single page artifact. It is assembled from:

```text
建模系统客户端_0518 / lk测试
-> 前端_框架
-> 前端_班次管理
-> 后台_班次管理

组态系统客户端0518 / 芦昆测试工程
-> 数字孪生可视化
-> lk_客户端01
-> 框架页面 / 新建编辑班次 / 班次管理

时空对象管理
-> lk_客户端01
-> lk_客户端01 / lk_客户端01_对象1
```

The backend source model owns the business event schema and custom functions. The frontend source model owns page sprites. The group/client/runtime layers reference those modeling artifacts.

