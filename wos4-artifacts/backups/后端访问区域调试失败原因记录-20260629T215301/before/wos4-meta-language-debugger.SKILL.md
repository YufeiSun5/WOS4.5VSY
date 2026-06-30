---
name: wos4-meta-language-debugger
description: Use when debugging WOS4 / WellinOS4.5 meta-language custom calculation functions in the worker-space editor, including setting breakpoints, starting debug, reading Variables / Stack / Breakpoints panels, using step-over / continue buttons, saving browser-harness evidence, or verifying that a custom calculation returns the expected JSON protocol.
---

# WOS4 元语言断点调试

## 用途

在 WOS4 自定义计算编辑器里按人类方式调试：打断点、启动调试、读取左侧 `变量 / 监视 / 堆栈 / 断点`，必要时点击右侧单步按钮，并保存可审计证据。

本 skill 只覆盖已验证的 `browser-harness` 路径。不要把“启动后出现编译成功”当成完整调试通过；必须至少确认断点停住、变量区不再是 `暂无数据`，并能读取堆栈和断点行。

## 前置检查

1. 按项目规则声明当前 AI 身份，并读取对应 `.ai/agents/<身份>.md`。
2. 运行 WOS4 preflight：

```powershell
powershell -ExecutionPolicy Bypass -File wos4-artifacts\scripts\ai-preflight.ps1 -Wos4 -TaskPath wos4-artifacts\tasks\<任务目录>
```

3. 按 `wos4-browser-harness` 运行：

```powershell
$env:Path = 'C:\Users\SunYufei\.local\bin;' + $env:Path
browser-harness --doctor
```

4. 只在已通过人类导航进入自定义计算 `worker-space/index.html?...type=1005` 后操作。动态 URL 只能作为证据，不作为入口。

## 定位调试编辑器

用递归 iframe 查找精确的 worker-space 编辑器，不要误匹配外层 `worker-space-model`：

```javascript
function collectFrames() {
  const frames = [];
  function walk(win, path, chain) {
    let doc;
    try { doc = win.document; } catch(e) { return; }
    frames.push({win, path, chain, href: String(win.location.href)});
    Array.from(doc.querySelectorAll('iframe'))
      .forEach((f, i) => walk(f.contentWindow, path + '.' + i, chain.concat(f)));
  }
  walk(window, 'top', []);
  return frames;
}

function getTarget() {
  const hit = collectFrames().find(f => /\/worker-space\/index\.html/.test(f.href));
  if (!hit) throw new Error('worker editor frame missing');
  let gx = 0, gy = 0;
  for (const fr of hit.chain) {
    const r = fr.getBoundingClientRect();
    gx += r.x;
    gy += r.y;
  }
  return {win: hit.win, doc: hit.win.document, gx, gy, href: hit.href, path: hit.path};
}
```

## 断点流程

1. 如果 `.wos-editor-debug-stop` 存在，先点击停止，并等待 `.wos-editor-debug-start` 恢复。停止后会短暂显示 `停止中`，不要立刻重新启动。
2. 在 Monaco 代码区通过 `.line-numbers` 按文本找行号，再点 `.glyph-margin` 中心位置打断点。不要依赖 DOM 顺序，行号元素可能按可视布局乱序返回。
3. 打断点后必须确认：
   - 代码行侧边出现 `.cgmr.codicon.breakpoint`；
   - 左侧断点区出现 `.breakpoint-item-line`，文本类似 `onCreate / <id>-0: 4`。
4. 点击 `.wos-editor-debug-start` 启动调试。
5. 等待断点暂停。成功暂停的最低证据：
   - `.wos-editor-debug-stop` 存在；
   - 左侧变量区出现变量名，例如 `strmapPara: Array(1)`；
   - 代码区出现 `.debug-interrupt-arrow` 和 `.debug-interrupt-line`；
   - 右侧调试按钮出现 `.debug-continue-run`、`.debug-step-over`、`.debug-stop`。

## 单步验证

断点停住后，点击 `.debug-step-over` 执行下一步。再次读取 `document.body.innerText` 和调试区 DOM：

