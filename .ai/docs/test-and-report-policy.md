# 测试和报告规则

## 测试放哪里

测试资产统一放在 `wos4-artifacts/tests/`。

- `unit/`：单元测试，验证本地纯逻辑，不依赖 WOS4 在线环境。
- `integration/`：集成测试，验证多个模块、工具或 WOS4 在线链路协同。
- `regression/`：回归测试，验证历史问题和关键链路没有被破坏。
- `fixtures/`：测试数据、mock 响应、样例输入和预期输出。
- `manual/`：人工测试步骤和检查表。

## 报告放哪里

测试执行后的结论、阶段复盘和给人看的材料放在 `wos4-artifacts/reports/`。

报告不替代测试用例。报告应引用测试、截图、快照和备份路径。

## 什么时候必须补测试

- 修改本地脚本、解析器、配置读取、数据转换逻辑时，优先补单元测试。
- 修改跨模块流程、页面自动化、保存提交、预览验证、运维更新时，补集成测试或人工测试清单。
- 修复历史问题或变更已验证链路时，补回归测试。
- 如果当前无法自动化测试，必须在 `manual/` 写人工测试步骤，并在报告里说明原因。

## 测试记录最小字段

每个测试用例至少包含：

- 测试目标
- 前置条件
- 操作步骤
- 期望结果
- 实际结果
- 关联证据
- 是否可自动化复跑

## 命名建议

文件名可以英文或拼音，但 README、说明、报告正文优先中文。

示例：

```text
wos4-artifacts/tests/unit/ini-config-validation.md
wos4-artifacts/tests/integration/wos4-page-save-submit-preview.md
wos4-artifacts/tests/regression/layout-height-not-collapse.md
wos4-artifacts/reports/页面保存提交预览验证-20260623.md
```
