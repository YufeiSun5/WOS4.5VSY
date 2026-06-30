---
name: wos4-blue-client-publish-flow
description: End-to-end WOS4 blue WebJS client publishing flow. Use when Codex must publish or refresh a runnable blue client from modeling/configuration work, decide whether an existing blue client can be updated instead of creating duplicates, verify same-spacetime frontend/backend runtime, or debug why a purple object, stale version, or wrong spacetime appears after submit/deploy.
---

# WOS4 Blue Client Publish Flow

## Scope

Use this skill as the orchestration skill for:

```text
model/page changes
-> model or page submit
-> target time-space submit / package generation
-> config-client instance submit check
-> operation deployment update/start
-> verify deployed runtime object from Time Space Object Management
-> runtime verification
```

This skill does not replace the detailed child skills. It defines the order, stop points, and acceptance gates.

## Current Authoritative Flow

Use this flow for the current Palimpsest-style page/client release work. Treat every arrow as an evidence gate; if one gate fails, stop at that layer instead of compensating in a later platform.

```text
建模系统客户端
-> edit/save/submit the source page or backend model version
-> verify the editor/runtime preview is correct
-> 组态系统客户端
-> 数字孪生可视化: bind or rebind the page into the target client screen list
-> set homepage and page spacetime/config as required
-> client row 更新版本 and 提交版本
-> 管控单元实例配置: only runtime-bearing backend/data/logic instances, not page-only frontend models
-> target spacetime 批量提交 / generate time-space package
-> 运维部署客户端: update/deploy/start the target spacetime/client package
-> 时空对象管理平台: verify online objects and existing WebJS template/card
-> reopen a fresh blue WebJS client
-> verify page switch, query, dialogs, and frontend Call backend
```

For page-only frontend changes such as `页面精灵图`, the common stale-preview fix is not another source edit:

```text
组态系统客户端
-> 数字孪生可视化
-> target client
-> 画面列表
-> delete/remove the stale screen reference if it still points to an old page copy
-> 添加 / 引用 the current page sprite again
-> set the homepage again
-> update and submit the client version
```

Use this delete-and-readd screen reference recovery only for the target personal client/page. Capture before evidence of the screen row and page name, because it changes the client composition, not just the editor preview.

Do not use this full publishing flow when the current goal is only:

```text
建模系统客户端 / 页面精灵图
-> 页面编辑器
-> 工具栏预览 mode=debugger
-> 验证布局、假数据、表格、图表、按钮前端脚本
```

That editor/debugger preview can load the page resource directly from KF4.5 and is enough for frontend visual/layout iteration. It is not proof that a formal blue client object, time-space package, or deployed backend App is current.

For backend source/meta-language function debugging, use `wos4-meta-language-fu-create` and its `调试配置` chain. A backend debugger session can compile/start debug without first publishing a blue client.

Use this blue-client flow only when the task needs formal runtime acceptance: same-spacetime frontend/backend `Call`, deployed object verification, stale version diagnosis, or a runnable WebJS client opened from object management/desktop.

## Required Child Skills

Read these before acting:

- `D:\DEV_D\WOS4.5\.ai\skills\wos4-browser-harness\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-human-navigation\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-config-client-screen-create\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-runtime-package-update\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-blue-client-object-create\SKILL.md`

Also read task-specific skills:

- frontend button/data flow: `wos4-button-variable-flow`
- component persistence: `wos4-component-persistence`
- backend meta-language model: `wos4-meta-language-fu-create`

## Hard Rules

