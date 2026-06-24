# WOS4 Deep Test Notes

测试时间：2026-06-11  
测试入口：http://221.239.19.118:13001/#/login  
访问策略：用户已开启 VPN，但 WOS4 地址后续按直连/绕过代理访问。

## 2026-06-22 组态工程壳菜单误判修正

本轮在 `组态系统客户端0518 -> 盛云_孙宇飞_CRUD工程_0620` 里确认了一个会误导自动化的结构点：

- `进入工程` 后先看到的是 `KingFusion4.5_工程浏览器` 壳页。
- 左侧的 `数字孪生实例配置` 不是右侧业务内容页，而是父菜单组。
- 只点这个父菜单组，右侧可以保持空白或只显示工程壳文本，这属于正常状态，不应判定为页面损坏。
- 真正需要点击的是它下面的子项，例如：
  - `管控单元实例配置`
  - `工作流实例配置`

实际修正后，点击 `管控单元实例配置`，右侧立即恢复为：

```text
时空列表
KF4.5Root
NadirL1
NadirL2

实例列表
NadirFrame
盛云_孙宇飞_前端_框架_0620
v2
```

当前结论：

- 先前把 `数字孪生实例配置` 当成内容页入口属于导航失误。
- 该失误已回写到 skill，后续同类工程必须先区分“父菜单组”与“真实子页”。

## 2026-06-18 路线重规划：参考演示优先

- 用户指出已有功能演示 `lk_客户端01_对象1`，应先参考它的做法，而不是继续从零按手册硬推。
- 后续执行顺序调整为：
  1. 只读拆解 `lk_客户端01_对象1`，记录它的时空、运行对象、客户端/页面挂载、预览入口、前后端调用方式和日志。
  2. 结合手册确认它符合的 WOS 规则，例如 App 对象、时空约束、模型/拷贝/对象关系。
  3. 对照我们自己的 `盛云_孙宇飞_客户端Demo_0617` 和 `盛云_孙宇飞_画面Demo_0617`，找出页面挂载、首页/默认页、客户端版本和后端可见性差异。
  4. 只在 `盛云_孙宇飞` 命名空间内修复和验证。
- 严格约束：`lk_` 对象只能查看、截图、读属性、读日志、打开运行窗口，不能保存、提交、更新版本、部署、启动、停止、删除或强制删除。
- 已新增执行合同：
  - `D:\DEV_D\WOS4.5\.ai\docs\wos4-gpt5-implementation-runbook.md`

网络补充：

- 本机 `Test-NetConnection 221.239.19.118 -Port 13003` 显示 `TcpTestSucceeded=True`。
- 但该测试走的接口是 `FlClash / Meta Tunnel`，SourceAddress 为 `198.18.0.1`，说明当前网络层仍可能经过 VPN/TUN，而不是完全直连。
- Chrome 中客户端 iframe 报 `ws://221.239.19.118:13003/` 超时，后续需要确保 Chrome/系统代理对 `221.239.19.118`、`221.239.19.118:13001`、`:13002`、`:13003` 全部直连绕过。

## 2026-06-20 查询列表按钮变量联动回归成功

目标页面：

- `建模系统客户端_0518`
- `数字孪生建模分组 -> 盛云_孙宇飞_根组`
- `盛云_孙宇飞_前端_CRUDDemo_0620`
- `图形模型 -> 页面精灵图 -> 查询列表`

本轮通过 `browser-harness` 重新从固定登录页进入桌面，再按菜单层级进入编辑器，没有依赖旧的动态编辑 URL。

### 编辑器态确认

- 页面精灵图编辑器中的布局和组件均已存在，命名键为：
  - `demo_filter_input`
  - `demo_query_button`
  - `demo_area_tree`
  - `demo_table`
  - `demo_chart`
- `#page_edit_view_area.__vue__._data.comMap.$Children` 可稳定读取。
- 页面变量原始结构已读到：

```text
seedData         KSCGUID=pilot_seedData_0620         varType=2
filterKey        KSCGUID=pilot_filterKey_0620        varType=2
refreshCounter   KSCGUID=pilot_refreshCounter_0620   varType=1
```

- 当前可工作的按钮脚本落点不是嵌套 `propData.propData.linkList`，而是：

```text
btn.linkList[0]
btn.propData.linkList[0]
```

- 同时确认当前页 `page.data.linkMng.linkList` 仍只有基础 page link：

```text
0 / 2 / 4
```

这说明“按钮点击能否在预览执行”的关键，不是先假设要注册可见的 `PageView.linkMng` UI 事件，而是先确认脚本有没有真正落到按钮最终消费的 linkList。

### 预览态确认

- 通过编辑器顶部 `预览` 按钮真实坐标点击，生成新的运行页。
- 预览运行态中 `demo_query_button.__vue__.propData.linkList[0].enable === true`。
- 初始文案为：

```text
查询全部(4)
```

- 在预览页输入框内写入 `B-01` 后点击按钮，结果为：

```text
按钮文案 -> 查询：B-01(0)
表格行数 -> 0
页面出现 -> 暂无匹配数据
```

这次说明：

- 当前按钮点击脚本已经真正持久化到预览运行态。
- 按钮 -> 页面变量 -> 表格 刷新链路已经可用。
- 当前样例至少验证了“前端内假数据过滤链路”已经打通。

### 还没有一起验证的部分

- `linkId>=1000` 的变量改变脚本结构，本轮仍未单独回放验证。
- 当前预览初始 4 条数据为什么在未点击前就已显示，本轮没有把来源完全追到 page-level create script；已确认按钮脚本本身可以独立完成过滤刷新。

### 本轮证据

- `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\frontcrud_edit_entered_0620.png`
- `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\frontcrud_after_pagesprite_click_0620.png`
- `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\preview_button_filter_success_0620.png`
- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\preview_button_filter_success_0620.json`
- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\button_variable_flow_working_pattern_0620.json`

## 当前结论与未完成项

截至当前记录，本轮测试已经覆盖主入口、测试工程、部署管理、时空对象管理页签、KingStudio 产品管理及几个客户端入口，但还不能说已经完整搞懂二开开发流程。

未完成/待深挖：

- 尚未把所有按钮逐一点击验证；目前避开了会产生状态变化的按钮，例如新建、删除、提交、部署、反部署、启动、停止、安装、卸载、导入、上传、确定保存等。
- 尚未完整串通“模型 -> 拷贝 -> 资源/画面 -> 部署 -> 运行”的开发闭环。
- 示例画面尚未明确找到；已发现资源目录如 models/symbols/materials/assets/components，以及组态/建模客户端入口，但客户端 iframe 本轮未暴露内部可点控件。
- 已发现测试工程，但还需要继续确认哪个对象对应示例工程、示例画面、运行画面和部署实例。
- 按钮之间的关系目前只掌握到页面级和对象类型级，还需要继续验证各按钮在不同对象选择状态下的启用/禁用变化。

## 登录与 Skill

- 已在当前工作目录创建登录 skill：`D:\DEV_D\WOS4.5\wos4-login\SKILL.md`
- 登录账号：孙宇飞
- 登录结果：可进入 WellinOS4.5 主界面。
- 登录后主入口包括：时空功能开发、时空对象管理、系统运维、安全管理、审计管理、亚控云商城、KingStudio_V20260514、组态系统客户端0518、建模系统客户端_0518、运维部署客户端_0518。

## 权限与外部入口初测

- 系统运维、安全管理、审计管理：会弹出统一登录/权限相关对话框，需要独立运维/安全/审计账号；当前业务账号未通过这些登录。
- 时空功能开发顶部“权限”：弹出“安全登录：请先登录安全账号”，未继续尝试。
- 亚控云商城：iframe 指向 `https://www.kingappstore.com/`，当前可视页面加载异常/空白；此前直连商城 HTTPS 有 SSL 连接失败迹象。

## 时空功能开发 - 测试工程结构

位置：`默认数据区 / KF4.5工程 / 测试`

发现测试工程结构：

- `KF4.5Root`
  - 报警转发
  - 采集管理
  - 数据源管理
  - 运行权限
  - 工作流
- `客户端1`
  - 根组
  - 私有根组
  - 实时报警数据汇总_运行后台
- `111`
  - 私有根组
  - 根组
  - 实时报警数据汇总_运行后台

### 客户端1 / 根组

- 列表对象：`测试`、`测试1`
- 对象类型：功能单元模型
- 版本状态：编辑态
- 图标：已配置
- 历史版本“查看”：列表为空
- 未执行：提交、上传、删除、导入、导出等会改变系统状态的动作。

### 客户端1 / 实时报警数据汇总_运行后台

列表对象：

- `实时报警数据汇总_运行后台`
- `实时报警数据汇总_时序事`

`实时报警数据汇总_运行后台`：

- 对象类型：功能单元拷贝
- 描述：20260320_V1
- ID：7205759403792795003
- GUID：6df2a0b3-50b0-42a2-a41c-6e3611fb74aa
- 母模型 GUID：f964c4e5-1124-451c-8118-82c643f0467f
- 母模型版本：13
- 最大线程数：8
- 用户列表：可配置，功能单元用户/客户端用户分组；功能单元用户下有业务/运维/安全/审计页签，业务页签显示 `APP_RUN`，密码已配置。
- 安全策略：弹出“关联安全策略”，字段包括类型、ID、选择拷贝、GUID、名称、版本；未确定。
- 审计策略：弹出“关联审计策略”，多条“审计策略(1048)”记录，每条有“选择模型/清空”；未清空、未确定。
- 位置ID：弹出选择对话框；未确定。
- 别名关联管理：入口存在。

`实时报警数据汇总_时序事`：

- 对象类型：时序事拷贝
- 描述：20260109_V1
- ID：9511602413006487863
- GUID：b87c2f62-218b-4ec5-9e3b-4449c03644d8
- 母模型 GUID：070ca889-a34a-41a4-8378-2837bdf87a7e
- 母模型版本：1
- 安全策略：弹出“关联安全策略”，结构同上；未确定。
- 审计策略：弹出“关联审计策略”，多条“审计策略(1048)”；未确定。
- 别名关联管理：弹窗为空，列为“别名名称/关联类型”，有“新建/删除”，提示别名类型分为 GUID 和全路径；未新建。

### 客户端1 / 私有根组资源目录

路径：`测试 / 客户端1 / 私有根组 / 834d0d43-ed4a-4c64-8cf3-c12b4bd13889_resource`

- 目录包括：models、symbols、materials、assets、components。
- `models`：共 4 条，名称包括 `测试`、`测试`、`真空泵`、`真空泵`。其中 `真空泵` 为 Blob 资源，类型 json，大小 224。
- `assets`：共 3 条，名称包括 `真空泵`、`真空泵二泵房`、`真空泵`。其中 `真空泵二泵房` 为 Blob 资源，类型 fbx，大小 574480。
- `symbols`：当前 0 条，描述为图标仓库。
- `materials`：当前 0 条，描述为材质仓库。
- `components`：当前 0 条，描述为组件仓库。
- 这些目录分类标签1均显示 `KingStudio_product_depend`，说明它们是 KingStudio 产品依赖资源。
- 双击 `models/真空泵` 未打开预览或画面，右侧变为暂无数据；暂未找到直接预览入口。

### 111 分支

`111` 本身：

- 仓库路径：`KF4.5工程/测试/111`
- 分类标签1：KingStudio_103
- 可配置：自启动APP、别名关联管理、数据包管理。

`111 / 根组`：

- 列表对象共 7 条：`11111`、`净水厂`、`西侧`、`西侧-2`、`西侧-3`、`test`、`从11`
- `净水厂`：功能单元模型，显示名称 `2222`，版本状态编辑态，图标已配置。
- `test`：功能单元模型，版本状态编辑态，图标已配置；历史版本“查看”为空。

`111` 中间列表还发现：

- `部署配置对象创建_运行后台`：功能单元拷贝，ID 7205759403792795124，GUID e7ed098e-b1a3-4c5e-ba8b-0cf4e2bb8745，母模型版本 1，最大线程数 8。
- `角色信息`：时序事拷贝，ID 9511602413006487972，GUID c9023a51-c025-4908-a0b7-b4aaab3655f3，母模型版本 1。

## 时空功能开发 - 顶部工具栏

- 顶部切换：时空开发 / 部署管理。
- 顶部按钮：仓库包、权限、镜像、关于。其中镜像/关于当前禁用；权限需要安全账号。
- 主工具栏：新建、生成拷贝、复制、移动、导入、导出、删除、上传资源、打包、筛选搜索。
- 下拉菜单：
  - 生成拷贝旁：生成拷贝至
  - 复制旁：复制至
  - 打包旁：全量打包，当前禁用
  - 更多菜单：新建、生成拷贝、复制、移动、导入、导出、删除、上传资源、打包
- 未执行会改变数据的动作。

## 仓库包

入口：时空功能开发顶部“仓库包”

- 弹窗：仓库数据包管理
- 默认数据区共 164 条
- 字段：名称、描述、GUID、提交时间、版本、操作
- 第 1 页示例：KingStudio4.5_Beta、工程管理、数字孪生可视化、数字孪生实例化、系统服务配置、建模系统客户端、组态系统客户端等
- 第 2 页示例：运维系统客户端、数字孪生模型_配置后台、工程管理_配置后台、岗位/人员/组织/时序事_建模_配置后台等
- 每行有删除按钮，未执行删除。

## 部署管理

入口：时空功能开发顶部“部署管理”

首页：

- 节点：本云(0)
- GUID：49458f83-693d-42af-8e5f-9f09d0e6c58c
- 部署状态：未部署
- 连接状态：在线
- “进入”可用；新增/属性/部署/日志等部分按钮灰显。

进入本云(0)后：

- 左侧树：原始时空、镜像时空
- 原始时空下：开发系统、生成器时空、客户端工程、引滦集团、测试、报警转发
- 时空对象管理列表：
  - 开发系统：运行
  - 生成器时空：运行
  - 客户端工程：运行
  - 引滦集团：已部署
  - 测试：运行
  - 报警转发：未部署
- 选中“测试”后，下方时空仓库管理显示 3 条：
  - V1 / 测试22：运行
  - V1 / 业务内置APP：运行
  - V1 / 业务事_运行后台：运行
- 选中下方仓库实例“测试22”后，部署、反部署、启动、停止、日志、任务、默认启动按钮均可用；仅测试日志/任务入口，未执行状态变更。
- “测试22”日志：打开“日志查询”，默认时间范围同上，当前共 0 条。
- “测试22”任务：打开“任务列表”，当前显示暂无数据。
- 时空对象管理“日志”：打开“日志查询”弹窗，默认时间范围为 2026-06-11 00:00:00 至 2026-06-12 00:00:00，操作类型默认显示“部署 + 3”，字段包括时间、操作者、操作类型、状态、错误码、错误信息、操作；当前共 0 条。
- 时空对象管理“任务”：打开“任务列表”弹窗，当前显示暂无数据。
- 未执行部署、反部署、启动、停止、删除、强制删除等动作。

## 时空对象管理

入口：主界面“时空对象管理”

- 页面标题：时空对象管理平台
- 左侧树：本云(0) 下有开发系统、生成器时空、客户端工程、引滦集团、测试、报警转发。
- 顶部页签：功能、实时、历史、计划、连接、三方APP。
- 顶部按钮：权限、镜像、关于，其中权限/镜像/关于当前灰显。
- 选中左侧“测试”后，功能页签当前列表为空，共 0 条。
- 功能页签工具栏包括：我创建的、全部、创建、启动、停止、强制停止、编辑、删除、强制删除、日志、监视、视图、模型管理、按名称搜索。
- 未执行创建、启动、停止、删除、强制删除等动作。

### 功能页签 / 模型管理

- 点击“模型管理”打开模型管理弹窗。
- 默认仓库：业务内置APP。
- 查询模式：模型拷贝。
- 当前有 1 条模型拷贝：
  - 名称：`业务内置APP@测试/业务内置APP`
  - 语言类型：元语言
  - 拷贝ID：7205759403792795121
  - 拷贝GUID：93277db9-c3d4-47cd-bd3f-8eda5e4a8499
  - 模型GUID：4cdf8aaa-dcff-45ed-a061-ba1bd711673b
  - 模型版本：22
- 操作列包含删除、日志；删除未点击。
- 该弹窗还有“导入”按钮，可从开发仓库导入模型拷贝到业务内置APP仓库。
- 模型拷贝“日志”打开日志查询弹窗，包含脚本日志、运行日志、性能日志、统计日志；默认查询模式为拷贝查询，时间范围为 2026-06-11 00:00:00 至 2026-06-12 00:00:00，当前共 0 条。
- 初步判断：运行态功能/对象创建依赖“模型管理”中的模型拷贝；二开开发时应先在开发仓库/KingStudio/建模系统生成模型，再导入为运行仓库模型拷贝，最后在功能或实时/历史/计划库中实例化对象。

### 实时页签

- 对象类型切换：单灵敏时序物、多灵敏时序物、时序事、业务物、业务事、组织、岗位、人员、别名、资源。
- 查询区：查询模式、时空范围、本时空/当前时空、字段条件（默认对象ID）、查询、重置、高级查询。
- 操作按钮：新建对象、删除、全部删除、升级、多版本升级、导入excel、导出excel、数据监视。
- 当前列表共 0 条。
- 高级查询打开“基础条件查询”：包含成员/衍生字段/属性页签，过滤/聚合/衍生/其他分类，where/having 多行条件输入框，以及常见运算符和正则元字符按钮；导入/导出按钮当前灰显。

#### 多灵敏时序物查询/新建验证

- 在实时页签选择“多灵敏时序物”后，查询范围可选：
  - 时空范围：本时空、子时空、本时空树
  - 时空类型：当前时空、最大时空
- 使用“本时空/当前时空”查询：提示查询成功，结果共 0 条。
- 使用“本时空树/最大时空”查询：提示查询成功，结果共 0 条。
- “新建对象”弹窗默认名称为“实时多灵敏时序物对象”，类型为“多灵敏时序物对象”。
- 新建多灵敏对象必须选择“模型拷贝”，并可配置：
  - 基础属性：名称、模型拷贝、描述、父GUID、最大时空、当前时空
  - 时间属性：时间戳位置
  - 空间属性：位置ID、坐标、包络起点/终点、坐标基准、几何对象
  - 质量/新鲜期：对象质量戳、新鲜期
  - 成员信息
- “模型拷贝 -> 选择”弹窗默认仓库为“业务内置APP”，列表为空。
- “模型拷贝 -> 导入”会打开开发仓库树，可从默认数据区/KF4.5工程/测试等路径选择模型拷贝；已展开到 `测试 / 客户端1 / 实时报警数据汇总_运行后台`，当前仍未列出可导入多灵敏模型拷贝。
- 初步结论：多灵敏库内容通过“模型拷贝”实例化生成；若查询为 0，要先在开发仓库/建模侧准备并导入对应多灵敏模型拷贝。

#### 资源库查询/创建验证

- 实时页签“资源”不是同一套时空范围查询 UI，资源页有导入、创建、删除、全部删除、按名称查询。
- 资源页直接查询结果共 0 条。
- 资源“创建”弹窗字段包括名称、描述、类型，类型默认 Blob。
- 初步结论：时空对象管理里的运行时资源库和时空功能开发里 KingStudio 产品依赖资源目录不是同一个可见列表；开发仓库中已能看到 `models/assets` 的 Blob 资源，但运行时资源页当前为空。

### 历史页签

- 对象类型切换：单灵敏时序物、多灵敏时序物、时序事、业务物、业务事、组织、岗位、人员、资源。
- 查询和操作区：查询模式、时空范围、对象ID条件、查询、重置、高级查询、新建对象、删除、全部删除、升级、导入excel、导出excel、数据监视。
- 列表列头：名称、显示名称、ID、GUID、描述、模型拷贝GUID、模型版本、操作。
- 当前列表共 0 条。

### 计划页签

- 对象类型切换：业务物、业务事、组织、岗位、人员、资源。
- 查询和操作区：查询模式、时空范围、对象ID条件、查询、重置、高级查询、新建对象、删除、全部删除、升级、导入excel、导出excel。
- 列表列头：名称、显示名称、ID、GUID、描述、模型拷贝GUID、模型版本、操作。
- 当前列表共 0 条。

### 连接页签

- 默认显示“连接查询1”。
- 操作按钮：连接查询配置、查询、导出Excel；导出Excel 当前灰显。
- 当前列表共 0 条。
- “连接查询配置”弹窗：可添加数据集，表格字段包括数据集、连接方式、连接条件；下方有过滤/聚合/衍生/其他、where/having 条件编辑、运算符和正则元字符按钮，以及导出、导入、重置、取消、确定。
- 未执行添加数据集、导入、确定等会改变配置的动作。

### 三方APP 页签

- 工具栏：创建、部署、反部署、安装、卸载、启动、停止、删除、日志、监视、按名称搜索。
- 当前列表共 0 条。
- 仅“创建”可用；部署、反部署、安装、卸载、启动、停止、删除、日志、监视均灰显。
- 未执行创建或安装/卸载类动作。

## KingStudio_V20260514

- 入口打开后嵌套页面标题为 KingStudio4.5，当前在“产品管理”。
- 顶部按钮：语言（默认简体中文）、关于。
- 关于弹窗显示当前版本：KingStudio_V20260514_35975_Beta。
- 产品列表当前发现 1 个产品：`升级拷贝1`。
- 产品操作：进入、修改、删除；未执行修改或删除。
- 顶部产品管理操作：新建、导入、导出、更多下拉；未执行新建/导入/导出。
- 进入 `升级拷贝1` 后，页面有“建模管理”和“产品组装”入口。
- 建模管理视图：
  - 左侧树当前仅有 `建模`。
  - 右侧列表为空，共 0 条。
  - 工具栏：新建、删除、复制、移动、导入、导出、添加依赖、升级拷贝、搜索、回收站。
  - 属性面板存在但未显示具体条目。
- 产品组装视图：
  - 左侧树当前仅有 `产品`。
  - 右侧列表为空，共 0 条。
  - 工具栏：新建、删除、复制、移动、导入、导出、添加拷贝、升级拷贝、搜索、回收站。

## 组态系统客户端0518

- 入口打开后外层标题为 WellinOS4.0，内层 iframe 标题为“客户端运行”。
- 资源 URL：`/api/v1/GetFileContent/107/0/0/f5f8c456-e145-4d85-b1c3-dc3a17e7b512_105/index.html`
- 当前 DevTools 可访问结构只显示内层客户端运行 iframe，未展开出可点控件。
- 已保存可视截图：`D:\DEV_D\WOS4.5\screenshots\wos4_config_client.png`
- 截图显示客户端区域为空白白屏。
- Console 发现客户端相关错误：`WebSocket connection to 'ws://221.239.19.118:13003/' failed: net::ERR_CONNECTION_TIMED_OUT`。这可能是客户端运行画面未渲染的直接原因。

## 建模系统客户端_0518

- 入口打开后外层标题为 WellinOS4.0，内层 iframe 标题为“客户端运行”。
- 当前资源 URL 同样显示为：`/api/v1/GetFileContent/107/0/0/f5f8c456-e145-4d85-b1c3-dc3a17e7b512_105/index.html`
- DevTools 可访问结构只显示内层客户端运行 iframe，未展开出可点控件。
- 已保存可视截图：`D:\DEV_D\WOS4.5\screenshots\wos4_modeling_client.png`
- 与组态客户端相同，当前未看到实际建模 UI；需解决 `13003` WebSocket 可达性后再复测。

## 运维部署客户端_0518

- 本轮打开后等待 30 秒，未出现“工程列表/云管理/批量部署/系统服务配置/工作流实例”等目标文字。
- 外层标题为 WellinOS4.0，内层 iframe 标题为“客户端运行”。
- 当前资源 URL 同样显示为：`/api/v1/GetFileContent/107/0/0/f5f8c456-e145-4d85-b1c3-dc3a17e7b512_105/index.html`
- DevTools 可访问结构只显示内层客户端运行 iframe，未展开出可点控件。
- 已保存快照：`D:\DEV_D\WOS4.5\snapshots\wos4_ops_client_wait.txt`
- 已保存截图：`D:\DEV_D\WOS4.5\screenshots\wos4_ops_client_wait.png`
- 二次追加等待 15 秒后仍未出现工程列表。
- 备注：此前曾观察到该入口加载出“工程列表”及按钮云管理、批量撤销部署、批量部署、批量启动、批量停止，列表为空；本轮未复现成功加载。
- Console 同样存在 `ws://221.239.19.118:13003/` 连接超时风险，可能影响客户端运行态渲染。

## 2026-06-11 深测补充：功能对象前端视图入口
- 在 `时空对象管理 -> 功能 -> 创建` 中，通过 `应用模板 -> 选择` 选中 `业务内置APP@测试/业务内置APP`。
- 模板元信息：类型 `元语言`，copy ID `7205759403792795121`，copy GUID `93277db9-c3d4-47cd-bd3f-8eda5e4a8499`，model GUID `4cdf8aaa-dcff-45ed-a061-ba1bd711673b`，model version `22`。
- 创建临时功能对象：`Codex临时测试_前端视图_0611`。应用分组未选，访问时空未配置，系统仍允许创建。说明必填项主要是名称和应用模板。
- `访问时空 -> 配置` 是“外云访问时空列表”，字段为云ID、时空GUID，适合跨云访问配置，不是本地测试时空视图必填项。
- 选中新建功能对象后：`启动`禁用，`停止/强制停止/编辑/监视/视图/日志`启用；运行状态查询请求返回 `$runstatus=2`，对象 GUID `d7f70d34-0f1a-4fbd-86b0-0918fbe844b9`，对象 ID `5911255985900486739`。
- 点击 `视图` 和 `监视` 后没有新标签或可见窗口。控制台出现客户端入口初始化日志：`客户端 ShowPage子store初始化`、`initWebJsFuncList start`，同时关键错误：`WebSocket connection to ws://221.239.19.118:13003/ failed: net::ERR_CONNECTION_TIMED_OUT`。这说明功能前端入口存在，但客户端实时通道/运行通道未连通时页面不会正常展示。
- 截图：`D:\DEV_D\WOS4.5\screenshots\功能对象_视图点击后_20260611.png`。
- 创建链路抓包：`Create dataType=21005` -> `Create dataType=21001` -> `Update dataType=21005`。请求保存于 `D:\DEV_D\WOS4.5\network\req_3970_create.*`, `req_3972_create.*`, `req_3973_update.*`, `req_3976_update.*`, `req_3977_update.*`。
- DOM 反查发现点击 `视图/监视` 后主页面注入了隐藏 iframe，而不是打开显式弹窗。入口形态：`http://221.239.19.118:13001/public/?id=<功能对象ID>&parentid=0&cloudid=107&areaid=0&username=<用户名>&bs=true`。
- 当前隐藏 iframe 列表：`desktop-frame/index.html?cloud=107`，以及 `/public/?id=6192730962611142708/2709/2710/2711...`。这些 iframe 均为 0x0，不在当前页面可视区域展示。
- 手动前台打开第一个隐藏入口 `/public/?id=6192730962611142708&parentid=0&cloudid=107&areaid=0&username=<用户名>&bs=true` 后，页面外层标题 `WellinOS4.0`，内部 iframe 加载 `http://221.239.19.118:13001/api/v1/GetFileContent/107/0/0/a882f412-06f7-4256-930d-571048dc3933_95/index.html#/running`。
- 该运行壳显示 `KingStudio4.5 -> 产品管理 -> 升级拷贝1`。`建模管理` 下有 `测试` 条目。
- 双击 `测试` 进入 `worker-space/index.html?guid=02b6b458-5a26-408f-8a78-57578922278e&id=3746994889972252852&version=0&areaid=0&parentid=0&cloudid=107&type=1013`。
- `测试` 是 `数据模型编辑器`，对象类型 `时序事模型`，ID `3746994889972252852`，GUID `02b6b458-5a26-408f-8a78-57578922278e`，版本状态 `编辑态`，仓库路径 `KingStudio4.5_Beta_dataBase/升级拷贝1/建模仓库`。成员配置有 3 条：成员1(String)、成员2(String)、测试1(TimeSpan)。
- 结论：数据/业务模型不是在 `时空对象管理 -> 编辑` 中做，而是在 KingStudio 产品内的 `worker-space` 数据模型编辑器做；`时空对象管理 -> 功能` 负责把已发布/已存在的应用模板实例化并运行。
- `产品组装` 当前列表为空（`暂无数据 / 共 0 条`）。
- `产品组装 -> 添加拷贝` 弹出从 `建模仓库` 选择历史版本的窗口，有按钮 `选择历史版本添加`、`选择最新历史版本添加`。搜索 `测试` 无结果，推测 `测试` 模型还在编辑态/无可用历史版本，所以不能直接加入产品组装。
- `产品组装 -> 新建` 是前端画面/应用模板制作的关键入口：类型一级为 `组态页面 / 功能单元 / 数据模型 / 其他`；选择 `组态页面` 时子类型显示 `客户端 / 页面 / 2D / 3D / 报表 / GIS`，底部按钮为 `确认` 和 `创建并打开`。
- 因此：前端画面在 KingStudio 功能对象的 `产品组装 -> 新建 -> 组态页面` 中做；创建后可用 `创建并打开` 进入对应页面设计器，再通过产品组装/升级拷贝/导出等流程形成可在 `时空对象管理 -> 功能 -> 应用模板` 中实例化的模板。
- `建模管理 -> 新建 -> 数据模型` 是创建多灵敏库/其他数据模型的入口。数据模型类型包括：`业务物`、`单灵敏时序物`、`多灵敏时序物`、`业务事`、`时序事`、`图关系`、`组织`、`岗位`、`人员`。
- 操作链路推断并验证到入口：
  1. 在 KingStudio `建模管理 -> 新建 -> 数据模型 -> 多灵敏时序物` 创建多灵敏模型。
  2. 用 `创建并打开` 进入 `worker-space` 编辑成员/属性。
  3. 在编辑器里通过历史版本 `提交` 形成可用版本。
  4. 到 `产品组装 -> 添加拷贝` 从建模仓库选择历史版本/最新历史版本加入产品。
  5. 产品/应用模板发布后，在 `时空对象管理 -> 功能 -> 创建 -> 应用模板` 或 `时空对象管理 -> 实时/历史 -> 多灵敏时序物 -> 创建 -> 模型拷贝选择/导入` 使用。
- 查询多灵敏库/其他库：在 `时空对象管理` 选择 `实时` 或 `历史` 页签，再点对象类型（如 `多灵敏时序物`、`单灵敏时序物`、`时序事`、`业务物`、`业务事`、`资源` 等），选择查询范围（本时空/子时空/本时空树、当前时空/最大时空）后点查询。当前测试时空下多灵敏时序物查询结果为 0，原因是尚未发现已实例化的多灵敏对象/模型拷贝。

## 2026-06-11 深测补充：前端开发语言与功能单元/后端开发入口
- 静态资源反查：外层 `/public` 运行壳加载 `public/assets/index-87d8f399.js` 与 CSS，页面存在 `__vite_is_modern_browser`，DOM 有 Vue 应用迹象；未发现 React。
- KingStudio 主应用加载 `static/js/index-e38b6f82.js`、`polyfills-legacy-11ef625c.js`，全局变量包括 `__VUE__`、`__VUE_I18N_*`、`__vueuse_ssr_handlers__`，确认是 Vue/Vite 系技术栈。
- `worker-space` 数据模型编辑器加载 `worker-space/js/index.1774322657007.js`，全局有 `MonacoEnvironment`，动态模块中有 `CodeEditor-*.js`、`editor.main-*.js`，说明代码/脚本编辑能力基于 Monaco 一类的 Web 代码编辑器。
- 页面编辑器实际加载：`config.js`、`debugger.js`、`js/runtime.beta.2026.05.14.15.js`、`js/index.beta.2026.05.14.15.js`。界面是低代码组态画布：左侧组件库（布局容器、UI组件、图表组件、流程图、生成器、精灵图库）、中间画布、右侧属性面板，顶部有 `提交`、`预览`。
- 误操作说明：尝试选择 `功能单元 -> Node` 后点击 `创建并打开`，实际打开的是 `页面编辑器`，对象名为 `Codex临时功能单元_Node_0611`。看起来子类型点击未真正生效，系统按默认组态页面创建了对象；未执行删除。
- 功能单元新建入口已确认：`建模管理 -> 新建 -> 功能单元`，子类型显示 `webJS`、`元语言`、`Node`、`appModel`。这就是平台里类似后端/逻辑开发的入口，其中 `Node` 最接近后端脚本/服务逻辑，`webJS` 偏 Web 脚本，`元语言` 是平台内置功能单元逻辑模型，`appModel` 是应用模型类功能单元。

## 2026-06-11 实操：制作前端画面、提交、预览和调试
- 在 `KingStudio -> 建模管理` 中此前误创建的页面对象 `Codex临时功能单元_Node_0611` 已打开为页面编辑器。
- 页面编辑器结构：顶部 `提交`、`预览`；左侧组件库；中间画布；右侧属性面板。
- 展开 `UI组件` 后可见组件清单：`按钮`、`表格`、`输入框`、`选择器`、`文本`、`日期时间选择器`、`导航菜单`、`树`、`图片`、`上传`、`标签页`、`单选框`、`多选框`、`开关`、`时间选择器`、`卡片`、`业务卡片`、`网页容器`、`脚本编辑器` 等。
- 实操步骤：
  1. 从 `UI组件 -> 文本` 拖拽到画布。
  2. 右侧属性显示对象名 `text1`，类型 `ElementText`。
  3. 修改文本值为 `Codex 前端画面测试 2026-06-11`。
  4. 截图保存：`D:\DEV_D\WOS4.5\screenshots\页面编辑器_文本组件已放置_20260611.png`。
  5. 点击 `提交`，弹出 `版本提交`，填写提交说明 `Codex测试：添加文本组件并预览`，确认后出现保存流程。
  6. 点击 `预览` 后新开调试标签。
- 预览/调试 URL：`http://221.239.19.118:13001/public/index.html?id=6192730962611142864&parentid=0&cloudid=107&clientnumber=7710165597571436705&bs=true#/{...}`，hash 中关键字段：`mode=debugger`、`FUType=21`、`type=1005`、`guidVersion.guid=962af8c0-ce5e-446d-acd8-6ceeb5326560`、`guidVersion.version=0`、`guidVersion.id=1441151880758559576`、`projectId=288230376151716915`、`runModelName=Codex临时功能单元_Node_0611`。
- 预览页成功显示文本 `Codex 前端画面测试 2026-06-11`。截图保存：`D:\DEV_D\WOS4.5\screenshots\页面预览_debugger_测试文本_20260611.png`。
- 预览页加载资源：`config.js`、`debugger.js`、`js/runtime.beta.2026.05.14.15.js`、`js/index.beta.2026.05.14.15.js`、以及按需分包 `39225/75460/49955...beta.2026.05.14.15.js`。
- 调试控制台日志：`initWebJsFuncList start`、`spaceTime parse error!`、`registerLink`、`页面名称: Codex临时功能单元_Node_0611`、`registerDataSet`、`KGSDataObjMng subscribeDataObj`，并有分栏宽度/偏移量设置异常提示（RCol11/RCol9/RCol6）。
- 预览页第一个 Query 抓包保存：`D:\DEV_D\WOS4.5\network\preview_req_12.request.network-request` 和 `preview_req_12.response.network-response`。该请求 `commandID=516`、`serviceType=1`、`dataType=1005`，输入 keys 为 `kind, identifierType, versions, returnFields, querymode, returnMode, ids`，响应 `ret=0`。
- 备注：拖拽 `按钮` 到同一画布位置未成功新增，当前最小可验证画面为一个文本组件。未执行删除。

## 2026-06-11 深测补充：布局容器源码结构与嵌套规则
- 本轮不只看界面行为，直接在页面编辑器运行时读取 Vue 组件树和方法源码。编辑器实际画布根节点为 `#page_edit_view_area`，其 `_data.comMap.$Children` 中可见 `RContainer1 / RRow1 / RRow2 / RCol* / 图层1` 等对象。
- 当前页面的布局模型不是“自由堆组件”，而是固定结构：`RContainer -> RRow -> RCol -> object`。
- 左侧 `布局容器` 下几个条目的实际原型如下：
  - `布局`：`prototypeName="RContainer"`，`objectType=1`，是完整容器。
  - `分栏*1 / 分栏*2 / 分栏*4`：`prototypeName="RCol"`，`objectType=6`，是列结构模板，不是普通子组件。
- 通过运行时对象树确认，之前画布里已有两行结构；即使页面视觉上接近空白，底层仍有：
  - `RRow1` 下 2 列：`RCol11`、`RCol12`
  - `RRow2` 下 2 列：`RCol6`、`RCol15`
- `RCol` 的关键方法源码确认如下：
  - `setObject(n){ this.col.object = n }`
  - 这说明列里的子内容不是追加列表，而是直接整槽替换。
- `RCol.addChild(...)` 的关键分支确认如下：
  - 如果拖入对象 `prototypeName === "RCol"`，则不会把它当普通子对象塞进当前列，而是走列结构处理逻辑，触发当前行分栏变化。
  - 对普通对象或布局对象，最终落点是 `r.setObject([l[0]])`；也就是当前列只保留一个子对象槽位。
