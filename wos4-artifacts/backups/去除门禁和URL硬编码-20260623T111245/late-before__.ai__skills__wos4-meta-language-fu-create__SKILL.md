---
name: wos4-meta-language-fu-create
description: Create or reopen a WOS4 source/meta-language function unit in Time Space Development. Use when operating `时空功能开发`, creating a personal repository, selecting `元语言`, creating/opening a FU model, or validating the backend demo path that avoids WebJS and the deprecated KingStudio route.
---

# WOS4 Source/Meta-Language FU Create

## Scope

Use this skill only for the verified first part of the current backend demo route:

```text
WOS4 main desktop
-> 时空功能开发
-> 时空开发 / 默认数据区
-> personal repository
-> 新建
-> 功能单元 / 元语言
-> 创建并打开
```

Do not use `KingStudio_V20260514`. Do not use dynamic `/public/` or `GetFileContent` URLs as entry points. Do not create WebJS for the current backend demo; WebJS is only a historical/manual candidate and a recorded failed probe.

## Required Skills

Read and follow these first:

- `D:\DEV_D\WOS4.5\.ai\skills\wos4-login\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-human-navigation\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-browser-harness\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-manual-to-skill\SKILL.md`

Use `browser-harness` for this workflow unless the user explicitly changes the tool requirement.

## Verified Baseline

- Repository: `盛云_孙宇飞_仓库`
- Repository ID: `288230376151738378`
- Repository GUID: `ad547dd3-dede-4192-9efd-638377876e8c`
- Verified FU: `盛云_孙宇飞_元语言查询Demo_0617`
- Verified FU ID: `1441151880758559635`
- Verified FU GUID: `0eb5ff6c-93d1-481f-96a4-1c8be6646531`
- Verified editor state: `编辑态`

Treat IDs/GUIDs as evidence only. Do not hard-code them as navigation inputs.

## Create Personal Repository

If the personal repository is missing:

1. Open WOS4 and enter `时空功能开发` by visible desktop/taskbar navigation.
2. Select `时空开发`.
3. In the left `时空管理` area, click the left-side `新建`, not the main toolbar `新建`.
4. Fill:
   - `名称`: the repository name, for example `盛云_孙宇飞_仓库`
   - `描述`: a concise purpose note
5. Click `确定`.
6. Re-read the tree and confirm the new repository is selected under `默认数据区`.

Evidence to save:

```text
wos4-artifacts/snapshots/<repo>_created.json
wos4-artifacts/screenshots/<repo>_created.png
```

## Create Source/Meta-Language FU

After the repository is selected:

1. Click the main toolbar `新建`.
2. In the `新建` dialog, keep `功能单元` selected.
3. Fill `名称` and `描述`.
4. Real-click the `元语言` card container.
5. Confirm both `创建` and `创建并打开` become enabled.
6. Click `创建并打开`.
7. Wait for the editor to show the FU name and source/meta-language function list.

The critical trap: filling name and description is not enough. The `元语言` card must receive a real click; otherwise `创建` and `创建并打开` remain disabled with no visible validation error.

Expected editor signals:

```text
declare
onCreate
onDestroy
onException
当前模型: <FU name>
提交
调试配置
版本状态: 编辑态
对象类型: 功能单元模型
仓库路径: <repository name>
```

## Reopen Existing Source/Meta-Language FU

After the personal repository is selected and the FU card is visible:

1. Do not use the dynamic editor URL as an entry.
2. Select/open the FU from the repository card list by real mouse action.
3. Use a fast double-click on the card title area (`.span_label`), not a slow double-click on the image area.
4. With `browser-harness`, issue two separate left clicks with an interval around `0.04s`:

```python
click_at_xy(title_x, title_y, clicks=1)
wait(0.04)
click_at_xy(title_x, title_y, clicks=1)
```

5. After the fast double-click, wait for editor signals instead of retrying immediately. Network or iframe loading may take several seconds.

Verified failure modes:

- A slow double-click with a long interval can only select the card and never open the editor.
- `click_at_xy(..., clicks=2)` may not behave like the user's real fast double-click in WOS4.
- Double-clicking the image container is less reliable than double-clicking the title text.

Expected editor signals are the same as create-open:

```text
declare
onCreate
onDestroy
onException
当前模型: <FU name>
.wos-editor-save exists
Monaco editor exists
```

## Source-Language Constraints

Keep these user-confirmed constraints in mind when extending backend work:

- Do not assume source/meta-language supports chained calls in one expression. Prefer split temporary variables and one-step-at-a-time statements.
- The backend editor exposes a debugger-oriented surface through `调试配置`; it is conceptually closer to a VS Code-style debug page than to a pure script textarea.

Current status:

- function create/open/save/submit is verified
- debugger entry and access-region bring-up are verified
- debugger can now reach a real running state on a clean backend
- breakpoint / single-step / variable inspection values are not yet verified

## Verified Debugger Preconditions

For the current browser-mode environment, `调试配置` has a real, reusable prerequisite chain. If any of these are missing, the backend editor may compile but still fail with:

