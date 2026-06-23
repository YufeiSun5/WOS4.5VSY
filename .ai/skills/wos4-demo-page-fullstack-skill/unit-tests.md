# WOS4 演示页面单元测试计划

## 1) 布局类

| 用例 | 预期 | 验证 | 状态 |
| --- | --- | --- | --- |
| Layout-01 | 标题、搜索、表格、图表区域都存在且不挤在一起 | 运行时读取 `RRow1/RRow2` 和 `RCol11/RCol12/RCol6/RCol15`，预览截图验证 | 已通过 |
| Layout-02 | 表格与图表在预览首屏并排可见 | 读取 row2 两列固定宽度 880/560，预览截图验证 | 已通过 |
| Layout-03 | 行列间有合适空白，不是 0 紧贴 | `colGap=12` 且预览无重叠 | 已通过 |
| Layout-04 | 关键结构有 offset 时依然不乱 | 设置/清理 `offset` 后页面稳定（同对象名、不崩溃） | 待验证 |

## 2) 组件属性类

### 文本

| 用例 | 预期 | 验证 | 状态 |
| --- | --- | --- | --- |
| Text-01 | 能更新标题文字 | 标题 `业务监控总览`，保存后预览可见；样式用 `styleConfig` 截图确认 | 已通过 |
| Text-02 | 底部状态可显示动态值 | 按钮后 `status` 文本包含 `filter=`、`click=`、`tick=` | 待验证 |

### 按钮

| 用例 | 预期 | 验证 | 状态 |
| --- | --- | --- | --- |
| Button-01 | 能修改按钮文案 | 预览点击前 `切换数据：A / 0`，点击后改为 `切换数据：B / 1`、`切换数据：ALL / 2` | 已通过 |
| Button-02 | 能触发联动 | `linkList[0].script` 在预览点击执行，变量/表格/图表变化 | 已通过 |

### 表格

| 用例 | 预期 | 验证 | 状态 |
| --- | --- | --- | --- |
| Table-01 | 初始加载数据 | `detailConfig` 中 `this.table({ columns, totalData })`，保存后重开 4 列 4 行 | 已通过 |
| Table-02 | 筛选后刷新 | `filterKey` 从 A 到 B 到 ALL，表格从 2 行到 2 行到 4 行 | 已通过 |

### 图表

| 用例 | 预期 | 验证 | 状态 |
| --- | --- | --- | --- |
| Chart-01 | 初始图表渲染 | `SetOption(..., true)` + `detailConfig="option=..."`，预览 canvas 可见 | 已通过 |
| Chart-02 | 点击刷新图表数据 | 点击后图表仍有 canvas，`SetOption(option, true)` 使用新 rows 重绘 | 已通过 |

### 定时器

| 用例 | 预期 | 验证 | 状态 |
| --- | --- | --- | --- |
| Timer-01 | 周期刷新生效 | `tick` 在 2~3 个周期后增长 | 待验证 |

### 输入/选择

| 用例 | 预期 | 验证 | 状态 |
| --- | --- | --- | --- |
| Input-01 | 输入项显示与样式 | placeholder、边框色、背景色保存后预览可见 | 已通过 |

## 3) 保存与预览

| 用例 | 预期 | 验证 | 状态 |
| --- | --- | --- | --- |
| Save-01 | 提交成功 | 脚本提交返回 `submitted: true` | 已通过 |
| Save-02 | 保存后回读 | 重开编辑页，表格列/数据、图表 series、样式字段仍在 | 已通过 |
| Preview-01 | 预览可视 | 预览 URL 含 `mode=debugger`，标题/搜索/表格/图表均显示 | 已通过 |

## 4) 执行顺序

1. 布局重建或复用现有稳定 2x2 布局
2. 放置组件
3. 设置基线属性
4. 自动加载验证
5. 按钮联动验证
6. 定时器验证
7. 保存
8. 预览
9. 结果回填到本表 + 截图归档

## 5) Playwright 骨架（已过时，不要直接使用）

```js
/**
 * 运行：
 * 原 runbook 只保留为模板，不包含已验证的 detailConfig 持久化逻辑。
 * 当前应参考根目录 wos4-write-submit-once.js、wos4-apply-style-test.js、wos4-verify-style-test.js。
 */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

(async function () {
  const report = [];
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  if (!process.env.WOS4_LOGIN_URL) throw new Error("需要通过 WOS4_LOGIN_URL 或 wos4.local.ini 传入登录 URL");
  if (!process.env.WOS4_USER) throw new Error("需要通过 WOS4_USER 或 wos4.local.ini 传入用户名");
  await page.goto(process.env.WOS4_LOGIN_URL, { waitUntil: "domcontentloaded" });
  await page.fill("#desktop-login-input-name", process.env.WOS4_USER);
  if (!process.env.WOS4_PASS) throw new Error("需要通过 WOS4_PASS 环境变量传入密码");
  await page.fill("#desktop-login-input-password", process.env.WOS4_PASS);
  await page.click("button:has-text('登录')");
  await page.waitForURL(/#\/main/, { timeout: 30000 });
  report.push({ step: "login", ok: true, at: new Date().toISOString() });

  // 按实际演示对象编辑器地址替换
  report.push({ step: "open_editor", ok: false, detail: "need page id in environment", at: new Date().toISOString() });

  await browser.close();
  fs.writeFileSync(path.join(process.cwd(), "snapshots", "wos4_demo_page_unit_result.json"), JSON.stringify(report, null, 2), "utf8");
})();
```

## 6) 回填要求

- 每条用例执行后改为 `已通过` 或 `失败`
- 每个阶段至少保留一张截图：
  - 编辑器布局图
  - 预览图
  - 交互后图

## 7) 目标验收

- 全部用例已通过
- 布局图中无区域重叠、无“挤在一起”
- 预览页中按钮、表格、图表、文本都可见
