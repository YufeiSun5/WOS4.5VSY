# WOS4 Layout Property Map

本文件记录页面编辑器里布局三层对象的可操作属性和对应运行时方法。

结构模型：

`RContainer -> RRow -> RCol -> object`

判定原则：

- `RContainer` 管整块布局和行集合
- `RRow` 管一行的列集合、行高、行内边距、列间距、换行策略
- `RCol` 管单个格子的宽度、偏移、显隐、对齐、高度和子对象

## 1. RContainer 容器层

运行时对象字段来自 `container.data`。

### 核心字段

- `UIName`
- `KSCGUID`
- `prototypeName = "RContainer"`
- `objectType = 1`
- `ResponseLayoutId`
- `layoutType`
- `displayType`
- `isRoot`
- `parentGUID`
- `rowsManager`
- `rowsNumber`

### 尺寸与位置

- `width`
- `height`
- `leftTopPt_x`
- `leftTopPt_y`

### 视觉样式

- `backgroundColor`
- `picSrc`
- `borderWidth`
- `borderColor`
- `borderRadius`
- `boxShadow`
- `isShowBorder`
- `styleConfig`

### 状态

- `visible`
- `runVisible`
- `lock`
- `conditionConfig`

### 已确认可调用方法

基础属性：

- `setName` / `getName`
- `setGUID` / `getGUID`
- `setDescription` / `getDescription`
- `setProperty` / `getProperty`

尺寸与位置：

- `setWidth` / `getWidth`
- `setHeight` / `getHeight`
- `setMinWidth`
- `setLeftTopPtX` / `getLeftTopPtX`
- `setLeftTopPtY` / `getLeftTopPtY`

样式：

- `setBackground` / `getBackground`
- `setBackgroundColor` / `getBackgroundColor`
- `setPicSrc` / `getPicSrc`
- `setBorderWidth` / `getBorderWidth`
- `setBorderColor` / `getBorderColor`
- `setBorderRadius` / `getBorderRadius`
- `setBoxShadow` / `getBoxShadow`
- `setIsShowBorder` / `getIsShowBorder`
- `styleConfig`
- `removeStyleConfig`
- `removePropertyStyleConfig`
- `evalStyleConfig`

布局结构：

- `setRowsNumber` / `getRowsNumber`
- `addRow`
- `handleDeleteRows`
- `deleteRows`
- `deleteCols`
- `setLayoutType` / `getLayoutType`
- `setLayoutMode`
- `setDisplayType` / `getDisplayType`
- `displayTypeChange`
- `setAutoHeight`
- `resetContainerSize`
- `updataMountRow`

状态：

- `setVisible` / `getVisible`
- `setLock` / `getLock`
- `setSelectStatus` / `getSelectStatus`

### 容器层解释

- `rowsManager` 是行对象源数据数组
- `setRowsNumber` 负责扩容，不负责任意安全缩容
- 真正删行走 `handleDeleteRows`
- 容器本身不直接装普通组件；组件最终还是落到 `RCol.object`

## 2. RRow 行层

运行时对象字段来自 `row.row`。

### 核心字段

- `UIName`
- `KSCGUID`
- `prototypeName = "RRow"`
- `objectType = 5`
- `parentGUID`
- `colsManager`
- `colsNumber`
- `index`

### 尺寸

- `height`
- `origHeight`
- `autoHeight`
- `origAutoHeight`
- `contentHeight`
- `contentWidth`
- `minSize`

### 行高策略与列宽策略

- `heightStrategy`
- `colStrategy`

### 行间距/边距

- `rowGapStrategy`
- `rowGap.top`
- `rowGap.right`
- `rowGap.bottom`
- `rowGap.left`
- `rowGap.autotop`
- `rowGap.autoright`
- `rowGap.autoleft`
- `rowGap.autobottom`
- `colsGap`
- `colsAutoGap`
- `wrapRowMargin`
- `wrapRowAutoMargin`

### 视觉样式

- `backgroundColor`
- `picSrc`
- `borderWidth`
- `borderColor`
- `borderRadius`
- `boxShadow`
- `styleConfig`

### 状态

- `isShow`
- `visible`
- `lock`
- `dragResizeFlag`
- `conditionConfig`
- `warpCols`

### 已确认可调用方法

基础属性：