- 因此“布局里有组件后就不能再添加布局”这件事，从代码层面成立，但更准确的说法是：
  - 不是系统完全禁止布局嵌套。
  - 而是一个 `RCol` 里只有一个 `object` 槽位；这个槽位里已经有组件时，再放一个布局，不会和原组件并存，最终只能替换为新的那个对象。
  - `分栏*1/2/4` 也不是嵌套到组件里面，而是改当前行的列结构。
- 反过来说，若要做“布局里再套布局”，正确路径应是：
  1. 先保证目标列为空。
  2. 往空列里放 `布局(RContainer)`。
  3. 再在这个子布局内部继续加行、分栏、组件。
- 同步确认的结构调整方法：
  - 容器：`setRowsNumber`、`handleDeleteRows`、`addRow`
  - 行：`setColsNumber`、`handleDeleteCols`、`addCol`、`clearRow`
  - 列：`setObject`、`getObject`、`addChild`、`clearCol`、`removeComponent`
- 运行时已做一次未保存的内存态验证：把现有页面清成两行两列结构，截图见：
  - `D:\DEV_D\WOS4.5\screenshots\layout_2x2_runtime_20260611.png`
  - `D:\DEV_D\WOS4.5\screenshots\layout_2x2_equal_rows_20260611.png`
  - `D:\DEV_D\WOS4.5\screenshots\layout_2x2_recalc_20260611.png`
- 备注：上述 2x2 调整目前仅在浏览器运行时内存对象中验证，未执行保存、提交、删除。
- 后续进一步验证了“空白列可套布局，布局内部还可继续套布局和放组件”：
  - 在根布局的空白列 `RCol11` 上，调用编辑器自身的 `addChild(null, [layoutToolkit], 'drag')`，成功放入子布局，生成 `RContainer2 -> RRow3/RRow4 -> RCol16/RCol17`。
  - 继续对 `RRow3`、`RRow4` 调 `addCol(2)`，把子布局扩成 2x2，形成 `RCol16 / RCol18 / RCol17 / RCol19` 四个格子。
  - 在 `RCol19` 调 `addChild(null, [textToolkit], 'drag')`，成功放入文本组件，文本值为 `Nested 2x2 text 2026-06-11`。
  - 在 `RCol16` 再次调 `addChild(null, [layoutToolkit], 'drag')`，成功生成第二层子布局 `RContainer3 -> RRow5/RRow6 -> RCol20/RCol21`。
- 这说明：
  - 布局嵌套是允许的，但前提是目标列为空。
  - 一旦列里已有组件，再放布局就是替换槽位，不会与原组件共存。
  - 组件和布局都可以用编辑器自身的 `RCol.addChild` 路径从代码注入，画面会立即显示内容。
- 当前可视验证证据：
  - 截图：`D:\DEV_D\WOS4.5\screenshots\layout_nested_container_in_col11_20260611.png`
  - 截图：`D:\DEV_D\WOS4.5\screenshots\layout_nested_2x2_with_text_and_sublayout_20260611.png`
  - 快照：`D:\DEV_D\WOS4.5\snapshots\layout_nested_container_in_col11_20260611.txt`
- 当前快照中可直接看到：
  - 画布里出现文本 `Nested 2x2 text 2026-06-11`
  - 右侧属性面板选中对象名为 `RContainer3`
  - 说明第二层子布局已经被编辑器识别并选中，不是单纯 DOM 假象。

## 2026-06-11 深测补充：布局属性映射补全
- 已从运行时对象中抽出布局三层的字段和方法，整理到：
  - `D:\DEV_D\WOS4.5\wos4-layout-devtools-skill\references\layout-properties.md`
- 当前确认的三层对象：
  - 容器层：`RContainer`，字段来源 `container.data`
  - 行层：`RRow`，字段来源 `row.row`
  - 列层：`RCol`，字段来源 `col.col`
- 容器层已确认可操作的主类属性：
  - 行结构：`rowsNumber`、`rowsManager`
  - 尺寸：`width`、`height`、`leftTopPt_x`、`leftTopPt_y`
  - 样式：`backgroundColor`、`picSrc`、`borderWidth`、`borderColor`、`borderRadius`、`boxShadow`、`isShowBorder`
  - 状态：`visible`、`runVisible`、`lock`
- 行层已确认可操作的主类属性：
  - 列结构：`colsNumber`、`colsManager`
  - 行高：`heightStrategy`、`height`、`autoHeight`、`minSize`
  - 间距：`rowGapStrategy`、`rowGap(top/right/bottom/left)`、`colsGap`、`colsAutoGap`、`wrapRowMargin`
  - 状态：`isShow`、`visible`、`dragResizeFlag`
- 列层已确认可操作的主类属性：
  - 子槽位：`object`
  - 宽度策略：`widthStrategy`、`sameWidth`、`minWidth`、`minSize`
  - 断点宽度：`xs/sm/md/lg/xlWidth` 与对应 `AutoWidth`
  - 断点显隐：`xs/sm/md/lg/xlIsShow`
  - 对齐：`horinzontal`、`vertical`
  - 高度：`heightStrategy`、`colHeight`
  - 偏移：`offset`、`offsetRight`、`autoOffset`、`offsetStrategy`、`offsetValid`、`offsetAnimation`
- 偏移相关已明确不是“行列分块”的同义词，而是列级能力；真实结构空白应优先用新增行/列或 gap，局部挪位再用 offset。
- 现有 skill 已重写为“需求驱动布局 skill”，不再以固定 2x2 为主线，而是先把用户需求翻译成布局树，再落到 `RContainer / RRow / RCol / object`：
  - `D:\DEV_D\WOS4.5\wos4-layout-devtools-skill\SKILL.md`

## 2026-06-11 深测补充：按钮/变量/表格/图表/自动加载/定时刷新
- 本轮转到组件交互闭环验证，目标流程是：
  - `按钮 -> 改变量 -> 表格刷新`
  - `按钮 -> 改数据 -> 图表刷新`
  - `打开页面 -> 自动加载数据`
  - `定时器 -> 周期刷新`
- 页面运行时关键入口已确认：
  - `PageEval(scriptString)`：直接 `new Function(scriptString).apply(this)`
  - `PublicEventEval(scriptString, param)`：异步执行事件脚本
  - `PageView` 方法：`initPageVariable`、`setVariable`、`initPageDataSet`、`RunDataSet`、`initialQueryCall`、`dateTimeTimerStart`
- 组件运行时关键能力已确认：
  - 按钮：`SetUIEventConfig`、`setBtnLinkChangeDataSet`、`setBtnLinkChangePubEvent`、`setBtnLinkChangeParamLinkVar`
  - 表格：`SetData`、`GetData`、`setTableLinkData`
  - 图表：`SetOption`、`setChartDataSet`、`getChartData`
- 本次为了先跑通闭环，采用的是“运行时脚本注入”路线，而不是先走属性面板手工配置：
  1. 给页面补一个变量 `filterKey`
  2. 在运行时把 `PageView.__wos4LoadInitialData / __wos4ButtonAction / __wos4TimerAction` 挂出来
  3. 按钮 DOM click 监听调用 `__wos4ButtonAction`
  4. `__wos4ButtonAction` 内部：
     - 切换变量 `filterKey`
     - 用 `table.SetData(...)` 刷新表格
     - 用 `chart.SetOption(...)` 刷新图表
  5. 初始化立即执行 `__wos4LoadInitialData`
  6. 开 `setInterval(..., 2000)` 执行 `__wos4TimerAction`
- 实测结果：
  - 按钮点击后，`filterKey` 从 `B` 变成 `ALL`
  - 表格数据从 2 行切成 4 行，说明“按钮 -> 改变量 -> 表格刷新”已跑通
  - 图表 `dataset.source` 同时变化，说明“按钮 -> 改数据 -> 图表刷新”已跑通
  - 初始化后状态文本出现 `reason=init`，说明“打开页面 -> 自动加载数据”已执行
  - 5 秒后二次读取，`tick` 从 `44` 增到 `59`，图表数据继续变化，说明“定时器 -> 周期刷新”已跑通
- 当前画面验证形态：
  - 一个按钮：`刷新`
  - 一个表格：显示 `名称/数值`
  - 一个图表：ECharts dataset 动态更新
  - 一个文本状态：显示 `filter / click / tick / reason`
- 证据：
  - 截图：`D:\DEV_D\WOS4.5\screenshots\components_button_table_chart_20260611.png`
  - 截图：`D:\DEV_D\WOS4.5\screenshots\button_table_chart_timer_flow_20260611.png`
  - 快照：`D:\DEV_D\WOS4.5\snapshots\components_button_table_chart_20260611.txt`
  - 快照：`D:\DEV_D\WOS4.5\snapshots\button_table_chart_timer_flow_20260611.txt`
- 备注：
  - 这次验证的是“代码驱动流程闭环可行”，并且走的是页面运行时脚本/组件实例方法。
  - 还没有把这一套改成“纯属性面板 + 原生配置界面”方式保存回页面模型；下一步若继续，需要把注入脚本落回平台正式脚本入口。
## 2026-06-11 深测补充：演示页落地与单元测试化（人类可读布局 + 保存预览闭环）

反馈点：
- 之前的测试虽然有交互闭环，但布局过于紧凑，不适合直接演示。
- 现有页面需要改成“可读布局 + 保存 + 预览 + 属性回归”。

本次新增交付文件：
- `D:\DEV_D\WOS4.5\wos4-demo-page-fullstack-skill\SKILL.md`
- `D:\DEV_D\WOS4.5\wos4-demo-page-fullstack-skill\unit-tests.md`

新增 skill 的核心目标：
- 提供人类可读布局模板：标题 + 左树 + 右主区（含筛选+表格）+ 底部状态栏
- 明确 `RContainer -> RRow -> RCol -> object` 的结构性重建顺序
- 指定布局重建优先级（先行列、再宽度与gap、再offset与对齐）
- 说明组件放置策略与运行属性（文本、按钮、表格、图表、选择器）
- 规定保存后预览标准，强调在 `mode=debugger` 下回归页面可见性

新增单元测试矩阵覆盖：
- Layout-01~04：结构行列、宽度比例、gap、offset
- Text-01/02、Button-01/02、Table-01/02、Chart-01/02、Timer-01
- Save-01/02、Preview-01
- 指定回归顺序：布局→组件放置→属性基线→自动加载→按钮/图表→定时器→保存→预览→截图+快照

交付结论：
- 交互能力与脚本能力（现有）继续由交互 skill 负责：
  - `D:\DEV_D\WOS4.5\wos4-interaction-flow-skill\SKILL.md`
  - 已验证 `PageEval`、`PublicEventEval`、`PageView` 核心变量/数据集/查询接口
- 目前仍建议用上述新 skill 先按顺序执行保存和预览闭环，再在运行时补齐按钮/表格/图表的最终属性值并记录到快照。

下一步验收动作建议：
- 依次按 `wos4-demo-page-fullstack-skill` 中步骤执行
- 把每项单元测试结果（已通过/失败）写回 `unit-tests.md`
- 在 `snapshots/` 与 `screenshots/` 下保留至少：
  - 1280 宽布局图
  - 768 宽布局图
  - 交互后/定时器后对比图

## 2026-06-11 深测补充：演示页回归脚本执行结果（环境依赖）

- 运行 `wos4-demo-page-fullstack-skill/runbook.js` 时环境缺少 `playwright`：
  - 快照结果文件：`D:\DEV_D\WOS4.5\snapshots\wos4_demo_page_runbook_result.json`
  - 错误字段说明：`dependency` step false，提示 `npm i -D playwright`
- 本次在当前环境仅完成“回归模板输出与缺陷阻断”，未能执行真实保存/预览/交互截图回归。
- 需要在含 Playwright 的环境或现有浏览器控制能力可用后继续，按 `unit-tests.md` 的表单回填已通过/失败。

## 2026-06-12 重做演示页：搜索 + 表格 + 曲线

- 已按 `AGENTS.md` 先读取 WOS4 登录、布局、演示页 skill，再执行自动化。
- 登录后打开 `Codex临时功能单元_Node_0611` 编辑页，重建为可读布局：
  - 第一行：左侧标题 `业务监控总览`，右侧搜索输入框。
  - 第二行：左侧表格，右侧 ECharts 折线图。
- 已提交版本，提交说明：`Codex重做基础页面：搜索、表格、曲线`。
- 关键发现：
  - 表格运行态直接写 `propData.columns` 可以临时显示，但重新打开后列会丢失。
  - 表格要持久化列和数据，必须把 `this.table({ columns, totalData })` 写入 `detailConfig`，页面重新打开时由组件初始化脚本恢复。
  - 图表同样通过 `detailConfig`/`SetOption` 保持打开后渲染。
- 验证结果：
  - 编辑页重开后表格列 `站点 / 状态 / 流量 / 压力` 和 4 行数据均存在。
  - 曲线图存在 2 条 series。
  - 截图：`D:\DEV_D\WOS4.5\screenshots\wos4_submitted_editor_verify.png`
  - 结构快照：`D:\DEV_D\WOS4.5\snapshots\wos4_submitted_page_verify.json`

## 2026-06-12 样式验证与 skill 修正

- 已执行样式验证脚本：
  - `D:\DEV_D\WOS4.5\wos4-apply-style-test.js`
  - `D:\DEV_D\WOS4.5\wos4-verify-style-test.js`
- 已确认可持久化并在预览中生效：
  - 标题：`styleConfig` + `#domId` CSS，可显示加粗/大字号。
  - 输入框：`styleConfig` + `#domId .el-input__inner`，边框色、背景色、文字色生效。
  - 表格：`styleConfig` + `#domId .el-table...`，表头背景、字体、斑马纹生效。
  - 图表：`detailConfig = "option=..."`，颜色、线宽、grid/legend 配置生效。
- 已确认错误并修正到 skill：
  - 只调用 `SetData` 或只写 `propData.columns` 不是表格持久化方案。
  - 表格列和数据必须写入 `detailConfig` 的 `this.table({ columns, totalData })`。
  - 旧的 25/75 固定模板不适用于当前已验证页面，当前以预览首屏实际可见为准。
- 新证据：
  - 样式预览截图：`D:\DEV_D\WOS4.5\screenshots\wos4_style_preview_verify.png`
  - 样式验证快照：`D:\DEV_D\WOS4.5\snapshots\wos4_style_verify.json`

## 2026-06-12 变量、按钮、表格、曲线联动验证

- 已在 `Codex临时功能单元_Node_0611` 上补充变量驱动演示：
  - 页面变量：`filterKey`、`clickCount`。
  - 打开时初始数据：按钮显示 `切换数据：A / 0`，表格显示 A 区 2 行，曲线图有 canvas。
  - 按钮脚本：写入 `button.propData.linkList[0].script`，点击后修改变量并刷新表格和曲线。
- 已确认按钮脚本注意点：
  - 预览运行态会执行 `this.linkList[0].script`。
  - 脚本不能写顶层 `return`，否则报 `Illegal return statement`。
  - 需要把结果写到 `page.__wos4LastInteraction` 或组件属性中。
- 预览验证结果：
  - 点击前：`切换数据：A / 0`，表格 2 行，数据为 `泵站A/泵站C`。
  - 点击一次：`切换数据：B / 1`，表格 2 行，数据为 `泵站B/泵站D`，图表刷新。
  - 点击两次：`切换数据：ALL / 2`，表格 4 行，图表刷新。
- 本次拆出的细粒度 skill：
  - `D:\DEV_D\WOS4.5\wos4-component-persistence\SKILL.md`
  - `D:\DEV_D\WOS4.5\wos4-style-config\SKILL.md`
  - `D:\DEV_D\WOS4.5\wos4-button-variable-flow\SKILL.md`
- 证据：
  - 快照：`D:\DEV_D\WOS4.5\snapshots\wos4_interaction_verify.json`
  - 截图：`D:\DEV_D\WOS4.5\screenshots\wos4_interaction_preview_verify.png`

## 2026-06-12 页面级脚本入口发现（只读探测，未写入页面）

- 本次按用户要求先不写入、不提交，只发现页面级脚本入口。
- 已确认页面属性 `pageProperty` 只包含名称、描述、尺寸、窗口、自适应等基础字段，不直接保存脚本。
- 页面级脚本入口保存在 `PageView.data.linkMng.linkList`，属性面板通过 `PageView.linkToPropertyJson()` 展示。
- 当前页面已有固定页面级入口：
  - `linkId=0`：创建时。
  - `linkId=2`：存在时，带 `intervalMs=1000`，可作为页面级周期脚本入口。
  - `linkId=4`：关闭时。
  - `linkId=51`：配置进入时。
  - `linkId=52`：配置退出时。
- `linkToPropertyJson()` 还会展示两个动态分组：
  - 变量改变。
  - 定时器。
- 当前页面这两个动态分组为空，因为还没有添加对应动态 link。
- 已确认 `linkMng` 的动态 link 计数器：
  - `lastDataChangeId=1000`：变量改变类 linkId 起点。
  - `lastCustomizeId=100000`：自定义定时器/自定义回调类 linkId 起点。
  - `lastUIId=200000`：UI 事件类 linkId 起点。
- 已确认 `linkMng.linkToPropertyJson()` 的归类逻辑：
  - `KMLINKID_MODEL_ONDATACHANGE <= linkId < KMLINKID_MODEL_ONCUSTOMIZE` 进入“变量改变”分组。
  - `KMLINKID_MODEL_ONCUSTOMIZE <= linkId < KMLINKID_UI_LINK` 进入“定时器”分组。
  - `linkId >= KMLINKID_UI_LINK` 进入 UI 事件类。
- 已确认保存入口：
  - `PageView.upDateLink(...)` / `linkMng.upDateLink(...)` 会按 `KSCGUID` 回写 `script`、`enable`、`intervalMs`。
- 证据：
  - `D:\DEV_D\WOS4.5\snapshots\wos4_page_script_entrypoints_probe.json`
  - `D:\DEV_D\WOS4.5\snapshots\wos4_page_link_implementation_probe.json`
  - `D:\DEV_D\WOS4.5\snapshots\wos4_script_fields_probe.json`

## 2026-06-12 新建完整演示画面

- 已在前台 Chrome 中从 KingStudio 进入：
  - 产品：`升级拷贝1`
  - 产品组装
  - 新建分组：`Codex自动演示_0612`
  - 新建页面：`Codex自动演示页面_0612`
- 页面已打开到页面编辑器，并写入演示组件：
  - 标题：`水务运行驾驶舱`
  - 输入框：`输入站点或区域关键字`
  - 按钮：`切换数据：A / 0`
  - 树：`全部站点 / A区站点 / B区站点`
  - 表格：`站点 / 区域 / 状态 / 流量 / 压力`
  - 曲线图：ECharts canvas
- 已创建页面变量：
  - `filterKey`
  - `clickCount`
  - `tick`
- 已提交版本，提交说明：
  - `Codex自动演示：新建页面、变量、组件、页面脚本入口、表格曲线联动`
- 已打开预览并验证：
  - 初始预览显示 A 区数据。
  - 点击按钮后变为 `切换数据：B / 1`。
  - 表格切换为 B 区数据：`泵站B`、`泵站D`。
  - 预览中确认图表 `canvas` 存在。
- 注意：
  - 本次从已登录 Chrome 会话开始，不包含冷启动登录耗时。
  - 写入过程中发现同类 `ElementText` 使用相同 UIName 时会覆盖运行态 key，因此演示页保留单个标题文本，避免同名文本冲突。
- 证据：
  - 报告：`D:\DEV_D\WOS4.5\snapshots\wos4_new_demo_run_report.json`
  - 构建快照：`D:\DEV_D\WOS4.5\snapshots\wos4_new_demo_build_in_chrome.json`
  - 预览验证：`D:\DEV_D\WOS4.5\snapshots\wos4_new_demo_preview_verify.json`
  - 编辑器截图：`D:\DEV_D\WOS4.5\screenshots\wos4_new_demo_editor_before_submit.png`
  - 预览截图：`D:\DEV_D\WOS4.5\screenshots\wos4_new_demo_preview_after_click.png`

## 2026-06-12 新增新建画面 skill 与耗时报告

- 判断需要新增独立 skill：
  - 新建画面流程关注 KingStudio 产品组装、分组、页面创建、创建并打开。
  - 它和布局、组件持久化、样式、交互不是同一层能力。
  - 因此已新增 `wos4-create-new-page`。
- 新增文件：
  - `D:\DEV_D\WOS4.5\wos4-create-new-page\SKILL.md`
  - `D:\DEV_D\WOS4.5\wos4-create-new-page\references\new-page-flow.md`
  - `D:\DEV_D\WOS4.5\wos4-create-new-page\agents\openai.yaml`
  - `D:\DEV_D\WOS4.5\snapshots\wos4_new_demo_time_report.md`
- 已把 `wos4-create-new-page` 加入 `AGENTS.md` 的 WOS4 专用 skill 列表。
- `wos4-create-new-page` 已通过 `quick_validate.py` 校验。

## 2026-06-12 创建页面链路重跑与修复

- 本次目标：重新跑创建/布局流程，检查链路不合理处并修复项目规则。
- 已确认可用：
  - `wos4.local.ini` 可读取，真实 ini 不进 Git。
  - 登录注入流程能进入系统。
  - 新建/修改前备份链路可生成 `preflight.json` 和 `before-edit.json`。
- 已确认问题：
  - 不能把登录、编辑器接管、布局写入混成一个动作。
  - Chrome MCP 打开 `/public/?...#/running` 时，当前页面为空 `#app`，没有 `#page_edit_view_area`。
  - Chrome MCP 顶层打开 `GetFileContent/.../index.html` 时，页面只有 `#app-master-root`，缺少父窗口初始化，也没有编辑器 runtime。
  - 因此 Chrome MCP 接管失败时应停止并记录，不应继续布局写入，也不应重复登录。
- 已修复：
  - `.ai/instructions/wos4.md` 增加登录注入与 Chrome MCP 接管边界。
  - `wos4-login` 增加“登录成功后不要因编辑器空白重复登录”的规则。
  - `wos4-layout-devtools-skill` 增加 runtime 健康检查。
  - `wos4-demo-page-fullstack-skill` 增加浏览器控制边界。
  - `.ai/skills` 内部旧根目录 skill 路径改为真实 `.ai/skills` 路径。
  - runbook 单元测试输出改到 `.ai/skills/wos4-demo-page-fullstack-skill/unit-tests.md`。
- 证据：
  - `D:\DEV_D\WOS4.5\wos4-artifacts\backups\wos4-demo-fullstack-20260611T195736\preflight.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\backups\wos4-demo-fullstack-20260611T195736\before-edit.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\chrome_public_shell_probe.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\chrome_getfilecontent_resource_probe.json`

## 2026-06-12 登录与人类路径导航规则修正

- 本次目标：重新走登录后继续进入页面设计，新建画面前先验证现有 skill 是否可用。
- 已确认登录问题：
  - Chrome MCP 当前因同一 profile 已有实例锁定，`new_page` 和 `list_pages` 均失败。
  - 失败信息包含 `browser is already running for ... chrome-profile`。
  - 处理规则：不杀浏览器进程，记录 Chrome MCP 不可用，退回 `headless:false` Playwright，并继续使用 `wos4-login` 的原生 value setter。
- 已确认导航问题：
  - 用户要求后续进入页面不能再直接使用动态 URL。
  - 历史 `public/?...#/running`、`GetFileContent/.../index.html`、预览 URL 只能作为证据和对象标识，不能作为入口。
  - 标准入口应记录为菜单层级：`#/main -> KingStudio_V20260514 -> 产品管理 -> 升级拷贝1 -> 进入 -> 产品组装 -> 选择分组 -> 新建 -> 创建并打开`。
- 已确认主页面点击问题：
  - Playwright 登录后，点击 `text=KingStudio_V20260514` 没有进入 KingStudio。
  - 点击/双击当前识别到的窄卡片区域也没有进入。
  - 后续需要继续定位完整可交互卡片容器或图标区域，不能因此回退到动态 URL。
- 已修复：
  - 新增 `.ai/skills/wos4-human-navigation/SKILL.md`。
  - `AGENTS.md`、`.ai/instructions/wos4.md` 增加禁止动态 URL 作为入口的规则。
  - `wos4-login` 增加 Chrome MCP profile 锁定和 Playwright 兜底规则。
  - `wos4-create-new-page` 增加 `wos4-human-navigation` 前置 skill，并要求创建成功后才记录 URL/guid。
- 证据：
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\probe_after_kingstudio_click.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\probe_after_card_coord.png`

## 2026-06-12 产品管理进入与新建弹窗定位修正

- 用户补充并验证：产品管理页的产品卡片内有 `进入 / 修改 / 删除`，进入下一级应点击卡片内 `进入`。
- 已验证路径：
  - 主页面点击 `KingStudio_V20260514` 后顶层仍是 `#/main`。
  - 成功标志在嵌套 iframe 中，frame body 出现 `KingStudio / 产品管理 / 升级拷贝1 / 进入修改删除`。
  - 在产品卡片中点击 exact text `进入` 后，出现 `建模管理 / 产品组装`。
  - 点击 `产品组装` 后，出现左侧 `产品 / Codex自动演示_0612` 和右侧工具栏 `新建`。
- 已确认一个 skill 错误：
  - 新建弹窗打开后页面有多个 input。
  - 第一个 input 是列表搜索框 `请输入搜索内容!`，不是弹窗名称字段。
  - 名称字段是弹窗里的 `placeholder="请输入名称"`。
  - 旧临时脚本填错第一个 input，所以点击 `创建并打开` 后没有打开编辑器。
- 已修复：
  - `wos4-human-navigation` 增加递归 iframe 判断和产品卡片 `进入` 定位。
  - `wos4-create-new-page` 增加弹窗字段定位规则：按 `.el-dialog input[placeholder="请输入名称"]` 或 `.el-overlay-dialog input[placeholder="请输入名称"]` 填名称。
- 证据：
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\human_navigation_enter_button_probe.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\human_navigation_product_assembly_probe.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\human_navigation_create_page_probe.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\human_navigation_enter_button_probe.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\human_navigation_product_assembly_probe.png`

## 2026-06-12 skill 全链路重试进展

- 已完成并验证：
  - 登录：原生 value setter 可进入 `#/main`。
  - 菜单导航：`KingStudio_V20260514 -> 产品卡片进入 -> 产品组装` 可用。
  - 新建弹窗：按 `placeholder="请输入名称"` 可正确填名称。
  - 创建结果：`CodexSkill全链路_0612003159` 出现在产品组装列表。
  - 打开页面：精确匹配真实 `.data-item` 卡片并双击，曾成功打开编辑器 frame `94054fd1-9b20-463a-8372-b69776349847_107/index.html`。
- 新发现的问题：
  - `创建并打开` 有时只创建列表项，不自动打开编辑器。
  - 页面项匹配不能用包含页面名的大容器；一次误点 `data-container` 左上角后切回了 `建模管理`。
  - 编辑器中 `RContainer1.rowsManager` 为空，但 `RRow1/RRow2/RCol...` 已在 `comMap.$Children` 中注册；布局脚本不能依赖 root.rowsManager。
  - 旧布局脚本的无界 `while` 会在行列 API 不生效时卡死，已终止本次 8:31 启动的残留 Node 进程。
- 未完成：
  - 尚未完成目标页面的顶部输入框+按钮、左树中表右曲线、变量联动、提交和预览验证。
- 证据：
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\retry_skill_create_dialog_probe.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\retry_skill_open_exact_card_probe.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\retry_skill_existing_page_model.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\retry_skill_row_col_direct_probe.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\retry_skill_open_exact_card_probe.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\retry_skill_existing_page_model.png`

## 2026-06-12 新增先布局后组件硬约束

- 用户指出：应先布局再向里面放置组件，这必须作为约束。
- 已确认原因：
  - WOS4 行列对象和 `comMap.$Children` key 在布局变更后可能变化。
  - 边建布局边放组件容易把组件挂到旧列或错误列。
  - 后续清列、补列、嵌套布局会丢组件。
  - 表格、树、ECharts 对父容器高度敏感，布局未稳定时放组件会导致预览塌陷。
- 已修复规则：
  - `AGENTS.md` 增加“先完成布局结构和尺寸策略，再放组件”。
  - `.ai/instructions/wos4.md` 增加同样硬约束。
  - `wos4-layout-devtools-skill` 增加两阶段流程：布局阶段和组件阶段。
  - `wos4-demo-page-fullstack-skill` 增加演示页执行顺序。

## 2026-06-12 新增导航等待约束

- 用户指出：有些页面可能还没加载出来，自动化点太快会失败。
- 已补充规则：
  - 登录后必须等待主页面卡片 `KingStudio_V20260514` 真实出现且有尺寸。
  - 主桌面应用卡片需要双击打开；单击可能只是选中，不会加载 iframe。
  - 点击 KingStudio 后必须轮询 iframe，直到出现 `产品管理 / 升级拷贝1`。
  - 点击产品卡片 `进入` 后必须等待 `建模管理 / 产品组装`。
  - 点击 `产品组装` 后必须等待左侧仓库树和右侧 `新建`。
  - 点击后如果状态没有变化，先保存 frame 文本和截图，不能继续连点。
- 已更新：
  - `wos4-human-navigation`
  - `wos4-create-new-page`
  - `.ai/instructions/wos4.md`

### 网络请求判断补充

- 用户指出：网络可能卡，双击后要等较久才有反应，不能鲁莽退出；应看网络请求是否发送来判断点击是否生效。
- 已补充规则：
  - 双击桌面应用后，监听 `/public/` 和 `GetFileContent` 请求。
  - 如果相关请求已经发出，说明点击已生效，应继续等待 iframe/text/runtime，不要重复点击或关闭。
  - 只有 5 到 10 秒完全没有相关请求时，才考虑重新定位后再双击。
  - 页面设计器打开时，监听 `94054fd1-9b20-463a-8372-b69776349847_107/index.html` 请求。

## 2026-06-12 布局阶段重试补充

- 已按新等待规则成功打开编辑器，并监听到 `94054fd1...index.html` 及其资源请求。
- 已完成一次布局阶段，只设置行列和尺寸，不放组件：
  - 顶部行：高度 96。
  - 主数据行：高度 760。
  - 顶部列：`RCol11/RCol12`，约 70/30。
  - 主区列：部分列设置为 33/33/33，高度约 748。
- 新发现：
  - 布局阶段未提交就关闭浏览器，重新打开后部分 `RCol` key 变化或未保留，例如组件阶段查找 `RCol15` 失败。
  - 因此两阶段流程有两种安全做法：
    1. 布局阶段完成后先提交保存，再重开做组件。
    2. 不重开时，在同一个编辑器 runtime 中重新读取 `comMap.$Children` 后立即放组件。
- 证据：
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\retry_layout_phase_only_result.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\retry_component_phase_error.json`

## 2026-06-12 脚本复用约束补充

- 用户指出：WOS4 画面会频繁修改，不应为每个画面生成一份硬编码脚本。
- 结论：长期 skill 形态应是参数化驱动器，而不是单页面脚本。
- 参数应包括：桌面应用名、产品名、模块名、分组名、页面名、模式（打开已有 / 新建并打开 / 预览）。
- 动态 URL、guid、对象 id 只能作为证据保存，不能作为下次进入入口，也不能写死进长期脚本。
- 修改已有画面默认走 `open-existing`：登录后按菜单层级进入产品组装，双击已有页面卡片，打开编辑器后再做 before 快照、布局/组件修改、提交和预览验证。

## 2026-06-12 编辑会话连续性补充

- 用户指出：每次修改后像“闪退”一样退出并重跑脚本是不合理的。
- 正确流程：进入已有页面编辑器后，保持同一个浏览器/编辑器会话；每轮修改后先提交保存，再打开预览验证，然后回到编辑器继续改。
- 不能把脚本当成每轮开发入口。脚本只能作为当前会话里的操作助手，执行布局/组件写入后应停留在编辑器或预览结果上。
- 未提交前关闭浏览器或重跑完整登录/导航，会导致 runtime 修改丢失；之前提交前关闭浏览器就是导致组件未持久化的原因之一。

## 2026-06-12 会话连续性实际测试

- 测试页面：`CodexSkill全链路_0612003159`。
- 流程：
  - Chrome MCP 从登录页进入 `#/main`。
  - 双击 `KingStudio_V20260514`，先看到 `/public/?id=...` 请求和 iframe，再继续等待嵌套 frame 出现 `产品管理 / 升级拷贝1 / 进入`。
  - 点击产品卡片 `进入`，进入 `建模管理 / 产品组装`。
  - 双击右侧 `Codex自动演示_0612` 分组卡片，出现 5 个页面。
  - 双击已有页面 `CodexSkill全链路_0612003159`，等待编辑器 frame 和 `comMap.$Children` 健康检查。
  - 在同一编辑器会话内写入输入框、按钮、树、表格、曲线和变量。
  - 通过真实 `提交` 按钮打开 `版本提交` 弹窗，填写提交说明并保存。
  - 点击 `预览` 打开新标签页，再切回编辑器继续排查。
- 证据：
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\session_flow_before_edit.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\session_flow_after_edit_before_submit.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\session_flow_after_submit_editor.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\session_flow_preview_after_click.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\session_flow_edit_result.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\session_flow_preview_iframe_verify.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\session_flow_editor_layout_after_preview.json`
- 结果：
  - 会话连续性通过：编辑器没有关闭，预览打开为第 2 页，随后可切回第 1 页继续改。
  - 组件持久化部分通过：预览 iframe 内按钮、输入框、表格、树和 canvas 均出现。
  - 按钮联动通过：点击前 `切换数据：A / 0`，表格为泵站 A/C；点击后 `切换数据：B / 1`，表格为泵站 B/D。
  - 布局高度未通过：预览中 table 可见区域约 72px，canvas 约 33px；说明表格和曲线被放进了错误短行或 wrapped col。
- 新修正规则：
  - 预览验证必须进入预览页内层 iframe，不能只看顶层 body。
  - 提交说明字段可能是弹窗内 input，不一定是 textarea；定位必须限定在 `版本提交` 弹窗内。
  - 预览发现高度失败后，应回到同一编辑器会话读取真实 `parentGUID` 和行列关系继续改，不重新登录/重跑导航。

## 2026-06-12 继续修复布局高度并跑通

- 继续沿用同一 Chrome / 编辑器会话，没有重新登录或重跑入口脚本。
- 排查结果：
  - `RRow1` 中误放了输入框、按钮、表格、图表，导致表格和 canvas 只有约 33px 高。
  - `RRow2` 初始只有 `RCol6` 一列，树在第二行，表格和图表不在主数据行。
  - `RRow2.addCol()` 直接调用无效；有效路径是 `RRow2.setColsNumber(3)` 后执行 `initColsCompose()`，随后 `comMap.$Children` 注册 `RCol15/RCol16`。
- 修复动作：
  - `RRow2` 设置为 3 列：`RCol6 / RCol15 / RCol16`。
  - 第二行高度保持 `760`，列高约 `748`。
  - 左列放树，中列放表格，右列放曲线；清空第一行误放的表格/曲线。
  - 保存提交成功，提示 `保存成功 / 生成历史版本成功`。
- 最终预览验证：
  - 按钮初始：`切换数据：A / 0`。
  - 点击后：`切换数据：B / 1`。
  - 表格点击后从泵站 A/C 变为泵站 B/D。
  - 树可见：`全部区域 / A 区域 / B 区域`。
  - 表格主容器尺寸约 `389 x 716`。
  - canvas 尺寸约 `270 x 748`。
- 结论：登录、人类路径导航、打开已有页面、布局先行、组件放置、变量联动、提交、预览、回到编辑器继续改，已在同一会话中跑通。
- 证据：
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\continue_layout_probe.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\continue_move_components_result2.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\continue_preview_verify.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\continue_after_layout_fix_submit.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\continue_preview_after_layout_fix.png`

## 2026-06-12 帮助手册下载与系统分析

- 入口路径：在 WOS4 主桌面右下角任务栏点击帮助图标 `.icon-WOS45-bangzhu`，打开 `Wos4.5帮助手册`。
- 已下载帮助静态资源到 `D:\DEV_D\WOS4.5\wos4-artifacts\docs\help-manual\`。
- 已提取核心手册文件：
  - `manual_data.json`：从 `static/js/file.js` 提取的结构化 JSON。
  - `manual_outline.json`：章节目录。
  - `manual_text.md`：可读目录与关键词索引。
  - `help_system_analysis.md`：系统分层分析。
- 下载限制：部分图片资源直连返回 404，但正文、目录和函数说明已从 `static/js/file.js` 提取成功。
- 初步结论：
  - WellinOS4.5 是桌面壳 + 时空库 + App 引擎 + 运维安全体系的工业数字孪生平台，不是单一页面搭建器。
  - 页面设计属于 WebJS/App 运行层，预览通常在 iframe 中加载，顶层 `#app` 为空不能直接判失败。
  - 手册没有系统化页面设计器组件章节，后续页面布局/组件 skill 仍应以编辑器 runtime 实测为准。
  - 业务数据读写应根据前端 JS / 后台元语言、实时库 / 历史库 / 计划库 / 安全库 / 运维库来选择对应接口函数。

## 2026-06-12 建模系统客户端与假数据模型测试

