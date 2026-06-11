# WOS4 产物放置规范

## 目标

把 WOS4 自动化开发中的脚本、截图、页面模型、测试用例、验证报告和备份统一管理，便于 Git 安全控制、回归测试和迁移。

## 目录

```text
wos4-artifacts/
  config/
  scripts/
  screenshots/
  snapshots/
  tests/
  reports/
  backups/
```

## scripts

## config

放本机 WOS4 连接配置。

真实配置文件：

```text
wos4-artifacts/config/wos4.local.ini
```

要求：

- `wos4.local.ini` 不进 Git。
- 只提交 `wos4.local.example.ini` 或 README。
- 脚本优先读取 ini；没有 ini 时再读取环境变量，例如 `WOS4_PASS`。
- 不在脚本、skill、报告里写死密码。

建议字段：

```ini
[wos4]
url=http://...
username=...
password=...
proxy=direct
```

## scripts

放 WOS4 自动化脚本、探针脚本和一次性修复脚本。

建议命名：

```text
YYYYMMDD-purpose.js
wos4-<page-or-feature>-<action>.js
```

示例：

```text
wos4-artifacts/scripts/wos4-demo-apply-layout.js
wos4-artifacts/scripts/wos4-probe-page-scripts.js
```

要求：

- 复用脚本不得写死密码。
- 登录密码通过环境变量传入，例如 `WOS4_PASS`。
- 脚本顶部说明作用、目标页面、是否会修改平台数据。

## screenshots

放编辑器、预览页和测试过程截图。

建议命名：

```text
YYYYMMDD-HHMM-<page>-<stage>.png
```

常用 stage：

- `editor-before`
- `editor-after`
- `preview-before-click`
- `preview-after-click`
- `error`

## snapshots

放页面模型、运行时快照和验证 JSON。

建议命名：

```text
YYYYMMDD-HHMM-<page>-before.json
YYYYMMDD-HHMM-<page>-after.json
YYYYMMDD-HHMM-<page>-verify.json
```

要求：

- `before.json` 在修改前生成。
- `after.json` 在保存/提交后重新读取生成。
- `verify.json` 记录预览测试结果。

## tests

放测试用例、测试数据和回归测试记录。

建议文件：

```text
wos4-artifacts/tests/<page>-test-plan.md
wos4-artifacts/tests/<page>-regression.md
wos4-artifacts/tests/<page>-fixtures.json
```

测试用例至少覆盖：

- 页面是否可打开。
- 布局是否符合需求。
- 文本、按钮、输入框、表格、ECharts 是否渲染。
- 页面打开脚本是否执行。
- 定时脚本是否执行。
- 数据变化脚本是否执行。
- 按钮点击后变量、表格、图表是否更新。
- 控制台是否有严重错误。

## reports

放阶段报告、验证报告、耗时报告和结论文档。

建议命名：

```text
YYYYMMDD-<topic>-report.md
YYYYMMDD-<page>-verification.md
```

## backups

放修改前后的安全备份。

建议结构：

```text
wos4-artifacts/backups/<page-name>/
  <timestamp>-before.json
  <timestamp>-after.json
  <timestamp>-editor-before.png
  <timestamp>-editor-after.png
  <timestamp>-preview-after.png
  <timestamp>-verify.json
```

Git 要记录这些备份的索引和关键 JSON。截图数量过多时，先保留关键证据，后续再考虑 Git LFS。

## 旧产物整理策略

现有根目录中的 `wos4-*.js`、`probe*.js`、`*.png`，以及 `screenshots/`、`snapshots/` 中的文件，先不要直接移动。

推荐步骤：

1. 初始化 Git。
2. 提交当前基线。
3. 按类型分批移动旧产物。
4. 每批移动后运行 `git diff --stat` 检查只发生路径变化。
5. 在 `MEMORY.md` 记录迁移批次。
