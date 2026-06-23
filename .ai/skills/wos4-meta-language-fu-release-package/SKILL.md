---
name: wos4-meta-language-fu-release-package
description: Submit a verified WOS4 source/meta-language function unit, generate a function-unit copy, package the personal repository, and verify the warehouse data package in Time Space Development. Use after a FU model is already created/opened in `时空功能开发`; does not cover deployment or start/stop operations.
---

# WOS4 Source/Meta-Language FU Submit, Copy, Package

## Scope

Use this skill only for the verified middle part of the current backend demo route:

```text
时空功能开发
-> personal repository
-> source/meta-language FU model
-> 提交
-> 查看 history
-> 生成拷贝
-> 打包 repository
-> 仓库包 verify
```

Do not enter `KingStudio_V20260514`. Do not use dynamic `/public/` or `GetFileContent` URLs as entry points. Use visible UI navigation and `browser-harness` unless the user changes the tool requirement.

## Required Skills

Read and follow these first:

- `D:\DEV_D\WOS4.5\.ai\skills\wos4-browser-harness\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-human-navigation\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-meta-language-fu-create\SKILL.md`

## Verified Baseline

- Repository: `盛云_孙宇飞_仓库`
- Repository GUID: `ad547dd3-dede-4192-9efd-638377876e8c`
- FU model: `盛云_孙宇飞_元语言查询Demo_0617`
- FU model GUID: `0eb5ff6c-93d1-481f-96a4-1c8be6646531`
- FU model version: `1`
- FU submit note: `meta-language-demo-0617-initial-empty-template`
- FU submitted time: `2026-06-17 11:33:42`
- FU model version 2: `meta-language-demo-0617-oncreate-trace-v2`
- FU version 2 submitted time: `2026-06-17 13:03:48`
- FU copy: `盛云_孙宇飞_元语言查询Demo_0617_拷贝1`
- FU copy GUID: `7015f2f0-f623-4a05-b33c-cefcec5b9d53`
- FU copy 2: `盛云_孙宇飞_元语言查询Demo_0617_拷贝2`
- Package note: `meta-language-demo-0617-package-1`
- Package time: `2026-06-17 11:52:52`
- Package V2 note: `meta-language-demo-0617-package-v2-oncreate-trace`
- Package V2 time: `2026-06-17 13:10:49`

Treat IDs/GUIDs as evidence only. Do not hard-code them as navigation inputs.

## Edit And Save FU Script

Verified minimal script edit:

```text
function: onCreate
script: Trace(2, "wos4-demo-oncreate-0617", "ok");
```

Manual basis:

- `模型库.md` says meta-language App models support editing function scripts and include system functions such as `declare`, `onCreate`, `onDestroy`, `onMessage`, and `onException`.
- `元语言函数_基础函数.md` documents `Trace(int32 logLevel,string description,var content)`.

Editor rules:

1. Select the function from the left function list, for example `onCreate`.
2. Click the Monaco code area and edit the script through visible editor actions.
3. Do not use browser-harness `press_key('S', modifiers=2)` as save; in the verified run it inserted `S` into the editor instead of saving.
4. Click the toolbar icon `.wos-editor-save`.
5. Confirm all relevant `.tab-un-save` markers for the model tab and function tab become `display:none`.
6. Only then submit the model version.

## Submit FU Model

From the source/meta-language FU editor:

1. Confirm the editor shows the FU name, `编辑态`, and top button `提交`.
2. Click the top-level `提交`, not an inner code or function item button.
3. In `版本提交`, fill `提交说明`.
4. Click `确认`.
5. Wait for message text containing `提交成功`.
6. Open `查看` or the history entry and confirm version, time, and submit note.

Expected verified history row:

```text
版本: 1
提交时间: 2026-06-17 11:33:42
说明: meta-language-demo-0617-initial-empty-template
```

Expected verified version 2 row:

```text
版本: 2
提交时间: 2026-06-17 13:03:48
说明: meta-language-demo-0617-oncreate-trace-v2
```

## Generate FU Copy

Return to `时空开发` repository view through the visible tab:

1. Select the FU model card/list item.
2. Confirm toolbar `生成拷贝` is enabled.
3. Click `生成拷贝`.
4. In the dialog, select/check the submitted version row.
5. Click `生成`.
6. Wait for `生成拷贝成功`.
7. Re-read the list and confirm a `功能单元拷贝` exists.

Verified copy result:

```text
名称: 盛云_孙宇飞_元语言查询Demo_0617_拷贝1
母模型 GUID: 0eb5ff6c-93d1-481f-96a4-1c8be6646531
母模型版本: 1
```

Verified version 2 result:

```text
名称: 盛云_孙宇飞_元语言查询Demo_0617_拷贝2
母模型版本: 2
```

## Package Repository

Important selection trap:

- When a FU model is selected, `生成拷贝` is enabled but `打包` is disabled.
- When no card is selected, repository-level `打包` is enabled.
- Use the bottom `重置` button to clear selected model/copy cards before packaging.

Steps:

1. Clear the selected object card with visible `重置`.
2. Confirm toolbar `打包` is enabled.
3. Click `打包`.
4. In `仓库打包`, fill `打包说明`.
5. Click `开始`.
6. Wait for progress `完成 100%`.
7. Close the package dialog.

Verified package note:

```text
meta-language-demo-0617-package-1
```

Verified package V2 note:

```text
meta-language-demo-0617-package-v2-oncreate-trace
```

## Verify Warehouse Data Package

Open through visible UI:

```text
时空功能开发 -> 仓库包 -> 仓库数据包管理
```

The package dialog has two search areas. Avoid confusing them:

- Main repository search near top y=72 is not the package-list filter.
- Package dialog filter is around y=205.
- The package dialog text box is the visible `el-input__inner` at about x=1213, y=205.
- The adjacent field selector defaults to `描述`, so search by package note first.

Filter by:

```text
meta-language-demo-0617-package-1
```

Expected verified row:

```text
名称: 盛云_孙宇飞_仓库
描述: meta-language-demo-0617-package-1
GUID: ad547dd3-dede-4192-9efd-638377876e8c
提交时间: 2026-06-17 11:52:52
版本: 1
```

## What This Skill Does Not Cover Yet

Do not use this skill for:

- Binding data objects or runtime objects.
- `部署管理`.
- `时空对象管理`.
- Service start/stop, delete, overwrite, rollback, or publish.

Those must be probed and verified separately before creating deployment skills.

## Evidence

Save screenshots and snapshots for:

```text
meta_fu_submit_dialog_probe
meta_fu_submit_confirm_result
meta_fu_history_view_probe
meta_fu_generate_copy_dialog_probe
meta_fu_generate_copy_result
repo_package_start_result
repo_package_verify_dialog
repo_package_dialog_search_desc
```

Append conclusions to:

```text
WOS4_deep_test_notes.md
MEMORY.md
```
