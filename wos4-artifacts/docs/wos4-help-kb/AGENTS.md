# WOS4 Help KB Agent Entry

AI 读取本知识库时，先读 `AI-ROUTE.md`，再读 `USAGE.md`。

不要直接全量读取 `source/manual_data.json`。先按 `indexes/task-router.json` 或 `indexes/chapter-index.md` 定位章节；只有拆分 Markdown 信息不足时，再回退查原始 JSON。

`indexes/symbol-index.json` 是自动抽取的候选索引，只用于定位章节；回答函数细节前必须打开对应 Markdown 章节核对。
