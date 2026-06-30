# WOS4 运行对象台账

本文件记录已实例化、已部署或运行态可见的 WOS4 对象。权威来源优先级：`时空对象管理平台`、`组态系统客户端`、`运维部署客户端`、历史快照。

状态值：`verified`、`historical`、`stale`、`retired`、`blocked`、`unknown`。

## Palimpsest

### PalimpsestL1_0626R2

- 状态：verified
- 类型：运行时空
- 权威来源：时空对象管理平台 live 核实；历史记录来自组态系统、运维部署客户端
- 所属工程：`盛云_孙宇飞_Palimpsest工程_0626`
- 路径：`KF4.5工程/盛云_孙宇飞_Palimpsest工程_0626/KF4.5Root/PalimpsestL1_0626R2`
- ID：待复核
- GUID：`aba6cf7a-0715-4966-8eaf-0f448eba7bc9`
- 当前版本/运行状态：历史记录显示运维部署更新到版本 `3` 且保持 `已部署 / 已启动`
- 关联实例：`PalimpsestBack_0626R2`
- 最近证据：
  - `wos4-artifacts/snapshots/pal_0626r2_object_mgmt_business_events_20260629.json`：2026-06-29 孙宇飞账号核实 `计划 -> 业务事` 5 条、`历史 -> 业务事` 3 条
  - `wos4-artifacts/screenshots/pal_0626r2_object_mgmt_business_events_20260629.png`
  - `wos4-artifacts/snapshots/object-registry-xiang-pal-business-events-20260629.json`：2026-06-29 向学智账号核实时左树选中 `PalimpsestL1_0626R2`
  - `wos4-artifacts/screenshots/object-registry-xiang-pal-business-events-20260629.png`
  - `WOS4_deep_test_notes.md`：2026-06-27/2026-06-28 标准链路刷新记录
  - `wos4-artifacts/snapshots/palimpsest_runtime_crud_after_v3_summary_20260627.json`
- 当前运维状态：2026-06-29 孙宇飞账号在运维部署客户端确认 `版本 8 / 本云 / area0 / 已部署 / 已启动`

### PalimpsestBack_0626R2

- 状态：verified/partial
- 类型：后端实例
- 权威来源：时空对象管理平台业务事显示名 live 核实；实例 ID/GUID 仍来自历史记录
- 所属工程：`盛云_孙宇飞_Palimpsest工程_0626`
- 所属时空：`PalimpsestL1_0626R2`
- 路径：`KF4.5工程/盛云_孙宇飞_Palimpsest工程_0626/KF4.5Root/PalimpsestL1_0626R2/PalimpsestBack_0626R2`
- ID：`288230376151751586`
- GUID：`92d89140-0736-41f2-873b-6bfab8f3d276`
- 当前版本/运行状态：2026-06-29 批量提交进度 `100% / 提交成功`，运维部署侧所属时空为 `版本 8 / 已部署 / 已启动`
- 关联模型：`盛云科技_孙宇飞_Palimpsest_后台_0623`
- 关联方法：见 `wos4-method-registry.md`
- 最近证据：
  - `wos4-artifacts/snapshots/pal_0626r2_object_mgmt_business_events_20260629.json`：业务事显示名均为 `PalimpsestBack_0626R2@<业务事>`
  - `wos4-artifacts/snapshots/object-registry-xiang-pal-business-events-20260629.json`：业务事显示名均为 `PalimpsestBack_0626R2@<业务事>`
  - `.ai/skills/wos4-instantiated-spacetime-refind/SKILL.md` Palimpsest 示例
  - `WOS4_deep_test_notes.md` 2026-06-26/27/28 记录
- 待复核：当前部署包是否已消费最新前端页面/蓝端模板；后端业务事对象已在对象管理平台上线

### PalimpsestBackend_CUSTOMFUNC_CUSTOMFUNC@PalimpsestBack_0626R2