- `resultText:` 应出现函数返回值；
- 统一后端协议应至少包含 `ok`、`code`、`message`、`traceId`、`data`；
- 如果验证 CRUD 后端，检查 `data.records`、`data.methods`、`data.tables` 是否和设计一致；
- 如果 `resultText` 为空，只能说明断点停在赋值前，继续单步或把断点移到赋值后一行。

已验证示例：`PalimpsestBackend_CUSTOMFUNC_CUSTOMFUNC` 在 `onCreate` 第 4 行断点暂停后，单步一次可读出：

```text
resultText: {"ok":true,"code":"OK","message":"success","traceId":"pal-20260624-backend","data":{...}}
```

其中 `data.tables` 包含 8 张业务事表：`pal_menu_node / pal_department / pal_mentor / pal_intern_student / pal_assessment_batch / pal_assessment_record / pal_assessment_score_detail / pal_operation_log`。

## 证据要求

每次调试至少保存：

- `wos4-artifacts/snapshots/<任务>_debug_breakpoint_<日期>.json`
- `wos4-artifacts/screenshots/<任务>_debug_breakpoint_<日期>.png`

结构化快照建议包含：

```json
{
  "summary": {
    "hasVariables": true,
    "hasResultText": true,
    "hasStack": true,
    "hasBreakpointLine": true,
    "hasDebugInterrupt": true,
    "hasStop": true
  },
  "body": "...",
  "panels": {
    "breakpointItems": [],
    "debugMarks": []
  }
}
```

调试结束后必须停止调试，并保存停止后的快照，确认 `.wos-editor-debug-start` 恢复。

## 什么算调试通过

后端元语言函数调试通过必须有“执行证据”和“业务结果证据”，不能只看编辑、编译或提交动作：

- `编译成功` 只证明语法能编译，不证明函数执行到目标语句。
- `Update ret=0` 只证明平台接受了写入请求；必须重载或重新打开函数，回读完整函数头尾，确认目标调用语句没有被截断。
- `提交成功` 只证明模型版本提交，不证明运行包、时空对象或蓝色客户端已经更新。
- 断点调试通过的最低标准：断点列表出现目标函数行，启动后变量区出现目标变量，堆栈/断点区有目标函数帧，单步后能读到 `resultText` 或目标返回变量。
- 后端 Query/CRUD 通过的最低标准：返回协议中能看到业务 `ret/queryRet`，且成功场景必须为 `0`；如果用户要求“拿到数据”，还必须看到实际记录值、记录数或明确的空结果原因。
- 前端或运行态 `Call` 通过的最低标准：`Call` 返回 `ret=0`，并且 `returndata` 或统一 JSON 中包含目标函数的 `ok/code/message/data/traceId`。`ret=-210133`、`CALL_FAIL`、只有 `consumeTime`、没有 `returndata` 都不能算通过。
- 如果是在 `onCreate` 里做单点调试，必须看到 `resultText = TargetFunc(strmapPara)` 执行后的 `resultText` 值；只看到参数 Trace 或变量区空白不能算通过。

证据文件必须写明结论字段，例如 `passed:false`、`reason:"breakpoint_not_hit"`，避免后续 agent 把失败证据误读成通过证据。

## 常见失败

- 只看到 `编译成功`，但变量区仍是 `暂无数据`：没有断点命中，不能算调试通过。
- 启动后长时间显示 `启动中`：继续轮询；如果断点命中，变量区和 `.debug-interrupt-*` 会出现。
- 点击断点后左侧断点区没出现行号：点击位置不在 `.glyph-margin`，按行号文本重新定位。
- `line-numbers` 返回顺序是 `10,11,12,7,8,9,4,5,6,1,2,3` 这类乱序：必须按 `txt` 精确找目标行，不能按数组下标。
- 中文出现在 browser-harness ASCII 临时脚本里会变成 `????`：脚本里避免中文正则，或使用 Unicode 转义/UTF-8 文件读取。
- browser-harness ASCII 临时脚本里不要直接写 `提交`、`确认`、`版本提交` 这类中文比较值。用 Unicode 转义，例如 `\u63d0\u4ea4`、`\u786e\u8ba4`、`\u7248\u672c\u63d0\u4ea4`，否则会出现“读到按钮文本正确，但匹配目标失败”的假象。
- Monaco 多行编辑不要优先用 `Input.insertText`。当前平台实测会把长脚本截断、插入到错误光标位置或残留查找框文本。需要批量替换函数脚本时，优先抓保存请求并复用 `/api/v1/Update`；若只能走 UI，必须截图确认完整函数头尾和编译结果。
- `/api/v1/Update` 返回 `ret=0` 后仍可能发生脚本文本截断，尤其是函数尾部语句缺失。更新后必须重新加载 worker 或重新打开函数，并比对 `textarea`/代码区中的完整脚本；未回读确认前不得调试或提交。
- 几何估算点击 Monaco gutter 不一定能设置断点。必须在左侧断点列表或 `.breakpoint-item-line` 中看到目标函数行；没有断点项时，启动调试只会得到编译成功或空变量区。
- 运行态 `Call` 参数必须照真实页面脚本包装。`stringMap<var>` 入参从前端传递时通常是 `params:[new Variant(new StringMap(...))]`，少包 `Variant` 会返回非业务结果，不能据此判断后端函数失败。

