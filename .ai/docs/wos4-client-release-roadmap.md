# WOS4 从建模到客户端发布路线

## 目标

建立一条从零开始到客户端发布的可复用流程：

最新执行合同见：

- `D:\DEV_D\WOS4.5\.ai\docs\wos4-gpt5-implementation-runbook.md`

当前路线不再从零硬推。先只读拆解现有演示 `lk_客户端01_对象1`，确认它的时空、对象、页面挂载、预览和前后端调用方式，再复刻到 `盛云_孙宇飞` 个人对象。参考演示禁止修改。

```text
建模系统客户端_0518
-> 创建/维护数据模型
-> 准备假数据或真实采集点
-> 发现并验证当前有效源语言/元语言 FU 开发入口
-> 源语言/元语言功能开发
-> 保存提交和预览
-> 客户端发布
-> 发布后回归验证
```

所有步骤必须按可见菜单模拟人类操作。动态 URL、对象 ID、GUID 只作为证据和对象标识记录，不能作为入口。

## 当前基线

已验证：

- 登录使用 `wos4-login` 的原生 value setter。
- 桌面客户端打开使用 `wos4-human-navigation` 的真实双击和网络请求判断。
- `建模系统客户端_0518` 可通过桌面卡片进入。
- 已创建模型 `盛云_孙宇飞_假数据设备模型_0612`。
- 已在 `时空功能开发 / 默认数据区` 下创建个人仓库 `盛云_孙宇飞_仓库`。
- 已验证当前后端 demo 只走源语言/元语言 FU 路线；WebJS 不作为本轮主线。
- 已创建并打开 `盛云_孙宇飞_元语言查询Demo_0617`。
- 已读取模型变量：
  - ID：`288230376151738029`
  - GUID：`90a60f87-961b-474d-8aec-6dc7e89dcae3`
- KingStudio 页面设计链路曾跑通过，但 `KingStudio_V20260514` 已被用户确认为废弃入口；历史结果只作为旧证据，不再作为当前路线。

未验证：

- 多灵敏时序物灵敏成员 UI 保存。
- 模型对象或假记录写入。
- 源语言/元语言 FU 的编辑、编译、提交、生成拷贝、打包和部署链路。
- 发布后的客户端访问方式和回归规则。

## 阶段测试、验收和 Skill 回收矩阵

计划执行时，每个阶段都必须有独立测试节点和验收节点。测试节点用于证明当前动作可重复；验收节点用于判断是否允许进入下一阶段；skill 回收用于把已验证步骤沉淀为可复用能力。

