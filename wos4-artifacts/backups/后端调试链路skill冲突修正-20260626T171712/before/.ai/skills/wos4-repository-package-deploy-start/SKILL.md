---
name: wos4-repository-package-deploy-start
description: Deploy and start a verified WOS4 repository data package from Time Space Development deployment management. Use after a warehouse package has been verified; covers creating/selecting a personal time-space, adding the repository package, deploying the time-space and package, and starting them. Does not cover destructive stop/delete/redeploy.
---

# WOS4 Repository Package Deploy And Start

## Scope

Use this skill for the verified deployment/start part of the source/meta-language demo route:

```text
时空功能开发
-> 部署管理
-> 本云(0)
-> personal time-space
-> 时空仓库管理
-> 添加仓库包
-> 部署
-> 启动
-> 时空对象管理验证
```

Do not enter `KingStudio_V20260514`. Do not use dynamic `/public/` or `GetFileContent` URLs as entry points. Use visible UI navigation and `browser-harness` unless the user changes the tool requirement.

## Required Skills

Read and follow these first:

- `D:\DEV_D\WOS4.5\.ai\skills\wos4-browser-harness\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-human-navigation\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-meta-language-fu-release-package\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-manual-to-skill\SKILL.md`

## Verified Baseline

- Time-space: `盛云_孙宇飞_时空_0617`
- Repository: `盛云_孙宇飞_仓库`
- Repository package description: `meta-language-demo-0617-package-1`
- Repository package version: `V1`
- Final verified state:
  - time-space status: `运行`
  - repository package status: `运行`
- Added package version: `V2`
- Added package description: `meta-language-demo-0617-package-v2-oncreate-trace`
- Added package time: `2026-06-17 13:10:49`
- Added package verified state: `已部署`
- V2 package verified running state in a new child time-space:
  - child time-space: `盛云_孙宇飞_时空_0617_V2`
  - child time-space status: `运行`
  - V2 package status in child time-space: `运行`
- V2 package verified running state in a new top-level time-space:
  - top-level time-space: `盛云_孙宇飞_时空_0617_TOPV2`
  - top-level time-space status: `运行`
  - V2 package status in top-level time-space: `运行`
  - independent `时空对象管理` showed this top-level time-space and allowed App/FU object creation.

Treat names as examples/evidence. Do not hard-code them for other tasks.

## Manual Basis

The help KB `App引擎介绍` says:

- Running repositories/copies/models are deployed from the model library to the App engine.
- Creating or starting an App object depends on an App copy/repository already existing in the engine.
- App read/write permissions depend on the deployment time-space.

Manual text is only a hypothesis source. The steps below are based on UI verification.

## Enter Deployment Management

1. From WOS4 main desktop, use the visible `时空功能开发` app/taskbar entry.
2. Click the visible tab `部署管理`.
3. Open `本云(0)` with `进入>`.
4. Confirm the page shows two panels:
   - top: `时空对象管理`
   - bottom: `时空仓库管理`

## Create Personal Time-Space

If the personal time-space is missing:

1. In the top `时空对象管理` toolbar, click `创建`.
2. Fill:
   - `名称`: personal time-space name
   - `描述`: short purpose note
3. Use `选择` only if the data-area dialog appears; selecting `默认数据区` is valid for the verified default path.
4. Keep deployment system config values at default unless the task requires another data area.
5. Click `确认`.
6. Verify `创建成功` and a new card/tree item appears with `状态: 未部署`.

Verified example:

```text
盛云_孙宇飞_时空_0617
状态: 未部署
```

## Add Repository Package