- 状态：historical
- 类型：自定义计算运行拷贝
- 权威来源：历史记录来自时空功能开发辅助树和运行态调用
- 所属工程：`盛云_孙宇飞_Palimpsest工程_0626`
- 所属时空：`PalimpsestL1_0626R2`
- 所属后端实例：`PalimpsestBack_0626R2`
- ID：`7205759403792797099`
- GUID：`9d464a7f-232b-4a27-9bf5-e7fe479f4f3f`
- 母模型 GUID：`aa5d8314-87b7-453c-96e6-21e4327a8778`
- 母模型版本：`6`
- 当前版本/运行状态：历史记录显示可被 `SetRunInfo + Call` 调用
- 关联模型：`PalimpsestBackend_CUSTOMFUNC_CUSTOMFUNC`
- 关联方法：`QueryAssessmentRecords`、`CreateAssessmentRecord`、`UpdateAssessmentRecord`、`DeleteAssessmentRecord`、`SubmitAssessmentScore`
- 最近证据：
  - `.ai/skills/wos4-instantiated-spacetime-refind/SKILL.md`
  - `wos4-artifacts/snapshots/palimpsest_direct_create_query_success_20260628.json`
  - `wos4-artifacts/snapshots/palimpsest_remaining_crud_direct_verify_20260628.json`
- 待复核：当前运行拷贝 GUID 是否仍相同；最新模型版本是否已重新生成/更新

### Palimpsest 运行态业务事对象

| 对象 | 类型 | 形态 | 状态 | ID | GUID | 模型拷贝 GUID | 模型版本 | 所属时空 | 证据 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `pal_assessment_batch` | 业务事对象 | 计划 | verified | `1729382256910290475` | `89b0424b-2227-41c4-8340-fcbc6aa75a39` | `7b34d6ee-99ec-4fc3-8d0b-5ffda0c16094` | `7` | `PalimpsestL1_0626R2` | `object-registry-xiang-pal-business-events-20260629.json` |
| `pal_department` | 业务事对象 | 计划 | verified | `1729382256910290476` | `43897b4c-41b3-4309-a47f-5b5d04c43ec9` | `72ba12a2-d857-4c1a-90ca-31da4b14d82b` | `7` | `PalimpsestL1_0626R2` | 同上 |
| `pal_intern_student` | 业务事对象 | 计划 | verified | `1729382256910290477` | `66430640-2f98-49d6-8a4f-f045c2b2bc4a` | `01348eb5-a84f-4c2b-9d95-37d59dd867e5` | `7` | `PalimpsestL1_0626R2` | 同上 |
| `pal_mentor` | 业务事对象 | 计划 | verified | `1729382256910290478` | `e5f53ccc-c021-4e40-9ed5-5c58a7a11e97` | `3491c0e1-c3cf-4b70-b54b-d96bc2cf3a90` | `7` | `PalimpsestL1_0626R2` | `pal_0626r2_object_mgmt_business_events_20260629.json` |
| `pal_menu_node` | 业务事对象 | 计划 | verified | `1729382256910290479` | `e953278d-ceab-475d-99a6-e45428d8fae9` | `edbf8580-7b29-48f5-8fe4-f442d58c18eb` | `7` | `PalimpsestL1_0626R2` | 同上 |
| `pal_assessment_record` | 业务事对象 | 历史 | verified | `1729382256910270465` | `9981dbc2-e49e-496c-b509-7abdf0891be8` | `9bd9fc44-6b78-4088-9e56-0e2512ed5b9c` | `7` | `PalimpsestL1_0626R2` | `object-registry-xiang-pal-business-events-20260629.json` |
| `pal_assessment_score_detail` | 业务事对象 | 历史 | verified | `1729382256910270466` | `01425c7f-f3a7-406b-9404-9444375cce9c` | `74ac4a7d-fe50-4a37-956d-d822ea7e4838` | `7` | `PalimpsestL1_0626R2` | 同上 |
| `pal_operation_log` | 业务事对象 | 历史 | verified | `1729382256910270467` | `da998b80-48a8-4bde-a497-5721169d9636` | `85c84c17-42ee-4e3a-b9e6-c8d6727515f0` | `7` | `PalimpsestL1_0626R2` | 同上 |

