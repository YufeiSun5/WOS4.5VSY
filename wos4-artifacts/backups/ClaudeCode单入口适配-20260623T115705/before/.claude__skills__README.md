# Claude Code Skill Wrapper

本目录让 Claude Code 用户可以通过 `/skill-name` 调用项目已有 `.ai/skills/`。

每个 wrapper 只做三件事：

1. 提供 Claude Code 可发现的 `SKILL.md`。
2. 指向对应的 `.ai/skills/<skill>/SKILL.md`。
3. 要求执行前完整读取真实 skill 和其引用文件。

真实规则不要写在这里。
