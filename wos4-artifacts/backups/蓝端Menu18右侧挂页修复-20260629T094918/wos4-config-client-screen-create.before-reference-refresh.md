---
name: wos4-config-client-screen-create
description: Verified WOS4 组态系统客户端 flow for creating/opening a frontend demo client and screen, then editing the page designer with layout-first/component-second discipline through browser-harness.
---

# WOS4 组态客户端画面新建与编辑

## Current Backend Boundary

For backend business events and custom calculations, this skill only covers the configuration/client/page side. It does not prove that backend runtime is online.

Accepted backend debug chain:

```text
建模系统提交业务事 / 自定义计算
-> 组态系统客户端实例化
-> 运维部署客户端部署 / 更新 / 启动
-> 时空对象管理平台获取时空信息并调试
```

Do not use `时空对象管理平台` to create missing backend objects.

## Page Spacetime Design Rule

When creating or editing a page, reserve spacetime information and a spacetime-switching method in the page model.

Reason:

```text
组态实例化阶段通常只能填写一个默认/当前时空
但一个页面可能需要查询多个时空的数据、业务事或后端 App
```

Therefore do not hard-code page logic to only the instantiated spacetime. Add or preserve page-level variables/helpers such as:

```text
currentSpaceTime
targetSpaceTimeGuid
spaceTimeOptions
setCurrentSpaceTime(...)
resolveBackendTarget(...)
```

The exact UI can be a hidden page variable, a dropdown, a menu item, or a button-triggered helper, depending on the page design. Formal runtime validation must compare the page runtime spacetime with the real online spacetime information read from `时空对象管理平台`.

## Scope

Use this skill for the current frontend route through `组态系统客户端` / `KingFusion4.5_工程浏览器`.

It covers verified operations:

- Open `组态系统客户端` from the WOS4 desktop by visible human navigation.
- Create or enter a工程.
- Enter `数字孪生可视化`.
- Create/rename a client.
- Enter the client's画面列表.
- Create a画面 and open the screen editor.
- Apply layout first, then place components.
- Submit the page version.
- Update the client version from `数字孪生可视化`.
- Generate the formal preview link for the client.

Do not use this skill for deprecated `KingStudio_V20260514`.

## Current Entry Names

Current desktop labels are:

```text
建模系统客户端
组态系统客户端
运维部署客户端
```

Do not target historical suffixed desktop labels in current automation.

For a new end-to-end task such as `盛云科技_孙宇飞_Palimpsest`, start from `建模系统客户端` to create or update the underlying model/page objects. Use `组态系统客户端` later only for client/page binding, visualization configuration, homepage setup, version update, and preview.

## Product-Provider Correction: Page-Only Frontend Is Not A Time-Space Instance

If a frontend model only contains `页面精灵图` / screens, do not add it under:

```text
管控单元实例配置 -> 实例列表
```

That instance list should contain runtime-bearing models such as backend custom functions, data/logic/control-unit models, or other units that must run in the time-space.

For the current CRUD case, product support showed the intended `NadirL2` instance list as:

```text
NadirBack -> backend clean model
```

The frontend page model is handled later through:

```text
数字孪生可视化
-> client/screen list
-> 添加 / 引用 page sprite
-> set homepage and page parameters/spacetime as required
```

Do not recreate the previous two-instance pattern (`NadirBack` + page-only `NadirFront`) unless the frontend model contains actual runtime App/data/logic that must be instantiated.

## Required Skills

Read these first:

- `D:\DEV_D\WOS4.5\.ai\skills\wos4-browser-harness\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-human-navigation\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-layout-devtools-skill\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-component-persistence\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-component-catalog\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-button-variable-flow\SKILL.md`

## Layout Authority

This skill no longer defines layout rules.

Use `D:\DEV_D\WOS4.5\.ai\skills\wos4-layout-devtools-skill\SKILL.md` as the only active layout authority.

This file only covers:

- config-client entry path
- screen creation/opening
- submit/update-version/preview flow
- component placement caveats after layout is already stable

