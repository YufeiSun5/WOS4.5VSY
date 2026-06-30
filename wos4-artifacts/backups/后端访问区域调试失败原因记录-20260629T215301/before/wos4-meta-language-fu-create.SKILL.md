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
   - use the configured local business user from `wos4-artifacts/config/wos4.local.ini`
   - do not write the username or password into skill docs or scripts
4. `添加用户访问信息 -> 其他云`
   - must add one client business user row; leaving this list empty still produced `未找到访问区域`
   - read the row from `wos4-artifacts/config/wos4.local.ini` `[debug_access]`
   - required fields: `cloud_name`、`cloud_id`、`host`、`port`、`username`、`password`
   - do not write real host, username, password, Cookie or Token into skill docs or scripts

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

## Backend Model Custom Calculation With Business Events

2026-06-24 Palimpsest verification added this reusable boundary:

- A single WOS4 backend model can contain both `数据模型 -> 事 -> 业务事` and `逻辑模型 -> 自定义计算`.
- In `盛云科技_孙宇飞_Palimpsest_后台_0623`, the same model contains eight business-event tables and `PalimpsestBackend_CUSTOMFUNC_CUSTOMFUNC`.
- The custom calculation editor can add multiple functions with `stringMap<var> strmapPara` input and `string` return values.
- Frontend callers should use the same verified parameter direction as earlier CRUD work: `new Variant(new StringMap(...))`.

Verified Palimpsest functions:

```text
QueryAssessmentPage(stringMap<var> strmapPara) -> string
QueryAssessmentData(stringMap<var> strmapPara) -> string
QueryAssessmentSmoke(stringMap<var> strmapPara) -> string
PalimpsestCrudService(stringMap<var> strmapPara) -> string
QueryAssessmentRecords(stringMap<var> strmapPara) -> string
CreateAssessmentRecord(stringMap<var> strmapPara) -> string
UpdateAssessmentRecord(stringMap<var> strmapPara) -> string
DeleteAssessmentRecord(stringMap<var> strmapPara) -> string
SubmitAssessmentScore(stringMap<var> strmapPara) -> string
PalimpsestHandleError(stringMap<var> strmapPara) -> string
```

Verified startup-debug pattern:

```c
stringMap<var> strmapPara;
string resultText;
strmapPara["action"] = "startupSmoke";
resultText = QueryAssessmentRecords(strmapPara);
Trace(2, "PalimpsestBackend.onCreate.QueryAssessmentRecords", resultText);
```

Use `onCreate` to call the backend functions that need smoke verification before clicking `.wos-editor-debug-start`. Accepted debug success signals:

```text
编译成功
变量 / 监视 / 堆栈 / 断点
.wos-editor-debug-stop appears
```

Do not claim real database CRUD from this alone. This verifies function protocol, compilation, submit, and startup debug execution path. Persisting records into business-event runtime records still requires package deployment, object creation, same-spacetime access, and record API verification.

2026-06-27 frontend preview smoke verification:

- Runtime spacetime and backend instance were confirmed in the instantiated Palimpsest R2 chain:

```text
PalimpsestL1_0626R2 = aba6cf7a-0715-4966-8eaf-0f448eba7bc9
PalimpsestBack_0626R2
PalimpsestBackend_CUSTOMFUNC_CUSTOMFUNC@PalimpsestBack_0626R2
```

- `PalimpsestContent_82` preview button `Backend Smoke` successfully called `QueryAssessmentRecords` and returned `ret=0`.
- Frontend parameters must match the function metadata exactly. For `stringMap<var> strmapPara`, call with:

```js
params: [new Variant(new StringMap(/* strmapPara */))]
```

- Do not call these functions with `params: []`; that is not the same signature as `stringMap<var> strmapPara`.
- Raw iframe probing can show `SetRunInfo === undefined`; use visible preview button execution or page/button eval context as the acceptance path for frontend smoke.

2026-06-27 Palimpsest real Query replacement:

- `QueryAssessmentRecords` was changed from static fake JSON to a real `Query(param,input,output)` call against the business-event record `pal_assessment_record`.
- The frontend/backend invalid-parameter failure was caused by calling a function whose signature is `stringMap<var> strmapPara` with `params: []`. The platform checks parameter count and type against function metadata; an empty params array is not a default `stringMap`.
- Correct frontend call shape:

