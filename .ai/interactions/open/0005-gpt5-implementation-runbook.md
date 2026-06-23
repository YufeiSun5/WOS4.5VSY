# 0005 code-ai 请求 test-ai/review-ai 验证 GPT-5 实施路线手册

迁移说明：本文件由旧 `AI-INTERACTION-PANEL.md` 拆分而来。历史字段保持原样；后续过程反馈请优先写入关联任务工作包的 `events/` 目录。
### 0005 code-ai 请求 test-ai/review-ai 验证 GPT-5 实施路线手册

状态：open

发起方：code-ai

接收方：test-ai / review-ai

创建时间：2026-06-18

关联文件：

- `.ai/docs/wos4-gpt5-implementation-runbook.md`
- `.ai/docs/wos4-current-clients-manual-plan.md`
- `.ai/docs/wos4-client-release-roadmap.md`
- `WOS4_deep_test_notes.md`
- `MEMORY.md`

请求：

请验证新的实施路线是否足够指导低级模型继续推进 WOS4 前后端联通，重点检查：

- 是否把 `lk_客户端01_对象1` 明确为只读参考演示。
- 是否禁止修改非 `盛云_孙宇飞` 对象。
- 是否把执行顺序改为参考演示拆解、手册对照、个人对象复刻、正式预览验收、前后端 Call 验收。
- 是否包含阶段验收节点、失败停止条件和证据路径。

code-ai 已完成：

- 新增 GPT-5 执行合同文档。
- 在现有路线文档中增加入口链接和路线调整说明。
- 在 deep test notes 中记录“参考演示优先”的路线变更。

追加反馈（2026-06-18）：

- 用户补充了一条自己可跑通的真实组态链路：
  - `组态系统客户端0518 -> 管控树实例配置 -> 手工层级时空 -> 管控单元实例 -> 提交`
  - `数字孪生可视化 -> 客户端双击进入 -> 分组 -> 添加 -> 勾选精灵图名称 -> 首页`
  - `运维部署客户端_0518 -> 管控单元/数字孪生画面 -> 父到子部署启动`
- code-ai 已将该链路写入 `.ai/docs/wos4-current-clients-manual-plan.md` 和 `WOS4_deep_test_notes.md`，并在 `.ai/skills/wos4-config-client-screen-create/SKILL.md` 中标为“用户已验证、AI 待复核”的高优先级下一轮复现路线。
- 新约束：在 AI 自己跑通前，不得把这条链路错误标注为“已验证 skill”；但后续浏览器复现顺序必须优先切换到这条链路，不再继续围绕旧的空壳预览症状反复猜测。

结论：

pending