| 阶段 | 测试节点 | 验收节点 | 本阶段复用 skill | 通过后回收/沉淀 |
| --- | --- | --- | --- | --- |
| 1. 桌面入口和导航基线 | `browser-harness --doctor`；登录；打开目标桌面客户端；记录网络请求、frame 文本、截图 | 登录稳定；目标客户端通过可见桌面路径进入；不使用动态 URL；不进入 `KingStudio_V20260514` | `wos4-login`、`wos4-human-navigation`、`wos4-browser-harness` | `wos4-open-desktop-client` |
| 2. 建模系统 | 分组选择；新建/编辑模型；版本提交；版本管理读取；生成拷贝入口探测 | 模型在正确分组；版本 1 可读取；重新进入仍存在；生成拷贝有明确入口和结果证据 | `wos4-login`、`wos4-human-navigation`、`wos4-browser-harness`、`wos4-manual-to-skill` | `wos4-modeling-create-model`、`wos4-modeling-version-submit`、`wos4-modeling-submit-copy` |
| 3. 假数据策略 | 页面静态变量联动；模型成员/记录写入探针 | 页面路线 B 可支撑发布主链路；模型路线 A 失败时有错误码和截图，不阻塞后续 | `wos4-button-variable-flow`、`wos4-interaction-flow-skill`、`wos4-demo-page-fullstack-skill`、`wos4-manual-to-skill` | `wos4-fake-data-page-variable`；模型记录跑通后再回收 `wos4-fake-data-model-record` |
| 4. 源语言/元语言 FU 入口 | 探测 `时空功能开发` 的个人仓库、新建弹窗、类型卡片、打开后的编辑区 | 找到当前有效 FU 开发入口；能在个人仓库中新建并打开源语言/元语言 FU；不使用动态 URL | `wos4-human-navigation`、`wos4-browser-harness`、`wos4-manual-to-skill` | `wos4-spacetime-repository-create`、`wos4-meta-language-fu-create` |
| 5. 功能和页面验证 | 在源语言/元语言 FU 内验证编辑、保存/提交、预览或运行；如后续需要页面，再走先布局后组件 | FU 可重开；保存/提交后状态存在；若有页面，布局高度、组件和按钮联动通过；截图和 JSON 完整 | `wos4-create-new-page`、`wos4-layout-devtools-skill`、`wos4-component-persistence`、`wos4-style-config`、`wos4-button-variable-flow`、`wos4-interaction-flow-skill`、`wos4-demo-page-fullstack-skill` | `wos4-page-preview-verify`，并按实际 UI 修订相关 skill |
| 6. 生成可部署物 | 编译、提交、生成拷贝、自启动 APP 配置、打包入口探测和最小执行 | 生成可识别拷贝/包/仓库数据包；失败有 Toast、错误码、网络和截图证据 | `wos4-human-navigation`、`wos4-browser-harness`、`wos4-manual-to-skill` | `wos4-client-build-package` 或 `wos4-client-publish` 前置阶段 |
| 7. 部署准备检查 | 只读进入运维部署客户端；查看节点、资源组、区域、数据区、服务状态 | 能确认部署环境和风险；未执行启停、删除、迁移等破坏性动作 | `wos4-human-navigation`、`wos4-browser-harness`、`wos4-manual-to-skill` | `wos4-deploy-readiness-check` |
| 8. 部署和启动 | 在部署管理/时空对象管理探测挂包、部署、启动流程 | 对象进入可运行状态；部署前后状态有截图和日志/文本证据 | `wos4-human-navigation`、`wos4-browser-harness`、`wos4-manual-to-skill` | `wos4-spacetime-deploy-start` |
| 9. 发布后回归 | 从真实入口打开客户端；验证页面、刷新、重新登录后再打开 | 发布物不是编辑器预览；树、表格、曲线、按钮联动全部通过 | `wos4-human-navigation`、`wos4-browser-harness`、`wos4-interaction-flow-skill` | `wos4-spacetime-runtime-verify`、`wos4-release-regression-checklist` |

回收原则：

- 只回收已经通过验收的实际操作，不把手册原文直接写成 skill。
- 新 skill 必须参数化，不得把某个页面、某个动态 URL、某次 GUID 写死为入口。
- 已有 skill 能覆盖的内容优先修订，不重复新增同类 skill。
- 每次回收都要补证据路径、失败边界、重新进入验证方式。

## 阶段 1：桌面入口和导航基线

目标：稳定进入 WOS4 主桌面、建模客户端，以及后续确认仍有效的客户端/页面设计入口。`KingStudio_V20260514` 不再进入。

标准路径：

```text
WOS4 登录页
-> 主页面 #/main
-> 桌面客户端卡片真实双击
-> 等待 /public/ 和 GetFileContent 请求
-> 递归 iframe 查目标文本
```

验证点：

- 登录成功后不重复登录。
- 顶层 URL 仍是 `#/main` 时，以 iframe 文本和网络请求判断成功。
- 双击后若已有网络请求，继续等待，不提前退出。
- 失败时记录请求、截图和 frame 文本。

已有 skill：

- `wos4-login`
- `wos4-human-navigation`

待沉淀 skill：

- `wos4-open-desktop-client`

触发条件：当一个以上非废弃桌面客户端入口验证稳定后再新增。内容应参数化 `desktopApp`，例如 `建模系统客户端_0518`。

## 阶段 2：建模系统

目标：在 `建模系统客户端_0518` 中创建、维护、提交数据模型。

标准路径：

```text
WOS4 登录页
-> 主页面 #/main
-> 建模系统客户端_0518
-> 管控单元建模
-> 目标分组
-> 新建或编辑模型
-> 配置模型成员
-> 提交版本
```

当前验证对象：

```text
主验证分组：盛云_孙宇飞_根组
冒烟模型：盛云_孙宇飞_Smoke模型_0518
冒烟状态：已提交版本 1
历史假数据模型：测试 / 盛云_孙宇飞_假数据设备模型_0612
历史模型类型：多灵敏时序物
操作者：盛云_孙宇飞
```

待探索模块：

- 创建模型后如何正确提交版本。
- 非灵敏成员 UI 新建和保存。
- 灵敏成员 UI 新建和保存。
- 成员保存后重新打开确认。
- 模型版本提交后是否允许创建对象或记录。