## 前后端参数类型对齐

调试前端 `Call` 到元语言自定义计算时，先核对后端函数签名。典型函数：

```text
QueryAssessmentRecords(stringMap<var> strmapPara) -> string
```

调用方必须传入与签名匹配的映射参数，不能把空数组当作参数体：

```javascript
// 错误：后端需要 stringMap<var>，这里传了数组
params: []

// 正确：传一个对象/映射，字段名和后端 strmapPara.containsKey(...) 对齐
params: [new StringMap({
  spaceTimeGuid: currentSpaceTimeGuid,
  pageNo: 1,
  pageSize: 20,
  startTime: "2020-01-01 00:00:00",
  endTime: "2020-01-31 00:00:00"
})]
```

如果平台报“参数不符合/参数类型不符合”，优先检查：

1. 后端函数入参类型，例如 `stringMap<var>`、`string`、`int32`。
2. 前端 `params` 的层级和元素类型，尤其不要用 `[]` 代替 `stringMap<var>`。
3. 字段名是否和后端 `strmapPara.containsKey("...")` 一致。
4. 调后台前是否已执行 `SetRunInfo({stType:4, spaceTime, devName})` 切到目标时空和后端运行对象。

后端单点调试时，优先在 `onCreate` 里构造同形态 `strmapPara`，再调用目标函数并 `Trace` 返回值。这样可以先排除前端按钮、页面变量和运行态包装问题。

## Palimpsest 真实 Query 调试记录

2026-06-27 在 `PalimpsestBackend_CUSTOMFUNC_CUSTOMFUNC -> QueryAssessmentRecords` 验证：

- 后端函数元数据是 `QueryAssessmentRecords(stringMap<var> strmapPara) -> string`。
- 手册枚举在当前元语言编译环境里不一定已声明。`Enum_His_Type::THING_RECORD`、`Enum_HisPlan_Mode::OBJECTS_SINGLEST`、`Enum_IdentifierType::NAME`、`Enum_HisPlan_Mode::RECORDS_BY_CONDITION`、`Enum_HisPlan_MainMode::RECORDS_ALL` 编译失败时，改用数值常量：

```text
4106 = 计划库业务事记录
3106 = 历史库业务事记录
17   = 指定单个时空对象查询
2    = 按名称标识
61   = 按对象条件和记录条件查询记录
53   = 查询记录
```

- 本次真实查询脚本使用 `Query(param,input,output)` 查询 `pal_assessment_record`，统一把 `queryResult.ret` 和 `output` 写入返回 JSON，错误时也返回给前端而不是吞掉。
- 已提交版本说明：`pal-20260627-real-query-api`。
- 提交后点击 `.wos-editor-debug-start`，证据显示 `编译成功 13:35:55`、无 `FATAL`，`.wos-editor-debug-stop` 出现。
- 该结果只能证明“模型层真实 Query 代码已提交并可启动编译调试”。没有断点变量或运行对象重新部署前，不能宣称前端已调用到这版真实 Query，也不能宣称 Create/Update/Delete 真实持久化已完成。

## Palimpsest 真实 CRUD 调试记录

2026-06-27 在 `PalimpsestBackend_CUSTOMFUNC_CUSTOMFUNC` 继续验证：

