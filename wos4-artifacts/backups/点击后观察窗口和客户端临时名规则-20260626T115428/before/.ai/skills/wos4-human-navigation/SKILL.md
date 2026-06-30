---
name: wos4-human-navigation
description: WOS4 可见菜单层级导航。用于登录后按人类路径进入仍有效的桌面客户端、建模系统、页面设计器和预览，不使用动态 URL 作为入口。KingStudio_V20260514 已废弃，不得再作为当前入口。
---

# WOS4 人类路径导航

## 适用场景

当任务涉及这些动作时使用：

- 从 WOS4 主页面进入当前有效桌面客户端。
- 进入 `建模系统客户端`、`组态系统客户端`、`运维部署客户端` 等新版入口。
- 按当前业务链路打开、新建、编辑或预览页面。
- 从桌面右下角任务栏打开帮助手册。
- 用户要求“不要直接用 URL”“模拟人类操作”“记录菜单层级”。

前置 skill：

- `D:\DEV_D\WOS4.5\.ai\skills\wos4-login\SKILL.md`

## 硬规则

- `KingStudio_V20260514` 已被用户确认为废弃入口。后续任务不得再进入 KingStudio、产品管理或产品组装，也不得基于该路径继续探索客户端发布。
- 本文件中保留的 KingStudio 历史记录只用于解释旧证据、失败原因和已废弃路径，不能作为当前导航步骤执行。
- 当前桌面入口名称以刷新后可见文本为准：`建模系统客户端`、`组态系统客户端`、`运维部署客户端`。历史旧后缀入口名只作为旧证据，不再作为当前自动化定位目标。
- 当前 `盛云科技_孙宇飞_Palimpsest` 主线应从 `建模系统客户端` 起步创建/维护模型和页面对象；不要在 `KingStudio_V20260617 -> 产品管理 -> 新建` 中创建产品来替代本任务的新项目。
- 在 `组态系统客户端 / KingFusion4.5_工程浏览器` 中，左侧存在“父菜单只负责展开/收起、子菜单才是真实页面”的结构。不得把父级菜单组当成内容页入口。
- 当前已确认的典型陷阱：`数字孪生实例配置` 是菜单组，不是右侧业务页。进入工程后如果只点它，右侧可能保持空白或只显示工程壳，这不算页面异常；要继续点击它下面的真实子项，如 `管控单元实例配置`、`工作流实例配置`。
- 登录后禁止把历史 `public/?...#/running`、`GetFileContent/.../index.html`、预览 URL 作为进入编辑器的入口。
- URL 只作为结果证据和对象标识记录，不作为导航输入。
- 自动化脚本必须是可复用导航驱动，不允许按单个画面固化一份入口脚本。页面名、产品名、分组名、操作类型只能作为参数传入。
- 页面入口必须按可见菜单层级执行，并保存菜单层级、点击目标、耗时和截图。
- 如果 Chrome MCP 不能接管，可以退回 `headless:false` Playwright，但仍要点击可见 UI，不直接 `page.goto` 动态业务入口。
- WOS4 页面和 iframe 加载较慢。每次点击后必须等待目标页面的可见文本、卡片、iframe 或 runtime 稳定后再下一步，禁止用很短固定 sleep 后连续点击。
- 每次点击后、读取 iframe 前、判断页面是否成功前，必须先检查顶层可见弹窗。顶层 `应用停止`、`会话失效`、`无法连接到云`、`未知错误`、确认退出、保存/提交/部署错误等弹窗优先级高于 iframe 内容；弹窗未解决时，不得继续操作旧 iframe 或把旧 runtime 当作当前状态。
- 顶层弹窗处理必须先记录弹窗标题、正文、按钮文本，再按按钮文本处理。不要在未识别弹窗内容时按坐标猜测按钮。
- 双击桌面应用后不能只靠固定时间或 DOM 立即判断。必须同时观察网络请求：若已发出 `public/?id=...`、`GetFileContent/.../index.html`、产品/页面数据接口请求，说明点击已生效，应继续等待加载完成，不要退出或重复点击。
- 如果顶层或任一 iframe 出现 `会话失效或无法连接到云，是否退出登录页面？`，不要点 `保留在当前页`，也不要继续在旧 iframe 或旧运行态里操作。必须彻底刷新当前 WOS4 页，等待回到 `#/main` 或 `#/login` 后重新建立会话。
- 刷新后如果回到 `#/login`，按 `wos4-login` 重新登录；如果登录提示 `登录失败:timeout`，停止 WOS4 自动操作并保存证据，不能继续用刷新前的 iframe 状态判断部署、提交或预览结果。

