---
name: wos4-page-variable-edit
description: WOS4 页面精灵图变量列表扫描和变量值修改流程。用于在页面编辑器中读取 PageView 变量表、修改 varDefaultValue/varValue、修复变量表旧值、处理重复变量、保存提交后复核变量是否持久化，尤其适用于 palMenuConfigJson、currentSpaceTime、筛选条件、菜单配置 JSON 等页面变量。
---

# WOS4 页面精灵图变量编辑

## 适用范围

用于已经打开的 WOS4 页面精灵图编辑器，目标是扫描或修改页面变量列表，例如：

- `palMenuConfigJson` 菜单 JSON。
- `palCurrentMenu` 当前菜单项。
- `currentSpaceTime` / `targetSpaceTimeGuid` / `spaceTimeOptions`。
- 查询筛选、分页、表格刷新计数等页面级变量。

进入页面、登录、备份、保存提交分别先读：

- `D:\DEV_D\WOS4.5\.ai\skills\wos4-browser-harness\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-page-runtime-backup\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-component-persistence\SKILL.md`

## 硬规则

- 修改变量前先做可恢复备份；至少记录页面名、变量名、旧值摘要、操作者和时间。
- 操作 iframe 前先扫描顶层弹窗；有阻塞弹窗时先处理弹窗，不读旧 iframe。
- 变量权威位置优先是编辑器 `ViewArea.comMap.$Children.PageView._props.data.variable`。
- 不要误用 `ViewArea.data.variable`；它可能为空，不能代表页面变量表。
- 修改变量时优先就地更新已有变量对象，保留 `KSCGUID`、`AbsVariableId`、`isPublic`、`linkDataObjInfo` 等元信息。
- 不要随手重建整个 `data.variable` 数组；只有确认重复变量污染、并已备份时，才清理重复项。
- 不要在同一段 JS 里执行 `view.savaData()` 后继续读取保存前的 `PageView._props`。保存会触发重渲染，旧引用可能失效，表现为画布短暂空白或脚本报 `Cannot read properties of undefined`。
- 保存后必须等待 2 到 5 秒，再重新定位 editor、ViewArea 和 PageView。
- `browser-harness` ASCII 临时脚本里不要写原始中文；用 Unicode 转义或从 UTF-8 文件读取。

## 扫描变量

用递归 iframe 找到当前页面编辑器：

```js
function findEditor(win, path) {
  let doc
  try { doc = win.document } catch (e) { return null }
  if (doc.querySelector("#page_edit_view_area")) return { win, doc, path }
  for (const [i, frame] of Array.from(doc.querySelectorAll("iframe")).entries()) {
    const found = findEditor(frame.contentWindow, path + "." + i)
    if (found) return found
  }
  return null
}
```

读取变量表：

```js
const target = findEditor(window, "top")
if (!target) throw new Error("page editor not found")

const view = target.doc.querySelector("#page_edit_view_area").__vue__
const page = view.comMap && view.comMap.$Children && view.comMap.$Children.PageView
if (!page) throw new Error("PageView not found")

const pageData = page._props && page._props.data
if (!pageData) throw new Error("PageView data not found")

const variables = Array.isArray(pageData.variable) ? pageData.variable : []
return variables.map((v, i) => ({
  index: i,
  KSCGUID: v.KSCGUID,
  varName: v.varName || v.name,
  varType: v.varType,
  varDefaultValue: String(v.varDefaultValue || "").slice(0, 1000),
  varValue: String(v.varValue || "").slice(0, 1000)
}))
```

扫描时同时判断旧值是否还在属性表正文里：

```js
return {
  variables,
  bodyHasOld: (target.doc.body.innerText || "").includes("assessment-group"),
  bodyHasNew: (target.doc.body.innerText || "").includes("tested-group")
}
```

## 修改变量值

变量值修改必须就地更新对象：

```js
const target = findEditor(window, "top")
const view = target.doc.querySelector("#page_edit_view_area").__vue__
const page = view.comMap.$Children.PageView
const data = page._props.data
data.variable = Array.isArray(data.variable) ? data.variable : []

const name = "palMenuConfigJson"
const nextValue = "__JSON_STRING__"
let item = data.variable.find(v => v && (v.varName === name || v.name === name))

if (!item) {
  item = {
    KSCGUID: "pal_menu_config_json_" + Date.now(),
    varName: name,
    varType: 2,
    varDes: "page variable created by AI",
    varDefaultValue: nextValue,
    varValue: nextValue
  }
  data.variable.push(item)
} else {
  item.varDefaultValue = nextValue
  item.varValue = nextValue
  if ("value" in item) item.value = nextValue
  if ("defaultValue" in item) item.defaultValue = nextValue
}

if (typeof page.initPageVariable === "function") {
  try { page.initPageVariable() } catch (e) {}
}
if (typeof view.$forceUpdate === "function") view.$forceUpdate()
if (typeof page.$forceUpdate === "function") page.$forceUpdate()
```

