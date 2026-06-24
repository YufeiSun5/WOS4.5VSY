---
name: wos4-page-runtime-backup
description: Create replayable WOS4 page editor/runtime backups before changing layouts, components, styleConfig, detailConfig, linkList, page variables, or preview-fix scripts. Use when the user asks to back up a WOS4 page, page snapshot, runtime snapshot, restore point, before.json/after.json, or says the backup must quickly restore layout/components/code rather than screenshots only.
---

# WOS4 Page Runtime Backup

## Purpose

Create a backup that can restore the current WOS4 page editor runtime, not just prove what it looked like. Use this before modifying any WOS4 page layout, component, table, chart, input, button, script, interaction, or preview workaround.

Always combine this skill with:

- `D:\DEV_D\WOS4.5\.ai\skills\wos4-browser-harness\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-component-persistence\SKILL.md`
- `D:\DEV_D\WOS4.5\.ai\skills\wos4-layout-devtools-skill\SKILL.md` when layout rows/cols are involved

## Backup Contract

A valid page-runtime backup directory must contain:

```text
wos4-artifacts/backups/<中文任务名>-yyyyMMddTHHmmss/
├─ backup-manifest.json
├─ before-runtime.json
├─ restore-runtime.js
└─ before-editor.png
```

Optional but recommended:

```text
preview-before.json
preview-before.png
```

Do not call screenshots alone a backup. Screenshots are evidence only. The restore point is `before-runtime.json` plus `restore-runtime.js`.

## Required Contents

`before-runtime.json` must include at least:

- `kind`: `wos4-page-runtime-replayable-backup`
- `page`: page name, for example `PalimpsestContent_82`
- `createdAt`
- `ai`
- `editorHref`
- `tabs` or active tab evidence
- `frameTree`
- `rootKey`
- `rootData` including `rowsManager`
- component snapshots from `comMap.$Children`
- column child objects from `RCol.getObject()`
- `detailConfig`, `styleConfig`, `linkList`, `uiInputLinkList`, `uiOutputLinkList`
- visible `bodyText` sample

`backup-manifest.json` must include:

```json
{
  "backupType": "replayable-runtime-layout-and-components",
  "page": "<page name>",
  "ai": "孙宇飞_<ai身份>",
  "files": ["before-runtime.json", "restore-runtime.js", "before-editor.png"],
  "contains": [
    "root layout rowsManager",
    "component propData/data/options",
    "RCol getObject child objects",
    "detailConfig/styleConfig/linkList",
    "restore script"
  ]
}
```

## Browser Harness Rules

Use `browser-harness`, not Playwright or Chrome DevTools, when the user requested it.

In PowerShell:

```powershell
$env:Path = 'C:\Users\SunYufei\.local\bin;' + $env:Path
```

For multi-line harness scripts, write an ASCII temp file and pipe it:

```powershell
$tmp = Join-Path $env:TEMP 'wos4_page_backup.py'
Set-Content -LiteralPath $tmp -Encoding ascii -Value @'
ensure_real_tab()
print(page_info())
'@
cmd /c "type %TEMP%\wos4_page_backup.py | browser-harness"
```

Because the temp file is ASCII, do not put raw Chinese in the Python or JS source. Use Unicode escapes or read Chinese values from UTF-8 files at runtime.

## Editor Discovery

Use nested iframe discovery. Do not directly open dynamic `public` or `GetFileContent` URLs as entry points.

Inside the active WOS4 tab:

```js
function getEditorWin() {
  const outer = Array.from(document.querySelectorAll("iframe"))
    .find(f => f.src.includes("/public/") && f.getBoundingClientRect().width > 0)
  const inner = outer && outer.contentWindow.document.querySelector("iframe")
  const edit = inner && inner.contentWindow.document.querySelector("iframe")
  return edit ? edit.contentWindow : (inner ? inner.contentWindow : null)
}

const win = getEditorWin()
const doc = win.document
const view = doc.getElementById("page_edit_view_area").__vue__
const kids = view._data.comMap.$Children
```

