@AGENTS.md

## Claude Code 适配层

本文件只用于让 Claude Code 自动读取本项目已有 AI 路引。

- `.ai/` 是项目 AI 规则、身份、skill 和文档的唯一事实来源。
- `.claude/` 只做 Claude Code 的薄适配，不维护第二套 WOS4 规则。
- 开始任务时先按 `AGENTS.md` 判断是否命中 `.ai/skills/*/SKILL.md`。
- 若用户直接调用 `/wos4-login`、`/wos4-layout-devtools-skill` 等 Claude Code skill，先读取对应 `.ai/skills/<skill>/SKILL.md`，再按真实 skill 执行。
- 修改 `.ai` 的规则或 skill 后，如影响 Claude Code 入口，只更新 `.claude` wrapper 的路由说明，不把规则正文复制进 `.claude`。