```text
未找到访问区域
启动调试失败
```

Verified minimum setup for `盛云_孙宇飞_后台_查询Demo_0618 -> 查询Demo后台_CUSTOMFUNC`:

1. `时空信息 -> 已选信息`
   - must be the real target spacetime object, not an old client/object probe
   - verified working value: `盛云_孙宇飞_时空_0617`
2. `添加时空访问信息 -> 外云访问时空列表`
   - must contain the real spacetime GUID
   - verified row:
     - `云ID = 107`
     - `时空GUID = 99d504aa-4676-4ef2-8bf9-ee6183f242e2`
3. `添加用户访问信息 -> 本云 -> 业务`
   - keep `tsdbFUUser / <密码已脱敏>`
4. `添加用户访问信息 -> 其他云`
   - must add one client business user row; leaving this list empty still produced `未找到访问区域`
   - verified row:
     - `名称 = cloud107`
     - `IP = 221.239.19.118`
     - `端口 = 9770`
     - `业务用户名 = 孙宇飞`
     - `业务密码 = <密码已脱敏>`

Observed boundary:

- fixing only the spacetime selection and spacetime GUID was not enough
- adding the `其他云客户端用户` row removed the `未找到访问区域 / 启动调试失败` failure on the next debug start

The same prerequisite chain was re-verified on the clean backend:

```text
盛云_孙宇飞_后台_CRUDDemo_0620 -> DemoCrudBackend_CUSTOMFUNC
```

Extra DOM-level findings that are now verified and reusable:

1. In `调试配置`, checking a spacetime row is not enough. The checked row must be moved to the right table through the middle add button:

```text
id = data-add
```

2. Success signal before confirming the dialog:

```text
已选信息 table contains: 盛云_孙宇飞_时空_0617
```

3. `添加用户访问信息` and `添加时空访问信息` both required real clicks on `点击添加`; plain DOM click was less reliable than coordinate click in the current browser-harness session.

What is verified here:

- `调试配置` can be opened, edited, confirmed, reopened, and re-read
- debug start can pass the previous access-region failure gate
- on clean backend `DemoCrudBackend_CUSTOMFUNC`, clicking `.wos-editor-debug-start` can enter real debug state

Verified debug-state signals:

```text
left debug panes appear: 变量 / 监视 / 堆栈 / 断点
compile panel shows: 编译成功
.wos-editor-debug-start disappears
.wos-editor-debug-stop appears
```

What is still not verified:

- a stable breakpoint hit workflow
- pause / step in / step over / continue button semantics
- variable inspection values during a paused breakpoint

## Editing a Custom Function

The editor has a left `新建` function button (`.function-add`) and a function list (`.model-function-list-item-text`).

Verified flow for adding a function:

1. Click `.function-add`.
2. In the `dialog-add-function` dialog, fill:
   - `功能名`
   - `输入参数`, for example `string filterKey`
   - `返回值类型`, for example `string`
3. Click `确定`.
4. Confirm the function appears in the left list and opens as an active Monaco tab.
5. Edit code in Monaco.
6. Click `.wos-editor-save` and wait until all `.tab-un-save` markers have `display:none`.
7. Click top toolbar `提交`.
8. If the warning says `您还有未保存的脚本，是否保存后再提交?`, click `保存`.
9. In `版本提交`, fill `提交说明` and click `确认`.
10. Verify with `历史版本 -> 查看`; the new version row must appear.

Browser-harness keyboard trap:

- `press_key('A', modifiers=2)` and `press_key('V', modifiers=2)` can type literal `A` / `V` into Monaco.
- Use explicit Control key down/up CDP events for shortcuts, or avoid shortcut-dependent editing when possible.
- Multi-line clipboard paste into Monaco may be unstable; for smoke functions prefer a single-line body until a better editor API is verified.

Verified backend smoke function:

```text
Function: QueryDemoData
Input: string filterKey
Return: string
Body: return "[{\"area\":\"A\",\"device\":\"Pump-01\",\"value\":12.3},{\"area\":\"B\",\"device\":\"Valve-02\",\"value\":45.6}]";
Submitted version: 3
Submit description: query-demo-data-backend-method-0617-single-return
```

## What This Skill Does Not Cover Yet

Do not include these actions in this skill until separately verified:

- Editing function code beyond opening the editor.
- `提交` behavior and version persistence.
- `生成拷贝`.
- `仓库包` or `打包`.
- `部署管理`.
- `时空对象管理` deployment/start verification.
- breakpoint-level debugger operation after launch success.

Record those as probes in `WOS4_deep_test_notes.md` first. Only create or update downstream skills after a successful operation, re-open check, and evidence capture.

## Evidence

For each run save:

```text
wos4-artifacts/snapshots/<task>_dialog_state.json
wos4-artifacts/screenshots/<task>_dialog_state.png
wos4-artifacts/snapshots/<task>_create_open_result.json
wos4-artifacts/screenshots/<task>_create_open_result.png
```

Append conclusions to:

```text
WOS4_deep_test_notes.md
MEMORY.md
```