- `setName` / `getName`
- `setGUID` / `getGUID`
- `setProperty` / `getProperty`

行列结构：

- `setColsManager` / `getColsManager`
- `setColsNumber` / `getColsNumber`
- `addCol`
- `handleDeleteCols`
- `clearRow`
- `removeRowSelf`
- `copyRowSelf`
- `dragAndCopyCols`

尺寸与策略：

- `setRowHeight` / `getRowHeight`
- `updateRowHeight`
- `setHeightStrategy` / `getHeightStrategy`
- `setColStrategy` / `getColStrategy`
- `setMinSize` / `getMinSize`
- `setAutoColWidth`
- `calculateRowColsWidth`
- `initColsCompose`
- `warpRowCal`
- `wrapInRow`

间距与边距：

- `setRowGap` / `getRowGap`
- `setRowGapTop`
- `setRowGapRight`
- `setRowGapBottom`
- `setRowGapLeft`
- `setRowGapStrategy` / `getRowGapStrategy`
- `getAutoRowGap`
- `setColGap`
- `getColGap`
- `getColAutoGap`
- `setWrapRowMargin`
- `getWrapRowMargin`
- `getAutoWrapRowMargin`
- `calculateRowGap`
- `initRowGapAndColsGap`

对齐与显示：

- `setHorizontalAlign`
- `setRowShow` / `getRowShow`
- `setRowVisible` / `getRowVisible`
- `setRowDragResize` / `getRowDragResize`

样式：

- `setBackground` / `getBackground`
- `setBackgroundColor` / `getBackgroundColor`
- `setPicSrc` / `getPicSrc`
- `setBorderWidth` / `getBorderWidth`
- `setBorderColor` / `getBorderColor`
- `setBorderRadius` / `getBorderRadius`
- `setBoxShadow` / `getBoxShadow`
- `styleConfig`
- `pasteStyle`
- `removeStyleConfig`
- `evalStyleConfig`

状态：

- `setLocked` / `getLocked`
- `setSelectStatus` / `getSelectStatus`
- `setConditionConfig`

### 行层解释

- `colsManager` 是本行列对象数组
- `addCol(n)` 在当前行内部增列
- `handleDeleteCols(cols)` 才是真正删列
- `heightStrategy` 已看到 `fixedsize`
- `colStrategy` 控制列宽计算方式
- `rowGap` 更像行容器内边距，不是列偏移
- `wrapRowMargin` / `warpCols` 说明行层存在换行布局能力

## 3. RCol 列层

运行时对象字段来自 `col.col`。

### 核心字段

- `UIName`
- `KSCGUID`
- `prototypeName = "RCol"`
- `objectType = 6`
- `parentGUID`
- `index`
- `range`
- `object`

### 宽度与响应式

- `widthStrategy`
- `sameWidth`
- `minWidth`
- `minSize`
- `xsWidth`
- `smWidth`
- `mdWidth`
- `lgWidth`
- `xlWidth`
- `xsAutoWidth`
- `smAutoWidth`
- `mdAutoWidth`
- `lgAutoWidth`
- `xlAutoWidth`

### 显隐响应式

- `xsIsShow`
- `smIsShow`
- `mdIsShow`
- `lgIsShow`
- `xlIsShow`
- `visible`
- `isShow`

### 对齐与高度

- `horinzontal`
- `vertical`
- `heightStrategy`
- `colHeight`
- `autoHeight`
- `rateOfWidthHeight`
- `lockWidthHeight`

### 偏移

- `offset`
- `offsetRight`
- `autoOffset`
- `autoOffsetRight`
- `offsetStrategy`
- `offsetValid`
- `offsetAnimation`

### 视觉与状态

- `backgroundColor`
- `conditionConfig`
- `dragResizeFlag`
- `lock`
- `isNewCol`
- `uiInputLinkList`
- `uiOutputLinkList`

### 已确认可调用方法

基础属性：

- `setName` / `getName`
- `setGUID` / `getGUID`
- `setProperty` / `getProperty`
- `getObject`
- `setObject`

子对象与嵌套：

- `addChild`
- `dropEvent`
- `clearCol`
- `removeComponent`
- `removeColSelf`
- `setChild`
- `renameAllObject`

宽度与响应式：