## 当前标准菜单层级

```text
WOS4 登录页
-> 主页面 #/main
-> 建模系统客户端
-> 目标分组 / 模型列表
-> 新建或打开模型
-> 提交版本 / 生成拷贝 / 进入页面精灵图
```

## 帮助手册入口

打开帮助手册也必须走可见桌面入口，不要直接写死帮助站点地址作为第一入口。

标准路径：

```text
WOS4 登录页
-> 主页面 #/main
-> 右下角任务栏帮助图标 .icon-WOS45-bangzhu
-> 新窗口/标签：Wos4.5帮助手册
```

已验证帮助页会加载独立站点，正文手册数据主要打包在：

```text
static/js/file.js
```

下载或分析帮助时，优先保存 `index.html`、`static/js/file.js`、`static/js/chunk.js`、CSS、字体和资源清单；若 `media/img` 图片直连 404，不要因此判定帮助下载失败，先提取 `file.js` 中的 JSON 手册正文。

## 等待规则

不要只写：

```js
await page.waitForTimeout(1000)
```

推荐用“状态成立 + 适度缓冲”：

```js
await page.waitForFunction(() => document.body.innerText.includes("KingStudio_V20260514"), null, { timeout: 30000 })

await page.waitForFunction(() =>
  Array.from(document.querySelectorAll(".data-item.card-item"))
    .some(el => el.getAttribute("title") === "KingStudio_V20260514"),
  null,
  { timeout: 30000 }
)

await page.waitForFunction(() =>
  Array.from(window.frames).length > 0 || document.querySelector("iframe"),
  null,
  { timeout: 30000 }
)
```

跨 iframe 页面要轮询 `page.frames()`：

```js
async function waitFrame(page, predicate, timeoutMs = 30000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    for (const frame of page.frames()) {
      let ok = false
      try {
        ok = await Promise.resolve(predicate(frame))
      } catch (e) {
        ok = false
      }
      if (ok) return frame
    }
    await page.waitForTimeout(500)
  }
  throw new Error("target frame not ready")
}
```

点击前必须确认目标元素可见且尺寸非 0；点击后必须确认页面状态变化或网络请求已发出。如果 DOM 暂时没变化但网络请求在进行，继续等待。

## 网络请求判断

WOS4 网络慢时，点击已经生效但 DOM/iframe 还没更新。必须记录并判断网络请求。

桌面应用双击后，至少观察这些请求之一：

```text
/public/?id=...
/api/v1/GetFileContent/.../index.html
a882f412-06f7-4256-930d-571048dc3933_95/index.html
```

页面设计器打开时，至少观察：

```text
94054fd1-9b20-463a-8372-b69776349847_107/index.html
```

Playwright 建议模式：

```js
const seen = []
page.on("request", req => {
  const url = req.url()
  if (url.includes("/public/") || url.includes("GetFileContent")) {
    seen.push({ type: "request", url, at: Date.now() })
  }
})
page.on("response", res => {
  const url = res.url()
  if (url.includes("/public/") || url.includes("GetFileContent")) {
    seen.push({ type: "response", status: res.status(), url, at: Date.now() })
  }
})

await page.mouse.click(cardCenter.x, cardCenter.y, { clickCount: 2, delay: 120 })

// 如果 seen 已出现相关请求，继续等 frame/text，不要马上判失败。
```

失败判定顺序：

