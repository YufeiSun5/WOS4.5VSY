# 项目目录地图

本文件解释 `D:\DEV_D\WOS4.5` 当前目录怎么编排，以及后续清理时每类文件应该放到哪里。

## 根目录应该只保留入口

根目录用于放少量必须第一眼看到的入口文件：

- `README.md`：人类开发者入口。
- `AGENTS.md`：AI 执行入口和强制规则。
- `MEMORY.md`：项目长期记忆和 AI 修改记录。
- `AI-INTERACTION-PANEL.md`：多人 AI 协作看板。
- `.gitignore`：Git 忽略规则。
- `.ai/`：AI 规则、身份、skill、设计文档。
- `wos4-artifacts/`：WOS4 自动化产物归档区。

根目录不应该长期堆放一次性探针脚本、截图、快照、视频和旧调试文件。

## `.ai` 是 AI 工作区

```text
.ai/
├─ agents/              AI 身份定义
├─ instructions/        项目级通用规则
├─ skills/              项目真实 skill 源
├─ docs/                项目设计、流程、目录和版本树文档
└─ closed-interactions/ 已关闭协作事项归档
```

规则：

- 新增或修订 skill 只放 `.ai/skills/`。
- 新增设计文档、路线图、目录说明放 `.ai/docs/`。
- AI 操作前先读 `AGENTS.md`，再按任务读对应 skill。

## `wos4-artifacts` 是证据和产物区

```text
wos4-artifacts/
├─ config/      本机 ini、浏览器 profile、本地连接配置
├─ scripts/     可复用自动化脚本、探针脚本、修复脚本
├─ screenshots/ 编辑器、预览页、错误现场截图
├─ snapshots/   页面模型、运行时快照、验证 JSON
├─ tests/       测试用例、测试数据、回归记录
├─ reports/     阶段报告、验证报告、时间报告
├─ backups/     修改前后备份
└─ docs/        WOS4 帮助手册知识库和平台资料
```

规则：

- 真实 `wos4.local.ini` 留在 `wos4-artifacts/config/`，不进 Git。
- 修改 WOS4 页面、后端函数、客户端发布链路时，证据放入 `backups/<任务名或页面名>/`。
- 可复用脚本迁入 `scripts/`；一次性脚本清理前先确认是否有明文密码或运行时 token。

## 当前已知散落物

根目录当前仍有历史文件，先不要随手删除：

- `wos4-*.js`、`probe*.js`、`temp_probe_runtime.js`：旧探针和一次性自动化脚本。
- `preview_*.png`、`wos4-*.png`、`probetest_*.png`：旧截图。
- `screenshots/`、`snapshots/`：早期根目录证据目录，后续应迁入 `wos4-artifacts/`。
- `WOS4_deep_test_notes.md`：当前仍是重要测试总记录，暂时保留根目录。
- `20260612092426-*.mp4`：大视频文件，是否归档或移出 Git 工作区需要人工确认。
- `network/`：网络抓包，可能含敏感运行时数据，不应直接提交。

## 推荐清理顺序

1. 先建立或确认 Git 基线，避免清理时丢证据。
2. 扫描根目录旧脚本中的密码、Cookie、Token 和动态运行时 ID。
3. 可复用脚本迁入 `wos4-artifacts/scripts/`，一次性脚本迁入按日期命名的备份目录或删除。
4. 根目录旧截图迁入 `wos4-artifacts/screenshots/legacy/`。
5. 根目录旧快照迁入 `wos4-artifacts/snapshots/legacy/`。
6. 大视频和网络抓包单独确认保留策略。
7. 每批迁移后更新 `MEMORY.md`，必要时更新 `AI-INTERACTION-PANEL.md` 请求 review-ai 审阅。

## 判断口径

- 要找“规则”：看 `AGENTS.md` 和 `.ai/instructions/`。
- 要找“怎么操作”：看 `.ai/skills/`。
- 要找“为什么这么做”：看 `.ai/docs/`。
- 要找“证据”：看 `wos4-artifacts/`。
- 要找“现在做到哪里”：看 `MEMORY.md` 和 `WOS4_deep_test_notes.md`。
- 要找“谁做了什么”：看 `AI-INTERACTION-PANEL.md`。
