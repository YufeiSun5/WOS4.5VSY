# `wos4-artifacts/scripts`

脚本目录。

用于保存可复用 WOS4 自动化脚本、探针脚本和修复脚本。

规则：

- 可复用脚本放这里。
- 一次性临时脚本先放备份目录或清理。
- 脚本不得写入明文密码；密码从环境变量或本地 ini 读取。

## 门禁脚本

- `ai-preflight.ps1`：AI 执行 WOS4 操作、提交前检查或复杂任务实施前的本地门禁。

常用命令：

```powershell
powershell -ExecutionPolicy Bypass -File wos4-artifacts/scripts/ai-preflight.ps1
powershell -ExecutionPolicy Bypass -File wos4-artifacts/scripts/ai-preflight.ps1 -Wos4 -TaskPath wos4-artifacts/tasks/<任务目录>
powershell -ExecutionPolicy Bypass -File wos4-artifacts/scripts/ai-preflight.ps1 -RequireClean
```

脚本只输出字段是否存在和检查结论，不输出密码、Cookie、Token。
