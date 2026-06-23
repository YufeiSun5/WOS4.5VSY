---
description: "通用 Claude Code 适配器。用 `/use-ai-skill <skill-name>` 调用本项目 `.ai/skills/<skill-name>/SKILL.md`，避免为每个项目 skill 维护一份 Claude wrapper。"
argument-hint: "<skill-name> [task details]"
---

# use-ai-skill

这是唯一的 Claude Code skill 适配器。真实 skill 只维护在 `.ai/skills/`。

## 执行步骤

1. 读取 `AGENTS.md`，确认项目强制规则、备份规则、敏感信息规则和 WOS4 专用规则。
2. 从参数中取得第一个词作为 `<skill-name>`。
3. 检查 `.ai/skills/<skill-name>/SKILL.md` 是否存在。
4. 如果不存在，列出 `.ai/skills/` 下可用 skill，并停止，不要猜测替代。
5. 如果存在，完整读取 `.ai/skills/<skill-name>/SKILL.md`。
6. 若真实 skill 引用相对路径，按 `.ai/skills/<skill-name>/` 作为基准目录解析。
7. 后续严格按真实 skill 执行，本 adapter 不维护 WOS4 操作细节。

## 参数

`$ARGUMENTS`

示例：

```text
/use-ai-skill wos4-login 登录 WOS4
/use-ai-skill wos4-layout-devtools-skill 做左右 18/82 布局
/use-ai-skill wos4-component-persistence 验证表格和图表持久化
```

## 维护规则

- 新增 `.ai/skills/<skill-name>/SKILL.md` 后，不需要修改 `.claude/`。
- 删除或改名 `.ai/skills/<skill-name>` 后，也只需要维护 `.ai/`。
- `.claude/` 不复制真实流程正文，避免两套规则漂移。
