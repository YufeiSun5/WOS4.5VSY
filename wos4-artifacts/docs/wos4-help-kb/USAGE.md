# WOS4 Help KB Usage

## 查询路径

1. 按任务查：先读 `indexes/task-router.json`。
2. 按章节查：读 `indexes/chapter-index.md` 或 `indexes/chapter-index.json`。
3. 按函数、枚举、结构字段、错误码查：读 `indexes/symbol-index.json`。
4. 打开索引指向的 Markdown 章节，确认完整说明、入参、返回值、枚举含义和示例。
5. 如果拆分章节不够完整，再回退到 `source/manual_data.json`。

## 索引说明

- `chapter-index.*` 是确定性索引，来自手册章节名。
- `task-router.json` 是人工规则化的任务路由，用于帮助 AI 快速定位常见任务。
- `symbol-index.*` 是自动抽取的候选索引，可能存在同名函数跨库重复、函数名漏抽或少量误抽；不能只凭符号索引回答 API 细节。

## 常见任务

- 页面 / WebJS / 预览 iframe：查 `system-introduction/App引擎介绍.md`、`function-reference/js-functions/JS函数_App引擎.md`。
- 实时对象增删改查：查 `function-reference/meta-language-functions/元语言函数_实时库.md` 或 `function-reference/data-structures/数据结构_实时库.md`。
- 模型、拷贝、仓库：查 `system-introduction/模型库.md` 和 `function-reference/meta-language-functions/元语言函数_模型库.md`。
- 错误码定位：先查 `indexes/symbol-index.json`，再打开 `function-reference/error-codes/` 下对应章节。
- 枚举值定位：先查 `function-reference/system-enums/`，再按库名打开对应文件。

## 和项目 Skill 的关系

本知识库解释系统概念和函数接口；页面设计器的布局、组件持久化、提交、预览、Chrome MCP 等自动化规则仍以 `.ai/skills/` 和项目根 `AGENTS.md` 为准。
