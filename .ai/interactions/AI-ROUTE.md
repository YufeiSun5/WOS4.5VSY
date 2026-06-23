# AI 交互事项查询路引

查询当前事项：

1. 先读根目录 `AI-INTERACTION-PANEL.md`。
2. 根据索引中的事项文件打开 `.ai/interactions/open/<id>.md`。
3. 如果事项有关联任务工作包，再读任务目录的 `events/`、`执行日志.md` 和 `证据清单.md`。

查询历史事项：

1. 先读 `.ai/interactions/INDEX.md`。
2. 如果状态为 `closed`，打开 `.ai/interactions/closed/<id>.md`。
3. 旧规则归档仍可能在 `.ai/closed-interactions/`，查询旧事项时再读 `.ai/closed-interactions/AI-ROUTE.md` 和 `INDEX.md`。

不要只靠日期或文件名猜事项上下文。
