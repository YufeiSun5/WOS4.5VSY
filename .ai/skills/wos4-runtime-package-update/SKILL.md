---
name: wos4-runtime-package-update
description: Update an existing WOS4 runtime time-space to a newer repository package version without creating throwaway time-spaces by default. Use after a repository package version has been verified and before frontend/backend runtime integration. This skill is partially verified and must record evidence for package update, deploy, start/restart, default-start selection, and runtime validation.
---

# WOS4 Runtime Package Update

## Current Backend-Chain Boundary

For backend business events and custom calculations, the accepted runtime path is:

```text
建模系统提交模型
-> 组态系统客户端实例化
-> 运维部署客户端更新 / 部署 / 启动
-> 时空对象管理平台获取时空信息并调试
```

`时空对象管理平台` is the authority for whether the runtime is online and debuggable. `时空功能开发` package/deploy notes in this skill are historical or diagnostic unless a task explicitly asks to inspect that older route.

## Purpose

Use this skill to update a fixed personal runtime time-space to a newer repository package version.

Do not use this skill merely to preview or debug a page inside the WOS4 page editor. `mode=debugger` page preview and backend `调试配置` are development/debug surfaces and do not require generating or updating a time-space runtime package by themselves.

Use this skill only after a repository/time-space package is actually needed for formal runtime integration, deployed object verification, or same-spacetime frontend/backend `Call` testing.

Default goal:

```text
existing personal test time-space
-> submit the target time-space / generate repository package version
-> deploy / start / restart as required
-> verify runtime status
-> use it for frontend/backend integration
```

Do not create a new time-space as the default update path.

## Product-Provider Release Order Correction

Use this order for current WOS4 client/runtime release work:

```text
模型提交版本
-> target time-space submit / generate time-space package
-> 管控单元实例配置提交 check
-> 运维部署客户端更新 / 部署 / 启动
-> reopen blue client
-> frontend Call backend
```

For the current CRUD chain, the target time-space example is `NadirL2`.

Visible UI route for the package step:

```text
组态系统客户端
-> target project
-> 管控单元实例配置
-> 时空列表
-> select target time-space, for example NadirL2
-> top-right ellipsis/dropdown near the time-space add/edit controls
-> 批量提交
```

The product provider confirmed that the time-space submit carries the configured instances with it. Therefore, do not use row-level instance `提交版本` as the first or only release trigger. Use row-level or small instance submit afterward only as a verification/fallback step when rows are stale or missing.

If using automation, `PageRun.ShowChild("数字孪生实例化_时空_提交版本", ...)` is the current API-level equivalent candidate for this visible `批量提交` step. Prefer the visible route until the API equivalence is reverified for the current project.

Instance scope correction:

- A frontend model that only contains page sprites/screens does not need a `管控单元实例配置` row under the time-space.
- For the current CRUD support screenshot, `NadirL2` should have the backend instance row such as `NadirBack`; the page-only frontend is configured from `数字孪生可视化`.
- Do not expect `NadirFront` in `IQuerySTRepoCfgInfo` or the instance list unless the frontend model contains runtime App/data/logic that actually needs instantiation.

2026-06-23 support recovery note:

- Product support did not find a clear bad parameter in the previous failed case.
- They resolved it by deleting the affected instance, adding the instance again, then deploying through the corrected release order.
- Treat delete-and-readd as dirty instance recovery, not the default path.
- Before deleting, save evidence of the instance name, target level, model, model version, GUID/ID when visible, and confirm it is personal/user-owned.
- After readding, always regenerate the time-space package with `时空列表 -> 批量提交` before 运维部署 update/deploy/start.

## Required Skills

Read and follow these first:

- `D:\DEV_D\WOS4.5\.ai\skills\wos4-browser-harness\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-human-navigation\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-repository-package-deploy-start\SKILL.md`

## Current Verified Baseline

- Fixed personal time-space candidate: `盛云_孙宇飞_时空_0617`
- Repository: `盛云_孙宇飞_仓库`
- Repository GUID: `ad547dd3-dede-4192-9efd-638377876e8c`
- Verified running package:
  - `V1 / meta-language-demo-0617-package-1`
  - time-space status: `运行`
  - package status: `运行`
