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
9. Save/submit the model through the platform and reopen or reselect the node to verify fields persist.

## Wait Rule

After clicking `添加行`, wait up to 10 seconds for one of these signals:

- `共 N 条` increases.
- A member row input appears under columns `名称 / 类型 / 值 / 描述 / 操作`.
- The default text `成员1` appears in the member table.

Treat a quick `新建成功` toast only as an operation acknowledgement. It is not enough to prove the row exists.

Count only visible member rows. WOS4 can keep hidden or stale table DOM for previous model lists or previously selected business events; do not count rows just because `tr.el-table__row` exists. A valid member row must have visible `input.el-input__inner` controls in the current member table, and its bounding rect should be in the member-table area.

## Editing Fields

Preferred field columns:

- `名称`: stable ASCII identifier, for example `student_no`.
- `类型`: select from WOS4 supported member types. Keep ids/codes/names as `string`; scores/sort numbers as numeric if available; flags as boolean if available; dates/timestamps as date/datetime if available. If the dropdown only supports basic choices, choose the closest supported type and record the limitation.
- `值`: default value only when the business meaning requires one.
- `描述`: short Chinese business description, for example `学生学号`.

When using browser-harness, prefer DOM/value-setter edits only after uniquely identifying the target row. For dropdowns, first open one row's type selector and inspect available options before assuming type names.

## Verification

Save evidence under `wos4-artifacts/`:

- Screenshot after rows appear.
- JSON snapshot listing business-event name, form type, and member rows.
- Save/submit message capture.
- Reopen/reselect verification snapshot.

Do not claim fields are complete unless every target business event shows non-empty member rows after verification.

## Palimpsest Type Guide

For the `盛云科技_孙宇飞_Palimpsest` test backend:

- Use `计划` for `pal_menu_node`, `pal_department`, `pal_mentor`, `pal_intern_student`, `pal_assessment_batch`.
- Use `历史` for `pal_assessment_record`, `pal_assessment_score_detail`, `pal_operation_log`.
