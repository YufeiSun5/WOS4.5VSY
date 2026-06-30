---
name: wos4-blue-client-object-create
description: WOS4 blue WebJS client object creation and runtime verification notes. Use to distinguish blue/purple client evidence, create a personal WebJS blue client object only from a deployed client template under the main spacetime 功能 tab, or verify an already deployed WebJS runtime shell. Do not use this skill to create backend/business-event/custom-calculation content in Time Space Object Management.
---

# WOS4 Blue Client Runtime Verify And Legacy Notes

## Overview

Use this skill for blue-client object creation and runtime verification only. It is not a backend instantiation skill.

Current project rule:

```text
建模系统: write/submit source model, business events, custom calculations
-> 组态系统客户端: instantiate runtime-bearing models and bind pages/clients
-> 运维部署客户端: deploy / update / start
-> 时空对象管理平台: read spacetime info, verify objects, open view/log/debug
```

`时空对象管理平台` is not a backend creation workaround. If a backend/business-event/custom-calculation object is absent there, go back to 运维部署 or model/package version work.

WebJS blue client objects are the exception: after a config client has been submitted, packaged, deployed, and started, create or verify the personal WebJS app object from the main spacetime `功能` tab.

Do not use it for:

- first-time page design
- layout editing
- backend FU creation
- general deploy management
- public/shared object creation without the explicit role-binding step
- current backend/business-event/custom-calculation debugging
- creating backend/business-event/custom-calculation objects in `时空对象管理平台`

## Required Skills

Read these first:

- `D:\DEV_D\WOS4.5\.ai\skills\wos4-browser-harness\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-human-navigation\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-config-client-screen-create\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-object-create-verify\SKILL.md`

## Preconditions

Before using this skill, verify:

1. The unit-instance tree is already valid:

```text
level1 has real content
level2 has real content
```

2. Deploy-side client/template state is already present.
3. You are operating only in the user's personal objects.
4. `时空对象管理平台` is opened by visible desktop navigation, not a guessed runtime URL.

## Purple Vs Blue

Treat icon asset and template language type as the first reliable distinction:

- purple / non-final object clues:
  - icon asset like `func_unit_editor_light-...png`
  - template language type `元语言`
- blue / runnable client clues:
  - icon asset like `js_func_unit_editor_light-...png`
  - template language type `WebJS`

If the result is purple, stop and go back to template selection. Do not continue pretending it is the final client.

## Display Name Trap

For WOS4 clients, the visible renamed client and the internal runtime repo can diverge.

Verified `Noctiluca` example:

- visible renamed node: `盛云_孙宇飞_Noctiluca_客户端`
- internal runtime repo node: `客户端1`

Do not assume the visible renamed node is the correct create context.

The template selector is authoritative.

## Current Verified Route: Palimpsest 0626R2 WebJS Object

Use this route only after the config client row is already deployed/started and the WebJS template copy exists.

```text
时空对象管理平台
-> select main spacetime `PalimpsestL1_0626R2`
-> top tab `功能`
-> 创建
-> 应用模板: 选择
-> 仓库: `盛云_孙宇飞_Palimpsest客户端_0626R2`
-> select row:
   名称: 盛云_孙宇飞_Palimpsest客户端_0626R2
   语言类型: WebJS
   拷贝ID: 7205759403792797202
   拷贝GUID: 5f2c8c4b-5ed5-4d0a-9444-a7ffaf0f67a2
   模型GUID: f5f8c456-e145-4d85-b1c3-dc3a17e7b512
   模型版本: 118
-> 确定
-> name the object with a meaningful personal name
-> keep `个人应用` for first runtime verification
-> 确定
```

Verified created desktop cards:

```text
盛云_孙宇飞_Palimpsest客户端_0626R2_对象1
  class: data-item card-item is-stop

盛云_孙宇飞_Palimpsest客户端_0626R2_正式蓝端
  icon: js_func_unit_editor_light-DMRXO09p.1780642478302.png
  class: data-item card-item
```