- Verified later package versions:
  - `V2 / meta-language-demo-0617-package-v2-oncreate-trace`
  - `V3 / meta-language-demo-0617-package-v3-query-demo-data`

## Default Update Strategy

1. Open `时空功能开发 -> 部署管理 -> 本云(0) -> 进入>`.
2. Select the existing personal test time-space in the left tree.
3. Inspect bottom `时空仓库管理`.
4. If the target package version is absent, use `添加` and select:
   - `默认数据区`
   - `个人仓库`
   - personal repository
   - exact package version, for example `V3`
5. Move the package to `预添加仓库数据包` and confirm.
6. Try the least destructive update path first:
   - deploy the target package if it is `未部署`
   - set `默认启动` if the UI exposes that for multiple versions
   - start or restart only the target package/time-space when required
7. Verify visible status text and save evidence.

## Fallback Strategy

Creating a new top-level time-space is only allowed when:

- the existing time-space update path is verified blocked,
- the failure state and waiting time are recorded,
- the user accepts temporary isolation, or the goal is explicitly isolated runtime validation.

When fallback is used, clearly mark the created time-space as temporary or as a fixed reusable runtime, not a throwaway per-run object.

Deleting and readding an affected instance is less broad than creating a new time-space, but it is still destructive. Use it only for personal instances and only after the corrected release order still fails.

## Required Evidence

Save:

```text
wos4-artifacts/snapshots/runtime_update_<task>.json
wos4-artifacts/screenshots/runtime_update_<task>.png
```

Evidence must include:

- selected time-space text and status,
- selected package version and description,
- before/after package status,
- any toast/message capture,
- whether `默认启动` was used,
- whether object management can see the updated runtime target.

## Not Yet Verified

These are hypotheses until proven:

- whether an already running time-space can switch from V1/V2 to V3 without restart,
- whether `默认启动` changes which package version responds to App calls,
- whether same-repository multiple package versions can run concurrently,
- whether frontend App calls route by object ID/name independent of package default-start.

Do not promote these hypotheses to hard rules until a successful update and runtime call are captured.

## 2026-06-17 V3 Fixed Time-Space Probe

Verified on fixed time-space `盛云_孙宇飞_时空_0617`:

- Added `V3 / meta-language-demo-0617-package-v3-query-demo-data` to bottom `时空仓库管理`.
- V3 appeared as `状态: 未部署`.
- Bottom `部署` changed V3 to `状态: 已部署`.
- Bottom `默认启动` produced no visible dialog, toast, or status change.
- Bottom `启动` did not change V3 to `运行`; V3 stayed `已部署`.
- Existing packages remained:
  - `V1 / 盛云_孙宇飞_仓库 / 状态: 运行`
  - `V2 / 盛云_孙宇飞_仓库 / 状态: 停止`

Current conclusion: adding and deploying a newer same-repository package version to an already running fixed time-space is verified only up to `已部署`. Runtime switch/start remains unresolved. Do not claim this update path is complete.

Update after user authorization:

- Only operate objects whose names include `盛云_孙宇飞`; do not stop/restart public time-spaces, public repositories, or public services.
- In `盛云_孙宇飞_时空_0617`, stop the old running same-repository package first:
  - `V1 / 盛云_孙宇飞_仓库`: `运行 -> 停止`
- Then select and start the new package:
  - `V3 / 盛云_孙宇飞_仓库`: `已部署 -> 运行`
- `V2 / 盛云_孙宇飞_仓库` stayed `停止`.

Verified conclusion: for the fixed personal test time-space, same-repository package version update can work by stopping the old running personal package before starting the new deployed package. This rule applies only to personal/named objects unless the user explicitly authorizes broader impact.

## 2026-06-22 Config Client Instance Version Trap

Verified on `盛云_孙宇飞_CRUD工程_0620`:

- `组态系统客户端 -> 管控单元实例配置 -> NadirL2` can show an instance model version as updated:
  - `NadirBack / 盛云_孙宇飞_后台_CRUDDemo_0620 / v2`
  - `NadirFront / 盛云_孙宇飞_前端_CRUDDemo_0620 / v2`
- The `NadirBack` row-level `提交版本` can finish with:
  - `GUID: 276cb189-67c5-47d1-94be-7e76f5f5af4e`
  - `100% / 提交成功`
