# Skills 放置说明

本目录是项目真实 skill 源。迁移项目时，带走 `.ai/skills/`、`.ai/instructions/`、`.ai/docs/`、`AGENTS.md`、`MEMORY.md` 和 `AI-INTERACTION-PANEL.md`。

## 已迁移 skill

- `wos4-login`
- `wos4-browser-harness`
- `wos4-create-new-page`
- `wos4-layout-devtools-skill`
- `wos4-component-persistence`
- `wos4-component-catalog`
- `wos4-style-config`
- `wos4-button-variable-flow`
- `wos4-interaction-flow-skill`
- `wos4-demo-page-fullstack-skill`
- `wos4-meta-language-fu-create`
- `wos4-meta-language-fu-release-package`
- `wos4-repository-package-deploy-start`
- `wos4-runtime-package-update`
- `wos4-blue-client-publish-flow`
- `wos4-object-create-verify`
- `wos4-blue-client-object-create`
- `wos4-config-client-screen-create`
- `wos4-component-catalog`
- `wos4-modeling-reference-inspection`
- `wechat-send-file-transfer`

## 使用规则

- `.ai/skills/` 是项目唯一真实 skill 源。
- `wos4-layout-devtools-skill` 是项目唯一有效的布局 skill；其他 skill 只能引用它，不能再各自维护布局规则。
- 根目录不得再放同名 skill 目录。
- 新增或修订 skill 时，只更新 `.ai/skills/`。
- 任何 skill 不得写入明文密码、Cookie、Token。
- WOS4 密码从 `WOS4_PASS` 或不进 Git 的 `wos4-artifacts/config/wos4.local.ini` 读取。

## 后续整理

如发现根目录又出现同名 skill，应先确认是否为误生成；确认后迁移到 `.ai/skills/` 并删除根目录副本。
