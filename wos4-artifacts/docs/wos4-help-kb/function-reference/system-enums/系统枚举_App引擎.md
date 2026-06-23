# 系统枚举_App引擎

- 分组：系统枚举
- 原始章节名：系统枚举_App引擎
- 内容块数量：24
- 来源：WOS4 帮助手册 static/js/file.js

## 正文

# 1. 系统枚举_按字母

# 1. 系统枚举_按字母

# CreateMode（App创建模式）

Enum Enum_App_CreateMode
{
 ROOT = 1, // 根据App拷贝创建根App对象
 CHILD = 2, // 根据App拷贝创建子App对象
};

## CreateMode（App创建模式）

 Enum Enum_App_CreateMode
{
 ROOT = 1, // 根据App拷贝创建根App对象
 CHILD = 2, // 根据App拷贝创建子App对象
};
 

# DeployConfigObjectAppType（部署配置对象应用类型）

Enum Enum_App_DeployConfigObjectAppType
{
 DESK_PUBLIC_APP = 2, // 桌面公共应用
 DESK_PERSONAL_APP = 3, // 桌面个人应用
 OTHER_PUBLIC_APP = 4, // 其他公共应用
};

## DeployConfigObjectAppType（部署配置对象应用类型）

 Enum Enum_App_DeployConfigObjectAppType
{
 DESK_PUBLIC_APP = 2, // 桌面公共应用
 DESK_PERSONAL_APP = 3, // 桌面个人应用
 OTHER_PUBLIC_APP = 4, // 其他公共应用
};
 

# DeployConfigObjectQueryType（部署配置对象查询类型）

Enum Enum_App_DeployConfigObjectQueryType
{
 ALL = 1, // 查询所有部署配置对象
 BY_ROLE = 2, // 查询当前用户对应角色的部署配置对象
 OWN = 3, // 查询当前用户创建的部署配置对象
};

## DeployConfigObjectQueryType（部署配置对象查询类型）

 Enum Enum_App_DeployConfigObjectQueryType
{
 ALL = 1, // 查询所有部署配置对象
 BY_ROLE = 2, // 查询当前用户对应角色的部署配置对象
 OWN = 3, // 查询当前用户创建的部署配置对象
};
 

# IdentifierType（标识类型）

Enum Enum_App_IdentifierType
{
 ID = 1, // 使用ID标识
 NAME = 2, // 使用名称标识
 FULLNAME = 3, // 使用全路径名标识
 ALIAS = 4, // 使用别名标识
 GUID = 5, // 使用GUID标识
};

## IdentifierType（标识类型）

 Enum Enum_App_IdentifierType
{
 ID = 1, // 使用ID标识
 NAME = 2, // 使用名称标识
 FULLNAME = 3, // 使用全路径名标识
 ALIAS = 4, // 使用别名标识
 GUID = 5, // 使用GUID标识
};
 

# Language（App语言）

Enum Enum_App_Language
{
 ML = 1, // 元语言
 WEBJS = 2, // WebJS
 NODEJS = 3, // NodeJS
 CPP = 4, // C++
 QT = 5, // QT
};

## Language（App语言）

 Enum Enum_App_Language
{
 ML = 1, // 元语言
 WEBJS = 2, // WebJS
 NODEJS = 3, // NodeJS
 CPP = 4, // C++
 QT = 5, // QT
};
 

# LogQueryMode（App日志查询模式）

Enum Enum_App_LogQueryMode
{
 LOG = 1, // 查询指定App对象日志
 LOG_CONFIG = 2, // 查询App对象日志的配置项
};

## LogQueryMode（App日志查询模式）

 Enum Enum_App_LogQueryMode
{
 LOG = 1, // 查询指定App对象日志
 LOG_CONFIG = 2, // 查询App对象日志的配置项
};
 

# LogQueryType（App日志查询类型）

Enum Enum_App_LogQueryType
{
 BY_COPY = 1, // 按App拷贝查询
 BY_OBJECT = 2, // 按App对象查询
};

## LogQueryType（App日志查询类型）

 Enum Enum_App_LogQueryType
{
 BY_COPY = 1, // 按App拷贝查询
 BY_OBJECT = 2, // 按App对象查询
};
 

