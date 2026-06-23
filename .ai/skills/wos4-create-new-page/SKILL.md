---
name: wos4-create-new-page
description: WOS4 新建画面流程的历史 skill。KingStudio_V20260514 / 产品组装入口已废弃，当前不得按本 skill 直接执行新建页面；只能作为历史参考，等待新的有效入口验证后重写。
---

# WOS4 新建画面

## 当前状态：暂停使用

`KingStudio_V20260514` 已被用户确认为废弃入口。由于本 skill 的已验证路径依赖 KingStudio 产品组装，后续不得按本 skill 进入 KingStudio 或新建页面。

保留本文件是为了记录历史已验证经验，例如动态 URL 不能当入口、弹窗输入框定位、创建后未自动打开的兜底等。新的新建画面 skill 必须基于新的有效客户端入口重新验证后创建或重写。

## 适用场景

当用户要求这些任务时使用：

- 新建一个 WOS4 前端画面。
- 从 KingStudio 产品组装创建页面。
- 演示从登录到新建页面再进入编辑器的流程。
- 统计新建画面流程耗时。
- 需要给后续布局、组件、变量、脚本开发提供一个空白页面。

不适用：

- 修改已有画面。已有画面必须走 `wos4-human-navigation` 的 `open-existing` 路径，按菜单层级和页面卡片双击进入，不能为了修改而重新新建。
- 为每个画面生成一份固定脚本。新建页面只是通用能力的一个 mode，页面名和分组名必须参数化。

前置 skill：

- 登录：`D:\DEV_D\WOS4.5\.ai\skills\wos4-login\SKILL.md`
- 菜单导航：`D:\DEV_D\WOS4.5\.ai\skills\wos4-human-navigation\SKILL.md`

后续常用 skill：

- 布局：`D:\DEV_D\WOS4.5\.ai\skills\wos4-layout-devtools-skill\SKILL.md`
- 组件持久化：`D:\DEV_D\WOS4.5\.ai\skills\wos4-component-persistence\SKILL.md`
- 样式：`D:\DEV_D\WOS4.5\.ai\skills\wos4-style-config\SKILL.md`
- 交互：`D:\DEV_D\WOS4.5\.ai\skills\wos4-interaction-flow-skill\SKILL.md`

## 固定入口

从主页面进入：

```text
KingStudio_V20260514 -> 产品管理 -> 进入产品 -> 产品组装
```

当前已验证产品：

```text
升级拷贝1
```

硬规则：

- 不允许用历史 `public/?...#/running`、`GetFileContent/.../index.html` 或预览 URL 作为进入页面设计器的入口。
- 必须从桌面主页面按 `KingStudio_V20260514 -> 产品管理 -> 升级拷贝1 -> 进入 -> 产品组装 -> 选择分组 -> 新建 -> 创建并打开` 操作。
- URL、对象 ID、guid 只能在创建成功后作为证据保存，不能反向作为下次新建/编辑入口。

新建页面前必须先选中左侧产品组装分组/仓库。否则点击“新建”会提示：

```text
请选择仓库
```

## 推荐流程

1. 按 `wos4-login` 登录，或确认 Chrome 已登录。
2. 等待主页面应用卡片加载完成，再按 `wos4-human-navigation` 双击打开 `KingStudio_V20260514`，不要只点击文字层；单击只会选中卡片。
3. 在产品管理页找到目标产品卡片 `升级拷贝1`，点击卡片内 `进入`。
4. 切换到 `产品组装`。
5. 如果没有合适分组，点击左侧 `新增`，创建分组。
6. 选中左侧分组。
7. 点击右侧工具栏 `新建`。注意左侧树上方是 `新增` 分组，右侧工具栏才是新建页面，不要混用。
8. 类型保持 `组态页面`。
9. 子类型选择 `页面`。
10. 填写名称和描述。
11. 点击 `创建并打开`。
12. 等待 `页面编辑器` 打开，并出现新页面 tab。
13. 只在设计器打开后记录当前 URL、对象 ID、guid、页面名、耗时和截图。

复用方式：

```js
await navigateToEditor({
  desktopApp: "KingStudio_V20260514",
  product: "升级拷贝1",
  module: "产品组装",
  group: "Codex自动演示_0612",
  pageName,
  mode: "create-and-open"
})
```

如果 `mode: "open-existing"`，禁止点击右侧 `新建`，只查找并双击已有 `.data-item` 页面卡片。

等待要求：

