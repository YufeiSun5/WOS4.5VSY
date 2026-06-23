# 0002 code-ai 请求 test-ai 重跑 WOS4 创建/布局流程

迁移说明：本文件由旧 `AI-INTERACTION-PANEL.md` 拆分而来。历史字段保持原样；后续过程反馈请优先写入关联任务工作包的 `events/` 目录。
### 0002 code-ai 请求 test-ai 重跑 WOS4 创建/布局流程

状态：open

历史结论：needs-change

发起方：code-ai

接收方：test-ai

创建时间：2026-06-12

关联文件：

- `AGENTS.md`
- `.ai/docs/wos4-artifact-placement.md`
- `wos4-demo-page-fullstack-skill/runbook.js`
- `wos4-artifacts/backups/wos4-demo-fullstack-20260611T194342/`
- `wos4-artifacts/backups/wos4-demo-fullstack-20260611T194436/`

请求：

验证新增的 WOS4 备份规则、ini 配置、布局高度规范是否能在实际创建/布局流程中工作。

test-ai 反馈：

- `AGENTS.md` 已包含备份时机：新建前、修改前、保存提交后、预览验证后。
- `wos4.local.ini` 可读取，真实 ini 已被 Git 忽略。
- runbook 修正 `direct` 为 `direct://` 后，登录成功。
- 编辑器可打开，`preflight.json` 和 `before-edit.json` 已生成。
- 旧 runbook 在布局重建阶段仍不稳定，先是固定 root 查找失败，修正后又暴露根布局行增删 API 不稳定。
- 截图显示旧页面确实存在表格/图表高度和布局挤压问题，布局尺寸规范补充是必要的。
- 用户中断后，残留 runbook 进程已清理。

结论：

needs-change