# LogGranularity（App日志控制粒度）

Enum Enum_App_LogGranularity
{
 AREA = 1, // 数据区
 SPACETIME = 2, // 时空对象（不含后代）
 APP = 3, // 根App对象（含子App)
};

## LogGranularity（App日志控制粒度）

 Enum Enum_App_LogGranularity
{
 AREA = 1, // 数据区
 SPACETIME = 2, // 时空对象（不含后代）
 APP = 3, // 根App对象（含子App)
};
 

# MLType（元语言对象类型）

Enum Enum_App_MLType
{
 APP = 21001, // 元语言App对象
 ALIAS = 21002, // 元语言App引擎别名
 SPACETIME = 21004, // 元语言App引擎时空对象
 DEPLOYCONFIG = 21005, // 元语言App引擎部署配置对象
 SCRIPT_LOG = 21020, // 元语言App引擎脚本日志
 RUN_LOG = 21021, // 元语言App引擎运行日志
 PERF_LOG = 21022, // 元语言App引擎性能单次日志
 PERFSUM_LOG = 21023, // 元语言App引擎性能统计日志
 TASK = 21100, // 元语言App引擎异步任务
 APP_MODEL = 21101, // 元语言App引擎App模型
 APP_COPY = 21102, // 元语言App引擎App拷贝
 APPMODULE = 21103, // 元语言App引擎AppModule模型
 REPOSITORY = 21104, // 元语言App引擎仓库
};

## MLType（元语言对象类型）

 Enum Enum_App_MLType
{
 APP = 21001, // 元语言App对象
 ALIAS = 21002, // 元语言App引擎别名
 SPACETIME = 21004, // 元语言App引擎时空对象
 DEPLOYCONFIG = 21005, // 元语言App引擎部署配置对象
 SCRIPT_LOG = 21020, // 元语言App引擎脚本日志
 RUN_LOG = 21021, // 元语言App引擎运行日志
 PERF_LOG = 21022, // 元语言App引擎性能单次日志
 PERFSUM_LOG = 21023, // 元语言App引擎性能统计日志
 TASK = 21100, // 元语言App引擎异步任务
 APP_MODEL = 21101, // 元语言App引擎App模型
 APP_COPY = 21102, // 元语言App引擎App拷贝
 APPMODULE = 21103, // 元语言App引擎AppModule模型
 REPOSITORY = 21104, // 元语言App引擎仓库
};
 

# ModelCopyQueryMode（运行模型或拷贝操作模式）

Enum Enum_App_ModelCopyQueryMode
{
 BY_SPECIFIED = 1, // 查询指定运行模型或拷贝
 IN_SPACETIME = 2, // 查询指定时空内运行模型或拷贝列表
};

## ModelCopyQueryMode（运行模型或拷贝操作模式）

 Enum Enum_App_ModelCopyQueryMode
{
 BY_SPECIFIED = 1, // 查询指定运行模型或拷贝
 IN_SPACETIME = 2, // 查询指定时空内运行模型或拷贝列表
};
 

# NodeJSType（NodeJS对象类型）

Enum Enum_App_NodeJSType
{
 APP = 23001, // NodeJS App对象
 ALIAS = 23002, // NodeJS App引擎别名
 SPACETIME = 23004, // NodeJS App引擎时空对象
 DEPLOYCONFIG = 23005, // NodeJS App引擎部署配置对象
 SCRIPT_LOG = 23020, // NodeJS App引擎脚本日志
 RUN_LOG = 23021, // NodeJS App引擎运行日志
 PERF_LOG = 23022, // NodeJS App引擎性能单次日志
 PERFSUM_LOG = 23023, // NodeJS App引擎性能统计日志
 TASK = 23100, // NodeJS App引擎异步任务
 APP_MODEL = 23101, // NodeJS App引擎App模型
 APP_COPY = 23102, // NodeJS App引擎App拷贝
 REPOSITORY = 23104, // NodeJS App引擎仓库
};