1. In the left time-space tree, click the exact `.el-tree-node__label` or row text of the personal time-space.
2. Confirm bottom `时空仓库管理 -> 添加` is enabled.
3. Click `添加`.
4. In `添加时空仓库`, click `默认数据区` first.
5. Select the personal repository node, for example `盛云_孙宇飞_仓库`.
6. Confirm the middle package list shows the expected `V1` row and package description.
7. Click the `V1` package row.
8. Click the center arrow button to move it to `预添加仓库数据包`.
9. Confirm the dialog shows `已选仓库包 1 项`.
10. Click `确认`.
11. Verify the bottom card appears with `状态: 未部署`.

Selection trap: typing in the add dialog search field does not load packages until the data-area/repository tree is selected.

Verified package row:

```text
V1
描述: meta-language-demo-0617-package-1
时间: 2026-06-17 11:52:52
```

Verified added package row:

```text
V2
描述: meta-language-demo-0617-package-v2-oncreate-trace
时间: 2026-06-17 13:10:49
```

Browser-harness encoding trap:

- Do not replace raw Chinese Python strings into JS source from an ASCII temp file. The verified safe pattern is to write Chinese labels directly as `\u` escaped JS string literals.
- In `添加时空仓库`, select the exact `.repo-item` for the package version, not the dialog body. The V2 item was a `.repo-item` under the package list.

## Deploy

Deploy the time-space before expecting repository package deploy/start to work:

1. Select the personal time-space card in the top `时空对象管理` card grid.
2. Click the top `部署`.
3. Wait until the personal time-space card shows `状态: 已部署`.
4. Re-check the bottom repository package card. In the verified run, it also changed to `状态: 已部署`.

If bottom repository package `部署` appears enabled but does nothing while the parent time-space is still `未部署`, deploy the parent time-space first.

## Start

1. Select the personal time-space card in the top card grid.
2. Click the top `启动`.
3. Wait until the personal time-space card shows `状态: 运行`.
4. Re-check the bottom repository package card. In the verified run, it also changed to `状态: 运行`.

Verified final state:

```text
盛云_孙宇飞_时空_0617
状态: 运行

V1
盛云_孙宇飞_仓库
状态: 运行
```

## Add A New Version To An Already Running Time-Space

This is only partially verified:

1. Select the personal time-space by exact left tree label.
2. Use bottom `时空仓库管理 -> 添加`.
3. In `添加时空仓库`, select `默认数据区`, then the personal repository.
4. Select package `V2` by the exact `.repo-item`, click the center arrow, and confirm.
5. The bottom card appears as `V2 <repository> 状态: 未部署`.
6. Select the exact bottom `.data-item` for V2, not the surrounding `.data-container`.
7. Click bottom `部署`.
8. Verified state changes from `未部署` to `已部署`.

Do not assume bottom `启动` works for an added same-repository V2 package in an already running time-space. In the verified run, clicking bottom `启动` and waiting about 60 seconds left V2 at `已部署`, while V1 remained `运行`.

## Start A New Package Version In A Fresh Child Time-Space

This is verified for the case where adding V2 to an already running time-space only reaches `已部署`.

1. Select the parent personal time-space in the left tree.
2. In the top `时空对象管理` toolbar, click `创建`.
3. Fill a child time-space name and description.
4. Keep deployment system config values at default unless the task requires another data area.
5. Click `确认`.
6. Verify the child time-space appears under the parent in the left tree and has `状态: 未部署`.
7. Select the child time-space tree node.
8. Confirm bottom `时空仓库管理` is empty and `添加` is enabled.
9. Click bottom `添加`.
10. In `添加时空仓库`, click or expand `默认数据区`; if only the data-area node is visible, click its expand area/row and wait.
11. Select the personal repository node.
12. Select the package version by exact `.repo-item`, for example `V2`.
13. Click the center arrow, confirm `已选仓库包 1 项`, and click `确认`.
14. Verify bottom card shows the package as `状态: 未部署`.
15. Select the parent personal time-space in the left tree.
16. Select the child time-space card in the top card grid.
17. Click the top `部署`, then wait until both:
    - child time-space card shows `状态: 已部署`
    - bottom package card shows `状态: 已部署`
