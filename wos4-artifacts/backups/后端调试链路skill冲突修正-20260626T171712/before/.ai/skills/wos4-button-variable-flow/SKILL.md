---
name: wos4-button-variable-flow
description: WOS4 按钮变量联动流程。用于实现和验证按钮点击后修改页面变量，再触发表格和曲线图表数据刷新的交互；覆盖按钮 linkList 脚本、filterKey/clickCount 变量、点击前后快照验证。
---

# WOS4 按钮变量联动

## 适用场景

当用户要求这些功能时使用：

- 加一个按钮。
- 点击按钮修改变量。
- 变量变化后刷新表格。
- 变量变化后刷新 ECharts 曲线。
- 验证打开预览后点击仍可用。

相关前置 skill：

- 登录：`D:\DEV_D\WOS4.5\.ai\skills\wos4-login\SKILL.md`
- 布局：`D:\DEV_D\WOS4.5\.ai\skills\wos4-layout-devtools-skill\SKILL.md`
- 组件持久化：`D:\DEV_D\WOS4.5\.ai\skills\wos4-component-persistence\SKILL.md`

## 已验证结论

按钮组件在预览运行态点击时会执行：

```js
this.linkList[0].enable && this.evalFun(this.linkList[0].script, this.getProperty("UIName"))
```

因此当前最可信的持久化入口是：

- `button.linkList[0].enable = true`
- `button.linkList[0].script = "..."`
- `button.propData.linkList[0].enable = true`
- `button.propData.linkList[0].script = "..."`

注意：

- 按钮脚本里不要写顶层 `return`，否则预览时报 `Illegal return statement`。
- 按钮事件脚本里也不要写顶层 `await`。`evalFun()`/Click 脚本环境不是 async 函数，直接写 `await Call(...)` 会报语法错。异步调用要改成 `Call(...).then(...).catch(...)`。
- 需要结果时，把结果写到 `page.__xxx` 或组件属性里。
- 点击后必须在预览页验证，不要只看编辑器。
- `button.propData.propData.linkList` 不是当前可接受的最终落点；脚本如果只掉进这个嵌套槽位，预览页很可能仍拿到默认空壳事件。

如果按钮要直接调后端 App：

- `param.cloudID` 不能盲写 `0`；当前 4.5 环境里，编辑器/预览实测应优先用 `getLocalCloudID()`。
- `Call` 只能调当前运行时空可见的 App。即使后端对象已经在别的个人时空运行，当前页面运行上下文未绑定到同一时空时，预览里会返回 `-210133`（目标App不存在）。
- 不要在编辑器预览壳或直接 `GetFileContent/.../index.html` 页里证明前后端打通。必须先检查：

```js
var pageVm = document.querySelector(".page_view_container").__vue__
var pageInfo = pageVm._getPageInfo()
```

如果 `pageInfo.data.spaceTime.guid` 为空，说明当前页面不是正式客户端同时空运行入口。此时即使 `Query(... spaceTimeGUID=NadirL2 ...)` 能查到后端 App，`Call(...)` 仍可能返回：

```text
-210139 = 时空不匹配
```

因为 `Call(param,input)` 没有显式目标时空参数，平台依赖页面运行壳自动插入 `appspacetimeguid`。
- 这类后端调用按钮必须同时验证三件事：脚本已持久化、预览页已真正装载、运行态返回码已记录。

## 变量建议

2026-06-20 当前页 `盛云_孙宇飞_前端_CRUDDemo_0620 -> 查询列表` 已验证变量原始结构：

```js
[
  { KSCGUID: "pilot_seedData_0620", varName: "seedData", varType: 2, varDefaultValue: "[...json...]", varDes: "假数据JSON" },
  { KSCGUID: "pilot_filterKey_0620", varName: "filterKey", varType: 2, varDefaultValue: "", varDes: "当前过滤关键字" },
  { KSCGUID: "pilot_refreshCounter_0620", varName: "refreshCounter", varType: 1, varDefaultValue: 0, varDes: "中转输发计数" }
]
```

也就是说，页面变量当前应直接写入 `page.data.variable` 数组，字段名用：

- `KSCGUID`
- `varName`
- `varType`
- `varDefaultValue`
- `varDes`
- 运行值字段为 `varValue`

在按钮脚本里也要兜底写：

```js
page.$Variable = page.$Variable || {}
page.$Variable.filterKey = state.filter
page.$Variable.clickCount = state.clickCount
```

## 按钮脚本模式

脚本结构：

