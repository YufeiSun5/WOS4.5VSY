# WOS4 帮助手册知识库检查

检查时间：2026-06-23

## 结论

当前 `wos4-artifacts/docs/wos4-help-kb/` 具备可辅助 AI 查手册的路引和索引体系。

本次检查没有发现章节索引或任务路由断链。可以认为当前知识库在“已提取的 app 手册范围内”是完整可用的。

## 已确认入口

- `AGENTS.md`：AI 进入知识库时的强制入口。
- `AI-ROUTE.md`：目录结构、查询顺序和常用入口。
- `USAGE.md`：查询路径、索引使用约束和常见任务说明。
- `indexes/task-router.json`：按任务场景定位章节。
- `indexes/chapter-index.json` / `chapter-index.md`：章节索引。
- `indexes/symbol-index.json` / `symbol-index.md`：函数、枚举、结构字段、错误码候选索引。

## 结构统计

- 原始手册：`source/manual_data.json`，其中 `app` 章节数为 76，`wos` 章节数为 0。
- 章节索引：76 条。
- 非 source 的手册 Markdown 章节：78 个，其中包含 76 个章节文件和少量路引/说明文件。
- 任务路由：8 个任务场景，58 个文件引用。
- 符号索引：存在，`symbol-index.json` 约 764 KB。

## 一致性检查

- `chapter-index.json` 中 76 个章节路径全部存在。
- `task-router.json` 中 58 个文件引用全部存在。
- 根目录存在 `AGENTS.md`、`AI-ROUTE.md`、`USAGE.md`。
- `source/` 中存在 `manual_data.json`、`manual_outline.json`、`manual_text.md`、`function_manual_outline.md`、`help_system_analysis.md`。

## AI 使用方式

查询手册时按以下顺序：

1. 读 `wos4-artifacts/docs/wos4-help-kb/AGENTS.md`。
2. 读 `AI-ROUTE.md` 和 `USAGE.md`。
3. 按任务查 `indexes/task-router.json`。
4. 按章节查 `indexes/chapter-index.md` 或 `chapter-index.json`。
5. 按函数、枚举、结构字段、错误码查 `indexes/symbol-index.json`。
6. 打开索引指向的 Markdown 章节核对完整说明。
7. 拆分 Markdown 不足时再回退到 `source/manual_data.json`。

## 边界

- 页面设计器、布局、组件持久化、Chrome MCP 接管等自动化规则仍以 `.ai/skills/` 和根目录 `AGENTS.md` 为准。
- `symbol-index` 是候选索引，不能只凭符号索引回答 API 细节，必须打开对应 Markdown 章节核对。
- 当前 source 中 `wos` 章节数为 0，说明本地知识库主要覆盖已提取的 `app` 手册内容；如果后续需要 WOS 系统端更多章节，应重新提取或补充 source。
