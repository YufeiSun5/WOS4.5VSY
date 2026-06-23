# Claude Code Skill Adapter

本目录只保留一个通用适配器：

- `.claude/skills/use-ai-skill/SKILL.md`

使用方式：

```text
/use-ai-skill <skill-name> [task details]
```

例如：

```text
/use-ai-skill wos4-login 登录
/use-ai-skill wos4-layout-devtools-skill 做布局
```

适配器会要求 Claude Code 读取：

```text
.ai/skills/<skill-name>/SKILL.md
```

真实规则不要写在这里。