```js
var p = new StringMap({})
p._insert("action", "query", "string")
p._insert("pageNo", 1, "int32")
p._insert("pageSize", 20, "int32")
p._insert("keyword", "", "string")

var input = new StringMap({
  identifierType: 2,
  name: "PalimpsestBackend_CUSTOMFUNC_CUSTOMFUNC@PalimpsestBack_0626R2",
  funcname: "QueryAssessmentRecords",
  params: [new Variant(p)]
})
```

- Current numeric constants for planned business-event records:

```text
param.type = 4106
objectCondition.mode = 17
objectCondition.identifierType = 2
condition.mode = 61
condition.mainMode = 53
```

- The model editor saved and submitted the real query change with submit note `pal-20260627-real-query-api`; debug start after submit compiled successfully.
- Create/Update/Delete/Submit real record shape was verified from the local manual and compiled in `PalimpsestBackend_CUSTOMFUNC_CUSTOMFUNC` on 2026-06-27, but the first runtime v3 probe exposed an important type mistake:
  - `pal_assessment_record / pal_assessment_score_detail / pal_operation_log` are historical business events under `历史 -> 业务事`.
  - Historical business-event record type is `3106`.
  - Planned business-event record type is `4106`.
  - If code uses `4106` against `pal_assessment_record`, runtime `Create/Query` can return `-30038 = 对象不存在`.
- For `pal_assessment_record`, use record type `3106`, name identifier `2`, and record condition mode `51` for record-id updates/deletes.
- `CreateAssessmentRecord` uses `Create(param,input,output)` with `param.type=3106` and `input.fieldValues=[{objectName:"pal_assessment_record",dataFields:[...],dataValues:[...]}]`.
- `UpdateAssessmentRecord` and `SubmitAssessmentScore` use `Update(param,input,output)` with `input.condition.mode=51`, `input.condition.objectIdentifierType=2`, and `input.condition.objectRecordFieldValues=[{objectName:"pal_assessment_record",recordIDs:[recordID],mulFieldValue:{...}}]`.
- `DeleteAssessmentRecord` uses `Delete(param,input,output)` with `input.condition.mode=51`, `input.condition.objectIdentifierType=2`, `input.condition.objectRecords=[{objectName:"pal_assessment_record",recordIDs:[recordID]}]`, and `input.condition.deleteMode=1`.
- Do not hand-build JSON strings with escaped quotes in large injected scripts; browser template literals can consume the backslashes before the meta-language compiler sees them. Build `stringMap<var>` return objects and return `ConvertToJsonString(returnData,true)` instead.
- The model editor saved, compiled, and submitted these real CRUD functions with submit note `pal-20260627-real-crud-api`. This is model-layer evidence only; runtime package update/deploy/start is still required before claiming the blue client calls this version.

2026-06-28 Palimpsest runtime Create -> Query success:

- Direct runtime API verification from `worker-space` proved that `pal_assessment_record` insertion works when all of these are true:
  - `param.type=3106`.
  - `input.appspacetimeguid="aba6cf7a-0715-4966-8eaf-0f448eba7bc9"` is present for out-of-App direct calls.
  - `input.objectIdentifierType=2`.
  - `fieldValues[0].objectName="pal_assessment_record"`.
  - `dataFields` includes record system fields plus all 14 business fields: `$startTime/$endTime/$parentGUID/$parentRecordID/id/student_id/batch_id/mentor_id/professional_score/attitude_score/task_score/teamwork_score/innovation_score/total_score/status/comment/updated_at/deleted`.
  - `dataValues` is real `var[][]` protobuf data; each cell must be wrapped as a typed value, for example `{int64Value:"132225120000000000"}`, `{stringValue:"S2026041001"}`, `{doubleValue:38}`, `{dateTimeValue:{...}}`, `{boolValue:false}`.
