# AI 交互面板多人协作规则

本项目从“单文件看板”改为“短索引 + 单事项文件 + 事件日志”。目标是减少多人、多 AI、GitHub/Gitee 双远端协作时的 Markdown 冲突。

## 文件分工

- `AI-INTERACTION-PANEL.md`：只保留当前 open 事项索引表，不写长反馈。
- `.ai/interactions/INDEX.md`：事项总索引，按 ID、标题、参与人、任务工作包定位。
- `.ai/interactions/open/`：每个 open 事项一个文件。
- `.ai/interactions/closed/`：关闭后的事项文件放这里。
- `.ai/interactions/templates/`：新事项、事件、关闭归档模板。
- `wos4-artifacts/tasks/<任务>/events/`：多人过程反馈目录，一次反馈一个事件文件。
- `.ai/closed-interactions/`：旧规则历史归档目录，只读保留；新关闭事项进入 `.ai/interactions/closed/`。

## ID 规则

旧事项 `0001` 到 `0009` 保留原编号，不重命名。

新事项必须使用时间戳 ID，避免多人抢号：

```text
yyyyMMddTHHmmss-短标题
```

示例：

```text
20260623T131500-palimpsest-runtime-verify
```

## 新建事项

新建事项时只做两类编辑：

1. 新增 `.ai/interactions/open/<id>.md`。
2. 在 `AI-INTERACTION-PANEL.md` 和 `.ai/interactions/INDEX.md` 各增加一行索引。

事项正文必须包含：

- ID
- 标题
- 状态
- 发起人
- 发起人 AI
- 参与人
- 创建时间
- 任务工作包
- 请求
- 当前摘要
- 事件日志目录
- 关闭条件

人员格式仍使用：

```text
<开发人员姓名>_<AI身份>
```

示例：

- `孙宇飞_design-ai`
- `孙宇飞_frontend-ai`
- `孙宇飞_code-ai`
- `孙宇飞_test-ai`
- `孙宇飞_review-ai`

## 过程反馈

多人协作时，参与人默认不直接改事项正文，优先新增事件文件：

```text
wos4-artifacts/tasks/<任务>/events/yyyyMMddTHHmmss-<开发人员姓名>_<AI身份>-<事件名>.md
```

事件文件写：

- 时间
- 记录人
- 关联事项 ID
- 结论：`approved`、`needs-change`、`blocked`、`note`
- 证据链接
- 详细说明

事项文件只在需要更新“当前摘要、当前阶段、关闭条件”时由负责人或当前执行 AI 修改。

## 状态规则

事项主状态只使用：

- `open`
- `closed`

测试和审阅结论写入事件文件或事项摘要：

- `approved`
- `needs-change`
- `blocked`
- `note`

这些结论不作为事项主状态。

## 关闭权限

- 用户明确要求 close 时，当前执行 AI 可以关闭，并在关闭文件中写明 `关闭触发：用户`。
- AI 自行判断 close 时，只有事项的“发起人 AI”可以关闭。
- 参与人可以提交 `approved`、`needs-change` 或 `blocked` 事件；不能直接关闭别人的事项。
- 参与人认为可以关闭时，新增事件并写 `请求发起人关闭`。

## 关闭流程

close 必须在同一次修改中完成：

1. 把 `.ai/interactions/open/<id>.md` 移到 `.ai/interactions/closed/<id>.md`。
2. 在关闭文件追加关闭记录：`状态：closed`、关闭触发、关闭人、关闭时间、关闭原因、最终结论。
3. 从 `AI-INTERACTION-PANEL.md` 删除该事项索引行。
4. 更新 `.ai/interactions/INDEX.md`。
5. 更新 `MEMORY.md`。

如果事项有任务工作包，也要在任务 `events/` 中新增关闭事件。

## 冲突规避

- 新建事项用时间戳 ID，不使用递增编号。
- 不在 `AI-INTERACTION-PANEL.md` 写长段落。
- 不把过程讨论堆到事项正文，写事件文件。
- 一个事件一个文件，不多人同时编辑同一个事件文件。
- 改事项正文前先看 `git status --short`，发现同一事项文件已有他人修改时先合并再继续。
- 提交前运行 preflight，并确认没有把真实 ini、Cookie、Token、浏览器 profile、抓包放进 Git。

## 不允许的做法

- 不允许把 `AI-INTERACTION-PANEL.md` 重新写回长文档。
- 不允许新事项继续抢 `0010` 这类递增编号。
- 不允许参与人 AI 直接关闭发起人 AI 创建的事项。
- 不允许只把事项状态改成 `closed` 但仍留在 open 目录或看板索引中。
- 不允许把同一任务的多人反馈都追加到一个共享长段落里。