```js
var page = this.KMComponentsMng.get("PageView")
var kids = this.KMComponentsMng.$Children || {}
var all = Object.values(kids)

function pdOf(obj) {
  return obj && (obj._props && obj._props.propData || obj.propData || obj)
}

function byProto(proto) {
  return all.find(function(v) {
    var pd = pdOf(v)
    return pd && pd.prototypeName === proto
  })
}

var table = byProto("ElementTable")
var chart = byProto("ElementChart")
var button = byProto("ElementButton")

var state = page.__wos4InteractionState ||
  (page.__wos4InteractionState = { filter: "A", clickCount: 0 })

state.clickCount += 1
state.filter = state.filter === "A" ? "B" : (state.filter === "B" ? "ALL" : "A")

page.$Variable = page.$Variable || {}
page.$Variable.filterKey = state.filter
page.$Variable.clickCount = state.clickCount

var rows = buildRowsByFilter(state.filter, state.clickCount)

table.table({ columns: columns, totalData: rows, border: true, fit: true, showHeader: true })
chart.SetOption(optionFromRows(rows), true)
button.button({ text: "切换数据：" + state.filter + " / " + state.clickCount })

page.__wos4LastInteraction = {
  filter: state.filter,
  clickCount: state.clickCount,
  rows: rows.length
}
```

## 已验证结果

在预览页：

- 初始：按钮 `切换数据：A / 0`，表格 2 行，区域 A。
- 点击一次：按钮 `切换数据：B / 1`，表格 2 行，区域 B，图表刷新。
- 点击两次：按钮 `切换数据：ALL / 2`，表格 4 行，图表刷新。

2026-06-17 追加验证：

- `盛云_孙宇飞_画面Demo_0617` 的 `demo_query_button` 已成功持久化为后端 `Call` 脚本，并在提交后重载编辑器仍存在。
- 该脚本必须使用 `Call(param, inputMap).then(...).catch(...)`，不能使用顶层 `await`。
- 预览页已不再是 `about:blank`，可正常打开运行页 iframe。
- 但当前预览运行态点击按钮后返回 `-210133`，按钮文案变为 `backend fail / -210133`，说明页面运行上下文尚未绑定到能看到 `盛云_孙宇飞_QueryDemo_0617` 的同一时空。

证据文件：

- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\wos4_interaction_verify.json`
- `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\wos4_interaction_preview_verify.png`
- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\frontend_button_backend_patch_probe.txt`
- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\frontend_button_backend_runtime_probe2.txt`
- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\frontend_reload_verify_script_probe.txt`
- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\frontend_switch_preview_inspect.txt`
- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\frontend_click_preview_button_runtime.txt`

2026-06-20 clean restart 追加结论：

- 在 `盛云_孙宇飞_前端_CRUDDemo_0620 -> 查询列表` 的新 clean 页面中，`PageView.linkToPropertyJson()` 可稳定给出 `创建时 / 存在时 / 关闭时` 的 page-level link 模板，但 `变量改变` 分组仍为空。
- 当前直接把单个脚本项喂给 `PageView.upDateLink(...)` 会触发内部 `forEach` 结构错误，因此不能把“空页面里直接代码生成 1001 变量改变 link”当成已验证能力。
- 当前 clean 主线的稳定写法应先收敛为：

```text
page.data.variable
-> page.initPageVariable()
-> page.data.linkMng.linkList 中写入 linkId=0 的 创建时脚本
-> button.propData.linkList 中写入 linkId=200001 的 Click 脚本
-> 创建时脚本和 Click 脚本共用 page.__pilotRefresh / page.__xxxRefresh 之类的页面级 helper
```

- 这条路径已经在编辑器 runtime 和保存环节通过，但还不等于“变量改变脚本模式已在 clean 页面重新验收完成”。
- 如果要恢复成“打开时 ++ 中转变量、按钮点击 ++ 中转变量、业务逻辑统一放变量改变脚本”的正式模式，后续必须先抓到一个真实可回放的 `linkId>=1000` 变量改变 link 对象样本，再更新本 skill。

2026-06-20 同轮继续深挖后的修正：

- `预览` 真实点击后，clean 页的预览链路已确认可用；树、表格、图表、按钮都能正常显示，且创建时脚本已生效。
- 但“只把脚本写进 `button.propData.linkList`”这条假设在当前 clean 页面里被证伪。
- 编辑器 runtime 中，按钮对象存在两套 click link 数据：

```text
btn.linkList
btn.propData.propData.linkList
```

- 当前实测最初脚本被写进了嵌套的 `btn.propData.propData.linkList[0]`，而预览页按钮实例最终拿到的仍是默认壳：

```json
{
  "linkId": 200001,
  "enable": false,
  "script": "",
  "linkName": "OnClick"
}
```