## Entry Rules

- Start with `browser-harness --doctor`.
- Add `C:\Users\SunYufei\.local\bin` to PATH before running `browser-harness`.
- Use ASCII temp Python files and `cmd /c "type file.py | browser-harness"` for multi-line input.
- Dynamic `/public/?...` and `GetFileContent/.../index.html` URLs are evidence only. Do not use them as business entry points.
- Activate the WOS desktop/home card first if a previous client window or dialog is covering the desktop.
- Do not enter `KingStudio_V20260514`.

## Verified Route

1. From WOS4 desktop, double-click `组态系统客户端`.
2. Wait for nested iframe text `KingFusion4.5_工程浏览器`.
3. Use `新建工程` to create a工程. In the dialog, scope input selection to `.el-dialog`; the first global input may be a table pagination input.
4. Enter the工程 row with `进入工程`.
5. Important: after entering the工程, the first screen is only the工程壳菜单。父菜单组本身不一定加载右侧业务页。
6. Under the left tree, click a real child page item. Current verified examples:
   - `管控单元实例配置`
   - `工作流实例配置`
   - `数字孪生可视化`
7. Do not treat `数字孪生实例配置` as a business page entry. It is a menu group. Clicking it can merely expand/collapse children and leave the right side apparently blank.
8. For frontend client/page work, click left menu `数字孪生可视化`.
9. In `客户端列表`, click `新建`; the platform creates default `客户端1` immediately.
10. Use row action `属性` to rename the client if needed. Verified example: `盛云_孙宇飞_客户端Demo_0617`.
11. To enter the screen list, double-click the client name cell. The row `编辑` action may not respond because its plugin script used an inconsistent page variable target in this test.
12. In the screen list, click `新建`, fill:
   - `名称`
   - `类型` defaults to `页面`
   - `描述`
13. After creation succeeds, the dialog may stay open. Close it with `取消` after the row is visible.
14. Use the screen row `编辑` action to open the editor dialog.
15. Confirm editor runtime before writing:

```js
const view = document.getElementById("page_edit_view_area")?.__vue__
const kids = view?._data?.comMap?.$Children
Boolean(view && kids && Object.keys(kids).length)
```

### Client Creation Latency And Temporary Names

`客户端1` is a platform default/intermediate name. Seeing `客户端1` immediately after clicking `新建` or confirming `新建人机界面` is not enough evidence that the AI created or selected the wrong final client.

After confirming client creation:

1. Enter the browser-harness post-action observation window.
2. Check top-level blocking dialogs before any iframe/list read.
3. Observe toast/message, request evidence, loading/progress mask, dialog close/open state, list row count, and visible client row text.
4. Wait for the expected unique business name, for example `盛云_孙宇飞_Palimpsest客户端_0626...`, to appear and stay stable.
5. If the expected business name appears, stop and continue from that row. Do not recreate or rename it again.
6. If only `客户端1` remains after the observation window and no request/progress/toast is active, then use the row `属性` action to rename it, or retry the normal creation path once.

Do not repeat-click `确定` while the create dialog, request, toast, or table state is still changing. Repeating the click can create duplicate clients or leave stale overlays that later hide the real page state.

### Menu Trap

In the current `KingFusion4.5_工程浏览器` shell, a blank right panel immediately after `进入工程` does not by itself mean the app is broken.

First distinguish:

```text
父菜单组：只展开/收起
真实子菜单：真正加载右侧页面
```

Known verified case:

```text
`数字孪生实例配置`
-> menu group only
-> not the content page itself
```

If the right side looks empty, first click the real child item:

```text
`管控单元实例配置`
```

Expected result after the correct click:

```text
时空列表
实例列表
KF4.5Root / NadirL1 / NadirL2
```

## Layout-First Constraint

Do not place business components until layout is verified.

Read and follow `wos4-layout-devtools-skill` for:

- layout tree design
- rowsManager rewrite strategy
- naming rules
- sizing rules
- layout save/reopen acceptance