1. 点击后 5 到 10 秒内完全没有相关网络请求：可能没点中，允许重新定位后再双击一次。
2. 已有网络请求但 iframe/text 未完成：继续等待，保存请求日志，不重复点击。
3. 请求失败或超时：记录失败 URL、状态码、截图和 frame 文本。
4. frame 已出现但文本未加载：继续等文本或 runtime，不要关闭浏览器。

## 已遇到的问题

### 会话失效弹窗

现象：

```text
会话失效或无法连接到云，是否退出登录页面？
立即退出 / 保留在当前页
```

处理：

1. 不点击 `保留在当前页`。
2. 对当前 WOS4 顶层页执行彻底刷新。
3. 重新等待 `#/main` 或 `#/login`。
4. 如果落到登录页，重新登录。
5. 如果登录返回 `登录失败:timeout`，记录截图/快照后停止操作，等待网络或服务恢复。

禁止事项：

- 不在旧 iframe 中继续点击保存、提交、部署、启动、更新。
- 不把刷新前的运行态变量或 DOM 当成当前有效证据。
- 不用 DOM 事件绕过桌面上下文打开客户端；曾验证会打开 `username=` 为空的无效 `public` 外壳。

### Chrome MCP profile 锁

现象：

```text
The browser is already running for ... chrome-profile
```

处理：

- 不杀浏览器进程。
- 记录 Chrome MCP 不可用。
- 退回 `headless:false` Playwright，使用 `--proxy-server=direct://`。

### 主页面只点击文字无效

已验证在主页面点击 `KingStudio_V20260514` 文本层、卡片窄区域或普通 `text=` 定位可能不会进入产品。

补充验证：主页面 `KingStudio_V20260514` 桌面应用卡片单击可能只是选中卡片，不会打开应用；应双击卡片图标/卡片中心，再递归检查 iframe。顶层 URL 仍然保持 `#/main`，顶层 body 仍显示桌面应用列表；成功与否要看嵌套 frame。成功时会出现：

```text
top #/main
-> public/?id=6192730962611142708...
-> GetFileContent/.../a882f412-.../index.html#/running
```

该嵌套 frame 的 body 会出现：

```text
KingStudio / 产品管理 / 升级拷贝1 / 进入修改删除
```

处理顺序：

1. 优先找完整卡片的可交互容器，而不是只找文本。
2. 用真实鼠标双击卡片中心或图标区域；在 Playwright 中优先使用 `page.mouse.click(x, y, { clickCount: 2, delay: 120 })`，不要依赖可能不触发桌面事件的封装双击。
3. 如果仍无效，检查元素事件、父级容器、桌面窗口状态和遮罩层。
4. 不要因为点击无效改用历史动态 URL。

### 建模系统客户端 入口

已验证 `建模系统客户端` 也遵循桌面应用规则：

```text
WOS4 登录页
-> 主页面 #/main
-> 建模系统客户端 卡片图标真实双击
-> public/?id=6192730962611142710...
-> GetFileContent/.../f5f8c456-e145-4d85-b1c3-dc3a17e7b512_105/index.html
-> 建模系统 / 管控单元建模 / 采集设备建模 / 工作流建模
```

注意：

- 顶层 URL 仍保持 `#/main` 是正常现象，成功状态以 iframe 文本和网络请求判断。
- 卡片 DOM 示例：`.data-item.card-item[title="建模系统客户端"]`，实测卡片约 `68x112`，双击图标区比双击文字更稳定。
- 如果双击后已出现 `/public/` 或 `GetFileContent` 请求，要继续等内层 frame，不要因为顶层 DOM 不变而重新登录或退出。
- 建模客户端内部分组树可能比外壳 frame 晚加载，点击 `管控单元建模` 后应等待分组文本稳定，再点击目标分组。

### 建模成员接口注意

不要把功能单元成员 API 直接套到多灵敏时序物模型：

