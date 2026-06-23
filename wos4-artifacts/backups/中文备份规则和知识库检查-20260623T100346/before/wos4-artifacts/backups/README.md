# `wos4-artifacts/backups`

修改前后备份目录。

每次修改 WOS4 平台对象、本地文件批量清理、删除、迁移或重写前，都在这里创建按任务和时间命名的子目录。

推荐结构：

```text
<任务名>-<时间>/
├─ backup-manifest.json
├─ before/
├─ before-delete/
├─ after/
└─ verify/
```

可能包含敏感旧脚本、抓包或截图的原始备份不应提交到 Git，只提交清单和说明。
