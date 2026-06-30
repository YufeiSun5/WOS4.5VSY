# WOS4 方法和调用台账

本文件记录可调用方法、入参签名、调用上下文、目标对象和验证结果。方法必须关联到模型或运行对象，不单独漂浮记录。

状态值：`verified`、`historical`、`stale`、`retired`、`blocked`、`unknown`。

## 通用调用规则

- 前端 `Call` 后端时不能只填函数名；至少要有目标 App 对象标识、`funcname` 和 `params`。
- 编辑器预览壳不等于正式客户端运行壳；需要正式时空上下文时，必须确认 `page.spaceTimeId` 或用已验证的 `SetRunInfo`。
- 历史业务事记录使用 `3106`，计划业务事记录使用 `4106`。`pal_assessment_record` 属于 `历史 -> 业务事`，所以 CRUD 必须用 `3106`。
- `stringMap<var>` 参数必须包装为 `params: [new Variant(new StringMap(...))]`。
- `recordID` 必须从真实行数据读取；不要用整段返回文本的第一个 ID 代替每行 ID。

## PalimpsestBackend_CUSTOMFUNC_CUSTOMFUNC@PalimpsestBack_0626R2

### QueryAssessmentRecords

- 状态：historical
- 所属运行对象：`PalimpsestBackend_CUSTOMFUNC_CUSTOMFUNC@PalimpsestBack_0626R2`
- 所属模型/拷贝：`PalimpsestBackend_CUSTOMFUNC_CUSTOMFUNC`
- 方法类型：自定义计算
- 入参签名：`stringMap<var> strmapPara`
- 出参结构：JSON 字符串，统一包含 `ok/code/message/traceId/data`
- 调用上下文：
  - `SetRunInfo({ stType:4, spaceTime:"aba6cf7a-0715-4966-8eaf-0f448eba7bc9", devName:"PalimpsestBack_0626R2" })`
  - `Call(..., { identifierType:2, name:"PalimpsestBackend_CUSTOMFUNC_CUSTOMFUNC@PalimpsestBack_0626R2", funcname:"QueryAssessmentRecords", params:[new Variant(new StringMap(...))] })`
- 目标对象：`pal_assessment_record`
- 关键常量：历史业务事记录 `3106`；按记录条件查询模式 `51`
- 最近验证：
  - 前端预览 smoke 曾返回 `ret=0`。
  - 真实 Create -> Query 路径已证明 `pal_assessment_record` 在线且可查询。
  - `PalimpsestContent_82` 新预览点击 `查询真实数据` 返回 `ret=0` 且 3 条记录。
- 证据：
  - `wos4-artifacts/snapshots/palimpsest_direct_create_query_success_20260628.json`
  - `wos4-artifacts/snapshots/content82-real-query-preview-20260628.json`
  - `wos4-artifacts/snapshots/pal_content82_action_buttons_edit_verify_20260629.json`
- 待复核：向学智账号下重新确认运行对象和方法仍可见/可调用

### CreateAssessmentRecord

- 状态：historical
- 所属运行对象：`PalimpsestBackend_CUSTOMFUNC_CUSTOMFUNC@PalimpsestBack_0626R2`
- 方法类型：自定义计算
- 入参签名：`stringMap<var> strmapPara`
- 出参结构：JSON 字符串
- 调用上下文：同 `QueryAssessmentRecords`
- 目标对象：`pal_assessment_record`
- 关键常量：
  - `param.type=3106`
  - `input.appspacetimeguid=aba6cf7a-0715-4966-8eaf-0f448eba7bc9` 用于 out-of-App 直调
  - typed `var[][]` 单元格包装
- 最近验证：
  - 直接运行库 Create 成功，返回 `recordID=216172782113783809` 和后续记录。
  - 早期 `4106` 误用导致 `-30038 = 对象不存在`，已纠正为历史业务事 `3106`。
