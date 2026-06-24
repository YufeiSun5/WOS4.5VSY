---
name: wos4-business-event-member-edit
description: Edit WOS4 / WellinOS4.5 backend model business-event members, including adding field rows, waiting for delayed row creation, setting member name/type/value/description, changing business-event form type, and verifying the member table persisted. Use when creating or repairing 业务事字段, 表字段, 成员行, realtime/history/plan type choices, or backend table schemas in 建模系统工程浏览器.
---

# WOS4 Business Event Member Edit

## Overview

Use this skill inside 建模系统工程浏览器 when a backend model needs 业务事 member fields. WOS4 member creation is asynchronous: `添加行` can toast `新建成功` before the row is visible, so every automation must wait for the row count or editable row DOM before judging success.

Required companion skills:

- `D:\DEV_D\WOS4.5\.ai\skills\wos4-browser-harness\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-login\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-human-navigation\SKILL.md`

## Workflow

1. Run `ai-preflight.ps1 -Wos4` before WOS4 operations.
2. Open the backend model through visible WOS4 navigation, not a dynamic runtime URL.
3. Navigate to `数据模型 -> 事 -> 业务事`.
4. Select the target business-event node in the middle tree.
5. Set the business-event `形态` intentionally:
   - `实时`: live/current data only.
   - `历史`: records, logs, score details, completed assessment data.
   - `计划`: master data, configuration, menus, departments, mentors, students, batches.
6. For each missing field, click `添加行`.
7. Wait until the member table row count increases or an editable row appears. Do not inspect immediately after the success toast.
8. Replace the default row values. New rows usually appear as `成员1` with type `string`.
9. If a delete confirmation dialog appears, stop broad automation and handle that exact dialog before switching nodes.
10. Save/submit the model through the platform and reopen or reselect the node to verify fields persist.
11. Request post-implementation review from `孙宇飞_review-ai` when fields were added, deleted, renamed, or when any `更新失败` appeared.

## Wait Rule

After clicking `添加行`, wait up to 10 seconds for one of these signals:

- `共 N 条` increases.
- A member row input appears under columns `名称 / 类型 / 值 / 描述 / 操作`.
- The default text `成员1` appears in the member table.

Treat a quick `新建成功` toast only as an operation acknowledgement. It is not enough to prove the row exists.

Count only visible member rows. WOS4 can keep hidden or stale table DOM for previous model lists or previously selected business events; do not count rows just because `tr.el-table__row` exists. A valid member row must have visible `input.el-input__inner` controls in the current member table, and its bounding rect should be in the member-table area.

For long member tables, first reset the table scroll position before mapping visible rows to schema fields. WOS4 table virtualization can render only the current scroll window; direct "DOM row N = schema field N" assumptions can corrupt rows when the table is scrolled.

## Delete Confirmation

Deleting a member is a two-step operation:

1. Click the row `删除`.
2. Confirm the modal text, for example `确定要删除成员“_extra_delete_me”吗？`.

Do not switch business-event nodes while a delete confirmation modal is open. If the target member name in the modal is not exactly the intended row, click `取消` and capture a screenshot. A stale confirmation modal can remain visible after switching to another business event, so never infer the modal belongs to the currently selected node.

## Failure Stop Rule

Stop member editing immediately when any of these happens:

- Multiple `更新失败` toasts appear.
- A row name remains `成员N` after attempted rename.
- Duplicate member names appear.
- A delete confirmation modal is open and the target member is unclear.
- The selected business-event name and visible member table appear inconsistent.

After stopping, save a screenshot and JSON snapshot, then record the state as `blocked` or `needs-review`. Do not continue bulk writes across multiple business events.

## Editing Fields

Preferred field columns:

- `名称`: stable ASCII identifier, for example `student_no`.
- `类型`: select from WOS4 supported member types. Keep ids/codes/names as `string`; scores/sort numbers as numeric if available; flags as boolean if available; dates/timestamps as date/datetime if available. If the dropdown only supports basic choices, choose the closest supported type and record the limitation.
- `值`: default value only when the business meaning requires one.
- `描述`: short Chinese business description, for example `学生学号`.

When using browser-harness, prefer DOM/value-setter edits only after uniquely identifying the target row. For dropdowns, first open one row's type selector and inspect available options before assuming type names.

## Persistence-Safe Input

Do not rely on direct JavaScript `input.value = ...` or native value-setter writes as proof of persistence. In Palimpsest backend member tables, direct value writes can make the current DOM look correct but revert after switching business-event nodes.

For member names that must persist:

1. Select the exact `.treeNodeLabel` business-event node and wait until the member table row count appears.
2. Focus the target `input.el-input__inner`.
3. Select the current text with the browser selection API or real keyboard shortcut.
4. Type the new field name through browser-harness `type_text(...)`.
5. Press `Tab` or click outside the input to trigger the platform blur/update path.
6. Wait at least one second for the update request and toast.
7. Switch to another business-event node, then switch back and re-read rows before considering the field name persisted.

Use direct DOM value writes only for temporary visual experiments or immediate cleanup probes. If the field name reverts to `成员N` after reselecting the node, rerun that field through the real typing path.

## Verification

Save evidence under `wos4-artifacts/`:

- Screenshot after rows appear.
- JSON snapshot listing business-event name, form type, and member rows.
- Save/submit message capture.
- Reopen/reselect verification snapshot.

Do not claim fields are complete unless every target business event shows non-empty member rows after verification.

Verification must include a pollution audit across all target business events:

- Empty tables that should have fields.
- Residual default names such as `成员1`, `成员7`, or `_extra_delete_me`.
- Duplicate names.
- Wrong shape (`实时` where `计划` or `历史` is required).
- Row count mismatch against the schema.
- Any visible or captured `更新失败`.

## Review Handoff

After implementation, create or update a review request for `孙宇飞_review-ai` when the task touched WOS4 business-event members. The review request should ask review-ai to check:

- Whether screenshots and JSON snapshots prove before/after state.
- Whether any member names remain as `成员N` or `_extra_delete_me`.
- Whether row counts match the schema.
- Whether delete confirmations were handled deliberately.
- Whether failed updates are documented instead of hidden.
- Whether Git-tracked files exclude secrets and include only intended evidence.

## Palimpsest Type Guide

For the `盛云科技_孙宇飞_Palimpsest` test backend:

- Use `计划` for `pal_menu_node`, `pal_department`, `pal_mentor`, `pal_intern_student`, `pal_assessment_batch`.
- Use `历史` for `pal_assessment_record`, `pal_assessment_score_detail`, `pal_operation_log`.