- Passing raw JS values inside `valueArray2DValue.arrays[].values` is not enough; the platform reaches the record API but returns `-31539`.
- Omitting `appspacetimeguid` from a worker-space direct call returns `-30018`.
- Verified insert result: `ret=0 / errorcodes=[0] / ids=["216172782113783809"]`.
- Verified query result: `Query mode=51` by `recordID=216172782113783809` returned `ret=0` and row `id=PAL_DIRECT6_20260627175612`.

Use this verified shape before changing the backend function body again. If the same shape is implemented inside an already-running App backend function, the App context may supply the space-time automatically; direct external probes still need `appspacetimeguid`.

2026-06-28 follow-up method correction:

- The failed fresh insert path used `workerWindow.Call("Create", {param,input}, opts)` plus a generic `me(... dataValues:"valueArray2DValue")` conversion. It reached the historical record API but returned `-31520 = 添加记录时缺少必要的属性`.
- The successful fresh insert path used the worker-space module helper `Ke("Create", req)` (`mod.aV`) and manually encoded `fieldValues[0]` as a protobuf `keyValueList`.
- For direct backend record smoke tests from `worker-space`, build `fieldValues[0].dataValues` explicitly:

```js
const values = [
  {int64Value: "132225120000000000"},
  {int64Value: "132225120000023456"},
  {stringValue: ""},
  {uint64Value: "0"},
  {stringValue: testId}
  // ...remaining typed cells...
];
const fieldValue = {keyValueList: [
  {key: "objectName", value: {stringValue: "pal_assessment_record"}},
  {key: "dataFields", value: {stringArrayValue: {stringArray: fields}}},
  {key: "dataValues", value: {valueArray2DValue: {arrays: [{values}]}}}
]};
```

- Fresh verification after this correction inserted `recordID=216172782113783810 / id=PAL_DIRECT6_20260627210127`, then queried the same record with `mode=51` and got `ret=0`.
- Conclusion: if direct insert fails while the object is visible in `时空对象管理平台`, first check the call helper and protobuf encoding. Do not modify model properties to "insert data"; use the historical business-event record `Create/Query` API.

2026-06-28 Palimpsest remaining CRUD correction:

- Direct worker-space runtime verification proved the remaining historical business-event operations are valid with `param.type=3106`:
  - `Update` by `recordID=216172782113783811` returned `ret=0`, and query read back `status=updated_by_update_function / total_score=88.5`.
  - Score submit is also an `Update` by `recordID`; it returned `ret=0`, and query read back score fields `40/19/19/10/10`, `total_score=98`, `status=completed_by_submit`.
  - `Delete` by `recordID=216172782113783812` returned `ret=0`; querying that record then returned `-31537 = 记录ID不存在`, which is the expected hard-delete result.
- `UpdateAssessmentRecord` and `SubmitAssessmentScore` must use:

```text
param.type = 3106
input.appspacetimeguid = <target spacetime guid> when called outside App context
condition.mode = 51
condition.objectIdentifierType = 2
condition.objectRecordFieldValues = [{ objectName, recordIDs, mulFieldValue }]
```

- `DeleteAssessmentRecord` must use the same `3106 / mode=51 / objectIdentifierType=2`, but `condition.objectRecords=[{ objectName, recordIDs }]` plus `condition.deleteMode=1`.
- The backend edit-state functions `UpdateAssessmentRecord / SubmitAssessmentScore / DeleteAssessmentRecord` were rewritten with those shapes and verified to contain `3106`, `appspacetimeguid`, `mode=51`, and no remaining `4106`.
- The model editor submitted this corrected remaining-CRUD version with note `pal-20260628-real-remaining-crud-api` and captured `提交成功`.
- Boundary: this proves direct record API shape and model-version submission. Runtime package update/deploy/start is still required before claiming the blue client or running App instance is using this corrected version.
- Evidence:
  - `wos4-artifacts/snapshots/palimpsest_remaining_crud_direct_verify_20260628.json`
  - `wos4-artifacts/snapshots/palimpsest_remaining_functions_after_update_20260628.json`
  - `wos4-artifacts/snapshots/pal_remaining_funcs_submit_confirm_20260628.json`

## What This Skill Does Not Cover Yet

Do not include these actions in this skill until separately verified:

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