已知错误边界：

- 不能把 `CreateFuModelMemberList` / `CreateFuModelMemberListWebJs` 直接用于多灵敏时序物模型；运行时代码里它们硬编码 `TYPE_FUNCTIONUNITMODEL=1005`。
- 多灵敏时序物模型类型是 `TYPE_MTSENTITYMODEL=1009`。
- 使用 `type=1105` 写非灵敏成员已返回 `ret=-10002` 和 `errorcodes=637730874`。
- 使用 `type=1106` 写灵敏成员已返回非 0 码 `656408580`，查询后成员仍为空。

待沉淀 skill：

- `wos4-modeling-create-model`
- `wos4-modeling-member-config`
- `wos4-modeling-version-submit`

沉淀条件：

- 至少完成一次 UI 新建成员。
- 重新打开模型后成员仍存在。
- 保存截图、before/after JSON 和版本提交结果。

## 阶段 3：假数据策略

目标：在缺少采集点时，仍能支持客户端页面展示和联动验证。

路线 A：模型真实结构

```text
多灵敏时序物模型
-> 灵敏成员
-> 对象/拷贝
-> 实时或历史假记录
-> 页面查询绑定
```

优点：贴近正式系统。

风险：当前成员写入尚未跑通，可能阻塞主链路。

路线 B：页面模拟数据

```text
页面变量
-> 静态树数据
-> 静态表格数据
-> ECharts 静态 option
-> 按钮切换变量刷新表格和曲线
```

优点：已验证，适合先跑客户端发布主链路。

限制：不是模型库真实数据。

推荐策略：

- 发布主链路优先用路线 B。
- 建模深测继续推进路线 A。
- 当路线 A 跑通后，再替换页面静态数据为模型数据。

待沉淀 skill：

- `wos4-fake-data-page-variable`
- `wos4-fake-data-model-record`

## 阶段 4：客户端页面设计入口重新发现

目标：找到当前有效的页面/客户端设计入口，并构建可验证业务画面。不得再进入 `KingStudio_V20260514`。

废弃路径：

```text
WOS4 登录页
-> 主页面 #/main
-> KingStudio_V20260514
-> 产品管理
-> 产品卡片内按钮：进入
-> 产品组装
-> 目标分组
-> 新建页面或打开已有页面
-> 页面编辑器
```

该路径已废弃，不得执行。新的标准路径必须从手册和可见 UI 重新验证。

页面约束：

- 必须先布局，再放组件。
- 顶部搜索区固定高度。
- 主数据区使用明确剩余空间或固定高度。
- 左树、中表、右曲线列宽必须明确。
- 表格和 ECharts 父容器高度必须在预览中验证。

已验证 skill：

- `wos4-create-new-page`
- `wos4-layout-devtools-skill`
- `wos4-component-persistence`
- `wos4-style-config`
- `wos4-button-variable-flow`
- `wos4-interaction-flow-skill`
- `wos4-demo-page-fullstack-skill`

待补 skill：

- `wos4-open-existing-page`
- `wos4-page-preview-verify`

沉淀条件：

- 修改已有页面不重新新建。
- 在同一编辑器会话中保存、预览、回到编辑器继续改。
- 预览 iframe 中确认表格高度、canvas 高度和按钮联动。

## 阶段 5：客户端发布入口重新发现

目标：找到并验证当前有效的客户端发布完整流程。

废弃路径：

```text
KingStudio_V20260514
-> 产品管理
-> 目标产品进入
-> 产品组装
-> 查找发布、部署、打包、运行、客户端相关入口
-> 执行发布
-> 获取发布后访问入口
-> 打开发布客户端并验证页面
```

该路径已废弃，不得继续探索。下一步应从 `建模系统客户端_0518`、帮助手册、当前主桌面有效客户端入口和系统对象/运维入口重新定位发布链路。

重点问题：

- 发布入口在哪个模块或按钮下。
- 发布前是否必须提交页面版本。
- 发布前是否必须提交产品版本。
- 发布是否生成客户端对象、运行副本或独立访问入口。
- 发布后客户端入口是否仍在 WOS4 桌面，还是新窗口/新 URL。
- 发布后页面变量、表格、曲线、按钮联动是否可用。

探索规则：

- 先截图和记录所有可见菜单、按钮、右键菜单、更多操作。
- 不点击删除、覆盖、停止服务等危险操作。
- 对发布、部署、打包类按钮，先打开弹窗读取字段并截图；确认不会破坏现有产品后再执行。
- 任何发布动作前保存当前页面和产品状态证据。