- 操作者配置：已在本机 `wos4-artifacts/config/wos4.local.ini` 中写入 `operator=盛云_孙宇飞` 和 `name_prefix=盛云_孙宇飞`。
- 入口路径：
  - 登录页 -> `#/main`。
  - 主桌面真实双击 `建模系统客户端_0518` 卡片图标区。
  - 等待 `/public/?id=6192730962611142710...` 和 `GetFileContent/.../f5f8c456-e145-4d85-b1c3-dc3a17e7b512_105/index.html` 请求。
  - 在内层 frame 中进入 `建模系统 / 管控单元建模 / 测试`。
- 已创建模型：
  - 名称：`盛云_孙宇飞_假数据设备模型_0612`。
  - 分组：`测试`。
  - 模型 ID：`288230376151738029`。
  - 模型 GUID：`90a60f87-961b-474d-8aec-6dc7e89dcae3`。
  - 描述：用于无采集点场景的假数据设备模型；操作者：盛云_孙宇飞；后续用于客户端页面表格、树和曲线模拟。
- UI 验证：
  - 可从模型列表点击 `编辑` 进入 `KingFusion4.5_工程浏览器`。
  - 进入后 `GetVariable('数字孪生模型编辑_框架页面', ...)` 可读出上述模型 ID/GUID/名称。
  - `多灵敏时序物` 页面当前成员表仍为空。
- API 探针结论：
  - `api53030.getMemberListByModelGuid(guid, 1009)` 返回 `ret=0,list=[]`。
  - `api53030.GetModelPropertyByGuidVersion({guid, version:0/1/-1, type:1009, fields})` 返回 `ret=0,list=[]`。
  - `CreateFuModelMemberList` / `CreateFuModelMemberListWebJs` 运行时代码硬编码 `TYPE_FUNCTIONUNITMODEL=1005`，不能直接复用于 `TYPE_MTSENTITYMODEL=1009`。
  - 使用 `modelType=1009,type=1105` 写非灵敏成员返回 `ret=-10002`，每条成员 `errorcodes=637730874`。
  - 改用 `type=1106` 写灵敏成员返回非 0 码 `656408580`，查询后成员列表仍为空。
- 结论：
  - 建模客户端入口、模型创建、模型编辑入口、模型变量读取已跑通。
  - 假数据“成员/采集点”尚未写入成功，不能把功能单元成员 API 当作多灵敏时序物模型 API。
  - 下一步应从 UI 新建灵敏成员或继续反查多灵敏模型专用成员协议；若目标是先做页面联动，可先用页面变量/静态数据模拟，不阻塞页面设计验证。
- 证据：
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\sy_fake_model_create_result.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\sy_getvariable_probe2.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\sy_api_signature_probe.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\sy_fake_model_members_api_create_from_appframe.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\sy_fake_model_members_sensitive_create.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\sy_fake_model_after_confirm.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\sy_fake_model_edit_probe.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\sy_fake_model_members_sensitive_create.png`

## 2026-06-12 手册转实际操作再转 Skill 规则

- 已新增 `wos4-manual-to-skill`：手册内容不能直接变成 skill，必须经过“手册章节 -> 操作假设 -> UI/API 探针 -> 证据 -> 可复用步骤 -> skill 更新”。
- 客户端发布的手册依据初步定位在 `App引擎介绍` 和 `元语言函数_App引擎`：WebJS App 通过 WebJS App 引擎和浏览器运行；创建根 App 对象依赖已导入到 App 引擎的 App 拷贝，`Create` 为异步操作。
- 当前发布假设已写入 `wos4-artifacts/snapshots/client_publish_manual_hypothesis.json`：从 `KingStudio_V20260514 -> 产品管理 -> 升级拷贝1 -> 进入 -> 产品组装` 验证 UI 中发布/运行按钮与 App 拷贝、App 对象创建之间的关系。
- 上次产品发布入口探针失败原因：双击 KingStudio 后只有 `/api/v1/Query` 轮询，没有 `/public/` 或 `GetFileContent` 资源请求，不能认定为网络慢；需要重新探准桌面卡片可点击区域后再继续。

## 2026-06-12 KingStudio 入口作废

- 用户明确说明：不许再进入 `KingStudio_V20260514`，该入口是废弃的。
- 已停止基于 KingStudio / 产品管理 / 产品组装的客户端发布探索。
- 已将 `AGENTS.md`、`.ai/instructions/wos4.md`、`wos4-human-navigation`、`wos4-create-new-page`、`wos4-client-release-roadmap.md` 和 `client_publish_manual_hypothesis.json` 更新为：KingStudio 只作为历史证据和反例，不再作为当前操作路径。
- 下一步必须从帮助手册、`建模系统客户端_0518`、主桌面其他有效客户端入口、时空对象管理或运维相关入口重新定位“页面设计/客户端发布”的实际路径。

## 2026-06-12 当前有效客户端手册推导

- 已按 `wos4-manual-to-skill` 重新查看手册，形成 `.ai/docs/wos4-current-clients-manual-plan.md` 和 `wos4-artifacts/snapshots/current_clients_manual_plan.json`。
- 手册 `快速入门` 给出的主链更接近真实发布流程：`时空功能开发 -> 编译 -> 提交 -> 生成拷贝 -> 自启动APP配置 -> 打包 -> 部署管理 -> 时空对象管理 -> 添加仓库数据包 -> 部署 -> 启动 -> 运行验证`。
- `组态系统客户端0518`：手册未形成独立章节，暂作为页面/组态/WebJS 设计入口候选，必须 UI 验证后才能写 skill。
- `建模系统客户端_0518`：对应模型、成员、版本、拷贝；模型只有历史版本可生成拷贝。
- `运维部署客户端_0518`：对应系统客户端/运维管理，负责节点、资源组、区域、数据区、服务进程等部署环境检查；后续先只读查看，不做启停删除。
- `时空对象管理`：对应运行管理，负责时空对象、FU 对象、数据对象和记录；发布后应在这里验证 WebJS/FU 对象启动、窗口打开和运行状态。
- 已修正执行顺序：先 `建模系统客户端_0518` 做模型、成员、提交版本、生成拷贝；再做页面/功能；再打包；再部署准备检查；再部署启动；再运行验证；最后才发布/交付。

## 2026-06-15 browser-harness 重试记录

- 按用户要求先执行：
  - `$env:Path = 'C:\Users\SunYufei\.local\bin;' + $env:Path`
  - `browser-harness --doctor`
- doctor 结果：
  - `[ok] chrome running`
  - `[ok] daemon alive`
  - `[ok] active browser connections`
  - `profile-use installed` 和 `BROWSER_USE_API_KEY set` 为 optional fail，不影响本地 Chrome 接管。
- 多行 Python 输入规则：
  - 不使用 PowerShell here-string 管道，避免 BOM 让 `ensure_real_tab()` 变成隐藏字符开头的错误标识符。
  - 使用 `Set-Content -Encoding ascii` 写临时 `.py`，再用 `cmd /c "type 文件 | browser-harness"` 输入。
  - 因为 ASCII 临时文件会破坏中文，脚本内中文必须写成 Unicode escape。
- browser-harness 已验证流程：
  - 打开 WOS4 登录页。
  - 使用 `js()` 原生 setter 写入登录框。
  - 真实坐标点击登录按钮后进入 `#/main`。
  - 从桌面卡片打开 `建模系统客户端_0518`。
  - 递归访问 `top -> public iframe -> GetFileContent/...f5f8.../index.html`，读取建模系统正文。
  - 点击 `管控单元建模 / 测试` 后模型列表出现 `收球筒` 和 `盛云_孙宇飞_假数据设备模型_0612`。
- `收球筒` 对比：
  - `收球筒` 版本管理中有历史版本 1。
  - 时间：`2026-5-6 16:22:48`。
  - 之前编辑页观察显示其为 `多灵敏时序物`，成员表当前可见为空。
  - 我们的模型目前能进入列表和编辑页，但版本管理尚未在 fresh 流程中成功读取；差距很可能先在“提交版本/历史版本”而不是成员数量。
- browser-harness 限制和下一步：
  - 当前 Chrome 视口约 `929x917`，模型表格右侧 `版本管理/更新/删除` 会超出可见区域；坐标点击会失效，需放大窗口、横向滚动，或在 inner iframe DOM 中精确点击按钮。
  - 版本管理弹窗的 `.el-dialog__headerbtn` 在 DOM 中存在但矩形为 0，普通 DOM click/坐标 click 未关闭；后续应采用 fresh tab、可靠关闭 selector，或先解决弹窗关闭策略后再串联多模型对比。
  - 证据截图：
    - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\browser_harness_wos4_desktop.png`
    - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\browser_harness_model_list_test_group.png`
    - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\browser_harness_version_dom_1.png`

## 2026-06-17 browser-harness 根组纠偏记录

- 用户指出：不能把当前冒烟模型建在 `测试` 分组下，必须删除误建项并新建个人根组。
- 已执行纠偏：
  - 删除 `测试` 分组下误建的 `盛云_孙宇飞_Smoke模型_0518`。
  - 在系统 `根组` 下新建同级分组 `盛云_孙宇飞_根组`。
  - 在 `盛云_孙宇飞_根组` 下重新创建 `盛云_孙宇飞_Smoke模型_0518`。
  - 对正确分组下的模型提交版本，版本管理可见版本 `1`，提交说明为 `smoke-0518-1.0-correct-group`。
- 验证结果：
  - 真实鼠标点击左侧树 `测试` 后，模型列表只剩 `收球筒` 和 `盛云_孙宇飞_假数据设备模型_0612`，不再包含误建的 Smoke 模型。
  - 真实鼠标点击回 `盛云_孙宇飞_根组` 后，模型列表包含 `盛云_孙宇飞_Smoke模型_0518`，当前分组为 `盛云_孙宇飞_根组`。
  - 树节点定位必须限制在 `.treeNodeLabel` 并使用真实坐标点击；仅用正文文本或直接 DOM `click()` 可能误读当前列表或未触发树选择。
- 证据：
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\smoke_wrong_model_delete.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\smoke_personal_group_created.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\smoke_correct_group_model_created.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\smoke_correct_group_model_submitted.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\smoke_verify_test_group_clean_realclick.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\smoke_verify_back_personal_after_test_realclick.png`

## 2026-06-17 时空功能开发个人仓库与源语言/元语言 FU 探针

- 用户约束：当前后端只支持源语言/元语言，本轮 demo 不走 WebJS 主线。
- 入口路径：
  - WOS4 主桌面 `#/main`。
  - 通过底部任务栏切回 `时空功能开发`。
  - 在 `时空开发 / 默认数据区` 下操作，不进入废弃 `KingStudio_V20260514`。
- 已验证：
  - `时空功能开发` 是当前手册链路中的开发仓库入口，顶部可见 `新建`、`生成拷贝`、`导入`、`导出`、`上传资源`、`打包`，并有 `部署管理` 页签。
  - 已在 `默认数据区` 下创建个人仓库 `盛云_孙宇飞_仓库`。
  - 仓库 ID：`288230376151738378`。
  - 仓库 GUID：`ad547dd3-dede-4192-9efd-638377876e8c`。
  - 在个人仓库中新建源语言/元语言 FU 时，必须真实点击 `元语言` 类型卡片；只填名称和描述时，`创建` 与 `创建并打开` 按钮均为禁用状态。
  - 真实点击 `元语言` 卡片后，`创建` 与 `创建并打开` 按钮启用。
  - 已点击 `创建并打开`，创建并打开 `盛云_孙宇飞_元语言查询Demo_0617`。
- 反例：
  - 早前 WebJS 新建探针没有提交成功；结合用户约束，WebJS 不再作为当前后端 demo 主线，只保留为手册/运行层候选或反例。
- 当前结论：
  - 下一步应在 `盛云_孙宇飞_元语言查询Demo_0617` 内继续摸编辑、编译、提交、生成拷贝、打包，不应回到 WebJS。
  - `wos4-spacetime-repository-create` 和 `wos4-meta-language-fu-create` 可以作为待回收 skill，但还需要重开验证和提交/持久化证据后再正式新增。
- 证据：
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\own_repo_created.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\own_repo_created.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\meta_fu_dialog_state_probe.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\meta_fu_dialog_state_probe.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\meta_fu_after_card_click.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\meta_fu_after_card_click.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\meta_fu_create_open_result.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\meta_fu_create_open_result.png`

## 2026-06-17 源语言/元语言 FU 提交、拷贝、仓库打包验证

- 工具与入口：
  - 按用户约束继续使用 `browser-harness`，未使用 Playwright、Chrome DevTools 或 node_repl。
  - 从可见 `时空功能开发` 界面操作，不进入废弃 `KingStudio_V20260514`，不以动态业务 URL 作为入口。
- 已验证：
  - `盛云_孙宇飞_元语言查询Demo_0617` 编辑器内可见 `declare/onCreate/onDestroy/onException`、`提交`、`调试配置`、对象类型 `功能单元模型`、版本状态 `编辑态`。
  - 点击顶层 `提交` 后出现 `版本提交` 弹窗，填写 `meta-language-demo-0617-initial-empty-template` 并确认后出现 `提交成功`。
  - 历史 `查看` 中确认版本 `1`，提交时间 `2026-06-17 11:33:42`，提交说明 `meta-language-demo-0617-initial-empty-template`。
  - 回到 `时空开发` 仓库视图后，选中模型可启用 `生成拷贝`；生成版本 1 的拷贝成功。
  - 生成的拷贝为 `盛云_孙宇飞_元语言查询Demo_0617_拷贝1`，GUID `7015f2f0-f623-4a05-b33c-cefcec5b9d53`，母模型 GUID `0eb5ff6c-93d1-481f-96a4-1c8be6646531`，母模型版本 `1`。
  - 清空对象选择后仓库级 `打包` 可用；填写 `meta-language-demo-0617-package-1` 后打包进度到 `完成 100%`。
  - `仓库包 -> 仓库数据包管理` 中按弹窗内 `描述` 搜索 `meta-language-demo-0617-package-1`，确认包存在：名称 `盛云_孙宇飞_仓库`，GUID `ad547dd3-dede-4192-9efd-638377876e8c`，提交时间 `2026-06-17 11:52:52`，版本 `1`。
- 关键陷阱：
  - 仓库包弹窗打开后默认显示全局包列表，不能只看第一页。
  - 弹窗顶部 y≈72 的 `名称` 搜索框属于主仓库列表；包管理弹窗自己的筛选区域在 y≈205，字段默认是 `描述`，右侧输入框可按打包说明筛选。
  - 选中功能单元模型时 `生成拷贝` 启用、`打包` 禁用；要点底部 `重置` 清空选中对象后再进行仓库级打包。
  - 误点拷贝属性中的 `配置` 会打开 `用户列表`，本轮未填写用户或密码；该入口不是仓库自启动配置验证。
- 当前结论：
  - `时空功能开发 -> 源语言/元语言 FU -> 提交 -> 生成拷贝 -> 仓库打包 -> 仓库包验证` 已经形成可复用链路。
  - 部署管理、时空对象管理、启动/运行验证尚未实操，不能写入发布/部署 skill。
- 证据：
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\meta_fu_submit_dialog_probe.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\meta_fu_submit_dialog_probe.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\meta_fu_submit_confirm_result.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\meta_fu_submit_confirm_result.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\meta_fu_history_view_probe.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\meta_fu_history_view_probe.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\meta_fu_generate_copy_result.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\meta_fu_generate_copy_result.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\repo_package_start_result.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\repo_package_start_result.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\repo_package_dialog_search_desc.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\repo_package_dialog_search_desc.png`

## 2026-06-17 部署管理创建时空、添加仓库包、部署启动验证

- 手册依据：
  - `App引擎介绍` 说明运行模型、运行拷贝、运行仓库需要从模型库部署到 App 引擎。
  - App 对象/仓库运行受所属时空约束；后台读写权限与部署时空相关。
- UI 路径：
  - `时空功能开发 -> 部署管理 -> 本云(0) -> 进入>`
  - 页面分为上方 `时空对象管理` 和下方 `时空仓库管理`。
- 已验证：
  - 创建个人时空 `盛云_孙宇飞_时空_0617` 成功，初始状态 `未部署`。
  - 选中个人时空后，下方 `时空仓库管理 -> 添加` 启用。
  - `添加时空仓库` 弹窗必须先选左侧 `默认数据区`，再选仓库节点 `盛云_孙宇飞_仓库`，中间才会出现包版本。
  - 已选择 `V1 / meta-language-demo-0617-package-1 / 2026-06-17 11:52:52`，移入 `预添加仓库数据包`，确认后底部出现 `V1 盛云_孙宇飞_仓库 状态: 未部署`。
  - 直接点底部仓库包 `部署` 在父时空未部署时无状态变化；父时空必须先部署。
  - 选中上方个人时空卡并点上方 `部署` 后，个人时空变为 `已部署`，底部仓库包也变为 `已部署`。
  - 选中上方个人时空卡并点上方 `启动` 后，个人时空变为 `运行`，底部仓库包也变为 `运行`。
  - 切到独立 `时空对象管理` 客户端后，能看到 `盛云_孙宇飞_时空_0617`；当前 `功能` 列表为空，因为本轮 FU 仍是空模板。
- 当前结论：
  - 最小链路已跑通到 `仓库包运行`。
  - 尚不能说“业务 demo 可用”，因为元语言 FU 没有写查询/假数据逻辑，运行侧没有可验证的功能对象或数据变化。
  - 已将部署启动链路沉淀为 `wos4-repository-package-deploy-start`。
- 证据：
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\deploy_start_result.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\deploy_create_own_spacetime_result.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\deploy_add_package_confirm_result.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\deploy_spacetime_result.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\start_spacetime_result.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\object_management_after_start.png`

## 2026-06-17 元语言 FU 写入 Trace、版本 2、包 V2 追加部署验证

- 工具与入口：
  - 按用户要求继续使用 `browser-harness`，未使用 Playwright、Chrome DevTools 或 node_repl。
  - 从可见 `时空功能开发` 标签恢复 FU 编辑器和部署管理，不进入 `KingStudio_V20260514`，不直接打开动态业务 URL。
- 手册依据：
  - `模型库.md` 说明元语言 APP 模型支持编辑功能函数，内置 `declare/onCreate/onDestroy/onMessage/onException`，系统函数不能增删但脚本可修改。
  - `元语言函数_基础函数.md` 确认 `Trace(int32 logLevel,string description,var content)` 用于脚本日志输出。
- 已验证：
  - FU 编辑器中 Monaco 代码区没有暴露可直接复用的 `monaco.editor.getModels()`；可用人工方式点击函数列表与代码区输入。
  - 选择 `onCreate` 后写入：
    `Trace(2, "wos4-demo-oncreate-0617", "ok");`
  - `Ctrl+S` 在 browser-harness 下未触发保存，会把 `S` 输入编辑器；实际保存按钮是工具栏左侧 `.wos-editor-save` 图标。
  - 点击 `.wos-editor-save` 后，顶部标签和 `onCreate` 函数标签的 `tab-un-save` 均变为 `display:none`，确认已保存。
  - 提交版本说明 `meta-language-demo-0617-oncreate-trace-v2` 后，历史版本确认出现版本 `2`，提交时间 `2026-06-17 13:03:48`。
  - 基于版本 2 生成 `盛云_孙宇飞_元语言查询Demo_0617_拷贝2`。
  - 重新打包个人仓库，打包说明 `meta-language-demo-0617-package-v2-oncreate-trace`，进度到 `完成 100%`。
  - 部署管理中 `添加时空仓库` 弹窗在选择 `默认数据区 -> 盛云_孙宇飞_仓库` 后显示新包：
    `V2 / meta-language-demo-0617-package-v2-oncreate-trace / 2026-06-17 13:10:49`。
  - 已把 V2 包加入个人时空 `盛云_孙宇飞_时空_0617`，底部出现 `V2 盛云_孙宇飞_仓库 状态: 未部署`。
  - 精确选择底部 V2 单卡后，点击底部 `部署`，V2 状态从 `未部署` 变为 `已部署`。
- 未跑通：
  - 对已运行时空追加同一仓库的 V2 后，精确选择 V2 单卡并点击底部 `启动`，连续等待约 60 秒后仍停留在 `已部署`，未变为 `运行`。
  - 本轮没有执行停止、反部署、删除、强制删除或覆盖 V1；V1 仍保持 `运行`。
- 关键陷阱：
  - browser-harness ASCII 临时脚本中，Python 字符串替换进 JS 会导致中文乱码；匹配中文 DOM 时应直接在 JS 字符串中写 `\u` 转义。
  - 选择版本或包卡时不能匹配大容器；需要精确到 `.repo-item` 或 `.data-item`。本轮 V2 添加弹窗的 V2 项为 `.repo-item`，底部 V2 包卡为 `.data-item`，坐标约 `x=548,y=551,w=169,h=67`。
  - 运行中的个人时空里追加同仓库 V2 的启动语义未确认，不能把“包 V2 启动”写入已验证 skill。
- 当前结论：
  - 元语言 FU 编辑、保存、提交版本 2、生成拷贝 2、打包仓库 V2、添加到个人时空、部署到 `已部署` 已验证。
  - 业务运行验证仍未完成；下一步应查手册/界面确认“已运行时空内新增仓库包版本如何切换/启动”，或使用日志入口验证 V2 是否需要父时空重启/切换默认启动。

## 2026-06-17 元语言 FU 查询方法版本 3 与包版本 3

- 使用 `browser-harness` 从可见桌面重新切回 `时空功能开发`，未进入废弃 `KingStudio_V20260514`，未直接打开动态业务 URL。
- 用户指出前台为空的 `时空对象管理` 不是后端发布入口；本轮纠正上下文：必须确保 `时空功能开发` iframe 可见且尺寸非 0 后再继续操作。
- 在 `盛云_孙宇飞_元语言查询Demo_0617` 中新增自定义函数：
  - 函数名：`QueryDemoData`
  - 入参：`string filterKey`
  - 返回值：`string`
  - 函数体：单行返回 JSON 字符串，避免当前 browser-harness/Monaco 多行粘贴不稳定。
- 提交历史版本：
  - 版本：`3`
  - 提交说明：`query-demo-data-backend-method-0617-single-return`
  - 提交时间：`2026-06-17 16:33:56`
- 生成拷贝：
  - 选择 `V3 / query-demo-data-backend-method-0617-single-return`
  - 快速提示捕获到 `生成拷贝成功`
  - 列表出现 `盛云_孙宇飞_元语言查询Demo_0617_拷贝3`
- 仓库打包：
  - 打包说明：`meta-language-demo-0617-package-v3-query-demo-data`
  - 打包进度：`完成 100%`
  - 仓库数据包管理验证：
    - 名称：`盛云_孙宇飞_仓库`
    - GUID：`ad547dd3-dede-4192-9efd-638377876e8c`
    - 提交时间：`2026-06-17 17:03:16`
    - 版本：`3`
- 手册约束已确认：App 接口调用不是只填函数名，至少要有 `cloudID`、被调用 App 对象标识（ID 或 NAME）、`funcName` 和 `params`；运行模型/拷贝查询涉及 `spaceTimeGUID`，字段缺省表示本时空，空字符串表示系统时空。因此前端组态调用后端时必须处理“部署时空/指定时空”配置，不能只调用编辑态模型。
- 下一步：将包版本 3 部署/启动到可验证时空，再在组态页面中通过变量脚本或按钮脚本调用运行态 `QueryDemoData`，预览验证返回数据刷新表格和曲线。
- 按用户要求补充运行态更新原则：常规开发不应每次新建时空，默认应复用固定个人测试时空；新建顶层时空只能作为隔离验证 fallback。
- 固定时空更新 V3 实测：
  - 选择 `盛云_孙宇飞_时空_0617`。
  - 添加 `V3 / meta-language-demo-0617-package-v3-query-demo-data` 到底部 `时空仓库管理` 成功。
  - V3 初始状态：`未部署`。
  - 点击底部 `部署` 后，V3 状态变为 `已部署`。
  - 点击底部 `默认启动` 无可见弹窗、无状态变化。
  - 点击底部 `启动` 后，V3 仍为 `已部署`；同一固定时空内 `V1` 仍为 `运行`、`V2` 为 `停止`。
  - 结论：已有运行时空的同仓库新包版本更新路径仍未跑通，只能记录为已部署边界；不得沉淀成成功 skill。下一步应验证是否需要停止/切换默认启动/重启时空，或对象管理是否能显式选择 V3 拷贝创建运行对象。
- 时空对象管理验证固定时空：
  - 在 `盛云_孙宇飞_时空_0617` 的 `功能 -> 创建 -> 应用模板: 选择` 中，当前只显示 `盛云_孙宇飞_元语言查询Demo_0617_拷贝1 / 模型版本 1`。
  - 未显示 `拷贝2` 或 `拷贝3`。
  - 结论：前端当前无法通过固定时空调用 `QueryDemoData`，因为 V3 对应拷贝没有进入对象管理可选运行态。下一步需要用户授权选择：停止/重启个人测试时空切换 V3，或使用已创建 TOPV3 作为隔离测试时空跑通一次。
- 用户授权边界：只能重启/停止带用户名字的对象，不能重启公共对象。
- 在固定时空 `盛云_孙宇飞_时空_0617` 中仅操作个人仓库包：
  - 停止 `V1 / 盛云_孙宇飞_仓库`，状态从 `运行` 变为 `停止`。
  - 启动 `V3 / 盛云_孙宇飞_仓库`，状态从 `已部署` 变为 `运行`。
  - `V2 / 盛云_孙宇飞_仓库` 保持 `停止`。
  - 未操作公共时空/公共仓库。
  - 结论：固定个人测试时空更新路径跑通的关键是先停止同仓库旧运行版本，再启动新版本。
- V3 运行态对象：
  - 在 `时空对象管理 -> 盛云_孙宇飞_时空_0617 -> 功能 -> 创建 -> 应用模板选择` 中可见 `盛云_孙宇飞_元语言查询Demo_0617_拷贝3 / 模型版本 3`。
  - 创建对象 `盛云_孙宇飞_QueryDemo_0617` 成功。
  - 对象列表出现 `盛云_孙宇飞_QueryDemo_0617`，并有 `is-running` 状态。
  - 前端调用可先按手册使用 `identifierType=NAME` 和对象名 `盛云_孙宇飞_QueryDemo_0617`；对象 ID 读取待补。
- 证据：
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\meta_fu_code_editor_probe.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\meta_fu_code_editor_probe.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\meta_fu_oncreate_trace_typed.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\meta_fu_oncreate_trace_typed.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\meta_fu_oncreate_trace_save_probe.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\meta_fu_oncreate_trace_save_probe.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\meta_fu_history_v2_probe.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\meta_fu_history_v2_probe.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\meta_fu_generate_copy_v2_result.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\meta_fu_generate_copy_v2_result.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\repo_package_v2_oncreate_trace_result.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\repo_package_v2_oncreate_trace_result.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\deploy_select_repo_pkg_v2_safe.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\deploy_select_repo_pkg_v2_safe.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\deploy_add_pkg_v2_after_arrow_confirm.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\deploy_add_pkg_v2_after_arrow_confirm.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\deploy_start_v2_exact_result.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\deploy_start_v2_exact_result.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\start_v2_wait_long_result.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\start_v2_wait_long_result.png`

## 2026-06-17 V2 仓库包新子时空启动验证与对象管理边界

- 工具与入口：
  - 继续使用 `browser-harness`，先执行 `browser-harness --doctor`，核心项 `chrome running / daemon alive / active browser connections` 通过。
  - 从当前 WOS4 主页面和可见任务条进入 `时空功能开发 -> 部署管理`，未进入 `KingStudio_V20260514`，未直接打开动态业务 URL。
- 已验证：
  - 在 `盛云_孙宇飞_时空_0617` 下新建子时空 `盛云_孙宇飞_时空_0617_V2`，初始状态 `未部署`。
  - 新建子时空自身选中时，下方 `时空仓库管理` 为空，`添加` 可用。
  - `添加时空仓库` 弹窗中，`默认数据区` 需要点展开区/行本身，展开后才显示 `个人仓库 / 盛云_孙宇飞_仓库`。
  - 选择 `盛云_孙宇飞_仓库` 后，包列表显示：
    `V2 / meta-language-demo-0617-package-v2-oncreate-trace / 2026-06-17 13:10:49`。
  - 将 V2 包移入预添加列表并确认后，新子时空下方出现：
    `V2 盛云_孙宇飞_仓库 状态: 未部署`。
  - 回到父时空 `盛云_孙宇飞_时空_0617` 的列表，选择上方新子时空卡片 `盛云_孙宇飞_时空_0617_V2`，点击顶部 `部署`，等待约 40 秒后：
    - 子时空状态：`已部署`
    - V2 仓库包状态：`已部署`
  - 继续点击顶部 `启动`，等待约 60 秒后：
    - 子时空状态：`运行`
    - V2 仓库包状态：`运行`
- 对象管理边界：
  - 独立 `时空对象管理` 客户端在刷新/重新打开后，左侧树仍只显示父时空 `盛云_孙宇飞_时空_0617`，未显示子时空 `盛云_孙宇飞_时空_0617_V2`。
  - 因对象管理客户端无法选中 V2 子时空，本轮未能继续创建基于 `拷贝2` 的 App 对象，也未能触发/验证 `onCreate Trace` 日志。
  - 这说明“仓库包在子时空运行”已经验证，但“对象管理里选择该子时空并创建 App 对象”的入口仍需继续查手册或 UI 路径；不能把业务运行验证标为完成。
- 关键陷阱：
  - 已运行父时空里追加同仓库 V2 后，底部启动无法把 V2 从 `已部署` 推到 `运行`；新子时空从未启动状态部署/启动可以跑到 `运行`。
  - 部署新子时空时，要在父节点列表中选择上方 `data-item` 子时空卡片；停在子时空树节点本身时，顶部部署按钮不可用于该子时空卡片。
  - 对象管理客户端可能缓存时空树；`F5` 在 browser-harness 下未触发真实刷新，`location.reload()` 可以刷新主桌面，但刷新后对象管理仍不显示 V2 子时空。
- 当前结论：
  - V2 仓库包启动已跑通，推荐后续测试 V2 时使用独立/子时空从未部署状态开始部署启动，而不是在已运行时空中追加同仓库版本后直接底部启动。
  - 下一步应优先确认：对象管理是否只展示顶层时空、子时空是否需要其他入口进入、或是否必须创建顶层个人 V2 时空才能创建 App 对象。
- 证据：
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\create_v2_timespace_result.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\create_v2_timespace_result.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\add_v2_pkg_to_new_ts_final.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\add_v2_pkg_to_new_ts_final.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\deploy_v2_ts_wait_result.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\deploy_v2_ts_wait_result.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\start_v2_ts_wait_result.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\start_v2_ts_wait_result.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\location_reload_reopen_object.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\location_reload_reopen_object.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\reopen_object_wait_retry.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\reopen_object_wait_retry.png`

## 2026-06-17 老师傅经验补充：数字孪生模型、页面精灵图、变量改变脚本

- 来源：
  - 用户补充的人工经验，不是帮助手册原文。
  - 按 `wos4-manual-to-skill` 规则，只能先作为操作假设和设计约束记录；必须经过 UI/运行验证后才能沉淀为 skill。
- 内容整理：
  - 数字孪生模型中新建内容时，可以建后端，也可以建前端；一个模型/功能体系里可以同时包含前端和后端。
  - 实际项目中可以人为按业务拆分前端和后端，目的是降低维护复杂度，不代表平台强制隔离。
  - 前端低代码编辑应重点关注“页面精灵图”；页面精灵图可暂理解为低代码前端编辑/页面设计载体。
  - 页面脚本尽量写在“变量改变脚本”里。
  - 按钮点击、页面打开时、定时刷新等入口，优先通过改变某个中转变量来触发变量改变脚本，从而复用同一段业务逻辑。
- 对当前 demo 的影响：
  - 前端路线后续应寻找 `页面精灵图 / 精灵图 / 变量改变脚本 / 打开时脚本 / 定时脚本` 等 UI 线索。
  - 页面联动设计继续保持“中转变量”模式，不把同一逻辑分别写到按钮、打开时和定时脚本里。
  - 当前源语言/元语言后端 demo 仍继续；页面精灵图属于后续前端路线验证点。

## 2026-06-17 顶层 TOPV2 时空对象创建与 onCreate 日志验证

- 工具与入口：
  - 继续使用 `browser-harness`，先执行 `browser-harness --doctor`，核心项 `chrome running / daemon alive / active browser connections` 通过。
  - 从当前 WOS4 主桌面和可见任务条进入 `时空功能开发 -> 部署管理` 与独立 `时空对象管理`，未进入 `KingStudio_V20260514`，未直接打开动态业务 URL。
- 已验证：
  - 在 `本云(0)` 根节点下创建顶层时空 `盛云_孙宇飞_时空_0617_TOPV2`，初始状态 `未部署`。
  - 给 TOPV2 添加个人仓库 `盛云_孙宇飞_仓库` 的 `V2 / meta-language-demo-0617-package-v2-oncreate-trace / 2026-06-17 13:10:49`。
  - 点击顶部 `部署` 后，TOPV2 时空与 V2 包均变为 `已部署`。
  - 点击顶部 `启动` 并等待后，TOPV2 时空与 V2 包均变为 `运行`。
  - 刷新/重新打开独立 `时空对象管理` 后，左侧树显示顶层 `盛云_孙宇飞_时空_0617_TOPV2`。
  - 在 TOPV2 下点击 `创建 -> 应用模板: 选择`，模板列表显示 `盛云_孙宇飞_元语言查询Demo_0617_拷贝2`：
    - 类型：`元语言`
    - 拷贝 ID：`7205759403792795538`
    - 拷贝 GUID：`6a4a427d-b856-4a1a-8b6d-d8d5ffc4f579`
    - 模型 GUID：`0eb5ff6c-93d1-481f-96a4-1c8be6646531`
    - 模型版本：`2`
  - 选择拷贝2并创建对象 `盛云_孙宇飞_TraceDemo_0617` 后，列表中对象显示为运行态，并出现同名桌面卡片。
  - 选中对象后进入 `日志 -> 脚本日志`，表格出现 `onCreate / Level2 / wos4-demo-oncreate-0617ok`，时间为 `2026/6/17 13:56:56:169`。
- 结论：
  - V2 元语言 FU 从编辑 `onCreate`、提交版本、生成拷贝、打包、顶层时空部署启动，到对象创建和 `onCreate Trace` 日志验证已经闭环。
  - 子时空 `盛云_孙宇飞_时空_0617_V2` 仍不作为对象创建入口，因为独立 `时空对象管理` 未显示该子时空。
  - 下一阶段前端 demo 应转向“页面精灵图”入口验证，并按老师傅经验采用“按钮/打开时/定时 -> 改变中转变量 -> 变量改变脚本”的复用模式。
- 证据：
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\create_top_v2_timespace.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\create_top_v2_timespace.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\top_v2_add_pkg_retry_select_repo.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\top_v2_add_pkg_retry_select_repo.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\top_v2_move_pkg_confirm.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\top_v2_move_pkg_confirm.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\top_v2_deploy_start.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\top_v2_deploy_start.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\object_open_topv2_retry.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\object_open_topv2_retry.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\object_topv2_create_template.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\object_topv2_create_template.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\object_create_from_copy2.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\object_create_from_copy2.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\object_script_log_probe.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\object_script_log_probe.png`

## 2026-06-17 组态系统客户端前端画面创建与组件冒烟

- 工具与入口：
  - 继续使用 `browser-harness`，`browser-harness --doctor` 核心项 `chrome running / daemon alive / active browser connections` 通过。
  - 从 WOS4 主桌面可见卡片进入 `组态系统客户端0518`，未进入废弃的 `KingStudio_V20260514`，未把动态 URL 当业务入口。
- 已验证路径：
  - 打开 `组态系统客户端0518` 后进入 `KingFusion4.5_工程浏览器`。
  - 新建工程 `盛云_孙宇飞_前端Demo_0617`；新建工程弹窗必须限定在 `.el-dialog` 内填 `名称/描述`，不能填全局第一个输入框。
  - 进入工程后点击 `数字孪生可视化`，在 `客户端列表` 点击 `新建` 创建默认 `客户端1`。
  - 通过 `属性` 将客户端改名为 `盛云_孙宇飞_客户端Demo_0617`。
  - 客户端列表中的 `编辑` 按钮本轮点击无响应；已确认可双击客户端名称单元格进入下一级画面列表。
  - 在画面列表新建页面 `盛云_孙宇飞_画面Demo_0617`，类型默认 `页面`，再用画面行 `编辑` 打开 `KingStudio4.5` 编辑器。
- 布局与组件：
  - 先完成布局并重新读取 `comMap.$Children`，再放组件。
  - 主数据区已验证为 `RRow2` 三列：`RCol6` 左树、`RCol15` 中表、`RCol16` 右曲线；父区域可见高度约 640px。
  - 放置组件：
    - `RCol12`: `ElementInput / demo_filter_input`
    - `RCol14`: `ElementButton / demo_query_button`
    - `RCol6`: `ElementTree / demo_area_tree`
    - `RCol15`: `ElementTable / demo_table`
    - `RCol16`: `ElementChart / demo_chart`
  - 表格和图表通过 `detailConfig` 持久化；编辑器运行态显示 A 区两行表格，ECharts canvas 约 `390x640`。
