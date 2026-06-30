---
name: wos4-instantiated-spacetime-refind
description: Re-find already instantiated WOS4 runtime time-spaces and backend instances from the 时空功能开发平台 tree. Use when Codex must confirm whether a backend, custom function copy, business event table, client node, GUID, ID, or repository path exists after 管控单元实例配置, 时空提交版本, 运维部署, or platform reset.
---

# WOS4 Instantiated Spacetime Refind

## Scope

Use this skill after a WOS4 model has been instantiated, submitted, deployed, or reset and Codex needs to locate the real runtime objects again.

This skill answers:

- where the runtime time-space is in `时空功能开发平台`
- whether the backend instance exists under that time-space
- what runtime copy name the frontend should call
- what `ID / GUID / 仓库路径` prove the selected object is real
- whether visible business event objects were generated

It does not create, submit, deploy, or publish objects. For those operations, use the existing create/submit/deploy/client skills first.

## Required Skills

Read and follow these first when browser operation is needed:

- `D:\DEV_D\WOS4.5\.ai\skills\wos4-browser-harness\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-human-navigation\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-instance-submit-package-diagnosis\SKILL.md` if the question involves submit/package progress

Before WOS4 operation, run project preflight and use the correct locked WOS account/profile according to `AGENTS.md`.

## Principle

Do not infer runtime existence from model names, client names, screenshots, or memory alone.

Confirm runtime existence from:

```text
时空功能开发平台
-> 时空管理
-> 数据区
-> 工程
-> KF4.5Root
-> runtime time-space
-> backend instance
-> right-side runtime objects
-> 属性: ID / GUID / 仓库路径
```

The model layer and runtime tree are different:

- backend model name: source model in 建模系统
- runtime time-space: instantiated and submitted time-space node under `KF4.5Root`
- backend instance: child node under the runtime time-space
- runtime custom function copy: right-side object named like `<CustomFunc>@<BackendInstance>`
- page/client objects: usually separate digital-twin visualization/client path, not proof that the backend exists

## Operation Order

1. Collect candidate names from the current task records:
   - project name
   - expected runtime time-space name
   - expected backend instance name
   - expected backend model or custom function name
   - expected business event table names
2. Enter `时空功能开发平台 -> 时空管理`.
3. Start from the data-area root. Do not jump directly to a remembered dynamic URL as the primary proof.
4. Expand the tree path in order:

```text
默认数据区 or target data area
-> KF4.5工程
-> <工程名>
-> KF4.5Root
-> <运行时空名>
-> <后端实例名>
```

5. After each click, wait for the tree and right panel to stabilize. WOS4 may show delayed children; do not judge a node empty after only 1 to 3 seconds.
6. Select the runtime time-space node and record:
   - selected node text
   - `ID`
   - `GUID`
   - `仓库路径`
7. Select the backend instance node and record:
   - selected node text
   - `ID`
   - `GUID`
   - `仓库路径`
   - right-side visible cards
8. In right-side cards, look for:
   - runtime backend support objects, for example `业务事_运行后台@<BackendInstance>`
   - runtime custom function copy, for example `<CustomFunc>@<BackendInstance>`
   - business event objects, for example `pal_menu_node`
   - `实例配置`
9. If expected business event objects are missing from the first visible row, check pagination, horizontal/vertical scroll, filters, and total count before calling them absent.
10. Click the runtime custom function copy when method names or runtime copy GUID are needed. Record its `ID / GUID / 母模型GUID / 母模型版本`.

## Evidence Shape

Save a snapshot under `wos4-artifacts/snapshots/` with this shape:

```json
{
  "capturedAt": "2026-06-26T13:32:58",
  "mode": "refind-own-instantiated-spacetime",
  "treePath": [
    "KF4.5工程",
    "<工程名>",
    "KF4.5Root",
    "<运行时空名>",
    "<后端实例名>"
  ],
  "runtimeTimeSpace": {
    "name": "<运行时空名>",
    "id": "",
    "guid": "",
    "repoPath": ""
  },
  "backendInstance": {
    "name": "<后端实例名>",
    "id": "",
    "guid": "",
    "repoPath": ""
  },
  "runtimeCards": [
    { "title": "<visible right-side card text>" }
  ],
  "customFunctionCopy": {
    "name": "<CustomFunc>@<BackendInstance>",
    "id": "",
    "guid": "",
    "baseModelGuid": "",
    "baseModelVersion": ""
  },
  "businessEvents": {
    "expected": [],
    "visible": [],
    "missingAfterPaginationCheck": []
  },
  "screenshot": ""
}
```

Also save a screenshot if the user is asking whether Codex actually found the object.

## Palimpsest Example

This is an example only; do not hard-code it for other tasks.

Verified 2026-06-26 path:

```text
KF4.5工程
-> 盛云_孙宇飞_Palimpsest工程_0626
-> KF4.5Root
-> PalimpsestL1_0626R2
-> PalimpsestBack_0626R2
```

Verified backend instance:

```text
PalimpsestBack_0626R2
ID: 288230376151751586
GUID: 92d89140-0736-41f2-873b-6bfab8f3d276
仓库路径: KF4.5工程/盛云_孙宇飞_Palimpsest工程_0626/KF4.5Root/PalimpsestL1_0626R2/PalimpsestBack_0626R2
```

Verified runtime custom function copy:

```text
PalimpsestBackend_CUSTOMFUNC_CUSTOMFUNC@PalimpsestBack_0626R2
ID: 7205759403792797099
GUID: 9d464a7f-232b-4a27-9bf5-e7fe479f4f3f
母模型GUID: aa5d8314-87b7-453c-96e6-21e4327a8778
母模型版本: 6
```

Expected Palimpsest business events from the backend model:

```text
pal_menu_node
pal_department
pal_mentor
pal_intern_student
pal_assessment_batch
pal_assessment_record
pal_assessment_score_detail
pal_operation_log
```

If only part of these are visible in the right-side card area, inspect pagination/scroll before concluding that the missing tables were not instantiated.

## Common Pitfalls

- Do not confuse `客户端1` or a named visual client with backend runtime proof.
- Do not confuse source model path in 建模系统 with runtime instance path in 时空功能开发平台.
- Do not use a remembered `PalimpsestBack` name after creating a new unique `PalimpsestBack_0626R2`; re-read the tree.
- Do not call a runtime absent while WOS4 is still loading. Wait for tree children, right-side cards, and property panel to stabilize.
- Do not ignore top-level dialogs. A stale `应用停止`, submit progress, or confirmation dialog makes iframe readings unreliable.
- Do not rely only on total card count. Record visible cards and inspect paging or scroll if expected objects are not visible.

## Completion Criteria

The refind task is complete only when the answer includes:

- full tree path from data area/project to selected runtime node
- selected runtime time-space name and GUID
- selected backend instance name and GUID
- visible runtime custom function copy name
- visible or checked business event objects
- saved JSON snapshot path
- clear boundary of what is still unverified, such as frontend `Call` smoke test