待沉淀 skill：

- `wos4-client-product-assembly`
- `wos4-client-publish`
- `wos4-client-release-verify`

沉淀条件：

- 完成一次最小页面发布。
- 记录发布前、发布中、发布后截图。
- 发布后从可见入口打开客户端。
- 客户端内页面可见并通过交互验证。

## 阶段 6：发布后回归

目标：证明发布物真正可用，而不是只在编辑器或预览里可见。

回归清单：

- 客户端入口存在。
- 页面能打开。
- 树、表格、曲线可见。
- 表格高度不塌陷。
- ECharts canvas 高度可见。
- 点击按钮后变量变化。
- 表格和曲线数据变化。
- 刷新后仍可打开。
- 重新登录后仍可打开。

待沉淀 skill：

- `wos4-release-regression-checklist`
- `wos4-evidence-capture`

## 证据标准

每次探索至少保存：

```text
wos4-artifacts/snapshots/<任务>.json
wos4-artifacts/screenshots/<任务>.png
WOS4_deep_test_notes.md
MEMORY.md
```

成功证据必须包含：

- 菜单层级。
- 点击目标。
- 网络请求摘要。
- 当前 frame URL。
- 可见文本摘要。
- 截图路径。
- 成功或失败结论。

失败证据必须包含：

- 失败动作。
- 等待时间。
- 是否有网络请求。
- frame 文本。
- 错误码或 toast。
- 下一步建议。

## 推进顺序

1. 先用 `wos4-manual-to-skill` 从帮助知识库定位客户端、发布、App 引擎、产品组装相关章节。
2. 把手册描述转成 UI/API 操作假设。
3. 不再探索 KingStudio 产品组装；先重新定位当前有效的页面设计和客户端发布入口。
4. 用已验证的静态假数据页面跑最小发布闭环。
5. 发布后验证客户端页面。
6. 将发布入口和验证流程沉淀为 skill。
7. 回到建模系统继续摸灵敏成员和真实假记录。
8. 模型数据跑通后替换页面静态数据。

## 手册到 Skill 的转换约束

所有尚未验证的新模块必须先走：

```text
wos4-manual-to-skill
-> 手册章节定位
-> 操作假设
-> UI/API 探针
-> 证据记录
-> 成功后更新或新增具体 skill
```

手册文字只能用于形成假设，不能直接写成可复用 skill。页面设计器和发布流程尤其要以实际 UI、网络请求、iframe 文本和提交/预览/发布结果为准。

## 2026-06-17 当前实操进度

已完成并可复用：

- 建模冒烟：`盛云_孙宇飞_根组 / 盛云_孙宇飞_Smoke模型_0518 / 版本 1`。
- 个人仓库：`盛云_孙宇飞_仓库`，GUID `ad547dd3-dede-4192-9efd-638377876e8c`。
- 源语言/元语言 FU：`盛云_孙宇飞_元语言查询Demo_0617`，GUID `0eb5ff6c-93d1-481f-96a4-1c8be6646531`。
- FU 提交：版本 `1`，提交说明 `meta-language-demo-0617-initial-empty-template`。
- FU 拷贝：`盛云_孙宇飞_元语言查询Demo_0617_拷贝1`，母模型版本 `1`。
- 仓库打包：包描述 `meta-language-demo-0617-package-1`，仓库包表格验证版本 `1`，提交时间 `2026-06-17 11:52:52`。
- 部署启动：创建 `盛云_孙宇飞_时空_0617`，添加 `盛云_孙宇飞_仓库 / V1`，部署后时空和仓库包均为 `已部署`，启动后均为 `运行`。

已沉淀 skill：

- `wos4-meta-language-fu-create`
- `wos4-meta-language-fu-release-package`
- `wos4-repository-package-deploy-start`

下一步顺序：

1. 回到源语言/元语言 FU，补最小可验证逻辑：至少在 `onCreate` 或可调用函数中写入/返回一组假数据或状态标记。
2. 重新提交、生成拷贝、打包、添加到 `盛云_孙宇飞_时空_0617`，验证版本更新或新包替换策略。
3. 在 `时空对象管理` 验证功能对象、日志或数据对象是否可见。
4. 再把前端查询 demo 接到该运行态结果；如果运行侧仍空，只能先做静态假数据前端。