- 登录后必须等 `KingStudio_V20260514` 卡片真实出现在 DOM，且 `getBoundingClientRect()` 宽高非 0；打开应用时用双击。
- 点击 KingStudio 后必须等嵌套 frame 中出现 `产品管理` 和 `升级拷贝1`。
- 点击产品卡片 `进入` 后必须等 `建模管理` 和 `产品组装` 出现。
- 点击 `产品组装` 后必须等左侧仓库树和右侧工具栏 `新建` 出现。
- 点击 `创建并打开` 后必须等 `页面编辑器` 或新页面列表项出现，再决定是否执行兜底打开。

## 已验证字段

新建弹窗字段：

- 名称：必填。
- 类型一级：`组态页面 / 功能单元 / 数据模型 / 其他`。
- 组态页面子类型：`客户端 / 页面 / 2D / 3D / 报表 / GIS`。
- 描述：可选。
- 按钮：`确认`、`创建并打开`。

## 新建弹窗自动化定位

产品组装页同时存在搜索框、筛选下拉、分页输入框和新建弹窗输入框。不要填第一个 `input`。

已验证一次失败原因：

- 打开弹窗后页面共有多个 input。
- 第一个 input 是产品组装列表搜索框，placeholder 为 `请输入搜索内容!`。
- 新建页面名称字段是后面的弹窗字段，placeholder 为 `请输入名称`。
- 如果把页面名填进第一个 input，再点 `创建并打开`，弹窗会关闭但页面不会创建，编辑器不会打开。

推荐定位：

```js
const frame = page.frames().find(f => f.url().includes("a882f412"))

await frame.getByText("Codex自动演示_0612", { exact: true }).click()
await frame.getByRole("button", { name: "新建" }).first().click()

await frame.locator('.el-dialog input[placeholder="请输入名称"], .el-overlay-dialog input[placeholder="请输入名称"]').fill(pageName)

const desc = frame.locator(".el-dialog textarea, .el-overlay-dialog textarea")
if (await desc.count()) {
  await desc.first().fill(description)
}

await frame.getByText("创建并打开", { exact: true }).click()
```

验证方式：

- 点击后等待 10 到 20 秒。
- 递归 iframe 中应出现 `页面编辑器`。
- 应出现包含 `94054fd1-9b20-463a-8372-b69776349847_107/index.html` 的编辑器 frame。
- 如果仍停留在产品组装列表，但列表中出现了新页面名，说明页面已创建但 `创建并打开` 没有自动进入编辑器。此时不要改用动态 URL，改为从列表真实页面卡片打开。

## 创建后未自动打开的兜底

已验证现象：

- `创建并打开` 点击后，新页面可能出现在产品组装列表，但编辑器 frame 没有打开。
- 重新登录后，未真正持久化的临时项可能消失；已持久显示的页面项可以从列表重新打开。
- 页面项不能用包含页面名的大容器匹配，否则会点到 `data-container` 或左上角标签，甚至切回 `建模管理`。

推荐精确定位真实页面卡片：

```js
const item = await frame.evaluate((pageName) => {
  const el = Array.from(document.querySelectorAll(
    ".work-space-model-mian .data-item, .work-space-model .data-item, .data-item"
  )).find(e => (e.innerText || "").includes(pageName))
  if (!el) return null
  const r = el.getBoundingClientRect()
  return { x: r.x, y: r.y, w: r.width, h: r.height }
}, pageName)

await page.mouse.dblclick(item.x + item.w / 2, item.y + 30)
```

成功打开后：

- KingStudio frame 文本会变为 `页面编辑器`。
- 会出现包含 `94054fd1-9b20-463a-8372-b69776349847_107/index.html` 的编辑器 frame。

## 本次验证样例

已创建：

```text
分组：Codex自动演示_0612
页面：Codex自动演示页面_0612
```

预览 URL 中关键对象：

```text
id=6192730962611142865
guid=09faf052-b59b-4129-b3fe-0e726794b29a
guidVersion.id=1441151880758559577
runModelName=Codex自动演示页面_0612
```

证据：

- `D:\DEV_D\WOS4.5\wos4-artifacts\snapshots\wos4_new_demo_run_report.json`
- `D:\DEV_D\WOS4.5\wos4-artifacts\screenshots\wos4_new_demo_preview_after_click.png`

## 验收

新建画面流程完成标准：

- 新分组或目标分组存在。
- 新页面出现在产品组装列表或页面编辑器 tab。
- 页面编辑器已打开。
- 能继续通过布局/组件 skill 写入内容。
- 保存新建过程的耗时记录。

完整流程参考：

- `D:\DEV_D\WOS4.5\.ai\skills\wos4-create-new-page\references\new-page-flow.md`
