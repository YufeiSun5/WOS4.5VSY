# 04 后端改动

## 是否涉及后端

- 是 / 否：是。
- 说明：本任务需要设计一套假数据 CRUD 后端，供前端页面查询、新增、编辑、删除和评分弹窗使用。本阶段只设计，不直接创建 WOS4 后端对象。

## 模型和函数

| 对象 | 名称 | WOS4 路径 | 版本 |
|---|---|---|---|
| 后端模型 | `盛云_孙宇飞_后台_测试页CRUD_0623` | 待 code-ai 创建 | 待创建 |
| 自定义函数 | `TestPageCrud_CUSTOMFUNC` | 后端模型 -> 自定义计算 | 待创建 |
| 业务事/数据结构 | `AssessmentRecord` | 后端模型 -> 业务事或等效数据结构 | 待创建 |

## 数据结构

建议对象名：`AssessmentRecord`

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `id` | string | 是 | 记录 ID |
| `studentNo` | string | 是 | 学号 / 业务编号 |
| `name` | string | 是 | 姓名 |
| `phone` | string | 否 | 手机号 |
| `department` | string | 是 | 部门 |
| `mentor` | string | 是 | 导师 |
| `batch` | string | 是 | 实习批次 |
| `professionalScore` | number | 是 | 专业能力，满分 40 |
| `attitudeScore` | number | 是 | 工作态度，满分 20 |
| `deliveryScore` | number | 是 | 任务完成度，满分 20 |
| `teamScore` | number | 是 | 团队协作，满分 10 |
| `innovationScore` | number | 是 | 创新能力，满分 10 |
| `totalScore` | number | 是 | 综合评分 |
| `status` | string | 是 | `pending/completed` |
| `comment` | string | 否 | 评语 |
| `updatedAt` | string | 是 | 更新时间 |
| `deleted` | bool | 是 | 逻辑删除标记 |

## 假数据样例

```json
[
  {
    "id": "R001",
    "studentNo": "S2024041001",
    "name": "李明轩",
    "phone": "13800000001",
    "department": "产品部",
    "mentor": "王思远",
    "batch": "2024春招",
    "professionalScore": 38,
    "attitudeScore": 18,
    "deliveryScore": 18,
    "teamScore": 9,
    "innovationScore": 9,
    "totalScore": 92,
    "status": "completed",
    "comment": "专业基础扎实，学习能力强。",
    "updatedAt": "2024-06-12 14:30",
    "deleted": false
  },
  {
    "id": "R002",
    "studentNo": "S2024041002",
    "name": "张雨婷",
    "phone": "13800000002",
    "department": "研发部",
    "mentor": "陈浩然",
    "batch": "2024春招",
    "professionalScore": 36,
    "attitudeScore": 18,
    "deliveryScore": 17,
    "teamScore": 9,
    "innovationScore": 9,
    "totalScore": 89,
    "status": "completed",
    "comment": "任务推进稳定。",
    "updatedAt": "2024-06-11 11:20",
    "deleted": false
  },
  {
    "id": "R003",
    "studentNo": "S2024041003",
    "name": "王子涵",
    "phone": "13800000003",
    "department": "设计部",
    "mentor": "刘佳怡",
    "batch": "2024春招",
    "professionalScore": 35,
    "attitudeScore": 17,
    "deliveryScore": 17,
    "teamScore": 9,
    "innovationScore": 9,
    "totalScore": 87,
    "status": "completed",
    "comment": "设计表达清晰。",
    "updatedAt": "2024-06-10 16:45",
    "deleted": false
  },
  {
    "id": "R004",
    "studentNo": "S2024041004",
    "name": "赵天宇",
    "phone": "13800000004",
    "department": "市场部",
    "mentor": "孙一凡",
    "batch": "2024春招",
    "professionalScore": 34,
    "attitudeScore": 17,
    "deliveryScore": 17,
    "teamScore": 8,
    "innovationScore": 8,
    "totalScore": 84,
    "status": "pending",
    "comment": "",
    "updatedAt": "2024-06-09 09:15",
    "deleted": false
  }
]
```

## 函数设计

### QueryRecords

入参：

```json
{
  "filter": "",
  "department": "ALL",
  "status": "ALL",
  "batch": "ALL",
  "page": 1,
  "pageSize": 20
}
```

返回：

```json
{
  "errorcode": 0,
  "errormsg": "",
  "records": [],
  "total": 0,
  "summary": {
    "totalStudents": 128,
    "pendingCount": 23,
    "completedCount": 105,
    "averageScore": 86.7
  },
  "departmentScores": [],
  "trend": []
}
```

### CreateRecord

入参：

```json
{
  "record": {
    "studentNo": "S2024041999",
    "name": "测试学生",
    "department": "测试部",
    "mentor": "测试导师",
    "batch": "2024春招"
  }
}
```

返回：

```json
{
  "errorcode": 0,
  "errormsg": "",
  "record": {}
}
```

### UpdateRecord

入参：

```json
{
  "id": "R001",
  "patch": {
    "professionalScore": 38,
    "attitudeScore": 18,
    "comment": "更新评语"
  }
}
```

返回：

```json
{
  "errorcode": 0,
  "errormsg": "",
  "record": {}
}
```

### DeleteRecord

入参：

```json
{
  "id": "R001"
}
```

返回：

```json
{
  "errorcode": 0,
  "errormsg": "",
  "deletedId": "R001"
}
```

## 实施注意

- 前端 JS 调用自定义函数时，应传 `new Variant(new StringMap(...))`，不能使用不匹配的参数类型。
- 按钮脚本中不能写顶层 `await`。
- 必须在正式蓝色客户端可见按钮点击中记录 `ret/errorcodes`。
- 如果真实数据库持久化暂不可用，第一阶段可用后端函数内置假数据返回，但必须在 UI 上标明为测试数据。

## 提交和发布

- 模型提交版本：后端模型、自定义函数保存后必须提交历史版本。
- 时空包生成：需要随目标时空生成包。
- 运维更新：需要部署/更新/启动目标管控单元和数字孪生画面。
- 运行态验证：正式客户端中 `Query/Create/Update/Delete` 至少各跑通一次，前后表格数据有可见差异。