- 继续实测发现，`PageView.linkMng` 运行态里只存在基础 page link：

```text
0 / 2 / 4
```

并没有任何 `linkId >= 200000` 的 UI 事件项。

- 因此当前更合理的判断是：

```text
按钮 click 脚本要想在预览页真正执行，
除了组件自身 linkList 外，
还需要以平台认可的结构注册进 PageView.linkMng。
```

- 但本轮直接构造：

```text
page.linkMng.jsonToObject([uiLink])
```

仍未把 `200001` 注册进 `PageView.linkMng.linkList`，说明 `jsonToObject` 所需结构还没有被正确复原。

- 从现在开始，不要再把下面这条写法当成“已验证完成”：

```text
page.data.variable
-> page.initPageVariable()
-> page.data.linkMng.linkList 写创建时脚本
-> button.propData.linkList 写 Click 脚本
-> 预览页按钮一定会执行
```

- 新的准确表述应为：

```text
创建时脚本路径已验证；
按钮 Click 脚本的最终持久化路径尚未验证完成。
```

- 下次要继续推进按钮事件时，先去一个人工已配好 click 脚本且预览可点通的页面，成对抓：

```text
btn.linkList
btn.propData.linkList
PageView.linkMng.linkList
```

再回 clean 页复现，不要继续猜结构。

2026-06-20 晚间回归成功，以上“需要注册进 `PageView.linkMng`”判断被当前工作页证伪，结论更新如下：

- 当前工作页：`盛云_孙宇飞_前端_CRUDDemo_0620 -> 页面精灵图 -> 查询列表`
- 编辑器 runtime 已确认：

```text
btn.linkList[0].enable === true
btn.propData.linkList[0].enable === true
page.data.variable = [
  seedData(varType=2),
  filterKey(varType=2),
  refreshCounter(varType=1)
]
page.data.linkMng.linkList 仍只有 0 / 2 / 4
```

- 预览 runtime 已确认：

```text
demo_query_button.__vue__.propData.linkList[0].enable === true
```

- 真实交互结果已确认：

```text
输入 B-01
-> 点击按钮
-> 按钮文案从 查询全部(4) 变成 查询：B-01(0)
-> 表格变为 0 条
-> 页面出现 暂无匹配数据
```

- 因此当前更准确的结论是：

```text
按钮点击脚本能否在预览执行，
关键先看脚本是否真的落在 btn.linkList / btn.propData.linkList，
而不是默认壳或嵌套的 propData.propData.linkList。
当前 working page 不需要可见的 PageView.linkMng UI 事件项，也能在预览执行按钮脚本。
```

- 这不等于“变量改变 link 已验证”。截至本轮，`linkId>=1000` 的变量改变脚本结构仍未被单独回放验证。

新增证据：

- `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\preview_button_filter_success_0620.png`
- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\preview_button_filter_success_0620.json`
- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\button_variable_flow_working_pattern_0620.json`

2026-06-22 formal client recheck for `盛云_孙宇飞_CRUD工程_0620 -> 客户端1_人工干预点_1 -> 查询列表`:

- formal preview after `更新版本` now mounts correctly and inner `.page_view.__vue__.spaceTimeId.spaceTime === "NadirL2"`
- but current `demo_query_button` click script is still a pure frontend mock path

Verified script characteristics:

```text
uses seedData
uses filterKey
uses refreshCounter
builds local rows / local option
does not call Call(...)
```

So for the current clean CRUD page, this button-flow skill only proves:

```text
page variable + button script + table/chart refresh
```

It does **not** prove:

```text
frontend call backend
database query / insert / update
```

When moving from mock interaction to real backend call, treat the current script as a staging pattern only. Replace the local `seedData` branch with `Call(...).then(...).catch(...)`, and record `ret/errorcodes` in runtime evidence.

2026-06-22 same-spacetime backend lookup and Call probe:

- The formal preview page can read the active spacetime from the inner runtime, not from top-level globals:

```js
var page = document.querySelector(".page_view").__vue__
var st = page.spaceTimeId
```

Verified current value:

```text
st.spaceTime = NadirL2
st.guid = 4fa17a11-b923-4b36-b1e8-c39ca1bcf62c
st.id = 1152921504606851278
st.devName = NadirFront
```

- Do not call backend by guessed display name. First query the running App objects in the current spacetime:

```js
var param = new StringMap({
  type: 21001,
  cloudID: 107,
  areaID: 0,
  timeout: 5000
})

var input = new StringMap({
  mode: 2,
  spaceTimeGUID: st.guid,
  returnFields: [
    "$id", "$guid", "$name", "$spaceTimeGUID",
    "$modelguid", "$modelversion"
  ]
})

var res = await Query(param, input)
```