- Do not create a new blue client object when an existing personal blue object can be refreshed or validated.
- Do not operate public/shared objects. For this project, only modify objects explicitly belonging to `盛云_孙宇飞` or the current project/code name agreed with the user.
- Do not use `KingStudio_V20260514`.
- Do not use dynamic preview URLs as entry points. Use visible WOS4 navigation; generated preview URLs are evidence only.
- Do not treat a row-level `提交版本` as proof that runtime has updated.
- Do not treat `时空列表 -> 批量提交` as success by itself. It is the current package-generation route, but every run must capture progress/details and prove the new package is consumed by 运维部署 and the fresh blue client.
- Do not create a `管控单元实例配置` row for a frontend model that only contains page sprites/screens. Product-provider correction: page-only frontend models are bound from `数字孪生可视化`, not instantiated under the time-space instance list.
- Do not treat a purple object as a runnable final WebJS client.
- Do not create backend/business-event/custom-calculation objects in `时空对象管理平台`. Current backend-chain rule: business events/custom calculations are developed in 建模系统, instantiated in 组态系统, deployed/updated/started in 运维部署客户端, and only then verified/debugged from `时空对象管理平台`.
- WebJS blue client objects are the exception: after the config client has been submitted, packaged, deployed, and started, a personal WebJS object may be created from the target main spacetime `功能 -> 创建 -> 应用模板: WebJS`. Do not create it from `$Client -> 三方APP`.
- If a backend/runtime-bearing object is absent from `时空对象管理平台`, treat it as not online. Go back to 运维部署 or model/package version work; do not compensate by creating backend content in object management.
- If the first time-space level is empty, stop and add/verify a real level-1 instance before deploy.
- If a left menu item is only a parent menu, click the real child page. In the config client, `数字孪生实例配置` is a menu group; `管控单元实例配置` is a real page.

## Correct High-Level Order

### 1. Submit the changed source

For frontend page changes:

```text
组态系统客户端
-> 数字孪生可视化
-> client row double-click
-> screen row edit
-> save/submit page version
```

For backend meta-language changes:

```text
建模系统客户端
-> backend model edit
-> compile/debug as needed
-> submit model version
```

Acceptance:

- The page/model submit dialog reaches success.
- Reopen or reread the editor runtime and confirm the edited script/config is still present.

### 2. Submit target time-space and generate the package

The product-provider chain is the current route to replay, but it is only accepted after the concrete run proves each gate:

```text
模型提交版本
-> NadirL2 时空提交版本/生成时空包
-> 管控单元实例配置提交
-> 运维部署客户端更新/部署/启动
-> 重新打开蓝色客户端
-> 前端 Call 后端
```

Execute this section only as a controlled publish run. Before moving on, prove:

- `时空列表 -> 更多 -> 批量提交` is the correct visible entry.
- The time-space submit actually carries the expected configured instances.
- A new package/version is visible afterward.
- 运维部署更新/部署/启动 consumes that package.
- Reopened blue client can call the backend.

If any proof is missing, record the failed gate and stop. Do not fill the gap by creating backend or business-event content in `时空对象管理平台`.

### 3. Check config instance submit after time-space submit

After the target time-space package is generated, `管控单元实例配置提交` is a confirmation/fallback check. It is not a substitute for package generation.

Check:

```text
管控单元实例配置
-> target spacetime level
-> every required level has a real instance
-> backend/runtime-bearing instance rows use the intended model versions
-> do not add page-only frontend models as instances
-> row-level 提交版本 or small submit control only if stale/missing
```

Acceptance:

```text
Instance rows show the intended versions and no required level is empty.
```

Do not treat this step alone as runtime update evidence. The runtime package is proven by the time-space package query and later 运维部署 update/start verification.

### 3.2 Page-only frontend rebind check

Use this when the 建模 editor preview is correct but 组态 preview or blue client still shows an old page:

```text
数字孪生可视化
-> target client
-> 画面列表
-> identify the stale screen row
-> remove/delete the screen reference
-> 添加 / 引用 the current page sprite again
-> set 首页 and page spacetime/config again
-> return to client list
-> 更新版本
-> 提交版本
```

Acceptance:

- The screen list shows the intended current page.
- The homepage is unique and points at the intended frame/page.
- A fresh formal preview or fresh blue client no longer shows the stale page content.

Do not add the page-only frontend model to `管控单元实例配置` to solve this. That list is for runtime-bearing instances.

### 3.1 Dirty instance recovery

Use this only after the normal chain fails and the user confirms the target is personal/safe to change.

Symptoms:

```text
model/page versions look correct
target time-space package is generated
operation deploy/start succeeds
blue client still calls stale/wrong backend or same-spacetime call fails unexpectedly
```

Recovery:

```text
管控单元实例配置
-> record before evidence for the target instance
-> delete only the affected personal instance
-> add the same model instance again under the same target level
-> submit target time-space/package again with 时空列表 -> 批量提交
-> run config instance submit check
-> 运维部署客户端 update/deploy/start
-> reopen blue client
-> verify frontend Call backend
```