- `CreateFuModelMemberList` / `CreateFuModelMemberListWebJs` 运行时代码中硬编码 `TYPE_FUNCTIONUNITMODEL=1005`。
- 多灵敏时序物模型类型是 `TYPE_MTSENTITYMODEL=1009`。
- 多灵敏数据点应优先按“灵敏成员”理解，普通“非灵敏成员”接口可能返回 `ret=-10002` 和成员检查错误。
- 直接 API 写入失败时要保存 `ret`、`errorcodes`、截图和函数签名，不要继续盲试；应回到 UI 或手册确认多灵敏模型专用成员协议。

### 产品管理页产品卡片入口

进入 KingStudio 后会先到产品管理页。产品卡片内有：

```text
进入
修改
删除
```

进入目标产品时应点击产品卡片里的 `进入`，不是点击产品名称 `升级拷贝1`。点击 `进入` 后再等待下一级页面出现 `建模管理` 和 `产品组装`。

自动化定位优先用 frame 内文本：

```js
const frame = page.frames().find(f => f.url().includes("a882f412"))
await frame.getByText("进入", { exact: true }).click()
```

不要用包含 `进入修改删除` 的大容器坐标点击；那会点到卡片背景或主区域，不能进入下一级。

## Playwright 导航原则

允许用 `page.goto` 的范围：

- 登录页固定地址。
- 静态、稳定的系统首页地址。

禁止用 `page.goto` 的范围：

- KingStudio 产品组装运行壳动态 URL。
- 页面编辑器 `GetFileContent/.../index.html`。
- 预览页 URL。

脚本结构原则：

- 只保留一个通用 `navigateToEditor({ desktopApp, product, module, group, pageName, mode })` 能力，不为每个画面复制脚本。
- `mode` 可为 `open-existing`、`create-and-open`、`preview`。
- 画面频繁修改时默认使用 `open-existing`，通过可见页面卡片双击进入，不重复新建。
- 动态 URL、guid、对象 id 只写入本次证据快照，不能写死进 skill 或长期脚本。
- 每次点击后先进入 `waitForNavigationEffect`：观察目标文本、iframe、runtime 和网络请求；已发请求时继续等待，不鲁莽退出。
- 进入编辑器后不要反复重跑完整导航脚本。后续修改应复用当前编辑器会话：修改、提交、预览、回到编辑器继续改。
- 只有当前编辑器会话丢失、页面刷新后 runtime 不存在、登录态失效或网络错误不可恢复时，才重新从登录和菜单层级进入。

点击后必须等待可见页面状态变化，例如：

- 主页面出现 `KingStudio_V20260514`。
- 点击 `KingStudio_V20260514` 后，递归 iframe 中出现 `产品管理`。顶层 URL 不变化是正常现象。
- 产品管理出现目标产品 `升级拷贝1` 和卡片按钮 `进入`，然后点击卡片内 `进入`。
- 产品内出现 `建模管理`、`产品组装`。
- 产品组装出现左侧仓库树和右侧 `新建`。
- 页面列表中的页面项要匹配真实 `.data-item` 卡片，不要匹配包含页面名的大容器。
- 打开页面项后，页面设计器出现 `页面编辑器`、页面 tab、`#page_edit_view_area` runtime。

## 证据记录

每次导航任务至少记录：

```text
操作者：
开始时间：
工具：Chrome MCP / Playwright
Chrome MCP 是否可用：
菜单层级：
点击目标：
页面名或产品名：
成功后 URL：
截图：
失败原因：
```

推荐保存位置：

```text
wos4-artifacts/snapshots/
wos4-artifacts/screenshots/
wos4-artifacts/reports/
```

## 2026-06-22 组态菜单修正

在 `盛云_孙宇飞_CRUD工程_0620` 的复测中已确认：

```text
进入工程
-> 左侧出现工程壳菜单
-> 此时右侧还不代表已进入具体业务页
-> 必须点击真实子菜单，例如 `管控单元实例配置`
-> 之后右侧才会加载 `时空列表 / 实例列表`
```

错误模式：

```text
把 `数字孪生实例配置` 当成右侧业务页入口
-> 右侧空白
-> 误判为页面损坏或实例页未初始化
```

正确模式：

```text
父菜单用于展开/收起
子菜单用于真正加载页面
```