Verified backend row in `NadirL2`:

```text
$name = 盛云_孙宇飞_后台_CRUDDemo_0620@NadirBack
$id = 5911255985900486970
$guid = 4aeb7354-d29d-4969-834e-4310951bd719
$modelguid = 5702ad4a-a934-43a9-9e14-f2ca545abb53
$modelversion = 1
```

- In JS `Call`, use platform `StringMap` for `param/input`, and use lowercase `funcname` as shown in the manual examples. Plain JS objects fail with `_containsKey is not a function`.

```js
var callParam = new StringMap({
  type: 21001,
  cloudID: 107,
  areaID: 0,
  timeout: 3000
})

var callInput = new StringMap({
  identifierType: 1,
  id: "5911255985900486970",
  funcname: "QueryRecords",
  params: [new Variant(new StringMap({ filter: "" }))]
})

var callRes = await Call(callParam, callInput)
```

Current verified result:

```text
ret = -220006
errorcodes = [-220006]
meaning = WebJS App引擎 TimeOut / 超时
```

Additional checks:

```text
identifierType=1 + id=5911255985900486970 + funcname=DefinitelyNoSuchFunc_0622
=> ret=-220006

identifierType=2 + name=盛云_孙宇飞_后台_CRUDDemo_0620@NadirBack + funcname=QueryRecords
=> ret=-220006
```

So the current problem is not only `QueryRecords` and not only ID/name selection. The target backend App is discoverable in the same spacetime, but its Call path does not reach a responsive function-dispatch result.

This proves the frontend can locate the same-spacetime backend App object and issue a `Call`, but it still does **not** prove backend function execution or CRUD success. Treat `-220006` as the current blocking point and inspect backend deployment/function exposure/App user/logs next. Do not patch the page button to claim backend integration until direct runtime `Call` returns `ret === 0`.

2026-06-22 backend debug config follow-up:

- `DemoCrudBackend_CUSTOMFUNC -> 调试配置` must be aligned with the current runtime spacetime before blaming function code.
- For clean `NadirL2`, verified debug config corrections are:

```text
时空信息 / 已选信息 = NadirL2
添加时空访问信息 = 107 / 4fa17a11-b923-4b36-b1e8-c39ca1bcf62c
添加用户访问信息 = APP_RUN runtime user
```

- After saving that config, `.wos-editor-debug-start` reached compile success and the debug panes appeared. This removes the old `未找到访问区域` blocker for this backend.
- After the runtime package update, re-query the App list before every Call. The backend App ID changed from the old v1 value to:

```text
DemoCrudBackend_CUSTOMFUNC@NadirBack
id = 5911255985900487006
modelversion = 3
```

- Calling the latest ID from a page whose `_getPageInfo().data.spaceTime.guid` is empty returns:

```text
ret = -210139
meaning = 时空不匹配
```

So the next validation point is not more backend script editing. It is opening a real published client/object-management entry whose `_getPageInfo().data.spaceTime.guid` equals `4fa17a11-b923-4b36-b1e8-c39ca1bcf62c`, then retrying `Call`.

2026-06-22 after-sales parameter-signature correction:

- After-sales guidance confirmed the platform rule: build call parameters in `onCreate`, and the parameter count/type must exactly match the target function metadata.
- Current clean backend function metadata was re-read from the editor and verified:

```text
DemoCrudBackend_CUSTOMFUNC -> QueryRecords
输入参数 = stringMap<var> strmapPara
返回值类型 = stringMap<var>
```

- Therefore the frontend/backend probe must use:

```js
params: [new Variant(new StringMap({ filter: "" }))]
```

Do not use the older probe shape below for `QueryRecords`; it matches the previous `string filterKey` experiment, not the current function signature:

```js
params: [new Variant("", "string")]
```

- The backend `onCreate` now compiles with the same pattern:

```c
stringMap<var> strmapPara;
stringMap<var> queryResult;

strmapPara["filter"] = "";
queryResult = QueryRecords(strmapPara);
Trace(2, "onCreate.QueryRecords.result", queryResult);
```

- Formal preview cross-check:

```text
1E28... / DF7F... formal NadirL2 pages:
  Query current spacetime Apps => ret=-180985
  meaning from existing notes = current user has no permission to access cloud

Known latest backend ID 5911255985900487006:
  Call(QueryRecords, Variant(StringMap)) => ret=-220006 after 3000 ms
```

