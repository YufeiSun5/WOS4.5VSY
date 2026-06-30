---
name: wos4-object-create-verify
description: Historical WOS4 App/FU object creation notes plus current object-management verification rules. Use only to verify already deployed objects, logs, and runtime state in Time Space Object Management, or to read old 0617 evidence. Do not use this skill to create content in Time Space Object Management for current backend work.
---

# WOS4 Object Verify And Legacy Create Notes

## Scope

Use this skill after backend models, business events, and custom calculations have been:

```text
建模系统提交
-> 组态系统实例化
-> 运维部署客户端部署/更新/启动
-> 时空对象管理平台可见
```

Current use is verification only:

```text
WOS4 main desktop
-> 时空对象管理平台
-> select deployed time-space/object
-> records / logs / view / debug
-> verify Trace/onCreate/business behavior
```

Do not create missing objects in `时空对象管理平台`. If the target is missing, return to 运维部署 or model/package version work.

## Deprecated Historical Creation Route

The following route was historically verified in an older 0617 source/meta-language demo. It conflicts with the current backend-chain rule and must not be used as the current workflow:

Verified route:

```text
WOS4 main desktop
-> 时空对象管理
-> select top-level time-space
-> 创建
-> 应用模板: 选择
-> select copy
-> fill object name
-> 确定
-> select created object
-> 日志
-> 脚本日志
-> verify Trace/onCreate
```

Do not enter `KingStudio_V20260514`. Do not use dynamic URLs as the business entry. Use visible UI navigation with `browser-harness`.

## Required Skills

Read and follow these first:

- `D:\DEV_D\WOS4.5\.ai\skills\wos4-browser-harness\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-human-navigation\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-repository-package-deploy-start\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-manual-to-skill\SKILL.md`

## Verified Baseline

Treat these as evidence, not hard-coded defaults for future work:

- Top-level time-space: `盛云_孙宇飞_时空_0617_TOPV2`
- Repository: `盛云_孙宇飞_仓库`
- Running package: `V2 / meta-language-demo-0617-package-v2-oncreate-trace`
- Copy 2:
  - name: `盛云_孙宇飞_元语言查询Demo_0617_拷贝2`
  - type: `元语言`
  - copy ID: `7205759403792795538`
  - copy GUID: `6a4a427d-b856-4a1a-8b6d-d8d5ffc4f579`
  - model GUID: `0eb5ff6c-93d1-481f-96a4-1c8be6646531`
  - model version: `2`
- Created object: `盛云_孙宇飞_TraceDemo_0617`
- Verified script log:
  - function: `onCreate`
  - level: `Level2`
  - content: `wos4-demo-oncreate-0617ok`
  - time: `2026/6/17 13:56:56:169`

## Important Boundary

The independent `时空对象管理` client did not display child time-space `盛云_孙宇飞_时空_0617_V2` after reload/reopen. It did display the top-level time-space `盛云_孙宇飞_时空_0617_TOPV2`.

Until the child-time-space object entry is understood, create runtime objects from a top-level deployed/running time-space.

## Preconditions

Before using this skill:

1. The target time-space must be deployed and running.
2. The repository package inside that time-space must be deployed and running.
3. The target copy must exist in the selected repository package.
4. `browser-harness --doctor` must pass the core checks:
   - `chrome running`
   - `daemon alive`
   - `active browser connections`

Do not claim runtime availability just because a repository package is running. The object must appear in Object Management and its runtime behavior must be checked.

## Open Object Management

1. Start from the WOS4 main desktop.
2. Open `时空对象管理` by visible desktop/taskbar operation.
3. Wait for the client to load. Slow network is common; after double-clicking, watch for requests or UI changes before retrying.
4. If a stale Object Management window does not show a newly created top-level time-space, refresh the WOS4 main desktop and reopen the visible client.

Do not use a dynamic URL as the entry path.

## Select Time-Space

1. In the Object Management left tree, find the top-level target time-space.
2. Click the exact tree label.
3. Verify the main list/desktop context updates.

Verified working target:

```text
盛云_孙宇飞_时空_0617_TOPV2
```

## Deprecated: Create Object From Copy

This section is retained only as historical 0617 evidence. Do not execute it for current backend work.

1. Click `创建`.
2. In the create dialog, click `应用模板: 选择`.
3. In the copy selector, select the intended copy row.
4. Confirm the selector.
5. Fill the create dialog `名称`.
6. Keep other fields at their default unless the task requires a specific account, access time-space, group, or log setting.
7. Click `确定`.
8. Verify the created object appears in the Object Management list.

Verified behavior:

- After confirming, the created object can become running automatically.
- A desktop card for the object can appear immediately.
- The list row may have class `data-item is-running`.

## Verify Script Log

1. Select the created object.
2. Click `日志`.
3. In the log dialog, choose `脚本日志`.
4. Query or read the table with the current date range.
5. Verify the expected function, level, and content.

Verified default date range was:

```text
2026-06-17 00:00:00 -> 2026-06-18 00:00:00
```

Verified log row:

```text
function: onCreate
level: Level2
content: wos4-demo-oncreate-0617ok
```

## Prohibited Actions

Do not use this skill to:

- Stop, delete, force-delete, anti-deploy, or overwrite running objects.
- Create objects in shared/customer spaces unless explicitly requested by the user.
- Create any missing backend/FU/App object in `时空对象管理平台` during the current backend workflow.
- Treat a child time-space as selectable in Object Management until that path is separately verified.
- Mark runtime verification complete without checking either visible object state or logs.

## Evidence

Save screenshots/snapshots for:

```text
object_open_topv2
object_open_topv2_retry
object_topv2_create_template
object_create_from_copy2
object_script_log_probe
```

Append conclusions to:

```text
WOS4_deep_test_notes.md
MEMORY.md
```

## Separate Blue WebJS Route

Do not keep blue WebJS client-object creation logic in this skill.

Use:

```text
D:\DEV_D\WOS4.5\.ai\skills\wos4-blue-client-object-create\SKILL.md
```

That skill now owns historical blue-client verification notes:

- purple vs blue object distinction
- `盛云_孙宇飞_Noctiluca_客户端` vs `客户端1` dual-name handling
- `仓库不存在 / 654319619` failure path
- `视图` recursive-frame runtime validation

This skill remains the generic object-creation/log-verification skill for:

- FU/App objects created from running copies
- `日志 -> 脚本日志` verification
- `onCreate` smoke-chain evidence