Observed Palimpsest caveats:

- Do not use `$Client -> 三方APP -> 创建` for WebJS. That path is for container third-party apps and can fail with `仓库不存在 / 654319619`.
- The main spacetime `功能` list can show `共 1 条` and still render `暂无数据`; refresh back to the desktop and check blue WebJS cards.
- `名称重复, 请检查` after submitting a meaningful name can mean the previous click already created the object while the list failed to render it.
- The access-spacetime configuration dialog accepts rows such as `云ID=1` and `时空GUID=aba6cf7a-0715-4966-8eaf-0f448eba7bc9`, but the first successful personal object creation did not visibly require this field.
- In browser-harness, real double-click did not open the desktop card in this run. Dispatching DOM `click/dblclick` to the visible `.data-item.card-item` opened the app. Treat this as a harness workaround, not a human workflow.

## Deprecated Historical Route: Failed Object-Management Creation

This historical route is now prohibited for current work. It is kept only as failure evidence for `Noctiluca`:

```text
时空对象管理平台
-> 选中 `盛云_孙宇飞_Noctiluca_客户端`
-> 创建
-> 应用模板: 选择
-> 选 `盛云_孙宇飞_Noctiluca_客户端 / WebJS`
-> 确定
```

Observed result:

- a blue icon can appear
- but creation can fail with:

```text
仓库不存在
失败：错误码 [654319619]，描述 [仓库不存在]
```

Do not reuse that route as the stable path.

## Deprecated Historical Route: Object-Management Creation

This route was once verified for `Noctiluca`, but conflicts with the current backend-chain rule because it creates content in `时空对象管理平台`. Keep it as historical evidence only:

```text
时空对象管理平台
-> 左树选中 `客户端1`
-> 创建
-> 应用模板: 选择
-> 选 `客户端1 / WebJS`
-> 确定
-> 名称改为个人对象名
-> 应用类型保持 `个人应用`
-> 确定
```

Verified created object:

```text
盛云_孙宇飞_Noctiluca_客户端_对象2
```

Verified template fields:

- template repo: `客户端1`
- language type: `WebJS`
- copy id: `7205759403792795788`
- copy guid: `c07957c7-f573-4c43-b4d3-b1a9e24ea582`
- model guid: `f5f8c456-e145-4d85-b1c3-dc3a17e7b512`
- model version: `105`

## Deprecated Historical Route: 2026-06-22 New-Client Creation

This route is historical only. Do not use it for current backend work or as a general publishing pattern.

Verified project and client:

```text
盛云_孙宇飞_CRUD工程_0620
盛云_孙宇飞_Nadir_客户端_0622
```

Precondition from `运维部署客户端 -> 数字孪生可视化`:

```text
盛云_孙宇飞_Nadir_客户端_0622
版本 2
已部署
已启动
```

If deployment/start status appears stale, switch to another工程 and back to `盛云_孙宇飞_CRUD工程_0620`, then re-enter `数字孪生可视化`.

Deprecated object-management creation route:

```text
时空对象管理平台
-> 左树选中 `盛云_孙宇飞_Nadir_客户端_0622`
-> 创建
-> 应用模板: 选择
-> 仓库下拉选择 `盛云_孙宇飞_Nadir_客户端_0622`
-> 在拷贝表中选择 `盛云_孙宇飞_Nadir_客户端_0622 / WebJS`
-> 确定
-> 应用类型保持 `个人应用`
-> 确定
```

Important selector rule:

The repository dropdown can default to an unrelated 元语言 backend such as `实时报警数据汇总_运行后台`. Do not confirm that default. Open the repository dropdown and choose the exact new client repository, then choose the `WebJS` row.

Verified Nadir WebJS template fields:

