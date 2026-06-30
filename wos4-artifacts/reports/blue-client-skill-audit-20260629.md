# 蓝端发布 skill 审计记录

时间：2026-06-29

身份：孙宇飞_code-ai

## 本轮结论

已把蓝端发布流程收敛到现有总控 skill：

- `.ai/skills/wos4-blue-client-publish-flow/SKILL.md`

没有新增平行 skill，避免后续 AI 同时读到两套互相冲突的蓝端流程。

## 已写入 skill 的新规则

- 建模系统里页面预览正确，但组态预览或蓝端仍旧时，优先认为是 `数字孪生可视化 -> 画面列表` 绑定了旧页面引用。
- 修复方式是：在组态客户端中删除/移除旧画面引用，再用 `添加 / 引用` 重新挂当前页面精灵图，重新设置唯一首页和当前时空，然后更新并提交客户端版本。
- 页面精灵图这种 page-only 前端模型不要塞进 `管控单元实例配置`。
- `时空列表 -> 批量提交` 是当前包生成路线，但不能只看按钮点击；必须抓提交进度、详情、版本，并继续证明运维部署消费了新包。
- 蓝端 WebJS 对象创建是时空对象管理平台的例外，但只能在客户端模板已部署/可见后做；后端、业务事、自定义计算不能在对象管理平台中新建来补缺口。

## 被标为假或废弃的旧规则

- `$Client -> 三方APP -> 创建` 不是 WebJS 蓝端发布路径。
- `客户端1 / WebJS` 不是通用目标模板，只是旧 Noctiluca 证据里的内部仓库名。
- 在时空对象管理平台创建后端、业务事、自定义计算对象来解决部署缺口是错误路线。
- 行级实例 `提交版本` 不能单独证明运行态已更新。
- 旧 `public/index.html?...clientGuid...` tab 不能作为更新后的验收对象；更新后必须重新打开新蓝端或新正式预览。

## 本轮修改文件

- `.ai/skills/wos4-blue-client-publish-flow/SKILL.md`
- `.ai/skills/wos4-blue-client-object-create/SKILL.md`
- `.ai/skills/wos4-config-client-screen-create/SKILL.md`
- `MEMORY.md`

## 备份

- `wos4-artifacts/backups/蓝端发布skill审计和组态重挂规则-20260629T092504/`