Historical `RCol6/RCol15/RCol16` examples in older runs are deprecated as general guidance. They are evidence from one runtime, not reusable layout truth.

## Component Placement

组件选型先看 `wos4-component-catalog`。

本 skill 只负责“怎么进编辑器、怎么开画面、怎么保存提交、怎么拿正式预览”，不再承担组件百科。

Use the platform native insertion path:

```js
targetCol.addChild(null, [cloneToolkit], "drag")
```

For current verified pages, do not call `addChild` on the raw `rowsManager` data object. First map the named layout slot back to the real `kids.RCol*` instance by `KSGUID`, then insert.

Short pattern:

```js
const colData = root.rowsManager[0].colsManager[1]
const colInst = Object.values(kids).find(v => v && v.KSGUID === colData.KSGUID)
const clone = cloneToolkit({ id: "input", prototypeName: "ElementInput" }, document)
colInst.addChild(null, [clone], "drag")
const inst = colInst.getObject()[0]
inst.propData.placeholder = "\u8bf7\u8f93\u5165\u5173\u952e\u5b57"
```

When running through `browser-harness` ASCII temp scripts, write Chinese literals as Unicode escapes.

Component targets verified in the current demo:

- `RCol12`: `ElementInput`, `demo_filter_input`
- `RCol14`: `ElementButton`, `demo_query_button`
- `RCol6`: `ElementTree`, `demo_area_tree`
- `RCol15`: `ElementTable`, `demo_table`
- `RCol16`: `ElementChart` from `chart/折线图`, `demo_chart`

2026-06-18 verified named-slot mapping on `查询列表`:

- `FilterInputCol -> RCol16`
- `PrimaryActionCol -> RCol18`
- `DataGridCol -> RCol20`
- `TrendChartCol -> RCol21`

旧 0617 页面里曾出现过树和另一套列号映射，但那组证据只保留为历史运行态参考，不再当作当前有效插槽规范。

Persist table and chart data through `detailConfig`, not only runtime calls:

```js
table.propData.detailConfig = "this.table(" + JSON.stringify(config) + ")"
chart.propData.detailConfig = "option=" + JSON.stringify(option)
```

## Button Variable Flow Caveat

For this editor runtime, component objects may live under `RCol.getObject()` and not directly in `KMComponentsMng.$Children`.

Button scripts should search both:

```js
function objOf(col) {
  var o = col && (col.getObject ? col.getObject() : col.object)
  return Array.isArray(o) ? o[0] : o
}
function allObjects(kids) {
  var arr = []
  Object.values(kids).forEach(function(v) {
    if (v) arr.push(v)
    var o = objOf(v)
    if (o) arr.push(o)
  })
  return arr
}
function byName(kids, name) {
  return allObjects(kids).find(function(v) {
    return v && (v.UIName === name || v.name === name)
  })
}
```

Preserve the button Click link fields:

```js
button.propData.linkList = button.propData.linkList || []
button.propData.linkList[0] = Object.assign({}, button.propData.linkList[0] || {}, {
  linkId: 200001,
  linkName: "Click",
  enable: true,
  script: scriptText
})
```

## Submit

Toolbar buttons may be outside the current visible browser width. For unique toolbar actions, DOM click is acceptable after the editor iframe and exact button text/class are verified.

Submit flow:

1. Click toolbar `提交`.
2. Wait for `版本提交` message box.
3. Scope the submit说明 input to `.el-message-box`, not the property panel or search boxes.
4. Click the message box `确定`.
5. Wait for `生成历史版本成功！`.

## Preview Status

The verified preview behavior is now split into two layers:

1. Page-editor toolbar `预览`
2. `数字孪生可视化 -> 客户端列表` row action `预览`

Do not treat them as the same thing.

## Stale Screen Reference Recovery

Use this branch when the 建模系统 or page editor preview is correct, but the 组态系统 client preview, formal `clientGuid` preview, or blue client still shows an older page version.

Root cause to assume first:

```text
The client screen list is still bound to an old page/screen reference or copy.
```

Recovery:

