# WOS4 Artifacts

本目录用于集中保存 WOS4 自动化开发和测试产物。

- `config/`：本机 WOS4 连接配置，真实 ini 不进 Git。
- `scripts/`：自动化脚本和探针脚本。
- `screenshots/`：编辑器、预览页、错误现场截图。
- `snapshots/`：页面模型、运行时快照、验证 JSON。
- `tests/`：测试用例、测试数据、回归测试记录。
- `reports/`：阶段报告和验证报告。
- `backups/`：修改前后安全备份。
- `tasks/`：任务工作包。复杂任务按一个任务一个文件夹管理，交互面板只指向任务目录。

详细规则见 `.ai/docs/wos4-artifact-placement.md`。

## 本地 ini

从 `config/wos4.local.example.ini` 复制创建 `config/wos4.local.ini`。真实 ini 不进 Git。

```ini
[wos4]
url=http://<wos4-host>:<port>/#/login
username=<开发人员登录用户名>
password=<开发人员登录密码>
proxy=direct

[ops]
url=http://<ops-host>:<port>/#/login
username=<运维用户名>
password=<运维密码>
cloud_id=<云编号>
host=<运维主机或云访问地址>
port=<运维端口>

[debug_access]
cloud_name=<调试云名称>
cloud_id=<云编号>
host=<调试访问地址>
port=<调试访问端口>
username=<调试访问用户名>
password=<调试访问密码>
```

`[wos4]` 是开发人员登录 WOS4.5 的账号；运维和调试访问账号放在独立段。
