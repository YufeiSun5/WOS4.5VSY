# Claude Code 适配层

`.claude/` 只用于兼容 Claude Code。

项目真实 AI 规则仍在：

- `AGENTS.md`
- `.ai/agents/`
- `.ai/instructions/`
- `.ai/skills/`
- `.ai/docs/`

## 使用方式

在仓库根目录运行 Claude Code 时，`CLAUDE.md` 会导入 `AGENTS.md`。

如果需要显式调用项目 skill，使用唯一的通用 wrapper：

```text
/use-ai-skill wos4-login
/use-ai-skill wos4-layout-devtools-skill
/use-ai-skill wos4-component-persistence
```

这个 wrapper 不保存真实流程，只要求 Claude Code 回读 `.ai/skills/<skill>/SKILL.md`。

## 维护规则

- 不要把 `.ai/skills/*/SKILL.md` 的正文复制到 `.claude/skills/`。
- 新增项目 skill 时，只维护 `.ai/skills/`；无需同步新增 `.claude/skills/` 目录。
- 规则冲突时，以 `AGENTS.md` 和 `.ai/` 为准。