- 函数范围：`CreateAssessmentRecord / UpdateAssessmentRecord / DeleteAssessmentRecord / SubmitAssessmentScore`。
- 业务事记录 API 采用手册中的历史/计划库函数：`Create / Update / Delete`。关键常量要按对象形态选择：
  - `3106 = 历史库业务事记录`
  - `4106 = 计划库业务事记录`
  - `51 = 按时空对象和 recordID 操作记录`
  - `2 = 按名称标识对象`
- Palimpsest 的 `pal_assessment_record / pal_assessment_score_detail / pal_operation_log` 位于 `历史 -> 业务事`，所以真实 CRUD 应使用 `param.type=3106`。如果误用 `4106`，运行态可能返回 `-30038 = 对象不存在`。
- `recordID` 只适用于业务事/时序事记录。Update/Delete/Submit 没有 `recordID` 时必须返回结构化 `VALIDATION_FAILED`，不能假成功。
- 本轮先通过 `/api/v1/Update` 更新函数脚本，再点击 `.wos-editor-debug-start` 验证编译。第一次失败不是 CRUD API 形态问题，而是 JSON 字符串转义在注入过程中丢失，编译器看到 `resultText="{"ok"...` 后报语法错误。
- 修复方式：所有函数改为用 `stringMap<var> returnData` 组织返回值，最后 `return ConvertToJsonString(returnData,true);`，不要在大段脚本里手写大量 `\"`。
- 修复后调试启动显示 `编译成功 14:02:09`、无 `FATAL`，随后提交版本说明 `pal-20260627-real-crud-api`，worker 文本捕获 `提交成功`。
- 该结果只能证明“模型层真实 CRUD 函数已提交并可编译启动”。没有运行包更新、部署/启动和蓝色客户端复测前，不能宣称前端已经调用到这版真实 CRUD，也不能宣称数据库记录已实际增删改。

## Palimpsest 运行态缺表导致真实 Query 失败

2026-06-27 在 `QueryAssessmentRecords` 中继续断点验证真实 `Query(param,input,output)`：

- 断点命中并读取变量区，说明本次已经进入后端函数，不再是前端参数数量/类型不匹配问题。
- `resultText` 返回统一错误协议：`ok=false / code=QUERY_FAILED / message=real query failed / traceId=pal-20260627-real-query`。
- `data.table=pal_assessment_record`，`queryRet={"MLVariant":-210134}`，`output={"map":{}}`。
- 同轮在 `时空对象管理平台 -> PalimpsestL1_0626R2 -> 计划 -> 业务事` 只看到 5 张业务事，缺少 `pal_assessment_record / pal_assessment_score_detail / pal_operation_log`。

判定规则：如果目标业务事不在 `时空对象管理平台` 的运行态列表中，后端断点里对该业务事执行 Query/Create/Update/Delete 失败应优先按“运行对象未上线/未部署到当前时空”处理。不要把它误判成前端按钮、`Call` 参数或元语言语法问题。先补齐实例化/部署，再做 Create->Query->Update/Delete 闭环。

## Palimpsest 真实 Create -> Query 跑通记录

2026-06-28 在 `PalimpsestL1_0626R2 / PalimpsestBack_0626R2` 验证 `pal_assessment_record` 真实插入和查询：

- 运行时空 GUID：`aba6cf7a-0715-4966-8eaf-0f448eba7bc9`。
- 目标对象：`pal_assessment_record`，位于 `历史 -> 业务事`，必须使用 `param.type=3106`。
- 从建模 `worker-space` 直调运行库 API 时，不在 App 后端上下文内，必须在 `input` 补 `appspacetimeguid`；否则 `Create` 返回 `-30018 必填参数缺失`。
- `dataValues` 必须按 `var[][]` 的 protobuf 形态包装，每个单元格是 `{stringValue/int64Value/uint64Value/doubleValue/dateTimeValue/boolValue}`。如果传 JS 原始二维数组，`Create` 会进入目标时空但返回 `-31539 添加时名称和值数量不对`。
- `pal_assessment_record` 当前实际业务字段有 14 个：`id / student_id / batch_id / mentor_id / professional_score / attitude_score / task_score / teamwork_score / innovation_score / total_score / status / comment / updated_at / deleted`。
- 业务事记录插入还需要记录系统字段：`$startTime / $endTime / $parentGUID / $parentRecordID`。
- 成功 Create 返回：

