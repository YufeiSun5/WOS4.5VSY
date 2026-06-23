# WOS4 Clean Restart Runbook

## Purpose

This document resets the WOS4 implementation route to one clean chain.

From now on, the active path is:

```text
modeling
-> backend app logic
-> frontend page
-> config client binding
-> spacetime deploy/start
-> blue runtime object
-> frontend/backend CRUD verification
```

Everything else is evidence only.

## Hard Reset Rules

1. Do not continue patching `0617`, `TOPV2`, `Noctiluca`, `Eidolon`, or any previous mixed chain as the active delivery line.
2. Do not modify any `lk_` object. They remain read-only reference only.
3. Do not create more parallel test trees unless the current clean chain is proven structurally unusable.
4. Do not use `KingStudio_V20260514`.
5. Do not use dynamic runtime URLs as entry points.
6. Do not tune frontend button scripts before the formal client page is mounted.
7. Do not treat editor preview as release acceptance.

## Active Goal

Build one clean personal demo from scratch, starting from modeling, that can:

1. read data
2. insert data
3. update data
4. render the result in a formal client runtime

Current priority is correctness and repeatability, not reuse of old half-broken objects.

## New Clean Namespace

Use one new namespace only, with business semantics instead of poetic or product names.

Recommended clean set:

```text
group/root:
盛云_孙宇飞_根组

backend model:
盛云_孙宇飞_后台_CRUDDemo_0620

frontend model:
盛云_孙宇飞_前端_CRUDDemo_0620

frame model:
盛云_孙宇飞_前端_框架_0620

config project:
盛云_孙宇飞_CRUD工程_0620

client:
盛云_孙宇飞_CRUD客户端_0620

page:
盛云_孙宇飞_CRUD画面_0620

spacetime:
盛云_孙宇飞_CRUD时空_0620

runtime object:
盛云_孙宇飞_CRUD客户端_对象1
```

If one of these names already exists, append `_v2` rather than falling back to an old chain.

## Execution Order

### Stage 0: Reference Audit Only

Goal:

- read `lk_客户端01_对象1`
- extract structure
- do not modify it

Required output:

```text
reference object
reference spacetime
reference client mount pattern
reference backend call pattern
```

Acceptance:

- we can explain what the reference demo is made of
- we can list what our clean chain must contain

Stop:

- if inspection starts requiring save/submit/update/deploy on `lk_` objects

Human help:

- only if reference UI meaning is ambiguous after two read-only passes

### Stage 1: Modeling From Zero

Goal:

- create a clean backend-side business model
- create or confirm the frontend-side model skeleton

Minimum expected structure:

```text
data model:
business record structure for CRUD rows

logic model:
custom functions for query/add/update/delete

graphic model:
page sprite or referenced frontend page carrier
```

Test nodes:

1. model exists in personal group
2. save works
3. submit version works
4. reopen still shows the model

Acceptance:

- model version is visible
- model can be reopened without data loss

Stop:

- save succeeds but reopen loses content
- submit fails twice with the same error and no new evidence

Human help:

- if the required model type is unclear and cannot be inferred from `lk_` reference

### Stage 2: Backend CRUD App

Goal:

- implement four backend functions:
  - `QueryList`
  - `AddItem`
  - `UpdateItem`
  - `DeleteItem`

Rules:

1. use source/meta-language only
2. avoid chained calls
3. split statements into explicit temporary variables
4. compile before any deploy attempt

Test nodes:

1. editor opens
2. save succeeds
3. compile succeeds
4. submit version succeeds

Acceptance:

- backend function list is stable after reopen
- compile is clean
- version history contains the new version

Stop:

- compile fails twice with the same parser/runtime error and no new evidence

Human help:

- if debugging requires a user/pass or spacetime binding not derivable from current evidence

### Stage 3: Frontend Page

Goal:

- build one clean page with:
  - top input + button
  - left tree
  - center table
  - right chart

Rules:

1. layout first
2. then components
3. then styles
4. then variables
5. then interactions

Rules for interaction:

- page-open, timer, button-click should trigger through transit variables
- business logic should be centralized in variable-change scripts where possible

Test nodes:

1. layout tree persists after reopen
2. components persist after reopen
3. preview shows non-zero table and chart height
4. input/button/tree/table/chart all visible

Acceptance:

- editor reopen keeps layout and components
- preview is visually usable

Stop:

- layout tree is unstable
- chart/table parent height collapses

Human help:

- if a required component exists in UI but its runtime insertion contract remains unclear after one code-level and one UI-level probe

### Stage 4: Config Client Binding

Goal:

- bind the clean frontend page into a clean config client
- set exactly one homepage/default-page path

Required path:

```text
config project
-> unit instance config
-> submit
-> digital twin visualization
-> client
-> page list / add / reference / homepage
-> update version
-> formal preview link
```

Test nodes:

1. client instance tree is complete
2. instance config submit succeeds
3. page is present in client page list
4. homepage is unique
5. update-version succeeds

Acceptance:

- formal preview no longer reports page missing
- client runtime mounts the expected page

Stop:

- `GetPageMngInfo()` remains empty after two full page-list/homepage/update-version passes
- formal preview still reports page missing with no mapping change

Human help:

- if homepage/default-page semantics are still ambiguous after comparison with the reference client

### Stage 5: Spacetime Deploy and Start

Goal:

- deploy the clean package chain into one clean personal spacetime

Rules:

1. use personal spacetime only
2. deploy parent to child in order
3. start parent to child in order

Test nodes:

1. package exists
2. deploy state changes
3. start state changes
4. runtime object can be created or reused

Acceptance:

- backend runtime object is running
- client runtime object is running

Stop:

- deployment target is no longer clearly personal
- deploy/start acts on a public/shared object

Human help:

- if the target spacetime is ambiguous or clearly shared

### Stage 6: Frontend/Backend CRUD Validation

Preconditions:

1. formal client page is mounted
2. backend runtime object is running

Goal:

- verify end-to-end CRUD:
  - query from backend
  - insert one row
  - update one row
  - delete one row

Test nodes:

1. button click triggers a backend call
2. result object is captured with `ret`, `errorcodes`, and payload
3. table changes before/after are visible
4. chart changes before/after are visible

Acceptance:

- at least one successful read
- at least one successful insert
- at least one successful update
- at least one successful delete

Stop:

- page not mounted but script debugging starts
- same `App not exist` / spacetime mismatch error repeats twice with no runtime change

Human help:

- if target backend object naming or expected payload structure cannot be inferred from model and runtime evidence

## Stage Deliverables

Each stage must produce:

```text
1. screenshot evidence
2. snapshot JSON or text evidence
3. one short conclusion
4. pass/fail decision
5. next step or stop reason
```

## What Counts As Done

The clean restart is only complete when all are true:

1. backend model and app are versioned
2. frontend page is versioned
3. client formal preview mounts the page
4. blue runtime object opens the client
5. CRUD read/insert/update/delete are verified from the formal runtime

Until then, no stage may be described as “published”.

## Immediate Next Step

Start with Stage 0 and Stage 1 only:

1. read-only inspect `lk_客户端01_对象1`
2. create the new clean model namespace under `盛云_孙宇飞_根组`
3. stop after the first successful model version submit

Do not touch old `0617` or `Noctiluca` objects during this clean restart.