Do not use this on public/shared instances. Do not delete a whole time-space level unless the user explicitly asks for that scope.

### 4. Update/deploy/start in operation client

Use `运维部署客户端`, not raw top-window calls. For automation, execute operation APIs from the operation page `PageView.eval(...)` context.

Verified update pattern:

```text
IQueryRepoPacketsList(selectRepoGUID = target spacetime guid)
-> confirm latest version exists
IUpdatePUInstance(instRepoGUID = target spacetime guid, updateVersion = latest version)
-> verify success
IQuerySTRepoCfgInfo / IQuerySTObjectInfo
-> verify 已部署 / 已启动
```

If using visible UI, close stale progress dialogs before the next action. Stale `.el-dialog__wrapper.page_run_pop` can block real clicks after success.

Acceptance:

- Target spacetime and its child frontend/backend configs are `已部署 / 已启动`.
- `strepocfgver` reflects the new package/version where available.

### 5. Verify the deployed object from Time Space Object Management

After update/deploy/start, close stale runtime tabs and open `时空对象管理平台` through the visible desktop route. Do not validate against a stale iframe or an old public URL tab.

For backend work, object management is the authoritative source for whether the target time-space/business events/custom calculation App is online and debuggable.

If the expected object is visible, use it for:

```text
time-space GUID / object GUID lookup
records
logs
view/debug entry
runtime verification
```

If it is not visible, stop runtime testing and return to:

```text
模型提交版本
-> 组态实例化 / 时空提交
-> 运维部署客户端 更新 / 部署 / 启动
```

Do not create missing backend/runtime-bearing objects from `时空对象管理平台`. For a WebJS blue client object, use only the main spacetime `功能 -> 创建` route after the client package is already visible as a WebJS template.

Verified Palimpsest 0626R2 WebJS object route:

```text
时空对象管理平台
-> 左树选中 main spacetime `PalimpsestL1_0626R2`
-> 顶部 tab `功能`
-> 创建
-> 应用模板: 选择
-> 仓库选择/确认 `盛云_孙宇飞_Palimpsest客户端_0626R2`
-> select WebJS copy row
   copy id: 7205759403792797202
   copy guid: 5f2c8c4b-5ed5-4d0a-9444-a7ffaf0f67a2
   model guid: f5f8c456-e145-4d85-b1c3-dc3a17e7b512
   model version: 118
-> name the object with a meaningful personal name
-> keep personal app for first runtime verification unless public role binding is the explicit step
-> confirm
```

Observed caveats:

- `$Client -> 三方APP -> 创建` opens a container third-party app flow and can fail with `仓库不存在`; it is not the WebJS blue-client route.
- After creation the `功能` list can show `共 1 条` and still render `暂无数据`; refresh back to the desktop and verify the new blue client card instead.
- A duplicate-name warning for the just-entered name can mean the previous create actually succeeded but the object-management list did not render it yet.
- In browser-harness, real double-click can fail to open WOS desktop cards even when human clicking works. For diagnosis only, dispatching DOM `click/dblclick` on the visible `.data-item.card-item` opened the app; record this as tool behavior, not a user-facing workflow.

Blue client clues:

```text
icon asset contains js_func_unit_editor_light
template language type is WebJS
toolbar has 视图 enabled after selecting the running object
```

Purple/non-final clues:

```text
func_unit_editor_light icon
language type 元语言
```

### 6. Runtime verification

Open the blue client through visible object-management or desktop route, then inspect the inner runtime. Do not reuse stale preview tabs.

Palimpsest 0626R2 verified runtime evidence:

```text
desktop card:
  盛云_孙宇飞_Palimpsest客户端_0626R2_正式蓝端
  icon: js_func_unit_editor_light-DMRXO09p.1780642478302.png
runtime:
  /public/?id=6192730962611142751&parentid=0&cloudid=1&areaid=0&username=孙宇飞&bs=true
  -> GetFileContent/.../f5f8c456-e145-4d85-b1c3-dc3a17e7b512_118/index.html
```

In that verification the formal runtime mounted `PalimpsestMenu_18`, but only the left menu rendered. Menu clicks changed/kept active state and the right content area did not load `PalimpsestContent_82`; therefore blue-client object creation was verified, but the three-page client composition was not yet accepted.