如果属性面板可见输入框还显示旧 JSON，先确认底层变量已变，再只对包含目标变量值的输入框触发原生 setter：

```js
Array.from(target.doc.querySelectorAll("textarea,input")).forEach(el => {
  const old = el.value || ""
  if (!old.includes("palMenuConfigJson") && !old.includes("assessment-group")) return

  const proto = el.tagName === "TEXTAREA"
    ? HTMLTextAreaElement.prototype
    : HTMLInputElement.prototype
  const desc = Object.getOwnPropertyDescriptor(proto, "value")
  desc.set.call(el, nextValue)
  el.dispatchEvent(new Event("input", { bubbles: true }))
  el.dispatchEvent(new Event("change", { bubbles: true }))
  el.dispatchEvent(new Event("blur", { bubbles: true }))
})
```

## 处理重复变量

重复变量常见表现：

- 视觉菜单已经新了，但变量表仍显示旧 JSON。
- `PageView._props.data.variable` 里同名变量或旧 JSON 变量超过一条。
- 属性表正文同时出现旧 key 和新 key。

处理顺序：

1. 先导出或截图变量表旧值。
2. 读取全部变量，按 `varName` 和旧值关键字定位重复项。
3. 优先保留平台原始那条变量对象，并就地更新它。
4. 只有确认重复项是污染项时，才从数组中移除。
5. 移除后不要立刻保存；先检查 `bodyHasOld=false`、`bodyHasNew=true`、画布组件仍存在。

不要为了清理重复项直接执行：

```js
data.variable = [fresh].concat(kept)
```

除非已经确认编辑器可以承受该次重排，并且有可恢复备份。该写法会触发属性区重渲染，保存时更容易出现短暂空白。

## 保存和提交后复核

保存要分成两个独立步骤。

第一步只保存，不读取旧引用：

```js
const target = findEditor(window, "top")
const view = target.doc.querySelector("#page_edit_view_area").__vue__
view.savaData()
return { savedCalled: true }
```

第二步等待 2 到 5 秒后重新定位并复核：

```js
const target = findEditor(window, "top")
const view = target.doc.querySelector("#page_edit_view_area").__vue__
const page = view.comMap.$Children.PageView
const vars = page._props.data.variable || []
return {
  hasPageView: !!page,
  childKeys: Object.keys(view.comMap.$Children || {}),
  variables: vars.map(v => ({
    varName: v.varName,
    head: JSON.stringify(v).slice(0, 500)
  })),
  textHasOld: (target.doc.body.innerText || "").includes("assessment-group"),
  textHasNew: (target.doc.body.innerText || "").includes("tested-group")
}
```

提交历史版本后也按同样方式复核。提交成功提示不等于变量持久化成功，必须重新打开编辑页或至少重新定位当前 editor 读取变量表。

## 已验证事故结论

2026-06-29 在 `PalimpsestMenu_18` 中验证：

- 菜单视觉已变新，但变量表仍可能保留旧 JSON。
- 正确变量位置是 `ViewArea.comMap.$Children.PageView._props.data.variable`。
- `ViewArea.data.variable` 为空时不能判定页面没有变量。
- 保存过程中 `PageView` 会失效或重建；保存脚本里继续读取旧 `PageView._props` 会报错，并让前台看起来像画布被清空。
- 用户手动撤销后，编辑器恢复，且变量表保留新值，说明不是源页面永久丢失，而是保存/重渲染窗口和脚本旧引用问题。

## 验收清单

- 顶层没有阻塞弹窗。
- `#page_edit_view_area` 存在。
- `ViewArea.comMap.$Children.PageView` 存在。
- 目标变量能在 `PageView._props.data.variable` 中找到。
- 修改后旧关键字不存在，新关键字存在。
- 画布组件 keys 数量正常，不能只看属性表文本。
- 保存后重新定位 PageView 复核，不复用保存前对象。
- 提交或重新打开后变量仍是新值。