- template repo: `盛云_孙宇飞_Nadir_客户端_0622`
- language type: `WebJS`
- copy id: `7205759403792795994`
- copy guid: `8161b9bf-42d7-4f5d-83ec-46dccc16e6c7`
- model guid: `f5f8c456-e145-4d85-b1c3-dc3a17e7b512`
- model version: `105`

Observed duplicate boundary:

- Creating with the default generated name can report `App名称重复 / -210117`.
- Before retrying, check `我创建的 -> 全部` and the desktop cards. In the verified run, existing Nadir WebJS cards already existed and one right-side object card was `data-item is-running`.
- Do not keep creating duplicate objects after `App名称重复`; switch to validating the existing blue object.

Verified Nadir blue object evidence:

```text
盛云_孙宇飞_Nadir_客户端_0622_对象1
icon: js_func_unit_editor_light-DMRXO09p.1774322731382.png
selected running card class: data-item data-item is-running
toolbar after selection:
  启动 disabled
  停止 / 编辑 / 日志 / 监视 / 视图 enabled
```

## Current Acceptance For Already-Deployed Blue Runtime

Do not mark already-deployed runtime verification complete until all are true:

1. The target blue client object appears from the main spacetime `功能` WebJS route or as a desktop blue card; backend objects were not created in object management.
2. A blue card appears with icon asset `js_func_unit_editor_light-...png`.
3. The object-management tree/card belongs to the expected time-space/project.
4. The running row/card has class like:

```text
data-item is-running
```

5. After selecting the object, toolbar `停止 / 编辑 / 日志 / 视图` are enabled and `启动` is disabled.
6. Time-space information recorded for debugging comes from `时空对象管理平台`, not from a guessed URL or only from `时空功能开发平台`.

## View Validation

`视图` may not open a new tab.

In the verified run, it injected a hidden runtime iframe into the current `#/main` tab:

```text
/public/?id=6192730962611143089...
-> GetFileContent/.../f5f8c456-e145-4d85-b1c3-dc3a17e7b512_105/index.html
```

So after clicking `视图`, verify by recursive frame inspection, not only by tab count.

Verified runtime text probe:

```text
ElementButton
empty
共 0 条
前往页
```

That is enough to prove the runtime shell mounted page content.

Verified Nadir runtime text probe after `视图`:

```text
frontend backend call patch 20260622
查询全部(4)
泵站A-01
泵站A-02
泵站B-01
泵站B-02
```

The `视图` action injected another runtime iframe in the current `#/main` tab:

```text
/public/?id=6192730962611143124...
-> GetFileContent/.../f5f8c456-e145-4d85-b1c3-dc3a17e7b512_105/index.html
```

Do not use this dynamic URL as an entry path; record it only as evidence.

## Current Limit And Strongest Evidence

The AI-verified minimum route for older Nadir evidence is still:

```text
时空对象管理平台
-> 我创建的
-> 选中运行对象
-> 视图
```

This is a verification route only for that older evidence. For current Palimpsest WebJS blue-client object creation, use the main spacetime `功能 -> 创建 -> WebJS` route above.

User follow-up evidence later confirmed that the blue client card is now visible on the desktop and can be opened in the current session.

Treat that as stronger business evidence that publishing worked.

2026-06-28 Palimpsest clean runtime evidence:

```text
desktop card opened:
  盛云_孙宇飞_Palimpsest客户端_0626R2_正式蓝端

runtime:
  /public/?id=6192730962611142751&parentid=0&cloudid=1&areaid=0&username=孙宇飞&bs=true
  -> GetFileContent/.../f5f8c456-e145-4d85-b1c3-dc3a17e7b512_118/index.html

mounted text:
  人才考核
  实习生考核管理
  考核数据看板
  演示与调试
  展开表格演示
  归档与日志
  系统预留
  时空切换预留
```

Runtime not yet accepted for final three-page composition: `PalimpsestMenu_18` mounted, but menu clicks did not load `PalimpsestContent_82` into the right-side area in the verified blue client.