Strong same-spacetime signal:

```js
var page = document.querySelector(".page_view").__vue__
page.spaceTimeId.guid
page.spaceTimeId.spaceTime
page.spaceTimeId.devName
```

For frontend-to-backend calls:

1. Read and record the authoritative time-space/object information from `时空对象管理平台` first.
2. Read `page.spaceTimeId.guid` from the opened runtime and compare it with the object-management value.
3. Query running App objects in that same guid.
4. Use the returned current `$id` or exact current `$name`.
5. Call the backend with the function's exact parameter signature.

If the page can query multiple time-spaces, validate the page's spacetime-switching path before backend acceptance:

```text
default instantiated spacetime
-> page-level spacetime variable/helper
-> selected target spacetime guid
-> Query/Call uses the selected context
-> result proves the selected target was used
```

Do not accept a page that can only work by hard-coded single spacetime if the user requirement includes cross-spacetime queries.

Do not hard-code a previous runtime object ID such as `5911255985900487006` without re-querying the current spacetime. Runtime App IDs can change after package update/redeploy, and they are only valid inside their own spacetime.

Acceptance:

- Inner `.page_view` exists and has the expected page.
- `page.spaceTimeId.guid` equals the target spacetime guid from `时空对象管理平台`.
- Button or page script records `ret` and `errorcodes`.
- Backend integration is not accepted until `Call(...)` returns `ret === 0` or an expected business return.

### 7. Verify backend App location from Time Space Platform

When frontend `Call` cannot find the backend or returns `-210133`, use `时空功能开发平台 -> 时空开发` as a read-only cross-check before changing code.

Do this only after `时空对象管理平台` proves the target time-space/object is online. `时空功能开发平台` can help find backend copy names and method metadata, but it is not the authority for deployed/debuggable runtime state.

Verified route for the 2026-06-23 CRUD case:

```text
默认数据区
-> KF4.5工程
-> 盛云_孙宇飞_CRUD工程_0620
-> KF4.5Root
-> NadirL1
-> NadirL2
-> NadirBack
```

The middle app cards under `NadirBack` showed:

```text
DemoCrudBackend_CUSTOMFUNC@NadirBack
```

Use this route only to confirm the runtime app name and ownership. It does not prove the frontend button is wired correctly.

Important verified caveat:

```text
ordinary iframe window:
  SetRunInfo is undefined
  Call(...) can return -210133

.page_view.__vue__.eval(...) environment:
  SetRunInfo / Call / StringMap / Variant exist
  SetRunInfo({stType:4, spaceTime:NadirL2 GUID}) + Call(DemoCrudBackend_CUSTOMFUNC@NadirBack.QueryRecords) returned ret=0
```

Therefore, for blue-client frontend/backend checks:

1. Inspect inner `.page_view`.
2. Execute probes through `pageViewVm.eval(...)` when validating the same environment as page scripts.
3. Treat raw `window.Call(...)` failures as diagnostic only.
4. Remove any top-level `debugger` from reusable button scripts before automation; it can pause CDP/browser-harness and make a valid page look stuck.
5. Do not mark the button flow accepted until the actual button click updates the table/chart from the backend result.

## Stop And Ask A Human

Stop and ask for help when any of these occur:

- The target object is not clearly personal/user-owned.
- Runtime package generation succeeds but operation update cannot see the new package.
- Config client shows a newer instance version but formal runtime still queries the old model version after update/deploy/start.
- The blue client opens a page in a different spacetime than the backend.
- `Call(...)` still returns `-210133` after current-spacetime App query finds no backend row.
- `Call(...)` returns `-220006` after same-spacetime App discovery, correct function name, and correct parameter signature are verified. This is likely App engine dispatch/debug/deploy state, not a frontend script shape issue.

## Evidence To Save

For each publish run save:

```text
wos4-artifacts/backups/<task>/before.json
wos4-artifacts/backups/<task>/after.json
wos4-artifacts/backups/<task>/runtime-verify.json
wos4-artifacts/screenshots/<task>_editor.png
wos4-artifacts/screenshots/<task>_runtime.png
```

Append conclusions to:

```text
D:\DEV_D\WOS4.5\WOS4_deep_test_notes.md
D:\DEV_D\WOS4.5\MEMORY.md
```

