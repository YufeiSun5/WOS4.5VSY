---
name: wos4-instance-submit-package-diagnosis
description: Diagnose WOS4 组态系统客户端管控单元实例提交、时空仓库提交、进度条详情和打包回调失败。Use when `提交版本` reports `-14496`, `-15495`, `因当前时空仓库未提交版本`, when a `时空仓库版本提交进度` dialog must be captured, or when instance packaging must be distinguished from backend model code errors.
---

# WOS4 Instance Submit Package Diagnosis

## Scope

Use this skill in:

```text
组态系统客户端
-> 工程
-> 管控单元实例配置
-> 时空列表 / 实例列表
-> 提交版本
```

It covers:

- checking whether the target instance is under the intended time-space node
- submitting the current time-space repository before submitting instances
- capturing the `时空仓库版本提交进度` dialog progress bar and per-row details
- distinguishing model-code failure from platform package/base-copy failure
- capturing real package callback details instead of only visible `errorCode`

## Required Skills

Read and follow these first:

- `D:\DEV_D\WOS4.5\.ai\skills\wos4-browser-harness\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-human-navigation\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-config-client-screen-create\SKILL.md`

## Verified Palimpsest Findings

2026-06-24 Palimpsest evidence:

- `PalimpsestBack` under `PalimpsestL1` failed row submit with `打包回调报错 :: errorCode = -14496`.
- A known-good probe instance `PalimpsestKnownGoodBack -> 盛云_孙宇飞_后台_CRUDDemo_0620` also failed under `PalimpsestL1`, so the failure was not unique to Palimpsest CRUD function code.
- A probe instance under `PalimpsestRoot` initially reported:

```text
因当前时空仓库未提交版本，故无法提交实例
```

- Submitting the `PalimpsestRoot` time-space repository first changed the failure to a package/compile failure:

```text
PalimpsestRoot -> 提交完成, 部分失败
PalimpsestRootKnownGoodBack -> 打包回调报错 :: errorCode = -14496
```

- Detailed console serialization showed the real callback payload:

```text
errorCode = -15495
errorMessage = get copy base model data failed.

errorCode = -14496
errorMessage = compiler failed ... can not find the identifier.
modelGUID = 4afd8750-11e8-4d9c-a3e0-49f539ab9ed1
modelVersion = 11
functionName = 4afd8750-11e8-4d9c-a3e0-49f539ab9ed1_11#onCreate
```

Interpretation:

- Visible `-14496` alone is insufficient.
- If a known-good model and the target model both fail with the same internal `modelGUID=4afd8750...`, the blocker is the package/base App compile chain, not just the target backend CRUD source.
- If the UI says the current time-space repository is not submitted, submit the selected time-space repository with the small toolbar `提交版本` icon before retrying row-level instance submit.

2026-06-26 Palimpsest 0626 successful submit evidence:

- Created new project `盛云_孙宇飞_Palimpsest工程_0626`.
- Created time-space node `PalimpsestL1`.
- Created only the backend runtime instance under that node:

```text
PalimpsestBack
-> 盛云科技_孙宇飞_Palimpsest_后台_0623
-> v2
```

- Did not add the page-only frontend model to `管控单元实例配置 -> 实例列表`; frontend page sprites should be bound later through `数字孪生可视化 -> 客户端 -> 画面列表`.
- Submitted the selected `PalimpsestL1` time-space repository through the small toolbar `提交版本` icon.
- The visible `时空仓库版本提交进度` dialog reached:

```text
100%

PalimpsestL1
657add61-3075-47cb-95a0-0b076373bd3e
100%
提交成功

PalimpsestBack
9a372903-13bd-49b9-808f-6448d5625b03
100%
提交成功
```

- Console callback evidence:

```text
_asyncCreatePacketCallback -> {"errorcodes":[0],"guids":["657add61-3075-47cb-95a0-0b076373bd3e"],"versions":[1]}
_asyncCreatePacketCallback -> {"errorcodes":[0],"guids":["9a372903-13bd-49b9-808f-6448d5625b03"],"versions":[1]}
```

Interpretation:

- Progress dialog rows are the primary success/failure source. Do not rely only on short toast messages.
- If every row in the progress dialog is `100% / 提交成功` and callbacks return `errorcodes:[0]`, the time-space repository and instance package submission are successful.
- A script may miss the result if it waits only for `el-message` toasts. The progress dialog remains visible and should be scraped directly.

## Verified Original CRUD Comparison

2026-06-24 clean CRUD comparison:

- Entered `盛云_孙宇飞_CRUD工程_0620`.
- Opened `管控单元实例配置`.
- Selected `NadirL2`.
- Confirmed row:

```text
NadirBack -> 盛云_孙宇飞_后台_CRUDDemo_0620 / v4
```

- Row-level `提交版本` failed in the original CRUD project too.
- Visible progress:

```text
相关联仓库提交失败
NadirBack//业务事_运行后台 -> 打包回调报错 :: errorCode = -15495
NadirBack//业务内置APP -> 打包回调报错 :: errorCode = -15495
```

- Detailed callback:

```text
errorCode = -15495
errorMessage = get copy base model data failed.
modelGUID = f2cafeb2-27f2-43df-881f-0fcb6b49ab45
modelVersion = 7
copyGUID = a0b5fddf-4654-48a7-92e2-bb9ad124da92

errorCode = -15495
errorMessage = get copy base model data failed.
modelGUID = 4cdf8aaa-dcff-45ed-a061-ba1bd711673b
modelVersion = 22
copyGUID = a8e2c6ed-1190-43fa-bb92-f3204c910f76
```

Interpretation:

- If the same known-good backend fails in its original project, stop treating the target project as the primary cause.
- Prioritize platform/base-copy package-chain diagnosis before changing target business code.
- The failing associated repositories can identify whether the issue is in `业务事_运行后台`, `业务内置APP`, or another linked package.

Known mapping from previous runtime evidence:

```text
f2cafeb2-27f2-43df-881f-0fcb6b49ab45 / v7
  -> 业务事_运行后台@NadirBack/业务事_运行后台

4cdf8aaa-dcff-45ed-a061-ba1bd711673b / v22
  -> 业务内置APP@NadirBack/业务内置APP
  -> 业务内置APP@NadirFront/业务内置APP
```

If these GUIDs fail with `get copy base model data failed`, inspect copy/base-model data and package generation state before editing user business functions.

Manual error-code confirmation:

```text
错误码_模型库.md:
MDB_ERR_QUERY_BASE_MODEL_NOT_EXIST
-15495
基模型不存在
```

## Operation Order

1. Select the intended time-space node in `时空列表`.
2. Re-read the instance table and confirm the target instance row is visible under that node.
3. If row submit says the time-space repository has no version, click the small toolbar `提交版本` icon in the `时空列表` header.
4. Fill a clear submit note and confirm.
5. Wait for the `时空仓库版本提交进度` / `版本提交进度` dialog. Capture:
   - progress percentage text, usually `100%`
   - visible table headers
   - every visible row: `名称 / GUID / 状态 / 详情`
   - whether every row is `100% / 提交成功`
6. If repository submit returns partial failure, inspect the progress rows. Do not treat the repository row success as instance success.
7. Close any `版本提交进度` dialog before retrying row-level `提交版本`; stale progress dialogs block new submits.
8. For row submit, install the detailed console capture before clicking.
9. Confirm and save the full callback JSON and progress rows under `wos4-artifacts/snapshots/`.

Completion rule:

```text
done = progress dialog visible
  AND all required rows are present
  AND each required row has 状态 100%
  AND each required row has 详情 提交成功
  AND _asyncCreatePacketCallback errorcodes are all 0
```

Failure rule:

