# Git 基线计划

## 当前原则

已经初始化本地 Git，分支为 `main`。初始提交前必须先做敏感信息和产物范围检查。

## 不直接提交的内容

- `network/`：浏览器网络请求抓包，可能包含运行时 ID、请求体和平台数据。
- 旧 `probe*.js`、`temp_probe_runtime.js`：一次性探针，存在明文密码或临时调试逻辑。
- 任何包含密码、Cookie、Token、会话 ID 的文件。

## 初始提交建议范围

优先提交：

- `AGENTS.md`
- `MEMORY.md`
- `AI-INTERACTION-PANEL.md`
- `.gitignore`
- `.ai/`
- `wos4-artifacts/README.md`
- `wos4-artifacts/**/.gitkeep`
- 已清理过的 skill 文档

暂缓提交：

- 根目录旧 WOS4 脚本，等统一改成 `WOS4_PASS` 后再提交。
- 旧截图和快照，等确认无敏感信息后再迁移到 `wos4-artifacts/`。

## 基线流程

1. 运行敏感信息扫描。
2. 清理或忽略不应提交的旧文件。
3. 提交 AI 工作区和规则文件。
4. 分批清理 WOS4 脚本。
5. 分批迁移截图、快照、测试报告。
6. 每批迁移后查看 `git diff --stat`。