- 中转变量与按钮联动：
  - 已新增运行态变量 `filterKey=A`、`clickCount=0`。
  - 初次按钮脚本只查 `KMComponentsMng.$Children` 顶层，无法找到挂在 `RCol.getObject()` 下的组件；已修正为同时遍历列对象。
  - 按钮 `linkList[0]` 已保留 `linkId=200001 / linkName=Click / enable=true` 并写入修正脚本。
  - 编辑器内点击按钮只选中组件，不执行运行态 Click 脚本；完整联动仍需在预览页或发布运行态验证。
- 提交和预览：
  - 第一次提交和修正按钮脚本后的第二次提交均返回 `生成历史版本成功！`。
  - 工具栏 `预览` 本轮打开了一个 `about:blank` 标签页，未装载运行页；因此预览验收未通过，不能标记为完整交付。
  - 后续需要继续排查预览按钮实际目标或从发布运行态验证树、表格、曲线和按钮联动。
- 已沉淀：
  - 新增 `.ai/skills/wos4-config-client-screen-create/SKILL.md`，记录组态客户端新建工程/客户端/画面、双击客户端名称进入画面列表、布局后放组件、提交弹窗和预览空白风险。
- 证据：
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\config_create_project_exact_result.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\config_enter_frontend_project.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\config_visualization_entry_probe.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\config_client_name_dblclick_result.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\config_open_screen_editor_result.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\screen_layout_reread_after_layout.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\screen_components_placed_runtime.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\screen_button_script_fixed.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\screen_resubmit_fixed_result.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\screen_about_blank_preview_probe.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\screen_editor_interaction_verify.json`

## 2026-06-17 组态页面前后端 Call 烟测

- 前置条件：
  - 后端运行态对象 `盛云_孙宇飞_QueryDemo_0617` 已在个人时空 `盛云_孙宇飞_时空_0617` 中创建并处于运行状态。
  - 组态页面仍使用 `盛云_孙宇飞_画面Demo_0617`，不新建垃圾页面。
- 编辑器内最小探针：
  - 在页面编辑器 iframe 中直接执行 `Call(new StringMap({ type: 21001, cloudID: 0 }), ...)`，返回 `-220064`，确认这里不能把 `cloudID` 盲写为 `0`。
  - 改用 `cloudID: getLocalCloudID()` 后，`Call` 本身可执行，但按对象名调用 `盛云_孙宇飞_QueryDemo_0617.QueryDemoData` 返回 `-210133`（目标App不存在）。
  - 结论：当前组态编辑器上下文没有绑定到能看到该后端对象的运行时空。
- 按钮脚本修正：
  - 将 `demo_query_button.linkList[0].script` 改为后端 `Call` 版本，目标函数为 `QueryDemoData`。
  - 首次写法使用顶层 `await Call(...)`，通过 `btn.evalFun(script)` 探针确认会报语法错；已改为 `Call(...).then(...).catch(...)`。
  - 新脚本会把结果写入 `PageView.__wos4LastInteraction`，并把按钮文案改成 `backend ok / rows / filter` 或 `backend fail / retCode`。
- 提交、重开、预览：
  - 使用工具栏 `提交` 打开 `版本提交` 弹窗，填写说明 `frontend-backend-call-probe-0617`，返回 `生成历史版本成功！`。
  - 重载编辑器后再次读取 `demo_query_button._props.propData.linkList[0].script`，仍包含 `QueryDemoData` 和 `.then(`，说明脚本已持久化。
  - 本轮 `预览` 已不再打开 `about:blank`，而是新标签页 `WellinOS4.0`，顶层 1 个 iframe，内部成功装载 `盛云_孙宇飞_画面Demo_0617`。
  - 在预览页点击按钮后，页面文案变为 `backend fail / -210133`，表格清空为 `暂无匹配数据`。
- 结论：
  - 前端按钮到后端 `Call` 的脚本链路、提交持久化、重开验证、预览加载链路都已跑通。
  - 当前未跑通的是“页面运行时空看到后端对象”这一层，不是按钮脚本语法或预览入口问题。
  - 下一步不是继续改按钮，而是查前端页面/客户端的时空绑定或把前端运行到与 `盛云_孙宇飞_QueryDemo_0617` 相同的个人时空，再复测。
- 证据：
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\frontend_button_backend_patch_probe.txt`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\frontend_button_backend_patch_noawait_probe.txt`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\frontend_button_backend_runtime_probe2.txt`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\frontend_fill_submit_input_probe.txt`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\frontend_reload_verify_script_probe.txt`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\frontend_switch_preview_inspect.txt`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\frontend_click_preview_button_runtime.txt`

## 2026-06-18 组态正式预览链路缩小到客户端页面挂载

- 工具与入口：
  - 继续使用 `browser-harness`，先执行 `browser-harness --doctor`，核心项 `chrome running / daemon alive / active browser connections` 通过。
  - 严格使用已有已登录 Chrome 会话；新开 `#/main` 固定页会落回登录页，因此后续组态验证必须复用原已登录标签。
  - 不进入 `KingStudio_V20260514`，继续从 `组态系统客户端0518 -> 盛云_孙宇飞_前端Demo_0617 -> 数字孪生可视化` 走人类路径。
- 已验证：
  - 页面编辑器中 `盛云_孙宇飞_画面Demo_0617` 的持久化属性已包含 `spaceTime = 盛云_孙宇飞_时空_0617`，说明页面模型本身已保存时空配置，不是提交丢失。
  - `数字孪生可视化 -> 客户端列表` 中存在 `盛云_孙宇飞_客户端Demo_0617`。
  - 行内 `更新版本` 会弹出确认框；使用真实坐标点击 `确定` 后，消息捕获到 `更新成功`。
  - 行内 `预览` 不会直接开新窗口，而是弹出 `预览链接` 对话框，给出正式客户端运行链路：
    - `http://221.239.19.118:13001/public/index.html?id=6192730962611142709&parentid=0&cloudid=107&clientnumber=7710165598192543459&bs=true#/#{"clientGuid":"d665bd9b-0afc-49d2-a2b1-eaccde459f3e","FUType":11}`
  - 该链接与旧调试页不同：旧页是 `mode=debugger`；正式链接改为 `clientGuid=d665bd9b-0afc-49d2-a2b1-eaccde459f3e / FUType=11`。
  - 用正式预览链接替换旧 `WellinOS4.0` 标签后，顶层页成功变成正式客户端预览链路，内部 iframe 指向：
    - `GetFileContent/.../f5f8c456-e145-4d85-b1c3-dc3a17e7b512_105/index.html`
  - 正式预览运行时中可见全局对象 `ShowPage / ShowPageByID / GetPageMngInfo / $ClientProject / CLIENTRUNINSTANCE`，说明客户端壳已启动，不是浏览器空白或 JS 未执行。
- 新结论：
  - 正式客户端预览运行时当前是“壳已起来，但页面没有自动挂上来”：
    - `GetPageMngInfo()` 返回空对象 `{}`。
    - `pageNameToSetPageMap` 为空。
    - `CLIENTRUNINSTANCE._data` 为空对象。
    - 正式预览 iframe `body` 只有 `#client_run` 容器和空 `<ul>`，没有业务页面文本，也没有 `盛云_孙宇飞_画面Demo_0617` 运行内容。
  - 因此当前阻塞点已经从：
    - 旧 debugger / 错时空 / 页面未提交
    - 缩小为
    - `组态客户端里页面没有挂载到正式客户端运行壳`。
  - 同时，手册又补强了另一个约束：
    - `JS函数_App引擎 -> Call(param, input)` 只有 `identifierType / id|name / funcName / params`，没有 `spaceTimeName` 或 `spaceTimeGUID` 入参。
    - 所以前端按钮脚本不能靠显式指定时空来绕过时空约束；必须让前端运行态与后台 App 处于同一时空，或满足“远程访问时空”规则。
  - `错误码_App引擎` 中 `-210133 = APP_COMMON_DES_APP_NOT_EXIST = 目标App不存在`，这与当前 `backend fail / -210133` 现象一致，说明问题定性应为“当前前端运行态看不到目标后台App”，而不是按钮参数类型错误。
  - 下一步重点不再是改按钮脚本，而是排查客户端编辑配置中的：
    - 页面列表
    - 默认页/首页
    - 导航项或 SetPage 挂载关系
    - 客户端版本提交链
- 2026-06-18 续测补充：
  - `browser-harness` 在当前正式预览标签上执行轻量 `page_info()` 时，直接捕获到浏览器 `alert`：
    - `页面-1441151880758559638-不存在`
  - 对照旧 debugger 预览证据：
    - `guidVersion.id = 1441151880758559638`
    - `runModelName = 盛云_孙宇飞_画面Demo_0617`
  - 说明正式 `clientGuid` 预览链路当前引用的正是这张 demo 画面，但正式客户端运行链路认为该页面对象不存在，或者该页面版本映射已断开。
  - 同时，画面列表表头中存在 `首页` 列，而当前已保存快照没有看到 `盛云_孙宇飞_画面Demo_0617` 行被标记为首页。当前最合理的排查顺序是：
    1. 先查客户端是否设置了首页/默认页。
    2. 再查客户端导航或 `SetPage` 挂载配置。
    3. 最后才回到前端 `Call` 链路复测。
- 已遇到的额外边界：
  - 组态客户端里残留的 `请确认是否要关闭编辑器?` message-box 会拦截行内 `提交版本/预览/编辑` 等点击；必须先真实点击 `取消` 或显式关闭，再进行行内动作。
  - browser-harness 在重压嵌套 iframe runtime 时，针对主标签的大段 `js(...)` 偶发超时；轻量探针和真实坐标点击更稳定。
- 证据：
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\page_space_before_0618.txt`

## 2026-06-18 lk 参考模型建模源头只读拆解

- 工具与入口：
  - 继续使用 `browser-harness`，先执行 `browser-harness --doctor`，核心项通过。
  - 从当前可见 `建模系统客户端_0518` frame 进入 `数字孪生建模分组 -> lk测试`。
  - 只读检查参考模型；未保存、未提交、未更新、未删除、未强制解锁。
- 纠偏结论：
  - 组态系统和运行态看到的是建模产物引用结果，不是源头。
  - 源头应先看 `建模系统客户端_0518 -> 根组/lk测试 -> 模型列表`。
  - 参考模型至少包含：
    - `前端_班次管理`
    - `后台_班次管理`
    - `前端_框架`
- 前端模型：
  - `前端_班次管理` 默认停在数据模型空页，不能据此判断无内容。
  - 切到 `图形模型 -> 页面精灵图` 后可见精灵图列表，核心前端内容在页面精灵图中。
- 后台模型：
  - 左侧菜单必须用代码抓开关状态，不能靠截图判断。
  - 开关识别方式：
    - Element UI `.el-switch.is-checked`
    - `aria-checked="true"`
    - 内部 `input.checked === true`
  - 当前代码级抓取确认打开的项：
    - `业务事`
    - `自定义计算`
    - `命令语言`
  - `业务事` 右侧出现 `业务事 Root / 班次信息 / 基础信息 / 成员`，成员表共 5 条，说明这里定义班次信息的表结构。
  - `自定义计算` 右侧列表有两条：
    - `班次管理后台`，触发类型 `自定义函数`
    - `test01`，触发类型 `自定义函数`
  - `命令语言` 开关也是打开的，仍需继续点开进一步确认右侧是否与自定义计算共用列表或有独立内容。
  - `页面精灵图` 在后台模型中也有 1 条：`班次管理_新 / 数据集测试`。
  - `报表精灵图`、`子模型`、`形参配置` 已逐项点开，当前右侧列表为空。
- 新规则：
  - 数据模型、逻辑模型有开关时，以代码抓取的开关状态作为候选内容判断。
  - 图形模型、子模型、形参配置等没有显式开关或开关不表达内容时，必须逐项点击并抓右侧表格。
  - 右侧内容抓取要限制在编辑器可见右区，不能扫全 `body.innerText`，否则会混入背景模型列表 DOM。
  - Vue 数据只允许浅层摘要，不能把完整 Vue 对象通过 CDP 返回，否则可能报 `Object reference chain is too long`。
- 已沉淀：
  - 新增 `.ai/skills/wos4-modeling-reference-inspection/SKILL.md`。
- 证据：
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\reference_lk_frontend_class_model_edit.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\reference_lk_frontend_page_sprite_list.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\reference_lk_backend_model_edit_entry.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\reference_lk_backend_left_tree_rows.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\reference_lk_backend_menu_switches.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\reference_lk_backend_code_inventory_current.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\reference_lk_backend_content_summary.json`

## 2026-06-18 lk 参考结构最小复刻结论

- 已把 `lk_客户端01_对象1` 的建模源头收敛为三模型结构，而不是单页面：
  - `前端_框架`
  - `前端_班次管理`
  - `后台_班次管理`
- 已确认：
  - `前端_框架 -> 页面精灵图` 只有 `框架页面` 1 页。
  - `前端_班次管理 -> 页面精灵图` 有 4 页：
    - `班次管理`
    - `新建编辑班次`
    - `班次管理_新`
    - `新建编辑班次_新`
  - `后台_班次管理 -> 业务事 -> 班次信息` 定义 5 个成员：
    - `班次名称`
    - `班次类型`
    - `起始时间`
    - `结束时间`
    - `车间名称`
  - `后台_班次管理 -> 自定义计算` 有 2 条：
    - `班次管理后台`
    - `test01`
  - `后台_班次管理 -> 页面精灵图` 有 1 条：
    - `班次管理_新 / 数据集测试`
- 当前最合理的复刻顺序不是全抄，而是先做最小闭环：
  1. 一个后台业务事
  2. 一个后台主自定义函数
  3. 一个前端列表页
  4. 一个前端编辑页
  5. 最后再补前端框架挂载和客户端首页
- `命令语言`、后台 `页面精灵图`、`test01`、`报表精灵图`、`子模型`、`形参配置` 暂不作为第一轮必须项。
- 独立整理报告：
  - `D:\DEV_D\WOS4.5\wos4-artifacts\reports\reference_lk_client01_minimal_clone_2026-06-18.md`

## 2026-06-18 路线再次纠偏：优先复用现有孙宇飞对象

- 用户明确要求后续优先修改现有带 `盛云_孙宇飞` 名称的项目，不再继续新建同类垃圾对象。
- 已据此修正默认执行策略：
  - 个人仓库：`盛云_孙宇飞_仓库`
  - 后端 FU：`盛云_孙宇飞_元语言查询Demo_0617`
  - 前端工程：`盛云_孙宇飞_前端Demo_0617`
  - 客户端：`盛云_孙宇飞_客户端Demo_0617`
  - 画面：`盛云_孙宇飞_画面Demo_0617`
  - 时空：`盛云_孙宇飞_时空_0617_TOPV2`
  - 运行对象：`盛云_孙宇飞_TraceDemo_0617`
- 已重新理清“页面、客户端、时空”的层次关系：
  - 页面先在组态/建模侧存在。
  - 客户端通过页面列表、首页和画面引用关系去挂页面。
  - 时空主要负责挂仓库包、部署启动后端运行对象和定义运行可见范围，不是页面现场编辑入口。
- `lk_客户端01` 的只读证据支持这一点：
  - 画面列表表头包含 `首页 / 画面名称 / 添加 / 画面引用器`。
  - 运行态 `showPageList/currentShow` 里当前挂的是 `框架页面`。
  - 但实际运行内容显示的是 `班次管理` 列表页。
  - 这说明框架页承载业务页，业务页是通过客户端页面配置被引用进来的。
- 结论：
  - 后续不再先想着“去时空里现画页面”。
  - 正确顺序是先改已有页面和已有客户端挂载关系，再更新客户端版本；后端则走 FU 提交/拷贝/打包/时空部署；最后才做正式前后端联调。

## 2026-06-18 新个人三模型骨架已落地

- 操作范围：
  - 仅 `建模系统客户端_0518 -> 盛云_孙宇飞_根组`
  - 未修改任何 `lk_*`、`收球筒`、公共时空、公共客户端。
- 新建模型：
  - `盛云_孙宇飞_后台_查询Demo_0618`
  - `盛云_孙宇飞_前端_框架_0618`
  - `盛云_孙宇飞_前端_查询Demo_0618`
- 已验证成功提示：
  - 三次新建模型均返回 `新建模型成功！`
- 新后台模型当前进度：
  - 已创建 `自定义计算 -> 查询Demo后台`
  - 触发类型已通过组件值直改方式设为 `自定义函数`
  - 创建后列表可见：`查询Demo后台 / 自定义函数`
  - `业务事` 当前只看到 `Root` 空树和空成员表；`Root` 节点未显式暴露新增子项按钮，`业务事 -> 查询信息` 的创建入口仍需继续验证
- 新前端模型当前进度：
  - `盛云_孙宇飞_前端_框架_0618 -> 页面精灵图` 已创建：`框架页面`
  - `盛云_孙宇飞_前端_查询Demo_0618 -> 页面精灵图` 已创建：
    - `查询列表`
    - `新建编辑查询`
  - 三次页面创建均返回 `创建成功`
- 当前阶段结论：
  - `lk` 最小复刻的三模型骨架已经在个人命名空间下真实落地
  - 已跑通部分：
    - 三模型创建
    - 后台主自定义函数创建
    - 前端框架页创建
    - 前端列表页/编辑页创建
  - 未跑通部分：
    - 后台 `业务事 -> Root -> 子事` 创建入口
    - 后续页面编辑、客户端挂页、正式预览、前后端 Call

## 2026-06-18 后台业务事已补到可用骨架

- 作用范围：
  - `建模系统客户端_0518 -> 盛云_孙宇飞_根组 -> 盛云_孙宇飞_后台_查询Demo_0618`
  - 未修改任何 `lk_*` 参考对象
- 已确认并实操成功：
  - `业务事` 子项入口是标题右侧加号，不是右键菜单
  - 加号打开“新建”对话框，字段为 `名称 / 形态 / 描述`
  - 默认形态为 `实时`
  - 已创建子业务事：`查询信息`
  - 成功提示：`创建成功`
- 成员编辑方式：
  - `成员` 区域点击 `添加行` 后直接在表格内联新增行
  - 不是弹窗式成员编辑
  - 删除成员会弹确认框：`确定要删除成员“成员6”吗？`
  - 已验证删除提示：`删除成功！`
- 当前成员骨架：
  - `查询关键字`
  - `名称`
  - `类型`
  - `时间`
  - `状态`
  - 当前字段类型先统一落为 `string`
- 脚本编辑器探针：
  - 已打开 `查询Demo后台` 脚本编辑器
  - 当前可见系统函数列表：`declare / onCreate / onDestroy / onException`
  - 已保存截图：
    - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\bh_current_backend_0618.png`
    - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\bh_calc_list_0618.png`
    - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\bh_calc_editor_0618.png`
- 现阶段结论：
  - 后台最小数据结构已经从“只有空树”推进到“有子业务事 + 5 个假数据字段”
  - 下一步重点不再是树结构，而是只读拆解参考 `班次管理后台` 的函数层，再决定个人 `查询Demo后台` 如何返回前端所需数据

## 2026-06-18 后台自定义函数已新增到编辑器层

- 作用范围：
  - `建模系统客户端_0518 -> 盛云_孙宇飞_后台_查询Demo_0618 -> 自定义计算 -> 查询Demo后台`
- 已验证：
  - `查询Demo后台` 的脚本编辑器不是只有系统函数，只是需要在左上角 `新建` 里继续加自定义函数
  - “新建函数”表单字段为：
    - `功能名`
    - `输入参数`
    - `返回值类型`
- 本轮已新增函数：
  - `queryList`
  - 输入参数：空
  - 返回值类型：`string`
  - 创建后左侧函数列表已可见 `queryList`
  - 成功提示：`创建成功`
- 编辑器输入验证：
  - 代码区为 Monaco
  - 虽然没有直接暴露全局 `monaco.editor`，但 `textarea.inputarea` 可获取焦点
  - 已向 `queryList` 输入最小返回语句：
    - `return "[]";`
  - 状态栏列号从 `1` 变为 `13`，说明输入已被编辑器接收
- 保存/提交流程现状：
  - 点击 `提交` 后先弹：
    - `您还有未保存的脚本，是否保存后再提交?`
  - 继续保存后出现：
    - `修改成功`
  - 随后又叠加出：
    - `版本提交`
  - 当前问题不是“函数建不出来”，而是脚本保存确认框和版本提交框叠在一起，导致会话状态很脏
- 当前结论：
  - 后台已经从“只有模型和空函数容器”推进到“有自定义查询函数骨架”
  - 下一步应先清会话，再确认 `queryList` 是否真正编译通过，然后才去前端页面里试 call

## 2026-06-18 页面精灵图直改布局实验

- 作用范围：
  - `建模系统客户端_0518 -> 盛云_孙宇飞_前端_查询Demo_0618 -> 页面精灵图 -> 查询列表`
  - 使用工具：`browser-harness`
  - 使用约束：先布局后组件，仅验证 `RContainer/RRow/RCol` 直改，不放业务组件
- 实验目标：
  - 验证 WOS4 页面设计器是否可以绕过拖拽，直接通过运行时对象改出一个 `1920x1080` 的标准管理软件骨架
  - 目标骨架：
    - 顶部固定操作区 1 行
    - 下部主内容区 1 行
    - 主内容区 3 列：左树 / 中表 / 右图
- 实操结果：
  - 当前页运行时可直接读取并修改：
    - `RContainer1`
    - `RRow1`
    - `RRow2`
    - `RCol11`
    - `RCol12`
    - `RCol6`
    - `RCol15`
    - `RCol16`
  - 直接通过运行时对象写入成功：
    - 根布局：`width=1920`, `height=1080`
    - 顶部行：`RRow1`, `height=88`, `gap=12`
    - 主区行：`RRow2`, `height=980`, `gap=12`
    - 顶部两列：
      - `RCol11 = 1500`
      - `RCol12 = 405`
    - 主区三列：
      - `RCol6 = 300`
      - `RCol15 = 1020`
      - `RCol16 = 573`
    - `RRow1` 多余 6 列通过 `width=0 + visible=false` 隐藏，未强删
- 关键现象：
  - 直接改 `RRow/RCol` 数值后，属性层和 `comMap.$Children` 能读到新宽高，说明模型修改真实生效
  - 但编辑器画布不是每次都会把内部行列边框立即重绘出来
  - 清空列对象后，`$Children` 中的 `RRow1/RRow2` 引用会短暂丢失，只剩根容器和列对象仍可见
  - 说明该编辑器更像“模型驱动 + 惰性重绘”，不是改完属性就一定完整刷新 DOM 的普通网页
- 残留对象检查：
  - 一度发现 `RCol6` 内仍挂着旧对象 `chart1 / ElementChart`
  - 后续已执行清列，当前实验阶段不保留业务组件，只保留布局骨架
- 证据：
  - 直改后截图：
    - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\bh_std_admin_layout_direct_0618.png`
  - 加浅色骨架标记后截图：
    - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\bh_std_admin_layout_visualized_0618.png`
- 当前结论：
  - WOS4 页面布局可以直接通过代码操控模型，不必完全依赖拖拽
  - 适合代码操控的是“布局模型本身”，不是编辑器 DOM
  - 自动化后续应采用：
    - 先写 `RContainer/RRow/RCol` 模型
    - 再重新读取最新 `comMap.$Children`
    - 再进入组件阶段
  - 若要让人类直观看到布局区域，不能只改宽高；还要补边框、背景或直接放占位组件

## 2026-06-18 页面精灵图保存探针：直接改属性并重开验证

- 作用范围：
  - `建模系统客户端_0518 -> 盛云_孙宇飞_前端_查询Demo_0618 -> 页面精灵图 -> 查询列表`
- 目标：
  - 不再试图清列或补组件，只验证“直接修改已存在布局对象属性 -> 提交 -> 重开后仍在”
- 实操步骤：
  - 使用当前编辑器 runtime，直接修改 `RContainer1`：
    - `backgroundColor = rgba(255,240,220,0.95)`
    - `borderWidth = 2`
    - `borderColor = rgba(214,128,44,0.75)`
    - `isShowBorder = true`
  - 点击编辑器顶部 `提交`
  - 捕获到 `版本提交` 弹窗
  - 填写提交说明：`root-style-save-probe-0618`
  - 点击弹窗 `确定`
- 保存结果：
  - 成功提示：`生成历史版本成功！`
  - 说明页面编辑器对根布局样式属性的直写，能够进入正式提交链路
- 重开验证：
  - 在同一建模客户端内重新点击 `页面精灵图 -> 查询列表 -> 编辑`
  - 重新读取 `RContainer1.data`，结果仍为：
    - `backgroundColor = rgba(255,240,220,0.95)`
    - `borderWidth = 2`
    - `borderColor = rgba(214,128,44,0.75)`
    - `isShowBorder = true`
  - 右侧属性面板截图也可见上述值
- 证据：
  - 提交前截图：
    - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\bh_root_style_probe_before_submit_0618.png`
  - 提交后截图：
    - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\bh_root_style_probe_after_submit_0618.png`
  - 重开验证截图：
    - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\bh_root_style_probe_reopen_verify_0618.png`
- 当前结论：
  - 对已有页面，直接操控 `RContainer/RCol` 这类布局对象的属性是可行的
  - 且这类属性修改可以被 `提交` 持久化
  - 当前真正不稳定的不是“保存”，而是：
    - 通过 `addChild` 在当前这页空列里直接补新组件未立即成功
    - 编辑器画布对布局模型的可视重绘不总是完整
  - 因此后续更稳的策略应是：
    - 先用代码改已有布局对象属性
    - 保存确认持久化
    - 再单独针对组件插入做小范围探针

## 2026-06-18 布局增删改分层结论

- 页面：
  - `盛云_孙宇飞_前端_查询Demo_0618 -> 页面精灵图 -> 查询列表`
- 本轮目标：
  - 不再混测组件，只回答“布局怎么测”
  - 分三类：
    - 增：新增布局槽位
    - 删：删除布局槽位
    - 改：修改已有布局对象属性

### 1. 行级新增：当前页根容器 API 不稳定

- 已测试：
  - `RContainer1.setRowsNumber(3)`
  - `RContainer1.addRow()`
- 结果：
  - `setRowsNumber(3)` 只会改 `rowsNumber` 计数，不会真实补出新的 `rowsManager[2]`
  - `addRow()` 在当前页会把 `rowsNumber` 又恢复回 2，但仍不生成第三行对象
  - `handleDeleteRows([1])` 对现有第二行也无实际效果
- 结论：
  - 这张页当前 runtime 下，根容器的“行级增删 API”不能作为可靠布局编辑入口
  - 后续不要在这张页上继续拿 `addRow / setRowsNumber / handleDeleteRows` 当主方案

### 2. 列级新增/删除：通过已有隐藏槽位显隐是可行的

- 当前第一行本来就有隐藏槽位：
  - `RCol13 / RCol14 / RCol9 / RCol2 / RCol8 / RCol3`
- 已测试“增”：
  - 把 `RCol13` 从隐藏列改为可见列：
    - `width = 240`
    - `visible = true`
  - 同时把 `RCol11` 改为 `1260`，保留 `RCol12 = 405`
- runtime 结果：
  - `RCol13` 由 `{width: 0, visible: false}` 变为 `{width: 240, visible: true}`
- 已测试“删”：
  - 再把 `RCol13` 隐回去：
    - `width = 0`
    - `visible = false`
  - `RCol11` 恢复为 `1500`
- runtime 结果：
  - `RCol13` 由 `{width: 240, visible: true}` 变回 `{width: 0, visible: false}`
- 结论：
  - 对当前页来说，最可靠的“增删布局”不是动态造新行，而是复用现有隐藏列槽位做显隐切换
  - 这在管理软件类页面上是可用策略：预埋若干 `RCol`，按模式切换显示

### 3. 属性修改：可持久化

- 已验证可修改并成功提交持久化：
  - `RContainer1.backgroundColor`
  - `RContainer1.borderWidth`
  - `RContainer1.borderColor`
  - `RContainer1.isShowBorder`
- 提交提示：
  - `生成历史版本成功！`
- 重开后仍保留
- 结论：
  - “改”这条已经是可靠链路

### 4. 提交边界

- 对“列显隐新增”这次尝试，`版本提交` 弹窗在当前 browser-harness 会话里再次出现 0 矩形 DOM 问题：
  - 输入框值可通过 DOM 改写
  - `确定` 主按钮可定位到 DOM，但点击不生效
- 因此当前只能确认：
  - 列级增删在 runtime 有效
  - 但这一次未完成独立的冷重开持久化验收
- 后续建议：
  - 把“增删列”放到一个更干净的新编辑器会话里单独提交流程验证
  - 或优先走可见鼠标链路点提交主按钮

## 2026-06-18 查询列表布局唯一权威与命名/美化验证

- 页面：
  - `建模系统客户端_0518 -> 盛云_孙宇飞_前端_查询Demo_0618 -> 页面精灵图 -> 查询列表`
- 本轮目标：
  - 把今天验证过的布局方式收束成唯一权威 skill
  - 在当前页继续只动布局，不放组件
  - 给布局对象补命名，并做一版更像管理软件的骨架美化

### 1. 唯一有效布局 skill

- 已把 `wos4-layout-devtools-skill` 定为项目唯一有效的布局 skill。
- `wos4-config-client-screen-create` 和 `wos4-demo-page-fullstack-skill` 不再维护独立布局规则，只能引用 `wos4-layout-devtools-skill`。
- 当前布局真相源明确为：
  - `RContainer1.data.rowsManager`
  - 子布局则是对应 `RContainer.data.rowsManager`

### 2. 命名验证

- 已在当前页成功命名并提交保存：
  - `RootShell`
  - `HeaderBarRow`
  - `PageTitleCol`
  - `FilterInputCol`
  - `PrimaryActionCol`
  - `UtilitySpacerCol`
  - `BodyCanvasRow`
  - `BodyCanvasCol`
  - `MainDashboardContainer`
  - `DataGridRow`
  - `DataGridCol`
  - `TrendChartRow`
  - `TrendChartCol`
- 还补命名了预留隐藏列：
  - `ReservedColA` ~ `ReservedColF`
- 结论：
  - 布局对象命名可以通过 runtime 直接改写并进入正式提交链路
  - 后续 AI 应优先依赖命名对象，不依赖 `RCol15` 这类易漂移 key

### 3. 美化验证

- 已提交一轮命名和顶层美化：
  - 提交说明：`beautylayout0618`
  - 成功提示：
    - `保存成功`
    - `生成历史版本成功！`
- 已提交一轮主内容区高度微调：
  - 提交说明：`beautylayoutheight0618`
  - 成功提示：
    - `保存成功`
    - `生成历史版本成功！`
- 当前保留的更规整骨架：
  - 顶栏最初做过一版像素宽度美化，随后按用户要求改回百分比布局
  - 内容区：
    - `DataGridRow.height = 600`
    - `TrendChartRow.height = 340`
    - `DataGridCol.colHeight = 598`
    - `TrendChartCol.colHeight = 338`

### 4. 百分比布局修正

- 用户要求：
  - 布局说明必须明确使用百分比布局
  - 子布局进入后要按新的 `100%` 重新起算
- 已执行修正并提交：
  - 提交说明：`percentlayout0618`
  - 成功提示：
    - `保存成功`
    - `生成历史版本成功！`
- 当前提交后的宽度策略：
  - 顶栏：
    - `PageTitleCol = 16%`
    - `FilterInputCol = 58%`
    - `PrimaryActionCol = 10%`
    - `UtilitySpacerCol = 16%`
  - 主内容承载列：
    - `BodyCanvasCol = 100%`
  - 子布局内部：
    - `DataGridCol = percentage / lgWidth=100`
    - `TrendChartCol = percentage / lgWidth=100`
- 结论：
  - 当前页已按“父布局百分比 + 子布局重新从 100% 起算”的规则落地
  - 该规则已同步写入 `wos4-layout-devtools-skill` 和 `AGENTS.md`

### 4.1 百分比判断口径修正

- 本轮进一步确认：
  - 先前把 `xlWidth` 当成“百分比字段”来理解是错的。
  - 在 `colStrategy = percentage` 下，判断一行是否会换行，应看逻辑宽度字段，例如 `lgWidth` 的总和是否超过 `100`。
  - `xlWidth` 更接近编辑器运行时折算后的实际宽度，不应该拿来判断“是否超 100”。 
- 重新修正并提交：
  - 提交说明：`wrapfix0618`
  - 成功提示：
    - `保存成功`
    - `生成历史版本成功！`
- 提交后实测：
  - 顶栏 `HeaderBarRow.sumLG = 100`
  - 子布局 `DataGridRow.sumLG = 100`
  - 子布局 `TrendChartRow.sumLG = 100`
  - 对应 `xlWidth` 为运行时折算宽度：
    - `PageTitleCol.xlWidth = 287`
    - `FilterInputCol.xlWidth = 1149`
    - `PrimaryActionCol.xlWidth = 172`
    - `UtilitySpacerCol.xlWidth = 268`
    - `DataGridCol.xlWidth = 1908`
    - `TrendChartCol.xlWidth = 1908`
- 视觉结果：
  - 先前截图里的左侧细条/错位现象已消失
  - 当前画布回到正常的“顶栏一行 + 主内容整块 + 下部趋势区”骨架

### 5. 证据

- before：
  - `D:\DEV_D\WOS4.5\wos4-artifacts\backups\query_demo_restore_0618\before_beautify_state_0618.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\backups\query_demo_restore_0618\before_beautify_state_0618.png`
- 提交后：
  - `D:\DEV_D\WOS4.5\wos4-artifacts\backups\query_demo_restore_0618\after_beautify_submit_0618.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\backups\query_demo_restore_0618\after_beautify_submit_0618.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\backups\query_demo_restore_0618\after_beautify_height_submit_0618.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\backups\query_demo_restore_0618\after_beautify_height_submit_0618.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\backups\query_demo_restore_0618\after_percent_layout_submit_0618.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\backups\query_demo_restore_0618\after_percent_layout_submit_0618.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\backups\query_demo_restore_0618\after_wrap_fix_submit_0618.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\backups\query_demo_restore_0618\after_wrap_fix_submit_0618.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\wrap_runtime_fix_probe_0618.png`

### 6. 当前结论

- 当前页已经证明：
  - 布局可以代码化命名
  - 布局可以代码化美化
  - `rowsManager` 路径比根容器增删行 API 更可靠
  - 列宽应优先走百分比
  - 子布局内部的百分比要重新从子容器 `100%` 起算
  - 百分比布局是否换行，要看同行可见列的逻辑宽度和，例如 `sumLG <= 100`
  - 先布局、命名、保存，再组件，是当前最稳的开发顺序

## 2026-06-18 查询列表组件阶段第一轮

- 页面：
  - `盛云_孙宇飞_前端_查询Demo_0618 -> 查询列表`
- 目标：
  - 在已稳定布局上开始进入组件阶段
  - 不做变量和联动，只证明组件能进入命名槽位并提交保存

### 1. 组件面板整理

- 已抓取当前编辑器组件面板并保存：
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\frontend_component_palette_0618.json`
- 已整理成人类可读索引：
  - `D:\DEV_D\WOS4.5\wos4-artifacts\reports\frontend_component_palette_0618.md`
- 当前主要可用大类：
  - 布局类：布局 / 分栏*1 / 分栏*2 / 分栏*4
  - UI 类：按钮 / 输入框 / 表格 / 树 / 文本 / 选择器 等
  - 图表类：折线图 / 趋势曲线 / 柱状图 / 饼图 / 仪表盘 / 雷达图 / 气泡图 / 漏斗图 / 甘特图 等

### 2. 命名槽位到真实 RCol 的映射

- 本轮确认命名槽位需要通过 `rowsManager -> KSGUID` 回映射到真实 `kids.RCol*` 实例：
  - `FilterInputCol -> RCol16`
  - `PrimaryActionCol -> RCol18`
  - `DataGridCol -> RCol20`
  - `TrendChartCol -> RCol21`
- 原因：
  - `rowsManager` 里的列对象是数据层
  - 真实带 `addChild / setObject / getObject` 方法的是 `kids.RCol*` 实例层

### 3. 组件插入结果

- 第一轮尝试中，历史图表 id 误用为中文原文，ASCII 临时脚本把中文打成 `????`，导致：
  - 表格 toolkit 未命中
  - 输入框和按钮中文文案变成 `??`
- 修正后：
  - 表格 toolkit 用 `id = table, prototypeName = ElementTable`
  - 中文文案和 detailConfig 统一改为 Unicode 转义

最终已成功插入并提交：

- `demo_filter_input` -> `ElementInput`
- `demo_query_button` -> `ElementButton`
- `demo_table` -> `ElementTable`
- `demo_chart` -> `ElementChart`

提交说明：

- `components0618`

成功提示：

- `保存成功`
- `生成历史版本成功！`

### 4. 当前画面效果

- 输入框、按钮、表格、折线图都已进入目标槽位
- 截图中可见：
  - 顶栏右侧已有按钮
  - 中部表格区域已有 `demo_table`
  - 底部趋势图区域已有 `demo_chart`
- 当前表格在编辑器里仍显示 `empty`，说明下一轮要继续补最终数据/样式验证，不能把“组件已进入槽位”直接等同于“最终效果完成”

### 5. 证据

- 组件清单：
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\frontend_component_palette_0618.json`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\reports\frontend_component_palette_0618.md`
- 组件插入：
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\component_add_probe_0618.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\component_add_submit_0618.png`
  - `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\frontend_components_submit_0618.json`

### 6. 下一步

- 重开编辑页，确认四个组件持久化
- 补按钮文本和输入框样式
- 校验表格 detailConfig 是否在重开后仍在
- 再进入变量和按钮联动阶段

## 2026-06-18 查询列表样式美化验证

目标页面：

- `建模系统客户端_0518 -> 盛云_孙宇飞_前端_查询Demo_0618 -> 查询列表`

本轮动作：

- 对 `demo_filter_input`、`demo_query_button`、`demo_table`、`demo_chart` 统一补做样式美化。
- 输入框、按钮、表格使用 `propData.styleConfig` 持久化 CSS。
- 图表同时更新 `propData.detailConfig` 的 ECharts option，并增强 `styleOption` 边框、圆角、阴影。
- 再次点击 `提交` 时，系统出现过 `版本提交` 弹窗；本轮稳定抓到的快提示是 `保存成功`。
- 通过预览按钮 hook 抓到实际预览链接，再进入预览页做 DOM 和 computed style 验证。

编辑器持久化结果：

- `demo_filter_input`
  - `placeholder = 请输入名称或关键字`
  - `clearable = true`
  - `styleConfig` 已写入
- `demo_query_button`
  - 文案已改为 `查询`
  - `detailConfig = this.button({ text: '\\u67e5\\u8be2' })`
  - `styleConfig` 已写入
- `demo_table`
  - `styleConfig` 已写入，白底、浅灰边框、8px 圆角、蓝灰表头
- `demo_chart`
  - `detailConfig` 已改为美化后的柱状图 option
  - `styleOption.borderRadius = 8`
  - `styleOption.borderWidth = 1`
  - `styleOption.shadow.enable = true`

预览验证结果：

- 输入框：
  - `placeholder = 请输入名称或关键字`
  - `backgroundColor = rgb(248, 250, 252)`
  - `borderTopColor = rgb(203, 213, 225)`
  - `borderRadius = 6px`
- 按钮：
  - 文案 `查询`
  - `backgroundColor = rgb(37, 99, 235)`
  - `color = rgb(255, 255, 255)`
  - `borderRadius = 6px`
  - `boxShadow = rgba(37, 99, 235, 0.18) 0px 8px 18px 0px`
- 表格：
  - 根节点 `backgroundColor = rgb(255, 255, 255)`
  - `borderTopColor = rgb(219, 228, 240)`
  - `borderRadius = 8px`
  - 预览中表头仍显示 `label2 / label3 / label4 / 操作`
- 图表：
  - 预览页存在 `1` 个 canvas
  - canvas 高度约 `338`

结论：

- 本轮“样式美化 -> 保存 -> 预览生效”链路已验证通过。
- 目前能确认保存成功和预览生效；本轮未稳定抓到 `生成历史版本成功！`，因此版本提交成功证据要在下一轮单独补齐。

证据：

- `D:\DEV_D\WOS4.5\wos4-artifacts\backups\query_demo_style_0618\before.json`
- `D:\DEV_D\WOS4.5\wos4-artifacts\backups\query_demo_style_0618\after.json`
- `D:\DEV_D\WOS4.5\wos4-artifacts\backups\query_demo_style_0618\verify.json`
- `D:\DEV_D\WOS4.5\wos4-artifacts\backups\query_demo_style_0618\before_editor.png`
- `D:\DEV_D\WOS4.5\wos4-artifacts\backups\query_demo_style_0618\after_runtime_editor.png`
- `D:\DEV_D\WOS4.5\wos4-artifacts\backups\query_demo_style_0618\after_submit_editor.png`
- `D:\DEV_D\WOS4.5\wos4-artifacts\backups\query_demo_style_0618\preview_dialog_probe.png`
- `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\wos4_style_preview_verify_0618.png`

## 2026-06-18 查询列表变量与脚本验证

目标页面：

- `建模系统客户端_0518 -> 盛云_孙宇飞_前端_查询Demo_0618 -> 查询列表`

本轮目标：

- 确认当前页能否通过代码看到页面变量类型。
- 按用户建议验证“`Number` 触发变量 `++` + `String` 参数变量承载 JSON”的脚本复用模式。
- 区分“编辑器运行时已生效”和“提交后预览已持久化”的差异。

已验证编辑器侧事实：

- 页面变量可代码读取到类型和值：
  - `人工添加`
    - `varType = 2`
    - 类型可判定为 `String`
    - 初始 `defaultValue/value = test`
  - `加加变量`
    - `varType = 1`
    - 类型可判定为 `Number`
    - 初始 `defaultValue/value = 0`
- 页面脚本入口可读到：
  - 创建时脚本：`linkId = 0`
  - 变量改变脚本：`linkId = 1001`，绑定变量 `加加变量`
  - 按钮点击脚本：`demo_query_button.propData.linkList[0]`，`linkId = 200001`
- 编辑器右侧“连接”面板能看到：
  - `创建时 -> script text`
  - `变量改变 -> 加加变量 -> script text`
  - 说明本轮脚本入口已挂到页面模型上，证据见 `after_runtime_editor.png`

本轮脚本模式：

- 页面打开时：`加加变量++`
- 按钮点击时：`加加变量++`
- `加加变量` 的变量改变脚本统一执行：
  - 解析 `人工添加` 中的假数据 JSON
  - 读取输入框关键字
  - 刷新 `demo_table`
  - 刷新 `demo_chart`
  - 更新按钮文案

运行结果：

- 预览态已能看到按钮脚本文案变化：
  - 旧态：`查询全部(0)`
  - 新态：`查询结果(0)`
- 这说明按钮点击脚本与变量改变脚本链路本身是能触发的。
- 但当前预览仍显示 `暂无匹配数据`，说明 `人工添加` 的新 JSON 默认值尚未稳定进入预览运行态。

结论：

- “变量类型可见”这一步已验证通过。
- “`Number` 触发变量 ++` + `String` 参数变量`”这套复用模式在当前页是成立的，至少运行时触发链路已通。
- 当前真正阻塞点不是脚本语法，而是：
  - 提交/版本链没有把 `人工添加` 的新默认值稳定带到预览；
  - 同时建模客户端里残留 `后台_班次管理` 子页，关闭确认弹窗未稳定消失，导致重新进入前端编辑器和补版本提交证据受阻。

证据：

- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\variable_script_probe_0618.json`
- `D:\DEV_D\WOS4.5\wos4-artifacts\backups\query_demo_increment_flow_0618\after_runtime_editor.png`
- `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\wos4_increment_preview_verify_0618.png`
- `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\latest_user_added_probe_0618.png`
- `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\after_real_click_confirm_0618.png`
- `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\probe_modeling_doc_0618.png`

## 2026-06-18 前后端联通阻塞点复核

本轮目标：

- 不再泛泛重试，直接确认当前还可操作的两条链路分别卡在哪里。
- 判断是后端函数问题、前端脚本问题，还是运行时上下文问题。

链路 A：`盛云_孙宇飞_前端Demo_0617 -> 盛云_孙宇飞_客户端Demo_0617`

- 通过现有主桌面已登录会话重新进入 `数字孪生可视化 -> 盛云_孙宇飞_客户端Demo_0617`。
- 客户端列表页仍能看到 `预览链接`，当前 `clientGuid = 8948ba22-1cc0-40bf-864d-ab368c7f0735`。
- 进入客户端下一级后，不再出现旧快照里的 `根组 / 盛云_孙宇飞_画面Demo_0617`，而是稳定停在：
  - `画面分组 -> 暂无数据`
  - `画面列表 -> empty`
  - 页面尾部提示 `查询分组结构失败`
- 对该页额外等待 8 秒后仍不恢复，`document.readyState = complete`，说明这不是单纯的慢加载占位，而是当前客户端链路真实返回了空分组/查询失败。

链路 B：`建模系统客户端_0518 -> 盛云_孙宇飞_前端_查询Demo_0618 -> 查询列表`

- 当前可运行的 debugger 预览页是 `查询列表`，其 `guidVersion.id = 1441151880758559659`，`guid = 3ec744e3-46be-4bee-aaf8-959cbccfe378`。
- 运行时 `pageInfo` 已反复确认：
  - `name = 查询列表`
  - `spaceTime.id = ""`
  - `spaceTime.guid = ""`
  - `spaceTime.name = ""`
- 直接在预览页 runtime 中调用 `page.Query(...)` 反查时空对象或后端 App 对象时，请求能真实发出，但统一返回：
  - `ret = -180985`
  - `errorcodes = [-180985]`
- 对照错误码手册，`-180985 = 当前用户没有权限访问云`。这说明在当前这张 debugger 页里，`Query` 路径并没有拿到可用的运行上下文；它不是前端 JS 语法错，而是运行态上下文不成立。
- 同一页里 `Call()` 仍表现为另一类问题：
  - 当按对象名调用 `盛云_孙宇飞_QueryDemo_0617.QueryDemoData` 时，历史已验证返回过 `-210133 = 目标App不存在`；
  - 当前再做异步探针时又表现为 `-220006 = 超时`。
- 两种现象可以统一解释为：当前页并不处在一个稳定、可见后端 App 的有效时空运行上下文中。

额外阻塞：

- 建模客户端仍残留 `后台_班次管理` 子页。
- 点 `退出` 后会弹出 `请确认内容已保存，点击确定后将关闭页面?`。
- 本轮无论 DOM click 还是真实坐标 click，`确定` 都未能稳定关闭该残留子页，导致无法干净回到模型列表再进入 `查询列表` 编辑器补“时空配置”。

本轮收束结论：

- 旧 `前端Demo_0617` 客户端链当前的直接阻塞点是 `查询分组结构失败`，不是按钮脚本。
- 当前可运行的 `查询列表` debugger 链当前的直接阻塞点是 `pageInfo.spaceTime` 为空，导致前端 `Call/Query` 都拿不到稳定的 App 运行上下文。
- 下一步优先级已经明确：
  1. 先人工清掉建模客户端里残留的 `后台_班次管理` 退出确认框，恢复可稳定进入 `查询列表` 编辑器；
  2. 再检查并补 `查询列表` 页本身的 `时空配置`，使其不再是空 `spaceTime`；
  3. 补完后重新预览，优先验证 `pageInfo.spaceTime` 是否变为非空，再验证 `Call(QueryDemoData)`。

证据：

- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\personal_client_preview_probe_0618.json`
- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\personal_client_screen_list_structured_0618.json`
- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\backend_call_current_state_probe.json`
- `D:\DEV_D\WOS4.5\wos4-artifacts\backups\query_demo_style_0618\verify.json`

## 2026-06-18 用户补充的组态实例化与部署经验

来源：

- 用户口述真实可跑通经验，当前记为“用户已验证、AI 待复核”。

用户提供的关键顺序：

1. `组态系统客户端0518`
2. 新建工程（示例名：`人工孙宇飞`）
3. 进入工程
4. 左侧 `管控树实例配置`
5. 时空列表加号创建 `手工层级1`
6. 选中 `手工层级1` 再加号创建 `手工层级2`
7. 选中 `手工层级2`
8. 右侧 `实例列表 -> 新建 -> 管控单元实例`
9. 在实例弹窗里选 `根组 -> 盛云_孙宇飞_根组`
10. 右侧选择对应前端/后台/框架模型
11. 填 `名称 / 显示名称 / 描述`
12. 确认后，把需要的实例都补齐
13. 关键：点击实例配置页里加减按钮旁边的 `提交`
14. 左侧切到 `数字孪生可视化`
15. 客户端行不要点 `编辑`，改为双击行进入
16. 左侧分组树创建 `手工分组1 / 手工分组2`
17. 选中 `手工分组2`
18. 右侧不用 `新建`，改点 `添加`
19. 从 `根组 -> 盛云_孙宇飞_根组` 中选择前端页面对象
20. 勾选 `精灵图名称` 后才能确定
21. 在画面列表里把目标页设为唯一 `首页`
22. 回桌面进入 `运维部署客户端_0518`
23. 在 `管控单元` 和 `数字孪生画面` 两部分按父到子顺序 `部署 -> 启动`

用户提供的故障判断：

- `数字孪生可视化 -> 添加` 报错时，优先怀疑：
  - 时空实例配置没有提交
  - 对应管控单元实例没有配全
- 最终即使上述步骤都能跑通，也仍可能出现“客户端最后没真正发布出来”的残余问题，因此最后卡点很可能已不是单一页面脚本问题。

当前处理结论：

- 这条经验已经显著修正了我们此前对“时空列表为空”和“客户端首页/引用配置”的排查顺序。
- 下一轮 AI 复现时，应先按这条链跑一遍，再判断：
  1. 实例配置是否真正落库
  2. `数字孪生可视化` 的 `添加` 是否引用了正确页面对象
  3. 首页是否唯一
  4. 运维部署是否需要两个维度都从父到子处理
- 在 AI 自己完成一轮复现前，这一段不能写成“已验证 skill”，只能作为高优先级经验路线。

## 2026-06-18 Noctiluca 前端画面时空配置入口验证

- 入口不是旧建模页属性面板，而是当前组态客户端里的前端页参数配置弹窗：
  - `组态系统客户端0518 -> 盛云_孙宇飞_Noctiluca -> 数字孪生可视化`
  - 双击客户端 `盛云_孙宇飞_Noctiluca_客户端`
  - 双击画面行 `查询列表`
  - 出现全屏 `编辑器` 弹窗，内部标题为 `参数配置`
- 实测初始状态：
  - 顶部显示 `当前时空：未配置时空`
  - 顶部存在 `配置`、`预览`
- 画面时空选择器的实测有效路径：
  1. 点击顶部 `配置`
  2. 打开 `画面_时空选择器`
  3. 左树先点中 `Eidolon手工层级1` 的 `.el-tree-node__content`，不是只点 label 文本；这样会展开出 `Eidolon手工层级2`
  4. 再点中 `Eidolon手工层级2`
  5. 右侧实例树出现：
     - `Eidolon前端查询实例`
     - `Eidolon前端框架实例`
     - `Eidolon后台查询实例`
     - `Eidolon后台查询实例B`
  6. 真实点击右侧实例 `Eidolon前端查询实例`
  7. 真实点击选择器 `确定`
- 生效结果：
  - 顶部文本从 `当前时空：未配置时空` 变为 `当前时空：Eidolon手工层级2`
  - 关闭 `编辑器` 再双击 `查询列表` 重进后，顶部仍为 `当前时空：Eidolon手工层级2`
  - 说明该绑定至少在当前客户端配置会话里已持久化
- 额外现象：
  - 这个 `编辑器` 不是整页跳转，而是叠在 `画面列表` 上的全屏弹窗；“退出重进”应理解为关闭该弹窗后重新双击画面行
  - DOM click 触发选择器 `确定` 不稳定，改为真实坐标点击后才成功落库
  - 当前页自己的 `预览` 会打开 `mode=debugger` 且 `isParamConfig=true` 的运行标签；该预览页只有 `ElementButton / empty / 共 0 条`，`GetPageInfo`、`GetPageMngInfo`、`CLIENTRUNINSTANCE._data.spaceTime` 仍取不到有效运行时信息，因此它不能替代正式客户端预览验收
- 证据：
  - `wos4-artifacts/screenshots/noctiluca_frontend_spacetime_bound_0618.png`
  - `wos4-artifacts/screenshots/noctiluca_preview_after_spacetime_bind_0618.png`

## 2026-06-19 Noctiluca 管控单元实例层级补齐与提交

- 目标：
  - 修复 `盛云_孙宇飞_Noctiluca -> 管控单元实例配置` 中“第一层没有内容，后续部署会卡住”的问题。
- 初始状态：
  - `时空列表` 为：
    - `KF4.5Root`
    - `Eidolon手工层级1`
    - `Eidolon手工层级2`
  - 右侧 `实例列表` 初始读取为空。
- 本轮实做结构：
  - `Eidolon手工层级1`
    - `Eidolon后台查询实例B`
      - 模型：`盛云_孙宇飞_后台_查询Demo_0618`
      - 版本：`v3`
  - `Eidolon手工层级2`
    - `Eidolon后台查询实例`
      - 模型：`盛云_孙宇飞_后台_查询Demo_0618`
      - 版本：`v3`
    - `Eidolon前端查询实例`
      - 模型：`盛云_孙宇飞_前端_查询Demo_0618`
      - 版本：`v2`
    - `Eidolon前端框架实例`
      - 模型：`盛云_孙宇飞_前端_框架_0618`
      - 版本：`v2`
- 新建路径已验证：
  1. 选中 `时空列表` 对应层级。
  2. 右侧 `实例列表 -> 新建`。
  3. 在 `实例类型` 中选 `管控单元实例`。
  4. 在 `新建管控单元实例` 中：
     - 填 `名称 / 显示名称 / 描述`
     - 左树选 `盛云_孙宇飞_根组`
     - 右表选目标模型
     - 点 `确定`
- 本轮已抓到成功提示：
  - `创建中...`
  - `创建成功`
- 本轮还验证了实例配置提交入口：
  - 位置：`时空列表` 标题右侧小图标工具栏，位于加号、删除旁的第三个小图标。
  - 点击后会打开 `提交版本`。
  - 填写说明：`Noctiluca instance tree fill level1+level2 0619`
  - 确认后出现 `时空仓库版本提交进度`
- 已验证提交成功明细：
  - `Eidolon手工层级2` -> `100%` -> `提交成功`
  - `Eidolon前端查询实例` -> `100%` -> `提交成功`
  - `Eidolon前端框架实例` -> `100%` -> `提交成功`
  - `Eidolon后台查询实例` -> `100%` -> `提交成功`
  - `Eidolon后台查询实例B` -> `100%` -> `提交成功`
- 当前结论：
- “第一层不能为空”这一点在 `Noctiluca` 上已经被 AI 实做修复。
- 现在 `Noctiluca` 的实例树已经回到可供后续 `数字孪生可视化` / 部署链继续验证的状态。

## 2026-06-19 Noctiluca 运维部署侧反证

- 路径：
  - `运维部署客户端_0518 -> 盛云_孙宇飞_Noctiluca -> 管控单元实例`
- 先前“实例树已补齐”之后，继续验证部署链，结果如下。

### 运维部署侧看到的结构

- 可见行仍然是：
  - `Eidolon手工层级1 -> 版本: 无 -> 未部署 -> 未启动`
  - `Eidolon手工层级2 -> 版本: 无 -> 未部署 -> 未启动`
- 运行时 `生产单元实例表格` 的 `expandsRow` 仍只包含两层树：
  - `Eidolon手工层级1`
  - `Eidolon手工层级2`
- 不包含右侧实例表中的 4 个叶子实例。

### 部署实测

- 对 `Eidolon手工层级1` 点击 `部署`
- 弹出 `数据区选择_页面`
- 选择 `area0`
- 点击 `确定`
- 快速提示为：
  - `部署失败！`

### 回到组态工程复核

- 返回 `组态系统客户端0518 -> 盛云_孙宇飞_Noctiluca -> 管控单元实例配置`
- 重新展开树后确认：
  - `KF4.5Root -> Eidolon手工层级1 -> Eidolon手工层级2`
- 右侧实例表确认存在：
  - `Eidolon后台查询实例`
  - `Eidolon后台查询实例B`
  - `Eidolon前端查询实例`
  - `Eidolon前端框架实例`
- 再次点击小工具条 `提交版本`
- 进度表仍只出现：
  - `Eidolon手工层级2`
  - `Eidolon前端查询实例`
  - `Eidolon前端框架实例`
  - `Eidolon后台查询实例`
  - `Eidolon后台查询实例B`
- **没有**出现 `Eidolon手工层级1`

### 对比参考工程

- 在同一个 `运维部署客户端_0518` 中，切到 `盛云_孙宇飞_人工测试工程`
- 可见行是：
  - `手工层级1 -> 版本: 3 -> 已部署 -> 已启动`
  - `手工层级2 -> 版本: 3 -> 已部署 -> 已启动`

### 当前结论

- `Noctiluca` 的“树存在 + 右侧实例存在 + 小工具条提交成功”已经验证。
- 但这还不能推出“可部署”。
- 真正卡点是：
  - `Noctiluca` 在运维部署侧两层仍显示 `版本: 无`
  - `人工测试工程` 同类层级显示 `版本: 3`
- 后续要继续查的是：
  1. 为什么 `Eidolon手工层级1` 从未进入提交进度表
  2. 为什么右侧实例表存在，但运维部署侧只识别成 `版本: 无` 的层级树
  3. `人工测试工程` 的层级版本 `3` 是如何形成的
- 证据：
  - `wos4-artifacts/screenshots/noctiluca_instance_new_dialog_0619.png`
  - `wos4-artifacts/screenshots/noctiluca_instance_type_dialog_0619.png`
  - `wos4-artifacts/screenshots/noctiluca_create_instance_dialog_0619.png`

## 2026-06-19 Noctiluca 第一层实例类型纠偏

- 继续只读对照 `盛云_孙宇飞_人工测试工程 -> 管控单元实例配置` 与 `盛云_孙宇飞_Noctiluca -> 管控单元实例配置`。
- 关键对照结论：
  - 参考工程人工页在当前稳定读取下，`手工层级1` 可见的是前端框架实例：
    - `前端框架 -> 盛云_孙宇飞_前端_框架_0618`
  - `Noctiluca` 旧状态下，`Eidolon手工层级1` 没有真正形成自己的实例版本；此前能看到的旧 4 条实例运行时字段里：
    - `Eidolon后台查询实例`
    - `Eidolon后台查询实例B`
    - `Eidolon前端查询实例`
    - `Eidolon前端框架实例`
    都带 `parentrepoguid = 11bbeccb-5fa4-473f-a7cf-88e7b07c65ff`
    - 即都挂在 `Eidolon手工层级2`
- 本轮纠偏动作：
  1. 清除当前浏览器会话里残留的 `.el-dialog__wrapper / .v-modal / .el-message-box__wrapper`，避免旧提交进度和旧实例类型弹窗卡住新建流程。
  2. 在 `Eidolon手工层级1` 上重新执行：
     - `实例列表 -> 新建`
     - `选择实例类型`
     - 通过运行时把 `instanceType_ElementRadio` 从占位值 `Radio1` 修正为 `2 / 管控单元实例`
     - 进入 `新建管控单元实例`
     - 选择 `盛云_孙宇飞_根组 -> 盛云_孙宇飞_前端_框架_0618`
     - 填写：
       - `名称 = EidolonL1Frame`
       - `显示名称 = EidolonL1Frame`
       - `描述 = level1 frame instance`
  3. 已抓到提示：
     - `创建中...`
     - `创建成功`
- 新的第一层右表证据：
  - `EidolonL1Frame -> 盛云_孙宇飞_前端_框架_0618 -> v2`
- 更关键的是重新点击实例配置小工具条 `提交版本` 后，提交进度首次出现：
  - `Eidolon手工层级1 -> 100% -> 提交成功`
  - `Eidolon后台查询实例B -> 100% -> 提交成功`
  - `EidolonL1Frame -> 100% -> 提交成功`
- 这证明：
  - 先前“第一层看起来不空”不等于“第一层有自己的可提交实例版本”。
  - 至少在 AI 这条链里，给第一层补一个真正挂到 `Eidolon手工层级1` 的前端框架实例后，`层级1` 才第一次进入提交进度表。
- 当前剩余阻塞：
  - 切回 `运维部署客户端_0518 -> 盛云_孙宇飞_Noctiluca` 后，部署树仍显示：
    - `Eidolon手工层级1 -> 版本: 无`
    - `Eidolon手工层级2 -> 版本: 无`
  - 因此当前判断更新为：
    - “第一层补成前端框架实例”是必要条件，已验证；
    - 但还不是充分条件。
  - 下一步要继续收敛 `Eidolon手工层级2` 中多余实例分配，尤其是与参考工程不一致的：
    - 额外后端实例
    - 额外前端框架实例
  - `wos4-artifacts/screenshots/noctiluca_after_create_level1_0619.png`
  - `wos4-artifacts/screenshots/noctiluca_all_instances_before_submit_0619.png`

## 2026-06-19 Noctiluca 实例树收敛后部署启动复测

- 在 `组态系统客户端0518 -> 盛云_孙宇飞_Noctiluca -> 管控单元实例配置` 继续按参考工程收敛实例分配：
  - `Eidolon手工层级1`
    - 仅保留 `EidolonL1Frame -> 盛云_孙宇飞_前端_框架_0618(v2)`
  - `Eidolon手工层级2`
    - 保留 `Eidolon后台查询实例 -> 盛云_孙宇飞_后台_查询Demo_0618(v3)`
    - 保留 `Eidolon前端查询实例 -> 盛云_孙宇飞_前端_查询Demo_0618(v2)`
  - 删除：
    - `Eidolon后台查询实例B`（一级旧后端）
    - `Eidolon后台查询实例B`（二级多余后端）
    - `Eidolon前端框架实例`（二级多余前端框架）
- 删除链路验证：
  - 行内 `删除` 会弹出 `数字孪生实例化_实例_删除`
  - 继续会出现 `数据实例化_KIO变量删除页面`
  - 最终捕获到 `删除成功`
- 重新提交版本时，必须分别提交层级2和层级1：
  - 选中 `Eidolon手工层级2` 后点击实例配置小工具条 `提交版本`
  - 进度页出现：
    - `Eidolon手工层级2 -> 100% -> 提交成功`
    - `Eidolon前端查询实例 -> 100% -> 提交成功`
    - `Eidolon后台查询实例 -> 100% -> 提交成功`
  - 清理当前会话残留子页后，选中 `Eidolon手工层级1` 再点同一个 `提交版本`
  - 进度页出现：
    - `Eidolon手工层级1 -> 100% -> 提交成功`
    - `EidolonL1Frame -> 100% -> 提交成功`
- 补充约束：
  - 选中 `KF4.5Root` 点击同一提交按钮时，平台直接提示 `实例根仓库不允许提交`
  - 因此根层不是正确的提交目标；必须按真实层级分别提交
- `运维部署客户端_0518` 侧的新验证：
  - 在 `管控单元实例` 中，刚提交完时列表仍可能显示旧状态
  - 必须切到别的工程再切回 `盛云_孙宇飞_Noctiluca` 才会刷新
  - 刷新后确认：
    - `Eidolon手工层级1 -> 版本: 2 -> 已部署 -> 未启动`
  - 对 `Eidolon手工层级1` 执行 `部署 -> area0 -> 确定` 时，进度页显示 `100% / 成功`
  - 部署完成后再次切到别的工程再切回，列表才从旧状态刷新为：
    - `Eidolon手工层级1 -> 版本: 2 -> 已部署 -> 未启动`
  - 对同一节点执行 `启动` 后，列表同样需要切换工程再切回刷新，最终变为：
    - `Eidolon手工层级1 -> 版本: 2 -> 已部署 -> 已启动`
- 这说明当前真实可复用规则是：
  1. 每个层级必须有自己的内容
  2. 层级2和层级1要分别提交版本
  3. 根层不能提交
  4. 运维部署客户端的状态刷新不及时，需要切工程再切回才能看到最终状态
- 同轮检查 `运维部署客户端_0518 -> 数字孪生可视化`：
  - `盛云_孙宇飞_Noctiluca_客户端 -> 版本: 2 -> 已部署 -> 未启动`
  - 点击 `启动` 后弹出 `启动进度`
  - 进度页最终显示 `100% / 失败`
  - 但切到别的工程再切回 `盛云_孙宇飞_Noctiluca` 并重新打开 `数字孪生可视化` 后，唯一表格行又显示为：
    - `客户端1 -> 版本: 1 -> 已部署 -> 已启动`
  - 同时页面 body 里仍残留上一轮 `启动进度 -> 100% -> 失败`
  - 因此当前可视化发布链出现了明显 UI 不一致：
    - 行状态显示已启动
    - 残留进度弹层文本显示失败
    - 行名称从先前读取的 `盛云_孙宇飞_Noctiluca_客户端` 回退成 `客户端1`
  - 这部分在继续复用前必须再次确认“显示名变化”和“失败进度残留”是否只是前端缓存问题，当前不把它当成稳定的最终成功证据

## 2026-06-19 Noctiluca 蓝色客户端对象创建验证

- 继续在 `时空对象管理平台` 只针对 `盛云_孙宇飞` 个人对象验证“蓝色客户端”创建路径。
- 先前已经确认：
  - `Eidolon手工层级1` 必须有真实内容，否则部署链不成立。
  - `运维部署客户端_0518` 中 `数字孪生可视化` 会在 `盛云_孙宇飞_Noctiluca_客户端` 与 `客户端1` 之间出现显示名不一致。
- 本轮在 `时空对象管理平台` 左树读到 4 个关键顶层节点：
  - `手工层级1`
  - `客户端1`
  - `盛云_孙宇飞_Noctiluca_客户端`
  - `Eidolon手工层级1`

### A. 直接从外显名 `盛云_孙宇飞_Noctiluca_客户端` 创建会失败

- 路径：
  - 选中 `盛云_孙宇飞_Noctiluca_客户端`
  - 点击 `创建`
  - `应用模板 -> 选择`
- 模板选择器出现两条记录：
  - `部署配置对象创建_运行后台 / 元语言`
  - `盛云_孙宇飞_Noctiluca_客户端 / WebJS`
- 选择 `WebJS` 记录后，创建对话框默认名为：
  - `盛云_孙宇飞_Noctiluca_客户端_对象1`
- 点击 `确定` 后，顶部对象卡片区确实出现蓝色图标：
  - `盛云_孙宇飞_Noctiluca_客户端_对象1`
  - 图标资源：`js_func_unit_editor_light-DMRXO09p.1774322731382.png`
- 但同页同时出现错误：
  - `仓库不存在`
  - `失败：错误码 [654319619]，描述 [仓库不存在]`
- 且 `我创建的` 区域没有出现该对象的运行条目。
- 结论：
  - 直接按外显重命名节点 `盛云_孙宇飞_Noctiluca_客户端` 创建蓝色对象，不是稳定可复用路径。

### B. 从内部仓库节点 `客户端1` 创建 WebJS 对象成功

- 路径：
  - 选中 `客户端1`
  - 点击 `创建`
  - `应用模板 -> 选择`
- 模板选择器同样出现两条记录：
  - `部署配置对象创建_运行后台 / 元语言`
  - `客户端1 / WebJS`
- 这说明当前发布链里存在“显示名已改成 `Noctiluca_客户端`，但内部仓库仍是 `客户端1`”的双名结构。
- 在该上下文下选择 `客户端1 / WebJS`，把对象名改为：
  - `盛云_孙宇飞_Noctiluca_客户端_对象2`
- 创建对话框中的关键状态：
  - `应用类型 = 个人应用`
  - `应用模板 = 客户端1`
  - `默认账号/访问时空/应用分组` 都未额外配置
- 点击 `确定` 后，没有再出现 `仓库不存在` 错误。
- 创建成功后的可见证据：
  - 顶部对象卡片区出现蓝色图标：
    - `盛云_孙宇飞_Noctiluca_客户端_对象2`
    - 图标资源：`js_func_unit_editor_light-DMRXO09p.1774322731382.png`
  - `我创建的 -> 全部` 中出现唯一运行对象：
    - `盛云_孙宇飞_Noctiluca_客户端_对象2`
  - 运行态 DOM 类：
    - `data-item is-running`
  - 选中对象后工具条：
    - `停止 / 编辑 / 日志 / 视图` 可用
    - `启动` 禁用，符合“已在运行”状态

### C. `视图` 已触发真实运行壳

- 选中 `盛云_孙宇飞_Noctiluca_客户端_对象2` 后点击 `视图`。
- 顶层没有新标签页，但当前 `#/main` 页新增了隐藏运行壳 iframe：
  - `/public/?id=6192730962611143089&parentid=0&cloudid=107&areaid=0&username=...&bs=true`
- 继续递归读取 frame 树，确认内层实际加载了：
  - `GetFileContent/.../f5f8c456-e145-4d85-b1c3-dc3a17e7b512_105/index.html`
- 最内层运行内容不再是空壳，已能读到真实页面文本：
  - `ElementButton`
  - `empty`
  - `共 0 条`
  - `前往页`
  - 以及输入框/按钮样式 CSS
- 这说明：
  - `视图` 不是空点击
  - WebJS 蓝色对象已经能把运行页面装载到客户端壳中

### D. 当前结论

- 现在可以把 `Noctiluca` 的蓝色客户端对象创建链收敛为：
  1. 先保证 `Eidolon手工层级1` 有真实一级内容
  2. 在 `时空对象管理平台` 中，不要从外显改名节点 `盛云_孙宇飞_Noctiluca_客户端` 直接创建
  3. 应从内部仓库节点 `客户端1` 进入 `创建 -> 应用模板`
  4. 选择 `客户端1 / WebJS`
  5. 创建个人应用对象
  6. 在 `我创建的` 中验证其为 `is-running`
  7. 再用 `视图` 触发真实运行壳
- 这同时解释了此前的疑点：
  - 为什么运维部署页会在 `盛云_孙宇飞_Noctiluca_客户端` 和 `客户端1` 之间来回跳
  - 为什么从 `Noctiluca_客户端` 节点直建会报 `仓库不存在`
- 当前仍未验证的最后一项：
  - 纯桌面 `#/main` 的干净标签页在刷新后还没有自动出现 `盛云_孙宇飞_Noctiluca_客户端_对象2` 卡片
  - 所以“蓝色对象已创建并可运行”已验证，但“像 `lk_客户端01_对象1` 那样自动同步到纯桌面首页”暂未验证
- 证据补充：
  - `wos4-artifacts/snapshots/noctiluca_webjs_object_create_2026-06-19.json`
  - `wos4-artifacts/screenshots/noctiluca_webjs_object2_running_2026-06-19.png`

## 2026-06-19 用户补充：桌面可见、命名规则、原语言约束

- 用户补充确认：
  - 当前桌面已经出现蓝色客户端入口
  - 该入口能够被直接打开
- 这条证据说明“蓝色客户端已发布到可打开状态”在业务上已成立。
- 但对低级模型的自动化要求仍保持不变：
  - 在独立 clean session 里，没有回放证据前，最低 AI 验收入口仍写作：
    - `时空对象管理平台 -> 我创建的 -> 视图`

命名规则回收：

- 正式可见对象命名：
  - `盛云_孙宇飞_<业务语义>_<日期或版本>`
- 禁止在正式名里使用：
  - `codex`
  - `claudecode`
  - `copilot`
  - 其他明显产品名
- 临时工程/层级/实例代号允许使用少见英文意象词，但只用于 pilot：
  - `Eidolon`：偏“幽影/意象”
  - `Noctiluca`：偏“夜光体/夜光藻”，不是“萤火虫”
- 页面脚本、探针字段、运行态缓存统一改为中性前缀：
  - `__wos4...`
  - `demo_...`
  - `temp_...`

原语言 / 元语言补充约束：

- 不要假设后端逻辑支持链式调用；优先拆成中间变量和分步语句。
- 后端编辑器的 `调试配置` 可视为一个类似 VS Code 调试页的入口。
- 目前只确认该调试入口存在；未抓到断点 / 运行 / 变量观察证据前，不把调试流程写成已验证 skill。

## 2026-06-20 元语言 FU 语法恢复与版本 4 固化

- 目标：
  - 修复 `盛云_孙宇飞_元语言查询Demo_0617` 中 `QueryDemoData` 的语法损坏，恢复到可提交状态。
- 先确认当前真实状态：
  - 历史版本 3 `query-demo-data-backend-method-0617-single-return` 仍可通过 `历史版本 -> 查看` 打开，说明已提交基线未坏。
  - 当前工作区同时存在“历史版本 3 查看页”和“编辑态脏标签”两个同名标签，脏内容不应直接等同于历史版本页。
  - 重新关闭历史页、回到仓库列表后，再次从 `盛云_孙宇飞_仓库` 打开 `盛云_孙宇飞_元语言查询Demo_0617`，确认服务端保存态为：
    - `onCreate`：`Trace(2, "wos4-demo-oncreate-0617", "ok");`
    - `QueryDemoData`：仍是一行被损坏的长查询脚本
- 修复方法：
  - 直接使用 `textarea.inputarea.value` 观测当前编辑缓冲。
  - 发现该编辑器一次只暴露约 500 字的缓冲窗口，但 `Backspace` 删除会真实作用到模型内容。
  - 对 `QueryDemoData` 连续执行：
    - 聚焦 `textarea.inputarea`
    - 选中当前缓冲全部内容
    - `Backspace`
    - 重复直到缓冲变空
  - 缓冲清空后重新键入单行正确函数体：
    - `return "[{\"area\":\"A\",\"device\":\"Pump-01\",\"value\":12.3},{\"area\":\"B\",\"device\":\"Valve-02\",\"value\":45.6}]";`
  - 再次切回 `onCreate` 验证其内容未被带坏。
- 保存与提交验证：
  - 点击保存后，工作区标签未保存标记消失。
  - 点击 `提交` 打开 `版本提交`，最终抓到成功消息：
    - `提交成功`
  - 打开 `历史版本 -> 查看`，确认新增：
    - 提交时间：`2026-06-20 03:14:46`
    - 版本：`4`
    - 描述：`restore-querydemodata-single-return-0620`
- 结论：
  - 当前模型语法错误已恢复。
  - `onCreate` 与 `QueryDemoData` 现已回到可用的最小 smoke 基线。
  - 后续若继续做数据库读写调试，应从版本 4 继续，不再基于损坏查询草稿推进。
- 证据：
  - `wos4-artifacts/screenshots/bh_reopen_model_from_repo_0620.png`
  - `wos4-artifacts/screenshots/bh_chunk_delete_and_retype_query_0620.png`
  - `wos4-artifacts/screenshots/bh_verify_and_save_fixed_query_0620.png`
  - `wos4-artifacts/screenshots/bh_verify_new_history_row_0620.png`

## 2026-06-20 建模客户端后台查询 Demo：自定义计算持久化成功，业务事成员名未持久化

- 目标：
  - 参考 `lk测试 -> 后台_班次管理` 的后端模式，在个人模型 `盛云_孙宇飞_后台_查询Demo_0618` 上补出可编译的 CRUD skeleton。
- 参考拆解结论：
  - `lk测试 -> 后台_班次管理` 的核心结构是：
    - `业务事 -> 班次信息`
    - `自定义计算 -> 班次管理后台`
  - 参考 `班次管理后台` 的函数列表至少包括：
    - `declare`
    - `onCreate`
    - `onDestroy`
    - `onException`
    - `_TraceBusinessException`
    - `QueryClassData`
    - `AddClassData`
    - `UpdateClassData`
    - `DeleteClassData`

### 本轮在个人模型上完成的动作

- 模型：`盛云_孙宇飞_后台_查询Demo_0618`
- 自定义函数：`查询Demo后台_CUSTOMFUNC`
- 成功新增函数：
  - `_TraceBusinessException`
  - `QueryClassData`
  - `AddClassData`
  - `UpdateClassData`
  - `DeleteClassData`
- 成功重写：
  - `onCreate`
  - `onDestroy`
  - `onException`
  - `queryList`
- 保存/编译证据：
  - 抓到多次 `修改成功`
  - 抓到 `编译信息 / 编译成功 09:46:16`
  - `.tab-un-save` 全部回到 `display:none`
- 自定义函数版本提交：
  - 抓到 `提交成功`
- 父模型版本提交：
  - 首次因为页面精灵图式 `提交版本` 弹窗确认按钮没有真实点上，没有形成新版本
  - 改成“写入输入框 + 真实点击确定”后，抓到：
    - `提交版本中，请稍候......`
    - `提交版本成功！`
  - `版本管理` 最终回读出现新行：
    - 版本：`4`
    - 描述：`backend-querydemo-model-fields-and-customfunc-0620`
    - 时间：`2026-06-20 09:57:23`

### 当前已确认成功的部分

- `查询Demo后台_CUSTOMFUNC` 这条链已跑通：
  - 打开
  - 新建函数
  - 通过 `textarea.inputarea` 重写源码
  - 保存
  - 编译
  - 提交版本
- 父模型 `盛云_孙宇飞_后台_查询Demo_0618` 的历史版本已推进到 `4`

### 当前暴露出的关键失败点

- 重新打开 `盛云_孙宇飞_后台_查询Demo_0618` 后，`业务事 -> 查询信息` 的 5 个成员名没有保持为：
  - `站点`
  - `区域`
  - `状态`
  - `流量`
  - `压力`
- 实际回读结果又变成：
  - `成员1`
  - `成员2`
  - `成员3`
  - `成员4`
  - `成员5`
- 结论：
  - 当前只能确认“自定义计算持久化成功”
  - 不能确认“业务事成员名已持久化”
  - 后续要单独验证 `业务事` 内联表格改名的真正保存/更新动作

### 证据

- `wos4-artifacts/backups/backend_querydemo_0620_before.json`
- `wos4-artifacts/snapshots/backend_querydemo_save_compile_0620.json`
- `wos4-artifacts/snapshots/backend_querydemo_customfunc_submit_0620.json`
- `wos4-artifacts/snapshots/backend_querydemo_parent_submit_0620.json`
- `wos4-artifacts/snapshots/backend_querydemo_reopen_verify_0620.json`
- `wos4-artifacts/screenshots/backend_querydemo_saved_compiled_0620.png`
- `wos4-artifacts/screenshots/backend_querydemo_parent_submit_from_open_dialog_0620.png`
- `wos4-artifacts/screenshots/backend_querydemo_versions_final_0620.png`
- `wos4-artifacts/screenshots/backend_querydemo_reopen_verify_precise_0620.png`

## 2026-06-20 查询Demo后台调试报错“未找到访问区域”定位

### 现象

- 当前模型：`建模系统客户端_0518 -> 盛云_孙宇飞_后台_查询Demo_0618 -> 自定义计算 -> 查询Demo后台 -> 查询Demo后台_CUSTOMFUNC`
- 当前自定义函数页可见：
  - `编译信息 / 编译成功 10:06:48`
  - `查看更多`
  - `traceID:`
  - `未找到访问区域`
- 说明当前阻塞点已经从“编译/语法”转移到“调试运行时访问区域解析”。

### 手册依据

- `wos4-artifacts/docs/wos4-help-kb/system-introduction/App引擎介绍.md`
  - `2.3. App调试` 明确写到：
    - 调试前需要配置用户
    - 调试前需要配置时空
    - 为了让调试生成的 App 对象能访问数据模型/拷贝/数据对象，需要先把目标时空库数据部署到对应库中
- `wos4-artifacts/docs/wos4-help-kb/function-reference/meta-language-functions/元语言函数_App引擎.md`
  - `ret = -01`：`未找到访问区域（未找到云或端）`
  - `ret = -05`：`未登录到访问区域（未登录到云或端）`
- `wos4-artifacts/docs/wos4-help-kb/function-reference/error-codes/错误码_历史计划库.md`
  - 明确写到：如果是断点调试，要在 `调试配置` 里添加正确的访问用户、时空信息

### 当前实测调试配置

通过 `browser-harness` 直接读取当前编辑器里的 `调试配置` 弹窗，看到：

- `添加用户访问信息:` 下仍然只有 `点击添加`
- `添加时空访问信息:` 下仍然只有 `点击添加`
- `时空信息:` 左侧是 `默认数据区`
- `已选信息:` 当前只有
  - `盛云_孙宇飞_Noctiluca_客户端`

### 当前判断

- 这个报错不能再按“脚本语法错误”处理。
- 当前更像是下面两类前置条件至少缺了一项：
  1. 没有配置有效的调试访问用户，所以连“访问区域”都没有建立出来
  2. 当前选中的 `盛云_孙宇飞_Noctiluca_客户端` 不是这次后端调试所需的正确时空对象，或其对应库数据未按手册完成部署

### 下一步

- 先只读对照参考模型的 `调试配置`，确认参考链路实际绑定的是哪类用户和哪类时空对象
- 再回到 `盛云_孙宇飞` 个人模型，把调试配置改到：
  - 有明确访问用户
  - 绑定到已部署、可访问、与后端数据链一致的个人时空对象
- 在没确认这两项之前，不再把 `未找到访问区域` 误判成代码问题

### 2026-06-20 11:33 browser-harness 复测结果

本轮已用 `browser-harness` 把 `查询Demo后台_CUSTOMFUNC -> 调试配置` 跑到“启动调试不再报访问区域错误”，关键结论如下：

- `时空信息 -> 已选信息` 不能再用旧的 `盛云_孙宇飞_Noctiluca_客户端`，已改为：
  - `盛云_孙宇飞_时空_0617`
- `添加时空访问信息 -> 外云访问时空列表` 里原有旧值：
  - `云ID = 107`
  - `时空GUID = 11bbeccb-5fa4-473f-a7cf-88e7b07c65ff`
  这条是错的；其中 `11bbeccb-5fa4-473f-a7cf-88e7b07c65ff` 实测不是当前时空 GUID。
- 通过运行时 `Query(param,input)` 反查 `时空_0617` 对象 ID `1152921504606851263`，拿到真实 GUID：
  - `99d504aa-4676-4ef2-8bf9-ee6183f242e2`
- 修正后的 `外云访问时空列表` 为：
  - `107 / 99d504aa-4676-4ef2-8bf9-ee6183f242e2`

更关键的新发现：

- 仅配置 `本云 -> 业务 -> tsdbFUUser / <密码已脱敏>` 仍然会报：
  - `未找到访问区域`
  - `启动调试失败`
- 打开 `访问信息 -> 其他云` 后可见提示：
  - `仅限其他云客户端用户`
  - 且默认列表为空
- 在 `其他云 -> 新建` 中新增一条客户端业务用户后，重新确认整套调试配置，再点调试启动，`未找到访问区域 / 启动调试失败` 消失

本轮成功使用的 `其他云客户端用户` 实测值：

- 名称：`cloud107`
- IP：`221.239.19.118`
- 端口：`9770`
- 业务用户名：`孙宇飞`
- 业务密码：`<密码已脱敏>`

因此，当前已验证结论修正为：

1. 当前这个浏览器模式下的元语言后端调试，不是只配 `本云功能单元用户` 就够。
2. 还需要在 `其他云` 页签里补一条“客户端业务用户”。
3. `外云访问时空列表` 里的时空 GUID 也必须是真实时空 GUID，不能沿用旧试错值。
4. 以上三项都补齐后，`调试启动` 至少可以通过“访问区域建立”这一步，不再报 `未找到访问区域`。

本轮证据：

- `wos4-artifacts/screenshots/debug_inner_ext_after_save_2026-06-20.png`
- `wos4-artifacts/screenshots/debug_ext_persist_verify_2026-06-20.png`
- `wos4-artifacts/screenshots/user_access_other_cloud_filled_2026-06-20.png`
- `wos4-artifacts/screenshots/debug_retry_after_other_cloud_user_2026-06-20.png`
## 2026-06-20 Clean Restart Stage 0-1

### 背景

- 用户要求舍弃旧的混杂链路，重新从建模开始。
- 本轮不再把 `0617 / TOPV2 / Noctiluca / Eidolon` 作为当前交付主线，只把它们保留为历史证据。
- 新主线改为 clean restart：`建模 -> 后端 CRUD App -> 前端页面 -> 客户端挂载 -> 时空部署 -> 蓝色对象 -> 前后端 CRUD 验证`。

### Stage 0：参考对象只读拆解

只读对象：

- `lk_客户端01_对象1`
- `lk测试 -> 前端_班次管理 / 后台_班次管理 / 前端_框架`

#### 运行态只读结果

- 在桌面主页面可见 `lk_客户端01_对象1` 卡片。
- 当前会话中桌面已挂有一个运行壳，递归 frame 读到：
  - outer: `/public/?id=6192730962611143001...`
  - inner: `/api/v1/GetFileContent/107/0/0/f5f8c456-e145-4d85-b1c3-dc3a17e7b512_105/index.html`
- 内层页面文本为真实 `班次管理` 业务页，而不是空壳，表格已有 4 条数据：
  - 白班 / 车间1
  - 夜班 / 车间1
  - 白班 / 车间2
  - 夜班 / 车间2
- 当前直接在内层页面调用：
  - `GetPageMngInfo()`
  - `CLIENTRUNINSTANCE`
  - `pageNameToSetPageMap`
  均返回空对象；说明该页本身只是被运行壳装载的内容页，核心 client 上下文不在该内层页面直接暴露。

#### 建模参考只读结果

在干净登录会话重新打开 `建模系统客户端_0518` 后，`lk测试` 组里确认模型列表为：

1. `前端_班次管理`
2. `后台_班次管理`
3. `前端_框架`

`后台_班次管理` 编辑页左树只读结果：

- 开关打开：
  - `业务事`
  - `自定义计算`
  - `命令语言`
- 开关关闭或未开启：
  - `多灵敏时序物`
  - `单灵敏时序物`
  - `业务物`
  - `时序事`
  - `岗位`
  - `组织`
  - `报警规则配置`
  - `多灵敏数据报警转发`
  - `单灵敏数据报警转发`
  - `第三方计算管理`
- `图形模型` 下存在：
  - `2D精灵图`
  - `3D精灵图`
  - `页面精灵图`
  - `报表精灵图`
  - `子模型`
  - `形参配置`

当前结论：

- 参考演示确实是“后台模型 + 前端业务模型 + 前端框架模型”三件套。
- 后台模型的关键最小结构是：
  - `业务事`
  - `自定义计算`
- 这足以作为 clean restart 的建模骨架，不需要继续深挖 `lk_` 后再开始自己的实现。

证据：

- `wos4-artifacts/snapshots/reference_lk_client01_object1_runtime_probe.json`
- `wos4-artifacts/snapshots/reference_lk_client01_runtime_identity.json`
- `wos4-artifacts/snapshots/reference_lktest_model_list.json`
- `wos4-artifacts/snapshots/reference_backend_banci_leftmenu.json`
- `wos4-artifacts/screenshots/reference_lk_client01_object1_runtime_probe.png`
- `wos4-artifacts/screenshots/reference_lktest_model_list.png`
- `wos4-artifacts/screenshots/reference_backend_banci_leftmenu.png`

### Stage 1：新的个人建模链落地

目标分组：

- `盛云_孙宇飞_根组`

#### 已创建模型

1. `盛云_孙宇飞_后台_CRUDDemo_0620`
   - 描述：`clean restart backend CRUD model 0620`
2. `盛云_孙宇飞_前端_框架_0620`
   - 描述：`clean restart front frame model 0620`
3. `盛云_孙宇飞_前端_CRUDDemo_0620`
   - 描述：`clean restart front business model 0620`

#### 后台模型首版提交验证

对 `盛云_孙宇飞_后台_CRUDDemo_0620` 做了首版提交：

- 提交说明：`clean-restart-backend-model-v1-0620`
- 版本管理中已读到：
  - 名称：`盛云_孙宇飞_后台_CRUDDemo_0620`
  - 描述：`clean-restart-backend-model-v1-0620`
  - 版本：`1`
  - 时间：`2026-6-20 13:18:28`

额外观察：

- 新建后的默认编辑骨架已经包含参考模型同构的左树：
  - `数据模型`
  - `逻辑模型`
  - `图形模型`
- 在当前新模型里，`业务事` 与 `自定义计算` 初始就处于打开状态，不需要额外先开关一次才能建后台骨架。

当前结论：

- clean restart 的 stage 1 已完成第一关：
  - 参考拆解完成
  - 新的个人建模三件套已落地
  - 新后台模型首版 `v1` 已进入历史版本链

下一步：

1. 继续在 `盛云_孙宇飞_后台_CRUDDemo_0620` 内补业务事结构和自定义计算 CRUD 函数
2. 再分别提交前端框架模型、前端业务模型的首版
3. 然后进入组态与页面阶段

### Stage 2：`盛云_孙宇飞_后台_CRUDDemo_0620` 后端 skeleton 提交与重载验证

本轮严格只修改自己的 clean restart 后台模型：

- `盛云_孙宇飞_后台_CRUDDemo_0620`

#### 已创建业务事

在 `业务事` 下新建：

- `DemoRecord`

当前成员表最终可见为 5 行：

1. `stationName : string`
2. `areaName : string`
3. `statusText : string`
4. `flowValue : string`
5. `pressureValue : string`

注意：

- 这一组成员名在 inline 编辑过程中出现过 `名称重复，请重新输入` 警告。
- 当前只确认“编辑页里最终显示正确”，尚未完成“退出重进后成员名仍保持”的严格持久化验收。
- 因此业务事成员名持久化仍记为待补验收。

#### 已创建自定义计算

在 `自定义计算` 下创建：

- `DemoCrudBackend`
- 触发类型：`自定义函数`

进入 `DemoCrudBackend_CUSTOMFUNC` 后，已新增 3 个自定义函数：

1. `QueryRecords(string filterKey) -> string`
2. `InsertRecord(string payload) -> string`
3. `UpdateRecord(string payload) -> string`

#### 当前已提交的函数体

`QueryRecords`

```text
return "[{\"stationName\":\"S1\",\"areaName\":\"A1\",\"statusText\":\"RUN\",\"flowValue\":\"12.3\",\"pressureValue\":\"0.45\"}]";
```

`InsertRecord`

```text
return "{\"ok\":true,\"action\":\"insert\"}";
```

`UpdateRecord`

```text
return "{\"ok\":true,\"action\":\"update\"}";
```

#### 保存与提交结果

已验证步骤：

1. 逐个切换 `QueryRecords / InsertRecord / UpdateRecord`
2. 逐个保存，确认 tab 的未保存标记清空
3. 点击顶部 `提交`
4. 在 `版本提交` 中填写说明：
   - `cruddemo-backend-stub-submit-0620`
5. 抓到成功提示：
   - `提交成功`

#### 重载验证

为避免继续和嵌套 worker 的退出行为纠缠，本轮对当前 `worker-space` 做了直接重载，再逐个切回函数读取 textarea 内容。

重载后确认：

- `QueryRecords` 仍为上面的 JSON 数组返回
- `InsertRecord` 仍为 `{"ok":true,"action":"insert"}`
- `UpdateRecord` 仍为 `{"ok":true,"action":"update"}`

说明：

- 当前至少已经证明 `DemoCrudBackend_CUSTOMFUNC` 的函数代码在提交后可被重载读回。
- 这属于“当前编辑器对象内的重载持久化验证”。
- 仍未完成“完整退出建模编辑器再重开同一模型”的最终路径验收，原因是当前 worker 嵌套退出控件行为还不稳定，后续应单独补一条更强验证。

#### 历史版本验证

通过右侧 `历史版本 -> 查看` 读到 1 条版本记录：

- 版本：`1`
- 描述：`cruddemo-backend-stub-submit-0620`
- 提交时间：`2026-06-20 14:13:43`

#### 当前结论

- `盛云_孙宇飞_后台_CRUDDemo_0620` 的自定义计算 CRUD skeleton 已成功创建、保存、提交，并通过重载读回验证。
- 该 backend 目前是“可用于前端联调的 stub backend”，不是最终数据库 CRUD。
- 下一步应转到自己的前端业务模型，把按钮或页面打开事件先联到 `QueryRecords`，跑通前端拿到 stub 数据。

证据：

- `wos4-artifacts/screenshots/stage2_functions_filled_before_save_0620.png`
- `wos4-artifacts/screenshots/stage2_functions_saved_0620.png`
- `wos4-artifacts/screenshots/stage2_left_switch_save_clean_0620.png`
- `wos4-artifacts/screenshots/stage2_submit_dialog2_0620.png`
- `wos4-artifacts/screenshots/stage2_submit_after_confirm_0620.png`
- `wos4-artifacts/screenshots/stage2_reload_verify_0620.png`
- `wos4-artifacts/screenshots/stage2_history_verify_0620.png`

### Stage 3：前端模型版本链补齐，以及 clean 会话下的“编辑入口缺页”阻塞

本轮继续只动自己的 clean restart 资产：

- `盛云_孙宇飞_前端_框架_0620`
- `盛云_孙宇飞_前端_CRUDDemo_0620`

#### 已确认的前端版本链

通过 `建模系统客户端_0518 -> 盛云_孙宇飞_根组 -> 模型列表`，已分别对两个前端模型执行 `提交版本`。

`盛云_孙宇飞_前端_CRUDDemo_0620`

- 历史版本 1：
  - `clean-restart-front-business-v1-0620`
  - `2026-6-20 13:33:12`
- 历史版本 2：
  - `clean-front-business-v1-0620`
  - `2026-6-20 15:5:56`

`盛云_孙宇飞_前端_框架_0620`

- 历史版本 1：
  - `clean-restart-front-frame-v1-0620`
  - `2026-6-20 13:30:42`
- 历史版本 2：
  - `clean-front-frame-v1-0620`
  - `2026-6-20 15:5:14`

当前结论：

- clean restart 三件套里，后端已到可读回的提交态；
- 两个前端模型也都已进入可供组态选择的 `v2` 版本链。

#### 新发现的 clean 主线阻塞

为了继续把前端页面和后端 stub 联上，本轮尝试从建模客户端直接打开：

- `盛云_孙宇飞_前端_CRUDDemo_0620`

关键发现：

1. 该列表页的打开机制不是普通按钮，而是表格内部 `Row-dbclick -> ShowPage(...)`。
2. 内置脚本头部带有 `debugger`，直接调用会把 browser-harness 会话拖住。
3. 即使去掉 `debugger` 后再异步触发 `ShowPage(...)`，当前 clean 会话最终会弹出：

```text
页面--不存在
```

桌面截图已明确拍到该弹窗，说明当前不是“点击没生效”，而是：

- 建模客户端用于打开模型编辑页的目标页面在当前 clean 会话里不存在或无法解析；
- 因此前端业务模型的“进入编辑页”在 clean 主线下目前不可用。

这个阻塞比“前后端联调失败”更靠前，当前应记录为：

```text
clean 主线阻塞点：前端模型编辑入口缺页（页面--不存在）
```

它的影响范围：

- 不能继续在 clean 会话里编辑 `前端_CRUDDemo_0620` 页面内容；
- 也就不能在该会话里把按钮/页面打开事件直接绑到 `QueryRecords`；
- 但不影响继续把现有三件套推进到“可组态、可部署、可尝试运行”的下游链路。

#### 当前阶段结论

- 目前 clean restart 主线已经完成：
  - backend skeleton 提交
  - front frame/business 双前端版本链补齐
- 当前还没有进入真正的前后端联调；
- 真正挡在联调前面的第一道门，是 `前端_CRUDDemo_0620` 的建模编辑入口报 `页面--不存在`。

后续建议顺序：

1. 继续推进 `组态系统客户端0518 -> 管控单元实例配置 -> 数字孪生可视化 -> 运维部署`，验证即使不改页面内容，clean 三件套能否完整挂到运行链；
2. 若运行链也卡，再把阻塞缩小到“编辑入口缺页”还是“组态/部署链失败”；
3. 到真正的运行时调用前停下，再单独研究联调问题。

证据：

- `wos4-artifacts/screenshots/stage2_dialog_version_capture_0620.png`
- `wos4-artifacts/screenshots/stage2_desktop_capture_0620.png`

### 2026-06-20 clean 前端入口修正：页面精灵图链已打通

前一轮把 clean 主线的前端阻塞概括成：

```text
前端模型编辑入口缺页（页面--不存在）
```

这个结论需要收窄。重新实测后确认：

1. `Row-dbclick -> ShowPage(...)` 这条脚本路径确实容易落到 `debugger` 或 `页面--不存在`。
2. 但对 `盛云_孙宇飞_前端_CRUDDemo_0620`，真正可复现的人工入口是：

```text
建模系统客户端_0518
-> 盛云_孙宇飞_根组
-> 模型列表
-> 盛云_孙宇飞_前端_CRUDDemo_0620
-> 行内“编辑”
```

3. 通过这条入口，已实际到达：

```text
图形模型 -> 页面精灵图 -> 精灵图列表
```

4. 在该列表中，原先确实为空；随后已新建页面精灵图：

```text
查询列表
```

5. 再通过该行的 `编辑` 动作，已进入真正的页面编辑器。

#### 复现结果

- `退出` 可用：可从前端模型编辑页退出回建模模型列表。
- `重进` 可用：再次点击模型行内 `编辑` 可以重进前端模型。
- 注意：重进后默认左侧选中态不保证仍在 `页面精灵图`，可能回落到 `数据模型`；需要再次切回 `图形模型 -> 页面精灵图`。
- 页面精灵图创建成功后，列表已出现 `查询列表`。
- 页面编辑器已打开，标签页为 `查询列表`。

#### runtime 检查

递归 frame 检查结果：

```text
top
-> top.0 public/?id=6192730962611142710...
-> top.0.0 f5f8c456-e145-4d85-b1c3-dc3a17e7b512_105/index.html
-> top.0.0.0 94054fd1-9b20-463a-8372-b69776349847_107/index.html
```

在 `top.0.0.0` 中已确认：

- `#page_edit_view_area` 存在
- `__vue__` 存在
- `comMap.$Children` 存在
- `childCount = 15`

这意味着 clean 前端主线已经从“进不去编辑器”推进到“可以开始布局”。

#### 当前修正后的主线判断

当前 clean 主线不再是“前端入口缺页”。

新的阶段判断应为：

```text
前端页面精灵图已创建并已打开到页面编辑器；
下一步阻塞转移到：如何在该新页面上按 layout skill 稳定写入布局并继续组件阶段。
```

#### 关键证据

- `wos4-artifacts/screenshots/vis_0388_0620.png`
- `wos4-artifacts/screenshots/after_precise_confirm_pagesprite_0620.png`
- `wos4-artifacts/screenshots/after_precise_pagesprite_edit_0620.png`

### 2026-06-20 clean 查询列表：布局、组件、页面变量与脚本已落到编辑器并保存

在 `建模系统客户端_0518 -> 盛云_孙宇飞_前端_CRUDDemo_0620 -> 图形模型 -> 页面精灵图 -> 查询列表` 中，继续沿 clean 主线推进，当前已完成：

1. 布局重写并命名：

```text
RootLayout
├─ TopBarRow (fixed 88)
│  ├─ SearchInputCol 82%
│  └─ SearchButtonCol 18%
└─ MainContentRow
   ├─ LeftTreeCol 18%
   ├─ CenterTableCol 47%
   └─ RightChartCol 35%
```

2. 组件已通过运行时插入到命名槽位，并再次抓到保存成功：

```text
SearchInputCol   -> demo_filter_input   -> ElementInput
SearchButtonCol  -> demo_query_button   -> ElementButton
LeftTreeCol      -> demo_area_tree      -> ElementTree
CenterTableCol   -> demo_table          -> ElementTable
RightChartCol    -> demo_chart          -> ElementChart
```

3. 组件保存证据：

- `wos4-artifacts/backups/crud_front_query_list_components_0620/save_capture.json`
- `wos4-artifacts/backups/crud_front_query_list_components_0620/save_scripts_capture.json`

两次都抓到：

```text
保存成功
```

4. 当前 clean 页面里，页面变量和脚本已按“可保存的运行时入口”写入：

- 页面变量：
  - `seedData`：String，默认值为假数据 JSON
  - `filterKey`：String
  - `refreshCounter`：Number
- 页面级 link：
  - `linkId=0 / 创建时`：已启用并写入脚本
- 按钮级 link：
  - `linkId=200001 / Click`：已启用并写入脚本

5. 当前轮可确认的脚本链：

```text
页面创建时
-> 初始化 page.data.variable
-> 创建 page.__pilotRefresh(reason)
-> refreshCounter += 1
-> 解析 seedData
-> 刷新表格/折线图/按钮文案

按钮点击
-> 读取输入框值
-> 写回 filterKey
-> refreshCounter += 1
-> 调用 page.__pilotRefresh("button")
```

6. 当前轮没有继续硬写“变量改变 link(1001)”为正式结论。

原因不是页面变量不可用，而是：

- `PageView.linkToPropertyJson()` 在当前 clean 新页里可以稳定给出 `创建时/存在时/关闭时` 模板；
- 但 `变量改变` 分组仍为空；
- `PageView.upDateLink(...)` 直接喂单个脚本项会报内部 `forEach` 结构错误；
- 因此本轮先落地“页面创建脚本 + 按钮 Click 脚本 + 中转变量”的稳定可保存路径，避免继续猜 `1001` link 结构污染页面。

7. 当前轮的运行时状态证据：

- `wos4-artifacts/backups/crud_front_query_list_components_0620/before.json`
- `wos4-artifacts/backups/crud_front_query_list_components_0620/after.json`
- `wos4-artifacts/snapshots/crud_front_query_list_runtime_probe_0620.json`
- `wos4-artifacts/snapshots/pageview_linkjson_probe_0620.json`
- `wos4-artifacts/screenshots/crud_front_query_list_components_runtime_0620.png`
- `wos4-artifacts/screenshots/crud_front_query_list_after_scripts_0620.png`

8. 当前阶段结论收敛为：

```text
clean 查询列表页面已经从“可进编辑器”推进到“布局存在、组件存在、页面变量存在、创建时脚本存在、按钮 Click 脚本存在，并已保存成功”。
```

9. 当前剩余未完成项：

- 重新打开编辑器，确认变量和脚本重载后仍在。
- 提交版本并走正式预览。
- 预览里确认按钮点击后表格/图表真实变化。
- 如果后续仍坚持“按钮/打开时/定时 -> ++中转变量 -> 变量改变脚本统一执行业务”，还需要补出 `linkId>=1000` 的稳定对象结构样本后再写入 skill。

### 2026-06-20 clean 查询列表：预览链路已跑通，但按钮 UI 事件持久化假设被证伪

继续沿同一 clean 页面推进后，当前新增确认了两件事：

1. 预览链路本身是通的。
2. “只写 `button.propData.linkList` 就能让预览页按钮执行脚本”在这个 clean 页面里不成立。

#### 已确认成功的部分

1. `预览` 必须用真实坐标点击，DOM `click()` 不足以触发新 tab。

真实点击后，新开预览页：

```text
http://221.239.19.118:13001/public/index.html?...#/{
  "mode":"debugger",
  "runModelName":"查询列表",
  ...
}
```

2. 预览页组件渲染成功：

- 左侧树：`全部区域 / A区 / B区`
- 中间表格：4 条假数据
- 右侧图表：`canvas 325 x 829`
- 顶部按钮：`查询全部(4)`
- 顶部输入框可见，但当前 placeholder 未带出

3. 页面创建时脚本已在预览页生效。

证据不是只看表格，而是：

- 预览初始按钮文案已经变成 `查询全部(4)`，说明 `page.__pilotRefresh("create")` 跑过；
- 表格初始即带 4 行假数据；
- 图表初始即有有效 canvas 尺寸。

#### 新发现的关键结构差异

在编辑器 runtime 中，按钮对象同时存在两套 click link 数据：

```text
按钮对象顶层 linkList
按钮对象 propData.propData.linkList
```

当前 clean 页中，最初脚本被写进了嵌套的：

```text
button.propData.propData.linkList[0]
```

但预览页按钮实例真正拿到的仍是默认壳：

```json
{
  "linkId": 200001,
  "enable": false,
  "script": "",
  "linkName": "OnClick"
}
```

也就是说：

```text
创建时脚本 -> 已成功持久化并进入预览
按钮点击脚本 -> 目前没有成功进入预览运行态
```

#### 已做过且仍未成功的修补尝试

以下尝试都已实际执行，但预览重载后按钮仍然是默认空脚本：

1. 直接改：

```text
btn.linkList[0]
btn.propData.linkList[0]
```

2. 用按钮自己的 `linkToPropertyJson()` 模板，再调用：

```text
btn.upDateLink(group)
```

3. 继续保存、提交版本、刷新预览。

结果：

```text
预览页 demo_query_button.__vue__.propData.linkList[0]
= enable:false, script:''
```

#### 更深一层的定位

继续探测后确认：

1. `PageView.linkMng` 运行时只含 3 条基础 page link：

```text
linkId = 0 / 2 / 4
```

2. 当前没有任何：

```text
linkId >= 200000
```

的 UI 事件条目。

3. 这意味着按钮预览态脚本很可能不是简单靠组件自身 `propData.linkList` 落地，而是还要求：

```text
按钮 click link 同时被注册进 PageView.linkMng
```

但当前 clean 页里，直接调用：

```text
page.linkMng.jsonToObject([uiLink])
```

也没有成功把 `200001` 注册出来，说明它吃的结构还不是本轮构造的对象。

#### 当前阶段结论

本轮应把结论收敛为：

```text
clean 查询列表页面：
- 布局成功
- 组件成功
- 页面变量成功
- 创建时脚本成功
- 保存成功
- 提交成功
- 预览成功
- 按钮 UI 事件脚本持久化：未完成
```

#### 当前阻塞点

不是“按钮点不到”，而是：

```text
还没有抓到 clean 页面里 UI 事件从编辑器对象
-> PageView.linkMng
-> 预览按钮实例
这条链路的真实可持久化对象结构
```

#### 下一步建议

后续不要再重复猜 `button.propData.linkList`。

应改成：

1. 在一个已知可用页面里手工给按钮配 click 脚本。
2. 立刻抓：
   - 按钮对象顶层 `linkList`
   - `propData.linkList`
   - `PageView.linkMng.linkList`
3. 以该真实样本反推 clean 页最小写法。

## 2026-06-20 clean backend：`盛云_孙宇飞_后台_CRUDDemo_0620` 调试启动成功

目标路径：

- `建模系统客户端_0518`
- `盛云_孙宇飞_根组`
- `盛云_孙宇飞_后台_CRUDDemo_0620`
- `逻辑模型 -> 自定义计算 -> DemoCrudBackend -> 编辑`

本轮把 clean backend 的调试链从“只会弹访问区域错误”推进到了“真正进入调试态”。

### 调试配置实测结论

1. `时空信息` 左树里仅把 `盛云_孙宇飞_时空_0617` 勾选还不够，必须再点中间右箭头按钮。
2. 中间右箭头按钮 DOM 已确认：

```text
id = data-add
```

3. 点击后，右侧 `已选信息` 表格会真实出现：

```text
盛云_孙宇飞_时空_0617
```

4. `添加用户访问信息` 需要真实点击 `点击添加` 才会弹出 `访问信息` 对话框。
5. 当前可工作的最小用户配置仍是：

```text
本云 -> 业务
用户名: tsdbFUUser
密码:   <密码已脱敏>

其他云 -> 新建 -> 业务
名称:   cloud107
IP:     221.239.19.118
端口:   9770
用户名: 孙宇飞
密码:   <密码已脱敏>
```

6. `添加时空访问信息` 需要真实点击 `点击添加`，进入 `外云访问时空列表` 后：

```text
云ID:     107
时空GUID: 99d504aa-4676-4ef2-8bf9-ee6183f242e2
```

保存后表格会出现一行：

```text
107 / 99d504aa-4676-4ef2-8bf9-ee6183f242e2
```

### 调试启动结果

主调试配置确认后，点击脚本编辑器顶部的调试图标：

```text
.wos-editor-debug-start
```

结果：

- 不再出现 `未找到访问区域`
- 不再出现 `启动调试失败`
- 下方 `编译信息` 出现：

```text
编译成功 19:29:51
```

- 左侧出现调试面板：

```text
变量 / 监视 / 堆栈 / 断点
```

- 顶部开始调试图标消失，停止调试图标出现：

```text
.wos-editor-debug-stop
```

这说明当前 clean backend 至少已经完成：

```text
调试前置配置 -> 编译 -> 调试启动
```

### 当前边界

- 还没有验证断点命中后的变量值、单步、继续。
- 前端要直接 `Call()` clean backend，不能只看建模预览页。手册约束仍是：

```text
Call 不允许跨时空调用；
本地调用只能调同一时空内的 App。
```

因此 clean 主线下一步应转向：

```text
让前端实例和后台实例落到同一运行时空，再做前后端联调。
```

### 本轮证据

- `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\backend_access_dialog_0620.png`
- `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\backend_access_other_cloud_new_0620.png`
- `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\backend_spacetime_access_dialog_0620.png`
- `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\backend_spacetime_access_row_0620.png`
- `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\backend_after_debug_start_0620.png`
- `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\backend_debug_wait_state_0620.png`

## 2026-06-20 clean 运行时主线推进：`NadirL1/NadirL2` 父子部署启动已打通

目标工程：

- `运维部署客户端_0518`
- `盛云_孙宇飞_CRUD工程_0620`

本轮把 clean restart 主线从“实例存在但启动链没跑通”推进到：

```text
NadirL1 -> 版本 1 -> 本云/area0 -> 已部署 -> 已启动
NadirL2 -> 版本 1 -> 本云/area0 -> 已部署 -> 已启动
```

### 已验证顺序

1. `管控单元实例` 页签里，`NadirL1` 初始可见：

```text
版本 1 / 已部署 / 未启动
```

2. `NadirL2` 初始需要先通过 runtime 展开父行才能看到。
3. 旧的“部署成功/启动成功”进度弹窗如果不关闭，会以全屏 `el-dialog__wrapper` 挡住后续交互，表现成：
   - 按钮像是点了
   - 但变量不变、请求不发、状态不刷新
4. 当前页状态刷新不可靠；只有切到别的工程再切回 `盛云_孙宇飞_CRUD工程_0620` 后，主表状态才可信。

### 父层 `NadirL1`

1. 先关闭残留的旧进度弹窗。
2. 点击 `启动` 后，真实子页弹窗内容为：

```text
启动进度
启动中，请等待...
100%
成功
```

3. 关闭弹窗并切工程刷新后，主表更新为：

```text
NadirL1 / 版本 1 / 本云 / area0 / 已部署 / 已启动
```

### 子层 `NadirL2`

1. 在父层已启动后，`更新` 仍会提示：

```text
请先启动此节点！
```

因此当前可工作的顺序不是“先更新再部署”，而是直接走：

```text
部署 -> 选 area0 -> 确定
```

2. `部署` 后会弹出 `数据区选择` 对话框。必须真实选择：

```text
area0
```

再点 `确定`，随后进入：

```text
部署进度
部署中，请等待...
100%
成功
```

3. 关闭弹窗并切工程刷新后，`NadirL2` 主表变为：

```text
版本 1 / 本云 / area0 / 已部署 / 未启动
```

4. 再点击 `启动`，弹出：

```text
启动进度
启动中，请等待...
100%
成功
```

5. 再次关闭弹窗并切工程刷新后，`NadirL2` 主表最终变为：

```text
版本 1 / 本云 / area0 / 已部署 / 已启动
```

### 当前收敛结论

clean 主线里：

- `建模 -> 实例化 -> 提交 -> 管控单元部署启动`
  这一段已经有实证闭环。
- 当前剩余阻塞不再是管控单元启动。

新的阻塞点已经缩小到两条：

1. `数字孪生可视化` 页签状态仍不稳定。
2. 正式客户端预览页 runtime 中 `spaceTime` 仍为空，前端还不能据此声称已完成“同时空 Call 后端”。

### 当前可视化与正式预览边界

`数字孪生可视化` 当前仍有对象漂移：

- 同一个 `盛云_孙宇飞_CRUD工程_0620` 项目下，初始看到的是：

```text
客户端1 / 版本 无 / 未部署 / 未启动
```

- 真实点完 `部署 -> area0 -> 确定` 后，切工程刷新，行却漂移成：

```text
盛云_孙宇飞_Noctiluca_客户端 / 版本 2 / 已部署 / 已启动
```

这说明当前 `数字孪生可视化` 视图存在 stale identity / 对象串页问题，不能拿它直接当 clean CRUD 客户端成功证据。

同时，正式客户端预览页 `clientGuid` 运行态继续确认到：

```text
store.CLIENTRUN_KSCCLIENTFU.property.spaceTime = ""
store.CLIENT_SHOW_PAGE_STORE_查询列表_*.fuObj.spaceTime = ""
store.PageRun_IViewStore_*.pageData.spaceTime = ""
```

即：

```text
页面运行态能显示假数据页面
但 pageInfo.spaceTime 仍为空
```

因此当前还不能声称：

```text
前端已经和 clean backend 完成同时空 CRUD 联调
```

### 本轮新增证据

- `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\retry_parent_start_after_close_0620.png`
- `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\refresh_switch_projects_0620.png`
- `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\deploy_child_after_parent_started_0620.png`
- `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\real_click_child_deploy_confirm_0620.png`
- `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\refresh_after_child_deploy_0620.png`
- `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\start_child_nadirl2_0620.png`
- `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\refresh_after_child_start_0620.png`
- `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\ops_visual_tab_probe_0620.png`
- `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\refresh_visual_after_deploy_0620.png`
- `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\formal_preview_spacetime_probe_0620.png`

## 2026-06-22 clean CRUD formal preview recheck

### 目标

在不改别人对象的前提下，只复核：

```text
盛云_孙宇飞_CRUD工程_0620
-> 数字孪生可视化
-> 客户端1_人工干预点_1
-> 更新版本
-> 正式预览
-> 运行时时空
```

### 实测结果

1. `更新版本` 确认框真实提交后，抓到 toast：

```text
更新成功
```

2. `预览` 弹窗给出的正式链接已切到新的 `clientGuid`：

```text
d01d4d20-79d3-4b0d-9d89-77856713e525
```

这说明后续验证不能继续复用旧预览 tab。

3. 新正式预览页顶层仍只有壳，但内层 iframe 已经真实渲染：

```text
查询全部(4)
泵站A-01 / A / 正常 / 128 / 0.62
...
```

4. 旧的全局判断信号依然偏空：

```text
GetPageMngInfo() = {}
pageNameToSetPageMap = {}
CLIENTRUNINSTANCE._data = {}
```

5. 但进一步下探 inner runtime，已确认：

```text
.page_view.__vue__.spaceTimeId.spaceTime = NadirL2
.page_view.__vue__.spaceTimeId.devName = NadirFront
```

同时仍观察到：

```text
currentShow.options.spaceTime.spaceTime = ""
PARENT_STORE_PARAM.spaceTime = {}
pageData.spaceTime = null
```

### 当前结论

这轮不能再说“正式预览没有同时空”。

更准确的说法是：

```text
正式预览已经挂到 clean CRUD 页，
且 page_view 运行时已经解析出 NadirL2 / NadirFront。
```

但这仍不等于“前后端已打通”，因为当前按钮脚本继续确认是纯前端假数据：

```text
seedData -> buildRows -> table/chart refresh
无 Call(...)
无后端 ret/errorcodes
```

所以当前 clean 主线状态更新为：

```text
建模 -> 实例化 -> 提交 -> 部署启动 -> 正式预览同时空挂载
已打通

前端 call 后端 / CRUD 数据读写
尚未打通
```

### 新增证据

- `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\crud_update_version_after_confirm_20260622.png`
- `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\crud_preview_link_dialog_20260622.png`
- `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\crud_formal_preview_runtime_20260622.png`
- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\crud_formal_preview_runtime_verify_20260622.json`

## 2026-06-22 formal preview same-spacetime backend Call probe

用户截图确认当前运行时空属性：

```text
NadirL2
GUID = 4fa17a11-b923-4b36-b1e8-c39ca1bcf62c
ID = 1152921504606851278
部署状态 = 正常
```

本轮在正式预览 tab：

```text
clientGuid = d01d4d20-79d3-4b0d-9d89-77856713e525
page = 查询列表
```

继续下探 inner `.page_view.__vue__.spaceTimeId`，读取到同一组时空：

```text
spaceTime = NadirL2
guid = 4fa17a11-b923-4b36-b1e8-c39ca1bcf62c
id = 1152921504606851278
devName = NadirFront
```

### 已验证的前端查后台对象方式

JS 手册里的前端签名是：

```text
Query(param, input)
Call(param, input)
```

不是元语言版的第三个 `output` 引用参数。

运行页里 `Query/Call` 的 `param/input` 必须使用平台 `StringMap`。普通 JS object 会报：

```text
_containsKey is not a function
```

用当前时空 GUID 查询运行态 App：

```js
await Query(
  new StringMap({ type: 21001, cloudID: 107, areaID: 0, timeout: 5000 }),
  new StringMap({
    mode: 2,
    spaceTimeGUID: "4fa17a11-b923-4b36-b1e8-c39ca1bcf62c",
    returnFields: ["$id","$guid","$name","$spaceTimeGUID","$modelguid","$modelversion"]
  })
)
```

返回成功：

```text
ret = 0
traceID = 5189241935173304320
```

其中 clean 后台运行对象为：

```text
$name = 盛云_孙宇飞_后台_CRUDDemo_0620@NadirBack
$id = 5911255985900486970
$guid = 4aeb7354-d29d-4969-834e-4310951bd719
$spaceTimeGUID = 4fa17a11-b923-4b36-b1e8-c39ca1bcf62c
$modelguid = 5702ad4a-a934-43a9-9e14-f2ca545abb53
$modelversion = 1
```

### 已验证的 Call 形态和当前阻塞

手册示例实际使用小写字段：

```text
funcname
```

而不是表格中的 `funcName`。当前可执行到返回的最小调用为：

```js
await Call(
  new StringMap({ type: 21001, cloudID: 107, areaID: 0, timeout: 3000 }),
  new StringMap({
    identifierType: 1,
    id: "5911255985900486970",
    funcname: "QueryRecords",
    params: [new Variant("", "string")]
  })
)
```

返回：

```text
ret = -220006
errorcodes = [-220006]
consumeTime = 3001
```

查 `错误码_App引擎`，`-220006` 属于 `WebJS App引擎错误码 / TimeOut / 超时`。

随后补做两个排除项：

1. 仍用后台对象 ID，但调用明显不存在的函数：

```text
funcname = DefinitelyNoSuchFunc_0622
timeout = 1000
ret = -220006
consumeTime = 1001
```

2. 改用后台对象完整运行名调用：

```text
identifierType = 2
name = 盛云_孙宇飞_后台_CRUDDemo_0620@NadirBack
funcname = QueryRecords
timeout = 1000
ret = -220006
consumeTime = 1001
```

因此当前不能再把问题归因成“只是不知道函数名”或“ID 不对”。更准确是：

```text
后台运行 App 可被同一时空 Query 查到，
但 Call 请求没有进入可返回函数校验的阶段，
目标 App 调用通道当前无响应。
```

### 当前结论

这轮已经证明：

```text
正式前端预览页
-> 可读取 NadirL2 时空信息
-> 可用 spaceTimeGUID 查询同一时空下的运行 App
-> 可定位后台对象 ID
-> 可按 JS 手册形态发起 Call
```

但还没有证明：

```text
QueryRecords 真实执行
前端拿到后台返回值
数据库读 / 插 / 改
```

当前阻塞收敛为：

```text
后台运行对象存在，但 Call(QueryRecords) 超时。
下一步应检查后台模型 v1 的函数是否作为接口正确暴露、
部署运行对象是否加载了包含 QueryRecords 的版本、
以及后台 App 日志/调试工具里是否收到前端调用。
```

新增证据：

- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\runtime_spacetime_apps_query_20260622.json`
- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\runtime_backend_call_funcname_once_20260622.json`
- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\runtime_backend_metadata_query_20260622.json`
- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\runtime_backend_call_nonexistent_once_20260622.json`
- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\runtime_backend_call_by_name_once_20260622.json`

## 2026-06-22 clean CRUD: 组态 v2 与运行态 v1 不一致

继续推进 `盛云_孙宇飞_CRUD工程_0620` 的前后端联调时，确认了一个新的关键分叉：

```text
组态系统客户端0518
-> 盛云_孙宇飞_CRUD工程_0620
-> 管控单元实例配置
-> KF4.5Root / NadirL1 / NadirL2
```

在组态页里，`NadirL2` 的实例列表显示：

```text
NadirBack
模型: 盛云_孙宇飞_后台_CRUDDemo_0620
模型版本: v2

NadirFront
模型: 盛云_孙宇飞_前端_CRUDDemo_0620
模型版本: v2
```

并且 `NadirBack` 的实例版本提交进度显示：

```text
NadirBack
GUID: 276cb189-67c5-47d1-94be-7e76f5f5af4e
100%
提交成功
```

但正式预览页刷新后，从 inner runtime 的 `NadirL2` 同时空查询运行 App，后台仍是：

```text
$name = 盛云_孙宇飞_后台_CRUDDemo_0620@NadirBack
$id = 5911255985900486970
$guid = 4aeb7354-d29d-4969-834e-4310951bd719
$modelguid = 5702ad4a-a934-43a9-9e14-f2ca545abb53
$modelversion = 1
```

这说明当前不能把“组态页模型版本 v2 + 实例提交成功”直接等价为“运行态后台已加载 v2”。

运维部署侧新验证：

- `运维部署客户端_0518 -> 盛云_孙宇飞_CRUD工程_0620 -> 管控单元实例` 中，`NadirL1` 可被停止，停止进度到 `100% / 成功`，运行状态变为 `未启动`。
- 停止进度弹层 `#m运维部署管理_进度展示` 是全屏 `pointer-events:auto`，即使成功后也会挡住后续点击；header 隐藏，普通关闭按钮不可见。
- 隐藏该已完成弹层后，行内 `更新` 与 `部分更新` 均可被定位并点击，但没有出现新的进度、toast 或运行态版本变化。
- 勾选 `NadirL1` 后点击顶部 `批量启动` 可真实触发，显示 `批量启动进度 / 共2个待执行时空节点 / 2/2 / 批量启动成功`，运行状态回到 `已启动`。
- 试图继续走 `批量停止 -> 批量部署 -> 批量启动` 时，由于旧进度弹层和行选择状态干扰，`批量停止/批量部署` 没有可靠触发，不能算验证成功。

重启/启动后再次刷新正式预览页，前端页面仍能显示本地假数据：

```text
查询全部(4)
泵站A-01 / 泵站A-02 / 泵站B-01 / 泵站B-02
```

但这 4 条数据来自前端 `seedData/filterKey/refreshCounter` 逻辑，不是后端返回。直接 `Call` 当前运行态后台，结果从此前的超时变化为快速错误：

```text
identifierType=2
name=盛云_孙宇飞_后台_CRUDDemo_0620@NadirBack
funcname=QueryRecords / queryrecords
params=[Variant("", "string")]
ret=-210133

identifierType=2
name=DemoCrudBackend_CUSTOMFUNC@NadirBack
funcname=QueryRecords / queryrecords
ret=-210133

identifierType=1/0
guid/id 指向后台运行对象
ret=536903681
```

当前结论：

```text
前端正式预览已绑定 NadirL2，能查询到同一时空后台运行对象；
组态层已显示 NadirBack v2 且实例提交成功；
运维层重启后运行态仍显示后台模型版本 v1；
当前前端仍未拿到后端 QueryRecords 返回值。
```

下一步不要继续改前端页面脚本来“假装联调”。应先解决以下任一问题：

1. 在运维部署页找到可靠的“更新运行态实例版本”的入口，使 `NadirBack@NadirL2` 的 `$modelversion` 从 `1` 变成 `2`。
2. 或确认 v1 后台模型里实际暴露了哪个可调用函数，再用该函数做最小 Call 验证。
3. 或在后台调试工具里用 `APP_RUN / <密码已脱敏>` 和当前 `NadirL2` 访问区域直接调通 `QueryRecords`，确认函数可执行后再回前端 Call。

新增证据：

- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\config_recheck_before_action_20260622.json`
- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\ops_stop_wait_result_20260622.json`
- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\ops_progress_dom_inspect_20260622.json`
- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\ops_update_after_hide_20260622.json`
- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\ops_partial_update_real_click_20260622.json`
- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\ops_batch_start_nadirl1_20260622.json`
- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\preview_roots_after_ops_restart_20260622.json`
- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\call_backend_probe_after_restart_20260622.json`

2026-06-22 追加：会话失效后的处理规则

用户指出遇到：

```text
会话失效或无法连接到云，是否退出登录页面
```

时应彻底刷新页面。本轮验证中，刷新当前 WOS4 顶层页后确实回到 `#/login`。使用 `wos4.local.ini` 中的用户名/密码重新写入登录框后，输入框状态正常，登录按钮未禁用，但点击登录最终出现：

```text
登录失败:timeout
```

因此当前停止在登录态，不能继续操作运维部署页，也不能把刷新前残留 iframe / runtime 当作有效证据。

已同步更新：

- `.ai/skills/wos4-human-navigation/SKILL.md`
- `.ai/skills/wos4-login/SKILL.md`

新增证据：

- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\session_invalid_refresh_20260622.json`
- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\refresh_desktop_open_ops_20260622.json`
- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\login_click_retry_20260622.json`

2026-06-22 追加：NadirL2 时空包生成与运维更新已打通

本轮继续推进 `盛云_孙宇飞_CRUD工程_0620`，确认此前阻塞的关键不是 `NadirBack` 行提交，而是缺少 `NadirL2` 的时空仓库包。

已验证链路：

```text
组态系统客户端0518
-> 盛云_孙宇飞_CRUD工程_0620
-> 管控单元实例配置
-> 选中 NadirL2
-> 调用 PageRun.ShowChild("数字孪生实例化_时空_提交版本", ...)
-> 传入 spaceTimeRepoGuids=[NadirL2 guid]
-> 子页返回 Finish
-> _asyncCreatePacketCallback result versions=[2]
-> IQueryRepoPacketsList(selectRepoGUID=NadirL2 guid) 返回 [1,2]
-> IUpdatePUInstance(instRepoGUID=NadirL2 guid, updateVersion=2) 返回 success
-> IQuerySTObjectInfo / IQuerySTRepoCfgInfo 显示 NadirL2 已部署、已启动
```

关键细节：

```text
NadirL2 GUID = 4fa17a11-b923-4b36-b1e8-c39ca1bcf62c
NadirL2 ID   = 1152921504606851278

PageRun.ShowChild 可用；
window.ShowChild 不可用，会报 ReferenceError: ShowChild is not defined。

NadirBack 行级 “提交版本 100%/提交成功” 不是时空包生成证据；
必须继续生成时空仓库包，并用 IQueryRepoPacketsList 验证新版本可见。
```

运维更新后读到：

```text
IQueryRepoPacketsList:
  repopktversionlist = [1,2]

IUpdatePUInstance:
  errorcode = 0
  errormsg = success

IQuerySTObjectInfo:
  NadirL2 = 已部署 / 已启动

IQuerySTRepoCfgInfo:
  NadirFront = 已部署 / 已启动 / strepocfgver=2
  NadirBack  = 已部署 / 已启动
```

当前仍未打通的部分：

```text
正式预览页 inner page_view.spaceTimeId 已是 NadirL2 / NadirFront；
但从前端运行页调用后台仍失败：

name=DemoCrudBackend_CUSTOMFUNC@NadirBack
funcname=QueryRecords
SetRunInfo({stType:5, spaceTime:"NadirL2"})
ret=-220006 / WebJS App引擎超时

加 devName:
SetRunInfo({stType:5, spaceTime:"NadirL2", devName:"NadirBack"})
仍 ret=-220006
```

新的判断：

```text
建模 -> 实例化 -> 时空包生成 -> 运维更新 -> NadirL2 运行态刷新
这条主线已经打通。

剩余重点不再是部署更新，而是：
1. 后台 DemoCrudBackend_CUSTOMFUNC 在运行态是否真的响应 QueryRecords；
2. 前端 Call 后台函数的正确 name / funcname / SetRunInfo 组合；
3. 必要时回到后台调试工具，用 APP_RUN / <密码已脱敏> 对 NadirL2 访问区域直接调通 QueryRecords。
```

新增证据：

- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\pagerun_showchild_spacetime_submit_nadirl2_20260622.json`
- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\query_repopackets_after_real_spacetime_submit_20260622.json`
- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\poll_update_puinstance_nadirl2_v2_20260622.json`
- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\loaded_preview_backend_call_after_v2_update_late_20260622.json`
- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\loaded_preview_backend_call_devname_variant_20260622.json`
## 2026-06-22 clean CRUD: 后端调试配置修正后，阻塞收敛到正式客户端入口

本轮继续推进 `盛云_孙宇飞_CRUD工程_0620 -> NadirL2` 前后端联调，使用 `browser-harness` 重新进入：

```text
建模系统客户端_0518
-> 盛云_孙宇飞_根组
-> 盛云_孙宇飞_后台_CRUDDemo_0620
-> 逻辑模型
-> 自定义计算
-> DemoCrudBackend
-> 编辑
-> DemoCrudBackend_CUSTOMFUNC
```

### 后端调试配置修正

打开 `调试配置` 后发现配置仍指向旧时空：

```text
已选信息 = 盛云_孙宇飞_时空_0617
外云访问时空列表 = 107 / 99d504aa-4676-4ef2-8bf9-ee6183f242e2
```

已修正为当前 clean runtime 目标：

```text
已选信息 = NadirL2
外云访问时空列表 = 107 / 4fa17a11-b923-4b36-b1e8-c39ca1bcf62c
```

同时把 `添加用户访问信息` 的可见运行用户切换为 `APP_RUN`。保存主调试配置后，再点击 `.wos-editor-debug-start`，不再出现 `未找到访问区域` 或 `启动调试失败`，抓到：

```text
编译信息
xxxxxxxxxxxxxx 编译成功 13:17:51 xxxxxxxxxxxxxx
```

并进入带 `变量 / 监视 / 堆栈 / 断点` 的调试态。

### 前端 Call 复测

直接从运行页使用错误的字符串函数名形式调用：

```js
Call("DemoCrudBackend_CUSTOMFUNC@NadirBack.QueryRecords", ...)
```

会报：

```text
TypeError: i is not a function
```

原因是前端 `Call` 不是字符串函数名 API。运行页中的 `page_view_container.__vue__.Call` 真实签名仍是：

```text
Call(paramMap, inputMap)
```

并且内部依赖 `this._getPageInfo()` 自动插入 `appspacetimeguid`。继续按手册形态使用：

```js
new StringMap({ type: 21001, cloudID: 107, areaID: 0, timeout: 5000 })
new StringMap({ identifierType, id/name, funcname, params })
```

### 运行态 App 已更新，但当前页面壳不是正式同时空入口

重新 Query `NadirL2` 的运行 App 列表，确认包更新已经生效，新的运行对象为：

```text
$name = DemoCrudBackend_CUSTOMFUNC@NadirBack
$id = 5911255985900487006
$guid = ac4dd4dc-2321-4dab-99cf-3dd5f57ed888
$modelguid = 478c5219-9a87-4038-94cb-574514ae6d82
$modelversion = 3
$spaceTimeGUID = 4fa17a11-b923-4b36-b1e8-c39ca1bcf62c
```

但当前几个运行页 tab 的 `_getPageInfo()` 返回：

```text
spaceTime.guid = ""
spaceTime.name = ""
```

因此即使用最新 App ID 调用：

```js
identifierType = 1
id = "5911255985900487006"
funcname = "QueryRecords"
params = [new Variant("", "string")]
```

返回：

```text
ret = -210139
meaning = 时空不匹配
```

这说明当前使用的页面仍是编辑器/预览壳，不是真正发布出来的客户端运行入口。前端 Call 不能通过 `input.spaceTimeGUID` 绕过，因为 `Call` 手册接口没有目标时空字段，平台依赖页面运行壳里的 `pageInfo.spaceTime` 自动注入 `appspacetimeguid`。

### 当前结论

已经验证：

```text
后端调试配置可切到 NadirL2
后端调试启动可编译成功
NadirL2 运行态能查询到 DemoCrudBackend_CUSTOMFUNC@NadirBack v3
前端 Call 正确形态是 StringMap + Variant + funcname
```

尚未打通：

```text
正式客户端入口 -> pageInfo.spaceTime 非空 -> Call(QueryRecords) ret=0
```

下一步优先级：

1. 不继续改 QueryRecords 脚本，先找到或生成 `盛云_孙宇飞_CRUD工程_0620` 的真实桌面/对象管理客户端入口。
2. 打开真实入口后先验收：

```js
document.querySelector(".page_view_container").__vue__._getPageInfo().data.spaceTime.guid
```

必须等于：

```text
4fa17a11-b923-4b36-b1e8-c39ca1bcf62c
```

3. 再用最新运行对象 ID `5911255985900487006` 复测 `Call(QueryRecords)`。

新增证据：

- `wos4-artifacts/snapshots/open_debug_config_backend_20260622.json`
- `wos4-artifacts/snapshots/debug_config_replace_selected_spacetime_20260622.json`
- `wos4-artifacts/snapshots/debug_config_st_access_guid_updated_20260622.json`
- `wos4-artifacts/snapshots/debug_config_full_saved_20260622.json`
- `wos4-artifacts/snapshots/backend_debug_start_result_20260622.json`
- `wos4-artifacts/snapshots/runtime_apps_query_latest_after_debug_20260622.json`
- `wos4-artifacts/snapshots/runtime_call_latest_backend_id_20260622.json`

### 对象管理入口补查

继续从可见桌面进入 `时空对象管理平台`，展开：

```text
本云(0)
-> NadirL1
-> NadirL2
-> 客户端1_人工干预点_1
```

边界结果：

1. 选中 `NadirL2` 后右侧列表为空，点击 `创建 -> 应用模板: 选择` 只显示：

```text
业务内置APP@NadirFront/业务内置APP
语言类型: 元语言
模型版本: 22
```

2. 选中 `客户端1_人工干预点_1` 后右侧列表也为空，点击 `创建 -> 应用模板: 选择` 只显示：

```text
实时报警数据汇总_运行后台
语言类型: 元语言
模型版本: 13
```

因此当前对象管理入口没有暴露可用于创建蓝色客户端对象的 `WebJS` 模板。按 `wos4-blue-client-object-create` 的规则，不能继续硬点 `确定`，否则会创建错误的紫色/后台对象。

新的停止条件：

```text
如果 NadirL2 / 客户端1_人工干预点_1 下的应用模板选择器没有 WebJS 客户端模板，
停止自动创建对象，要求人类确认正确的客户端发布节点或是否需要回组态/运维部署刷新数字孪生可视化。
```

补充证据：

- `wos4-artifacts/snapshots/object_management_after_relogin_20260622.json`
- `wos4-artifacts/snapshots/object_mgmt_tree_state_after_wrong_template_20260622.json`
- `wos4-artifacts/snapshots/object_mgmt_nadirl2_template_probe_20260622.json`
- `wos4-artifacts/snapshots/object_mgmt_template_select_dialog_20260622.json`

### QueryRecords 可观测性补丁

根据用户指出“当前函数看不到信息、入参也没用上”，对自己的后端函数：

```text
盛云_孙宇飞_后台_CRUDDemo_0620
-> DemoCrudBackend_CUSTOMFUNC
-> QueryRecords
```

做了最小可观测性修复。

当前已保存并编译成功的函数体：

```text
Trace(2, "QueryRecords.enter", filterKey);
return "[{\"stationName\":\"S1\",\"areaName\":\"A1\",\"statusText\":\"RUN\",\"flowValue\":\"12.3\",\"pressureValue\":\"0.45\"}]";
```

说明：

- `filterKey` 已参与 `Trace`，用于判断函数是否真的被调用以及调用入参是什么。
- 这仍然是 smoke stub，不是最终 CRUD 风格。
- 参考 `lk_客户端01_对象1` 与用户提供的样例后，下一版应改为平台主流形态：

```text
QueryRecords(stringMap<var> strmapPara) -> stringMap<var>
前端 params: [new Variant(inParams)]
后端 strmapPara["filter"] / strmapPara.filter
返回 returnData["errorcode"] / returnData["errormsg"] / returnData["statisticsList"]
```

本轮误区和修复：

- 调试态停掉后，编辑器一度残留只读提示，直接改 `textarea.value` 会导致 Monaco 内部文本残留旧尾巴，编译报 `mismatched input '}'`。
- 可靠修复方式是：用真实 CDP 键盘 `Ctrl+A -> Input.insertText` 替换 Monaco 内容，再点击 `.wos-editor-save` 和 `.wos-editor-complie`。
- 编译成功时间：`2026-06-22 13:47:26`。
- 已点击自定义函数 `提交` 并填写提交说明 `queryrecords-trace-filterkey-20260622`，但没有抓到明确的 `提交成功` 快速提示；因此当前只把“保存+编译成功”作为已确认事实，不把“新历史版本已生成”当作已确认。

新增证据：

- `wos4-artifacts/snapshots/backend_queryrecords_keyboard_repair2_20260622.json`
- `wos4-artifacts/screenshots/backend_queryrecords_keyboard_repair2_20260622.png`
- `wos4-artifacts/snapshots/backend_queryrecords_trace_submit_20260622.json`
- `wos4-artifacts/screenshots/backend_queryrecords_trace_submit_20260622.png`

### QueryRecords 改为 lk 风格结构化入参/返回

用户提供了 `lk` 的 `QueryClassData` 样例后，确认前一版 `QueryRecords(string filterKey) -> string` 仍然太简单，不利于后续前端按平台方式调用。

本轮已把自己的函数升级为结构化接口：

```text
函数名: QueryRecords
输入参数: stringMap<var> strmapPara
返回值类型: stringMap<var>
```

当前可见 Monaco 行为单行代码，编译成功：

```text
Trace(2, "QueryRecords.enter", strmapPara);
int32 SUCCESS_CODE = 0;
string filter = strmapPara.filter;
stringMap<var> returnData;
stringMap<var> row;
stringMap<var>[] statisticsList;
returnData["errorcode"] = SUCCESS_CODE;
returnData["errormsg"] = "ok";
row["stationName"] = "S1";
row["areaName"] = "A1";
row["statusText"] = "RUN";
row["flowValue"] = "12.3";
row["pressureValue"] = "0.45";
row["filter"] = filter;
statisticsList.push(row);
returnData["statisticsList"] = statisticsList;
return returnData;
```

说明：

- 这仍然使用假数据，但接口形态已经接近 `lk`：
  - 前端应构造 `inParams = new StringMap({})`
  - `inParams._insert("filter", filter, "string")`
  - `params: [new Variant(inParams)]`
  - 后端用 `strmapPara.filter` 读取。
- 返回也不再是裸字符串，而是 `errorcode / errormsg / statisticsList`。
- `Trace(2, "QueryRecords.enter", strmapPara)` 用于确认函数真的进来了，并打印前端传入的结构化参数。
- 该版本还没有接入真实库表 `Query(param,input,output)`，只是先把调用协议改正确。

验证：

- 输入框已确认：
  - `QueryRecords`
  - `stringMap<var> strmapPara`
  - `stringMap<var>`
- 编译成功：

```text
xxxxxxxxxxxxxx 编译成功 13:51:39 xxxxxxxxxxxxxx
```

- 自定义函数提交已捕获到：

```text
提交成功
提交说明: queryrecords-structured-return-20260622
```

注意：

- browser-harness 读到的隐藏 `textarea.value` 可能缺失开头 `Trace` 字符，但可见 Monaco `view-line` 与编译信息是准的。
- 本轮提交后还需要继续做：提交父模型版本、组态实例切版本/提交、时空包生成、运维更新，再回正式预览页测试前端 `Call`。

新增证据：

- `wos4-artifacts/snapshots/backend_queryrecords_structured_return_20260622.json`
- `wos4-artifacts/screenshots/backend_queryrecords_structured_return_20260622.png`
- `wos4-artifacts/snapshots/backend_queryrecords_structured_submit_20260622.json`
- `wos4-artifacts/screenshots/backend_queryrecords_structured_submit_20260622.png`

### QueryRecords 改为标准多行写法

用户指出单行函数体不利于维护，且不像平台里 `lk` 参考模型的写法。本轮继续在自己的 clean backend：

```text
盛云_孙宇飞_后台_CRUDDemo_0620
-> DemoCrudBackend_CUSTOMFUNC
-> QueryRecords
```

将函数体整理为标准多行格式，保留已验证的结构化接口：

```text
输入参数: stringMap<var> strmapPara
返回值类型: stringMap<var>
```

当前代码形态：

```c
Trace(2, "QueryRecords.enter", strmapPara);

int32 SUCCESS_CODE = 0;
string filter = strmapPara.filter;

stringMap<var> returnData;
stringMap<var> row;
stringMap<var>[] statisticsList;

returnData["errorcode"] = SUCCESS_CODE;
returnData["errormsg"] = "ok";

row["stationName"] = "S1";
row["areaName"] = "A1";
row["statusText"] = "RUN";
row["flowValue"] = "12.3";
row["pressureValue"] = "0.45";
row["filter"] = filter;

statisticsList.push(row);
returnData["statisticsList"] = statisticsList;

return returnData;
```

验证结果：

- 保存成功，未保存标记全部清除。
- 编译成功：

```text
xxxxxxxxxxxxxx 编译成功 13:54:46 xxxxxxxxxxxxxx
```

- 顶部 `提交` 按钮提交成功，提交说明：

```text
queryrecords-multiline-structured-20260622
```

注意：

- 这次只确认了自定义计算函数自身的多行代码、保存、编译、提交。
- 运行态正式客户端想拿到这版，后续仍需要走父模型提交、组态实例版本更新、时空包提交、运维更新/启动，再在同一时空正式预览里测试 `Call`。
- `Trace(2, "QueryRecords.enter", strmapPara)` 只是为了确认函数入口和入参；真实数据库 CRUD 仍未接入。

新增证据：

- `wos4-artifacts/snapshots/backend_queryrecords_multiline_format_20260622.json`
- `wos4-artifacts/screenshots/backend_queryrecords_multiline_format_20260622.png`
- `wos4-artifacts/snapshots/backend_queryrecords_multiline_submit_confirmed_20260622.json`
- `wos4-artifacts/screenshots/backend_queryrecords_multiline_submit_confirmed_20260622.png`

## 2026-06-22 QueryRecords 参数传递复核

用户提供 `QueryClassData` 参考代码后，本轮只复核“参数传递形态”，结论如下：

- 后台元语言内部调用时，`onCreate` 直接构造同类型变量并调用函数：

```c
stringMap<var> strmapPara;
strmapPara["filter"] = "";
QueryClassData(strmapPara);
```

- 当前自己的 `DemoCrudBackend_CUSTOMFUNC -> QueryRecords` 元数据已经匹配该模式：

```text
输入参数: stringMap<var> strmapPara
返回值类型: stringMap<var>
```

- 前端 JS 通过 `Call(param,input)` 调后台时，不能直接传裸 `StringMap`，也不能传旧实验用的 `new Variant("", "string")`；必须把同一个 `StringMap` 包成一个 `Variant`，并且 `params` 数量为 1：

```js
params: [new Variant(new StringMap({ filter: "" }))]
```

- 已验证错误边界：
  - 当前正式 `NadirL2` 预览页 `spaceTimeId` 正确，但 `Query` 运行态 App 列表返回 `ret=-180985`，按既有笔记是当前用户没有权限访问云。
  - 用已知后台运行对象 ID `5911255985900487006` 直接 `Call(QueryRecords, Variant(StringMap))` 返回 `ret=-220006`，不是参数类型不匹配错误。

本轮误把参考 `QueryClassData` 的业务查询内容尝试写入自己的 `QueryRecords`，导致临时编译错误；随后已恢复为上一版可编译假数据函数，并重新编译成功：

```text
xxxxxxxxxxxxxx 编译成功 14:45:16 xxxxxxxxxxxxxx
```

新增证据：

- `wos4-artifacts/snapshots/queryrecords_signature_inspect_20260622.json`
- `wos4-artifacts/screenshots/queryrecords_signature_inspect_20260622.png`
- `wos4-artifacts/snapshots/formal_preview_call_one_known_backend_20260622.json`
- `wos4-artifacts/snapshots/queryrecords_standard_query_compile_20260622.json`
- `wos4-artifacts/screenshots/queryrecords_standard_query_compile_20260622.png`
- `wos4-artifacts/snapshots/queryrecords_restored_compile_20260622.json`
- `wos4-artifacts/screenshots/queryrecords_restored_compile_20260622.png`

## 2026-06-22 前端按钮改为 Call 后的运行包更新复测

本轮在 `盛云_孙宇飞_前端_CRUDDemo_0620 -> 查询列表` 中把 `demo_query_button` 的按钮脚本从本地 `seedData` mock 改为后端 `Call(QueryRecords)` 形式，并完成保存、提交和编辑器预览验证。

关键结果：

- 编辑器预览中按钮脚本已执行，返回 `backend fail / -210139`。这符合预期：编辑器预览壳没有正式 `NadirL2` 时空上下文。
- 通过 `组态系统客户端0518 -> 管控单元实例配置 -> NadirL2` 重新打开 `数字孪生实例化_时空_提交版本`，抓到 `NadirL2 / NadirBack / NadirFront` 均 `100% 提交成功`。
- 在 `运维部署客户端_0518 -> 盛云_孙宇飞_CRUD工程_0620` 中，必须从 `PageView.eval(...)` 的脚本环境执行运维 API；直接用 raw `window.Call` 会返回 `-210133`。
- 使用 `PageView.eval(...)` 成功查询到 `NadirL2` 仓库包版本 `[1,2,3]`，并执行：

```text
IUpdatePUInstance(instRepoGUID=4fa17a11-b923-4b36-b1e8-c39ca1bcf62c, updateVersion=3)
```

返回：

```text
returndata.errorcode = 0
errormsg = success
```

回查运行态：

```text
NadirL2: 已部署 / 已启动
NadirFront: strepocfgver=3 / 已部署 / 已启动
NadirBack:  strepocfgver=5 / 已部署 / 已启动
```

仍未完成的部分：

- 旧正式客户端 tab 仍保留旧 mock 脚本，刷新后可能变成空白 `public/index.html` 外壳；这不能作为有效验收入口。
- 在 `时空对象管理平台` 中切到 `全部` 并选中左树 `客户端1_人工干预点_1` 后，右侧仍为 `暂无数据`；点击工具栏 `视图` 和双击左树节点均未挂载新的运行 iframe。
- 因此本轮只能确认“模型脚本已提交、时空包已更新到 V3、NadirFront/NadirBack 已运行新配置”；尚未确认“新正式蓝色客户端入口已重新打开并加载新按钮脚本”，也尚未确认前端实际拿到后端返回。

新增证据：

- `wos4-artifacts/backups/front_backend_call_20260622/after.json`
- `wos4-artifacts/backups/front_backend_call_20260622/submit_capture.json`
- `wos4-artifacts/backups/front_backend_call_20260622/preview_precise_click_verify.json`
- `wos4-artifacts/backups/front_backend_call_20260622/spacetime_submit_after_front_patch.json`
- `wos4-artifacts/backups/front_backend_call_20260622/eval_update_nadirl2_after_front_patch_ascii_safe.json`
- `wos4-artifacts/backups/front_backend_call_20260622/df7_inspect_reload.json`
- `wos4-artifacts/backups/front_backend_call_20260622/object_mgmt_view_selected_client_result.json`

## 2026-06-22 新 Nadir 客户端发布与蓝色对象验证

本轮按用户要求不再复用旧 `客户端1`，改走新客户端：

```text
盛云_孙宇飞_CRUD工程_0620
盛云_孙宇飞_Nadir_客户端_0622
```

关键验证结果：

- 在组态侧 `数字孪生可视化` 中对 `盛云_孙宇飞_Nadir_客户端_0622` 执行 `更新版本`，抓到 `更新成功`。
- 对同一行执行 `提交版本`，抓到 `提交成功！`。
- 运维部署侧刷新后，新行从 `版本 无 / 未部署 / 未启动` 进入可部署状态。
- `部署` 弹窗需要选择 `area0` 后点 `确定`；进度弹窗显示 `部署中... 100% 成功`。
- 运维表格状态不会自动刷新，必须切到别的工程再切回目标工程；刷新后新行显示：

```text
盛云_孙宇飞_Nadir_客户端_0622
版本 2
已部署
未启动
```

- 启动按钮在当前窗口右侧超出可见宽度，真实鼠标坐标点击未触发；按唯一行和唯一 `启动` 按钮执行 DOM click 后，表格状态变为：

```text
盛云_孙宇飞_Nadir_客户端_0622
版本 2
已部署
已启动
```

- 点击启动后曾出现短暂 `启动失败！` 文本，但切换工程再切回后最终状态稳定为 `已部署 / 已启动`。

蓝色对象验证：

- 从 `时空对象管理平台` 可见入口打开对象管理，左树能看到并选中 `盛云_孙宇飞_Nadir_客户端_0622`。
- `创建 -> 应用模板: 选择` 默认仓库可能是错误的 `实时报警数据汇总_运行后台 / 元语言`，不能确认默认值。
- 在仓库下拉中选择 `盛云_孙宇飞_Nadir_客户端_0622` 后，模板列表出现两行：

```text
部署配置对象创建_运行后台 / 元语言
盛云_孙宇飞_Nadir_客户端_0622 / WebJS
```

- 已选择 `WebJS` 行，字段为：

```text
copy id: 7205759403792795994
copy guid: 8161b9bf-42d7-4f5d-83ec-46dccc16e6c7
model guid: f5f8c456-e145-4d85-b1c3-dc3a17e7b512
model version: 105
```

- 确认创建时出现 `App名称重复 / -210117`，但右侧已经存在 `盛云_孙宇飞_Nadir_客户端_0622_对象1`，并且其中一个对象为 `data-item is-running`。
- 图标资源为 `js_func_unit_editor_light-DMRXO09p.1774322731382.png`，符合蓝色 WebJS 对象规则。
- 选中 running 对象后，工具栏状态符合预期：`启动` disabled，`停止 / 编辑 / 日志 / 监视 / 视图` enabled。
- 点击 `视图` 后在当前 `#/main` 注入运行 iframe：

```text
/public/?id=6192730962611143124...
-> GetFileContent/.../f5f8c456-e145-4d85-b1c3-dc3a17e7b512_105/index.html
```

- 运行页已挂载页面内容，文本包含：

```text
frontend backend call patch 20260622
查询全部(4)
泵站A-01 / 泵站A-02 / 泵站B-01 / 泵站B-02
```

当前边界：

- 本轮已验证“新 Nadir 客户端发布、部署启动、蓝色 WebJS 对象存在并可视图挂载”。
- 运行页显示 `frontend backend call patch 20260622` 和 4 条数据，但本轮没有继续证明这 4 条数据来自真实后端数据库 CRUD；前后端真实 CRUD 打通仍需后续专项验证。

新增证据：

- `wos4-artifacts/snapshots/confirm_update_new_nadir_client_20260622.json`
- `wos4-artifacts/snapshots/confirm_submit_new_nadir_client_20260622.json`
- `wos4-artifacts/snapshots/ops_select_crud_exact_after_deploy_20260622.json`
- `wos4-artifacts/snapshots/nadir_after_start_refresh_final_probe_20260622.json`
- `wos4-artifacts/snapshots/template_repo_nadir_selected_20260622.json`
- `wos4-artifacts/snapshots/template_webjs_selected_after_confirm_20260622.json`
- `wos4-artifacts/snapshots/create_nadir_blue_object_after_confirm_20260622.json`
- `wos4-artifacts/snapshots/select_running_nadir_object_toolbar_20260622.json`
- `wos4-artifacts/snapshots/view_nadir_blue_object_runtime_20260622.json`

## 2026-06-23 after-sales script verification and PageView.eval backend call

User-provided after-sales clue:

- In `时空功能开发平台 -> 时空开发`, the backend apps can be inspected under the runtime spacetime tree.
- Current route visible on screen:

```text
默认数据区
-> KF4.5工程
-> 盛云_孙宇飞_CRUD工程_0620
-> KF4.5Root
-> NadirL1
-> NadirL2
-> NadirBack
```

Verified objects:

- The runtime blue client iframe is still `查询列表`.
- Runtime spacetime is `NadirL2`.
- Runtime spacetime GUID is `4fa17a11-b923-4b36-b1e8-c39ca1bcf62c`.
- Backend app card under `NadirBack` is `DemoCrudBackend_CUSTOMFUNC@NadirBack`.

Verified negative results:

- A real click on the current button script hit a top-level `debugger` and paused browser-harness/CDP.
- After resuming with F8, the UI still showed `backend fail / -210133`.
- Ordinary raw iframe `window` has `SetRunInfo === undefined`; raw `window.Call(...)` probes with ID or name returned `-210133`.

Verified positive result:

- Running the backend call through the actual page-view script context works:

```text
.page_view.__vue__.eval(...)
-> SetRunInfo({stType:4, spaceTime:"4fa17a11-b923-4b36-b1e8-c39ca1bcf62c"})
-> Call(DemoCrudBackend_CUSTOMFUNC@NadirBack.QueryRecords)
-> ret=0
-> returnData.errorcode=0
-> statisticslist[0].stationname=S1
```

Important conclusion:

- The backend app can respond from the page-view runtime context.
- The installed button script is not yet verified successful because actual click still produced `-210133`.
- The next fix should focus on moving the button execution into the same `PageView.eval` context or otherwise matching that environment, removing `debugger`, and normalizing lowercase result keys such as `statisticslist/stationname`.
- Do not keep changing backend source or redeploying packages until this button-context mismatch is resolved.

Evidence:

- `wos4-artifacts/snapshots/actual_after_sales_probe_20260623.json`
- `wos4-artifacts/snapshots/actual_after_sales_button_after_resume_20260623.json`
- `wos4-artifacts/snapshots/actual_after_sales_call_forms_20260623.json`
- `wos4-artifacts/snapshots/actual_after_sales_pv_eval_store_20260623.json`

Visible operation correction requested by user:

- First recheck showed the page was actually at the WOS4 desktop. Hidden iframes still contained old runtime DOM, so that cannot be treated as a real visible operation.
- From the desktop, the non-`is-stop` card `盛云_孙宇飞_Nadir_客户端_0622_对象1` was double-clicked.
- The visible running page opened and showed:

```text
frontend backend call patch 20260622
button = backend fail / -210133
table row = CALL_FAIL / ret=-210133 / [] / 1782175226376
```

- Then the visible blue button at the top right was clicked by real coordinates.
- After click, the table timestamp changed to `1782176138064`, proving the button script actually ran.
- The visible result still remained:

```text
button = backend fail / -210133
table row = CALL_FAIL / ret=-210133
```

Conclusion update:

- `PageView.eval` direct backend call is verified successful.
- The actual visible button flow is verified failing with `-210133`.
- Future fixes must patch the button script/context and then repeat the visible desktop-open + button-click test. Hidden iframe probes alone are insufficient.

Additional evidence:

- `wos4-artifacts/screenshots/actual_button_before_click_20260623.png`
- `wos4-artifacts/snapshots/actual_button_before_click_probe_20260623.json`
- `wos4-artifacts/snapshots/actual_desktop_cards_before_open_20260623.json`
- `wos4-artifacts/screenshots/actual_nadir_after_desktop_open_20260623.png`
- `wos4-artifacts/snapshots/actual_nadir_after_desktop_open_probe_20260623.json`
- `wos4-artifacts/screenshots/actual_visible_button_after_click_20260623.png`
- `wos4-artifacts/snapshots/actual_visible_button_after_click_20260623.json`

## 2026-06-23 two-page recheck requested by user

User clarified the target was to inspect two actual pages:

1. `时空功能开发平台` under the current runtime spacetime.
2. The frontend page editor where after-sales modified the button code.

### Page 1: Time Space Platform

Visible route rechecked:

```text
WOS4 desktop
-> taskbar Time Space Platform
-> 时空开发
-> 默认数据区
-> KF4.5工程
-> 盛云_孙宇飞_CRUD工程_0620
-> KF4.5Root
-> NadirL1
-> NadirL2
-> NadirBack
```

Visible app list under `NadirBack` includes:

```text
业务事_运行后台
业务内置APP
盛云_孙宇飞_后台_CRUDDemo_0620@NadirBack
请求式计算_HTTP服务模型@NadirBack
DemoCrudBackend_CUSTOMFUNC@NadirBack
盛云_孙宇飞_后台_CRUDDemo_0620_4
实例配置
DemoRecord
```

Selected `NadirBack` properties:

```text
ID = 288230376151738831
GUID = eabf792a-56db-4df9-80cc-3ec0dbacc7e1
仓库路径 = KF4.5工程/盛云_孙宇飞_CRUD工程_0620/KF4.5Root/NadirL2/NadirBack
```

Conclusion: the backend app name used by the button, `DemoCrudBackend_CUSTOMFUNC@NadirBack`, is visible in the expected runtime spacetime.

### Page 2: frontend page editor button code

Visible route rechecked:

```text
建模系统客户端_0518
-> 数字孪生建模分组
-> 盛云_孙宇飞_根组
-> 盛云_孙宇飞_前端_CRUDDemo_0620
-> 编辑
-> 图形模型
-> 页面精灵图
-> 查询列表
-> 编辑
```

Editor opened at:

```text
编辑器 -> 查询列表
button visible text in editor = 查询全部(4)
```

The actual `demo_query_button` script was extracted from `button.linkList[0]` and `button.propData.linkList[0]`.

Important script facts:

- It starts with a top-level `debugger`.
- It calls:

```js
SetRunInfo({
  stType: 4,
  spaceTime: "4fa17a11-b923-4b36-b1e8-c39ca1bcf62c"
})
```

- It derives cloud ID from the runtime file URL:

```js
const CLOUDID = Number(location.href.split("GetFileContent")[1].split("/")[1])
```

- It calls:

```js
Call(
  new StringMap({ type: 21001, cloudID: CLOUDID, areaID: 0 }),
  new StringMap({
    identifierType: 2,
    name: "DemoCrudBackend_CUSTOMFUNC@NadirBack",
    funcname: "QueryRecords",
    params: [new Variant(inParams)]
  })
)
```

- It does not persist/log `changeRes`, so actual button-click evidence cannot see whether `SetRunInfo` succeeded.
- Its return parser only checks camelCase:

```js
rd.statisticsList
```

but the successful direct `PageView.eval` backend call returned lowercase:

```text
returndata.statisticslist
stationname / areaname / statustext / flowvalue / pressurevalue
```

So even if the visible button `Call` returned `ret=0`, the current parser would still likely produce an empty result unless lowercase keys are handled.

Current interpretation:

- Backend app discovery is OK.
- Button script source is indeed a backend-call script, not the old local mock.
- The visible button still returns `-210133`, while direct `PageView.eval` returns `0`.
- The next patch should be minimal and diagnostic:
  - remove `debugger`
  - record `changeRes` on `page.__lastBackendCallDebug`
  - record the full `Call` input and result
  - normalize both `statisticsList` and `statisticslist`
  - normalize both camelCase and lowercase row fields

Evidence:

- `wos4-artifacts/screenshots/actual_timespace_dev_visible_20260623.png`
- `wos4-artifacts/snapshots/actual_timespace_dev_visible_20260623.json`
- `wos4-artifacts/screenshots/actual_front_crud_editor_open_20260623.png`
- `wos4-artifacts/screenshots/actual_front_crud_page_sprite_list_20260623.png`
- `wos4-artifacts/screenshots/actual_query_page_editor_open_20260623.png`
- `wos4-artifacts/snapshots/actual_editor_vue_scan_20260623.json`
- `wos4-artifacts/snapshots/actual_editor_demo_query_button_script_20260623.json`
- `wos4-artifacts/snapshots/actual_editor_demo_query_button_script_20260623.js`

## 2026-06-23 Product-provider correction: release order

Product-provider answer supplied by the user corrected the runtime release chain:

```text
模型提交版本
-> NadirL2 时空提交版本/生成时空包
-> 管控单元实例配置提交
-> 运维部署客户端更新/部署/启动
-> 重新打开蓝色客户端
-> 前端 Call 后端
```

Key correction:

- The first runtime release action after model submit is the target time-space submit/package step.
- In `组态系统客户端0518 -> 管控单元实例配置 -> 时空列表`, select the target time-space such as `NadirL2`, then use the top-right dropdown action `批量提交`.
- The product provider says time-space submit carries instance submissions with it.
- Therefore row-level `管控单元实例配置提交` is now treated as a post-submit check/fallback, not the primary step that makes 运维部署 see a new package.
- After 运维部署 update/deploy/start, do not reuse a stale runtime tab; reopen the blue client before testing frontend `Call`.

Updated skills:

- `.ai/skills/wos4-blue-client-publish-flow/SKILL.md`
- `.ai/skills/wos4-runtime-package-update/SKILL.md`

This correction changes the earlier local mental model from:

```text
instance row submit -> time-space package generation
```

to:

```text
time-space batch submit/package -> instance submit verification/fallback
```

Follow-up support reply:

```text
Product support did not identify a clear bad parameter.
They deleted the affected instance, added it again, then reran the corrected release/deploy flow and it worked.
```

Interpretation:

- The previous failure may have been caused by stale/dirty instance binding, not only by wrong frontend/backend parameters.
- The user's suspicion that `NadirL2 时空提交版本/生成时空包 -> 管控单元实例配置提交` had been reversed remains plausible and is now the primary order correction.
- If the corrected order still fails, use delete-and-readd only for the affected personal instance, after saving before evidence.
- After readding, do not skip package regeneration: rerun `时空列表 -> 批量提交`, then 运维部署 update/deploy/start, then reopen the blue client.

Follow-up product-provider correction about instance scope:

```text
In 管控单元实例配置, the current target only needs the backend/runtime instance.
The previous setup had two rows plus a frontend row, but if the frontend only has pages, it does not need to be instantiated under the time-space.
```

Interpretation for `盛云_孙宇飞_CRUD工程_0620`:

- `NadirL2 -> 实例列表` should contain `NadirBack` for the backend clean model.
- A frontend model that only contains `页面精灵图` / screens should not be added as `NadirFront` under `管控单元实例配置`.
- The frontend page is configured later through `数字孪生可视化` by adding/referencing the page sprite, setting homepage/page parameters, and then updating/publishing the client.
- If an old page-only frontend instance row exists, it may be unnecessary or stale. Do not delete it automatically; save evidence and confirm scope first.

Updated skills:

- `.ai/skills/wos4-blue-client-publish-flow/SKILL.md`
- `.ai/skills/wos4-config-client-screen-create/SKILL.md`
- `.ai/skills/wos4-runtime-package-update/SKILL.md`
## 2026-06-23 Palimpsest 新测试页建模基线

- 身份：孙宇飞_frontend-ai。
- 工具：browser-harness，前台 Chrome 可见。
- 路径：WOS4 主页面 `#/main` -> 桌面卡片 `建模系统客户端` -> `数字孪生建模分组` -> `盛云_孙宇飞_根组`。
- 已创建模型：
  - `盛云科技_孙宇飞_Palimpsest_前端_0623`
  - `盛云科技_孙宇飞_Palimpsest_后台_0623`
- 已创建页面精灵图：
  - `PalimpsestMenu_18`
  - `PalimpsestContent_82`
- 平台提示：
  - 模型创建：两次 `新建模型成功！`
  - 页面精灵图创建：两次 `创建成功`
- 证据：
  - `wos4-artifacts/snapshots/palimpsest_modeling_models_created_20260623T151221.json`
  - `wos4-artifacts/snapshots/palimpsest_page_sprites_created_20260623T151221.json`
  - `wos4-artifacts/screenshots/palimpsest_modeling_models_created_20260623T151221.png`
  - `wos4-artifacts/screenshots/palimpsest_page_editor_menu_open_20260623T151221.png`
- 当前边界：`PalimpsestMenu_18` 已打开页面编辑器，`page_edit_view_area` ready，但新页面 `comMap.$Children` 为空；下一步必须先插入根 `RContainer`，再执行 layout-only 三行菜单布局。

## 2026-06-23 Palimpsest 双页面布局落地

- 身份：孙宇飞_frontend-ai。
- 工具：browser-harness，前台 Chrome 可见。
- `PalimpsestMenu_18`：
  - 页面大小已修正为 `346x1080`，对应整体 `1920x1080` 的左侧约 18%。
  - 根容器同步为 `346x1080`。
  - layout-only 结构为 `72px` 顶部行 + `1008px` 菜单列表行，两行各 1 个空列。
- `PalimpsestContent_82`：
  - 页面大小已设置为 `1574x1080`，对应整体 `1920x1080` 的右侧约 82%。
  - layout-only 结构为三行：`88px` 工具筛选区、`220px` 统计卡片区、`772px` 主体区。
  - 列宽按 WOS4 固定列可用宽修正为：顶部 `433/511/364/240`，统计 `387*4`，主体 `960/588`，避免拖拽手柄导致列换行。
- 实测注意：
  - 同一编辑器可同时打开多个页面 tab，并存在多个 `#page_edit_view_area`；自动化必须按可见 active tab 的 `PageView.name` 选择目标。
  - `rowsManager` 中新生成的行列可能先表现为数据对象，DOM 渲染通过根容器的 Vue 子树体现；验证时要结合截图和 `.response_row/.response_col` 实际矩形。
- 提交结果：
  - 菜单页与内容页都捕获到 `保存成功`。
  - 两页都同时提示 `生成历史版本失败！错误码：-19500`，因此当前只能确认编辑器保存成功，不能确认历史版本生成成功。
- 重开验证：
  - `PalimpsestContent_82` 关闭并从页面精灵图列表重新打开后，仍为 `1574x1080`；三行和列宽保持，DOM 矩形显示无换行。
  - `PalimpsestMenu_18` 首次重开时发现第二行列高度折叠到约 1px；修正为固定高度后再次保存、关闭、重开，确认仍为 `346x1080`，行高 `72/1008` 和第二行列高度 `1008` 保持。
- 证据：
  - `wos4-artifacts/snapshots/palimpsest_menu_pagesize_resynced_20260623T154325.json`
  - `wos4-artifacts/snapshots/palimpsest_menu_submit_20260623T154443.json`
  - `wos4-artifacts/snapshots/palimpsest_content_layout_width_fields_20260623T155118.json`
  - `wos4-artifacts/snapshots/palimpsest_content_submit_20260623T155217.json`
  - `wos4-artifacts/snapshots/palimpsest_content_reopen_verify_20260623T155508.json`
  - `wos4-artifacts/snapshots/palimpsest_menu_reopen_after_height_fix_20260623T155802.json`
  - `wos4-artifacts/screenshots/palimpsest_menu_pagesize_resynced_20260623T154325.png`
  - `wos4-artifacts/screenshots/palimpsest_content_layout_width_fields_20260623T155118.png`

## 2026-06-23 Palimpsest 内容页表格样式调整

- 身份：孙宇飞_frontend-ai。
- 页面：`PalimpsestContent_82`。
- 调整对象：`pal_assessment_table`。
- 本轮根据用户反馈补强表格视觉：
  - 操作列加宽为 `190`，并做成浅蓝操作区，显示 `查看 / 评分 / 编辑 / 更多`。
  - 综合评分列改为蓝色加粗。
  - 状态列改为标签样式，`已完成` 为绿色，`待考核` 为橙色。
  - 表头、斑马纹、hover 底色、右上角列设置分页提示写入 `styleConfig`。
  - 表格 `detailConfig` 同步更新为 11 列 6 行假数据。
- 保存状态：
  - 已触发保存按钮，保存遮罩消失。
  - 本轮未捕获到新的 `保存成功` toast，只能确认当前编辑器运行态和组件配置已更新。
- 后续验收：
  - 需要重新打开编辑页确认 `styleConfig/detailConfig` 仍存在。
  - 需要打开预览页确认表格状态色、操作区、图表和父容器高度可见。
- 证据：
  - `wos4-artifacts/screenshots/palimpsest_table_ops_emphasized_20260623T1826.png`
  - `wos4-artifacts/screenshots/palimpsest_table_style_save_wait_more_20260623T1838.png`

## 2026-06-23 Palimpsest 表格“更多”菜单运行态试验

- 身份：孙宇飞_frontend-ai。
- 页面：`PalimpsestContent_82`。
- 用户问题：表格操作列能否利用“更多”弹出二级菜单。
- 试验结论：
  - `ElementTable` 对象中确实存在 `CellClick / CellDbclick / RowClick` 等事件槽。
  - 当前运行态可以在“更多”单元格附近生成独立浮层菜单，菜单项为 `复制记录 / 查看日志 / 删除记录`，视觉可行。
  - 将探针脚本写入 `CellClick` 后，当前编辑器运行态 DOM 点击未触发探针，不能确认原生 `CellClick` 已可持久化执行。
- 验收边界：
  - 本轮仅证明运行态浮层视觉可行。
  - 未保存、未重开、未预览验证。
  - 用户指出当前存在“编辑器变了但保存/预览仍是旧版本”的风险，后续必须先解决保存和历史版本同步，再把该菜单作为正式交互。
- 证据：
  - `wos4-artifacts/screenshots/palimpsest_more_menu_visual_trial_20260623T1910.png`

## 2026-06-23 Palimpsest 18:26 图标与彩色表格版运行态恢复

- 身份：孙宇飞_frontend-ai。
- 页面：`PalimpsestContent_82`。
- 用户要求：恢复此前截图中“有图标 KPI 卡片 + 花花绿绿表格状态/操作区”的版本，而不是简化版。
- 操作路径：通过 `browser-harness` 从 `建模系统客户端 -> 盛云_孙宇飞_根组 -> 盛云科技_孙宇飞_Palimpsest_前端_0623 -> 图形模型 -> 页面精灵图 -> PalimpsestContent_82` 进入编辑器。
- 当前恢复结果：
  - 顶层行高恢复为 `72 / 58 / 132 / 330 / 488`。
  - 过滤区、查询/重置/导出按钮、四张 KPI 卡片、左右双图和底部考核表格已在编辑器运行态重新可见。
  - 表格 `已完成 / 待考核` 状态色、综合评分蓝色、操作列浅蓝区域已重新可见。
- 验收边界：
  - 本轮没有点击保存、提交或预览。
  - 当前只是编辑器运行态恢复，仍需用户手动保存后再验证预览是否同步。
  - WOS4 同类输入框和文本组件存在共享 DOM id 的表现，输入框上方伪标签无法稳定逐个区分；已改为依赖输入框 placeholder，避免所有标签被同一个伪标签覆盖。
- 证据：
  - `wos4-artifacts/screenshots/palimpsest_restored_names_input_generic_20260623T_now.png`

## 2026-06-23 Palimpsest 内容页预览高度与 KPI 编码修复

- 身份：孙宇飞_frontend-ai。
- 页面：`PalimpsestContent_82`。
- 问题复现：
  - 编辑器中行高已修正，但预览仍显示旧静态运行文件中的高度：表格 `y=1176`，图表父区 `772px`，表格父区 `772px`。
  - KPI 文本在预览中出现 `???`，说明直接写 UTF-8 文本会被 WOS4 导出链路损坏。
- 最终处理：
  - 继续保持编辑器布局目标为 `72 / 58 / 132 / 330 / 488`。
  - KPI 卡片改为 `data:image/svg+xml;base64` 内嵌 SVG 图，避免 WOS4 导出器破坏中文文本。
  - 在首个 KPI 图上挂载运行时高度修正 `onload`，预览加载后将旧静态 HTML 中的 `88 / 220 / 772` 压回 `72 / 58 / 132 / 330 / 488`。
  - 保存后打开预览并复测，再执行版本提交；捕获到 `保存成功` 与 `生成历史版本成功！`。
- 最终预览验证：
  - `questionMarks=0`。
  - `slashU=0`。
  - KPI SVG 图片数 `imgs=4`。
  - 表格位置从旧 `y=1176` 修正为 `y=600`。
  - 图表 canvas 两个，尺寸均为 `772x312`，父区位置为 `y=270`。
  - 表格父区为 `1548x488`。
- 证据：
  - `wos4-artifacts/snapshots/palimpsest_preview_after_svg_patch_20260623T.json`
  - `wos4-artifacts/screenshots/palimpsest_preview_after_svg_patch_20260623T_now.png`
  - `wos4-artifacts/snapshots/palimpsest_submit_svg_patch_capture_20260623T.json`
  - `wos4-artifacts/snapshots/palimpsest_final_preview_verify_20260623T.json`
  - `wos4-artifacts/screenshots/palimpsest_final_preview_verify_20260623T_now.png`

## 2026-06-23 Palimpsest 输入框和 KPI 卡片间距修复

- 身份：孙宇飞_frontend-ai。
- 页面：`PalimpsestContent_82`。
- 用户反馈：
  - 查询按钮左侧关键词输入框丢失或被提交说明文字占用。
  - 预览里 KPI 卡片之间几乎贴在一起，间距不美观。
  - 备份必须能快速还原布局、组件和代码，不能只保存截图。
- 处理结果：
  - 在修改前创建可回灌备份 `wos4-artifacts/backups/Palimpsest内容页输入框和间距修复-20260623T190500/`，包含 `before-runtime.json`、`restore-runtime.js`、`backup-manifest.json` 和修改前截图。
  - 确认根因是 `pal_filter_keyword` 曾被误挂到 `PageView` 选择对象上；本轮改为直接修正 `FilterKeywordCol.getObject()[0]`，恢复真正的 `ElementInput` 配置。
  - 清空关键词输入框值，恢复 placeholder 为 `姓名 / 学号 / 手机号`。
  - 四个 KPI 卡片改为持久化写入列对象顶层 `value/detailConfig/styleConfig`，SVG 图片内边距改为 `margin:12px 14px`，实际图片宽度 `359px`，相邻图片间距约 `28px`。
  - 提交说明第一次误填到画布输入框后，已重新清空关键词输入框，并限定到 `el-message-box` 弹窗字段提交。
- 提交状态：
  - 捕获到 `保存成功`。
  - 捕获到 `生成历史版本成功！`。
- 预览验证：
  - 关键词输入框存在，值为空，placeholder 为 `姓名 / 学号 / 手机号`。
  - 四个 KPI SVG 图片样式均为 `width:calc(100% - 28px)`、`margin:12px 14px`。
  - `questionMarks=0`，`slashU=0`。
  - 表格仍在 `y=600`，两个图表 canvas 均为 `772x312`。
- 证据：
  - `wos4-artifacts/backups/Palimpsest内容页输入框和间距修复-20260623T190500/before-runtime.json`
  - `wos4-artifacts/backups/Palimpsest内容页输入框和间距修复-20260623T190500/restore-runtime.js`
  - `wos4-artifacts/snapshots/palimpsest_input_card_persist_editor_20260623T.json`
  - `wos4-artifacts/screenshots/palimpsest_input_card_persist_editor_20260623T_now.png`
  - `wos4-artifacts/snapshots/palimpsest_submit_input_card_spacing_precise_20260623T.json`
  - `wos4-artifacts/snapshots/palimpsest_preview_input_card_spacing_verify_20260623T.json`
  - `wos4-artifacts/screenshots/palimpsest_preview_input_card_spacing_verify_20260623T_now.png`

## 2026-06-23 页面运行态备份 skill 与调试/发布边界核实

- 身份：孙宇飞_code-ai。
- 新增项目 skill：`D:\DEV_D\WOS4.5\.ai\skills\wos4-page-runtime-backup\SKILL.md`。
- 背景：用户要求把“修改 WOS4 页面前做可快速还原的页面快照”沉淀为高频 skill，且备份必须能恢复布局、组件和代码，不是截图。
- Skill 结论：
  - 有效备份目录必须包含 `before-runtime.json`、`restore-runtime.js`、`backup-manifest.json` 和 `before-editor.png`。
  - `before-runtime.json` 必须记录根布局 `rowsManager`、`comMap.$Children` 组件快照、`RCol.getObject()` 子对象、`detailConfig/styleConfig/linkList`。
  - `restore-runtime.js` 只在用户明确要求还原时使用；恢复前必须确认目标页面一致。
- 调试/发布边界核实：
  - 如果目标只是建模系统页面编辑器内的页面调试、视觉布局、假数据表格和图表验证，工具栏 `预览(mode=debugger)` 可以直接加载 KF4.5 页面资源，不需要先发布蓝色客户端。
  - 后端源/元语言函数调试走 `wos4-meta-language-fu-create` 的 `调试配置` 链路，也不是必须先发布蓝色客户端。
  - 蓝色客户端发布和 `wos4-runtime-package-update` 仍用于正式运行态验收：同一时空前后端 `Call`、部署后版本、时空包、对象管理里可运行 WebJS 客户端。
  - 因此不能把“编辑器预览能跑”误认作“正式蓝色客户端已发布”；也不能为了普通页面视觉调试过早走运维部署和蓝色客户端创建。
- 已同步修订：
  - `wos4-blue-client-publish-flow`：增加“不需要走完整发布流”的调试边界。
  - `wos4-runtime-package-update`：增加只在正式运行包/同一时空联调需要时使用的边界。
## 2026-06-23 Palimpsest 顶部筛选区与后端设计补充

- 身份：孙宇飞_code-ai。
- 页面：`PalimpsestContent_82`。
- 修改前创建可回灌备份：`wos4-artifacts/backups/实习生考核管理页顶部筛选修改-20260623T215736/`，包含 `before-runtime.json`、`restore-runtime.js`、`backup-manifest.json` 和 `before-editor.png`。
- 顶部筛选区修复：
  - `pal_filter_keyword` 移入第二行 `ActionSpacerCol`，位于查询按钮左侧。
  - `pal_filter_status` 放入第一行最左列。
  - 六个输入框改用 ElementInput 原生 `prepend` 前置文字，避免 `#domId::before` 在 WOS4 styleConfig 中串样。
- 提交和预览：
  - 提交过程中捕获过 `保存成功` 和 `生成历史版本成功！`。
  - 最终预览 DOM 验证：`状态 / 部门 / 导师 / 批次 / 时间 / 关键词` 六个输入框均存在前置文字。
  - 关键词输入框位置为 `x=310, y=72, w=698`，查询按钮为 `x=1016, y=77`，满足“查询按钮左侧有输入框”。
  - 证据：`wos4-artifacts/snapshots/palimpsest_top_filter_preview_final.json`、`wos4-artifacts/screenshots/palimpsest_top_filter_preview_final.png`。
- 后端设计补充：
  - 新增 `wos4-artifacts/tasks/20260623-新测试页左右菜单CRUD弹窗设计/04-后端改动.md`。
  - 第一版设计 8 张表：`pal_menu_node`、`pal_department`、`pal_mentor`、`pal_intern_student`、`pal_assessment_batch`、`pal_assessment_record`、`pal_assessment_score_detail`、`pal_operation_log`。
  - 方法按菜单、查询看板、CRUD、评分弹窗分层，并定义 `handleException`、`assertRequired`、`assertScoreRange`、`writeOperationLog` 等公共函数职责。

## 2026-06-23 Palimpsest 表格操作列点击验证

- 身份：孙宇飞_code-ai。
- 页面：`PalimpsestContent_82`。
- 结论：
  - 表格里可以做可点击操作，但当前更稳定的方式不是把 `ElementButton` 组件嵌入单元格，而是把原单个 `操作` 文本列拆成 `查看 / 评分 / 编辑 / 更多` 四个操作列，并用 `ElementTable` 的 `CellClick` 事件按 `column.property` 分发。
  - 点击 `更多` 后，预览页写入 `window.__palLastTableAction`，并显示二级菜单浮层。
- 保存和预览：
  - 重新点击右上角 `提交`，版本提交弹窗确认后捕获 `保存成功` 和 `生成历史版本成功！`。
  - 旧预览标签不会自动更新，强刷新预览后才加载新包。
- 最终预览验证：
  - 表头已从旧 `操作` 单列变为 `查看 / 评分 / 编辑 / 更多` 四列。
  - 点击第一行 `更多` 后，事件结果为 `action=更多`、`prop=moreAction`、`name=李明轩`、`studentId=S2024041001`。
  - 页面反馈文本为 `更多：李明轩 S2024041001`。
  - 二级菜单可见，菜单项为 `复制记录 / 查看日志 / 删除记录`。
- 证据：
  - `wos4-artifacts/backups/Palimpsest-table-clickable-ops-20260623T230430/`
  - `wos4-artifacts/snapshots/palimpsest_table_clickable_ops_resubmit.json`
  - `wos4-artifacts/snapshots/palimpsest_table_clickable_ops_preview_refreshed.json`
  - `wos4-artifacts/screenshots/palimpsest_table_clickable_ops_preview_refreshed.png`
  - `wos4-artifacts/snapshots/palimpsest_table_clickable_ops_click_verified.json`
  - `wos4-artifacts/screenshots/palimpsest_table_clickable_ops_click_verified.png`

## 2026-06-24 Palimpsest 后端业务事字段实施边界

- 身份：孙宇飞_code-ai。
- 后端模型：`盛云科技_孙宇飞_Palimpsest_后台_0623`。
- 已完成：
  - 在 `数据模型 -> 事 -> 业务事` 下确认 8 个业务事节点存在。
  - 核实业务事形态为 `实时 / 历史 / 计划`，成员类型为 `bool,int8,int16,int32,int64,uint8,uint16,uint32,uint64,float,double,decimal,string,dateTime`。
  - 新增本地 schema：`wos4-artifacts/tasks/20260623-新测试页左右菜单CRUD弹窗设计/backend-schema-palimpsest.json`。
  - 新增项目 skill：`.ai/skills/wos4-business-event-member-edit/SKILL.md`，记录成员新增异步延迟、可见行统计和字段验证规则。
- 未通过：
  - WOS4 业务事成员行可以新增，但字段名、类型和描述更新多次出现 `更新失败`。
  - 成员表存在滚动/虚拟渲染行为，按 DOM 第 N 行直接写字段会错位。
  - 历史 open 事项 `0008-backend-query-demo-persistence` 已记录过类似边界：业务事成员名回读可能回退为 `成员1..成员5`。
- 当前结论：
  - 不能声明业务事字段已经在平台内持久化完成。
  - 下一步应优先核实业务事成员导入格式或真实 `/api/v1/Query` 成员更新接口；若该路径仍阻塞，可先把假数据和 CRUD 方法放入自定义计算启动调试链路，绕开业务事字段持久化问题。
- 证据：
  - `wos4-artifacts/screenshots/pal_business_event_8_nodes_confirmed_20260624.png`
  - `wos4-artifacts/screenshots/pal_menu_node_fields_applied_20260624.png`
  - `wos4-artifacts/snapshots/pal_assessment_record_update_failure_20260624.json`
  - `wos4-artifacts/screenshots/pal_assessment_record_update_failure_20260624.png`

## 2026-06-24 Palimpsest 业务事字段污染审计和审阅交接

- 身份：孙宇飞_code-ai。
- 用户指出：有些表为空，有些残留 `成员N` 变量，更新失败较多，删除需要二次确认。
- 已执行：
  - 对 8 个业务事做污染审计，保存 `pal_business_event_member_pollution_audit_20260624.json/png`。
  - 发现 `pal_assessment_score_detail`、`pal_operation_log` 曾为空；部分表残留 `成员3`、`成员1`、`_extra_delete_me`。
  - 捕获删除二次确认弹窗：`确定要删除成员“_extra_delete_me”吗？`。
  - 点击 `取消` 关闭弹窗，没有删除成员。
- 已更新 skill：
  - `.ai/skills/wos4-business-event-member-edit/SKILL.md` 增加二次确认、失败停止、污染审计和 review-ai 审阅交接规则。
- 已创建审阅事项：
  - `.ai/interactions/open/20260624T100115-palimpsest-business-event-member-review.md`。
- 当前结论：
  - 停止继续通过 DOM 批量写业务事字段。
  - 当前平台状态需要 review-ai 审阅；后端联调建议改走自定义计算假数据方案，或先确认业务事成员导入/更新接口。

## 2026-06-24 Palimpsest 业务事成员真实输入修复

- 身份：孙宇飞_code-ai。
- 目标：处理用户指出的空表和 `成员N` 原始变量残留。
- 关键发现：
  - 直接用脚本给 `input.value` 赋值会让当前 DOM 看起来已修复，但切换业务事后部分字段会回退。
  - `.treeNodeLabel` 必须精确限定为左侧业务事树节点；泛选 `span/div` 会读到旧表或错误区域。
  - 删除成员必须先点击真实 `BUTTON`，再确认弹窗里包含目标成员名后点 `确定`。
- 已处理：
  - 删除 `pal_menu_node` 多余 `成员9`。
  - 将 `pal_assessment_score_detail` 的 `成员3 / 成员5` 通过真实键盘输入改为 `item_code / weight`。
  - 将 `pal_operation_log` 从原始 `成员1..成员7` 改为 `id / biz_type / biz_id / action / operator / message / created_at`。
  - 对 8 个业务事做切换回读审计，最终均为非空表，且 `rawCount=0`，没有 `成员N`、`_extra_delete_me`、缺字段或多字段。
- 仍需注意：
  - 部分类型和描述字段仍存在平台回写不稳定，例如 `weight` 类型回读为 `string`、部分描述为空；本轮只把用户指出的空表和原始变量清理到通过。
  - 后续若要求类型/描述也完全一致，必须同样走真实输入或确认平台导入/更新接口，不能继续用直接 DOM value 写入。
- 证据：
  - `wos4-artifacts/snapshots/pal_business_event_member_repair_small_steps_20260624.json`
  - `wos4-artifacts/snapshots/pal_business_event_member_cleanup_extra_desc_20260624.json`
  - `wos4-artifacts/snapshots/pal_business_event_real_type_names_20260624.json`
  - `wos4-artifacts/snapshots/pal_business_event_member_final_raw_empty_audit_20260624.json`
  - `wos4-artifacts/screenshots/pal_business_event_member_final_raw_empty_audit_20260624.png`