- `setStrategy` / `getStrategy`
- `setAllWidth` / `getAllWidth`
- `setAllDisplayWidth`
- `setResponseColWidth`
- `setResponseColWidthXS`
- `setResponseColWidthSM`
- `setResponseColWidthMD`
- `setResponseColWidthLG`
- `setResponseColWidthXL`
- `getResponseColWidth`
- `getAutoResponseColWidth`
- `setResponseShow`
- `setResponseShowXS`
- `setResponseShowSM`
- `setResponseShowMD`
- `setResponseShowLG`
- `setResponseShowXL`
- `getResponseShow`

偏移：

- `setOffset` / `getOffset`
- `getOffsetRow`
- `setOffsetStrategy` / `getOffsetStrategy`
- `setOffsetValid` / `getOffsetValid`
- `getAutoOffset`
- `setOffsetAnimation`
- `setColOffsetAnimation`
- `offsetAnimation`
- `offsetAnimationStyle`

高度与对齐：

- `setColHeight` / `getColHeight`
- `setColHeightStrategy` / `getColHeightStrategy`
- `getAutoColHeight`
- `setHorPosition` / `getHorPosition`
- `setVerPosition` / `getVerPosition`
- `getTopGap`

显隐与状态：

- `setColShow` / `getColShow`
- `setColVisible` / `getColVisible`
- `setSelectStatus` / `getSelectStatus`
- `setLocked` / `getLocked`
- `setLockWidthHeight` / `getLockWidthHeight`
- `setLockedHeight`
- `setMinSize` / `getMinSize`
- `setColDragResize` / `getColDragResize`

### 列层解释

- `object` 是单槽位数组，普通情况下只保留一个主子对象
- `addChild` 是最接近真实拖拽的代码入口
- `prototypeName === "RCol"` 的拖入不是子组件，而是结构操作
- 偏移是列级能力，不只是视觉 margin
- 响应宽度是多断点控制，字段已确认至少有 XS/SM/MD/LG/XL

## 4. 需求驱动布局时最值得先管的属性

按优先级建议：

### 第一层：先让结构成立

- 容器：`rowsNumber`
- 行：`colsNumber`
- 列：`object`

### 第二层：让占比接近需求

- 行：`heightStrategy`, `height`
- 列：`widthStrategy`, `xs/sm/md/lg/xlWidth`, `sameWidth`
- 必须明确列宽是响应式百分比还是固定尺寸；报表和仪表盘优先响应式百分比。
- 不允许主数据行 `percentage=100` 后继续叠加固定底部行。

### 第三层：让布局可用

- 行：`rowGap`, `colsGap`, `wrapRowMargin`
- 列：`offset`, `offsetStrategy`, `offsetValid`
- 列：`horinzontal`, `vertical`

### 第四层：让预览稳定

- 列：`xs/sm/md/lg/xlIsShow`
- 容器/行/列：`visible`, `runVisible`, `isShow`
- 列：`minSize`, `minWidth`
- 表格和图表：父行/父列必须有稳定高度，预览页要检查真实 table/canvas 高度。

## 5. 需求翻译建议

把用户需求先翻成布局树，不要先想具体 `RCol11` 之类的运行时名字。

推荐中间结构：

```json
{
  "type": "container",
  "rows": [
    {
      "heightStrategy": "fixedsize",
      "height": 96,
      "cols": [
        {
          "widths": { "xl": "100" },
          "child": { "type": "component", "component": "title" }
        }
      ]
    },
    {
      "heightStrategy": "percentage",
      "height": 100,
      "cols": [
        {
          "widths": { "xl": "25" },
          "child": { "type": "component", "component": "tree" }
        },
        {
          "widths": { "xl": "75" },
          "child": {
            "type": "container",
            "rows": [
              { "cols": [ { "child": { "type": "component", "component": "filterBar" } } ] },
              { "cols": [ { "child": { "type": "component", "component": "table" } } ] }
            ]
          }
        }
      ]
    }
  ]
}
```

再把它落到：

- 容器：补行
- 行：补列
- 列：设宽度/偏移/显隐
- 空列：放子布局或组件

## 6. 当前已验证的强结论

- 可以把根布局重整为 2x2
- 可以在空白列放子布局
- 可以对子布局继续分列分行
- 可以往子布局格子里放文本组件
- 可以在子布局的空格继续套第二层布局
- 一旦列里已有组件，再放布局是替换，不是并存
