# WOS4 Help KB AI 路引

本目录是从 WOS4 右下角帮助文件下载并整理出的本地知识库。AI 查询 WOS4 手册时，优先读取本文件，再按任务读取对应索引和章节。

## 目录结构

- `source/`：原始提取物，包含 `manual_data.json`、`manual_outline.json`、`manual_text.md`、`function_manual_outline.md`、`help_system_analysis.md`。
- `operation-manual/`：安装、登录、桌面、任务栏、运维、安全、授权等操作手册章节。
- `system-introduction/`：平台概念介绍，例如实时库、模型库、计划库、App 引擎等。
- `function-reference/system-enums/`：系统枚举。
- `function-reference/data-structures/`：数据结构。
- `function-reference/meta-language-functions/`：元语言函数说明。
- `function-reference/js-functions/`：JS 函数说明。
- `function-reference/error-codes/`：错误码。
- `indexes/chapter-index.md`：按分组列出的全部章节。
- `indexes/chapter-index.json`：机器可读章节索引。
- `indexes/task-router.json`：按任务场景映射到推荐章节。
- `indexes/symbol-index.json`：函数、枚举、结构字段、错误码候选索引。
- `USAGE.md`：知识库使用说明和查询约束。

## AI 查询顺序

1. 先读 `indexes/task-router.json`，按任务定位推荐章节。
2. 如果任务是找具体函数、枚举、结构或错误码，优先查 `function-reference/` 下对应分组。
3. 如果已知函数名、枚举名、结构字段或错误码，可用 `indexes/symbol-index.json` 定位候选章节；定位后必须打开章节确认完整说明。
4. 如果任务是登录、安装、授权、运维或安全配置，优先查 `operation-manual/`。
5. 如果任务是理解概念、对象模型、三时态、App 引擎，优先查 `system-introduction/`。
6. 如果拆分 Markdown 信息不足，再回退查 `source/manual_data.json`。

## 重要判断

- 手册原始 UI 的“函数说明”树在 JSON 中是扁平章节名，例如 `元语言函数_实时库`、`JS函数_App引擎`；本知识库已按前缀重新分组。
- 页面设计器具体组件和布局 API 在帮助中没有形成完整章节，WOS4 页面自动化仍要以编辑器 runtime 实测和项目 skill 为准。
- WebJS App 是浏览器侧运行对象，预览可能在 iframe 中加载；顶层 `#app` 为空不能直接判定页面失败。
- 涉及业务数据读写时，先判断前端 JS 还是后台元语言，再查对应库的函数、数据结构、枚举和错误码。

## 常用入口

- 全部章节索引：`indexes/chapter-index.md`
- 符号候选索引：`indexes/symbol-index.json`
- 函数说明树：`source/function_manual_outline.md`
- 系统分析：`source/help_system_analysis.md`
- 任务路由：`indexes/task-router.json`