补充：2026-06-29 向学智账号核实中，`计划 -> 业务事` 查询显示 `共 5 条`，虚拟表格只渲染前三条；随后孙宇飞账号 slot1 重新进入对象管理平台，选中 `PalimpsestL1_0626R2` 后确认 `计划 -> 业务事` 5 条完整渲染，补齐 `pal_mentor` 和 `pal_menu_node` 的模型拷贝 GUID；`历史 -> 业务事` 仍为 3 条。对象管理平台只用于读取已上线对象，不在此处新建内容。

### 盛云_孙宇飞_Palimpsest客户端_0626R2_正式蓝端

- 状态：historical/stale-risk
- 类型：WebJS 蓝色客户端对象
- 权威来源：历史记录来自时空对象管理平台模板选择和桌面卡片运行态
- 所属时空：`PalimpsestL1_0626R2`
- 客户端模板：`盛云_孙宇飞_Palimpsest客户端_0626R2`
- copy ID：`7205759403792797202`
- copy GUID：`5f2c8c4b-5ed5-4d0a-9444-a7ffaf0f67a2`
- 模型 GUID：`f5f8c456-e145-4d85-b1c3-dc3a17e7b512`
- 模型版本：`118`
- 运行文件：历史记录仍打开到 `f5f8c456-e145-4d85-b1c3-dc3a17e7b512_118/index.html`
- 当前状态：对象可打开，但页面/客户端包更新存在 stale 引用风险
- 最近证据：
  - `WOS4_deep_test_notes.md` 2026-06-28/29 蓝端记录
  - `wos4-artifacts/reports/blue-client-skill-audit-20260629.md`
- 待复核：向学智账号下重新确认模板版本、正式蓝端对象状态和右侧内容挂载

## Nadir / CRUD Demo

### NadirL2

- 状态：historical
- 类型：运行时空
- 权威来源：历史记录来自组态系统、运维部署客户端和运行态查询
- 所属工程：`盛云_孙宇飞_CRUD工程_0620`
- 路径：`KF4.5工程/盛云_孙宇飞_CRUD工程_0620/KF4.5Root/NadirL1/NadirL2`
- ID：`1152921504606851278`
- GUID：`4fa17a11-b923-4b36-b1e8-c39ca1bcf62c`
- 当前版本/运行状态：历史记录显示已部署/已启动，仓库包版本曾更新到 `[1,2,3]`
- 关联实例：`NadirBack`、`NadirFront`
- 正式预览 clientGuid：`d01d4d20-79d3-4b0d-9d89-77856713e525`
- 最近证据：`WOS4_deep_test_notes.md` 2026-06-20 至 2026-06-22 Nadir 记录
- 待复核：当前是否仍作为主线验证对象

### NadirBack

- 状态：historical
- 类型：后端实例
- 所属时空：`NadirL2`
- 路径：`KF4.5工程/盛云_孙宇飞_CRUD工程_0620/KF4.5Root/NadirL2/NadirBack`
- 实例 GUID：历史组态提交进度记录 `276cb189-67c5-47d1-94be-7e76f5f5af4e`
- 当前运行 App：
  - `盛云_孙宇飞_后台_CRUDDemo_0620@NadirBack`：ID `5911255985900486970`，GUID `4aeb7354-d29d-4969-834e-4310951bd719`，旧运行对象
  - `DemoCrudBackend_CUSTOMFUNC@NadirBack`：ID `5911255985900487006`，GUID `ac4dd4dc-2321-4dab-99cf-3dd5f57ed888`，后续运行对象
- 关联方法：`QueryRecords`
- 最近证据：`WOS4_deep_test_notes.md` 2026-06-20 至 2026-06-22 Nadir 记录
- 待复核：当前保留哪个 App 对象作为有效调用目标

### NadirFront

- 状态：historical
- 类型：前端实例
- 所属时空：`NadirL2`
- 实例 GUID：历史组态提交进度记录 `069aca68-d952-4a20-949f-af9784b33985`
- 页面：`查询列表`
- clientGuid：`d01d4d20-79d3-4b0d-9d89-77856713e525`
- 最近证据：`WOS4_deep_test_notes.md`
- 待复核：当前客户端入口是否仍有效