18. With the child time-space card still selected, click the top `启动`.
19. Wait long enough for slow network/startup, then verify both:
    - child time-space card shows `状态: 运行`
    - bottom package card shows `状态: 运行`

Verified example:

```text
盛云_孙宇飞_时空_0617_V2
状态: 运行

V2
盛云_孙宇飞_仓库
状态: 运行
```

Selection trap:

- Deployment/start of a child time-space is done by selecting the child `data-item` card while viewing the parent node's top list.
- If you select the child tree node itself, the top list can be empty and top deploy/start may not target the child card.
- The independent `时空对象管理` desktop client did not show the verified child time-space after reload/reopen. Do not assume a running child time-space is directly selectable there.

## Start A Package Version In A Fresh Top-Level Time-Space

This is verified for object creation follow-up, but it is not the default update path.

Default behavior for iterative development is to reuse a fixed personal test time-space and update its repository package version. Use `wos4-runtime-package-update` before choosing this fallback.

Only create a fresh top-level time-space when:

- the user explicitly asks for isolation, or
- the existing time-space update path is blocked and the failure evidence is saved, or
- the goal is to verify whether a package version can run independently of existing runtime state.

1. In `部署管理`, enter `本云(0)`.
2. Select the root cloud node, not an existing personal time-space.
3. Use the top `时空对象管理 -> 创建`.
4. Fill a new top-level time-space name and description.
5. Keep deployment system config values at default unless the task requires another data area.
6. Add the intended repository package through bottom `时空仓库管理 -> 添加`.
7. Select `默认数据区 -> 个人仓库 -> 盛云_孙宇飞_仓库`.
8. Select the intended package version by exact `.repo-item`, for example `V2`.
9. Confirm the package is added and initially shows `状态: 未部署`.
10. Select the top-level time-space card.
11. Click top `部署` and wait until both time-space and package show `已部署`.
12. Click top `启动` and wait until both time-space and package show `运行`.

Verified example:

```text
盛云_孙宇飞_时空_0617_TOPV2
状态: 运行

V2
盛云_孙宇飞_仓库
状态: 运行
```

Use this route when the next step is Object Management object creation, because the independent Object Management client showed the top-level time-space but did not show the child time-space.

## Runtime Verification

Switch to the visible `时空对象管理` desktop client or taskbar entry.

Expected baseline verification:

- The time-space tree includes the personal time-space.
- The initial `功能` list can be empty if the source/meta-language FU is only an empty template.
- Do not mark business function verification complete until a non-empty FU implementation creates/query objects or exposes a callable function.
- As of the verified V2 run, `时空对象管理` did not display child time-space `盛云_孙宇飞_时空_0617_V2`, even after main desktop reload and reopening the client. Object creation inside a child time-space remains unverified.
- As of the verified TOPV2 run, `时空对象管理` did display top-level time-space `盛云_孙宇飞_时空_0617_TOPV2`, and App/FU object creation plus `onCreate` Trace verification succeeded there.

## Prohibited Actions

Do not use this skill to:

- Delete, strong-delete, stop, force-stop, anti-deploy, or overwrite existing shared objects.
- Deploy into shared spaces such as `测试`, `开发系统`, or customer spaces unless the user explicitly instructs it.
- Treat an empty `功能` list as failure when the FU is still an empty template.
- Claim same-repository V2 package startup is verified when it only reached `已部署`.
- Claim App object creation or `onCreate` runtime Trace is verified just because the V2 repository package is `运行`.
- Use a child time-space for Object Management object creation until its independent Object Management entry is separately verified.

## Evidence

Save screenshots/snapshots for:

```text
deploy_create_own_spacetime_result
deploy_add_package_confirm_result
deploy_spacetime_result
start_spacetime_result
object_management_after_start
```

Append conclusions to:

```text
WOS4_deep_test_notes.md
MEMORY.md
```
