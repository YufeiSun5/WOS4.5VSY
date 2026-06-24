# AI 交互看板

本文件只保留当前 open 事项索引，降低多人协作时的 Git 冲突。

- 事项全文：`.ai/interactions/open/<id>.md`
- 已关闭事项：`.ai/interactions/closed/`
- 详细过程：优先写入任务工作包 `events/` 目录，一次反馈一个事件文件。
- 规则说明：`.ai/docs/ai-interaction-panel-policy.md`

## 当前 open 事项

| ID | 标题 | 状态 | 发起人 AI | 参与人 | 任务工作包 | 事项文件 |
|---|---|---|---|---|---|---|
| 0001 | code-ai 请求 test-ai 验证项目 AI 工作区骨架 | open | code-ai | test-ai | - | `.ai/interactions/open/0001-ai-workspace-skeleton.md` |
| 0002 | code-ai 请求 test-ai 重跑 WOS4 创建/布局流程 | open | code-ai | test-ai | - | `.ai/interactions/open/0002-wos4-create-layout-flow.md` |
| 0003 | code-ai 请求 review-ai 检查 skill 迁移 | open | code-ai | review-ai | - | `.ai/interactions/open/0003-skill-migration-review.md` |
| 0004 | code-ai 请求 test-ai 验证 WOS4 人类导航 skill | open | code-ai | test-ai | - | `.ai/interactions/open/0004-wos4-human-navigation.md` |
| 0005 | code-ai 请求 test-ai/review-ai 验证 GPT-5 实施路线手册 | open | code-ai | test-ai / review-ai | - | `.ai/interactions/open/0005-gpt5-implementation-runbook.md` |
| 0006 | 验证蓝色客户端创建 skill | open | 孙宇飞_code-ai | 孙宇飞_test-ai<br>孙宇飞_review-ai | wos4-artifacts/tasks/20260623-验证蓝色客户端创建skill/ | `.ai/interactions/open/0006-blue-client-skill-verify.md` |
| 0007 | code-ai 请求 test-ai / review-ai 验证 skill 清理和命名规则 | open | code-ai | test-ai / review-ai | - | `.ai/interactions/open/0007-skill-cleanup-naming-review.md` |
| 0008 | code-ai 请求 test-ai / review-ai 验证建模客户端后台查询 Demo 持久化边界 | open | code-ai | test-ai / review-ai | - | `.ai/interactions/open/0008-backend-query-demo-persistence.md` |
| 0009 | 盛云科技_孙宇飞_Palimpsest 新测试页设计 | open | 孙宇飞_design-ai | 孙宇飞_frontend-ai<br>孙宇飞_code-ai<br>孙宇飞_test-ai<br>孙宇飞_review-ai | wos4-artifacts/tasks/20260623-新测试页左右菜单CRUD弹窗设计/ | `.ai/interactions/open/0009-palimpsest-design.md` |

## 操作约束

- 新建事项不要在本文件写长内容，只新增 `.ai/interactions/open/<id>.md`，再在本表加一行。
- 新 ID 使用时间戳格式：`yyyyMMddTHHmmss-短标题`；旧 `0001` 这类编号只作为历史兼容保留。
- 参与人反馈写事件文件，不直接改别人的事项正文。
- close 时移动事项文件到 `.ai/interactions/closed/`，更新本索引和 `.ai/interactions/INDEX.md`，并更新 `MEMORY.md`。
