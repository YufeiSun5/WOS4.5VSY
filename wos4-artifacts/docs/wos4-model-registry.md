# WOS4 模型和字段台账

本文件记录 WOS4 建模态元数据：模型、页面精灵图、业务事/业务物、字段结构和模型版本。它不保存全量业务数据。

状态值：`verified`、`historical`、`stale`、`retired`、`blocked`、`unknown`。

## 记录原则

- 字段结构挂在定义它的模型或业务事下面。
- 运行对象只链接到当前使用的模型、拷贝和版本，不在这里重复运行状态。
- `模型 ID` 不是当前主键；只有历史证据明确出现时才记录。
- 动态 URL 和 `GetFileContent` 只作为证据，不作为入口或主键。

## Palimpsest

### 盛云科技_孙宇飞_Palimpsest_后台_0623

- 状态：historical
- 类型：后端模型
- 所属工程：盛云_孙宇飞_Palimpsest工程_0626
- 建模路径：建模系统客户端，历史记录确认该模型同时承载业务事和自定义计算
- 模型 GUID：待复核
- 模型 ID：未记录为关键依据
- 当前已知模型版本：v3 及后续版本有提交记录；最新版本需 live 核实
- 关联运行实例：`PalimpsestBack_0626R2`
- 关联自定义计算：`PalimpsestBackend_CUSTOMFUNC_CUSTOMFUNC`
- 最近证据：
  - `WOS4_deep_test_notes.md`：2026-06-26 至 2026-06-28 Palimpsest 后端建模、实例化、运行态 CRUD 记录
  - `wos4-artifacts/snapshots/pal_0626_backend_model_structure_inspection_20260626.json`
- 待复核：
  - 源模型 GUID
  - 当前最新提交版本
  - 当前业务事字段结构是否与下表一致

### Palimpsest 业务事清单

| 业务事 | 形态 | 状态 | 运行对象 ID | 运行对象 GUID | 字段结构状态 | 来源 |
| --- | --- | --- | --- | --- | --- | --- |
| `pal_menu_node` | 计划 | historical/live-count | `1729382256910290479` | `e953278d-ceab-475d-99a6-e45428d8fae9` | 待复核 | 历史证据；2026-06-29 计划业务事 live 查询总数为 5 |
| `pal_department` | 计划 | verified | `1729382256910290476` | `43897b4c-41b3-4309-a47f-5b5d04c43ec9` | 待复核 | `wos4-artifacts/snapshots/object-registry-xiang-pal-business-events-20260629.json` |
| `pal_mentor` | 计划 | historical/live-count | `1729382256910290478` | `e5f53ccc-c021-4e40-9ed5-5c58a7a11e97` | 待复核 | 历史证据；2026-06-29 计划业务事 live 查询总数为 5 |
| `pal_intern_student` | 计划 | verified | `1729382256910290477` | `66430640-2f98-49d6-8a4f-f045c2b2bc4a` | 待复核 | `wos4-artifacts/snapshots/object-registry-xiang-pal-business-events-20260629.json` |
| `pal_assessment_batch` | 计划 | verified | `1729382256910290475` | `89b0424b-2227-41c4-8340-fcbc6aa75a39` | 待复核 | `wos4-artifacts/snapshots/object-registry-xiang-pal-business-events-20260629.json` |
| `pal_assessment_record` | 历史 | verified | `1729382256910270465` | `9981dbc2-e49e-496c-b509-7abdf0891be8` | 部分字段从运行验证反推，需建模态核实 | `wos4-artifacts/snapshots/object-registry-xiang-pal-business-events-20260629.json` |
| `pal_assessment_score_detail` | 历史 | verified | `1729382256910270466` | `01425c7f-f3a7-406b-9404-9444375cce9c` | 待复核 | 同上 |
| `pal_operation_log` | 历史 | verified | `1729382256910270467` | `da998b80-48a8-4bde-a497-5721169d9636` | 待复核 | 同上 |

### pal_assessment_record

- 状态：historical
- 类型：历史业务事
- 所属模型：`盛云科技_孙宇飞_Palimpsest_后台_0623`
- 运行对象：`pal_assessment_record`
- 形态：历史
- 记录类型常量：`3106`
- 系统字段和业务字段来源：
  - `WOS4_deep_test_notes.md` 记录真实 Create/Query 成功时 `dataFields` 包含 `$startTime/$endTime/$parentGUID/$parentRecordID` 加 14 个业务字段。
  - 字段类型/描述仍需回到建模系统核实。

