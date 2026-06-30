---
name: wos4-object-registry
description: Maintain WOS4 / WellinOS4.5 project registries for model metadata, runtime objects, methods, fields, GUIDs, IDs, copy GUIDs, clientGuid, and verification status. Use when Codex needs to record, update, extract, compare, or verify WOS4 model/object/method/field identities from historical notes, skills, snapshots, task packages, or live platform checks.
---

# WOS4 Object Registry

## Purpose

Use this skill to keep WOS4 identity data out of scattered notes. The registry is a metadata index, not a business-data dump.

Canonical registry files:

- `wos4-artifacts/docs/wos4-model-registry.md`
- `wos4-artifacts/docs/wos4-runtime-object-registry.md`
- `wos4-artifacts/docs/wos4-method-registry.md`

## Required Reading

Before editing registry files, read:

- `AGENTS.md`
- `.ai/docs/backup-and-version-policy.md`
- `.ai/docs/wos4-version-tree.md`
- `.ai/skills/wos4-instantiated-spacetime-refind/SKILL.md` when runtime GUIDs, business events, backend instances, or object-management checks are involved
- `.ai/skills/wos4-login/SKILL.md`, `.ai/skills/wos4-human-navigation/SKILL.md`, and `.ai/skills/wos4-browser-harness/SKILL.md` before any live WOS4 verification

## Registry Boundaries

Keep these concepts separate:

- Model registry: source models, model versions, page/sprite names, backend model contents, business-event schemas, field names/types/descriptions.
- Runtime object registry: deployed time-spaces, instantiated backend/frontend/client objects, copy IDs/GUIDs, object IDs/GUIDs, clientGuid, deployment status.
- Method registry: callable backend/frontend methods, input/output signatures, required run context, target business events, last verification result.

Do not store full production business records in registry files. For data validation, record only sample IDs, recordIDs, row counts, and evidence snapshot paths.

## Update Triggers

Update the registry when any of these happen:

- A WOS4 model, page, business event, business object, custom calculation, client, time-space, or runtime object is created.
- A model version is submitted, a copy is generated, a client version is updated, or a runtime package is deployed/started.
- `时空对象管理平台` confirms an online object, business event, App object, or time-space GUID.
- A method signature, parameter wrapper, record type constant, target table, or return shape is verified or corrected.
- A stale object, duplicate object, old clientGuid, old copy version, or deprecated path is discovered.
- A task resumes after platform reset, cross-day work, context compaction, or another user/AI may have modified the platform state.

## Status Values

Use these values consistently:

- `verified`: confirmed from the live WOS4 authority for that layer.
- `historical`: extracted from prior notes or snapshots, useful but not freshly verified.
- `stale`: known to point at an older runtime/copy/version.
- `retired`: object intentionally replaced or no longer used.
- `blocked`: expected object cannot be verified because a prerequisite failed.
- `unknown`: referenced in notes but insufficient evidence exists.

## Source Authority

Prefer these authorities:

1. `时空对象管理平台` for online time-spaces, business events, App objects, runtime object IDs/GUIDs, and debuggable status.
2. `组态系统客户端` for instance rows, selected model versions, client screen references, page binding, and time-space submission progress.
3. `运维部署客户端` for deployed/started/updated package state.
4. `建模系统客户端` for source model structure, fields, method scripts, page sprites, and submitted model versions.
5. Local snapshots, screenshots, task packages, and `WOS4_deep_test_notes.md` as historical evidence.

Do not use dynamic `public/?...`, `GetFileContent/.../index.html`, or remembered GUIDs as live authority. They are evidence only.

## Model Registry Format

Each model entry should include:

```text
### <model-or-page-name>

- 状态：
- 类型：后端模型 / 前端模型 / 页面精灵图 / 业务事 / 业务物 / 客户端模板
- 所属工程：
- 建模路径：
- 模型 GUID：
- 模型 ID：可选，只有历史中明确出现才填
- 当前已知模型版本：
- 关联拷贝：
- 字段结构：
  | 字段 | 类型 | 描述 | 系统字段 | 来源 | 状态 |
- 关联方法：
- 最近证据：
- 待复核：
```

Field structure belongs under the model version that defines it. Runtime objects only link back to the model/copy/version they currently use.

## Runtime Registry Format

Each runtime entry should include:

```text
### <runtime-object-name>

- 状态：
- 类型：运行时空 / 后端实例 / 自定义计算运行拷贝 / 业务事对象 / WebJS 客户端对象 / 页面运行入口
- 权威来源：
- 所属工程：
- 所属时空：
- 路径：
- ID：
- GUID：
- copy ID：
- copy GUID：
- 母模型 GUID：
- 母模型版本：
- clientGuid：
- 当前版本/运行状态：
- 关联模型：
- 关联方法：
- 最近证据：
- 待复核：
```

For business events, record the shape tab (`实时 / 历史 / 计划`). Never judge a backend missing from only one shape tab.

## Method Registry Format

Each method entry should include:

```text
### <method-name>

- 状态：
- 所属运行对象：
- 所属模型/拷贝：
- 方法类型：自定义计算 / 页面脚本 / 后端 helper / 前端 helper
- 入参签名：
- 出参结构：
- 调用上下文：
- 目标对象：
- 关键常量：
- 最近验证：
- 证据：
- 待复核：
```

Methods must link to a runtime object or source model. Do not leave callable methods as global free-floating notes.

## Extraction Rules

When extracting from history:

1. Search `WOS4_deep_test_notes.md`, task package `04-后端改动.md`, task `证据清单.md`, task events, and related skill examples.
2. Copy only stable metadata and short paraphrased evidence. Do not copy long log bodies.
3. If notes contain a later correction, keep the latest correction and mark the older line as historical or stale.
4. If a value is known from a skill example only, mark it `historical` until live verification.
5. Record source file paths and snapshot names, not passwords, cookies, tokens, or private URLs.

## Live Verification Rules

Before live WOS4 verification:

1. Run `wos4-artifacts/scripts/ai-preflight.ps1`.
2. Acquire the requested WOS account lock with `wos4-lock.ps1 -Action AcquireAccount`.
3. Use the locked account's configured Chrome profile/session.
4. Navigate by visible WOS4 desktop paths. Do not jump to dynamic business URLs.
5. Check top-level blocking dialogs before reading iframes.
6. Save a verification snapshot under `wos4-artifacts/snapshots/`.
7. Update the relevant registry entry with `verified`, verification time, operator, and evidence path.
8. Release the account lock when this WOS login person is no longer needed.

## Completion Criteria

A registry update is complete when:

- Relevant registry file(s) contain new or changed entries.
- Each entry states status, source authority, last evidence, and open questions.
- `MEMORY.md` records the local file changes.
- If live WOS4 verification was attempted, the answer reports the account used, verification result, evidence path, and whether the account lock was released.
