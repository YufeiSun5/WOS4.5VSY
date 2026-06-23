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
-> reopen or refresh blue WebJS client object
-> runtime verification
```

This skill does not replace the detailed child skills. It defines the order, stop points, and acceptance gates.

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
- Do not run `管控单元实例配置` row-level submit before target time-space submit as the primary release path. Product-provider correction on 2026-06-23: `NadirL2 时空提交版本/生成时空包` must happen first and will carry instance submissions.
- Do not create a `管控单元实例配置` row for a frontend model that only contains page sprites/screens. Product-provider correction: page-only frontend models are bound from `数字孪生可视化`, not instantiated under the time-space instance list.
- Do not treat a purple object as a runnable final WebJS client.
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

In the config client:

```text
组态系统客户端
-> target project
-> 管控单元实例配置
-> 时空列表
-> select target spacetime level, for example NadirL2
-> top-right ellipsis/dropdown near the time-space add/edit controls
-> 批量提交
```

This step supersedes the older local assumption that instance row submit should happen before time-space package generation. The product provider confirmed the release chain:

```text
模型提交版本
-> NadirL2 时空提交版本/生成时空包
-> 管控单元实例配置提交
-> 运维部署客户端更新/部署/启动
-> 重新打开蓝色客户端
-> 前端 Call 后端
```

Important interpretation:

- `NadirL2` is an example target time-space; use the actual target level for the task.
- The visible UI path is the `批量提交` action on the `时空列表` toolbar/dropdown.
- Time-space submit is the primary package-generation action and should carry the configured instances with it.
- If using an automation API, it must be equivalent to the visible `批量提交 / 数字孪生实例化_时空_提交版本` action.
- If the same apparent configuration still fails after the corrected order, suspect a stale/dirty instance binding before blaming frontend or backend parameters. Product support resolved the 2026-06-23 case by deleting the affected instance, adding it again, then rerunning this release order.
- For the current CRUD pattern, `NadirL2` instance list should contain the backend/control-unit instance such as `NadirBack`. A separate frontend model that only provides pages does not need a `NadirFront` row here.

Acceptance:

- The submit/progress result includes the target time-space and expected child instances, or the package version can be queried afterward.
- Expected child instances means runtime-bearing instances: backend custom function, data/logic/control-unit models, or other non-page runtime units. It does not include page-only frontend screen models.
- A new time-space package/version is created for the target time-space.
- Do not continue to 运维部署 until the package/version is visible.

### 3. Check config instance submit after time-space submit

After the target time-space package is generated, use `管控单元实例配置提交` as a confirmation or fallback step, not as the first release trigger.

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

### 5. Reopen or refresh the blue client object

After update/deploy/start, close stale runtime tabs and reopen the blue WebJS client through the visible desktop/object-management route. Do not validate against a stale iframe or an old public URL tab.

If a personal blue client object already exists, validate or refresh it instead of creating duplicates. If creation is required, use `wos4-blue-client-object-create`.

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

Strong same-spacetime signal:

```js
var page = document.querySelector(".page_view").__vue__
page.spaceTimeId.guid
page.spaceTimeId.spaceTime
page.spaceTimeId.devName
```

For frontend-to-backend calls:

1. Read `page.spaceTimeId.guid`.
2. Query running App objects in that same guid.
3. Use the returned current `$id` or exact current `$name`.
4. Call the backend with the function's exact parameter signature.

Do not hard-code a previous runtime object ID such as `5911255985900487006` without re-querying the current spacetime. Runtime App IDs can change after package update/redeploy, and they are only valid inside their own spacetime.

Acceptance:

- Inner `.page_view` exists and has the expected page.
- `page.spaceTimeId.guid` equals the target spacetime guid.
- Button or page script records `ret` and `errorcodes`.
- Backend integration is not accepted until `Call(...)` returns `ret === 0` or an expected business return.

### 7. Verify backend App location from Time Space Platform

When frontend `Call` cannot find the backend or returns `-210133`, use `时空功能开发平台 -> 时空开发` as a read-only cross-check before changing code.

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

