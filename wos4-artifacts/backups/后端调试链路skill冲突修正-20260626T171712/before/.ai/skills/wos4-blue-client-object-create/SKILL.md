---
name: wos4-blue-client-object-create
description: Create a runnable blue WOS4 WebJS client object from Time Space Object Management after the config client and deploy chain are already in place. Use when the task is to avoid purple FU/client objects, create a blue `js_func_unit_editor_light` client object, resolve display-name vs internal-repository-name mismatches such as `盛云_孙宇飞_Noctiluca_客户端` vs `客户端1`, and verify that `视图` really mounts a client runtime shell.
---

# WOS4 Blue Client Object Create

## Overview

Use this skill only after the client has already been configured and deployed far enough that `时空对象管理平台` can see the related client/template nodes.

This skill is for the last step from:

```text
已部署客户端模板
-> 蓝色 WebJS 运行对象
-> 视图打开运行壳
```

Do not use it for:

- first-time page design
- layout editing
- backend FU creation
- general deploy management
- public/shared object creation

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

## Failed Route

This route is verified as unstable for `Noctiluca`:

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

## Verified Route

Verified `Noctiluca` route:

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

## 2026-06-22 Verified New-Client Route

Use this route when the task is to publish a newly named client instead of reusing the older internal `客户端1`.

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

Object-management route:

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

## Acceptance

Do not mark this step complete until all are true:

1. No `仓库不存在` error after submit.
2. A blue card appears with icon asset `js_func_unit_editor_light-...png`.
3. `我创建的 -> 全部` contains the new object.
4. The running row/card has class like:

```text
data-item is-running
```

5. After selecting the object, toolbar `停止 / 编辑 / 日志 / 视图` are enabled and `启动` is disabled.

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

The AI-verified minimum route is still:

```text
时空对象管理平台
-> 我创建的
-> 选中运行对象
-> 视图
```

User follow-up evidence later confirmed that the blue client card is now visible on the desktop and can be opened in the current session.

Treat that as stronger business evidence that publishing worked.

But do not replace the AI minimum acceptance path above until a clean-session replay independently re-verifies desktop-card surfacing and opening behavior.

