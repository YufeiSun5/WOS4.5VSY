# 备份和版本管理规则

本项目有两层版本管理：本地 Git 和 WOS4 平台历史版本。

## 本地 Git

- Git 根目录：`D:\DEV_D\WOS4.5`
- Git 元数据目录：`D:\DEV_D\WOS4.5\.git`
- 本地 Git 管理 AI 规则、skill、文档、自动化脚本、可提交的备份索引和证据清单。
- 真实密码、Cookie、Token、`wos4.local.ini`、浏览器 profile、网络抓包不进入 Git。

## WOS4 平台版本

WOS4 前端布局、组件脚本、后端模块、客户端画面、运行包和运维部署状态以 WOS4 平台自己的历史版本为准。本地只保存：

- 修改前导出的 `before.json`。
- 修改后导出的 `after.json`。
- 预览或运行验证得到的 `verify.json`。
- 编辑器、预览页、运行页截图。
- 操作者、时间、平台路径、平台版本号和提交说明。

## 每次修改前怎么备份

修改本地文件前：

1. 先看 `git status --short`，确认工作区已有改动。
2. 每次修改文件前，都先把将要修改的文件复制到 `wos4-artifacts/backups/<中文任务名>-<时间>/before/`。
3. 新增文件时，在备份清单里记录该文件修改前不存在。
4. 删除文件或目录时，先复制到 `wos4-artifacts/backups/<中文任务名>-<时间>/before-delete/`。
5. 备份目录必须包含清单，例如 `cleanup-manifest.json`、`backup-manifest.json` 或 README。
6. 修改后更新 `MEMORY.md`。
7. 如果备份内容包含旧脚本、抓包、截图或其他可能含敏感信息的文件，原始备份目录只本机保留，不进 Git；只提交清单和说明。

## 备份目录命名语言

- `wos4-artifacts/backups/` 下的新备份目录名优先使用中文任务名。
- 清单里的 `path`、文件名、函数名、平台对象名、时间戳、扩展名保持原样。
- 如果目录名需要被脚本稳定匹配，可以保留英文关键词，但应补中文说明。
- 推荐格式：

```text
wos4-artifacts/backups/<中文任务名>-yyyyMMddTHHmmss/
```

示例：

```text
wos4-artifacts/backups/中文备份规则和知识库检查-20260623T100346/
```

修改 WOS4 平台对象前：

1. 导出目标对象当前版本为 `before.json`。
2. 保存编辑器修改前截图。
3. 记录 WOS4 路径、对象名、平台版本号、操作者和使用的 skill。
4. 修改保存提交后导出 `after.json`。
5. 预览或运行验证后保存 `verify.json` 和截图。
6. 把结论写入 `WOS4_deep_test_notes.md`。

## 本轮清理示例

2026-06-23 工作区清理使用的备份目录：

```text
wos4-artifacts/backups/workspace-cleanup-20260623T093404/
├─ cleanup-manifest.json
└─ before-delete/
```

清理方式是：先复制根目录散落物到 `before-delete/`，写入清单，再删除原位置。

`before-delete/` 已在 `.gitignore` 中忽略，避免把旧脚本或抓包误提交。

2026-06-23 备份规则收紧前置备份目录：

```text
wos4-artifacts/backups/doc-policy-tighten-20260623T093624/
├─ backup-manifest.json
└─ before/
```