## NodeJSType（NodeJS对象类型）

 Enum Enum_App_NodeJSType
{
 APP = 23001, // NodeJS App对象
 ALIAS = 23002, // NodeJS App引擎别名
 SPACETIME = 23004, // NodeJS App引擎时空对象
 DEPLOYCONFIG = 23005, // NodeJS App引擎部署配置对象
 SCRIPT_LOG = 23020, // NodeJS App引擎脚本日志
 RUN_LOG = 23021, // NodeJS App引擎运行日志
 PERF_LOG = 23022, // NodeJS App引擎性能单次日志
 PERFSUM_LOG = 23023, // NodeJS App引擎性能统计日志
 TASK = 23100, // NodeJS App引擎异步任务
 APP_MODEL = 23101, // NodeJS App引擎App模型
 APP_COPY = 23102, // NodeJS App引擎App拷贝
 REPOSITORY = 23104, // NodeJS App引擎仓库
};
 

# QueryMode（App查询模式）

Enum Enum_App_QueryMode
{
 FIELDS = 1, // 查询指定App对象属性、成员
 IN_LOCAL_SPACETIME = 2, // 查询指定本地时空内根App对象列表
 IN_ACCESS_SPACETIME = 3, // 查询指定远程访问时空内根App对象列表
 CHILD_AND_DESCENDANT = 4, // 查询指定App对象下子及后代App对象列表
 BY_FILTER = 5, // 根据App属性过滤查询App对象列表
 LOG = 11, // 查询指定App对象日志
};

## QueryMode（App查询模式）

 Enum Enum_App_QueryMode
{
 FIELDS = 1, // 查询指定App对象属性、成员
 IN_LOCAL_SPACETIME = 2, // 查询指定本地时空内根App对象列表
 IN_ACCESS_SPACETIME = 3, // 查询指定远程访问时空内根App对象列表
 CHILD_AND_DESCENDANT = 4, // 查询指定App对象下子及后代App对象列表
 BY_FILTER = 5, // 根据App属性过滤查询App对象列表
 LOG = 11, // 查询指定App对象日志
};
 

# QueryType（App查询类型）

Enum Enum_App_QueryType
{
 CHILD = 1, // 查询子App（不包含本身）
 DESCENDANT = 2, // 查询后代App（不包含本身）
};

## QueryType（App查询类型）

 Enum Enum_App_QueryType
{
 CHILD = 1, // 查询子App（不包含本身）
 DESCENDANT = 2, // 查询后代App（不包含本身）
};
 

# RepositoryQueryMode（运行仓库查询模式）

Enum Enum_App_RepositoryQueryMode
{
 BY_SPECIFIED = 1, // 查询指定运行仓库
 IN_SPACETIME = 2, // 查询指定时空内运行仓库列表
};

## RepositoryQueryMode（运行仓库查询模式）

 Enum Enum_App_RepositoryQueryMode
{
 BY_SPECIFIED = 1, // 查询指定运行仓库
 IN_SPACETIME = 2, // 查询指定时空内运行仓库列表
};
 

# SpaceTimeQueryMode（时空查询模式）

Enum Enum_App_SpaceTimeQueryMode
{
 CHILD_AND_DESCENDAN = 1, // 查询指定时空对象及后代
 BY_FILTER = 2, // 过滤查询时空对象
};

## SpaceTimeQueryMode（时空查询模式）

 Enum Enum_App_SpaceTimeQueryMode
{
 CHILD_AND_DESCENDAN = 1, // 查询指定时空对象及后代
 BY_FILTER = 2, // 过滤查询时空对象
};
 

# SpaceTimeQueryType（时空查询类型）

Enum Enum_App_SpaceTimeQueryType
{
 SELF = 1 // 查询指定时空（指定时空本身）
 CHILD = 2, // 查询指定时空的子时空（不包含本身）
 DESCENDANT = 3, // 查询指定时空的后代时空（包含本身）
};

## SpaceTimeQueryType（时空查询类型）

 Enum Enum_App_SpaceTimeQueryType
{
 SELF = 1 // 查询指定时空（指定时空本身）
 CHILD = 2, // 查询指定时空的子时空（不包含本身）
 DESCENDANT = 3, // 查询指定时空的后代时空（包含本身）
};
 

# Status（App状态）

Enum Enum_App_Status
{
 STARTING = 1, // 启动中
 RUNNING_NORMAL = 2, // 运行正常
 RUNNING_ABNORMAL = 3, // 运行异常
 STOPING = 4, // 停止中
 STOPED = 5, // 已停止
 START_FAILED = 6, // 启动失败
 STOP_FAILED = 7, // 停止失败
 FORCE_DELETING = 8, // 强制删除中
};

