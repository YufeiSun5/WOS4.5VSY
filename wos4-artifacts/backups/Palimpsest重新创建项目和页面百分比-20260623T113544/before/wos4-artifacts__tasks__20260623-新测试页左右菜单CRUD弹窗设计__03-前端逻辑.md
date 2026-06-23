# 03 前端逻辑

## 页面变量

| 变量名 | 类型 | 默认值 | 用途 |
|---|---|---|---|
| `activeMenu` | string | `assessment` | 当前左侧菜单项 |
| `activeContentPage` | string | `assessmentList` | 右侧内容页面或内容区状态 |
| `filterKey` | string | 空 | 关键字筛选 |
| `filterDept` | string | `ALL` | 部门筛选 |
| `filterStatus` | string | `ALL` | 状态筛选 |
| `recordsJson` | string | 假数据 JSON | 当前表格数据缓存 |
| `selectedRecordId` | string | 空 | 当前编辑/查看的记录 ID |
| `dialogMode` | string | `closed` | `closed/create/edit/score/view/deleteConfirm` |
| `dialogFormJson` | string | `{}` | 弹出页表单数据 |
| `refreshCounter` | number | `0` | 触发刷新和测试对比 |
| `lastCrudResult` | string | 空 | 后端或 mock CRUD 返回摘要 |

## 组件清单

| 组件 | WOS4 类型 | 所在布局槽位 | 关键配置 |
|---|---|---|---|
| 左侧菜单按钮组 | `ElementButton` 或文本/按钮组合 | `MenuItemsRow` | 设置 `activeMenu`，第一版不依赖导航菜单组件 |
| 关键字输入 | `ElementInput` | 右侧内容页 `FilterRow` | placeholder：姓名 / 学号 / 手机号 |
| 查询按钮 | `ElementButton` | `FilterRow` | 更新筛选变量并刷新表格/图表 |
| 新增按钮 | `ElementButton` | `FilterRow` | 打开 `dialogMode=create` |
| 重置按钮 | `ElementButton` | `FilterRow` | 清空筛选变量 |
| 导出按钮 | `ElementButton` | `FilterRow` | 第一版可先禁用或仅提示 |
| KPI 摘要 | 容器 + 文本或降级表格 | `SummaryRow` | 总数、待考核、已完成、平均分 |
| 部门得分图 | `ElementChart` 优先折线图 | `BarChartCol` | 第一版可用折线图或表格替代柱状图 |
| 完成趋势图 | `ElementChart` 折线图 | `TrendChartCol` | 完成数、待考核数 |
| 数据表格 | `ElementTable` | `DataTableCol` | 列和数据写入 `detailConfig` |
| 弹出页/抽屉 | 同页容器模拟 | `OverlayLayer` 或 `DrawerCol` | 根据 `dialogMode` 显隐 |

## 交互流程

1. 页面创建时加载假数据：
   - 优先从后端 `QueryRecords` 读取。
   - 若后端未接通，则从 `recordsJson` 默认假数据读取。
2. 左侧菜单点击：
   - 设置 `activeMenu`。
   - 双页面方案下，通过平台页面通信、变量、SetPage 或已验证的客户端机制影响右侧 `PalimpsestContent`。
   - 单页面降级方案下，直接设置 `activeContentPage` 并刷新右侧内容区。
   - 第一版右侧内容可只做 `assessment` 主页面，其他菜单显示占位状态。
   - 不存在顶部菜单；所有全局入口都由左侧菜单承担。
3. 查询：
   - 读取 `filterKey/filterDept/filterStatus`。
   - 调用本地过滤或后端 `QueryRecords`。
   - 刷新表格、KPI 和图表。
4. 新增：
   - 设置 `dialogMode=create`。
   - 初始化 `dialogFormJson`。
   - 提交时调用 `CreateRecord` 或本地 mock。
5. 编辑/评分：
   - 设置 `selectedRecordId`。
   - 把当前行数据写入 `dialogFormJson`。
   - 设置 `dialogMode=edit` 或 `dialogMode=score`。
   - 提交时调用 `UpdateRecord`。
6. 删除：
   - 第一版可先用弹窗确认或右侧抽屉确认。
   - 调用 `DeleteRecord` 后刷新。

## 脚本和事件

- 创建时：
  - 初始化页面变量。
  - 加载假数据。
  - 调用统一 `refreshView()`。
- 按钮点击：
  - 不写顶层 `await`。
  - 后端调用使用 `Call(...).then(...).catch(...)` 或在平台认可的 page-view eval 环境中执行。
  - 记录 `ret/errorcodes` 到 `lastCrudResult`。
- 变量变化：
  - 当前变量改变 link 不是稳定已验证能力，第一版不依赖它。
  - 采用按钮脚本直接刷新表格和图表。
- 表格刷新：
  - `table.table({ columns, totalData })`。
  - 同步更新 `recordsJson`。
- 图表刷新：
  - `chart.SetOption(option, true)`。
  - 持久化时写 `detailConfig = "option=..."`。

## 表格列设计

| 字段 | 标签 | 说明 |
|---|---|---|
| `name` | 姓名 | 学员姓名 |
| `studentNo` | 学号 | 唯一业务编号 |
| `department` | 部门 | 产品部、研发部等 |
| `mentor` | 导师 | 导师姓名 |
| `batch` | 实习批次 | 例如 2024 春招 |
| `professionalScore` | 专业能力 | 0 到 40 |
| `attitudeScore` | 工作态度 | 0 到 20 |
| `deliveryScore` | 任务完成度 | 0 到 20 |
| `teamScore` | 团队协作 | 0 到 10 |
| `innovationScore` | 创新能力 | 0 到 10 |
| `totalScore` | 综合评分 | 自动汇总 |
| `status` | 状态 | 待考核、已完成 |
| `updatedAt` | 更新时间 | 最近修改时间 |

## 弹出页表单

- 基础信息：姓名、学号、部门、导师、批次。
- 评分项：专业能力、工作态度、任务完成度、团队协作、创新能力。
- 自动汇总：综合评分。
- 备注：评语。
- 按钮：取消、提交。

## 运行态验证

- 编辑器预览：
  - 菜单、筛选、表格、图表、弹出页可见。
  - 点击查询后数据变化。
  - 打开弹窗后表单字段正确。
- 正式运行页：
  - 从蓝色 WebJS 客户端对象打开。
  - 在 inner `.page_view.__vue__` 下验证时空和页面挂载。
  - 如果走双页面方案，必须同时看到 `PalimpsestMenu` 和 `PalimpsestContent` 两个页面区域。
- 蓝色客户端对象：
  - 可见按钮点击必须通过。
  - 不能只用 raw iframe `window.Call(...)` 当验收依据。