```text
组态系统客户端
-> target project
-> 数字孪生可视化
-> target client row, preferably double-click into the screen list
-> record before evidence for the stale screen row, homepage flag, page name, and configured spacetime
-> delete/remove the stale screen reference from the screen list
-> use 添加 / 引用, not 新建, to add the current page sprite again
-> select the correct page sprite row and check 精灵图名称 when the selector requires it
-> confirm
-> set exactly one 首页
-> reapply 当前时空 / page spacetime config if it was cleared by the rebind
-> return to client list
-> run row 更新版本
-> run row 提交版本 when available
-> open a fresh formal preview or fresh blue client
```

Acceptance:

- The screen list contains the intended current page, not the old stale row.
- Homepage is unique.
- A fresh preview/client shows the page content that matched the latest editor preview.

Do not solve this by adding a page-only frontend model to `管控单元实例配置`. That creates the wrong runtime shape and will not fix a stale client screen reference.

### Editor Toolbar Preview

In the 2026-06-17 run, editor-toolbar `预览` first opened `about:blank`, and later opened a real runtime tab but still through a `mode=debugger` route. That route is useful for script probing, but it is not the formal client runtime acceptance path.

### Formal Client Preview

Verified route on 2026-06-18:

1. In `数字孪生可视化 -> 客户端列表`, first run row action `更新版本`.
2. The platform opens `更新版本确认`.
3. Use a real click on the visible `确定` button. Verified success prompt: `更新成功`.
4. Row action `预览` does not directly open a new tab. It opens a `预览链接` dialog.
5. The dialog text contains the formal preview URL with `clientGuid` and `FUType=11`.
6. Use that generated link as evidence and as the formal runtime entry for validation. It is acceptable because it is produced by visible UI navigation, not guessed or hard-coded as an entry path.

Important distinction:

- Old debug route example:
  - `...#/#{\"mode\":\"debugger\", ...}`
- Formal client route example:
  - `...#/#{\"clientGuid\":\"d665bd9b-0afc-49d2-a2b1-eaccde459f3e\",\"FUType\":11}`

If the formal preview route opens but the client shell is blank:

- Inspect runtime globals such as `GetPageMngInfo`, `pageNameToSetPageMap`, `$ClientProject`, `CLIENTRUNINSTANCE`.
- A blank shell with:
  - `GetPageMngInfo() => {}`
  - empty `pageNameToSetPageMap`
  - empty `CLIENTRUNINSTANCE._data`
  means the client runtime started but no page was mounted. That is a client page-mount/default-page problem, not a button-script problem.

If the formal preview route instead raises an alert such as:

- `页面-1441151880758559638-不存在`

then treat it as a stronger form of the same class of problem:

- the formal client preview is pointing at a missing page object or broken page-version mapping.
- first inspect the client screen list `首页` column and whether the expected page is actually mounted as the client default page.
- then inspect client navigation / `SetPage` relationships.
- do not continue tuning frontend button scripts until that page-mount error is resolved.

Until the preview route is fixed, record:

- Editor runtime table/canvas dimensions.
- The formal preview link evidence.
- Whether the formal runtime is `mode=debugger` or `clientGuid`.
- Whether the client shell mounted any page.
- That full acceptance remains blocked on formal runtime verification when the shell is blank.

Do not mark frontend screen delivery complete until preview or published runtime verifies:

- input and button visible,
- left tree visible,
- table has rows and nonzero height,
- ECharts canvas has nonzero height,
- button changes transit variables and refreshes table/chart.

## 2026-06-20 Clean CRUD Runtime Verification

The pending route above is no longer purely hypothetical. The following runtime segment is now verified on the clean project:

```text
运维部署客户端
-> 盛云_孙宇飞_CRUD工程_0620
-> 管控单元实例
-> NadirL1 / NadirL2
-> 父到子部署启动
```

Verified end state after refresh:

```text
NadirL1 -> 版本 1 -> 本云 / area0 -> 已部署 -> 已启动
NadirL2 -> 版本 1 -> 本云 / area0 -> 已部署 -> 已启动
```