## Status（App状态）

 Enum Enum_App_Status
{
 STARTING = 1, // 启动中
 RUNNING_NORMAL = 2, // 运行正常
 RUNNING_ABNORMAL = 3, // 运行异常
 STOPING = 4, // 停止中
 STOPED = 5, // 已停止
 START_FAILED = 6, // 启动失败
 STOP_FAILED = 7, // 停止失败
 FORCE_DELETING = 8, // 强制删除中
};
 

# SubscribeMode（App订阅模式）

Enum Enum_App_SubscribeMode
{
 RUNSTATUS = 1, // 订阅指定App对象的运行状态变化
 ALARM_EVENT = 2, // 订阅指定App对象报警事件
};

## SubscribeMode（App订阅模式）

 Enum Enum_App_SubscribeMode
{
 RUNSTATUS = 1, // 订阅指定App对象的运行状态变化
 ALARM_EVENT = 2, // 订阅指定App对象报警事件
};
 

# TransactionMode（事务模式）

Enum Enum_App_TransactionMode
{
 NON_STRICT = 1, // 不严格提交模式
 STRICT = 2, // 严格完整提交模式（默认）
};

## TransactionMode（事务模式）

 Enum Enum_App_TransactionMode
{
 NON_STRICT = 1, // 不严格提交模式
 STRICT = 2, // 严格完整提交模式（默认）
};
 

# TransactionType（事务类型）

Enum Enum_App_TransactionType
{
 BUSSINESS_TRANSACTION = 1, // 业务事务
 SECURITY_TRANSACTION = 2, // 安全事务
};

## TransactionType（事务类型）

 Enum Enum_App_TransactionType
{
 BUSSINESS_TRANSACTION = 1, // 业务事务
 SECURITY_TRANSACTION = 2, // 安全事务
};
 

# UserType（用户类型）

Enum Enum_App_UserType
{
 BUSINESS_USER = 2, // 业务用户
 SYSTEM_USER = 4, // 系统用户
 SECURITY_USER = 5, // 安全用户
 AUDIT_USER = 6, // 审计用户
 APP_BUSINESS_USER = 3, // 业务App用户
 APP_SYSTEM_USER = 11, // 系统App用户
 APP_SECURITY_USER = 12, // 安全App用户
 APP_AUDIT_USER = 13, // 审计App用户
};

## UserType（用户类型）

 Enum Enum_App_UserType
{
 BUSINESS_USER = 2, // 业务用户
 SYSTEM_USER = 4, // 系统用户
 SECURITY_USER = 5, // 安全用户
 AUDIT_USER = 6, // 审计用户
 APP_BUSINESS_USER = 3, // 业务App用户
 APP_SYSTEM_USER = 11, // 系统App用户
 APP_SECURITY_USER = 12, // 安全App用户
 APP_AUDIT_USER = 13, // 审计App用户
};
 

# WebJSType（WebJS对象类型）

Enum Enum_App_WebJSType
{
 APP = 22001, // WebJS App对象
 ALIAS = 22002, // WebJS App引擎别名
 SPACETIME = 22004, // WebJS App引擎时空对象
 DEPLOYCONFIG = 22005, // WebJS App引擎部署配置对象
 TASK = 22100, // WebJS App引擎异步任务
 APP_MODEL = 22101, // WebJS App引擎App模型
 APP_COPY = 22102, // WebJS App引擎App拷贝
 REPOSITORY = 22104, // WebJS App引擎仓库
};

## WebJSType（WebJS对象类型）

 Enum Enum_App_WebJSType
{
 APP = 22001, // WebJS App对象
 ALIAS = 22002, // WebJS App引擎别名
 SPACETIME = 22004, // WebJS App引擎时空对象
 DEPLOYCONFIG = 22005, // WebJS App引擎部署配置对象
 TASK = 22100, // WebJS App引擎异步任务
 APP_MODEL = 22101, // WebJS App引擎App模型
 APP_COPY = 22102, // WebJS App引擎App拷贝
 REPOSITORY = 22104, // WebJS App引擎仓库
};