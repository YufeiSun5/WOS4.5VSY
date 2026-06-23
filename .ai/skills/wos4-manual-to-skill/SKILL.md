---
name: wos4-manual-to-skill
description: Convert WOS4 help-manual content into verified UI/API operations and then into reusable project skills. Use when exploring an undocumented WOS4 module, turning manual chapters into practical steps, or deciding whether a workflow is proven enough to add or update a skill.
---

# WOS4 Manual To Skill

## Core Rule

Never convert manual text directly into a skill.

Use this chain:

```text
manual chapter
-> operation hypothesis
-> visible UI/API probe
-> evidence
-> repeatable procedure
-> skill update
```

If any step is missing, record the result in `WOS4_deep_test_notes.md`, not in a reusable skill.

## Required Inputs

Read these before exploration:

- `D:\DEV_D\WOS4.5\AGENTS.md`
- `D:\DEV_D\WOS4.5\wos4-artifacts\docs\wos4-help-kb\AGENTS.md`
- `D:\DEV_D\WOS4.5\wos4-artifacts\docs\wos4-help-kb\AI-ROUTE.md`
- `D:\DEV_D\WOS4.5\wos4-artifacts\docs\wos4-help-kb\USAGE.md`

Then use:

- `indexes/task-router.json` for task-level chapter routing.
- `indexes/symbol-index.json` only to locate candidate function/error/enum chapters.
- The target Markdown chapter to confirm details.

Do not rely on symbol-index alone for API behavior.

## Verification Ladder

### 1. Manual Locate

For the target module, capture:

```text
manual chapter:
relevant function / enum / error:
manual claim:
unknowns:
```

If the manual has no page-designer detail, say so and switch to runtime probing.

### 2. Operation Hypothesis

Translate the manual claim into a concrete UI or API hypothesis:

```text
entry path:
button/menu:
required model/page/product state:
expected request:
expected visible result:
rollback/safety concern:
```

Do not execute destructive operations from a hypothesis. Open dialogs first and screenshot fields.

### 3. Probe

Probe with visible navigation first:

- Use `wos4-login` for login.
- Use `wos4-human-navigation` for desktop clients and nested iframe entry.
- Use `--proxy-server=direct://` if falling back to Playwright.
- Observe network requests after clicks; if requests exist, keep waiting for iframe/text.

For API/runtime probes:

- Export function signatures with `String(fn)` before calling unknown functions.
- Record full `ret`, `errorcodes`, input shape, output shape, and screenshot.
- Avoid blind retries with guessed parameters after two distinct failures.

### 4. Evidence

Save evidence:

```text
wos4-artifacts/snapshots/<module>_<action>_probe.json
wos4-artifacts/screenshots/<module>_<action>_probe.png
WOS4_deep_test_notes.md
```

Evidence must include:

- menu path
- click target
- network request summary
- frame URL/text
- manual chapter used
- success/failure conclusion

### 5. Skill Gate

Only update or create a skill when all are true:

- The operation succeeded at least once.
- Reopening or re-querying confirms persistence when persistence matters.
- Failure modes and wait rules are known.
- The procedure is parameterized, not tied to one page/model.
- Sensitive values are not written into scripts or skill files.

If the operation is only partially understood, add it to `WOS4_deep_test_notes.md` under “待验证”, not to `SKILL.md`.

## Skill Output Pattern

When creating a downstream skill, keep it narrow:

```text
wos4-<module>-<verb>
```

Examples:

- `wos4-modeling-create-model`
- `wos4-modeling-member-config`
- `wos4-client-publish`
- `wos4-release-regression-checklist`

Each skill must contain:

- exact trigger scenarios in frontmatter description
- verified entry path
- wait conditions
- required screenshots/snapshots
- known failure codes or UI traps
- explicit “do not use dynamic URL as entry” rule when relevant

## Notes

For the current project, page layout/component rules are already verified in existing `.ai/skills/`. Manual chapters explain WOS4 concepts and functions; page-designer runtime behavior still requires empirical validation.