### Hard runtime rules from this run

1. A stale progress dialog can block every later click.
   - look for `.el-dialog__wrapper.page_run_pop`
   - if a previous `部署进度` or `启动进度` dialog is still `display:block`, close it before any next action
2. Table status is stale until a project switch refresh.
   - click another工程
   - click back to the target工程
   - only then trust `版本 / 部署状态 / 运行状态`
3. Child rows may not be visible by default.
   - runtime expansion via the table VM is acceptable for inspection
   - do not assume `全部展开` is available; on this page it reported `仅作业区支持全部展开！`
4. For child deploy dialogs, DOM `click()` on `确定` was not reliable enough.
   - the verified path was real click:
     - select `area0`
     - then click `确定`

### Verified child sequence

For `NadirL2`, the working order was:

```text
父层 NadirL1 已启动
-> NadirL2 部署
-> 选择 area0
-> 确定
-> 关闭部署进度弹窗
-> 切工程刷新
-> NadirL2 启动
-> 关闭启动进度弹窗
-> 切工程刷新
```

### Current boundary

Do not overclaim the clean CRUD frontend runtime is solved yet.

After the control-unit chain succeeded, two blockers remained:

1. `数字孪生可视化` view drift:
   - the clean project first showed `客户端1 / 版本 无 / 未部署 / 未启动`
   - after deploy confirmation and refresh, the row drifted to an unrelated `盛云_孙宇飞_Noctiluca_客户端 / 版本 2 / 已部署 / 已启动`
2. Formal client preview runtime still had empty spacetime:

```text
store.CLIENTRUN_KSCCLIENTFU.property.spaceTime = ""
store.CLIENT_SHOW_PAGE_STORE_查询列表_*.fuObj.spaceTime = ""
store.PageRun_IViewStore_*.pageData.spaceTime = ""
```

Therefore:

- control-unit runtime chain is verified
- same-spacetime frontend/backend call is still blocked
- do not mark the overall fullstack route complete until the formal client runtime holds a non-empty `spaceTime`

## Human-Proven Pending Extension

The following route was provided by the user as runnable in real use, but is not yet AI-reproduced end to end in this session. Treat it as the next verification target, not as already-verified reusable automation.

### Pending route

```text
组态系统客户端
-> 进入工程
-> 管控树实例配置
-> 时空列表创建手工层级
-> 实例列表新建 管控单元实例
-> 选择 盛云_孙宇飞_根组 下需要运行在时空里的后端/逻辑/数据模型
-> 填名称/显示名称/描述
-> 提交实例配置
-> 数字孪生可视化
-> 客户端行双击进入
-> 左侧新建分组
-> 右侧用 添加 引用前端页面对象
-> 勾选 精灵图名称
-> 设置唯一首页
-> 回桌面进入 运维部署客户端
-> 管控单元 与 数字孪生画面 按父到子顺序部署/启动
```

### Pending cautions

- Do not assume client row `编辑` is the correct entry; the user reports double-clicking the row is the stable path.
- Product-provider correction: if the frontend model only has pages, skip it in `管控单元实例配置`. Bind it later from `数字孪生可视化` as a page/screen reference.
- After instance creation, a separate `提交` near the plus/minus controls is required before downstream operations.
- In `数字孪生可视化`, the right-side action is `添加`, not `新建`, when binding an already-created frontend page object.
- `确定` may stay disabled until `精灵图名称` is checked.
- After the page is added and opened, the frontend editor is a full-screen `编辑器` dialog over the client screen list. Exiting and re-entering this dialog is a valid way to clear stale state.
- Inside that dialog, the verified page-level spacetime entry is not the old建模属性面板 route. The current effective route is:

```text
数字孪生可视化
-> 客户端行双击进入
-> 画面列表行双击 `查询列表`
-> 编辑器 / 参数配置
-> 当前时空：未配置时空 -> 配置
-> 画面_时空选择器
-> 左树 `数字孪生实例 -> Eidolon手工层级1 -> Eidolon手工层级2`
-> 右侧实例树选择 `Eidolon前端查询实例`
-> 确定
```

