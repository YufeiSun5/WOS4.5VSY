# `wos4-artifacts/scripts`

脚本目录。

用于保存可复用 WOS4 自动化脚本、探针脚本和修复脚本。

规则：

- 可复用脚本放这里。
- 一次性临时脚本先放备份目录或清理。
- 脚本不得写入明文密码；密码从环境变量或本地 ini 读取。

## 门禁脚本

- `ai-preflight.ps1`：AI 执行 WOS4 操作、提交前检查或复杂任务实施前的本地门禁。
- `wos4-lock.ps1`：WOS4 多账号并发锁。登录前申请账号锁，保存/提交/发布前可申请对象锁，任务结束后释放锁。
- `wos4-browser-sessions.ps1`：启动和管理多个独立 Chrome profile，并把每个 profile 绑定到独立 browser-harness daemon。该脚本只准备浏览器隔离环境，不登录、不申请账号锁、不认领 AI 身份。

常用命令：

```powershell
powershell -ExecutionPolicy Bypass -File wos4-artifacts/scripts/ai-preflight.ps1
powershell -ExecutionPolicy Bypass -File wos4-artifacts/scripts/ai-preflight.ps1 -Wos4 -TaskPath wos4-artifacts/tasks/<任务目录>
powershell -ExecutionPolicy Bypass -File wos4-artifacts/scripts/ai-preflight.ps1 -RequireClean
powershell -ExecutionPolicy Bypass -File wos4-artifacts/scripts/ai-preflight.ps1 -ExpectedDeveloper 孙宇飞 -ExpectedUrl http://<wos4-host>:<port>/#/login
```

脚本默认只校验 `wos4.local.ini` 的 `[identity] developer_name` 和 `[wos4] url/username/password` 是否存在，不写死开发人员或 URL。需要强校验时，用 `-ExpectedDeveloper`、`-ExpectedUrl`，或环境变量 `WOS4_EXPECTED_DEVELOPER`、`WOS4_EXPECTED_URL`。

脚本只输出字段是否存在和检查结论，不输出 URL 值、密码、Cookie、Token。

## 三 profile 浏览器会话

先启动独立 Chrome profile 和 browser-harness daemon：

```powershell
powershell -ExecutionPolicy Bypass -File wos4-artifacts/scripts/wos4-browser-sessions.ps1 -Action Start
```

默认启动参数会给每个 Chrome 传入 `--window-size=1920,1080`，并用轻微 offset 错开窗口位置。也可以显式指定：

```powershell
powershell -ExecutionPolicy Bypass -File wos4-artifacts/scripts/wos4-browser-sessions.ps1 -Action Start -WindowWidth 1920 -WindowHeight 1080
```

注意：`1920x1080` 是 Chrome 外层窗口大小，browser-harness 的 `page_info().w/h` 是网页 viewport，会扣掉浏览器标题栏和地址栏高度。截图验收优先使用每个 CDP/browser-harness 会话自己的截图，不依赖三个窗口同时处于前台。

检查三组 CDP 端口是否可达：

```powershell
powershell -ExecutionPolicy Bypass -File wos4-artifacts/scripts/wos4-browser-sessions.ps1 -Action Status
```

检查 browser-harness 是否看到三个命名连接：

```powershell
powershell -ExecutionPolicy Bypass -File wos4-artifacts/scripts/wos4-browser-sessions.ps1 -Action Doctor
```

成功隔离的标识：

- `Status` 中每个 session 的 `cdp.ok=true`，且 `cdp_port` 不同，例如 `13222/13223/13224`。
- `Doctor` 中出现不同连接名，例如 `wos4_slot1`、`wos4_slot2`、`wos4_slot3`。
- 登录后分别回查各 profile 均在 `#/main`，且 sessionStorage 有 `IS_BS`、`clientNumber`、`desktop_storageCloud`、`proxy_pathname` 等键；一个账号登录不会让另一个 profile 回到登录页。

停止本轮测试 daemon 和专用 Chrome：

```powershell
powershell -ExecutionPolicy Bypass -File wos4-artifacts/scripts/wos4-browser-sessions.ps1 -Action Stop
```

如果只是重启 browser-harness daemon，不关闭 Chrome：

```powershell
powershell -ExecutionPolicy Bypass -File wos4-artifacts/scripts/wos4-browser-sessions.ps1 -Action StopHarness
```

注意：启动浏览器不等于占用账号。只有执行 `wos4-lock.ps1 -Action AcquireAccount` 并登录时，才认领账号和 AI 身份。

## WOS4 账号锁

登录前必须先申请账号锁：

```powershell
powershell -ExecutionPolicy Bypass -File wos4-artifacts/scripts/wos4-lock.ps1 -Action AcquireAccount -Owner 孙宇飞_code-ai -Task "任务说明"
```

指定账号或会话槽：

```powershell
powershell -ExecutionPolicy Bypass -File wos4-artifacts/scripts/wos4-lock.ps1 -Action AcquireAccount -Account xiang_xuezhi -Session slot2 -Owner 孙宇飞_code-ai -Task "任务说明"
```

账号池用尽时脚本返回 `status=blocked` 和 `reason=account_pool_exhausted`，AI 必须拒绝继续并发登录，不能重复登录已锁账号。

归还账号使用权：

```powershell
powershell -ExecutionPolicy Bypass -File wos4-artifacts/scripts/wos4-lock.ps1 -Action ReleaseAccount -Account xiang_xuezhi -Owner 孙宇飞_code-ai
```

保存、提交、发布前的对象锁：

```powershell
powershell -ExecutionPolicy Bypass -File wos4-artifacts/scripts/wos4-lock.ps1 -Action AcquireObject -Account xiang_xuezhi -ObjectType page -Object PalimpsestMenu_18 -Owner 孙宇飞_code-ai
powershell -ExecutionPolicy Bypass -File wos4-artifacts/scripts/wos4-lock.ps1 -Action ReleaseObject -ObjectType page -Object PalimpsestMenu_18 -Owner 孙宇飞_code-ai
```

强制释放账号只能在用户明确授权时执行，并必须写明原因：

```powershell
powershell -ExecutionPolicy Bypass -File wos4-artifacts/scripts/wos4-lock.ps1 -Action ForceReleaseAccount -Account sun_yufei -Owner 孙宇飞_code-ai -Reason "用户明确要求释放"
```