```text
failed = any row contains 失败 / 错误 / errorCode
  OR callback errorcodes contain a nonzero code
  OR progress dialog disappears without a readable success row
```

When the server is slow, wait for the progress dialog rows instead of clicking submit again. Repeated submit clicks can create stale dialogs or duplicate operations.

## Detailed Callback Capture

Do not serialize console objects with `String(arg)` only; that collapses the useful payload to `[object Object]`.

Use a JSON-safe serializer:

```javascript
function safeArg(a) {
  try {
    if (a && typeof a === "object") {
      return JSON.stringify(a, function(k, v) {
        if (typeof v === "function") return "[Function]";
        if (v instanceof Map) return { __map: Array.from(v.entries()) };
        return v;
      }).slice(0, 5000);
    }
    return String(a);
  } catch (e) {
    return Object.prototype.toString.call(a) + ":" + String(a);
  }
}
```

Capture at least:

- `IQuerySpaceTimeRepoDetails`
- `_asyncCreatePacketCallback`
- `repoGuidAndInfoMap`
- visible progress dialog rows
- visible message-box text

## Progress Dialog Capture

The progress dialog is more reliable than toast messages. Use it for both success and failure evidence.

Capture shape:

```javascript
function readSubmitProgress(doc) {
  const dialogs = Array.from(doc.querySelectorAll(".el-dialog,.el-message-box"))
    .filter(d => {
      const r = d.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    })
    .filter(d => /版本提交进度|时空仓库版本提交进度/.test(d.innerText || ""));

  return dialogs.map((d, i) => ({
    i,
    text: (d.innerText || "").slice(0, 5000),
    rows: Array.from(d.querySelectorAll("tr,.el-table__row"))
      .map((r, j) => ({ j, text: (r.innerText || "").slice(0, 1000) }))
      .filter(r => r.text)
  }));
}
```

Accept success only after reading rows similar to:

```text
名称    GUID                                  状态    详情
PalimpsestL1    ...                          100%    提交成功
PalimpsestBack  ...                          100%    提交成功
```

Do not stop at the top progress value alone. `100%` can appear while a row still contains a failure detail.

If the user visually confirms the dialog succeeded but automation keeps waiting, stop waiting and immediately read:

- `doc.body.innerText`
- progress dialog rows
- captured console callbacks
- screenshot of the progress dialog

Then update the skill or script condition. Treat that as a script-recognition problem unless the dialog rows contain a failure.

## Encoding Rule

When using `browser-harness` ASCII temp files, do not write raw Chinese labels in JS/Python source.

Use `String.fromCharCode(...)` or escaped strings for labels such as:

```text
新建
确定
取消
关闭
提交版本
盛云_孙宇飞_根组
```

Raw Chinese in an ASCII temp file can become `????`, causing selectors to miss dialogs or buttons.

## Evidence Files From Palimpsest

Current evidence:

```text
wos4-artifacts/snapshots/pal_known_good_create_result_20260624.json
wos4-artifacts/snapshots/pal_known_good_submit_result_20260624.json
wos4-artifacts/snapshots/pal_root_known_good_create_result_20260624.json
wos4-artifacts/snapshots/pal_root_spacetime_submit_result_20260624.json
wos4-artifacts/snapshots/pal_root_known_good_submit_clean_detail_20260624.json
wos4-artifacts/snapshots/pal_back_submit_clean_detail2_20260624.json
wos4-artifacts/snapshots/crud_project_list_after_refresh_20260624.json
wos4-artifacts/snapshots/crud_nadirl2_rows_probe_20260624.json
wos4-artifacts/snapshots/crud_nadirback_submit_detail_20260624.json
wos4-artifacts/snapshots/pal_0626_spacetime_submit_result_20260626.json
wos4-artifacts/screenshots/pal_0626_spacetime_submit_result.png
```

Append conclusions to:

```text
WOS4_deep_test_notes.md
MEMORY.md
```