- In this chooser, clicking the label text may only expand the tree or keep the parent current. Prefer selecting `.el-tree-node__content` on the exact row. The first effective selection we verified was:
  - left tree current becomes `Eidolon手工层级2`
  - right tree current becomes `Eidolon前端查询实例`
- After real-clicking the chooser `确定`, the editor top bar changed from `当前时空：未配置时空` to `当前时空：Eidolon手工层级2`.
- Closing the `编辑器` dialog and double-clicking `查询列表` again preserved `当前时空：Eidolon手工层级2`, so this binding is not only a transient visual state.
- If add/bind fails, first inspect:
  - whether the spacetime instance config was submitted
  - whether the required unit instances were all created
- Only one page can be `首页`.

Until AI reproduces this once with evidence, keep this section as guidance only and do not treat it as a fully verified skill branch.

## 2026-06-19 Current Noctiluca Config/Deploy Route

This section supersedes the earlier intermediate Noctiluca repair notes.

Use only the rules below as active instructions. Keep the step-by-step trial history in `WOS4_deep_test_notes.md` as evidence, not as reusable procedure.

### Verified final instance shape

Current verified deployable shape for `盛云_孙宇飞_Noctiluca`:

```text
KF4.5Root
└─ Eidolon手工层级1
   └─ Eidolon手工层级2
```

- `Eidolon手工层级1`
  - `EidolonL1Frame -> 盛云_孙宇飞_前端_框架_0618`
- `Eidolon手工层级2`
  - `Eidolon后台查询实例 -> 盛云_孙宇飞_后台_查询Demo_0618`
  - `Eidolon前端查询实例 -> 盛云_孙宇飞_前端_查询Demo_0618`

Rows proven unnecessary and removed in the verified run:

- level1 `Eidolon后台查询实例B`
- level2 `Eidolon后台查询实例B`
- level2 `Eidolon前端框架实例`

### Instance creation rule

1. Select the target level in `时空列表`.
2. Click `实例列表 -> 新建`.
3. In `实例类型`, choose `管控单元实例`.
4. In `新建管控单元实例`:
   - fill `名称 / 显示名称 / 描述`
   - choose `盛云_孙宇飞_根组`
   - select the model row on the right
   - click `确定`

Special rule for level1:

- `Eidolon手工层级1` must carry a true front-frame instance.
- In the verified run that was:

```text
EidolonL1Frame -> 盛云_孙宇飞_前端_框架_0618
```

If level1 has no real content, do not continue to deploy validation.

If dialog wrappers from the current session block header controls, clear only the transient wrappers for the current browser session; do not alter persisted project data.

### Submit rule

After instance edits, submit from the small toolbar near the `时空列表` add/delete controls.

- the submit control is the third small icon in that header area
- it opens `提交版本`
- fill `提交说明`
- click `确定`

Current active rule:

1. submit `Eidolon手工层级2`
2. then submit `Eidolon手工层级1`

Do not submit only once and assume the tree is durable.

Never select `KF4.5Root` for this action; verified prompt:

```text
实例根仓库不允许提交
```

### Deploy refresh rule

`运维部署客户端` can stay stale after submit / deploy / start.

Reliable refresh:

1. click another project in `工程列表`
2. click back to `盛云_孙宇飞_Noctiluca`

Only then trust row status.

Verified deploy-side stable signal after refresh:

- `Eidolon手工层级1 -> 版本: 2 -> 已部署 -> 已启动`

### Frontend spacetime binding rule

Before frontend runtime validation:

```text
数字孪生可视化
-> 客户端行双击进入
-> 画面列表行双击 `查询列表`
-> 编辑器 / 参数配置
-> 当前时空：未配置时空 -> 配置
-> 左树 `数字孪生实例 -> Eidolon手工层级1 -> Eidolon手工层级2`
-> 右侧实例树选择 `Eidolon前端查询实例`
-> 确定
```

