# `.ai/agents`

AI 身份定义目录。

每个文件定义一个协作身份，例如 `design-ai`、`frontend-ai`、`code-ai`、`test-ai`、`review-ai`。协作记录里必须写成“开发人员_AI身份”，例如 `孙宇飞_design-ai`。

本目录只放身份职责和协作边界，不放具体 WOS4 操作步骤。具体操作步骤放到 `.ai/skills/`。

## 身份分工

- `design-ai`：需求方案、草图/交互讨论、系统现状核实、数据结构核实和阶段计划。
- `frontend-ai`：页面布局、视觉层级、组件摆放、前端交互体验和预览效果。
- `code-ai`：脚本、页面模型、组件配置、变量、事件脚本、skill 和文档实现。
- `test-ai`：单元测试、集成测试、回归测试和人工验证清单。
- `review-ai`：Git diff、安全控制、文档准确性和回退方案审阅。
