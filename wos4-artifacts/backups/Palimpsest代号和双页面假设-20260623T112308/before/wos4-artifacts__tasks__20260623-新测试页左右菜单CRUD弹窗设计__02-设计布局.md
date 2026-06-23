# 02 设计布局

## 图片和参考

参考图：`assets/参考图-人才管理考核页.png`

参考图拆解：

- 左侧固定菜单，顶部有系统名称和折叠菜单按钮。
- 右侧为业务内容页，顶部是面包屑/搜索/用户区。
- 内容页第一块是筛选区，包含关键字、部门、导师、批次、日期和查询按钮。
- 中部是统计卡片和图表区。
- 底部是业务表格。
- 中央有一个“考核评分”弹窗，包含表单、评分项、备注和提交按钮。

## 布局拆解

第一版不做两个独立页面对象并排，采用一个页面内的左右分栏：

- `LeftMenuArea`：左侧菜单区，固定宽度。
- `RightPageArea`：右侧页面区，占剩余宽度。
- `RightHeaderRow`：右侧顶部标题/全局搜索/用户信息。
- `FilterRow`：筛选区。
- `SummaryRow`：统计卡片区。
- `MainAnalysisRow`：图表区，左右两列。
- `TableRow`：表格区。
- `OverlayLayer`：弹出层或抽屉承载区。

## WOS4 布局方案

只描述布局结构，不放业务组件。

```text
RootShell
└─ ShellRow fixed/100%
   ├─ LeftMenuCol fixed 240
   │  └─ LeftMenuContainer
   │     ├─ MenuBrandRow fixed 56
   │     ├─ MenuItemsRow remaining
   │     └─ MenuFooterRow fixed 48
   └─ RightPageCol remaining
      └─ RightPageContainer
         ├─ RightHeaderRow fixed 56
         ├─ FilterRow fixed 116
         ├─ SummaryRow fixed 112
         ├─ MainAnalysisRow fixed 260
         │  ├─ BarChartCol percentage 50
         │  └─ TrendChartCol percentage 50
         ├─ TableRow remaining min 320
         │  └─ DataTableCol percentage 100
         └─ OverlayRow absolute/hidden
            └─ DialogHostCol fixed or centered
```

如果 WOS4 不支持可靠 absolute overlay，则弹窗降级为右侧抽屉：

```text
RightPageContainer
└─ ContentAndDrawerRow remaining
   ├─ MainContentCol percentage 72
   └─ DrawerCol percentage 28 / hidden when closed
```

## 尺寸策略

- 固定高度：
  - 左侧品牌区：56。
  - 左侧底部收起区：48。
  - 右侧顶部：56。
  - 筛选区：116。
  - 统计卡片区：112。
  - 图表区：260。
- 剩余空间：
  - 表格区使用剩余空间，最小高度建议 320。
  - 左侧菜单项区使用剩余空间。
- 最小高度：
  - 页面整体建议不小于 760。
  - 表格父行不低于 320。
  - 图表父行不低于 240。
- 列宽百分比：
  - 顶层左列固定 240，右列剩余。
  - 图表区两列 50/50。
  - 表格区单列 100。
  - 如果加入右侧抽屉，主内容 72，抽屉 28，合计不超过 100。
- gap：
  - 右侧页面内部行间距建议 8 到 12。
  - 图表区列间距建议 8。
- 响应式策略：
  - 当前按桌面管理页优先，不做移动端。
  - 窄屏时左侧菜单可降为固定 64 图标栏，但这属于第二阶段。

## 组件放置建议

- 左侧菜单：第一版用按钮/文本项模拟，后续再验证导航菜单组件。
- 筛选区：输入框 + 按钮优先；选择器、日期选择器属于待验证组件，第一版可用输入框替代。
- 统计卡片：优先用容器 + 文本文案；若文本组件不稳，则使用只读表格或按钮文案降级。
- 图表：优先用已验证折线图；柱状图属于未重新验收组件，若要完全贴近参考图，需单独验证。
- 表格：用已验证 ElementTable。
- 弹窗：优先同页遮罩/居中面板；不稳则右侧抽屉。

## 验收条件

- 布局阶段完成后重新读取 `comMap.$Children`，确认目标行列和尺寸策略存在。
- 同行所有可见百分比列逻辑宽度和 `<= 100`。
- 表格父容器高度可用，预览中表格不塌陷。
- ECharts canvas 有可见高度。
- 主区域不挤压到左上角。
- 左侧菜单和右侧内容无重叠。
- 弹出层打开时不破坏底层布局；若用抽屉，抽屉显隐不改变整体行高。
- 预览截图验证通过。