This means the current blocker is no longer "wrong `QueryRecords` parameter type"; the remaining blocker is runtime permission / App engine dispatch for the published client. Do not patch the page button to claim backend integration until a direct formal-runtime `Call` returns `ret === 0`.

2026-06-23 after-sales script recheck:

- Verified in the real blue client iframe for `盛云_孙宇飞_Nadir_客户端_0622_对象1`:

```text
runtime page = 查询列表
spacetime = NadirL2
guid = 4fa17a11-b923-4b36-b1e8-c39ca1bcf62c
backend app visible in 时空功能开发平台 = DemoCrudBackend_CUSTOMFUNC@NadirBack
```

- Ordinary iframe `window` is not the same as the page-script runtime. In the raw iframe window:

```text
typeof SetRunInfo = undefined
Call(identifierType=1 or 2) => ret=-210133
```

Do not use raw `window.Call(...)` as proof that frontend/back-end integration is broken or fixed.

- The page-view runtime can call the backend successfully when executed through `.page_view.__vue__.eval(...)`:

```js
function changeSpace(runInfo) {
  return new Promise(function(resolve) {
    SetRunInfo(runInfo, function(res) { resolve(res) })
  })
}

var changeRes = await changeSpace({
  stType: 4,
  spaceTime: "4fa17a11-b923-4b36-b1e8-c39ca1bcf62c"
})

var callParam = new StringMap({
  type: 21001,
  cloudID: getLocalCloudID(),
  areaID: 0,
  timeout: 3000
})

var inParams = new StringMap({})
inParams._insert("filter", "", "string")

var callInput = new StringMap({
  identifierType: 2,
  name: "DemoCrudBackend_CUSTOMFUNC@NadirBack",
  funcname: "QueryRecords",
  params: [new Variant(inParams)]
})

var res = await Call(callParam, callInput)
```

Verified result:

```text
SetRunInfo.ret = 0
Call.ret = 0
returnData.errorcode = 0
returnData.statisticslist[0].stationname = S1
```

- The after-sales button script currently contains a top-level `debugger`. A real button click paused browser-harness/CDP and then still left the UI at `backend fail / -210133` after resume. Therefore this installed button click is **not** accepted as verified frontend integration yet.
- The successful backend result uses lowercase keys in JS:

```text
statisticslist / stationname / areaname / statustext / flowvalue / pressurevalue
```

Normalize both lowercase and camelCase keys before binding table/chart data, otherwise `ret=0` can still render as empty.

Evidence:

- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\actual_after_sales_probe_20260623.json`
- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\actual_after_sales_button_after_resume_20260623.json`
- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\actual_after_sales_call_forms_20260623.json`
- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\actual_after_sales_pv_eval_store_20260623.json`
- `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\actual_nadir_after_desktop_open_20260623.png`
- `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\actual_visible_button_after_click_20260623.png`
- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\actual_visible_button_after_click_20260623.json`

2026-06-23 visible desktop operation correction:

- Do not accept hidden iframe text as a real operation. The accepted visible-operation sequence is:

```text
desktop card 盛云_孙宇飞_Nadir_客户端_0622_对象1
-> double click the non-is-stop card
-> wait for visible running page
-> click the visible blue button at top right
-> compare before/after text and table
```

- This visible sequence was executed. The button script did run because the timestamp in the table changed:

```text
before = 1782175226376
after  = 1782176138064
```

- The visible result still failed:

```text
button text = backend fail / -210133
table first row = CALL_FAIL / ret=-210133
```

- Therefore the page-view probe success must not be confused with button success. Current state is:

```text
PageView.eval direct probe: backend Call ret=0
Visible button click: backend Call ret=-210133
```

Reusable rule:

```text
If Call fails in raw window but succeeds in .page_view.__vue__.eval,
fix the component/page script execution context and data normalizer first.
Do not keep changing backend code or runtime package versions.
```

## 验收清单

- 编辑器中 `button.linkList[0].enable === true`。
- 编辑器中 `button.propData.linkList[0].enable === true`。
- 预览页按钮可点击。
- 预览页 `demo_query_button.__vue__.propData.linkList[0].enable === true`。
- 点击前后按钮文案变化。
- 点击前后表格行数或内容变化。
- 点击前后图表仍有 canvas，数据随 rows 改变。
- 不出现 `Illegal return statement`。
- 不出现顶层 `await` 语法错。
- 如后端函数签名是 `stringMap<var> xxx`，前端 `params` 必须传 `new Variant(new StringMap(...))`，不能传 `new Variant("", "string")`。
- 如涉及后端 `Call`，必须记录 `ret` 和 `errorcodes`；若返回 `-210133`，先排查页面运行时空是否与后端对象一致，再继续改脚本。