- 证据：
  - `wos4-artifacts/snapshots/palimpsest_direct_create_query_success_20260628.json`
  - `wos4-artifacts/snapshots/palimpsest_direct_create_query_method_correction_20260628.json`
- 待复核：当前模型提交版本中函数体是否仍为真实 Create 实现

### UpdateAssessmentRecord

- 状态：historical
- 所属运行对象：`PalimpsestBackend_CUSTOMFUNC_CUSTOMFUNC@PalimpsestBack_0626R2`
- 方法类型：自定义计算
- 入参签名：`stringMap<var> strmapPara`
- 目标对象：`pal_assessment_record`
- 关键常量：
  - `3106`
  - `mode=51`
  - `appspacetimeguid`
  - `objectRecordFieldValues`
- 最近验证：
  - 直接运行库 Update 返回 `ret=0`，查询回读 `status=updated_by_update_function`。
  - `PalimpsestContent_82` 前端编辑第一条记录后，后端返回 `ret=0`，刷新后 `status=front_edit_verified_20260629`。
- 证据：
  - `wos4-artifacts/snapshots/palimpsest_remaining_crud_direct_verify_20260628.json`
  - `wos4-artifacts/snapshots/pal_content82_action_buttons_edit_verify_20260629.json`
- 待复核：正式蓝端中操作列是否加载最新脚本

### SubmitAssessmentScore

- 状态：historical
- 所属运行对象：`PalimpsestBackend_CUSTOMFUNC_CUSTOMFUNC@PalimpsestBack_0626R2`
- 方法类型：自定义计算
- 入参签名：`stringMap<var> strmapPara`
- 目标对象：`pal_assessment_record`
- 关键常量：`3106`、`mode=51`、`appspacetimeguid`、`objectRecordFieldValues`
- 最近验证：直接运行库 SubmitScore 返回 `ret=0`，查询回读 `total_score=98 / status=completed_by_submit`
- 证据：`wos4-artifacts/snapshots/palimpsest_remaining_crud_direct_verify_20260628.json`
- 待复核：前端评分弹窗是否已接入该方法

### DeleteAssessmentRecord

- 状态：historical
- 所属运行对象：`PalimpsestBackend_CUSTOMFUNC_CUSTOMFUNC@PalimpsestBack_0626R2`
- 方法类型：自定义计算
- 入参签名：`stringMap<var> strmapPara`
- 目标对象：`pal_assessment_record`
- 关键常量：`3106`、`mode=51`、`appspacetimeguid`、`objectRecords`、`deleteMode=1`
- 最近验证：直接运行库 Delete 返回 `ret=0`，再查返回 `-31537 = 记录ID不存在`，符合硬删除预期
- 证据：`wos4-artifacts/snapshots/palimpsest_remaining_crud_direct_verify_20260628.json`
- 待复核：前端更多菜单删除动作是否已验收

## Nadir / CRUD Demo

### QueryRecords

- 状态：historical
- 所属运行对象：`DemoCrudBackend_CUSTOMFUNC@NadirBack`
- 所属时空：`NadirL2`
- 方法类型：自定义计算
- 入参签名：历史记录为 `params: [new Variant(inParams)]`
- 出参结构：历史记录中 `ret=0`、`returnData.errorcode=0`
- 调用上下文：
  - 运行时空：`NadirL2`
  - 后端实例：`NadirBack`
  - 前端页：`查询列表`
- 目标对象：CRUD Demo 后端数据，具体业务事需复核
- 最近验证：历史记录显示 `Call(DemoCrudBackend_CUSTOMFUNC@NadirBack.QueryRecords) -> ret=0`
- 证据：`WOS4_deep_test_notes.md` 2026-06-20/22 Nadir 联调记录
- 待复核：
  - 当前有效 App 对象是 `DemoCrudBackend_CUSTOMFUNC@NadirBack` 还是旧 `盛云_孙宇飞_后台_CRUDDemo_0620@NadirBack`
  - 当前正式前端入口是否仍为 `clientGuid=d01d4d20-79d3-4b0d-9d89-77856713e525`

