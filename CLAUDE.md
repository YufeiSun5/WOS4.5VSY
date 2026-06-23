@AGENTS.md

## Claude Code 适配层

本文件只用于让 Claude Code 自动读取本项目已有 AI 路引。

- `.ai/` 是项目 AI 规则、身份、skill 和文档的唯一事实来源。
- `.claude/` 只做 Claude Code 的薄适配，不维护第二套 WOS4 规则。
- 开始任务时先按 `AGENTS.md` 判断是否命中 `.ai/skills/*/SKILL.md`。
- 若用户需要显式调用项目 skill，使用 `/use-ai-skill <skill-name>`，再读取对应 `.ai/skills/<skill-name>/SKILL.md`。
- 修改 `.ai` 的规则或 skill 后，通常不需要修改 `.claude`；只有通用适配器行为变化时才更新 `.claude`。