If `view` or `comMap.$Children` is missing, stop and record `blocked`. Do not create a fake backup from an empty preview shell.

## Snapshot Method

Serialize defensively. Vue objects contain functions and cycles.

Recommended pattern:

```js
function clean(value, depth = 0, seen = new WeakSet()) {
  if (value == null) return value
  if (typeof value === "function") return undefined
  if (typeof value !== "object") return value
  if (seen.has(value)) return "[Circular]"
  if (depth > 8) return "[MaxDepth]"
  seen.add(value)
  if (Array.isArray(value)) return value.map(v => clean(v, depth + 1, seen))
  const out = {}
  for (const [k, v] of Object.entries(value)) {
    if (k.startsWith("_") || k === "$parent" || k === "$children" || k === "$el") continue
    const c = clean(v, depth + 1, seen)
    if (c !== undefined) out[k] = c
  }
  return out
}

function summarizeComponent(key, inst) {
  let colObject = null
  try {
    if (inst && typeof inst.getObject === "function") colObject = inst.getObject()
  } catch (e) {
    colObject = { error: String(e) }
  }
  return {
    key,
    UIName: inst?.UIName || inst?.propData?.UIName || inst?.data?.UIName || "",
    prototypeName: inst?.prototypeName || inst?.propData?.prototypeName || inst?.data?.prototypeName || "",
    KSGUID: inst?.KSGUID || inst?.propData?.KSGUID || inst?.data?.KSGUID || "",
    KSCGUID: inst?.KSCGUID || inst?.propData?.KSCGUID || inst?.data?.KSCGUID || "",
    propData: clean(inst?.propData),
    data: clean(inst?.data),
    options: clean(inst?.options),
    object: clean(colObject),
    styleConfig: inst?.styleConfig || inst?.propData?.styleConfig || "",
    detailConfig: inst?.detailConfig || inst?.propData?.detailConfig || "",
    linkList: clean(inst?.linkList || inst?.propData?.linkList || [])
  }
}
```

Root detection:

```js
const entries = Object.entries(kids)
const rootEntry =
  entries.find(([k, v]) => v?.data?.isRoot || v?.propData?.isRoot) ||
  entries.find(([k, v]) => (v?.prototypeName || v?.data?.prototypeName || v?.propData?.prototypeName) === "RContainer")
```

Save `rootEntry[0]` as `rootKey`, and `clean(rootEntry[1].data || rootEntry[1].propData || rootEntry[1])` as `rootData`.

## Restore Script

`restore-runtime.js` must not auto-run during backup creation. It is for a later explicit restore request.

Minimum restore behavior:

1. Locate current editor `PageView` and `comMap.$Children`.
2. Verify the page name matches the backup, or require an explicit override.
3. Restore root layout data and rows.
4. Restore component fields and `RCol.getObject()` child objects.
5. Run `updateRenderComs`, `updateDevRenderComs`, and `$forceUpdate` when available.
6. Return a summary of restored root, rows, component count, and warnings.

Do not restore into a different page without user confirmation. Restore overwrites current layout/components.

## Verification

After creating the backup:

1. Parse `before-runtime.json` as JSON.
2. Confirm `rootData.rowsManager.length > 0` for a layout page.
3. Confirm expected component names exist.
4. Confirm `restore-runtime.js` includes the backup page name.
5. Save `before-editor.png`.
6. Add the backup directory to the task `证据清单.md`.

If any check fails, state that the backup is only partial and do not proceed with page edits until fixed or explicitly approved.

## When Not To Use

Do not use this skill for:

- plain local file backups before editing Markdown or scripts; use `.ai/docs/backup-and-version-policy.md`
- final runtime acceptance after deployment; use `wos4-blue-client-publish-flow`
- backend source/meta-language debugger setup; use `wos4-meta-language-fu-create`