- This does **not** prove the runtime App has loaded that version.

Runtime verification must still query the formal preview's inner page runtime:

```js
var page = document.querySelector(".page_view").__vue__
var st = page.spaceTimeId
var res = await Query(
  new StringMap({ type: 21001, cloudID: 107, areaID: 0, timeout: 5000 }),
  new StringMap({
    mode: 2,
    spaceTimeGUID: st.guid,
    returnFields: [
      "$id", "$guid", "$name", "$modelguid",
      "$modelversion", "$spaceTimeGUID"
    ]
  })
)
```

In the verified failed update case, formal runtime still returned:

```text
盛云_孙宇飞_后台_CRUDDemo_0620@NadirBack
$modelversion = 1
```

even though the config client showed `NadirBack v2`.

2026-06-23 product-provider correction:

- The earlier two-row shape with `NadirFront` is not required when the frontend model only has pages.
- For page-only frontend work, keep only backend/runtime-bearing rows in this instance list and bind the page through `数字孪生可视化`.
- If an old page-only frontend row exists and runtime behaves inconsistently, treat it as a candidate dirty/unnecessary instance after saving evidence and confirming with the user.

## 2026-06-22 运维部署 Client Update Caveats

Verified on `运维部署客户端 -> 盛云_孙宇飞_CRUD工程_0620 -> 管控单元实例`:

- The target row is `NadirL1`. It belongs to the user's own CRUD project even though the row name itself does not contain `盛云_孙宇飞`.
- `停止` can succeed:
  - progress dialog reaches `100% / 成功`
  - row status changes to `未启动`
- The progress dialog remains in the DOM as:

```text
#m运维部署管理_进度展示
.el-dialog__wrapper.page_run_pop
pointer-events: auto
```

It blocks later clicks even after success. Header is hidden, so a visible close button may not be available. Before clicking more actions, inspect or close/hide this stale success dialog and save evidence.

- After the stale dialog was hidden, row-level `更新` and `部分更新` were both clickable by DOM/real coordinates, but no progress dialog, toast, or runtime version change was observed. Treat this path as **not verified**.
- Selecting `NadirL1` and using top `批量启动` is verified:
  - `批量启动进度`
  - `共2个待执行时空节点`
  - `2/2`
  - `批量启动成功`
  - row status returns to `已启动`
- A later attempted `批量停止 -> 批量部署 -> 批量启动` refresh did not reliably trigger `批量停止/批量部署`, likely because of stale progress wrappers and selection-state ambiguity. Do not claim batch deploy/update is verified until a clean run captures the progress dialog and final runtime `$modelversion`.

Current stop condition for this path:

```text
If config client shows v2 but formal runtime Query still shows modelversion=1
after stop/start, stop changing frontend scripts and ask a human to help identify
the correct 运维更新 / 部署刷新 entry.
```

## 2026-06-22 Verified Runtime Package Generation And Update

The previous stop condition was resolved for `盛云_孙宇飞_CRUD工程_0620 -> NadirL2`.

Critical correction, refined by the product provider on 2026-06-23:

- Row-level `NadirBack -> 提交版本 -> 100% / 提交成功` only submits the instance repository.
- It does not create the time-space repository package consumed by 运维部署.
- 运维更新 can only see new versions after the time-space package is generated.
- The intended visible order is to submit the target time-space first with `时空列表 -> 批量提交`; this time-space submit carries the instances.
- `管控单元实例配置提交` after that is a check/fallback, not the primary package trigger.

Verified API package generation path:

1. In `组态系统客户端 -> 盛云_孙宇飞_CRUD工程_0620 -> 管控单元实例配置`, select `NadirL2`.
2. Close or hide stale child submit pages first. Stale pages can stay mounted as:

```text
m数字孪生实例化_实例_提交版本
.show_child_view_container
```

3. Open the platform child page `数字孪生实例化_时空_提交版本` with public variables:

```js
spaceTimeRepoGuids = ["4fa17a11-b923-4b36-b1e8-c39ca1bcf62c"]
versionInstruction = "ai-nadirl2-spacetime-submit-v2-20260622"
```

Using `PageRun.ShowChild(...)` on the `数字孪生实例化_框架页面` PageRun is verified. Calling global `ShowChild(...)` from raw iframe JS is not valid because `ShowChild` is a PageRun method, not a window global.

