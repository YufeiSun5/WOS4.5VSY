# 测试验收

## test-ai 检查清单

- [ ] 读取 `.ai/skills/wos4-blue-client-object-create/SKILL.md`，确认唯一当前已验证路径是 `客户端1 / WebJS`。
- [ ] 读取 `.ai/skills/wos4-object-create-verify/SKILL.md`，确认外显改名节点和内部运行仓库节点没有混写。
- [ ] 读取 `WOS4_deep_test_notes.md`，确认 `仓库不存在` 失败路径和成功路径均有记录。
- [ ] 读取 `wos4-artifacts/snapshots/noctiluca_webjs_object_create_2026-06-19.json`，确认快照能支撑结论。
- [ ] 检查 skill 是否把“蓝色对象已可创建并运行”与“纯桌面首页自动同步显示”明确区分。

## review-ai 检查清单

- [ ] 检查 skill 是否只保留可复用步骤，不保留一次性探索噪音。
- [ ] 检查失败路径是否写成“失败路径/反例”，没有被放进推荐路径。
- [ ] 检查术语是否稳定：外显节点、内部运行仓库节点、对象管理平台、视图 iframe。
- [ ] 检查是否缺少证据文件路径、时间和边界说明。

## 结论区

待 `孙宇飞_测试_test-ai` 和 `孙宇飞_审阅_review-ai` 填写。