Verified effect:

- top bar changed from `当前时空：未配置时空` to `当前时空：Eidolon手工层级2`
- closing the editor dialog and double-clicking `查询列表` again preserved that state

### Current boundary

`数字孪生可视化` still shows stale-UI / object-identity drift during client start:

- row name can drift between `盛云_孙宇飞_Noctiluca_客户端` and `客户端1`
- residual `启动进度 -> 100% -> 失败` text can remain after later rows show `已启动`

Do not treat `数字孪生可视化 -> 启动` alone as final runtime acceptance.

For the blue runnable client-object step after deploy/config are in place, hand off to:

```text
D:\DEV_D\WOS4.5\.ai\skills\wos4-blue-client-object-create\SKILL.md
```

## 2026-06-22 CRUD Formal Preview Re-Verification

Current verified clean CRUD route:

```text
盛云_孙宇飞_CRUD工程_0620
-> 数字孪生可视化
-> 客户端1_人工干预点_1
-> 行内 更新版本
-> 抓到 toast: 更新成功
-> 行内 预览
-> 读取新的 预览链接
```

Verified new formal preview link:

```text
...#"clientGuid":"d01d4d20-79d3-4b0d-9d89-77856713e525","FUType":11
```

This matters because the earlier formal preview used another `clientGuid`. After `更新版本`, do not keep validating an older preview tab.

### Runtime interpretation rule

Do not judge the formal runtime only from top-level globals.

In the current formal preview:

- top window still looks like a thin shell
- inner iframe already renders the real page content
- `GetPageMngInfo()`, `pageNameToSetPageMap`, `CLIENTRUNINSTANCE._data` can still be empty

Yet the inner page runtime is already mounted.

Current verified strong signal is:

```text
inner iframe
-> .page_view.__vue__.spaceTimeId.spaceTime === NadirL2
-> .page_view.__vue__.spaceTimeId.devName === NadirFront
```

So the active rule is:

```text
formal client runtime same-space binding
=> inspect inner .page_view.__vue__.spaceTimeId first
```

Do not overclaim from this:

- `currentShow.options.spaceTime` was still empty
- `PARENT_STORE_PARAM.spaceTime` was still `{}`
- `pageData.spaceTime` was still null

This means:

```text
same-space context is visible at page-view runtime level,
but not every older/global registry is populated.
```

### Frontend/backend boundary after this recheck

The formal runtime page is no longer blank, but the current `demo_query_button` script is still local mock refresh logic:

- reads `seedData`
- writes `filterKey`
- increments `refreshCounter`
- refreshes local table/chart
- does not call backend `Call(...)`

Therefore the updated conclusion is:

```text
clean CRUD formal runtime now mounts the page and resolves NadirL2,
but current page behavior is still frontend fake-data mode,
not yet frontend/backend CRUD integration.
```

## Evidence From Verified Run

- Project: `盛云_孙宇飞_前端Demo_0617`
- Client: `盛云_孙宇飞_客户端Demo_0617`
- Screen: `盛云_孙宇飞_画面Demo_0617`
- Client row data:
  - id `7205759403792795542`
  - guid `a3be34ff-b0cf-4f31-91a9-06654e6893d6`
  - repository `客户端1`
- Key evidence:
  - `wos4-artifacts/snapshots/config_enter_frontend_project.json`
  - `wos4-artifacts/snapshots/config_visualization_entry_probe.json`
  - `wos4-artifacts/snapshots/config_client_name_dblclick_result.json`
  - `wos4-artifacts/snapshots/config_open_screen_editor_result.json`
  - `wos4-artifacts/snapshots/screen_layout_reread_after_layout.json`
  - `wos4-artifacts/snapshots/screen_components_placed_runtime.json`
  - `wos4-artifacts/snapshots/screen_resubmit_fixed_result.json`
  - `wos4-artifacts/snapshots/screen_about_blank_preview_probe.json`
  - `wos4-artifacts/snapshots/page_space_before_0618.txt`