| 字段 | 类型 | 描述 | 系统字段 | 来源 | 状态 |
| --- | --- | --- | --- | --- | --- |
| `$startTime` | datetime | 历史记录开始时间 | 是 | 运行 API 成功记录 | historical |
| `$endTime` | datetime | 历史记录结束时间 | 是 | 运行 API 成功记录 | historical |
| `$parentGUID` | guid/string | 父对象 GUID | 是 | 运行 API 成功记录 | historical |
| `$parentRecordID` | uint64/string | 父记录 ID | 是 | 运行 API 成功记录 | historical |
| `id` | string | 业务记录编号 | 否 | 运行 API 成功记录 | historical |
| `student_id` | string | 学生 ID | 否 | 运行 API 成功记录 | historical |
| `batch_id` | string | 批次 ID | 否 | 运行 API 成功记录 | historical |
| `mentor_id` | string | 导师 ID | 否 | 运行 API 成功记录 | historical |
| `professional_score` | number | 专业得分 | 否 | 运行 API 成功记录 | historical |
| `attitude_score` | number | 态度得分 | 否 | 运行 API 成功记录 | historical |
| `task_score` | number | 任务得分 | 否 | 运行 API 成功记录 | historical |
| `teamwork_score` | number | 协作得分 | 否 | 运行 API 成功记录 | historical |
| `innovation_score` | number | 创新得分 | 否 | 运行 API 成功记录 | historical |
| `total_score` | number | 总分 | 否 | 运行 API 成功记录 | historical |
| `status` | string | 状态 | 否 | 运行 API 成功记录 | historical |
| `comment` | string | 评语 | 否 | 运行 API 成功记录 | historical |
| `updated_at` | datetime/string | 更新时间 | 否 | 运行 API 成功记录 | historical |
| `deleted` | boolean/string | 删除标记 | 否 | 运行 API 成功记录 | historical |

### PalimpsestBackend_CUSTOMFUNC_CUSTOMFUNC

- 状态：historical
- 类型：功能单元模型 / 自定义计算
- 所属模型：`盛云科技_孙宇飞_Palimpsest_后台_0623`
- 母模型 GUID：`aa5d8314-87b7-453c-96e6-21e4327a8778`
- 母模型版本：`6` 曾被运行拷贝记录；最新需 live 核实
- 已记录函数：
  - `declare`
  - `onCreate`
  - `onDestroy`
  - `onException`
  - `QueryAssessmentPage`
  - `QueryAssessmentData`
  - `QueryAssessmentSmoke`
  - `PalimpsestCrudService`
  - `QueryAssessmentRecords`
  - `CreateAssessmentRecord`
  - `UpdateAssessmentRecord`
  - `DeleteAssessmentRecord`
  - `SubmitAssessmentScore`
  - `PalimpsestHandleError`
- 最近证据：`WOS4_deep_test_notes.md` 2026-06-26 运行包属性和 worker-space 函数列表记录
- 待复核：源模型最新函数列表和已提交版本内容

### Palimpsest 前端页面和客户端模板

| 名称 | 类型 | 状态 | 模型 GUID / copy GUID | 当前已知版本 | 来源 |
| --- | --- | --- | --- | --- | --- |
| `PalimpsestMenu_18` | 页面精灵图 | historical/stale-risk | 待复核 | 历史记录涉及 `_120` 运行文件 | `WOS4_deep_test_notes.md` |
| `PalimpsestContent_82` | 页面精灵图 | historical/stale-risk | 待复核 | 历史记录涉及 `_120` 运行文件和新预览 | `WOS4_deep_test_notes.md` |
| `PalimpsestExcel_82` | 页面精灵图 | verified | 页面运行文件 `94054fd1-9b20-463a-8372-b69776349847_120`；内嵌报表子 APP GUID `9dfa57d3-78a6-41ff-955e-4ea96e9da40e` | 页面模型版本 `120`；报表子 APP 版本 `0` | `wos4-artifacts/snapshots/palimpsest_excel82_direct_api_verify_20260629T2355.json` |
| `报表流程图1KINGke08403a89a1bb0d08ec52330fd93824` | 报表流程图子 APP | verified | ID `1441151880758560518`，GUID `9dfa57d3-78a6-41ff-955e-4ea96e9da40e`，仓库 GUID `4e82b3be-0d05-401e-b36c-950531391a5d` | `0` | `wos4-artifacts/snapshots/palimpsest_excel82_methods_probe_20260629T2320.json` |
| `盛云_孙宇飞_Palimpsest客户端_0626R2` | WebJS 客户端模板 | historical/stale | copy GUID `5f2c8c4b-5ed5-4d0a-9444-a7ffaf0f67a2`，模型 GUID `f5f8c456-e145-4d85-b1c3-dc3a17e7b512` | 模型版本 `118` 曾被确认仍未上升 | `WOS4_deep_test_notes.md`、`wos4-blue-client-object-create` |

## Nadir / CRUD Demo

### 盛云_孙宇飞_后台_CRUDDemo_0620

- 状态：historical
- 类型：后端模型
- 所属工程：`盛云_孙宇飞_CRUD工程_0620`
- 运行实例：`NadirBack`
- 当前已知模型版本：历史记录中组态层曾显示 v2/v4，运行态更新到 v3 后 `DemoCrudBackend_CUSTOMFUNC@NadirBack` 可调用
- 运行态模型 GUID：
  - 旧运行对象 `盛云_孙宇飞_后台_CRUDDemo_0620@NadirBack` 记录 `$modelguid = 5702ad4a-a934-43a9-9e14-f2ca545abb53`
  - 后续更新对象 `DemoCrudBackend_CUSTOMFUNC@NadirBack` 记录 `$modelguid = 478c5219-9a87-4038-94cb-574514ae6d82`
- 待复核：当前最终模型 GUID、最新模型版本、函数列表

### 盛云_孙宇飞_前端_CRUDDemo_0620

- 状态：historical
- 类型：前端业务模型
- 所属工程：`盛云_孙宇飞_CRUD工程_0620`
- 运行实例：`NadirFront`
- 页面：`查询列表`
- 正式预览 clientGuid：`d01d4d20-79d3-4b0d-9d89-77856713e525`
- 待复核：当前蓝端/正式运行入口是否仍使用该 clientGuid