```text
ret=0
errorcodes=[0]
ids=["216172782113783809"]
business id=PAL_DIRECT6_20260627175612
```

- 成功 Query 使用 `mode=51`、`objectIdentifierType=2`、`objectRecords=[{objectName:"pal_assessment_record",recordIDs:["216172782113783809"]}]`，返回 `ret=0`，并查回 `PAL_DIRECT6_20260627175612`、分数字段、`updated_at` 和 `deleted=false`。

结论：此前插入失败是调用方法和参数形态问题，不是表未上线。正确链路是运行态业务事记录 `Create/Query`，不是修改模型属性；外部直调还必须显式传 `appspacetimeguid`。

2026-06-28 追加纠偏：

- 用户判断“插入不成可能是方法不对”成立。`workerWindow.Call("Create", {param,input}, opts)` 这条直调封装会返回 `-31520 = 添加记录时缺少必要的属性`，不能作为 Palimpsest 业务事插入的标准验证方法。
- 已验证的 worker-space 直调方式是导入编辑器模块后使用 `Ke("Create", req)`，其中 `Ke = mod.aV`，并手工构造 `fieldValues[0].keyValueList`。
- `dataValues` 不能依赖通用 helper 自动推断；必须显式写成 `valueArray2DValue.arrays[0].values`，每个单元格带类型键，例如 `{int64Value:"..."}`、`{uint64Value:"0"}`、`{stringValue:"..."}`、`{doubleValue:38}`、`{dateTimeValue:{...}}`、`{boolValue:false}`。
- 新验证结果：`Create ret=0 / ids=["216172782113783810"] / id=PAL_DIRECT6_20260627210127`，随后 `Query mode=51` 按 `recordID=216172782113783810` 返回 `ret=0` 并查回该业务 id。

## Palimpsest 剩余 CRUD 调通记录

2026-06-28 继续验证 `pal_assessment_record` 的剩余历史业务事函数：

- 历史业务事和计划业务事的记录类型不同，不能混用：
  - `3106 = 历史库业务事记录`
  - `4106 = 计划库业务事记录`
- 对 `pal_assessment_record`，`UpdateAssessmentRecord / SubmitAssessmentScore / DeleteAssessmentRecord` 均应使用 `3106`。
- 直接运行库 API 闭环结果：
  - 新建 A：`id=PAL_REMAIN_A_20260628005847 / recordID=216172782113783811`，`ret=0`。
  - 更新 A：`Update ret=0`，查询回读 `total_score=88.5 / status=updated_by_update_function`。
  - 评分 A：`SubmitAssessmentScore` 本质是按 `recordID` 更新评分字段，`ret=0`，查询回读 `total_score=98 / status=completed_by_submit`。
  - 新建 B：`id=PAL_REMAIN_B_20260628005847 / recordID=216172782113783812`，`ret=0`。
  - 删除 B：`Delete ret=0`，随后查询返回 `-31537 = 记录ID不存在`，符合硬删除预期。
- 编辑态函数体复核：
  - `UpdateAssessmentRecord`、`SubmitAssessmentScore` 含 `3106 / appspacetimeguid / mode=51 / objectRecordFieldValues`。
  - `DeleteAssessmentRecord` 含 `3106 / appspacetimeguid / mode=51 / objectRecords / deleteMode=1`。
  - 三个函数均不再含 `4106`。
- 隐藏 worker 中顶栏 `提交` 弹出 `版本提交` 较慢，不能只等 20 秒。观察窗口内应继续轮询隐藏 worker 的 `el-dialog`；本次提交说明 `pal-20260628-real-remaining-crud-api`，最终 worker 文本捕获 `提交成功`。
- 证据：
  - `wos4-artifacts/snapshots/palimpsest_remaining_crud_direct_verify_20260628.json`
  - `wos4-artifacts/snapshots/palimpsest_remaining_functions_after_update_20260628.json`
  - `wos4-artifacts/snapshots/pal_remaining_funcs_submit_confirm_20260628.json`