For future visible runs, prefer the product-provider route:

```text
NadirL2 selected in 时空列表
-> top-right ellipsis/dropdown
-> 批量提交
```

Verified success signal:

```text
transferData.eventName = Finish
_asyncCreatePacketCallback result:
  errorcodes: [0]
  guids: ["4fa17a11-b923-4b36-b1e8-c39ca1bcf62c"]
  versions: [2]
```

4. Verify 运维 can see the new package:

```js
IQueryRepoPacketsList(selectRepoGUID = "4fa17a11-b923-4b36-b1e8-c39ca1bcf62c")
```

Expected result after generation:

```text
repopktversionlist = [1, 2]
```

5. Update the running PU instance:

```js
IUpdatePUInstance(
  instRepoGUID = "4fa17a11-b923-4b36-b1e8-c39ca1bcf62c",
  updateVersion = 2
)
```

Verified result:

```text
returndata.errorcode = 0
errormsg = success
```

6. Verify deployment state:

```text
IQuerySTObjectInfo(reposGUID=[NadirL2 guid])
  NadirL2: 已部署 / 已启动

IQuerySTRepoCfgInfo(instRepoGUID=NadirL2 guid)
  NadirFront: 已部署 / 已启动 / strepocfgver=2
  NadirBack: 已部署 / 已启动
```

Evidence:

- `wos4-artifacts/snapshots/pagerun_showchild_spacetime_submit_nadirl2_20260622.json`
- `wos4-artifacts/snapshots/query_repopackets_after_real_spacetime_submit_20260622.json`
- `wos4-artifacts/snapshots/poll_update_puinstance_nadirl2_v2_20260622.json`

Remaining boundary:

- Frontend runtime `Call(DemoCrudBackend_CUSTOMFUNC@NadirBack.QueryRecords)` still returns `-220006 / WebJS App引擎超时` after the package update.
- Passing `SetRunInfo({stType:5, spaceTime:"NadirL2", devName:"NadirBack"})` did not fix it.
- Therefore the current unresolved issue is the backend App call/debug path, not the package-generation/update path.

## 2026-06-22 运维接口必须在 PageView 脚本环境执行

Verified on `盛云_孙宇飞_CRUD工程_0620 -> NadirL2` after a later frontend script patch:

- The config client can generate a new spacetime package, but querying/updating that package from the config page's raw `window.Call` can still return:

```text
IQueryRepoPacketsList -> ret=-210133
```

- Opening `运维部署客户端`, selecting project `盛云_孙宇飞_CRUD工程_0620`, and executing the same call from the 运维 page `PageView.eval(...)` context is verified. The script environment must expose injected platform globals:

```js
typeof SetRunInfo === "function"
typeof Call === "function"
typeof $Variable === "object"
```

- Do not run the 运维 backend APIs with raw top-window `Call(...)` or with a temp script containing raw Chinese. On this Windows setup, ASCII temp files must use Unicode escapes inside JS source:

```js
var appName = "\u8fd0\u7ef4\u90e8\u7f72\u7ba1\u7406_\u914d\u7f6e\u540e\u53f0";
var stFullPath = "\u7cfb\u7edf\u670d\u52a1\u914d\u7f6e";
```

- Verified V3 update result:

```text
IQueryRepoPacketsList(selectRepoGUID=NadirL2) -> [1,2,3]
IUpdatePUInstance(instRepoGUID=NadirL2, updateVersion=3) -> success
IQuerySTRepoCfgInfo:
  NadirFront strepocfgver=3 / 已部署 / 已启动
  NadirBack  strepocfgver=5 / 已部署 / 已启动
IQuerySTObjectInfo:
  NadirL2 / 已部署 / 已启动
```

Evidence:

- `wos4-artifacts/backups/front_backend_call_20260622/eval_update_nadirl2_after_front_patch_ascii_safe.json`

Remaining boundary:

- Old formal client tabs can retain old mock button scripts until reopened.
- Refreshing existing `public/index.html?...clientGuid...` tabs can produce an empty white shell with no iframe; this is not a valid runtime verification.
- To verify frontend backend `Call` after package update, reopen a fresh blue WebJS client object through the visible object-management/desktop route, then inspect the inner `.page_view` runtime.

