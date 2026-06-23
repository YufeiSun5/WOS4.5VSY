# 元语言函数_App引擎

- 分组：元语言函数说明
- 原始章节名：元语言函数_App引擎
- 内容块数量：70
- 来源：WOS4 帮助手册 static/js/file.js

## 正文

# 1. 函数清单

App引擎支持的函数如下：
创建
Result Create(stringMap\ param, stringMap\ input, stringMap\ &output)
删除
Result Delete(stringMap\ param, stringMap\ input, stringMap\ &output)
查询
Result Query(stringMap\ param, stringMap\ input, stringMap\ &output)
修改
Result Update(stringMap\ param, stringMap\ input, stringMap\ &output)
订阅
Result Subscribe(stringMap\ param, stringMap\ input, stringMap\ &output)
取消订阅
Result UnSubscribe(stringMap\ param, stringMap\ input, stringMap\ &output);
定时调用
Result TimerCall(stringMap\ param, stringMap\ input, stringMap\ &output)
取消定时调用
Result DelTimer(stringMap\ param, stringMap\ input, stringMap\ &output)
同步接口调用
Result Call(stringMap\ param, stingMap\ input, stringMap\ &output)
异步接口调用
Result AsyncCall(stringMap\ param, stringMap\ input, stringMap\ &output);
开启事务
Result BeginTransaction(stringMap\ param, stringMap\ input, stringMap\ &output)
查询事务
Result QueryTransaction(stringMap\ param, stringMap\ input, stringMap\ &output)
提交事务
Result CommitTransaction(stringMap\ param, stringMap\ input, stringMap\ &output)
回滚事务
Result RollbackTransaction(stringMap\ param, stringMap\ input, stringMap\ &output)

# 1. 函数清单

 App引擎支持的函数如下：

 
 
 
 函数名称 
 函数原型 
 
 
 
 创建 
 Result Create(stringMap<var> param, stringMap<var> input, stringMap<var> &output) 
 
 
 删除 
 Result Delete(stringMap<var> param, stringMap<var> input, stringMap<var> &output) 
 
 
 查询 
 Result Query(stringMap<var> param, stringMap<var> input, stringMap<var> &output) 
 
 
 修改 
 Result Update(stringMap<var> param, stringMap<var> input, stringMap<var> &output) 
 
 
 订阅 
 Result Subscribe(stringMap<var> param, stringMap<var> input, stringMap<var> &output) 
 
 
 取消订阅 
 Result UnSubscribe(stringMap<var> param, stringMap<var> input, stringMap<var> &output); 
 
 
 定时调用 
 Result TimerCall(stringMap<var> param, stringMap<var> input, stringMap<var> &output) 
 
 
 取消定时调用 
 Result DelTimer(stringMap<var> param, stringMap<var> input, stringMap<var> &output) 
 
 
 同步接口调用 
 Result Call(stringMap<var> param, stingMap<var> input, stringMap<var> &output) 
 
 
 异步接口调用 
 Result AsyncCall(stringMap<var> param, stringMap<var> input, stringMap<var> &output); 
 
 
 开启事务 
 Result BeginTransaction(stringMap<var> param, stringMap<var> input, stringMap<var> &output) 
 
 
 查询事务 
 Result QueryTransaction(stringMap<var> param, stringMap<var> input, stringMap<var> &output) 
 
 
 提交事务 
 Result CommitTransaction(stringMap<var> param, stringMap<var> input, stringMap<var> &output) 
 
 
 回滚事务 
 Result RollbackTransaction(stringMap<var> param, stringMap<var> input, stringMap<var> &output) 
 
 

# 2. 公共说明

# 2. 公共说明

# 2.1. 函数返回结果Result

函数返回结果Result为内置结构体：
struct Result
{
 int32 ret;
 int32 consumeTime;
 int64 traceID;
};
ret
int32
返回值
consumeTime
int32
执行耗时，单位毫秒
traceID
int64
任务跟踪ID，用于查询跟踪日志，App引擎函数不返此项的值，为0
Result中的ret表示状态码，表示函数调用情况，包括：
​ 0：成功（由子系统返回）
-01：未找到访问区域（*未找到云或端）
-02：服务忙
-03：服务异常
-04：服务不支持请求功能（*子系统函数暂未支持）
-05：未登录到访问区域（*未登录到云或端）
-06：系统授权无效（*系统无授权或授权过期）
-07：请求超时
-xx：返回错误码，由各个子系统来规定；

## 2.1. 函数返回结果Result

 函数返回结果Result为内置结构体：

 struct Result
{
 int32 ret;
 int32 consumeTime;
 int64 traceID;
};
 
 
 
 
 名称 
 类型 
 说明 
 
 
 
 ret 
 int32 
 返回值 
 
 
 consumeTime 
 int32 
 执行耗时，单位毫秒 
 
 
 traceID 
 int64 
 任务跟踪ID，用于查询跟踪日志，App引擎函数不返此项的值，为0 
 
 
 Result中的ret表示状态码，表示函数调用情况，包括：

 ​ 0：成功（由子系统返回）

 -01：未找到访问区域（*未找到云或端）

 -02：服务忙

 -03：服务异常

 -04：服务不支持请求功能（*子系统函数暂未支持）

 -05：未登录到访问区域（*未登录到云或端）

 -06：系统授权无效（*系统无授权或授权过期）

 -07：请求超时

 -xx：返回错误码，由各个子系统来规定；

# 2.2. 错误码 errorCodes

1.批量操作和单个操作都返回errorCodes。
(1) 如果函数公共入参校验出现错误时，一个操作都没有执行，则errorCodes数组中返回一个错误码。 
(2) 如果有部分成功（无事务时），则errorCodes与fieldValues（或其他）数组一一对应，成功返回0，失败返回对应错误码。
(3) 如果没有部分成功（开事务时），只能全部成功或全部失败，则errorCodes中出现错误的位置返回对应错误码，其他位置都返回未执行的错误码。
2.针对异步接口的errorCodes信息返回说明如下：
入参校验错误返回在output的errorCodes中，返回一个错误信息。
**脚本示例：**
param.type = -11101; // type类型不存在。
input.ids = {96027650047,96027650048,96027650048}; //App对象ID重复
input.mode = -100; // mode模式不存在
执行过程中系统层面返回的错误信息，返回到callBack中的errorCodes中。
**例如：**执行过程中校验id不存在，该错误信息返回在callBack中，如果是ids数组，则返回的errorCodes长度与ids数组长度对应。

## 2.2. 错误码 errorCodes

 1.批量操作和单个操作都返回errorCodes。

 (1) 如果函数公共入参校验出现错误时，一个操作都没有执行，则errorCodes数组中返回一个错误码。 

 (2) 如果有部分成功（无事务时），则errorCodes与fieldValues（或其他）数组一一对应，成功返回0，失败返回对应错误码。

 (3) 如果没有部分成功（开事务时），只能全部成功或全部失败，则errorCodes中出现错误的位置返回对应错误码，其他位置都返回未执行的错误码。

 2.针对异步接口的errorCodes信息返回说明如下：

 
 入参校验错误返回在output的errorCodes中，返回一个错误信息。

 
 脚本示例： 

 param.type = -11101; // type类型不存在。
input.ids = {96027650047,96027650048,96027650048}; //App对象ID重复
input.mode = -100; // mode模式不存在
 
 
 执行过程中系统层面返回的错误信息，返回到callBack中的errorCodes中。

 
 例如： 执行过程中校验id不存在，该错误信息返回在callBack中，如果是ids数组，则返回的errorCodes长度与ids数组长度对应。

# 2.3. 超时时间timeout

超时时间timeout：表示函数操作在完成之前所允许的最大时间。如果这个时间内操作没有完成，则由系统视为失败，主动终止操作。超时时间ms可以避免长时间等待没有结果的响应，保证系统稳定性。需要设置合理的超时时间ms。
脚本函数中timeout默认为10000，与网关超时无关。
timeout不能设置为0。

## 2.3. 超时时间timeout

 
 超时时间timeout：表示函数操作在完成之前所允许的最大时间。如果这个时间内操作没有完成，则由系统视为失败，主动终止操作。超时时间ms可以避免长时间等待没有结果的响应，保证系统稳定性。需要设置合理的超时时间ms。

 脚本函数中timeout默认为10000，与网关超时无关。

 timeout不能设置为0。

 

# 2.4. filter字符串说明

filter字符串支持关系运算符（==、!=、>、 =、 filter字符串支持关系运算符（==、!=、>、<、>=、<=）逻辑运算符（与&&、或||、非!） 、包含（in）及正则表达式。

 使用~ 开启正则表达式，正则表达式直接放在/ /之中，后面可带修饰符，目前仅支持i修饰符，表示不区分大小写，即匹配时忽略字符串的大小写。

 操作符优先级如下：

 关系操作符的优先级高于逻辑操作符（与、或）

 逻辑操作符与(&&)的优先级高于或(||)

 圆括号优先级高于与(&&)、或(||)

 过滤字符串时，字符串值需要用双引号括起。

 支持过滤的字段有$name、$label1、$label2、$label3。

 常见过滤举例：

 1、字符串类型

 filter = "$name == \"对象\""; //名称为对象 
filter = "$name != \"对象\""; //名称不为对象
filter = "$name in (\"对象1\",\"对象2\",\"对象3\")"; //名称为对象1或对象2或对象3 
filter = "$name ==~ \"/物料.*/\""; //正则表达式，名称以物料开头
 
 2、 uint64类型

 filter = "$copyID == 123456"; 
filter = "$copyID = " + StringFromUint(copyID,10); //值等于变量
 
 3、多条件过滤 

 filter = "$name == \"对象\" && "$lable1 == \"标签1\" || $copyID == 12345678"; 
filter = "$name == \"对象\" && ("$lable1 == \"标签1\" || $copyID == 12345678)";//优先执行()
 

# 2.5. 异步操作执行耗时

创建App对象为异步操作，其执行耗时：指请求本身的执行耗时，即发送请求到id返回的时间，不是发送请求到创建成功（onCreate执行完）的时间。
删除App对象为异步操作，其执行耗时：指请求本身的执行耗时，即发送请求到请求返回的时间，不是发送请求到删除成功（onDestory执行完）的时间。
异步导入运行模型或拷贝，执行耗时同理。

## 2.5. 异步操作执行耗时

 创建App对象为异步操作，其执行耗时：指请求本身的执行耗时，即发送请求到id返回的时间，不是发送请求到创建成功（onCreate执行完）的时间。

 删除App对象为异步操作，其执行耗时：指请求本身的执行耗时，即发送请求到请求返回的时间，不是发送请求到删除成功（onDestory执行完）的时间。

 异步导入运行模型或拷贝，执行耗时同理。

# 2.6. 入参校验规则

1、入参重复
如果入参input一级为数组类型，如id重复时，入参校验直接报错重复，不执行。
如果入参input内嵌套的层级，如fieldvules中有数组类型，如名称重复时，在函数执行过程中报错，此时会出现第一个名称成功，第二个重复名称失败。
2、入参必填字段缺失或错误
入参必填字段缺失或错误，入参校验直接报错重复，不执行。
3、入参出现多余字段
入参出现多余字段，忽略处理，不报错。
4、查询返回字段returnFields
查询返回字段returnFields中出现多余字段，不报错，返回null。
如果出现重复字段，入参校验直接报错重复，不执行。

## 2.6. 入参校验规则

 1、入参重复

 如果入参input一级为数组类型，如id重复时，入参校验直接报错重复，不执行。

 如果入参input内嵌套的层级，如fieldvules中有数组类型，如名称重复时，在函数执行过程中报错，此时会出现第一个名称成功，第二个重复名称失败。

 2、入参必填字段缺失或错误

 入参必填字段缺失或错误，入参校验直接报错重复，不执行。

 3、入参出现多余字段

 入参出现多余字段，忽略处理，不报错。

 4、查询返回字段returnFields

 查询返回字段returnFields中出现多余字段，不报错，返回null。

 如果出现重复字段，入参校验直接报错重复，不执行。

# 3. 函数说明

# 3. 函数说明

# 3.1. App对象

## 3.1. App对象

# 3.1.1. 创建App对象

### 3.1.1. 创建App对象

# 3.1.1.1. 根据App拷贝创建根App对象

**Result Create(stringMap\ param, stringMap\ input, stringMap\ &output);**
**功能描述：**根据App拷贝创建根App对象。
**注意事项：**
App拷贝及其App模型版本需要已导入到App引擎中。
为异步函数，即立即返回结果，此时创建App对象的操作可能未完成还在进行中。
如果配置的用户登录失败，则对象创建失败，返回错误信息。
App对象的名称在一个时空内不允许重复，不能包含“/”。
与创建方App在同一个时空内，不允许跨时空创建。
只能使用本仓库内的App拷贝创建App对象。
通过同一个App拷贝可以创建多个App对象。
App对象上属性、成员如果没有在创建时修改，则仍然保留App拷贝上的值。
不允许环形创建App对象。如：根据App拷贝1创建App对象1，在App对象1的脚本中又根据App拷贝1创建App对象2。
**param有效参数：**
cloudID
int32
区域ID
否
0
areaID
int32
数据区ID
否
本App所在数据区
type
int32
对象类型，21001
是

timeout
int32
超时时间ms
否
10000
**input有效参数：**
mode
int32
模式，=1
是

fieldValues
stringMap\ []
字段数组
一个map对应一个对象；
是

**fieldValues有效参数：**
copyGUID
string
App拷贝GUID
是

initialFields
stringMap\ 
属性、成员字段
参见《数据结构表》中选填字段;
支持指定对象ID创建，此时id字段赋值需要满足ID生成的规则，系统不会自动生成；
否

runConfig
stringMap\ 
运行配置
{
 int maxParallel; //最大线程数，默认是8
}
否
从App拷贝上获取
userList
stringMap\ []
用户列表
{
 string ip; // 云或端IP
 int32 port; // 云或端Port
 int32 terminalID; // 端ID（如果WOS没有IP时通过该参数登录）
 int32 userType; // 用户类型
 string userName; // 用户名
 string password; // 密码
}
注：对于App（四种）用户而言，ip、port字段可以省略；
否
从App拷贝上获取
accessSpaceTimeList
stringMap\ []
远程访问时空列表
{
 int32 cloudID; // 云ID
 string spaceTimeGUID; // 时空对象GUID
}
远程访问时空指本App对象访问其他云的云时空，不包含本地时空；
一个云指定一个访问时空；
否

scriptLogConfig
stringMap\ 
脚本日志配置项 scriptLogConfig.configName=value;
否

perfLogConfig
stringMap\ 
性能日志配置项 perfLogConfig.configName=value;
否

**output有效参数：**
ids
uint64[]
对象ID数组
如果没有创建成功，id为0
errorCodes
int32[]
错误码数组
与fieldValues数组一一对应，成功返回0，失败返回对应错误码
**错误码:**
参见《错误码_App引擎》
**脚本示例：**
stringMap param;
stringMap input;
stringMap output;
stringMap [] fieldValues;
stringMap fieldValueTemp;
stringMap initialFields;
stringMap [] userList;
stringMap userTemp;
stringMap [] accessSpaceTimeList;
stringMap accessSpaceTimeTemp;
string appCopyGUID = "6bd040bf-d7b8-4e70-9e87-6530b66f9af3";
param.cloudID = 0;
param.areaID = 0;
param.type = (int32)Enum_App_MLType::APP;
param.timeout = 10000;
input.mode = (int32)Enum_App_CreateMode::ROOT;
fieldValueTemp.copyGUID = appCopyGUID;
initialFields.$name = "App名称";
initialFields.member1 = "成员1的值";
fieldValueTemp.initialFields = initialFields;
userTemp.ip = "192.168.30.1";
userTemp.port = 9770;
userTemp.userType = (int32)Enum_App_UserType::BUSINESS_USER;
userTemp.userName = "user1";
userTemp.password = "kingview01";
userList.push(userTemp);
fieldValueTemp.userList = userList;
accessSpaceTimeTemp.cloudID = 1;
accessSpaceTimeTemp.spaceTimeGUID = "fcd55c83-e2e6-46f2-959f-2d465bf2bd26";
accessSpaceTimeList.push(accessSpaceTimeTemp);
fieldValueTemp.accessSpaceTimeList = accessSpaceTimeList;
fieldValues.push(fieldValueTemp);
input.fieldValues = fieldValues;
Result ret = Create(param, input, output);
if(0 == ret.ret)
{
 Trace(2, "创建根App执行正常，output = ", output);
}
else
{
 Trace(2, "创建根App执行异常，ret = ", ret);
 Trace(2, "创建根App执行异常，output = ", output);
}

#### 3.1.1.1. 根据App拷贝创建根App对象

 Result Create(stringMap<var> param, stringMap<var> input, stringMap<var> &output); 

 功能描述： 根据App拷贝创建根App对象。

 注意事项： 

 
 App拷贝及其App模型版本需要已导入到App引擎中。

 为异步函数，即立即返回结果，此时创建App对象的操作可能未完成还在进行中。

 如果配置的用户登录失败，则对象创建失败，返回错误信息。

 App对象的名称在一个时空内不允许重复，不能包含“/”。

 与创建方App在同一个时空内，不允许跨时空创建。

 只能使用本仓库内的App拷贝创建App对象。

 通过同一个App拷贝可以创建多个App对象。

 App对象上属性、成员如果没有在创建时修改，则仍然保留App拷贝上的值。

 不允许环形创建App对象。如：根据App拷贝1创建App对象1，在App对象1的脚本中又根据App拷贝1创建App对象2。

 
 param有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 cloudID 
 int32 
 区域ID 
 否 
 0 
 
 
 areaID 
 int32 
 数据区ID 
 否 
 本App所在数据区 
 
 
 type 
 int32 
 对象类型，21001 
 是 
 
 
 
 timeout 
 int32 
 超时时间ms 
 否 
 10000 
 
 
 input有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 mode 
 int32 
 模式，=1 
 是 
 
 
 
 fieldValues 
 stringMap<var>[] 
 字段数组
一个map对应一个对象； 
 是 
 
 
 
 fieldValues有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 copyGUID 
 string 
 App拷贝GUID 
 是 
 
 
 
 initialFields 
 stringMap<var> 
 属性、成员字段
参见《数据结构表》中选填字段;
支持指定对象ID创建，此时id字段赋值需要满足ID生成的规则，系统不会自动生成； 
 否 
 
 
 
 runConfig 
 stringMap<var> 
 运行配置
{
 int maxParallel; //最大线程数，默认是8
} 
 否 
 从App拷贝上获取 
 
 
 userList 
 stringMap<var>[] 
 用户列表
{
 string ip; // 云或端IP
 int32 port; // 云或端Port
 int32 terminalID; // 端ID（如果WOS没有IP时通过该参数登录）
 int32 userType; // 用户类型
 string userName; // 用户名
 string password; // 密码
}
注：对于App（四种）用户而言，ip、port字段可以省略； 
 否 
 从App拷贝上获取 
 
 
 accessSpaceTimeList 
 stringMap<var>[] 
 远程访问时空列表
{
 int32 cloudID; // 云ID
 string spaceTimeGUID; // 时空对象GUID
}
远程访问时空指本App对象访问其他云的云时空，不包含本地时空；
一个云指定一个访问时空； 
 否 
 
 
 
 scriptLogConfig 
 stringMap<var> 
 脚本日志配置项 scriptLogConfig.configName=value; 
 否 
 
 
 
 perfLogConfig 
 stringMap<var> 
 性能日志配置项 perfLogConfig.configName=value; 
 否 
 
 
 
 output有效参数： 

 
 
 
 名称 
 类型 
 说明 
 
 
 
 ids 
 uint64[] 
 对象ID数组
如果没有创建成功，id为0 
 
 
 errorCodes 
 int32[] 
 错误码数组
与fieldValues数组一一对应，成功返回0，失败返回对应错误码 
 
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例： 

 stringMap<var> param;
stringMap<var> input;
stringMap<var> output;
stringMap<Var>[] fieldValues;
stringMap<var> fieldValueTemp;
stringMap<var> initialFields;
stringMap<Var>[] userList;
stringMap<var> userTemp;
stringMap<Var>[] accessSpaceTimeList;
stringMap<var> accessSpaceTimeTemp;
string appCopyGUID = "6bd040bf-d7b8-4e70-9e87-6530b66f9af3";
param.cloudID = 0;
param.areaID = 0;
param.type = (int32)Enum_App_MLType::APP;
param.timeout = 10000;
input.mode = (int32)Enum_App_CreateMode::ROOT;
fieldValueTemp.copyGUID = appCopyGUID;
initialFields.$name = "App名称";
initialFields.member1 = "成员1的值";
fieldValueTemp.initialFields = initialFields;
userTemp.ip = "192.168.30.1";
userTemp.port = 9770;
userTemp.userType = (int32)Enum_App_UserType::BUSINESS_USER;
userTemp.userName = "user1";
userTemp.password = "kingview01";
userList.push(userTemp);
fieldValueTemp.userList = userList;
accessSpaceTimeTemp.cloudID = 1;
accessSpaceTimeTemp.spaceTimeGUID = "fcd55c83-e2e6-46f2-959f-2d465bf2bd26";
accessSpaceTimeList.push(accessSpaceTimeTemp);
fieldValueTemp.accessSpaceTimeList = accessSpaceTimeList;
fieldValues.push(fieldValueTemp);
input.fieldValues = fieldValues;
Result ret = Create(param, input, output);
if(0 == ret.ret)
{
 Trace(2, "创建根App执行正常，output = ", output);
}
else
{
 Trace(2, "创建根App执行异常，ret = ", ret);
 Trace(2, "创建根App执行异常，output = ", output);
}
 

# 3.1.1.2. 根据App拷贝创建子App对象

**Result Create(stringMap\ param, stringMap\ input, stringMap\ &output);**
**功能描述：**根据App拷贝ID，在本App对象下创建子App对象。
**注意事项：**
App拷贝及其App模型版本需要已导入到App引擎中。
异步创建模式（isSync为false），立即返回结果，此时创建App对象的操作可能未完成还在进行中。
同步创建模式（isSync为true），批量操作时等所有子App对象创建成功（允许部分成功），即状态为运行正常时返回结果。
如果配置的用户登录失败，则对象创建失败，返回错误信息。
App对象的名称在一个时空内不允许重复，不能包含“/”。
与父App在同一个时空内，不允许跨时空创建。
只能使用本仓库内的App拷贝创建App对象。
与父App的语言类型保持一致。
通过同一个App拷贝可以创建多个App对象。
App对象上属性、成员如果没有在创建时修改，则仍然保留App拷贝上的值。
不允许环形创建App对象。如：根据App拷贝1创建App对象1，在App对象1的脚本中又根据App拷贝1创建App对象2。
**param有效参数：**
type
int32
对象类型，21001
是

timeout
int32
超时时间ms
否
10000
**input有效参数：**
mode
int32
模式，=2
是

isSync
bool
同步模式
否
false
fieldValues
stringMap\ []
字段数组
一个map对应一个对象；
是

**fieldValues有效参数：**
copyGUID
string
App拷贝GUID
是

initialFields
stringMap\ 
属性、成员字段
参见《数据结构表》中选填字段;
支持指定对象ID创建，此时id字段赋值需要满足ID生成的规则，系统不会自动生成；
否

userList
stringMap\ []
用户列表
{
 string ip; // 云或端IP
 int32 port; // 云或端Port
 int32 terminalID; // 端ID（如果WOS没有IP时通过该参数登录）
 int32 userType; // 用户类型
 string userName; // 用户名
 string password; // 密码
}
注：对于App（四种）用户而言，ip、port字段可以省略；
否
从父App上获取
accessSpaceTimeList
stringMap\ []
远程访问时空列表
{
 int32 cloudID; // 云ID
 string spaceTimeGUID; // 时空对象GUID
}
远程访问时空指本App对象访问其他云的云时空，不包含本地时空；
一个云指定一个访问时空；
否
从父App上获取
**output有效参数：**
ids
uint64[]
对象ID数组：
 如果没有创建成功，id为0
errorCodes
int32[]
错误码数组
与fieldValues数组一一对应，成功返回0，失败返回对应错误码
**错误码:**
参见《错误码_App引擎》
**脚本示例：**
stringMap param;
stringMap input;
stringMap output;
stringMap [] fieldValues;
stringMap fieldValueTemp;
stringMap initialFields;
stringMap [] userList;
stringMap userTemp;
stringMap [] accessSpaceTimeList;
stringMap accessSpaceTimeTemp;
string appCopyGUID = "6bd040bf-d7b8-4e70-9e87-6530b66f9af3";
param.cloudID = 0;
param.areaID = 0;
param.type = (int32)Enum_App_MLType::APP;
param.timeout = 10000;
input.mode = (int32)Enum_App_CreateMode::CHILD;
input.isSync = true;
input.memoryLimit = 1024;
fieldValueTemp.copyGUID = appCopyGUID;
initialFields.$name = "App名称";
initialFields.member1 = "成员1的值";
fieldValueTemp.initialFields = initialFields;
userTemp.ip = "192.168.30.1";
userTemp.port = 9770;
userTemp.userType = (int32)Enum_App_UserType::BUSINESS_USER;
userTemp.userName = "user1";
userTemp.password = "kingview01";
userList.push(userTemp);
fieldValueTemp.userList = userList;
accessSpaceTimeTemp.cloudID = 1;
accessSpaceTimeTemp.spaceTimeGUID = "fcd55c83-e2e6-46f2-959f-2d465bf2bd26";
accessSpaceTimeList.push(accessSpaceTimeTemp);
fieldValueTemp.accessSpaceTimeList = accessSpaceTimeList;
fieldValues.push(fieldValueTemp);
input.fieldValues = fieldValues;
Result ret = Create(param, input, output);
if(0 == ret.ret)
{
 Trace(2, "创建子App执行正常，output = ", output);
}
else
{
 Trace(2, "创建子App执行异常，ret = ", ret);
 Trace(2, "创建子App执行异常，output = ", output);
}

#### 3.1.1.2. 根据App拷贝创建子App对象

 Result Create(stringMap<var> param, stringMap<var> input, stringMap<var> &output); 

 功能描述： 根据App拷贝ID，在本App对象下创建子App对象。

 注意事项： 

 
 App拷贝及其App模型版本需要已导入到App引擎中。

 异步创建模式（isSync为false），立即返回结果，此时创建App对象的操作可能未完成还在进行中。

 同步创建模式（isSync为true），批量操作时等所有子App对象创建成功（允许部分成功），即状态为运行正常时返回结果。

 如果配置的用户登录失败，则对象创建失败，返回错误信息。

 App对象的名称在一个时空内不允许重复，不能包含“/”。

 与父App在同一个时空内，不允许跨时空创建。

 只能使用本仓库内的App拷贝创建App对象。

 与父App的语言类型保持一致。

 通过同一个App拷贝可以创建多个App对象。

 App对象上属性、成员如果没有在创建时修改，则仍然保留App拷贝上的值。

 不允许环形创建App对象。如：根据App拷贝1创建App对象1，在App对象1的脚本中又根据App拷贝1创建App对象2。

 
 param有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 type 
 int32 
 对象类型，21001 
 是 
 
 
 
 timeout 
 int32 
 超时时间ms 
 否 
 10000 
 
 
 input有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 mode 
 int32 
 模式，=2 
 是 
 
 
 
 isSync 
 bool 
 同步模式 
 否 
 false 
 
 
 fieldValues 
 stringMap<var>[] 
 字段数组
一个map对应一个对象； 
 是 
 
 
 
 fieldValues有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 copyGUID 
 string 
 App拷贝GUID 
 是 
 
 
 
 initialFields 
 stringMap<var> 
 属性、成员字段
参见《数据结构表》中选填字段;
支持指定对象ID创建，此时id字段赋值需要满足ID生成的规则，系统不会自动生成； 
 否 
 
 
 
 userList 
 stringMap<var>[] 
 用户列表
{
 string ip; // 云或端IP
 int32 port; // 云或端Port
 int32 terminalID; // 端ID（如果WOS没有IP时通过该参数登录）
 int32 userType; // 用户类型
 string userName; // 用户名
 string password; // 密码
}
注：对于App（四种）用户而言，ip、port字段可以省略； 
 否 
 从父App上获取 
 
 
 accessSpaceTimeList 
 stringMap<var>[] 
 远程访问时空列表
{
 int32 cloudID; // 云ID
 string spaceTimeGUID; // 时空对象GUID
}
远程访问时空指本App对象访问其他云的云时空，不包含本地时空；
一个云指定一个访问时空； 
 否 
 从父App上获取 
 
 
 output有效参数： 

 
 
 
 名称 
 类型 
 说明 
 
 
 
 ids 
 uint64[] 
 对象ID数组：
 如果没有创建成功，id为0 
 
 
 errorCodes 
 int32[] 
 错误码数组
与fieldValues数组一一对应，成功返回0，失败返回对应错误码 
 
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例： 

 stringMap<var> param;
stringMap<var> input;
stringMap<var> output;
stringMap<Var>[] fieldValues;
stringMap<var> fieldValueTemp;
stringMap<var> initialFields;
stringMap<Var>[] userList;
stringMap<var> userTemp;
stringMap<Var>[] accessSpaceTimeList;
stringMap<var> accessSpaceTimeTemp;
string appCopyGUID = "6bd040bf-d7b8-4e70-9e87-6530b66f9af3";
param.cloudID = 0;
param.areaID = 0;
param.type = (int32)Enum_App_MLType::APP;
param.timeout = 10000;
input.mode = (int32)Enum_App_CreateMode::CHILD;
input.isSync = true;
input.memoryLimit = 1024;
fieldValueTemp.copyGUID = appCopyGUID;
initialFields.$name = "App名称";
initialFields.member1 = "成员1的值";
fieldValueTemp.initialFields = initialFields;
userTemp.ip = "192.168.30.1";
userTemp.port = 9770;
userTemp.userType = (int32)Enum_App_UserType::BUSINESS_USER;
userTemp.userName = "user1";
userTemp.password = "kingview01";
userList.push(userTemp);
fieldValueTemp.userList = userList;
accessSpaceTimeTemp.cloudID = 1;
accessSpaceTimeTemp.spaceTimeGUID = "fcd55c83-e2e6-46f2-959f-2d465bf2bd26";
accessSpaceTimeList.push(accessSpaceTimeTemp);
fieldValueTemp.accessSpaceTimeList = accessSpaceTimeList;
fieldValues.push(fieldValueTemp);
input.fieldValues = fieldValues;
Result ret = Create(param, input, output);
if(0 == ret.ret)
{
 Trace(2, "创建子App执行正常，output = ", output);
}
else
{
 Trace(2, "创建子App执行异常，ret = ", ret);
 Trace(2, "创建子App执行异常，output = ", output);
}
 

# 3.1.2. 删除App对象

### 3.1.2. 删除App对象

# 3.1.2.1. 删除指定App对象

**Result Delete(stringMap\ param, stringMap\ input, stringMap\ &output);**
**功能描述：**删除指定App对象，包括子、后代App对象，为异步操作。
**注意事项：**
只能删除同一时空内的App对象。
删除父App对象时，子及后代一并删除。
App引擎服务停止后，App对象都会删除。
**param有效参数：**
cloudID
int32
区域ID
否
0
areaID
int32
数据区ID
否
本App所在数据区
type
int32
对象类型，21001
是

timeout
int32
超时时间ms
否
10000
**input有效参数：**
identifierType
int32
对象的标识类型：
1：ID，使用ID标识；
2：NAME，使用名称标识；
是

ids
uint64[]
App对象ID
二选一

names
string[]
App对象名称
二选一

**output有效参数：**
errorCodes
int32[]
错误码数组
与输入的对象个数一致，成功返回0，失败返回对应错误码
**错误码:**
参见《错误码_App引擎》
**脚本示例：**
stringMap param;
stringMap input;
stringMap output;
uint64 appID = 6052837899185946746;
param.cloudID = 0;
param.areaID = 0;
param.type = (int32)Enum_App_MLType::APP;
param.timeout = 10000;
input.identifierType = (int32)Enum_App_IdentifierType::ID;
input.ids = {appID};
Result ret = Delete(param, input, output);
if(0 == ret.ret)
{
 Trace(2, "删除App执行正常，output = ", output);
}
else
{
 Trace(2, "删除App执行异常，ret = ", ret);
 Trace(2, "删除App执行异常，output = ", output);
}

#### 3.1.2.1. 删除指定App对象

 Result Delete(stringMap<var> param, stringMap<var> input, stringMap<var> &output); 

 功能描述： 删除指定App对象，包括子、后代App对象，为异步操作。

 注意事项： 

 
 只能删除同一时空内的App对象。

 删除父App对象时，子及后代一并删除。

 App引擎服务停止后，App对象都会删除。

 
 param有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 cloudID 
 int32 
 区域ID 
 否 
 0 
 
 
 areaID 
 int32 
 数据区ID 
 否 
 本App所在数据区 
 
 
 type 
 int32 
 对象类型，21001 
 是 
 
 
 
 timeout 
 int32 
 超时时间ms 
 否 
 10000 
 
 
 input有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 identifierType 
 int32 
 对象的标识类型：
1：ID，使用ID标识；
2：NAME，使用名称标识； 
 是 
 
 
 
 ids 
 uint64[] 
 App对象ID 
 二选一 
 
 
 
 names 
 string[] 
 App对象名称 
 二选一 
 
 
 
 output有效参数： 

 
 
 
 名称 
 类型 
 说明 
 
 
 
 errorCodes 
 int32[] 
 错误码数组
与输入的对象个数一致，成功返回0，失败返回对应错误码 
 
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例： 

 stringMap<var> param;
stringMap<var> input;
stringMap<var> output;
uint64 appID = 6052837899185946746;
param.cloudID = 0;
param.areaID = 0;
param.type = (int32)Enum_App_MLType::APP;
param.timeout = 10000;
input.identifierType = (int32)Enum_App_IdentifierType::ID;
input.ids = {appID};
Result ret = Delete(param, input, output);
if(0 == ret.ret)
{
 Trace(2, "删除App执行正常，output = ", output);
}
else
{
 Trace(2, "删除App执行异常，ret = ", ret);
 Trace(2, "删除App执行异常，output = ", output);
}
 

# 3.1.3. 查询App对象

### 3.1.3. 查询App对象

# 3.1.3.1. 查询指定App对象的属性、成员

**Result Query(stringMap\ param, stringMap\ input,stringMap\ &output);**
**功能描述：**查询指定App对象的属性、成员。
**注意事项：**
查询App对象支持跨时空。
**param有效参数：**
cloudID
int32
区域ID
否
0
areaID
int32
数据区ID
否
本App所在数据区
type
int32
对象类型，21001
是

timeout
int32
超时时间ms
否
10000
**input有效参数：**
mode
int32
模式，=1
是

identifierType
int32
对象的标识类型：
1：ID，使用ID标识；
2：NAME，使用名称标识；
是

ids
uint64[]
App对象ID
二选一

names
string[]
App对象名称
二选一

spaceTimeIdentifierType
int32
时空对象的标识类型：
2：NAME，使用名称标识；
5：GUID，使用Guid标识
identifierType为name时必填

spaceTimeName
string
时空对象名称
值为空表示系统时空；
无该字段表示本时空；
二选一
本时空
spaceTimeGUID
string
时空对象GUID
值为空表示系统时空；
无该字段表示本时空；
二选一
本时空
returnFields
string[]
返回字段名称
不能为空，查询的字段不存在返回null、字段重复则报错
是

**output有效参数：**
returnData
DataSet
返回数据
一个对象对应DataSet类型的一行数据
列名与returnFields一致
errorCodes
int32[]
错误码数组
与输入的对象个数一致，成功返回0，失败返回对应错误码
**错误码:**
参见《错误码_App引擎》
**脚本示例：**
stringMap param;
stringMap input;
stringMap output;
uint64 appID = 6052837899185946746;
param.cloudID = 0;
param.areaID = 0;
param.type = (int32)Enum_App_MLType::APP;
param.timeout = 10000;
input.mode = (int32)Enum_App_QueryMode::FIELDS;
input.identifierType = (int32)Enum_App_IdentifierType::ID;
input.ids = {appID};
input.returnFields = {"$name", "mem1", "mem2"};
Result ret = Query(param, input, output);
if(0 == ret.ret)
{
 Trace(2, "查询App执行正常，output = ", output);
 DataSet returnData = output.returnData;
 if(returnData.rowLength > 0)
 {
 for(int32 i = 1; i Result Query(stringMap<var> param, stringMap<var> input,stringMap<var> &output); 

 功能描述： 查询指定App对象的属性、成员。

 注意事项： 

 查询App对象支持跨时空。

 param有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 cloudID 
 int32 
 区域ID 
 否 
 0 
 
 
 areaID 
 int32 
 数据区ID 
 否 
 本App所在数据区 
 
 
 type 
 int32 
 对象类型，21001 
 是 
 
 
 
 timeout 
 int32 
 超时时间ms 
 否 
 10000 
 
 
 input有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 mode 
 int32 
 模式，=1 
 是 
 
 
 
 identifierType 
 int32 
 对象的标识类型：
1：ID，使用ID标识；
2：NAME，使用名称标识； 
 是 
 
 
 
 ids 
 uint64[] 
 App对象ID 
 二选一 
 
 
 
 names 
 string[] 
 App对象名称 
 二选一 
 
 
 
 spaceTimeIdentifierType 
 int32 
 时空对象的标识类型：
2：NAME，使用名称标识；
5：GUID，使用Guid标识 
 identifierType为name时必填 
 
 
 
 spaceTimeName 
 string 
 时空对象名称
值为空表示系统时空；
无该字段表示本时空； 
 二选一 
 本时空 
 
 
 spaceTimeGUID 
 string 
 时空对象GUID
值为空表示系统时空；
无该字段表示本时空； 
 二选一 
 本时空 
 
 
 returnFields 
 string[] 
 返回字段名称
不能为空，查询的字段不存在返回null、字段重复则报错 
 是 
 
 
 
 output有效参数： 

 
 
 
 名称 
 类型 
 说明 
 
 
 
 returnData 
 DataSet 
 返回数据
一个对象对应DataSet类型的一行数据
列名与returnFields一致 
 
 
 errorCodes 
 int32[] 
 错误码数组
与输入的对象个数一致，成功返回0，失败返回对应错误码 
 
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例： 

 stringMap<var> param;
stringMap<var> input;
stringMap<var> output;
uint64 appID = 6052837899185946746;
param.cloudID = 0;
param.areaID = 0;
param.type = (int32)Enum_App_MLType::APP;
param.timeout = 10000;
input.mode = (int32)Enum_App_QueryMode::FIELDS;
input.identifierType = (int32)Enum_App_IdentifierType::ID;
input.ids = {appID};
input.returnFields = {"$name", "mem1", "mem2"};
Result ret = Query(param, input, output);
if(0 == ret.ret)
{
 Trace(2, "查询App执行正常，output = ", output);
 DataSet returnData = output.returnData;
 if(returnData.rowLength > 0)
 {
 for(int32 i = 1; i <= returnData.rowLength; i++)
 {
 string name = returnData.cellByName(i, "$name");
 }
 }
}
else
{
 Trace(2, "查询App执行异常，ret = ", ret);
 Trace(2, "查询App执行异常，output = ", output);
}
 

# 3.1.3.2. 查询指定时空内根App对象列表

**Result Query(stringMap\ param, stringMap\ input,stringMap\ &output);**
**功能描述：**查询指定时空内根App对象列表。
**param有效参数：**
cloudID
int32
区域ID
否
0
areaID
int32
数据区ID
否
本App所在数据区
type
int32
对象类型，21001
是

timeout
int32
超时时间ms
否
10000
**input有效参数：**
mode
int32
模式，=2
是

spaceTimeGUID
string
时空对象GUID
值为空表示系统时空；
无该字段表示本时空；
否
本时空
returnFields
string[]
返回字段名称
不能为空，查询的字段不存在返回null、字段重复则报错
是

**output有效参数：**
returnData
DataSet
返回数据
一个对象对应DataSet类型的一行数据
列名与returnFields一致
errorCodes
int32[]
错误码数组
只返回一个错误码，数组长度为1
**错误码:**
参见《错误码_App引擎》
**脚本示例：**
stringMap param;
stringMap input;
stringMap output;
param.cloudID = 0;
param.areaID = 0;
param.type = (int32)Enum_App_MLType::APP;
param.timeout = 10000;
input.mode = (int32)Enum_App_QueryMode::IN_LOCAL_SPACETIME;
input.spaceTimeGUID = "fcd55c83-e2e6-46f2-959f-2d465bf2bd26";
input.returnFields = {"$name", "mem1", "mem2"};
Result ret = Query(param, input, output);
if(0 == ret.ret)
{
 Trace(2, "查询时空内的根App列表执行正常，output = ", output);
 DataSet returnData = output.returnData;
 if(returnData.rowLength > 0)
 {
 for(int32 i = 1; i Result Query(stringMap<var> param, stringMap<var> input,stringMap<var> &output); 

 功能描述： 查询指定时空内根App对象列表。

 param有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 cloudID 
 int32 
 区域ID 
 否 
 0 
 
 
 areaID 
 int32 
 数据区ID 
 否 
 本App所在数据区 
 
 
 type 
 int32 
 对象类型，21001 
 是 
 
 
 
 timeout 
 int32 
 超时时间ms 
 否 
 10000 
 
 
 input有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 mode 
 int32 
 模式，=2 
 是 
 
 
 
 spaceTimeGUID 
 string 
 时空对象GUID
值为空表示系统时空；
无该字段表示本时空； 
 否 
 本时空 
 
 
 returnFields 
 string[] 
 返回字段名称
不能为空，查询的字段不存在返回null、字段重复则报错 
 是 
 
 
 
 output有效参数： 

 
 
 
 名称 
 类型 
 说明 
 
 
 
 returnData 
 DataSet 
 返回数据
一个对象对应DataSet类型的一行数据
列名与returnFields一致 
 
 
 errorCodes 
 int32[] 
 错误码数组
只返回一个错误码，数组长度为1 
 
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例： 

 stringMap<var> param;
stringMap<var> input;
stringMap<var> output;
param.cloudID = 0;
param.areaID = 0;
param.type = (int32)Enum_App_MLType::APP;
param.timeout = 10000;
input.mode = (int32)Enum_App_QueryMode::IN_LOCAL_SPACETIME;
input.spaceTimeGUID = "fcd55c83-e2e6-46f2-959f-2d465bf2bd26";
input.returnFields = {"$name", "mem1", "mem2"};
Result ret = Query(param, input, output);
if(0 == ret.ret)
{
 Trace(2, "查询时空内的根App列表执行正常，output = ", output);
 DataSet returnData = output.returnData;
 if(returnData.rowLength > 0)
 {
 for(int32 i = 1; i <= returnData.rowLength; i++)
 {
 string name = returnData.cellByName(i, "$name");
 }
 }
}
else
{
 Trace(2, "查询时空内的根App列表执行异常，ret = ", ret);
 Trace(2, "查询时空内的根App列表执行异常，output = ", output);
}
 

# 3.1.3.3. 查询指定父App的子或后代App对象列表

**Result Query(stringMap\ param, stringMap\ input,stringMap\ &output);**
**功能描述：**查询指定父App对象的子或后代App对象列表。
**注意事项：**
只返回子或后代App对象，父App对象信息不在查询结果内。
**param有效参数：**
cloudID
int32
区域ID
否
0
areaID
int32
数据区ID
否
本App所在数据区
type
int32
对象类型，21001
是

timeout
int32
超时时间ms
否
10000
**input有效参数：**
mode
int32
模式，=4
是

id
uint64
父App对象ID
是

queryType
int32
查询类型
1：查询子App
2：查询后代App
是

returnFields
string[]
返回字段名称
不能为空，查询的字段不存在返回null、字段重复则报错
是

**output有效参数：**
returnData
DataSet
返回数据
一个对象对应DataSet类型的一行数据
列名与returnFields一致
errorCodes
int32[]
错误码数组
只返回一个错误码，数组长度为1
**错误码:**
参见《错误码_App引擎》
**脚本示例：**
stringMap param;
stringMap input;
stringMap output;
uint64 appID = 6052837899185946746;
param.cloudID = 0;
param.areaID = 0;
param.type = (int32)Enum_App_MLType::APP;
param.timeout = 10000;
input.mode = (int32)Enum_App_QueryMode::CHILD_AND_DESCENDANT;
input.id = appID;
input.queryType = (int32)Enum_App_QueryType::CHILD;
input.returnFields = {"$name", "mem1", "mem2"};
Result ret = Query(param, input, output);
if(0 == ret.ret)
{
 Trace(2, "查询App的后代App执行正常，output = ", output);
 DataSet returnData = output.returnData;
 if(returnData.rowLength > 0)
 {
 for(int i = 1; i Result Query(stringMap<var> param, stringMap<var> input,stringMap<var> &output); 

 功能描述： 查询指定父App对象的子或后代App对象列表。

 注意事项： 

 
 只返回子或后代App对象，父App对象信息不在查询结果内。

 
 param有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 cloudID 
 int32 
 区域ID 
 否 
 0 
 
 
 areaID 
 int32 
 数据区ID 
 否 
 本App所在数据区 
 
 
 type 
 int32 
 对象类型，21001 
 是 
 
 
 
 timeout 
 int32 
 超时时间ms 
 否 
 10000 
 
 
 input有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 mode 
 int32 
 模式，=4 
 是 
 
 
 
 id 
 uint64 
 父App对象ID 
 是 
 
 
 
 queryType 
 int32 
 查询类型
1：查询子App
2：查询后代App 
 是 
 
 
 
 returnFields 
 string[] 
 返回字段名称
不能为空，查询的字段不存在返回null、字段重复则报错 
 是 
 
 
 
 output有效参数： 

 
 
 
 名称 
 类型 
 说明 
 
 
 
 returnData 
 DataSet 
 返回数据
一个对象对应DataSet类型的一行数据
列名与returnFields一致 
 
 
 errorCodes 
 int32[] 
 错误码数组
只返回一个错误码，数组长度为1 
 
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例： 

 stringMap<var> param;
stringMap<var> input;
stringMap<var> output;
uint64 appID = 6052837899185946746;
param.cloudID = 0;
param.areaID = 0;
param.type = (int32)Enum_App_MLType::APP;
param.timeout = 10000;
input.mode = (int32)Enum_App_QueryMode::CHILD_AND_DESCENDANT;
input.id = appID;
input.queryType = (int32)Enum_App_QueryType::CHILD;
input.returnFields = {"$name", "mem1", "mem2"};
Result ret = Query(param, input, output);
if(0 == ret.ret)
{
 Trace(2, "查询App的后代App执行正常，output = ", output);
 DataSet returnData = output.returnData;
 if(returnData.rowLength > 0)
 {
 for(int i = 1; i <= returnData.rowLength; i++)
 {
 string name = returnData.cellByName(i, "$name");
 }
 } 
}
else
{
 Trace(2, "查询App的后代App执行异常，ret = ", ret);
 Trace(2, "查询App的后代App执行异常，output = ", output);
}
 

# 3.1.3.4. 根据App属性过滤查询App对象列表

**Result Query(stringMap\ param, stringMap\ input,stringMap\ &output);**
**功能描述：**根据App属性过滤查询App对象列表。
**注意事项：**
不区分根App对象和子App对象，会将所有满足过滤条件的App对象都返回。
**param有效参数：**
cloudID
int32
区域ID
否
0
areaID
int32
数据区ID
否
本App所在数据区
type
int32
对象类型，21001
是

timeout
int32
超时时间ms
否
10000
**input有效参数：**
mode
int32
模式，=5
是

spaceTimeIdentifierType
int32
时空对象的标识类型：
2：NAME，使用名称标识；
5：GUID，使用Guid标识
是

spaceTimeName
string
时空对象名称：
值为空表示系统时空；
无该字段表示本时空；
二选一
本时空
spaceTimeGUID
string
时空对象GUID：
值为空表示系统时空；
无该字段表示本时空；
二选一
本时空
filter
string
过滤字符串
支持过滤的字段有$name、$label1、$label2、$label3、$repoGUID，其他字段报错
是

returnFields
string[]
返回字段名称
不能为空，查询的字段不存在返回null、字段重复则报错
是

**filter字段示例**

**output有效参数：**
returnData
DataSet
返回数据
一个对象对应DataSet类型的一行数据
列名与returnFields一致
errorCodes
int32[]
错误码数组
只返回一个错误码，数组长度为1
**错误码:**
参见《错误码_App引擎》
**脚本示例：**
stringMap param;
stringMap input;
stringMap output;
param.cloudID = 0;
param.areaID = 0;
param.type = (int32)Enum_App_MLType::APP;
param.timeout = 10000;
input.mode = (int32)Enum_App_QueryMode::BY_FILTER;
input.spaceTimeIdentifierType = (int32)Enum_App_IdentifierType::GUID;;
input.spaceTimeGUID = "fcd55c83-e2e6-46f2-959f-2d465bf2bd26";
input.filter = "$lable1 == \"标签1\"";
input.returnFields = {"$name", "mem1", "mem2"};
Result ret = Query(param, input, output);
if(0 == ret.ret)
{
 Trace(2, "过滤查询App列表执行正常，output = ", output);
 DataSet returnData = output.returnData;
 if(returnData.rowLength > 0)
 {
 for(int32 i = 1; i Result Query(stringMap<var> param, stringMap<var> input,stringMap<var> &output); 

 功能描述： 根据App属性过滤查询App对象列表。

 注意事项： 

 
 不区分根App对象和子App对象，会将所有满足过滤条件的App对象都返回。

 
 param有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 cloudID 
 int32 
 区域ID 
 否 
 0 
 
 
 areaID 
 int32 
 数据区ID 
 否 
 本App所在数据区 
 
 
 type 
 int32 
 对象类型，21001 
 是 
 
 
 
 timeout 
 int32 
 超时时间ms 
 否 
 10000 
 
 
 input有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 mode 
 int32 
 模式，=5 
 是 
 
 
 
 spaceTimeIdentifierType 
 int32 
 时空对象的标识类型：
2：NAME，使用名称标识；
5：GUID，使用Guid标识 
 是 
 
 
 
 spaceTimeName 
 string 
 时空对象名称：
值为空表示系统时空；
无该字段表示本时空； 
 二选一 
 本时空 
 
 
 spaceTimeGUID 
 string 
 时空对象GUID：
值为空表示系统时空；
无该字段表示本时空； 
 二选一 
 本时空 
 
 
 filter 
 string 
 过滤字符串
支持过滤的字段有$name、$label1、$label2、$label3、$repoGUID，其他字段报错 
 是 
 
 
 
 returnFields 
 string[] 
 返回字段名称
不能为空，查询的字段不存在返回null、字段重复则报错 
 是 
 
 
 
 filter字段示例 

 
 
 output有效参数： 

 
 
 
 名称 
 类型 
 说明 
 
 
 
 returnData 
 DataSet 
 返回数据
一个对象对应DataSet类型的一行数据
列名与returnFields一致 
 
 
 errorCodes 
 int32[] 
 错误码数组
只返回一个错误码，数组长度为1 
 
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例： 

 stringMap<var> param;
stringMap<var> input;
stringMap<var> output;
param.cloudID = 0;
param.areaID = 0;
param.type = (int32)Enum_App_MLType::APP;
param.timeout = 10000;
input.mode = (int32)Enum_App_QueryMode::BY_FILTER;
input.spaceTimeIdentifierType = (int32)Enum_App_IdentifierType::GUID;;
input.spaceTimeGUID = "fcd55c83-e2e6-46f2-959f-2d465bf2bd26";
input.filter = "$lable1 == \"标签1\"";
input.returnFields = {"$name", "mem1", "mem2"};
Result ret = Query(param, input, output);
if(0 == ret.ret)
{
 Trace(2, "过滤查询App列表执行正常，output = ", output);
 DataSet returnData = output.returnData;
 if(returnData.rowLength > 0)
 {
 for(int32 i = 1; i <= returnData.rowLength; i++)
 {
 string name = returnData.cellByName(i, "$name");
 }
 } 
}
else
{
 Trace(2, "过滤查询App列表执行异常，ret = ", ret);
 Trace(2, "过滤查询App列表执行异常，output = ", output);
}
 

# 3.1.4. 订阅App对象

### 3.1.4. 订阅App对象

# 3.1.4.1. 订阅指定App对象运行状态

**Result Subscribe(stringMap\ param, stringMap\ input, stringMap\ &output);**
**onCallBack(stringMap\ callback)；**
**功能描述：**订阅指定App对象的运行状态变化。
**注意事项：**
运行状态发生变化时会触发回调。
运行状态包括：1：启动中；2：运行正常；3：运行异常；4：停止中；5：已停止；6：启动异常；7：停止异常；8：强制删除中。
一个App中允许重复订阅同一个App对象。不同App中允许重复订阅同一个App对象。取消一个订阅项不会影响其他订阅项。
App对象删除时，系统会自动清除订阅项。
订阅项名称规则：长度最多64个字符，不能为空，不支持空格，英文语言方面不支持除字母和下划线外的任何字符; 不支持数字开头。
订阅App对象支持跨时空。
**param有效参数：**
cloudID
int32
区域ID
否
0
areaID
int32
数据区ID
否
本App所在数据区
type
int32
对象类型，21001
是

timeout
int32
超时时间ms
否
10000
callBackFuncName
string
回调函数名称
是

**input有效参数：**
mode
int32
订阅模式，=1
是

identifierType
int32
对象的标识类型
1：ID，使用ID标识；
2：NAME，使用名称标识；
是

ids
uint64[]
App对象ID
二选一

names
string[]
App对象名称
二选一

spaceTimeIdentifierType
int32
时空对象的标识类型：
2：NAME，使用名称标识；
5：GUID，使用Guid标识
identifierType为name时必填

spaceTimeName
string
时空对象名称
值为空表示系统时空；
无该字段表示本时空；
否
本时空
spaceTimeGUID
string
时空对象GUID
值为空表示系统时空；
无该字段表示本时空；
否
本时空
subscribeName
string
订阅项名称 
本App内不能重复
是

pubConfig
stringMap\ 
订阅配置
否

**pubConfig 有效参数：**
qos
int
质量等级， 
AT_MOST_ONCE(0)
AT_LEAST_ONCE(1)
 EXACTLY_ONCE(2)
否
1
cachePersist
bool
发布缓存是否持久化，默认false
否
false
cacheEvictPolicy
int
发布缓存淘汰策略： 
FIFO(0)：先进先出，
LIFO(1)：后进先出
否
0
cacheMaxSize
int
发布缓存最大条数
否
1000
timeout
int
发布存活超时时间ms
否
30000
cycle
int
发布周期ms
针对PUSH模式起作用
否
0
batchMaxSize
int
单次发布最大条数 
针对PUSH模式起作用
否
10
**output有效参数：**
errorCodes
int32[]
错误码数组
与输入的ids或names一一对应
**订阅回调callBack:**
stringMap\ callback，包含字段如下：
id
uint64
App对象ID
name
string
App对象名称
copyGUID
string
App对象对应的拷贝GUID
spaceTimeGUID
string
App对象所在时空信息
status
int32
运行状态
**错误码:**
参见《错误码_App引擎》
**脚本示例：**
// 订阅
stringMap param;
stringMap input;
stringMap output;
uint64 appID = 6052837899185946746;
param.cloudID = 0;
param.areaID = 0;
param.type = (int32)Enum_App_MLType::APP;
string funcName = "callbackfunc";
param.callBackFuncName = funcName;
param.timeout = 10000;
input.mode = (int32)Enum_App_SubscribeMode::RUNSTATUS;
input.identifierType = (int32)Enum_App_IdentifierType::ID;
input.ids = {appID};
input.subscribeName = "订阅项1";
Result ret = Subscribe(param, input, output);
if(0 == ret.ret)
{
 Trace(2, "订阅App执行正常，output = ", output);
}
else
{
 Trace(2, "订阅App执行异常，ret = ", ret);
 Trace(2, "订阅App执行异常，output = ", output);
}

// 订阅回调函数：callbackfunc
// 回调函数名：callbackfunc，入参：stringMap callback
{
 uint64 id = callback.id;
 string name = callback.name;
 string copyGUID = callback.copyGUID;
 string spaceTimeGUID = callback.spaceTimeGUID;
 int32 status = callback.status;
 int32 run = (int32)Enum_App_Status::RUNNING_NORMAL;
 if(status == run)
 {
 Trace(2, "App运行正常", "");
 }
}

#### 3.1.4.1. 订阅指定App对象运行状态

 Result Subscribe(stringMap<var> param, stringMap<var> input, stringMap<var> &output); 

 onCallBack(stringMap<var> callback)； 

 功能描述： 订阅指定App对象的运行状态变化。

 注意事项： 

 
 运行状态发生变化时会触发回调。

 运行状态包括：1：启动中；2：运行正常；3：运行异常；4：停止中；5：已停止；6：启动异常；7：停止异常；8：强制删除中。

 一个App中允许重复订阅同一个App对象。不同App中允许重复订阅同一个App对象。取消一个订阅项不会影响其他订阅项。

 App对象删除时，系统会自动清除订阅项。

 订阅项名称规则：长度最多64个字符，不能为空，不支持空格，英文语言方面不支持除字母和下划线外的任何字符; 不支持数字开头。

 订阅App对象支持跨时空。

 
 param有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 cloudID 
 int32 
 区域ID 
 否 
 0 
 
 
 areaID 
 int32 
 数据区ID 
 否 
 本App所在数据区 
 
 
 type 
 int32 
 对象类型，21001 
 是 
 
 
 
 timeout 
 int32 
 超时时间ms 
 否 
 10000 
 
 
 callBackFuncName 
 string 
 回调函数名称 
 是 
 
 
 
 input有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 mode 
 int32 
 订阅模式，=1 
 是 
 
 
 
 identifierType 
 int32 
 对象的标识类型
1：ID，使用ID标识；
2：NAME，使用名称标识； 
 是 
 
 
 
 ids 
 uint64[] 
 App对象ID 
 二选一 
 
 
 
 names 
 string[] 
 App对象名称 
 二选一 
 
 
 
 spaceTimeIdentifierType 
 int32 
 时空对象的标识类型：
2：NAME，使用名称标识；
5：GUID，使用Guid标识 
 identifierType为name时必填 
 
 
 
 spaceTimeName 
 string 
 时空对象名称
值为空表示系统时空；
无该字段表示本时空； 
 否 
 本时空 
 
 
 spaceTimeGUID 
 string 
 时空对象GUID
值为空表示系统时空；
无该字段表示本时空； 
 否 
 本时空 
 
 
 subscribeName 
 string 
 订阅项名称 
本App内不能重复 
 是 
 
 
 
 pubConfig 
 stringMap<var> 
 订阅配置 
 否 
 
 
 
 pubConfig 有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 qos 
 int 
 质量等级， 
AT_MOST_ONCE(0)
AT_LEAST_ONCE(1)
 EXACTLY_ONCE(2) 
 否 
 1 
 
 
 cachePersist 
 bool 
 发布缓存是否持久化，默认false 
 否 
 false 
 
 
 cacheEvictPolicy 
 int 
 发布缓存淘汰策略： 
FIFO(0)：先进先出，
LIFO(1)：后进先出 
 否 
 0 
 
 
 cacheMaxSize 
 int 
 发布缓存最大条数 
 否 
 1000 
 
 
 timeout 
 int 
 发布存活超时时间ms 
 否 
 30000 
 
 
 cycle 
 int 
 发布周期ms
针对PUSH模式起作用 
 否 
 0 
 
 
 batchMaxSize 
 int 
 单次发布最大条数 
针对PUSH模式起作用 
 否 
 10 
 
 
 output有效参数： 

 
 
 
 名称 
 类型 
 说明 
 
 
 
 errorCodes 
 int32[] 
 错误码数组
与输入的ids或names一一对应 
 
 
 订阅回调callBack: 

 stringMap<var> callback，包含字段如下：

 
 
 
 名称 
 类型 
 说明 
 
 
 
 id 
 uint64 
 App对象ID 
 
 
 name 
 string 
 App对象名称 
 
 
 copyGUID 
 string 
 App对象对应的拷贝GUID 
 
 
 spaceTimeGUID 
 string 
 App对象所在时空信息 
 
 
 status 
 int32 
 运行状态 
 
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例： 

 // 订阅
stringMap<var> param;
stringMap<var> input;
stringMap<var> output;
uint64 appID = 6052837899185946746;
param.cloudID = 0;
param.areaID = 0;
param.type = (int32)Enum_App_MLType::APP;
string funcName = "callbackfunc";
param.callBackFuncName = funcName;
param.timeout = 10000;
input.mode = (int32)Enum_App_SubscribeMode::RUNSTATUS;
input.identifierType = (int32)Enum_App_IdentifierType::ID;
input.ids = {appID};
input.subscribeName = "订阅项1";
Result ret = Subscribe(param, input, output);
if(0 == ret.ret)
{
 Trace(2, "订阅App执行正常，output = ", output);
}
else
{
 Trace(2, "订阅App执行异常，ret = ", ret);
 Trace(2, "订阅App执行异常，output = ", output);
}

// 订阅回调函数：callbackfunc
// 回调函数名：callbackfunc，入参：stringMap<Var> callback
{
 uint64 id = callback.id;
 string name = callback.name;
 string copyGUID = callback.copyGUID;
 string spaceTimeGUID = callback.spaceTimeGUID;
 int32 status = callback.status;
 int32 run = (int32)Enum_App_Status::RUNNING_NORMAL;
 if(status == run)
 {
 Trace(2, "App运行正常", "");
 }
}
 

# 3.1.4.2. 订阅指定App对象报警事件

**Result Subscribe(stringMap\ param, stringMap\ input, stringMap\ &output);**
**onCallBack(stringMap\ callback)；**
**功能描述：**订阅指定App对象报警事件，只有App产生报警事件时会触发回调。
**注意事项：**
App运行过程产生报警的事件：App启动失败、App停止失败、App运行异常（OnCreate执行完成后，运行过程脚本异常或其他异常）、单次任务耗时超过阈值设置（阈值默认基于平均耗时m设置，[m+2*标准差，m-2*标准差]，下限一般忽略不会产生报警）。
订阅项名称规则：长度最多64个字符，不能为空，不支持空格，英文语言方面不支持除字母和下划线外的任何字符; 不支持数字开头。
**param有效参数：**
cloudID
int32
区域ID
否
0
areaID
int32
数据区ID
否
本App所在数据区
type
int32
对象类型，21001
是

timeout
int32
超时时间ms
否
10000
**input有效参数：**
mode
int32
订阅模式，=3
是

identifierType
int32
对象的标识类型：
1：ID，使用ID标识；
2：NAME，使用名称标识；
是

ids
uint64[]
App对象ID
二选一

names
string[]
App对象名称
二选一

spaceTimeGUID
string
时空对象GUID
值为空表示系统时空；
无该字段表示本时空；
否
本时空
subscribeName
string
订阅项名称
本App内不能重复
是

pubConfig
stringMap\ 
订阅配置
否

**pubConfig 有效参数：**
qos
int
质量等级， AT_MOST_ONCE(0) AT_LEAST_ONCE(1) EXACTLY_ONCE(2)
否
1
cachePersist
bool
发布缓存是否持久化，默认false
否
false
cacheEvictPolicy
int
发布缓存淘汰策略： FIFO(0)：先进先出， LIFO(1)：后进先出
否
0
cacheMaxSize
int
发布缓存最大条数
否
1000
timeout
int
发布存活超时时间ms
否
30000
cycle
int
发布周期ms 针对PUSH模式起作用
否
0
batchMaxSize
int
单次发布最大条数 针对PUSH模式起作用
否
10
**output有效参数：**
errorCodes
int32[]
错误码数组
与输入的ids或names一一对应
**订阅回调callBack:**
stringMap\ callback，包含字段如下：
id
uint64
App对象ID
name
string
App对象名称
copyGUID
string
App对象对应的拷贝GUID
spaceTimeGUID
string
App对象所在时空信息
eventType
int32
事件类型
1：App启动失败
2：App停止失败
3：App运行异常
4：单次任务耗时超过阈值设置
**错误码:**
参见《错误码_App引擎》
**脚本示例：**

#### 3.1.4.2. 订阅指定App对象报警事件

 Result Subscribe(stringMap<var> param, stringMap<var> input, stringMap<var> &output); 

 onCallBack(stringMap<var> callback)； 

 功能描述： 订阅指定App对象报警事件，只有App产生报警事件时会触发回调。

 注意事项： 

 
 App运行过程产生报警的事件：App启动失败、App停止失败、App运行异常（OnCreate执行完成后，运行过程脚本异常或其他异常）、单次任务耗时超过阈值设置（阈值默认基于平均耗时m设置，[m+2 标准差，m-2 标准差]，下限一般忽略不会产生报警）。

 订阅项名称规则：长度最多64个字符，不能为空，不支持空格，英文语言方面不支持除字母和下划线外的任何字符; 不支持数字开头。

 
 param有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 cloudID 
 int32 
 区域ID 
 否 
 0 
 
 
 areaID 
 int32 
 数据区ID 
 否 
 本App所在数据区 
 
 
 type 
 int32 
 对象类型，21001 
 是 
 
 
 
 timeout 
 int32 
 超时时间ms 
 否 
 10000 
 
 
 input有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 mode 
 int32 
 订阅模式，=3 
 是 
 
 
 
 identifierType 
 int32 
 对象的标识类型：
1：ID，使用ID标识；
2：NAME，使用名称标识； 
 是 
 
 
 
 ids 
 uint64[] 
 App对象ID 
 二选一 
 
 
 
 names 
 string[] 
 App对象名称 
 二选一 
 
 
 
 spaceTimeGUID 
 string 
 时空对象GUID
值为空表示系统时空；
无该字段表示本时空； 
 否 
 本时空 
 
 
 subscribeName 
 string 
 订阅项名称
本App内不能重复 
 是 
 
 
 
 pubConfig 
 stringMap<var> 
 订阅配置 
 否 
 
 
 
 pubConfig 有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 qos 
 int 
 质量等级， AT_MOST_ONCE(0) AT_LEAST_ONCE(1) EXACTLY_ONCE(2) 
 否 
 1 
 
 
 cachePersist 
 bool 
 发布缓存是否持久化，默认false 
 否 
 false 
 
 
 cacheEvictPolicy 
 int 
 发布缓存淘汰策略： FIFO(0)：先进先出， LIFO(1)：后进先出 
 否 
 0 
 
 
 cacheMaxSize 
 int 
 发布缓存最大条数 
 否 
 1000 
 
 
 timeout 
 int 
 发布存活超时时间ms 
 否 
 30000 
 
 
 cycle 
 int 
 发布周期ms 针对PUSH模式起作用 
 否 
 0 
 
 
 batchMaxSize 
 int 
 单次发布最大条数 针对PUSH模式起作用 
 否 
 10 
 
 
 output有效参数： 

 
 
 
 名称 
 类型 
 说明 
 
 
 
 errorCodes 
 int32[] 
 错误码数组
与输入的ids或names一一对应 
 
 
 订阅回调callBack: 

 stringMap<var> callback，包含字段如下：

 
 
 
 名称 
 类型 
 说明 
 
 
 
 id 
 uint64 
 App对象ID 
 
 
 name 
 string 
 App对象名称 
 
 
 copyGUID 
 string 
 App对象对应的拷贝GUID 
 
 
 spaceTimeGUID 
 string 
 App对象所在时空信息 
 
 
 eventType 
 int32 
 事件类型
1：App启动失败
2：App停止失败
3：App运行异常
4：单次任务耗时超过阈值设置 
 
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例： 

 
 

# 3.1.4.3. 取消订阅

**Result Unsubscribe(stringMap\ param, stringMap\ input,stringMap\ &output);**
**功能描述：**取消订阅。
**注意事项：**
支持在业务脚本中取消订阅，无需在onDestroy中写脚本取消订阅，在删除App对象时系统会自动取消订阅，在onDestroy中再写脚本取消订阅会报失败。
**param有效参数：**
type
int32
对象类型，21001
是

timeout
int32
超时时间ms
否
10000
**input有效参数：**
subscribeNames
string[]
订阅项名称，只能取消本App中的订阅项
是

**output有效参数：**
errorCodes
int32[]
错误码数组
与输入的subscribeNames一一对应
**错误码:**
参见《错误码_App引擎》
**脚本示例：**
stringMap param;
stringMap input;
stringMap output;
param.type = (int32)Enum_App_MLType::APP;
input.subscribeNames = {"订阅项1"};
Result ret = Unsubscribe(param, input, output);
if(0 == ret.ret)
{
 Trace(2, "取消订阅执行正常，output = ", output);
}
else
{
 Trace(2, "取消订阅App执行异常，ret = ", ret);
 Trace(2, "取消订阅App执行异常，output = ", output);
}

#### 3.1.4.3. 取消订阅

 Result Unsubscribe(stringMap<var> param, stringMap<var> input,stringMap<var> &output); 

 功能描述： 取消订阅。

 注意事项： 

 
 支持在业务脚本中取消订阅，无需在onDestroy中写脚本取消订阅，在删除App对象时系统会自动取消订阅，在onDestroy中再写脚本取消订阅会报失败。

 
 param有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 type 
 int32 
 对象类型，21001 
 是 
 
 
 
 timeout 
 int32 
 超时时间ms 
 否 
 10000 
 
 
 input有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 subscribeNames 
 string[] 
 订阅项名称，只能取消本App中的订阅项 
 是 
 
 
 
 output有效参数： 

 
 
 
 名称 
 类型 
 说明 
 
 
 
 errorCodes 
 int32[] 
 错误码数组
与输入的subscribeNames一一对应 
 
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例： 

 stringMap<var> param;
stringMap<var> input;
stringMap<var> output;
param.type = (int32)Enum_App_MLType::APP;
input.subscribeNames = {"订阅项1"};
Result ret = Unsubscribe(param, input, output);
if(0 == ret.ret)
{
 Trace(2, "取消订阅执行正常，output = ", output);
}
else
{
 Trace(2, "取消订阅App执行异常，ret = ", ret);
 Trace(2, "取消订阅App执行异常，output = ", output);
}
 

# 3.1.5. 自定义功能调用

### 3.1.5. 自定义功能调用

# 3.1.5.1. 同步调用本App的自定义功能

var FuncName(var param,...);
**功能描述：**同步调用本App运行对象的自定义功能。
**注意事项：**
同步调用，一直等待调用执行完成并返回结果，后续函数不会执行。
嵌套同步调用最多支持16层。
不支持循环调用，如：自定义功能A调用自定义功能A 。
**输入参数说明:**
funcName
string
被调用的功能名称
param
var
被调用功能的输入参数（最多16个输入参数），个数不固定，输入参数个数和类型要和被调功能的输入参数设置保持一致，如果，被调功能的输入参数为空，则param参数的个数也要为0。
**返回值:**
var
被调用功能如果有返回值，将返回值返回给调用脚本。
**脚本示例：**
int32 param1 = 10;
JSONObject param2 = {"name": "test", "class": "three"};
int32 returnValue1 = Func2(param1, param2);
Trace(2, "returnValue1=", returnValue1); //returnValue1=10

// 被调用功能函数：Func2
// 功能函数名Func2，入参：int32 param1,JSONObject param2，返回值类型：int32
{
 string key1 = param2.name;
 return 10;
}

#### 3.1.5.1. 同步调用本App的自定义功能

 var FuncName(var param,...);

 功能描述： 同步调用本App运行对象的自定义功能。

 注意事项： 

 
 同步调用，一直等待调用执行完成并返回结果，后续函数不会执行。

 嵌套同步调用最多支持16层。

 不支持循环调用，如：自定义功能A调用自定义功能A 。

 
 输入参数说明: 

 
 
 
 名称 
 类型 
 说明 
 
 
 
 funcName 
 string 
 被调用的功能名称 
 
 
 param 
 var 
 被调用功能的输入参数（最多16个输入参数），个数不固定，输入参数个数和类型要和被调功能的输入参数设置保持一致，如果，被调功能的输入参数为空，则param参数的个数也要为0。 
 
 
 返回值: 

 
 
 
 返回值 
 说明 
 
 
 
 var 
 被调用功能如果有返回值，将返回值返回给调用脚本。 
 
 
 脚本示例： 

 int32 param1 = 10;
JSONObject param2 = {"name": "test", "class": "three"};
int32 returnValue1 = Func2(param1, param2);
Trace(2, "returnValue1=", returnValue1); //returnValue1=10

// 被调用功能函数：Func2
// 功能函数名Func2，入参：int32 param1,JSONObject param2，返回值类型：int32
{
 string key1 = param2.name;
 return 10;
}
 

# 3.1.6. 接口函数调用

### 3.1.6. 接口函数调用

# 3.1.6.1. 同步调用App接口函数

**Result Call(stringMap\ param, stringMap\ input, stringMap\ &output);**
**功能描述：**同步调用App对象的接口函数。
**注意事项：**
被调用的接口函数入参暂不支持struct类型。
同步调用，一直等待调用执行完成并返回结果，后续函数不会执行。
不允许跨时空调用。本地调用时，只能调用同一时空内的App；远程调用时，只能调用其远程访问时空列表内的App。
两个App对象之间可以相互调用不同的接口函数，但不允许形成环形调用。
用户权限说明：App之间接口调用时，接口函数中执行脚本使用调用方App的用户权限（包括业务、安全、审计、运维）。前端App调用后台App1（如WebJSApp调用后台元语言App），使用前端App用户权限；如果后台App1继续调用后台App2的情况，则使用后台App1的用户权限。
**param有效参数：**
cloudID
int32
区域ID
否
0
areaID
int32
数据区ID
否
本App所在数据区
timeout
int32
超时时间ms
否
10000
**input有效参数：** 
identifierType
int32
对象的标识类型：
1：ID，使用ID标识
2：NAME，使用名称标识
是

name
string
被调用App对象名称
二选一

id
string
被调用App对象ID
二选一

funcName
string
被调用的函数名称
是

params
var[]
被调用函数的输入参数：
最多16个输入参数，个数不固定，输入参数个数和类型要和被调功能的输入参数设置保持一致，如果，被调功能的输入参数为空，则params参数的个数也要为0。
是

**output有效参数：**
returnData
var
被调用函数的返回值
如果被调用的App对象funcName接口没有调通或没有rerurn,则不返returnData字段，脚本解析时要先判断函数是否执行成功，成功后再解析output中的returnData字段
errorCodes
int32[]
错误码数组
只返回一个错误码，数组长度为1
**错误码:**
参见《错误码_App引擎》
**脚本示例：**
stringMap param;
stringMap input;
stringMap output;
uint64 appID = 6052837899185946746;
param.cloudID = 0;
param.areaID = 0;
param.timeout = 10000;
input.identifierType = (int32)Enum_App_IdentifierType::ID;
input.id = appID;
string funcName = "func1";
input.funcName = funcName;
var[] params = {appID, "App名称"};
input.params = params;
Result ret = Call(param, input, output);
if(0 == ret.ret)
{
 Trace(2, "同步调用App执行正常，output = ", output);
 bool isExist = output.containsKey("returnData");
 if(true == isExist)
 {
 stringMap returnData = output.returnData;
 } 
}
else
{
 Trace(2, "同步调用App执行异常，ret = ", ret);
 Trace(2, "同步调用App执行异常，output = ", output);
}

// 被调用接口函数：func1
// 接口函数名func1，入参：uint64 id,string name，返回值类型：stringMap 
{
 stringMap map;
 map.id = id;
 map.name = name;
 return map;
}

#### 3.1.6.1. 同步调用App接口函数

 Result Call(stringMap<var> param, stringMap<var> input, stringMap<var> &output); 

 功能描述： 同步调用App对象的接口函数。

 注意事项： 

 
 被调用的接口函数入参暂不支持struct类型。

 同步调用，一直等待调用执行完成并返回结果，后续函数不会执行。

 不允许跨时空调用。本地调用时，只能调用同一时空内的App；远程调用时，只能调用其远程访问时空列表内的App。

 两个App对象之间可以相互调用不同的接口函数，但不允许形成环形调用。

 用户权限说明：App之间接口调用时，接口函数中执行脚本使用调用方App的用户权限（包括业务、安全、审计、运维）。前端App调用后台App1（如WebJSApp调用后台元语言App），使用前端App用户权限；如果后台App1继续调用后台App2的情况，则使用后台App1的用户权限。

 
 param有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 cloudID 
 int32 
 区域ID 
 否 
 0 
 
 
 areaID 
 int32 
 数据区ID 
 否 
 本App所在数据区 
 
 
 timeout 
 int32 
 超时时间ms 
 否 
 10000 
 
 
 input有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 identifierType 
 int32 
 对象的标识类型：
1：ID，使用ID标识
2：NAME，使用名称标识 
 是 
 
 
 
 name 
 string 
 被调用App对象名称 
 二选一 
 
 
 
 id 
 string 
 被调用App对象ID 
 二选一 
 
 
 
 funcName 
 string 
 被调用的函数名称 
 是 
 
 
 
 params 
 var[] 
 被调用函数的输入参数：
最多16个输入参数，个数不固定，输入参数个数和类型要和被调功能的输入参数设置保持一致，如果，被调功能的输入参数为空，则params参数的个数也要为0。 
 是 
 
 
 
 output有效参数： 

 
 
 
 名称 
 类型 
 说明 
 
 
 
 returnData 
 var 
 被调用函数的返回值
如果被调用的App对象funcName接口没有调通或没有rerurn,则不返returnData字段，脚本解析时要先判断函数是否执行成功，成功后再解析output中的returnData字段 
 
 
 errorCodes 
 int32[] 
 错误码数组
只返回一个错误码，数组长度为1 
 
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例： 

 stringMap<var> param;
stringMap<var> input;
stringMap<var> output;
uint64 appID = 6052837899185946746;
param.cloudID = 0;
param.areaID = 0;
param.timeout = 10000;
input.identifierType = (int32)Enum_App_IdentifierType::ID;
input.id = appID;
string funcName = "func1";
input.funcName = funcName;
var[] params = {appID, "App名称"};
input.params = params;
Result ret = Call(param, input, output);
if(0 == ret.ret)
{
 Trace(2, "同步调用App执行正常，output = ", output);
 bool isExist = output.containsKey("returnData");
 if(true == isExist)
 {
 stringMap<var> returnData = output.returnData;
 } 
}
else
{
 Trace(2, "同步调用App执行异常，ret = ", ret);
 Trace(2, "同步调用App执行异常，output = ", output);
}

// 被调用接口函数：func1
// 接口函数名func1，入参：uint64 id,string name，返回值类型：stringMap<var>
{
 stringMap<var> map;
 map.id = id;
 map.name = name;
 return map;
}
 

# 3.1.6.2. 异步调用App接口函数

**Result AsyncCall(stringMap\ param, stringMap\ input, stringMap\ &output);**
**callBackFunc(stringMap\ callback);**
**功能描述：**异步调用App对象的接口函数。
**注意事项：**
被调用的接口函数入参暂不支持struct类型。
异步调用，不等待调用执行结果返回，被调用的接口函数脚本执行完成时，将调用结果返回给回调功能，并触发回调功能的执行。调用结果未返回时后续函数也会执行。
异步AsyncCall允许调用本App的自定义函数。
不允许跨时空调用。在本地调用时，限制只能调用同一时空内的App对象。远程调用时，只能调用本App远程访问时空内的App对象。
两个App对象之间可以相互调用不同的接口函数，但不允许形成环形调用。
不支持的场景：客户端上，不支持App对象之间接口调用。相同语言类型或不同语言类型的App之间都不支持接口调用。
用户权限说明：App之间接口调用时，接口函数中执行脚本使用调用方App的用户权限（包括业务、安全、审计、运维）。前端App调用后台App1（如WebJSApp调用后台元语言App），使用前端App用户权限；如果后台App1继续调用后台App2的情况，则使用后台App1的用户权限。
**param有效参数：**
cloudID
int32
区域ID
否
0
areaID
int32
数据区ID
否
本App所在数据区
timeout
int32
超时时间ms
否
10000
callBackFuncName
string
回调名称
是

**input有效参数：**
identifierType
int32
对象的标识类型：
1：ID，使用ID标识
2：NAME，使用名称标识
是

name
string
被调用App对象名称
二选一

id
uint64
被调用App对象ID
二选一

funcName
string
被调用的函数名称
是

params
var[]
被调用函数的输入参数:
最多16个输入参数，个数不固定，输入参数个数和类型要和被调功能的输入参数设置保持一致，如果，被调功能的输入参数为空，则params参数的个数也要为0。
是

limit
int32
每批返回的最大条数，可省；省略或为0表示一次全部返回
否

**output有效参数：**
errorCodes
int32[]
错误码数组
只返回一个错误码，数组长度为1
**异步回调callBack:**
stringMap\ callback，包含字段如下：
errorCodes
int32[]
错误码
num
int32
本次为第几批
returnData
var
返回数据
1）returnData如果是数组类型，分批返回按数组个数分批；转成dataset返回，列名为returnValue(这块后期需要修改，不需要转dataset);
2）returnData如果是dataset类型，分批返回按dataset条数分批；
3）returnData如果不是数组和dataset，则看做一条数据，一次返回；
4）异步返回数据发生错误时，不返num、returnData和remaining字段，需要解析时判断字段是否存在。
remaining
int32
剩余条数
**错误码:**
参见《错误码_App引擎》
**脚本示例：**
stringMap param;
stringMap input;
stringMap output;
uint64 appID = 6052837899185946746;
param.cloudID = 0;
param.areaID = 0;
param.callbackfuncName = "callbackfunc";
param.timeout = 10000;
input.identifierType = (int32)Enum_App_IdentifierType::ID;
input.id = appID;
string funcName = "func1";
input.funcName = funcName;
var[] params = {appID, "App名称"};
input.params = params;
Result ret = AsyncCall(param, input, output);
if(0 == ret.ret)
{
 Trace(2, "异步调用App执行正常，output = ", output); 
}
else
{
 Trace(2, "异步调用App执行异常，ret = ", ret);
 Trace(2, "异步调用App执行异常，output = ", output);
}

// 被调用接口函数：func1
// 接口函数名func1，入参：uint64 id,string name，返回值类型：stringMap 
{
 stringMap map;
 map.id = id;
 map.name = name;
 return map;
}

// 异步调用回调函数：callbackfunc
// 回调函数名：callbackfunc，入参：stringMap callback
{
 int32 errorCode = callback.errorCode;
 bool isExist = callback.containsKey("returnData");
 if(true == isExist)
 {
 int32 num = callback.num;
 stringMap returnData = callback.returnData;
 int32 remaining = callback.remaining;
 } 
}

#### 3.1.6.2. 异步调用App接口函数

 Result AsyncCall(stringMap<var> param, stringMap<var> input, stringMap<var> &output); 

 callBackFunc(stringMap<var> callback); 

 功能描述： 异步调用App对象的接口函数。

 注意事项： 

 
 被调用的接口函数入参暂不支持struct类型。

 异步调用，不等待调用执行结果返回，被调用的接口函数脚本执行完成时，将调用结果返回给回调功能，并触发回调功能的执行。调用结果未返回时后续函数也会执行。

 异步AsyncCall允许调用本App的自定义函数。

 不允许跨时空调用。在本地调用时，限制只能调用同一时空内的App对象。远程调用时，只能调用本App远程访问时空内的App对象。

 两个App对象之间可以相互调用不同的接口函数，但不允许形成环形调用。

 不支持的场景：客户端上，不支持App对象之间接口调用。相同语言类型或不同语言类型的App之间都不支持接口调用。

 用户权限说明：App之间接口调用时，接口函数中执行脚本使用调用方App的用户权限（包括业务、安全、审计、运维）。前端App调用后台App1（如WebJSApp调用后台元语言App），使用前端App用户权限；如果后台App1继续调用后台App2的情况，则使用后台App1的用户权限。

 
 param有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 cloudID 
 int32 
 区域ID 
 否 
 0 
 
 
 areaID 
 int32 
 数据区ID 
 否 
 本App所在数据区 
 
 
 timeout 
 int32 
 超时时间ms 
 否 
 10000 
 
 
 callBackFuncName 
 string 
 回调名称 
 是 
 
 
 
 input有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 identifierType 
 int32 
 对象的标识类型：
1：ID，使用ID标识
2：NAME，使用名称标识 
 是 
 
 
 
 name 
 string 
 被调用App对象名称 
 二选一 
 
 
 
 id 
 uint64 
 被调用App对象ID 
 二选一 
 
 
 
 funcName 
 string 
 被调用的函数名称 
 是 
 
 
 
 params 
 var[] 
 被调用函数的输入参数:
最多16个输入参数，个数不固定，输入参数个数和类型要和被调功能的输入参数设置保持一致，如果，被调功能的输入参数为空，则params参数的个数也要为0。 
 是 
 
 
 
 limit 
 int32 
 每批返回的最大条数，可省；省略或为0表示一次全部返回 
 否 
 
 
 
 output有效参数： 

 
 
 
 名称 
 类型 
 说明 
 
 
 
 errorCodes 
 int32[] 
 错误码数组
只返回一个错误码，数组长度为1 
 
 
 异步回调callBack: 

 stringMap<var> callback，包含字段如下：

 
 
 
 名称 
 类型 
 说明 
 
 
 
 errorCodes 
 int32[] 
 错误码 
 
 
 num 
 int32 
 本次为第几批 
 
 
 returnData 
 var 
 返回数据
1）returnData如果是数组类型，分批返回按数组个数分批；转成dataset返回，列名为returnValue(这块后期需要修改，不需要转dataset);
2）returnData如果是dataset类型，分批返回按dataset条数分批；
3）returnData如果不是数组和dataset，则看做一条数据，一次返回；
4）异步返回数据发生错误时，不返num、returnData和remaining字段，需要解析时判断字段是否存在。 
 
 
 remaining 
 int32 
 剩余条数 
 
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例： 

 stringMap<var> param;
stringMap<var> input;
stringMap<var> output;
uint64 appID = 6052837899185946746;
param.cloudID = 0;
param.areaID = 0;
param.callbackfuncName = "callbackfunc";
param.timeout = 10000;
input.identifierType = (int32)Enum_App_IdentifierType::ID;
input.id = appID;
string funcName = "func1";
input.funcName = funcName;
var[] params = {appID, "App名称"};
input.params = params;
Result ret = AsyncCall(param, input, output);
if(0 == ret.ret)
{
 Trace(2, "异步调用App执行正常，output = ", output); 
}
else
{
 Trace(2, "异步调用App执行异常，ret = ", ret);
 Trace(2, "异步调用App执行异常，output = ", output);
}

// 被调用接口函数：func1
// 接口函数名func1，入参：uint64 id,string name，返回值类型：stringMap<var>
{
 stringMap<var> map;
 map.id = id;
 map.name = name;
 return map;
}

// 异步调用回调函数：callbackfunc
// 回调函数名：callbackfunc，入参：stringMap<Var> callback
{
 int32 errorCode = callback.errorCode;
 bool isExist = callback.containsKey("returnData");
 if(true == isExist)
 {
 int32 num = callback.num;
 stringMap<var> returnData = callback.returnData;
 int32 remaining = callback.remaining;
 } 
}
 

# 3.1.7. 异常消息接收

App内置onException(stringMap\ message)函数，在运行异常时触发，接收脚本异常信息。
**注意事项：**
App在执行onCreate主业务脚本时发生异常，触发onException，此时系统会自动将App删除。
App在执行定时回调、订阅回调时发生异常，触发onException，此时系统不会自动将App删除。
接口调用，被调App自定义功能执行异常，触发onException，此时系统不会自动将App删除。
**message内部字段：**
errorType
int8
异常码
description
string
异常描述
funcName
string
异常发生的功能函数名称
**异常码详细信息：**
-1
默认异常（出现后台故障导致的异常）
-2
JsonObject访问异常
-3
JsonArray访问异常
-4
JsonValue访问异常
-5
数组越界
-6
map迭代器越界
-7
var类型不匹配
-8
DataSet访问异常（访问不存在的行、列、单元格）
-9
DataSet参数类型不匹配
-10
递归调用异常
-11
数组类型不匹配
-12
任务内存溢出

### 3.1.7. 异常消息接收

 App内置onException(stringMap<var> message)函数，在运行异常时触发，接收脚本异常信息。

 注意事项： 

 
 App在执行onCreate主业务脚本时发生异常，触发onException，此时系统会自动将App删除。

 App在执行定时回调、订阅回调时发生异常，触发onException，此时系统不会自动将App删除。

 接口调用，被调App自定义功能执行异常，触发onException，此时系统不会自动将App删除。

 
 message内部字段： 

 
 
 
 名称 
 类型 
 说明 
 
 
 
 errorType 
 int8 
 异常码 
 
 
 description 
 string 
 异常描述 
 
 
 funcName 
 string 
 异常发生的功能函数名称 
 
 
 异常码详细信息： 

 
 
 
 异常码 
 说明 
 
 
 
 -1 
 默认异常（出现后台故障导致的异常） 
 
 
 -2 
 JsonObject访问异常 
 
 
 -3 
 JsonArray访问异常 
 
 
 -4 
 JsonValue访问异常 
 
 
 -5 
 数组越界 
 
 
 -6 
 map迭代器越界 
 
 
 -7 
 var类型不匹配 
 
 
 -8 
 DataSet访问异常（访问不存在的行、列、单元格） 
 
 
 -9 
 DataSet参数类型不匹配 
 
 
 -10 
 递归调用异常 
 
 
 -11 
 数组类型不匹配 
 
 
 -12 
 任务内存溢出 
 
 

# 3.1.8. 本App方法

### 3.1.8. 本App方法

# 3.1.8.1. 获取本App运行区域ID

**int32 >getLocalCloudID();**
**功能描述：**获取本App运行区域ID，实际区域ID或端区域ID；
**参数：**无
**返回值：**int32 App运行区域ID； 不存在返回-1
**脚本示例：**
int32 cloudID = getLocalCloudID();

#### 3.1.8.1. 获取本App运行区域ID

 int32 >getLocalCloudID(); 

 功能描述： 获取本App运行区域ID，实际区域ID或端区域ID；

 参数： 无

 返回值： int32 App运行区域ID； 不存在返回-1

 脚本示例： 

 int32 cloudID = getLocalCloudID();
 

# 3.1.8.2. 获取本App当前所有用户登录信息

**stringMap\ [] >getAlluserList();**
**功能描述：**获取本App当前所有登录成功的用户信息。
**参数：**无
对于子App：
​ 在没有配置用户列表的情况下，继承父App的用户信息；
​ 子App中配置了用户列表，同类型的用户覆盖，不同类型的用户继承父App的用户信息；
​ 运行过程中某时刻父App中动态登录的用户，子App中可以动态继承到最新登录的用户信息。
**返回值：**stringMap\ [] App当前登录信息 ； 不存在返回空数组。
**脚本示例：**
stringMap [] userListInfo = getAlluserList();
for(int32 i = 1; i user1 = userListInfo[i];
 Trace(2, "user = ", user1);
}

/*
 返回值：stringMap [] App当前登录用户信息
 {
 string ip; // ip
 int32 port; // 端口
 int32 terminalID; // 端ID（如果WOS没有IP时返回）
 int32 userType; // 用户类型
 string userName; // 用户名
 }
*/

#### 3.1.8.2. 获取本App当前所有用户登录信息

 stringMap<var>[] >getAlluserList(); 

 功能描述： 获取本App当前所有登录成功的用户信息。

 参数： 无

 对于子App：

 ​ 在没有配置用户列表的情况下，继承父App的用户信息；

 ​ 子App中配置了用户列表，同类型的用户覆盖，不同类型的用户继承父App的用户信息；

 ​ 运行过程中某时刻父App中动态登录的用户，子App中可以动态继承到最新登录的用户信息。

 返回值： stringMap<var>[] App当前登录信息 ； 不存在返回空数组。

 脚本示例： 

 stringMap<var>[] userListInfo = getAlluserList();
for(int32 i = 1; i <= userListInfo.length; i++)
{
 stringMap<var> user1 = userListInfo[i];
 Trace(2, "user = ", user1);
}

/*
 返回值：stringMap<var>[] App当前登录用户信息
 {
 string ip; // ip
 int32 port; // 端口
 int32 terminalID; // 端ID（如果WOS没有IP时返回）
 int32 userType; // 用户类型
 string userName; // 用户名
 }
*/
 

# 3.1.8.3. 获取本App指定参数值

**var >getParam(string paramName);**
**功能描述：**获取本App的指定参数值（属性、成员值），属性需要加$符；
**参数：**
paramName
string
参数名称（属性、成员）
**返回值：**var 参数值，属性、成员不存在时抛异常；
**脚本示例：**
string name = getParam("$name");

#### 3.1.8.3. 获取本App指定参数值

 var >getParam(string paramName); 

 功能描述： 获取本App的指定参数值（属性、成员值），属性需要加$符；

 参数： 

 
 
 
 名称 
 类型 
 说明 
 
 
 
 paramName 
 string 
 参数名称（属性、成员） 
 
 
 返回值： var 参数值，属性、成员不存在时抛异常；

 脚本示例： 

 string name = getParam("$name");
 

# 3.1.8.4. 获取本App远程访问时空列表

**stringMap\ [] >getAccessSpaceTimeList();**
**功能描述：**获取本App的远程访问时空列表；
**参数：**无
**返回值：**stringMap\ [] 远程访问时空列表，不存在返回空数组；
**脚本示例：**

#### 3.1.8.4. 获取本App远程访问时空列表

 stringMap<var>[] >getAccessSpaceTimeList(); 

 功能描述： 获取本App的远程访问时空列表；

 参数： 无

 返回值： stringMap<var>[] 远程访问时空列表，不存在返回空数组；

 脚本示例： 

 
 

# 3.1.8.5. 修改本App远程访问时空列表

**int32 >setAccessSpaceTimeList(stringMap\ [] accessSpaceTimeList);**
**功能描述：**修改本App的远程访问时空列表；
**参数：**stringMap\ [] accessSpaceTimeList 远程访问时空列表；
**参数：**
accessSpaceTimeList
stringMap\ []
远程访问时空列表
**返回值：**int32 错误码，成功返回0，失败返回对应错误码；
**脚本示例：**

#### 3.1.8.5. 修改本App远程访问时空列表

 int32 >setAccessSpaceTimeList(stringMap<var>[] accessSpaceTimeList); 

 功能描述： 修改本App的远程访问时空列表；

 参数： stringMap<var>[] accessSpaceTimeList 远程访问时空列表；

 参数： 

 
 
 
 名称 
 类型 
 说明 
 
 
 
 accessSpaceTimeList 
 stringMap<var>[] 
 远程访问时空列表 
 
 
 返回值： int32 错误码，成功返回0，失败返回对应错误码；

 脚本示例： 

 
 

# 3.2. 定时器

## 3.2. 定时器

# 3.2.1. 发起本App的定时调用

**Result TimerCall(stringMap\ param, stringMap\ input, stringMap\ &output);**
**功能描述：**发起本App的定时调用。
**注意事项：**
callBackFuncName只能是本App的自定义功能。
callBackFuncName回调功能无输入参数。
callBackFuncName回调功能无返回值。
repeat参数为0时，无限次调用CallbackFunction功能。
如果repeat不等于0，定时调用次数超过了repeat设置的次数之后，该定时器会自动被清除，定时器名称失效。
定时器如果太多，会影响精度，1个App最多发起32个定时调用。
1个进程内，建议定时器个数不要超过512，否则会影响精度。
功能A定时回调功能A，会形成循环调用，不允许这样使用。
A定时回调功能B，B又定时回调A，容易让CPU资源一直被占用，不限制用户这样使用，但是也不建议用户这样使用。
**param有效参数：**
callBackFuncName
string
定时调用函数名称
是

timeout
int32
超时时间ms
否
10000
**input有效参数：**
name
string
定时器名称
本App内不能重复
是

delay
uint64
延迟启动时间ms
兼容之前的int32类型
否
0
period
uint64
定时周期ms
兼容之前的int32类型
是

repeat
uint64
重复周期调用的次数
兼容之前的int32类型
是

**output有效参数：**
无

**错误码:**
参见《错误码_App引擎》
**脚本示例：**
stringmap param;
stringmap input;
stringmap output;
Result code;
string callBackFuncName = "TimerCallBack";
int32 timeout = 10000;
string timerName = "Timer1";
param.callBackFuncName = callBackFuncName;
param.timeout = timeout;
input.name = timerName;
input.delay = 500;
input.period = 10000;
input.repeat = 10;
code = TimerCall(param, input, output);
if(0 == code.ret) 
{
 Trace(2, "发起本App的定时调用执行 =", "success");
} 
else 
{
 Trace(2, "发起本App的定时调用执行 =", "fail");
 Trace(2, "发起本App的定时调用---执行结果code.ret =", code.ret);
}

### 3.2.1. 发起本App的定时调用

 Result TimerCall(stringMap<var> param, stringMap<var> input, stringMap<var> &output); 

 功能描述： 发起本App的定时调用。

 注意事项： 

 
 callBackFuncName只能是本App的自定义功能。

 callBackFuncName回调功能无输入参数。

 callBackFuncName回调功能无返回值。

 repeat参数为0时，无限次调用CallbackFunction功能。

 如果repeat不等于0，定时调用次数超过了repeat设置的次数之后，该定时器会自动被清除，定时器名称失效。

 定时器如果太多，会影响精度，1个App最多发起32个定时调用。

 1个进程内，建议定时器个数不要超过512，否则会影响精度。

 功能A定时回调功能A，会形成循环调用，不允许这样使用。

 A定时回调功能B，B又定时回调A，容易让CPU资源一直被占用，不限制用户这样使用，但是也不建议用户这样使用。

 
 param有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 callBackFuncName 
 string 
 定时调用函数名称 
 是 
 
 
 
 timeout 
 int32 
 超时时间ms 
 否 
 10000 
 
 
 input有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 name 
 string 
 定时器名称
本App内不能重复 
 是 
 
 
 
 delay 
 uint64 
 延迟启动时间ms
兼容之前的int32类型 
 否 
 0 
 
 
 period 
 uint64 
 定时周期ms
兼容之前的int32类型 
 是 
 
 
 
 repeat 
 uint64 
 重复周期调用的次数
兼容之前的int32类型 
 是 
 
 
 
 output有效参数： 

 
 
 
 名称 
 类型 
 说明 
 
 
 
 无 
 
 
 
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例： 

 stringmap<var> param;
stringmap<var> input;
stringmap<var> output;
Result code;
string callBackFuncName = "TimerCallBack";
int32 timeout = 10000;
string timerName = "Timer1";
param.callBackFuncName = callBackFuncName;
param.timeout = timeout;
input.name = timerName;
input.delay = 500;
input.period = 10000;
input.repeat = 10;
code = TimerCall(param, input, output);
if(0 == code.ret) 
{
 Trace(2, "发起本App的定时调用执行 =", "success");
} 
else 
{
 Trace(2, "发起本App的定时调用执行 =", "fail");
 Trace(2, "发起本App的定时调用---执行结果code.ret =", code.ret);
}
 

# 3.2.2. 取消本App的定时调用

**Result DelTimer(stringMap\ param, stringMap\ input, stringMap\ &output);**
**功能描述：**取消本App的定时调用。
**注意事项：**
当创建定时器所指定的repeat不等于0，定时调用次数超过了repeat设置的次数时，该定时器 会自动被删除，定时器句柄ID失效，再按该ID调删除定时器函数,找不到定时器，返回失败。
在onDestroy里调用取消定时调用函数，会返回失败，因为App引擎在执行onDestroy之前删除了所有的定时器。
**param有效参数：**
timeout
int32
超时时间ms
否
10000
**input有效参数：**
name
string
定时器名称
是

**错误码:**
参见《错误码_App引擎》
**脚本示例：**
stringMap param;
stringMap input;
stringMap output;
Result code; 
int32 timeout = 10000;
string timerName = "Timer1";
param.timeout = timeout;
input.name = timerName;
code = DelTimer(param, input, output);
if(0 == code.ret) 
{
 Trace(2, "取消本App的定时调用执行 =", "success");
}
else
{
 Trace(2, "取消本App的定时调用执行 =", "fail"); 
 Trace(2, "取消本App的定时调用--执行结果code.ret =", code.ret);
}

### 3.2.2. 取消本App的定时调用

 Result DelTimer(stringMap<var> param, stringMap<var> input, stringMap<var> &output); 

 功能描述： 取消本App的定时调用。

 注意事项： 

 
 当创建定时器所指定的repeat不等于0，定时调用次数超过了repeat设置的次数时，该定时器 会自动被删除，定时器句柄ID失效，再按该ID调删除定时器函数,找不到定时器，返回失败。

 在onDestroy里调用取消定时调用函数，会返回失败，因为App引擎在执行onDestroy之前删除了所有的定时器。

 
 param有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 timeout 
 int32 
 超时时间ms 
 否 
 10000 
 
 
 input有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 name 
 string 
 定时器名称 
 是 
 
 
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例： 

 stringMap<var> param;
stringMap<var> input;
stringMap<var> output;
Result code; 
int32 timeout = 10000;
string timerName = "Timer1";
param.timeout = timeout;
input.name = timerName;
code = DelTimer(param, input, output);
if(0 == code.ret) 
{
 Trace(2, "取消本App的定时调用执行 =", "success");
}
else
{
 Trace(2, "取消本App的定时调用执行 =", "fail"); 
 Trace(2, "取消本App的定时调用--执行结果code.ret =", code.ret);
}
 

# 3.2.3. 查询进入回调的定时器

**string >getTimerName();**
**功能描述：**查询进入定时器回调中的定时器名称；
**返回值：**string类型，错误时返回空；
string timerName = "";
timerName = getTimerName();
Trace(2, "进入回调的定时器名称 =", timerName);

### 3.2.3. 查询进入回调的定时器

 string >getTimerName(); 

 功能描述： 查询进入定时器回调中的定时器名称；

 返回值： string类型，错误时返回空；

 string timerName = "";
timerName = getTimerName();
Trace(2, "进入回调的定时器名称 =", timerName);
 

# 3.3. 事务

## 3.3. 事务

# 3.3.1. 开启事务

**Result BeginTransaction(stringMap\ param, stringMap\ input,stringMap\ &output);**
**功能描述：**开启事务。开启了事务之后，就可以执行若干对后台库的操作函数，这些操作就属于刚开启的这个事务。
一个用户会话只能开启一个事务，该事务提交后，才能开启下一个事务。
**注意事项：**
​ **事务类型：**
事务区分4种类型：业务、安全、审计（暂未支持）、系统（暂未支持）。

**本地事务与远程事务：**

在本wos开启的是本地事务，针对远程wos开启的是远程事务。

**添加到事务中：**

从开启事务开始，到提交事务或回滚事务，所有操作后台库的函数（比如数据对象的增删改查）都需要携带事务ID，由用户指定（param参数中的事务ID字段），才表示加入到这个事务中。

**登录不同用户开启不同事务：**

一个App登录不同用户类型，可以开启不同类型的事务。如下：

1）开启本地事务：在本地登录一个业务App用户，可以开启一个业务类型的事务，此时操作实时库、历史库、计划库、模型库、App引擎的函数可添加到该事务中。在本地登录一个安全App用户，可以开启一个安全类型的事务，此时操作安全库的函数可添加到该事务中。

2）开启远程事务：在远程云上登录一个业务用户，可以开启一个业务类型的事务。在远程云上登录一个安全用户，可以开启一个安全类型的事务。

​ 云上App开启事务时，cloudID不填或填0，默认事务开启在本云的环境中；登录了其它云且cloudID填区域ID，事务则开启在指定的云环境中，事务只对操作指定云环境中的数据对象生效。

​ 端上App开启事务时，cloudID不填或填0，则默认开启在本端，事务只对操作本端上的数据对象生效；登录了云且cloudID填区域ID，事务则开启在指定的云环境中，事务只对操作指定云环境中的数据对象生效。

**事务跨App的情况：**

1）WebjsApp1中开启事务，call元语言App2时，事务ID通过call函数传入App2，此时两个App虽然使用同一个用户会话，但在App2中通过事务ID操作无效，执行失败。

2）元语言App1中开启事务，call元语言App2时，事务ID通过call函数传入App2，此时两个App使用同一个用户会话，在App2中通过事务ID操作有效，也支持提交事务和回滚事务。如果App2中call元语言App3时再传事务ID，此时App2和App3不使用同一个用户会话，在App3中通过事务ID操作无效，执行失败。

3）元语言根App1中开启事务，创建根App2时，事务ID通过初始化参数传入App2，此时两个App不是使用同一个用户会话，在App2中通过事务ID操作无效，执行失败。

元语言根App1中开启事务，创建子App11时，事务ID通过初始化参数传入子App11，此时两个App使用同一个用户会话，在子App11中通过事务ID操作有效，也支持提交事务和回滚事务。
**param有效参数：**
cloudID
int32
区域ID
否
0
timeout
int32
超时时间ms
否
10000
**input有效参数：**
timeoutMs
uint32
事务超时ms
超过设置时间，事务没有提交或回滚，就自动回滚，如果设置为 param;
stringMap input;
stringMap output;
Result code;
int32 cloudID = getLocalCloudID();
int32 timeout = 10000;
uint32 timeoutMs = 15000;
int8 mode = (int8)Enum_App_TransactionMode::STRICT; // 枚举须在declare中提前声明
param.cloudID = cloudID;
param.timeout = timeout;
input.timeoutMs = timeoutMs;
input.mode = (int32)Enum_App_TransactionMode::STRICT; // 枚举须在declare中提前声明
input.transactionType = (int32)Enum_App_TransactionType::BUSSINESS_TRANSACTION; // 枚举须在declare中提前声明
code = BeginTransaction(param, input, output);
if(0 == code.ret)
{
 uint64 transactionID = output.transactionID;
 Trace(2, "事务ID =", transactionID);
}
else
{
 Trace(2, "开启事务执行失败，错误码为 =", code.ret);
}

### 3.3.1. 开启事务

 Result BeginTransaction(stringMap<var> param, stringMap<var> input,stringMap<var> &output); 

 功能描述： 开启事务。开启了事务之后，就可以执行若干对后台库的操作函数，这些操作就属于刚开启的这个事务。

 一个用户会话只能开启一个事务，该事务提交后，才能开启下一个事务。

 注意事项： 

 ​ 事务类型： 

 
 事务区分4种类型：业务、安全、审计（暂未支持）、系统（暂未支持）。

 本地事务与远程事务： 

 在本wos开启的是本地事务，针对远程wos开启的是远程事务。

 添加到事务中： 

 从开启事务开始，到提交事务或回滚事务，所有操作后台库的函数（比如数据对象的增删改查）都需要携带事务ID，由用户指定（param参数中的事务ID字段），才表示加入到这个事务中。

 登录不同用户开启不同事务： 

 一个App登录不同用户类型，可以开启不同类型的事务。如下：

 1）开启本地事务：在本地登录一个业务App用户，可以开启一个业务类型的事务，此时操作实时库、历史库、计划库、模型库、App引擎的函数可添加到该事务中。在本地登录一个安全App用户，可以开启一个安全类型的事务，此时操作安全库的函数可添加到该事务中。

 2）开启远程事务：在远程云上登录一个业务用户，可以开启一个业务类型的事务。在远程云上登录一个安全用户，可以开启一个安全类型的事务。

 ​ 云上App开启事务时，cloudID不填或填0，默认事务开启在本云的环境中；登录了其它云且cloudID填区域ID，事务则开启在指定的云环境中，事务只对操作指定云环境中的数据对象生效。

 ​ 端上App开启事务时，cloudID不填或填0，则默认开启在本端，事务只对操作本端上的数据对象生效；登录了云且cloudID填区域ID，事务则开启在指定的云环境中，事务只对操作指定云环境中的数据对象生效。

 事务跨App的情况： 

 1）WebjsApp1中开启事务，call元语言App2时，事务ID通过call函数传入App2，此时两个App虽然使用同一个用户会话，但在App2中通过事务ID操作无效，执行失败。

 2）元语言App1中开启事务，call元语言App2时，事务ID通过call函数传入App2，此时两个App使用同一个用户会话，在App2中通过事务ID操作有效，也支持提交事务和回滚事务。如果App2中call元语言App3时再传事务ID，此时App2和App3不使用同一个用户会话，在App3中通过事务ID操作无效，执行失败。

 3）元语言根App1中开启事务，创建根App2时，事务ID通过初始化参数传入App2，此时两个App不是使用同一个用户会话，在App2中通过事务ID操作无效，执行失败。

 元语言根App1中开启事务，创建子App11时，事务ID通过初始化参数传入子App11，此时两个App使用同一个用户会话，在子App11中通过事务ID操作有效，也支持提交事务和回滚事务。

 
 param有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 cloudID 
 int32 
 区域ID 
 否 
 0 
 
 
 timeout 
 int32 
 超时时间ms 
 否 
 10000 
 
 
 input有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 timeoutMs 
 uint32 
 事务超时ms
超过设置时间，事务没有提交或回滚，就自动回滚，如果设置为<=0的值按默认的15000毫秒处理。 
 否 
 15000 
 
 
 mode 
 int8 
 事务的提交模式
1：不严格提交模式；2：严格完整提交模式 
 否 
 2 
 
 
 transactionType 
 int32 
 事务类型
1：业务；2：安全；
该字段不填默认为业务事务；
开启事务时如果对应类型的用户未登录（用户会话不存在），则开启事务失败； 
 否 
 1 
 
 
 output有效参数： 

 
 
 
 名称 
 类型 
 说明 
 
 
 
 transactionID 
 uint64 
 事务ID 
 
 
 errorCodes 
 int32[] 
 错误码 
 
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例： 

 stringMap<var> param;
stringMap<var> input;
stringMap<var> output;
Result code;
int32 cloudID = getLocalCloudID();
int32 timeout = 10000;
uint32 timeoutMs = 15000;
int8 mode = (int8)Enum_App_TransactionMode::STRICT; // 枚举须在declare中提前声明
param.cloudID = cloudID;
param.timeout = timeout;
input.timeoutMs = timeoutMs;
input.mode = (int32)Enum_App_TransactionMode::STRICT; // 枚举须在declare中提前声明
input.transactionType = (int32)Enum_App_TransactionType::BUSSINESS_TRANSACTION; // 枚举须在declare中提前声明
code = BeginTransaction(param, input, output);
if(0 == code.ret)
{
 uint64 transactionID = output.transactionID;
 Trace(2, "事务ID =", transactionID);
}
else
{
 Trace(2, "开启事务执行失败，错误码为 =", code.ret);
}
 

# 3.3.2. 查询事务

**Result QueryTransaction(stringMap\ param,stringMap\ input, stringMap\ &output);**
**功能描述：**查询当前用户开启的事务ID。
**param有效参数：**
cloudID
int32
区域ID
否
0
timeout
int32
超时时间ms
否
10000
**input有效参数：**
transactionType
int32
事务类型
1：业务；2：安全；
该字段不填默认为业务事务；
否
1
**output有效参数：**
transactionID
uint64
事务ID
errorCodes
int32[]
错误码
**错误码:**
参见《错误码_App引擎》
**脚本示例：**
stringMap param;
stringMap input;
stringMap output;
Result code;
int32 cloudID = getLocalCloudID();
int32 timeout = 10000;
param.cloudID = cloudID;
param.timeout = timeout;
input.transactionType = (int32)Enum_App_TransactionType::BUSSINESS_TRANSACTION; // 枚举须在declare中提前声明
code = QueryTransaction(param, input, output);
if(0 == code.ret)
{
 uint64 transID = output.transactionID;
}
else
{
 Trace(2, "获取事务ID失败 =", code.ret);
}

### 3.3.2. 查询事务

 Result QueryTransaction(stringMap<var> param,stringMap<var> input, stringMap<var> &output); 

 功能描述： 查询当前用户开启的事务ID。

 param有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 cloudID 
 int32 
 区域ID 
 否 
 0 
 
 
 timeout 
 int32 
 超时时间ms 
 否 
 10000 
 
 
 input有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 transactionType 
 int32 
 事务类型
1：业务；2：安全；
该字段不填默认为业务事务； 
 否 
 1 
 
 
 output有效参数： 

 
 
 
 名称 
 类型 
 说明 
 
 
 
 transactionID 
 uint64 
 事务ID 
 
 
 errorCodes 
 int32[] 
 错误码 
 
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例： 

 stringMap<var> param;
stringMap<var> input;
stringMap<var> output;
Result code;
int32 cloudID = getLocalCloudID();
int32 timeout = 10000;
param.cloudID = cloudID;
param.timeout = timeout;
input.transactionType = (int32)Enum_App_TransactionType::BUSSINESS_TRANSACTION; // 枚举须在declare中提前声明
code = QueryTransaction(param, input, output);
if(0 == code.ret)
{
 uint64 transID = output.transactionID;
}
else
{
 Trace(2, "获取事务ID失败 =", code.ret);
}
 

# 3.3.3. 提交事务

**Result CommitTransaction(stringMap\ param, stringMap\ input,stringMap\ &output);**
**功能描述：**同步提交事务，就是将事务中所有对后台库的操作同步写到物理磁盘上，事务正常结束。
同步提交事务是等写库的操作完成之后将结果返回。
提交事务本身执行失败时，自动回滚到开启事务前的状态。
**param有效参数：**
cloudID
int32
区域ID
否
0
timeout
int32
超时时间ms
否
10000
**input有效参数：**
transactionID
uint64
事务ID
是

transactionType
int32
事务类型
1：业务；2：安全；
该字段不填默认为业务事务；

否
1
**output有效参数：**
errorCodes
int32[]
错误码
**错误码:**
参见《错误码_App引擎》
**脚本示例：**
stringMap param;
stringMap input;
stringMap output;
Result code;
int32 cloudID = getLocalCloudID();
int32 timeout = 10000;
uint64 transactionID = 1978021535801286;
param.cloudID = cloudID;
param.timeout = timeout;
input.transactionID = transactionID;
input.transactionType = (int32)Enum_App_TransactionType::BUSSINESS_TRANSACTION; // 枚举须在declare中提前声明
code = CommitTransaction(param, input, output);
if(0 == code.ret)
{
 Trace(2, "提交事务执行 =", "success");
}
else
{
 Trace(2, "提交事务执行失败，错误码为 =", code.ret);
}

### 3.3.3. 提交事务

 Result CommitTransaction(stringMap<var> param, stringMap<var> input,stringMap<var> &output); 

 功能描述： 同步提交事务，就是将事务中所有对后台库的操作同步写到物理磁盘上，事务正常结束。

 同步提交事务是等写库的操作完成之后将结果返回。

 提交事务本身执行失败时，自动回滚到开启事务前的状态。

 param有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 cloudID 
 int32 
 区域ID 
 否 
 0 
 
 
 timeout 
 int32 
 超时时间ms 
 否 
 10000 
 
 
 input有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 transactionID 
 uint64 
 事务ID 
 是 
 
 
 
 transactionType 
 int32 
 事务类型
1：业务；2：安全；
该字段不填默认为业务事务；
 
 否 
 1 
 
 
 output有效参数： 

 
 
 
 名称 
 类型 
 说明 
 
 
 
 errorCodes 
 int32[] 
 错误码 
 
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例： 

 stringMap<var> param;
stringMap<var> input;
stringMap<var> output;
Result code;
int32 cloudID = getLocalCloudID();
int32 timeout = 10000;
uint64 transactionID = 1978021535801286;
param.cloudID = cloudID;
param.timeout = timeout;
input.transactionID = transactionID;
input.transactionType = (int32)Enum_App_TransactionType::BUSSINESS_TRANSACTION; // 枚举须在declare中提前声明
code = CommitTransaction(param, input, output);
if(0 == code.ret)
{
 Trace(2, "提交事务执行 =", "success");
}
else
{
 Trace(2, "提交事务执行失败，错误码为 =", code.ret);
}
 

# 3.3.4. 回滚事务

**Result RollbackTransaction(stringMap\ param, stringMap\ input,stringMap\ &output);**
**功能描述：**回滚事务，事务在运行过程中出现某种异常，事务无法继续执行，系统将事务中对后台库已完成的操作全部撤销，回滚到事务开始之前的状态。
**param有效参数：**
cloudID
int32
区域ID
否
0
timeout
int32
超时时间ms
否
10000
**input有效参数：**
transactionID
uint64
事务ID
是

transactionType
int32
事务类型
1：业务；2：安全；
否
1
**output有效参数：**
errorCodes
int32[]
错误码
**错误码:**
参见《错误码_App引擎》
**脚本示例：**
stringMap param;
stringMap input;
stringMap output;
Result code;
int32 cloudID = getLocalCloudID();
int32 timeout = 10000;
int32 timeout = 10000;
uint64 transactionID = 1978021535801286;
param.cloudID = cloudID;
param.timeout = timeout;
input.transactionID = transactionID;
input.transactionType = (int32)Enum_App_TransactionType::SECURITY_TRANSACTION; // 枚举须在declare中提前声明
code = RollbackTransaction(param, input, output);
if(0 == code.ret)
{
 Trace(2, "回滚事务执行 =", "success");
}
else
{
 Trace(2, "回滚事务执行失败，错误码为 =", code.ret);
}

### 3.3.4. 回滚事务

 Result RollbackTransaction(stringMap<var> param, stringMap<var> input,stringMap<var> &output); 

 功能描述： 回滚事务，事务在运行过程中出现某种异常，事务无法继续执行，系统将事务中对后台库已完成的操作全部撤销，回滚到事务开始之前的状态。

 param有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 cloudID 
 int32 
 区域ID 
 否 
 0 
 
 
 timeout 
 int32 
 超时时间ms 
 否 
 10000 
 
 
 input有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 transactionID 
 uint64 
 事务ID 
 是 
 
 
 
 transactionType 
 int32 
 事务类型
1：业务；2：安全； 
 否 
 1 
 
 
 output有效参数： 

 
 
 
 名称 
 类型 
 说明 
 
 
 
 errorCodes 
 int32[] 
 错误码 
 
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例： 

 stringMap<var> param;
stringMap<var> input;
stringMap<var> output;
Result code;
int32 cloudID = getLocalCloudID();
int32 timeout = 10000;
int32 timeout = 10000;
uint64 transactionID = 1978021535801286;
param.cloudID = cloudID;
param.timeout = timeout;
input.transactionID = transactionID;
input.transactionType = (int32)Enum_App_TransactionType::SECURITY_TRANSACTION; // 枚举须在declare中提前声明
code = RollbackTransaction(param, input, output);
if(0 == code.ret)
{
 Trace(2, "回滚事务执行 =", "success");
}
else
{
 Trace(2, "回滚事务执行失败，错误码为 =", code.ret);
}
 

# 3.4. AppModule

## 3.4. AppModule

# 3.4.1. 调用指定版本的AppModule函数

**var callAppModule(string name, int32 version, string funcName, var[] param);**
**功能描述：**调用指定版本的appModule模型中的自定义函数。
**注意事项：**
被调用的函数入参暂不支持struct类型。
导入模式下，需要先将appModule模型导入到App引擎中。
只能调用本App引擎中存在的AppModule。
不支持appModule调用appModule。
针对从模型库部署的AppModule，只能调用本仓库的AppModule。从模型库导入的AppModule，全数据区内的App都可以调用。
**输入参数说明:**
name
string
AppModule模型名称
是

version
int32
AppModule模型版本
是

funcName
string
AppModule中被调用的函数名称
是

param
var[]
被调用功能的输入参数（最多16个输入参数），个数不固定，输入参数个数和类型要和被调功能的输入参数设置保持一致，如果被调功能的输入参数为空，则param参数的个数也要为0。
是

**返回值:**
var
被调用功能如果有返回值，将返回值返回给调用脚本。
**脚本示例：**
uint64 appID = 6052837899185946746;
string name = "AppModule模型";
int32 version = 1;
string funcName = "func1";
var[] param = {appID, "App名称"};
stringMap ret = callAppModule(name, version, funcName, param);

// func1(uint64 id, string name)
{
 stringMap map;
 map.id = id;
 map.name = name;
 return map;
}

### 3.4.1. 调用指定版本的AppModule函数

 var callAppModule(string name, int32 version, string funcName, var[] param); 

 功能描述： 调用指定版本的appModule模型中的自定义函数。

 注意事项： 

 
 被调用的函数入参暂不支持struct类型。

 导入模式下，需要先将appModule模型导入到App引擎中。

 只能调用本App引擎中存在的AppModule。

 不支持appModule调用appModule。

 针对从模型库部署的AppModule，只能调用本仓库的AppModule。从模型库导入的AppModule，全数据区内的App都可以调用。

 
 输入参数说明: 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 name 
 string 
 AppModule模型名称 
 是 
 
 
 
 version 
 int32 
 AppModule模型版本 
 是 
 
 
 
 funcName 
 string 
 AppModule中被调用的函数名称 
 是 
 
 
 
 param 
 var[] 
 被调用功能的输入参数（最多16个输入参数），个数不固定，输入参数个数和类型要和被调功能的输入参数设置保持一致，如果被调功能的输入参数为空，则param参数的个数也要为0。 
 是 
 
 
 
 返回值: 

 
 
 
 返回值 
 说明 
 
 
 
 var 
 被调用功能如果有返回值，将返回值返回给调用脚本。 
 
 
 脚本示例： 

 uint64 appID = 6052837899185946746;
string name = "AppModule模型";
int32 version = 1;
string funcName = "func1";
var[] param = {appID, "App名称"};
stringMap<var> ret = callAppModule(name, version, funcName, param);

// func1(uint64 id, string name)
{
 stringMap<var> map;
 map.id = id;
 map.name = name;
 return map;
}
 

# 3.4.2. 调用最新版本的AppModule函数

**var callAppModule(string name, string funcName, var[] param);**
**功能描述：**调用最新版本的appModule模型中的自定义函数。
**注意事项：**
被调用的函数入参暂不支持struct类型。
导入模式下，需要先将appModule模型导入到App引擎中。
只能调用本App引擎中存在的AppModule。
不支持appModule调用appModule。
针对从模型库部署的AppModule，只能调用本仓库的AppModule。从模型库导入的AppModule，全数据区内的App都可以调用。
**输入参数说明:**
name
string
AppModule模型名称
是

funcName
string
AppModule中被调用的函数名称
是

param
var[]
被调用功能的输入参数（最多16个输入参数），个数不固定，输入参数个数和类型要和被调功能的输入参数设置保持一致，如果被调功能的输入参数为空，则param参数的个数也要为0。
是

**返回值:**
var
被调用功能如果有返回值，将返回值返回给调用脚本。
**脚本示例：**
uint64 appID = 6052837899185946746;
string name = "AppModule模型";
string funcName = "func1";
var[] param = {appID, "App名称"};
stringMap ret = callAppModule(name, funcName, param);

// func1(uint64 id, string name)
{
 stringMap map;
 map.id = id;
 map.name = name;
 return map;
}

### 3.4.2. 调用最新版本的AppModule函数

 var callAppModule(string name, string funcName, var[] param); 

 功能描述： 调用最新版本的appModule模型中的自定义函数。

 注意事项： 

 
 被调用的函数入参暂不支持struct类型。

 导入模式下，需要先将appModule模型导入到App引擎中。

 只能调用本App引擎中存在的AppModule。

 不支持appModule调用appModule。

 针对从模型库部署的AppModule，只能调用本仓库的AppModule。从模型库导入的AppModule，全数据区内的App都可以调用。

 
 输入参数说明: 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 name 
 string 
 AppModule模型名称 
 是 
 
 
 
 funcName 
 string 
 AppModule中被调用的函数名称 
 是 
 
 
 
 param 
 var[] 
 被调用功能的输入参数（最多16个输入参数），个数不固定，输入参数个数和类型要和被调功能的输入参数设置保持一致，如果被调功能的输入参数为空，则param参数的个数也要为0。 
 是 
 
 
 
 返回值: 

 
 
 
 返回值 
 说明 
 
 
 
 var 
 被调用功能如果有返回值，将返回值返回给调用脚本。 
 
 
 脚本示例： 

 uint64 appID = 6052837899185946746;
string name = "AppModule模型";
string funcName = "func1";
var[] param = {appID, "App名称"};
stringMap<var> ret = callAppModule(name, funcName, param);

// func1(uint64 id, string name)
{
 stringMap<var> map;
 map.id = id;
 map.name = name;
 return map;
}
 

# 3.5. 运行模型、拷贝、仓库

## 3.5. 运行模型、拷贝、仓库

# 3.5.1. 查询指定运行模型或拷贝

**Result Query(stringMap\ param, stringMap\ input,stringMap\ &output);**
**功能描述：**查询导入到App引擎中的App模型、AppModule模型或App拷贝。
**注意事项：**
针对从模型库部署的时空，支持指定仓库。
**param有效参数：**
cloudID
int32
区域ID
否
0
areaID
int32
数据区ID
否
本App所在数据区
type
int32
对象类型
App模型21101
App拷贝21102
AppModule模型21103
是

transactionID
uint64
事务ID
否

timeout
int32
超时时间ms
否
10000
**input有效参数：**
mode
int32
查询模式，=1
是

spaceTimeGUID
string
时空对象GUID
值为空表示系统时空；
无该字段表示本时空；
否
本时空
repoGUID
string
仓库GUID
值为空表示系统仓库；
无该字段表示本仓库；
否
本仓库
guids
string[]
模型或拷贝GUID
是

versions
int32[]
模型版本：
仅查询模型时有效
不填默认查询所有模型版本
注意版本号与guids一一对应
否

returnFields
string[]
返回字段名称
不能为空，查询的字段不存在返回null、字段重复则报错
是

**output有效参数：**
returnData
DataSet
返回数据
一个对象对应DataSet类型的一行数据
列名与returnFields一致
errorCodes
int32[]
错误码数组
与输入的对象个数一致，成功返回0，失败返回对应错误码
**错误码:**
参见《错误码_App引擎》
**脚本示例：**
stringMap param;
stringMap input;
stringMap output;
string appModelGUID = "6bd040bf-d7b8-4e70-9e87-6530b66f9af3";
param.cloudID = 0;
param.areaID = 0;
param.type = (int32)Enum_App_MLType::APP_MODEL;
param.transactionID = (uint64)123; // 此处只是示意，应该是开启事务函数返回的ID
param.timeout = 10000;
input.mode = (int32)Enum_App_ModelCopyQueryMode::BY_SPECIFIED;
input.guids = {appModelGUID};
input.versions = {1};
input.returnFields = {"$name", "$label1"};
Result ret = Query(param, input, output);
if(0 == ret.ret)
{
 Trace(2, "查询指定运行模型执行正常，output = ", output);
 DataSet returnData = output.returnData;
 if(returnData.rowLength > 0)
 {
 for(int32 i = 1; i Result Query(stringMap<var> param, stringMap<var> input,stringMap<var> &output); 

 功能描述： 查询导入到App引擎中的App模型、AppModule模型或App拷贝。

 注意事项： 

 
 针对从模型库部署的时空，支持指定仓库。

 
 param有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 cloudID 
 int32 
 区域ID 
 否 
 0 
 
 
 areaID 
 int32 
 数据区ID 
 否 
 本App所在数据区 
 
 
 type 
 int32 
 对象类型
App模型21101
App拷贝21102
AppModule模型21103 
 是 
 
 
 
 transactionID 
 uint64 
 事务ID 
 否 
 
 
 
 timeout 
 int32 
 超时时间ms 
 否 
 10000 
 
 
 input有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 mode 
 int32 
 查询模式，=1 
 是 
 
 
 
 spaceTimeGUID 
 string 
 时空对象GUID
值为空表示系统时空；
无该字段表示本时空； 
 否 
 本时空 
 
 
 repoGUID 
 string 
 仓库GUID
值为空表示系统仓库；
无该字段表示本仓库； 
 否 
 本仓库 
 
 
 guids 
 string[] 
 模型或拷贝GUID 
 是 
 
 
 
 versions 
 int32[] 
 模型版本：
仅查询模型时有效
不填默认查询所有模型版本
注意版本号与guids一一对应 
 否 
 
 
 
 returnFields 
 string[] 
 返回字段名称
不能为空，查询的字段不存在返回null、字段重复则报错 
 是 
 
 
 
 output有效参数： 

 
 
 
 名称 
 类型 
 说明 
 
 
 
 returnData 
 DataSet 
 返回数据
一个对象对应DataSet类型的一行数据
列名与returnFields一致 
 
 
 errorCodes 
 int32[] 
 错误码数组
与输入的对象个数一致，成功返回0，失败返回对应错误码 
 
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例： 

 stringMap<var> param;
stringMap<var> input;
stringMap<var> output;
string appModelGUID = "6bd040bf-d7b8-4e70-9e87-6530b66f9af3";
param.cloudID = 0;
param.areaID = 0;
param.type = (int32)Enum_App_MLType::APP_MODEL;
param.transactionID = (uint64)123; // 此处只是示意，应该是开启事务函数返回的ID
param.timeout = 10000;
input.mode = (int32)Enum_App_ModelCopyQueryMode::BY_SPECIFIED;
input.guids = {appModelGUID};
input.versions = {1};
input.returnFields = {"$name", "$label1"};
Result ret = Query(param, input, output);
if(0 == ret.ret)
{
 Trace(2, "查询指定运行模型执行正常，output = ", output);
 DataSet returnData = output.returnData;
 if(returnData.rowLength > 0)
 {
 for(int32 i = 1; i <= returnData.rowLength; i++)
 {
 string name = returnData.cellByName(i, "$name");
 }
 }
}
else
{
 Trace(2, "查询指定运行模型执行异常，ret = ", ret);
 Trace(2, "查询指定运行模型执行异常，output = ", output);
}
 

# 3.5.2. 查询指定时空内运行模型或拷贝列表

**Result Query(stringMap\ param, stringMap\ input,stringMap\ &output);**
**功能描述：**查询App引擎中指定时空内的App模型、AppModule模型或App拷贝列表。
**注意事项：**
针对从模型库部署的时空，支持指定仓库。
**param有效参数：**
cloudID
int32
区域ID
否
0
areaID
int32
数据区ID
否
本App所在数据区
type
int32
对象类型
App模型21101
App拷贝21102
AppModule模型21103
是

transactionID
uint64
事务ID
否

timeout
int32
超时时间ms
否
10000
**input有效参数：**
mode
int32
查询模式，=2
是

spaceTimeGUID
string
时空对象GUID
值为空表示系统时空；
无该字段表示本时空；
否
本时空
repoGUID
string
仓库GUID
值为空表示系统仓库；
无该字段表示本仓库；
否
本仓库
returnFields
string[]
返回字段名称
不能为空，查询的字段不存在返回null、字段重复则报错
是

**output有效参数：**
returnData
DataSet
返回数据
一个对象对应DataSet类型的一行数据
列名与returnFields一致
errorCodes
int32[]
错误码数组
只返回一个错误码，数组长度为1
**错误码:**
参见《错误码_App引擎》
**脚本示例：**
stringMap param;
stringMap input;
stringMap output;
param.cloudID = 0;
param.areaID = 0;
param.type = (int32)Enum_App_MLType::APP_MODEL;
param.transactionID = (uint64)123; // 此处只是示意，应该是开启事务函数返回的ID
param.timeout = 10000;
input.mode = (int32)Enum_App_ModelCopyQueryMode::IN_SPACETIME;
input.spaceTimeGUID = "7061d54f-05a9-474f-a9f1-d8d5733bb1cf";
input.returnFields = {"$name", "$guid", "$version"};
Result ret = Query(param, input, output);
if(0 == ret.ret)
{
 Trace(2, "查询运行模型列表执行正常，output = ", output);
 DataSet returnData = output.returnData;
 if(returnData.rowLength > 0)
 {
 for(int32 i = 1; i Result Query(stringMap<var> param, stringMap<var> input,stringMap<var> &output); 

 功能描述： 查询App引擎中指定时空内的App模型、AppModule模型或App拷贝列表。

 注意事项： 

 
 针对从模型库部署的时空，支持指定仓库。

 
 param有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 cloudID 
 int32 
 区域ID 
 否 
 0 
 
 
 areaID 
 int32 
 数据区ID 
 否 
 本App所在数据区 
 
 
 type 
 int32 
 对象类型
App模型21101
App拷贝21102
AppModule模型21103 
 是 
 
 
 
 transactionID 
 uint64 
 事务ID 
 否 
 
 
 
 timeout 
 int32 
 超时时间ms 
 否 
 10000 
 
 
 input有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 mode 
 int32 
 查询模式，=2 
 是 
 
 
 
 spaceTimeGUID 
 string 
 时空对象GUID
值为空表示系统时空；
无该字段表示本时空； 
 否 
 本时空 
 
 
 repoGUID 
 string 
 仓库GUID
值为空表示系统仓库；
无该字段表示本仓库； 
 否 
 本仓库 
 
 
 returnFields 
 string[] 
 返回字段名称
不能为空，查询的字段不存在返回null、字段重复则报错 
 是 
 
 
 
 output有效参数： 

 
 
 
 名称 
 类型 
 说明 
 
 
 
 returnData 
 DataSet 
 返回数据
一个对象对应DataSet类型的一行数据
列名与returnFields一致 
 
 
 errorCodes 
 int32[] 
 错误码数组
只返回一个错误码，数组长度为1 
 
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例： 

 stringMap<var> param;
stringMap<var> input;
stringMap<var> output;
param.cloudID = 0;
param.areaID = 0;
param.type = (int32)Enum_App_MLType::APP_MODEL;
param.transactionID = (uint64)123; // 此处只是示意，应该是开启事务函数返回的ID
param.timeout = 10000;
input.mode = (int32)Enum_App_ModelCopyQueryMode::IN_SPACETIME;
input.spaceTimeGUID = "7061d54f-05a9-474f-a9f1-d8d5733bb1cf";
input.returnFields = {"$name", "$guid", "$version"};
Result ret = Query(param, input, output);
if(0 == ret.ret)
{
 Trace(2, "查询运行模型列表执行正常，output = ", output);
 DataSet returnData = output.returnData;
 if(returnData.rowLength > 0)
 {
 for(int32 i = 1; i <= returnData.rowLength; i++)
 {
 string name = returnData.cellByName(i, "$name");
 }
 }
}
else
{
 Trace(2, "查询运行模型列表执行异常，ret = ", ret);
 Trace(2, "查询运行模型列表执行异常，output = ", output);
}
 

# 3.5.3. 查询指定运行仓库

**Result Query(stringMap\ param, stringMap\ input,stringMap\ &output);**
**功能描述：**查询App引擎中的指定运行仓库。
**注意事项：**
仅支持查询启动状态的运行仓库。

针对从模型库部署的时空，支持该函数。
**param有效参数：**
cloudID
int32
区域ID
否
0
areaID
int32
数据区ID
否
本App所在数据区
type
int32
对象类型，21104
是

transactionID
uint64
事务ID
否

timeout
int32
超时时间ms
否
10000
**input有效参数：**
mode
int32
查询模式，=1
是

spaceTimeGUID
string
时空对象GUID
值为空表示系统时空；
无该字段表示本时空；
否
本时空
guids
string[]
仓库GUID
是

returnFields
string[]
返回字段名称
不能为空，查询的字段不存在返回null、字段重复则报错
是

**output有效参数：**
returnData
DataSet
返回数据
一个对象对应DataSet类型的一行数据
列名与returnFields一致
errorCodes
int32[]
错误码数组
与输入的对象个数一致，成功返回0，失败返回对应错误码
**错误码:**
参见《错误码_App引擎》
**脚本示例：**
stringMap param;
stringMap input;
stringMap output;
string spacetimeGUID = "6bd040bf-d7b8-4e70-9e87-6530b66f9af3";
string repoGUID = "16d0a624-6100-437d-875b-2d1494a1d680";
param.cloudID = 0;
param.areaID = 0;
param.type = (int32)Enum_App_MLType::REPOSITORY;
param.transactionID = (uint64)123; // 此处只是示意，应该是开启事务函数返回的ID
param.timeout = 10000;
input.mode = (int32)Enum_App_RepositoryQueryMode::BY_SPECIFIED;
input.spacetimeGUID = spacetimeGUID;
input.guids = {repoGUID};
input.returnFields = {"$name", "$label1"};
Result ret = Query(param, input, output);
if(0 == ret.ret)
{
 Trace(2, "查询指定运行仓库执行正常，output == ", output);
 DataSet returnData = output.returnData;
 if(returnData.rowLength > 0)
 {
 for(int32 i = 1; i Result Query(stringMap<var> param, stringMap<var> input,stringMap<var> &output); 

 功能描述： 查询App引擎中的指定运行仓库。

 注意事项： 

 
 仅支持查询启动状态的运行仓库。

 针对从模型库部署的时空，支持该函数。

 
 param有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 cloudID 
 int32 
 区域ID 
 否 
 0 
 
 
 areaID 
 int32 
 数据区ID 
 否 
 本App所在数据区 
 
 
 type 
 int32 
 对象类型，21104 
 是 
 
 
 
 transactionID 
 uint64 
 事务ID 
 否 
 
 
 
 timeout 
 int32 
 超时时间ms 
 否 
 10000 
 
 
 input有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 mode 
 int32 
 查询模式，=1 
 是 
 
 
 
 spaceTimeGUID 
 string 
 时空对象GUID
值为空表示系统时空；
无该字段表示本时空； 
 否 
 本时空 
 
 
 guids 
 string[] 
 仓库GUID 
 是 
 
 
 
 returnFields 
 string[] 
 返回字段名称
不能为空，查询的字段不存在返回null、字段重复则报错 
 是 
 
 
 
 output有效参数： 

 
 
 
 名称 
 类型 
 说明 
 
 
 
 returnData 
 DataSet 
 返回数据
一个对象对应DataSet类型的一行数据
列名与returnFields一致 
 
 
 errorCodes 
 int32[] 
 错误码数组
与输入的对象个数一致，成功返回0，失败返回对应错误码 
 
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例： 

 stringMap<var> param;
stringMap<var> input;
stringMap<var> output;
string spacetimeGUID = "6bd040bf-d7b8-4e70-9e87-6530b66f9af3";
string repoGUID = "16d0a624-6100-437d-875b-2d1494a1d680";
param.cloudID = 0;
param.areaID = 0;
param.type = (int32)Enum_App_MLType::REPOSITORY;
param.transactionID = (uint64)123; // 此处只是示意，应该是开启事务函数返回的ID
param.timeout = 10000;
input.mode = (int32)Enum_App_RepositoryQueryMode::BY_SPECIFIED;
input.spacetimeGUID = spacetimeGUID;
input.guids = {repoGUID};
input.returnFields = {"$name", "$label1"};
Result ret = Query(param, input, output);
if(0 == ret.ret)
{
 Trace(2, "查询指定运行仓库执行正常，output == ", output);
 DataSet returnData = output.returnData;
 if(returnData.rowLength > 0)
 {
 for(int32 i = 1; i <= returnData.rowLength; i++)
 {
 string name = returnData.cellByName(i, "$name");
 }
 }
}
else
{
 Trace(2, "查询指定运行仓库执行异常，ret == ", ret);
 Trace(2, "查询指定运行仓库执行异常，output == ", output);
}
 

# 3.5.4. 查询指定时空内运行仓库列表

**Result Query(stringMap\ param, stringMap\ input,stringMap\ &output);**
**功能描述：**查询App引擎中指定时空内的指定运行仓库。
**注意事项：**
仅支持查询启动状态的运行仓库。

针对从模型库部署的时空，支持该函数。
**param有效参数：**
cloudID
int32
区域ID
否
0
areaID
int32
数据区ID
否
本App所在数据区
type
int32
对象类型，21104
是

transactionID
uint64
事务ID
否

timeout
int32
超时时间ms
否
10000
**input有效参数：**
mode
int32
查询模式，=2
是

spaceTimeGUID
string
时空对象GUID
值为空表示系统时空；
无该字段表示本时空；
否
本时空
returnFields
string[]
返回字段名称
不能为空，查询的字段不存在返回null、字段重复则报错
是

**output有效参数：**
returnData
DataSet
返回数据
一个对象对应DataSet类型的一行数据
列名与returnFields一致
errorCodes
int32[]
错误码数组
与输入的对象个数一致，成功返回0，失败返回对应错误码
**错误码:**
参见《错误码_App引擎》
**脚本示例：**
stringMap param;
stringMap input;
stringMap output;
param.cloudID = 0;
param.areaID = 0;
param.type = (int32)Enum_App_MLType::REPOSITORY;
param.transactionID = (uint64)123; // 此处只是示意，应该是开启事务函数返回的ID
param.timeout = 10000;
input.mode = (int32)Enum_App_RepositoryQueryMode::IN_SPACETIME;
input.spaceTimeGUID = "7061d54f-05a9-474f-a9f1-d8d5733bb1cf";
input.returnFields = {"$name", "$guid", "$version"};
Result ret = Query(param, input, output);
if(0 == ret.ret)
{
 Trace(2, "查询运行仓库列表执行正常，output == ", output);
 DataSet returnData = output.returnData;
 if(returnData.rowLength > 0)
 {
 for(int32 i = 1; i Result Query(stringMap<var> param, stringMap<var> input,stringMap<var> &output); 

 功能描述： 查询App引擎中指定时空内的指定运行仓库。

 注意事项： 

 
 仅支持查询启动状态的运行仓库。

 针对从模型库部署的时空，支持该函数。

 
 param有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 cloudID 
 int32 
 区域ID 
 否 
 0 
 
 
 areaID 
 int32 
 数据区ID 
 否 
 本App所在数据区 
 
 
 type 
 int32 
 对象类型，21104 
 是 
 
 
 
 transactionID 
 uint64 
 事务ID 
 否 
 
 
 
 timeout 
 int32 
 超时时间ms 
 否 
 10000 
 
 
 input有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 mode 
 int32 
 查询模式，=2 
 是 
 
 
 
 spaceTimeGUID 
 string 
 时空对象GUID
值为空表示系统时空；
无该字段表示本时空； 
 否 
 本时空 
 
 
 returnFields 
 string[] 
 返回字段名称
不能为空，查询的字段不存在返回null、字段重复则报错 
 是 
 
 
 
 output有效参数： 

 
 
 
 名称 
 类型 
 说明 
 
 
 
 returnData 
 DataSet 
 返回数据
一个对象对应DataSet类型的一行数据
列名与returnFields一致 
 
 
 errorCodes 
 int32[] 
 错误码数组
与输入的对象个数一致，成功返回0，失败返回对应错误码 
 
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例： 

 stringMap<var> param;
stringMap<var> input;
stringMap<var> output;
param.cloudID = 0;
param.areaID = 0;
param.type = (int32)Enum_App_MLType::REPOSITORY;
param.transactionID = (uint64)123; // 此处只是示意，应该是开启事务函数返回的ID
param.timeout = 10000;
input.mode = (int32)Enum_App_RepositoryQueryMode::IN_SPACETIME;
input.spaceTimeGUID = "7061d54f-05a9-474f-a9f1-d8d5733bb1cf";
input.returnFields = {"$name", "$guid", "$version"};
Result ret = Query(param, input, output);
if(0 == ret.ret)
{
 Trace(2, "查询运行仓库列表执行正常，output == ", output);
 DataSet returnData = output.returnData;
 if(returnData.rowLength > 0)
 {
 for(int32 i = 1; i <= returnData.rowLength; i++)
 {
 string name = returnData.cellByName(i, "$name");
 }
 }
}
else
{
 Trace(2, "查询运行仓库列表执行异常，ret == ", ret);
 Trace(2, "查询运行仓库列表执行异常，output == ", output);
}
 

# 3.6. 时空对象

## 3.6. 时空对象

# 3.6.1. 查询指定时空对象及后代

**Result Query(stringMap\ param, stringMap\ input, stringMap\ &output);**
**功能描述：**查询指定时空对象及后代。
**注意事项：**
按照queryType值可以查子孙后代。
针对从模型库部署的时空，支持该函数。
**param有效参数：**
cloudID
int32
区域ID
否
0
areaID
int32
数据区ID
否
本App所在数据区
type
int32
对象类型，21004
是

transactionID
uint64
事务ID
否

timeout
int32
超时时间ms
否
10000
**input有效参数：**
mode
int32
模式，=1
是

identifierType
int32
时空对象的标识类型：
1：ID，使用ID标识
2：NAME，使用名称标识
5：GUID，使用Guid标识
是

ids
uint64[]
时空对象ID；
0或数组为空或不填表示系统时空
三选一

names
string[]
时空对象名称；
空字符串或数组为空或不填表示系统时空
三选一

guids
string[]
时空对象GUID；
空字符串或数组为空或不填表示系统时空
三选一

queryType
int32
查询类型
1：查询指定时空（指定时空本身）
2：查询指定时空的子时空（不包含本身）
3：查询指定时空的后代时空（包含本身）
是

returnFields
string[]
返回字段名称
不能为空，查询的字段不存在返回null、字段重复则报错
是

**output有效参数：**
returnDatas
DataSet[]
查询结果
（1）input中一个id对应一个DataSet，子或后代都在DataSet中。
（2）如果查系统时空本身，返回空dataset。
errorCodes
int32[]
错误码数组
**错误码:**
参见《错误码_App引擎》
**脚本示例1：**根据时空对象ID查询时空对象及后代
stringMap param;
stringMap input;
stringMap output;
Result code; 
int32 cloudID = getLocalCloudID();
int32 areaID = 0;
uint64 transactionID = 0;
int32 timeout = 10000;
uint64[] ids = {18158513697557839974, 18158513697557839975}; 
string[] returnFields = {"$name", "$id", "$label1", "$label2", "$label3", "$displayName"};
DataSet[] returnDatas;
int32[] errorCodes = {};
param.cloudID = cloudID;
param.areaID = areaID;
param.type = (int32)Enum_App_MLType::SPACETIME; // 枚举须在declare中提前声明
param.transactionID = transactionID;
param.timeout = timeout;
input.mode = (int32)Enum_App_SpaceTimeQueryMode::CHILD_AND_DESCENDAN; // 枚举须在declare中提前声明
input.identifierType = (int32)Enum_App_IdentifierType::ID; // 枚举须在declare中提前声明
input.ids = ids;
input.queryType = (int32)Enum_App_SpaceTimeQueryType::SELF; // 枚举须在declare中提前声明
input.returnFields = returnFields;
code = Query(param, input, output);
if(0 == code.ret) 
{
 Trace(2, "根据时空对象ID查询时空对象及后代执行=", "success");
 returnDatas = output.returnDatas;
 if(0 param;
stringMap input;
stringMap output;
Result code; 
int32 cloudID = getLocalCloudID();
int32 areaID = 0;
uint64 transactionID = 0;
int32 timeout = 10000;
string[] names = {"集团/工厂1", "集团/工厂2"}; 
string[] returnFields = {"$name", "$id", "$label1", "$label2", "$label3", "$displayName"};
DataSet[] returnDatas;
int32[] errorCodes = {};
param.cloudID = cloudID;
param.areaID = areaID;
param.type = (int32)Enum_App_MLType::SPACETIME; // 枚举须在declare中提前声明
param.transactionID = transactionID;
param.timeout = timeout;
input.mode = (int32)Enum_App_SpaceTimeQueryMode::CHILD_AND_DESCENDAN; // 枚举须在declare中提前声明
input.identifierType = (int32)Enum_App_IdentifierType::NAME; // 枚举须在declare中提前声明
input.names = names;
input.queryType = (int32)Enum_App_SpaceTimeQueryType::SELF; // 枚举须在declare中提前声明
input.returnFields = returnFields;
code = Query(param, input, output);
if(0 == code.ret) 
{
 Trace(2, "根据时空对象名称查询时空对象及后代执行 =", "success");
 returnDatas = output.returnDatas;
 if(0 param;
stringMap input;
stringMap output;
Result code; 
int32 cloudID = getLocalCloudID();
int32 areaID = 0;
uint64 transactionID = 0;
int32 timeout = 10000;
string[] guids = {"342406d2-a99d-439b-9c66-8eb6858eb995", "7a8d69b3-30f7-4198-946d-ec3fae8c5721"}; 
string[] returnFields = {"$name", "$id", "$label1", "$label2", "$label3", "$displayName"};
DataSet[] returnDatas;
int32[] errorCodes = {};
param.cloudID = cloudID;
param.areaID = areaID;
param.type = (int32)Enum_App_MLType::SPACETIME; // 枚举须在declare中提前声明
param.transactionID = transactionID;
param.timeout = timeout;
input.mode = (int32)Enum_App_SpaceTimeQueryMode::CHILD_AND_DESCENDAN; // 枚举须在declare中提前声明
input.identifierType = (int32)Enum_App_IdentifierType::GUID; // 枚举须在declare中提前声明
input.aliases = guids;
input.queryType = (int32)Enum_App_SpaceTimeQueryType::SELF; // 枚举须在declare中提前声明
input.returnFields = returnFields;
code = Query(param, input, output);
if(0 == code.ret) 
{
 Trace(2, "根据时空对象GUID查询时空对象及后代执行 =", "success");
 returnDatas = output.returnDatas;
 if(0 Result Query(stringMap<var> param, stringMap<var> input, stringMap<var> &output); 

 功能描述： 查询指定时空对象及后代。

 注意事项： 

 
 按照queryType值可以查子孙后代。

 针对从模型库部署的时空，支持该函数。

 
 param有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 cloudID 
 int32 
 区域ID 
 否 
 0 
 
 
 areaID 
 int32 
 数据区ID 
 否 
 本App所在数据区 
 
 
 type 
 int32 
 对象类型，21004 
 是 
 
 
 
 transactionID 
 uint64 
 事务ID 
 否 
 
 
 
 timeout 
 int32 
 超时时间ms 
 否 
 10000 
 
 
 input有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 mode 
 int32 
 模式，=1 
 是 
 
 
 
 identifierType 
 int32 
 时空对象的标识类型：
1：ID，使用ID标识
2：NAME，使用名称标识
5：GUID，使用Guid标识 
 是 
 
 
 
 ids 
 uint64[] 
 时空对象ID；
0或数组为空或不填表示系统时空 
 三选一 
 
 
 
 names 
 string[] 
 时空对象名称；
空字符串或数组为空或不填表示系统时空 
 三选一 
 
 
 
 guids 
 string[] 
 时空对象GUID；
空字符串或数组为空或不填表示系统时空 
 三选一 
 
 
 
 queryType 
 int32 
 查询类型
1：查询指定时空（指定时空本身）
2：查询指定时空的子时空（不包含本身）
3：查询指定时空的后代时空（包含本身） 
 是 
 
 
 
 returnFields 
 string[] 
 返回字段名称
不能为空，查询的字段不存在返回null、字段重复则报错 
 是 
 
 
 
 output有效参数： 

 
 
 
 名称 
 类型 
 说明 
 
 
 
 returnDatas 
 DataSet[] 
 查询结果
（1）input中一个id对应一个DataSet，子或后代都在DataSet中。
（2）如果查系统时空本身，返回空dataset。 
 
 
 errorCodes 
 int32[] 
 错误码数组 
 
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例1： 根据时空对象ID查询时空对象及后代

 stringMap<var> param;
stringMap<var> input;
stringMap<var> output;
Result code; 
int32 cloudID = getLocalCloudID();
int32 areaID = 0;
uint64 transactionID = 0;
int32 timeout = 10000;
uint64[] ids = {18158513697557839974, 18158513697557839975}; 
string[] returnFields = {"$name", "$id", "$label1", "$label2", "$label3", "$displayName"};
DataSet[] returnDatas;
int32[] errorCodes = {};
param.cloudID = cloudID;
param.areaID = areaID;
param.type = (int32)Enum_App_MLType::SPACETIME; // 枚举须在declare中提前声明
param.transactionID = transactionID;
param.timeout = timeout;
input.mode = (int32)Enum_App_SpaceTimeQueryMode::CHILD_AND_DESCENDAN; // 枚举须在declare中提前声明
input.identifierType = (int32)Enum_App_IdentifierType::ID; // 枚举须在declare中提前声明
input.ids = ids;
input.queryType = (int32)Enum_App_SpaceTimeQueryType::SELF; // 枚举须在declare中提前声明
input.returnFields = returnFields;
code = Query(param, input, output);
if(0 == code.ret) 
{
 Trace(2, "根据时空对象ID查询时空对象及后代执行=", "success");
 returnDatas = output.returnDatas;
 if(0 < returnDatas.Length)
 {
 if(0 < returnDatas[1].rowLength)
 {
 string spaceTimeName = returnDatas[1].cellByName(1, "$name");
 uint64 spaceTimeID = returnDatas[1].cellByName(1, "$id");
 Trace(2, "spaceTimeName = ", spaceTimeName);
 Trace(2, "spaceTimeID =", spaceTimeID);
 }
 else
 {
 Trace(2, "returnDatas[1].rowLength", "小于或等于0");
 }
 }
 else
 {
 Trace(2, "returnDatas.Length", "小于或等于0");
 }
}
else
{
 Trace(2, "根据时空对象ID查询时空对象及后代执行 =", "fail");
 errorCodes = output.errorCodes;
 Trace(2, "根据时空对象ID查询时空对象及后代code.ret =", code.ret);
 Trace(2, "根据时空对象ID查询时空对象及后代errorCodes =", errorCodes);
}
 
 脚本示例2： 根据时空对象names查询时空对象及后代

 stringMap<var> param;
stringMap<var> input;
stringMap<var> output;
Result code; 
int32 cloudID = getLocalCloudID();
int32 areaID = 0;
uint64 transactionID = 0;
int32 timeout = 10000;
string[] names = {"集团/工厂1", "集团/工厂2"}; 
string[] returnFields = {"$name", "$id", "$label1", "$label2", "$label3", "$displayName"};
DataSet[] returnDatas;
int32[] errorCodes = {};
param.cloudID = cloudID;
param.areaID = areaID;
param.type = (int32)Enum_App_MLType::SPACETIME; // 枚举须在declare中提前声明
param.transactionID = transactionID;
param.timeout = timeout;
input.mode = (int32)Enum_App_SpaceTimeQueryMode::CHILD_AND_DESCENDAN; // 枚举须在declare中提前声明
input.identifierType = (int32)Enum_App_IdentifierType::NAME; // 枚举须在declare中提前声明
input.names = names;
input.queryType = (int32)Enum_App_SpaceTimeQueryType::SELF; // 枚举须在declare中提前声明
input.returnFields = returnFields;
code = Query(param, input, output);
if(0 == code.ret) 
{
 Trace(2, "根据时空对象名称查询时空对象及后代执行 =", "success");
 returnDatas = output.returnDatas;
 if(0 < returnDatas.Length)
 {
 if(0 < returnDatas[1].rowLength)
 {
 string spaceTimeName = returnDatas[1].cellByName(1, "$name");
 uint64 spaceTimeID = returnDatas[1].cellByName(1, "$id");
 Trace(2, "spaceTimeName = ", spaceTimeName);
 Trace(2, "spaceTimeID =", spaceTimeID);
 }
 else
 {
 Trace(2, "returnDatas[1].rowLength", "小于或等于0");
 }
 }
 else
 {
 Trace(2, "returnDatas.Length", "小于或等于0");
 }
}
else
{
 Trace(2, "根据时空对象名称查询时空对象及后代执行 =", "fail");
 errorCodes = output.errorCodes;
 Trace(2, "根据时空对象名称查询时空对象及后代code.ret =", code.ret);
 Trace(2, "根据时空对象名称查询时空对象及后代errorCodes =", errorCodes);
}
 
 脚本示例3： 根据时空对象GUID查询时空对象及后代

 stringMap<var> param;
stringMap<var> input;
stringMap<var> output;
Result code; 
int32 cloudID = getLocalCloudID();
int32 areaID = 0;
uint64 transactionID = 0;
int32 timeout = 10000;
string[] guids = {"342406d2-a99d-439b-9c66-8eb6858eb995", "7a8d69b3-30f7-4198-946d-ec3fae8c5721"}; 
string[] returnFields = {"$name", "$id", "$label1", "$label2", "$label3", "$displayName"};
DataSet[] returnDatas;
int32[] errorCodes = {};
param.cloudID = cloudID;
param.areaID = areaID;
param.type = (int32)Enum_App_MLType::SPACETIME; // 枚举须在declare中提前声明
param.transactionID = transactionID;
param.timeout = timeout;
input.mode = (int32)Enum_App_SpaceTimeQueryMode::CHILD_AND_DESCENDAN; // 枚举须在declare中提前声明
input.identifierType = (int32)Enum_App_IdentifierType::GUID; // 枚举须在declare中提前声明
input.aliases = guids;
input.queryType = (int32)Enum_App_SpaceTimeQueryType::SELF; // 枚举须在declare中提前声明
input.returnFields = returnFields;
code = Query(param, input, output);
if(0 == code.ret) 
{
 Trace(2, "根据时空对象GUID查询时空对象及后代执行 =", "success");
 returnDatas = output.returnDatas;
 if(0 < returnDatas.Length)
 {
 if(0 < returnDatas[1].rowLength)
 {
 string spaceTimeName = returnDatas[1].cellByName(1, "$name");
 uint64 spaceTimeID = returnDatas[1].cellByName(1, "$id");
 Trace(2, "spaceTimeName = ", spaceTimeName);
 Trace(2, "spaceTimeID =", spaceTimeID);
 }
 else
 {
 Trace(2, "returnDatas[1].rowLength", "小于或等于0");
 }
 }
 else
 {
 Trace(2, "returnDatas.Length", "小于或等于0");
 }
}
else
{
 Trace(2, "根据时空对象GUID查询时空对象及后代执行 =", "fail");
 errorCodes = output.errorCodes;
 Trace(2, "根据时空对象GUID查询时空对象及后代code.ret =", code.ret);
 Trace(2, "根据时空对象GUID查询时空对象及后代errorCodes =", errorCodes);
}
 

# 3.6.2. 过滤查询时空对象

**Result Query(stringMap\ param, stringMap\ input, stringMap\ &output);**
**功能描述：**过滤查询App时空对象。
**注意事项：**
针对从模型库部署的时空，支持该函数。
**param有效参数：**
cloudID
int32
区域ID
否
0
areaID
int32
数据区ID
否
本App所在数据区
type
int32
对象类型，21004
是

transactionID
uint64
事务ID
否

timeout
int32
超时时间ms
否
10000
**input有效参数：**
mode
int32
模式，=2
是

filter
string
过滤字符串
支持过滤的字段有：$name，$label1，$label2，$label3，填其他字段报错误码
是

returnFields
string[]
返回字段名称
不能为空，查询的字段不存在返回null、字段重复则报错
是

**output有效参数：**
returnData
DataSet
返回的数据
errorCodes
int32[]
错误码数组
只返回一个错误码，数组长度为1
**错误码:**
参见《错误码_App引擎》
**脚本示例1：**过滤查询时空对象(单条件过滤)
stringMap param;
stringMap input;
stringMap output;
Result code; 
int32 cloudID = getLocalCloudID();
int32 areaID = 0;
uint64 transactionID = 0;
int32 timeout = 10000;
string filter = "$name == \"工厂1\"";
string[] returnFields = {"$name", "$id", "$label1", "$label2", "$label3", "$displayName"};
DataSet returnData;
int32[] errorCodes = {};
param.cloudID = cloudID;
param.areaID = areaID;
param.type = (int32)Enum_App_MLType::SPACETIME; // 枚举须在declare中提前声明
param.transactionID = transactionID;
param.timeout = timeout;
input.mode = (int32)Enum_App_SpaceTimeQueryMode::BY_FILTER; // 枚举须在declare中提前声明
input.filter = filter;
input.returnFields = returnFields;
code = Query(param, input, output);
if(0 == code.ret) 
{
 Trace(2, "过滤查询时空对象执行 =", "success");
 returnData = output.returnData;
 if(0 param;
stringMap input;
stringMap output;
Result code; 
int32 cloudID = getLocalCloudID();
int32 areaID = 0;
uint64 transactionID = 0;
int32 timeout = 10000;
string filter = "$name == \"工厂1\" && $lable1 == \"lable1_1\""; 
string[] returnFields = {"$name", "$id", "$label1", "$label2", "$label3", "$displayName"};
DataSet returnData;
int32[] errorCodes = {};
param.cloudID = cloudID;
param.areaID = areaID;
param.type = (int32)Enum_App_MLType::SPACETIME; // 枚举须在declare中提前声明
param.transactionID = transactionID;
param.timeout = timeout;
input.mode = (int32)Enum_App_SpaceTimeQueryMode::BY_FILTER; // 枚举须在declare中提前声明
input.filter = filter;
input.returnFields = returnFields;
code = Query(param, input, output);
if(0 == code.ret) 
{
 Trace(2, "过滤查询时空对象执行 =", "success");
 returnData = output.returnData;
 if(0 Result Query(stringMap<var> param, stringMap<var> input, stringMap<var> &output); 

 功能描述： 过滤查询App时空对象。

 注意事项： 

 针对从模型库部署的时空，支持该函数。

 param有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 cloudID 
 int32 
 区域ID 
 否 
 0 
 
 
 areaID 
 int32 
 数据区ID 
 否 
 本App所在数据区 
 
 
 type 
 int32 
 对象类型，21004 
 是 
 
 
 
 transactionID 
 uint64 
 事务ID 
 否 
 
 
 
 timeout 
 int32 
 超时时间ms 
 否 
 10000 
 
 
 input有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 mode 
 int32 
 模式，=2 
 是 
 
 
 
 filter 
 string 
 过滤字符串
支持过滤的字段有：$name，$label1，$label2，$label3，填其他字段报错误码 
 是 
 
 
 
 returnFields 
 string[] 
 返回字段名称
不能为空，查询的字段不存在返回null、字段重复则报错 
 是 
 
 
 
 output有效参数： 

 
 
 
 名称 
 类型 
 说明 
 
 
 
 returnData 
 DataSet 
 返回的数据 
 
 
 errorCodes 
 int32[] 
 错误码数组
只返回一个错误码，数组长度为1 
 
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例1： 过滤查询时空对象(单条件过滤)

 stringMap<var> param;
stringMap<var> input;
stringMap<var> output;
Result code; 
int32 cloudID = getLocalCloudID();
int32 areaID = 0;
uint64 transactionID = 0;
int32 timeout = 10000;
string filter = "$name == \"工厂1\"";
string[] returnFields = {"$name", "$id", "$label1", "$label2", "$label3", "$displayName"};
DataSet returnData;
int32[] errorCodes = {};
param.cloudID = cloudID;
param.areaID = areaID;
param.type = (int32)Enum_App_MLType::SPACETIME; // 枚举须在declare中提前声明
param.transactionID = transactionID;
param.timeout = timeout;
input.mode = (int32)Enum_App_SpaceTimeQueryMode::BY_FILTER; // 枚举须在declare中提前声明
input.filter = filter;
input.returnFields = returnFields;
code = Query(param, input, output);
if(0 == code.ret) 
{
 Trace(2, "过滤查询时空对象执行 =", "success");
 returnData = output.returnData;
 if(0 < returnData.rowLength)
 {
 string spaceTimeName = returnData.cellByName(1, "$name");
 uint64 spaceTimeID = returnData.cellByName(1, "$id");
 Trace(2, "spaceTimeName = ", spaceTimeName);
 Trace(2, "spaceTimeID =", spaceTimeID);
 }
 else
 {
 Trace(2, "returnData.rowLength", "小于或等于0");
 }
}
else
{
 Trace(2, "过滤查询时空对象执行 =", "fail");
 errorCodes = output.errorCodes;
 Trace(2, "过滤查询时空对象code.ret =", code.ret);
 Trace(2, "过滤查询时空对象errorCodes =", errorCodes);
}
 
 脚本示例2： 过滤查询时空对象(多条件过滤)

 stringMap<var> param;
stringMap<var> input;
stringMap<var> output;
Result code; 
int32 cloudID = getLocalCloudID();
int32 areaID = 0;
uint64 transactionID = 0;
int32 timeout = 10000;
string filter = "$name == \"工厂1\" && $lable1 == \"lable1_1\""; 
string[] returnFields = {"$name", "$id", "$label1", "$label2", "$label3", "$displayName"};
DataSet returnData;
int32[] errorCodes = {};
param.cloudID = cloudID;
param.areaID = areaID;
param.type = (int32)Enum_App_MLType::SPACETIME; // 枚举须在declare中提前声明
param.transactionID = transactionID;
param.timeout = timeout;
input.mode = (int32)Enum_App_SpaceTimeQueryMode::BY_FILTER; // 枚举须在declare中提前声明
input.filter = filter;
input.returnFields = returnFields;
code = Query(param, input, output);
if(0 == code.ret) 
{
 Trace(2, "过滤查询时空对象执行 =", "success");
 returnData = output.returnData;
 if(0 < returnData.rowLength)
 {
 string spaceTimeName = returnData.cellByName(1, "$name");
 uint64 spaceTimeID = returnData.cellByName(1, "$id");
 Trace(2, "spaceTimeName = ", spaceTimeName);
 Trace(2, "spaceTimeID =", spaceTimeID);
 }
 else
 {
 Trace(2, "returnData.rowLength", "小于或等于0");
 }
}
else
{
 Trace(2, "过滤查询时空对象执行 =", "fail");
 errorCodes = output.errorCodes;
 Trace(2, "过滤查询时空对象code.ret =", code.ret);
 Trace(2, "过滤查询时空对象errorCodes =", errorCodes);
}
 

# 3.7. App日志

## 3.7. App日志

# 3.7.1. 查询指定App对象日志

### 3.7.1. 查询指定App对象日志

# 3.7.1.1. 按App拷贝查询指定App对象日志

**Result Query(stringMap\ param,stringMap\ input,stringMap\ &output);**
**功能描述：**按App拷贝查询指定App对象日志。
**注意事项：**
4种类型日志分别存储，均支持：
- 日志超出x条后（x默认100000条），按y条滚动式清理（y默认10000条）。
- App引擎服务停止后清理所有日志。
- 可以设置定期清理日志的时间，清理所有日志。默认1个月清理一次。
脚本Trace日志：
- App对象被删除72小时后清理对应的Trace日志。
- 每个App对象Trace日志超出x条后（x默认1000条），按y条滚动式清理（y默认100条）。
**param有效参数：**
cloudID
int32
区域ID
否
0
areaID
int32
数据区ID
否
本App所在数据区
type
int32
对象类型
App脚本日志21020；
App运行日志21021；
App性能单次日志21022；
App性能统计日志21023；
是

timeout
int32
超时时间ms
否
10000
**input有效参数：**
mode
int32
模式，=1
是

startTime
datetime
起始时间
是

endTime
datetime
结束时间
是

queryType
int32
查询类型
1：按App拷贝查询；
是

copyGUID
string
queryType=1时有效；
App拷贝GUID
是

filter
string
过滤字符串
支持过滤的字段有：
1）App脚本日志支持：日志级别；
2）App运行日志支持：待定；
3）App性能单次日志支持：待定；
4）App性能统计日志支持：待定；
填其他字段报错误码；
否

offset
int64
起始行数
最小为1；
否
1
limit
int64
返回条数
最小为1；
如果不够limit条，返回实际条数；
否
1000
**output有效参数：**
returnData
DataSet
返回数据
列名：线程ID、时间戳、日志级别...
count
int64
日志总条数
日志总条数=每次返回条数*次数
errorCodes
int32[]
错误码数组
**错误码:**
参见《错误码_App引擎》
**脚本示例1：**按App拷贝查询指定App对象日志
stringMap param;
stringMap input;
stringMap output;
Result code; 
int32 cloudID = getLocalCloudID();
int32 areaID = 0;
int32 timeout = 10000;
DateTime startTime = DateTimeByTicks(Now().ticks - 864000000000);
DateTime endTime = DateTimeByTicks(Now().ticks + 864000000000);
string copyGUID = "e8901d70-246a-4bb4-8af3-d3cbf5c453d5";
int32[] errorCodes = {};
DataSet returnData;
param.cloudID = cloudID;
param.areaID = areaID;
param.type = (int32)Enum_App_MLType::SCRIPT_LOG; // 枚举须在declare中提前声明
param.timeout = timeout;
input.mode = (int32)Enum_App_LogQueryMode::LOG; // 枚举须在declare中提前声明
input.startTime = startTime;
input.endTime = endTime;
input.queryType = (int32)Enum_App_LogQueryType::BY_COPY; // 枚举须在declare中提前声明
input.copyGUID = copyGUID; // 枚举须在declare中提前声明
code = Query(param, input, output);
if(0 == code.ret) 
{
 Trace(2, "按App拷贝查询指定App对象日志执行 =", "success");
 returnData = output.returnData;
 if(0 Result Query(stringMap<var> param,stringMap<var> input,stringMap<var> &output); 

 功能描述： 按App拷贝查询指定App对象日志。

 注意事项： 

 
 4种类型日志分别存储，均支持： 
 日志超出x条后（x默认100000条），按y条滚动式清理（y默认10000条）。

 App引擎服务停止后清理所有日志。

 可以设置定期清理日志的时间，清理所有日志。默认1个月清理一次。

 

 脚本Trace日志： 
 App对象被删除72小时后清理对应的Trace日志。

 每个App对象Trace日志超出x条后（x默认1000条），按y条滚动式清理（y默认100条）。

 

 
 param有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 cloudID 
 int32 
 区域ID 
 否 
 0 
 
 
 areaID 
 int32 
 数据区ID 
 否 
 本App所在数据区 
 
 
 type 
 int32 
 对象类型
App脚本日志21020；
App运行日志21021；
App性能单次日志21022；
App性能统计日志21023； 
 是 
 
 
 
 timeout 
 int32 
 超时时间ms 
 否 
 10000 
 
 
 input有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 mode 
 int32 
 模式，=1 
 是 
 
 
 
 startTime 
 datetime 
 起始时间 
 是 
 
 
 
 endTime 
 datetime 
 结束时间 
 是 
 
 
 
 queryType 
 int32 
 查询类型
1：按App拷贝查询； 
 是 
 
 
 
 copyGUID 
 string 
 queryType=1时有效；
App拷贝GUID 
 是 
 
 
 
 filter 
 string 
 过滤字符串
支持过滤的字段有：
1）App脚本日志支持：日志级别；
2）App运行日志支持：待定；
3）App性能单次日志支持：待定；
4）App性能统计日志支持：待定；
填其他字段报错误码； 
 否 
 
 
 
 offset 
 int64 
 起始行数
最小为1； 
 否 
 1 
 
 
 limit 
 int64 
 返回条数
最小为1；
如果不够limit条，返回实际条数； 
 否 
 1000 
 
 
 output有效参数： 

 
 
 
 名称 
 类型 
 说明 
 
 
 
 returnData 
 DataSet 
 返回数据
列名：线程ID、时间戳、日志级别... 
 
 
 count 
 int64 
 日志总条数
日志总条数=每次返回条数*次数 
 
 
 errorCodes 
 int32[] 
 错误码数组 
 
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例1： 按App拷贝查询指定App对象日志

 stringMap<var> param;
stringMap<var> input;
stringMap<var> output;
Result code; 
int32 cloudID = getLocalCloudID();
int32 areaID = 0;
int32 timeout = 10000;
DateTime startTime = DateTimeByTicks(Now().ticks - 864000000000);
DateTime endTime = DateTimeByTicks(Now().ticks + 864000000000);
string copyGUID = "e8901d70-246a-4bb4-8af3-d3cbf5c453d5";
int32[] errorCodes = {};
DataSet returnData;
param.cloudID = cloudID;
param.areaID = areaID;
param.type = (int32)Enum_App_MLType::SCRIPT_LOG; // 枚举须在declare中提前声明
param.timeout = timeout;
input.mode = (int32)Enum_App_LogQueryMode::LOG; // 枚举须在declare中提前声明
input.startTime = startTime;
input.endTime = endTime;
input.queryType = (int32)Enum_App_LogQueryType::BY_COPY; // 枚举须在declare中提前声明
input.copyGUID = copyGUID; // 枚举须在declare中提前声明
code = Query(param, input, output);
if(0 == code.ret) 
{
 Trace(2, "按App拷贝查询指定App对象日志执行 =", "success");
 returnData = output.returnData;
 if(0 < returnData.rowLength)
 {
 var[] rowValue1 = returnData.row(1);
 Trace(2, "rowValue1 = ", rowValue1);
 }
 else
 {
 Trace(2, "returnData.rowLength", "小于或等于0");
 }
}
else
{
 Trace(2, "按App拷贝查询指定App对象日志执行 =", "fail");
 errorCodes = output.errorCodes;
 Trace(2, "按App拷贝查询指定App对象日志code.ret =", code.ret);
 Trace(2, "按App拷贝查询指定App对象日志errorCodes =", errorCodes);
}
 

# 3.7.1.2. 按App对象查询指定App对象日志

**Result Query(stringMap\ param,stringMap\ input,stringMap\ &output);**
**功能描述：**按App对象查询指定App对象日志。
**注意事项：**
4种类型日志分别存储，均支持：
- 日志超出x条后（x默认100000条），按y条滚动式清理（y默认10000条）。
- App引擎服务停止后清理所有日志。
- 可以设置定期清理日志的时间，清理所有日志。默认1个月清理一次。
脚本Trace日志：
- App对象被删除72小时后清理对应的Trace日志。
- 每个App对象Trace日志超出x条后（x默认1000条），按y条滚动式清理（y默认100条）。
**param有效参数：**
cloudID
int32
区域ID
否
0
areaID
int32
数据区ID
否
本App所在数据区
type
int32
对象类型
App脚本日志21020；
App运行日志21021；
App性能单次日志21022；
App性能统计日志21023；
是

timeout
int32
超时时间ms
否
10000
**input有效参数：**
mode
int32
模式，=1
是

startTime
datetime
起始时间
是

endTime
datetime
结束时间
是

queryType
int32
查询类型
2：按App对象查询；
是

identifierType
int32
对象的标识类型
queryType=2时有效；
1：ID，使用ID标识
2：NAME，使用名称标识
是

id
uint64
App对象ID
二选一

name
string
App对象名称
二选一

spaceTimeGUID
string
时空对象GUID
为空或不填表示系统时空；
identifierType为name时必填
系统时空
filter
string
过滤字符串
支持过滤的字段有：
1）App脚本日志支持：日志级别；
2）App运行日志支持：待定；
3）App性能单次日志支持：待定；
4）App性能统计日志支持：待定；
填其他字段报错误码；
否

offset
int64
起始行数
最小为1；
否
1
limit
int64
返回条数
最小为1；
如果不够limit条，返回实际条数；
否
1000
**output有效参数：**
returnData
DataSet
返回数据
列名：线程ID、时间戳、日志级别...
count
int64
日志总条数
日志总条数=每次返回条数*次数
errorCodes
int32[]
错误码数组
**错误码:**
参见《错误码_App引擎》
**脚本示例1：**按App对象查询指定App对象日志
stringMap param;
stringMap input;
stringMap output;
Result code; 
int32 cloudID = getLocalCloudID();
int32 areaID = 0;
int32 timeout = 10000;
DateTime startTime = DateTimeByTicks(Now().ticks - 864000000000);
DateTime endTime = DateTimeByTicks(Now().ticks + 864000000000);
uint64 id = 1441151880758559088;
int32[] errorCodes = {};
DataSet returnData;
param.cloudID = cloudID;
param.areaID = areaID;
param.type = (int32)Enum_App_MLType::SCRIPT_LOG; // 枚举须在declare中提前声明
param.timeout = timeout;
input.mode = (int32)Enum_App_LogQueryMode::LOG; // 枚举须在declare中提前声明
input.startTime = startTime;
input.endTime = endTime;
input.queryType = (int32)Enum_App_LogQueryType::BY_OBJECT; // 枚举须在declare中提前声明;
input.identifierType = (int32)Enum_App_IdentifierType::ID; // 枚举须在declare中提前声明
input.id = id;
code = Query(param, input, output);
if(0 == code.ret) 
{
 Trace(2, "按App对象查询指定App对象日志执行 =", "success");
 returnData = output.returnData;
 if(0 Result Query(stringMap<var> param,stringMap<var> input,stringMap<var> &output); 

 功能描述： 按App对象查询指定App对象日志。

 注意事项： 

 
 4种类型日志分别存储，均支持： 
 日志超出x条后（x默认100000条），按y条滚动式清理（y默认10000条）。

 App引擎服务停止后清理所有日志。

 可以设置定期清理日志的时间，清理所有日志。默认1个月清理一次。

 

 脚本Trace日志： 
 App对象被删除72小时后清理对应的Trace日志。

 每个App对象Trace日志超出x条后（x默认1000条），按y条滚动式清理（y默认100条）。

 

 
 param有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 cloudID 
 int32 
 区域ID 
 否 
 0 
 
 
 areaID 
 int32 
 数据区ID 
 否 
 本App所在数据区 
 
 
 type 
 int32 
 对象类型
App脚本日志21020；
App运行日志21021；
App性能单次日志21022；
App性能统计日志21023； 
 是 
 
 
 
 timeout 
 int32 
 超时时间ms 
 否 
 10000 
 
 
 input有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 mode 
 int32 
 模式，=1 
 是 
 
 
 
 startTime 
 datetime 
 起始时间 
 是 
 
 
 
 endTime 
 datetime 
 结束时间 
 是 
 
 
 
 queryType 
 int32 
 查询类型
2：按App对象查询； 
 是 
 
 
 
 identifierType 
 int32 
 对象的标识类型
queryType=2时有效；
1：ID，使用ID标识
2：NAME，使用名称标识 
 是 
 
 
 
 id 
 uint64 
 App对象ID 
 二选一 
 
 
 
 name 
 string 
 App对象名称 
 二选一 
 
 
 
 spaceTimeGUID 
 string 
 时空对象GUID
为空或不填表示系统时空； 
 identifierType为name时必填 
 系统时空 
 
 
 filter 
 string 
 过滤字符串
支持过滤的字段有：
1）App脚本日志支持：日志级别；
2）App运行日志支持：待定；
3）App性能单次日志支持：待定；
4）App性能统计日志支持：待定；
填其他字段报错误码； 
 否 
 
 
 
 offset 
 int64 
 起始行数
最小为1； 
 否 
 1 
 
 
 limit 
 int64 
 返回条数
最小为1；
如果不够limit条，返回实际条数； 
 否 
 1000 
 
 
 output有效参数： 

 
 
 
 名称 
 类型 
 说明 
 
 
 
 returnData 
 DataSet 
 返回数据
列名：线程ID、时间戳、日志级别... 
 
 
 count 
 int64 
 日志总条数
日志总条数=每次返回条数*次数 
 
 
 errorCodes 
 int32[] 
 错误码数组 
 
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例1： 按App对象查询指定App对象日志

 stringMap<var> param;
stringMap<var> input;
stringMap<var> output;
Result code; 
int32 cloudID = getLocalCloudID();
int32 areaID = 0;
int32 timeout = 10000;
DateTime startTime = DateTimeByTicks(Now().ticks - 864000000000);
DateTime endTime = DateTimeByTicks(Now().ticks + 864000000000);
uint64 id = 1441151880758559088;
int32[] errorCodes = {};
DataSet returnData;
param.cloudID = cloudID;
param.areaID = areaID;
param.type = (int32)Enum_App_MLType::SCRIPT_LOG; // 枚举须在declare中提前声明
param.timeout = timeout;
input.mode = (int32)Enum_App_LogQueryMode::LOG; // 枚举须在declare中提前声明
input.startTime = startTime;
input.endTime = endTime;
input.queryType = (int32)Enum_App_LogQueryType::BY_OBJECT; // 枚举须在declare中提前声明;
input.identifierType = (int32)Enum_App_IdentifierType::ID; // 枚举须在declare中提前声明
input.id = id;
code = Query(param, input, output);
if(0 == code.ret) 
{
 Trace(2, "按App对象查询指定App对象日志执行 =", "success");
 returnData = output.returnData;
 if(0 < returnData.rowLength)
 {
 var[] rowValue1 = returnData.row(1);
 Trace(2, "rowValue1 = ", rowValue1);
 }
 else
 {
 Trace(2, "returnData.rowLength", "小于或等于0");
 }
}
else
{
 Trace(2, "按App对象查询指定App对象日志执行 =", "fail");
 errorCodes = output.errorCodes;
 Trace(2, "按App对象查询指定App对象日志code.ret =", code.ret);
 Trace(2, "按App对象查询指定App对象日志errorCodes =", errorCodes);
}
 

# 3.7.2. 查询App对象日志的配置项

### 3.7.2. 查询App对象日志的配置项

# 3.7.2.1. 按数据区粒度查询

**Result Query(stringMap\ param,stringMap\ input,stringMap\ &output);**
**功能描述：**按数据区粒度查询App对象日志的配置项。
**注意事项：**
控制粒度是数据区的配置项，才能通过此函数查询。
**param有效参数：**
cloudID
int32
区域ID
否
0
areaID
int32
数据区ID
否
本App所在数据区
type
int32
对象类型
App脚本日志21020；
App运行日志21021；
App性能单次日志21022；
App性能统计日志21023；
是

timeout
int32
超时时间ms
否
10000
**input有效参数：**
mode
int32
模式，=2
是

granularity
int32
控制粒度
1：数据区
是

returnFields
string[]
返回字段名称
不能为空，查询的字段不存在返回null、字段重复报错；
是

**output有效参数：**
returnData
DataSet
返回数据
errorCodes
int32[]
错误码数组
**错误码:**
参见《错误码_App引擎》
**脚本示例1：**按数据区粒度查询App对象日志的配置项
stringMap param;
stringMap input;
stringMap output;
Result code; 
int32 cloudID = getLocalCloudID();
int32 areaID = 0;
int32 timeout = 10000;
string[] returnFields = {"cleanPeriod"};
int32[] errorCodes = {};
DataSet returnData;
param.cloudID = cloudID;
param.areaID = areaID;
param.type = (int32)Enum_App_MLType::SCRIPT_LOG; // 枚举须在declare中提前声明
param.timeout = timeout;
input.mode = (int32)Enum_App_LogQueryMode::LOG_CONFIG; // 枚举须在declare中提前声明
input.granularity = (int32)Enum_App_SPACETIME::AREA; // 数据区
input.returnFields = returnFields;
code = Query(param, input, output);
if(0 == code.ret) 
{
 Trace(2, "按数据区粒度查询App对象日志的配置项执行 =", "success");
 returnData = output.returnData;
 if(0 Result Query(stringMap<var> param,stringMap<var> input,stringMap<var> &output); 

 功能描述： 按数据区粒度查询App对象日志的配置项。

 注意事项： 

 
 控制粒度是数据区的配置项，才能通过此函数查询。

 
 param有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 cloudID 
 int32 
 区域ID 
 否 
 0 
 
 
 areaID 
 int32 
 数据区ID 
 否 
 本App所在数据区 
 
 
 type 
 int32 
 对象类型
App脚本日志21020；
App运行日志21021；
App性能单次日志21022；
App性能统计日志21023； 
 是 
 
 
 
 timeout 
 int32 
 超时时间ms 
 否 
 10000 
 
 
 input有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 mode 
 int32 
 模式，=2 
 是 
 
 
 
 granularity 
 int32 
 控制粒度
1：数据区 
 是 
 
 
 
 returnFields 
 string[] 
 返回字段名称
不能为空，查询的字段不存在返回null、字段重复报错； 
 是 
 
 
 
 output有效参数： 

 
 
 
 名称 
 类型 
 说明 
 
 
 
 returnData 
 DataSet 
 返回数据 
 
 
 errorCodes 
 int32[] 
 错误码数组 
 
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例1： 按数据区粒度查询App对象日志的配置项

 stringMap<var> param;
stringMap<var> input;
stringMap<var> output;
Result code; 
int32 cloudID = getLocalCloudID();
int32 areaID = 0;
int32 timeout = 10000;
string[] returnFields = {"cleanPeriod"};
int32[] errorCodes = {};
DataSet returnData;
param.cloudID = cloudID;
param.areaID = areaID;
param.type = (int32)Enum_App_MLType::SCRIPT_LOG; // 枚举须在declare中提前声明
param.timeout = timeout;
input.mode = (int32)Enum_App_LogQueryMode::LOG_CONFIG; // 枚举须在declare中提前声明
input.granularity = (int32)Enum_App_SPACETIME::AREA; // 数据区
input.returnFields = returnFields;
code = Query(param, input, output);
if(0 == code.ret) 
{
 Trace(2, "按数据区粒度查询App对象日志的配置项执行 =", "success");
 returnData = output.returnData;
 if(0 < returnData.rowLength)
 {
 var[] rowValue1 = returnData.row(1);
 Trace(2, "rowValue1 = ", rowValue1);
 }
 else
 {
 Trace(2, "returnData.rowLength", "小于或等于0");
 }
}
else
{
 Trace(2, "按数据区粒度查询App对象日志的配置项执行 =", "fail");
 errorCodes = output.errorCodes;
 Trace(2, "按数据区粒度查询App对象日志的配置项code.ret =", code.ret);
 Trace(2, "按数据区粒度查询App对象日志的配置项errorCodes =", errorCodes);
}
 

# 3.7.2.2. 按时空对象粒度查询

**Result Query(stringMap\ param,stringMap\ input,stringMap\ &output);**
**功能描述：**按时空对象粒度查询App对象日志的配置项。
**注意事项：**
控制粒度是时空的配置项，才能通过此函数查询。如果按时空粒度配置后，又以App粒度再次配置，不影响时空上的配置结果。
**param有效参数：**
cloudID
int32
区域ID
否
0
areaID
int32
数据区ID
否
本App所在数据区
type
int32
对象类型
App脚本日志21020；
App运行日志21021；
App性能单次日志21022；
App性能统计日志21023；
是

timeout
int32
超时时间ms
否
10000
**input有效参数：**
mode
int32
模式，=2
是

granularity
int32
控制粒度
2：根时空对象（含后代）
是

spaceTimeGUID
string
时空对象GUID
为空或不填表示系统时空；
否
系统时空
returnFields
string[]
返回字段名称
不能为空，查询的字段不存在返回null、字段重复报错；
是

**output有效参数：**
returnData
DataSet
返回数据：
errorCodes
int32[]
错误码数组
**错误码:**
参见《错误码_App引擎》
**脚本示例1：**按时空对象粒度查询App对象日志的配置项
stringMap param;
stringMap input;
stringMap output;
Result code; 
int32 cloudID = getLocalCloudID();
int32 areaID = 0;
int32 timeout = 10000;
string spaceTimeGUID = "2c4ebc4a-f8bf-40b2-836e-8821ae30479f";
string[] returnFields = {"logLevel"};
int32[] errorCodes = {};
DataSet returnData;
param.cloudID = cloudID;
param.areaID = areaID;
param.type = (int32)Enum_App_MLType::SCRIPT_LOG; // 枚举须在declare中提前声明
param.timeout = timeout;
input.mode = (int32)Enum_App_LogQueryMode::LOG_CONFIG; // 枚举须在declare中提前声明
input.granularity = (int32)Enum_App_SPACETIME::SPACETIME; // 时空对象（不含后代）
input.spaceTimeGUID = spaceTimeGUID;
input.returnFields = returnFields;
code = Query(param, input, output);
if(0 == code.ret) 
{
 Trace(2, "按时空对象粒度查询App对象日志的配置项执行 =", "success");
 returnData = output.returnData;
 if(0 Result Query(stringMap<var> param,stringMap<var> input,stringMap<var> &output); 

 功能描述： 按时空对象粒度查询App对象日志的配置项。

 注意事项： 

 
 控制粒度是时空的配置项，才能通过此函数查询。如果按时空粒度配置后，又以App粒度再次配置，不影响时空上的配置结果。

 
 param有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 cloudID 
 int32 
 区域ID 
 否 
 0 
 
 
 areaID 
 int32 
 数据区ID 
 否 
 本App所在数据区 
 
 
 type 
 int32 
 对象类型
App脚本日志21020；
App运行日志21021；
App性能单次日志21022；
App性能统计日志21023； 
 是 
 
 
 
 timeout 
 int32 
 超时时间ms 
 否 
 10000 
 
 
 input有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 mode 
 int32 
 模式，=2 
 是 
 
 
 
 granularity 
 int32 
 控制粒度
2：根时空对象（含后代） 
 是 
 
 
 
 spaceTimeGUID 
 string 
 时空对象GUID
为空或不填表示系统时空； 
 否 
 系统时空 
 
 
 returnFields 
 string[] 
 返回字段名称
不能为空，查询的字段不存在返回null、字段重复报错； 
 是 
 
 
 
 output有效参数： 

 
 
 
 名称 
 类型 
 说明 
 
 
 
 returnData 
 DataSet 
 返回数据： 
 
 
 errorCodes 
 int32[] 
 错误码数组 
 
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例1： 按时空对象粒度查询App对象日志的配置项

 stringMap<var> param;
stringMap<var> input;
stringMap<var> output;
Result code; 
int32 cloudID = getLocalCloudID();
int32 areaID = 0;
int32 timeout = 10000;
string spaceTimeGUID = "2c4ebc4a-f8bf-40b2-836e-8821ae30479f";
string[] returnFields = {"logLevel"};
int32[] errorCodes = {};
DataSet returnData;
param.cloudID = cloudID;
param.areaID = areaID;
param.type = (int32)Enum_App_MLType::SCRIPT_LOG; // 枚举须在declare中提前声明
param.timeout = timeout;
input.mode = (int32)Enum_App_LogQueryMode::LOG_CONFIG; // 枚举须在declare中提前声明
input.granularity = (int32)Enum_App_SPACETIME::SPACETIME; // 时空对象（不含后代）
input.spaceTimeGUID = spaceTimeGUID;
input.returnFields = returnFields;
code = Query(param, input, output);
if(0 == code.ret) 
{
 Trace(2, "按时空对象粒度查询App对象日志的配置项执行 =", "success");
 returnData = output.returnData;
 if(0 < returnData.rowLength)
 {
 var[] rowValue1 = returnData.row(1);
 Trace(2, "rowValue1 = ", rowValue1);
 }
 else
 {
 Trace(2, "returnData.rowLength", "小于或等于0");
 }
}
else
{
 Trace(2, "按时空对象粒度查询App对象日志的配置项执行 =", "fail");
 errorCodes = output.errorCodes;
 Trace(2, "按时空对象粒度查询App对象日志的配置项code.ret =", code.ret);
 Trace(2, "按时空对象粒度查询App对象日志的配置项errorCodes =", errorCodes);
}
 

# 3.7.2.3. 按根App对象粒度查询

**Result Query(stringMap\ param,stringMap\ input,stringMap\ &output);**
**功能描述：**按根App对象粒度查询App对象日志的配置项。
**注意事项：**
控制粒度是时空或App的配置项，都能通过此函数查询。
如果按时空粒度配置后，对App对象生效，也能按App粒度查出配置结果。
如果按时空粒度配置后，又以App粒度再次配置，以App上配置结果为准。
如果按App粒度配置后，又以时空粒度再次配置，对时空内所有App生效。
**param有效参数：**
cloudID
int32
区域ID
否
0
areaID
int32
数据区ID
否
本App所在数据区
type
int32
对象类型
App脚本日志21020；
App运行日志21021；
App性能单次日志21022；
App性能统计日志21023；
是

timeout
int32
超时时间ms
否
10000
**input有效参数：**
mode
int32
模式，=2
是

granularity
int32
控制粒度
3：根App对象（含子App）
是

identifierType
int32
对象的标识类型
1：ID，使用ID标识；
2：NAME，使用名称标识；
是

id
uint64
App对象ID
二选一

name
string
App对象名称
二选一

spaceTimeGUID
string
时空对象GUID
为空或不填表示系统时空；
否
系统时空
returnFields
string[]
返回字段名称
不能为空，查询的字段不存在返回null、字段重复报错；
是

**output有效参数：**
returnData
DataSet
返回数据
errorCodes
int32[]
错误码数组
**错误码:**
参见《错误码_App引擎》
**脚本示例1：**按根App对象粒度查询App对象日志的配置项
stringMap param;
stringMap input;
stringMap output;
Result code; 
int32 cloudID = getLocalCloudID();
int32 areaID = 0;
int32 timeout = 10000;
uint64 id = 5911255985900486666;
string[] returnFields = {"logLevel"};
int32[] errorCodes = {};
DataSet returnData;
param.cloudID = cloudID;
param.areaID = areaID;
param.type = (int32)Enum_App_MLType::SCRIPT_LOG; // 枚举须在declare中提前声明
param.timeout = timeout;
input.mode = (int32)Enum_App_LogQueryMode::LOG_CONFIG; // 枚举须在declare中提前声明
input.granularity = (int32)Enum_App_SPACETIME::APP; // 根App对象（含子App）
input.identifierType = (int32)Enum_App_IdentifierType::ID; // 枚举须在declare中提前声明
input.id = id;
input.returnFields = returnFields;
code = Query(param, input, output);
if(0 == code.ret) 
{
 Trace(2, "按根App对象粒度查询App对象日志的配置项执行 =", "success");
 returnData = output.returnData;
 if(0 Result Query(stringMap<var> param,stringMap<var> input,stringMap<var> &output); 

 功能描述： 按根App对象粒度查询App对象日志的配置项。

 注意事项： 

 
 控制粒度是时空或App的配置项，都能通过此函数查询。

 如果按时空粒度配置后，对App对象生效，也能按App粒度查出配置结果。

 如果按时空粒度配置后，又以App粒度再次配置，以App上配置结果为准。

 如果按App粒度配置后，又以时空粒度再次配置，对时空内所有App生效。

 
 param有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 cloudID 
 int32 
 区域ID 
 否 
 0 
 
 
 areaID 
 int32 
 数据区ID 
 否 
 本App所在数据区 
 
 
 type 
 int32 
 对象类型
App脚本日志21020；
App运行日志21021；
App性能单次日志21022；
App性能统计日志21023； 
 是 
 
 
 
 timeout 
 int32 
 超时时间ms 
 否 
 10000 
 
 
 input有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 mode 
 int32 
 模式，=2 
 是 
 
 
 
 granularity 
 int32 
 控制粒度
3：根App对象（含子App） 
 是 
 
 
 
 identifierType 
 int32 
 对象的标识类型
1：ID，使用ID标识；
2：NAME，使用名称标识； 
 是 
 
 
 
 id 
 uint64 
 App对象ID 
 二选一 
 
 
 
 name 
 string 
 App对象名称 
 二选一 
 
 
 
 spaceTimeGUID 
 string 
 时空对象GUID
为空或不填表示系统时空； 
 否 
 系统时空 
 
 
 returnFields 
 string[] 
 返回字段名称
不能为空，查询的字段不存在返回null、字段重复报错； 
 是 
 
 
 
 output有效参数： 

 
 
 
 名称 
 类型 
 说明 
 
 
 
 returnData 
 DataSet 
 返回数据 
 
 
 errorCodes 
 int32[] 
 错误码数组 
 
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例1： 按根App对象粒度查询App对象日志的配置项

 stringMap<var> param;
stringMap<var> input;
stringMap<var> output;
Result code; 
int32 cloudID = getLocalCloudID();
int32 areaID = 0;
int32 timeout = 10000;
uint64 id = 5911255985900486666;
string[] returnFields = {"logLevel"};
int32[] errorCodes = {};
DataSet returnData;
param.cloudID = cloudID;
param.areaID = areaID;
param.type = (int32)Enum_App_MLType::SCRIPT_LOG; // 枚举须在declare中提前声明
param.timeout = timeout;
input.mode = (int32)Enum_App_LogQueryMode::LOG_CONFIG; // 枚举须在declare中提前声明
input.granularity = (int32)Enum_App_SPACETIME::APP; // 根App对象（含子App）
input.identifierType = (int32)Enum_App_IdentifierType::ID; // 枚举须在declare中提前声明
input.id = id;
input.returnFields = returnFields;
code = Query(param, input, output);
if(0 == code.ret) 
{
 Trace(2, "按根App对象粒度查询App对象日志的配置项执行 =", "success");
 returnData = output.returnData;
 if(0 < returnData.rowLength)
 {
 var[] rowValue1 = returnData.row(1);
 Trace(2, "rowValue1 = ", rowValue1);
 }
 else
 {
 Trace(2, "returnData.rowLength", "小于或等于0");
 }
}
else
{
 Trace(2, "按根App对象粒度查询App对象日志的配置项执行 =", "fail");
 errorCodes = output.errorCodes;
 Trace(2, "按根App对象粒度查询App对象日志的配置项code.ret =", code.ret);
 Trace(2, "按根App对象粒度查询App对象日志的配置项errorCodes =", errorCodes);
}
 

# 3.7.3. 修改App对象日志的配置项

### 3.7.3. 修改App对象日志的配置项

# 3.7.3.1. 按数据区粒度控制

**Result Update(stringMap\ param,stringMap\ input,stringMap\ &output);**
**功能描述：**按数据区粒度修改App对象日志的配置项。
**注意事项：**
控制粒度是数据区的配置项，才能通过此函数修改。
**param有效参数：**
cloudID
int32
区域ID
否
0
areaID
int32
数据区ID
否
本App所在数据区
type
int32
对象类型
App脚本日志21020；
App运行日志21021；
App性能单次日志21022；
App性能统计日志21023；
是

timeout
int32
超时时间ms
否
10000
**input有效参数：**
granularity
int32
控制粒度
1：数据区
是

logConfig
stringMap 
日志配置项
logConfig.configName=value;
是

**output有效参数：**
errorCodes
int32[]
错误码数组
**错误码:**
参见《错误码_App引擎》
**脚本示例1：**按数据区粒度修改App对象日志的配置项
stringMap param;
stringMap input;
stringMap output;
Result code; 
int32 cloudID = getLocalCloudID();
int32 areaID = 0;
int32 timeout = 10000;
stringMap logConfig;
logConfig.cleanPeriod = 100;
int32[] errorCodes = {};
param.cloudID = cloudID;
param.areaID = areaID;
param.type = (int32)Enum_App_MLType::SCRIPT_LOG; // 枚举须在declare中提前声明
param.timeout = timeout;
input.granularity = (int32)Enum_App_LogGranularity::AREA; // 数据区
input.logConfig = logConfig;
code = Update(param, input, output);
if(0 == code.ret) 
{
 Trace(2, "按数据区粒度修改App对象日志的配置项执行 =", "success");
}
else
{
 Trace(2, "按数据区粒度修改App对象日志的配置项执行 =", "fail");
 errorCodes = output.errorCodes;
 Trace(2, "按数据区粒度修改App对象日志的配置项code.ret =", code.ret);
 Trace(2, "按数据区粒度修改App对象日志的配置项errorCodes =", errorCodes);
}

#### 3.7.3.1. 按数据区粒度控制

 Result Update(stringMap<var> param,stringMap<var> input,stringMap<var> &output); 

 功能描述： 按数据区粒度修改App对象日志的配置项。

 注意事项： 

 
 控制粒度是数据区的配置项，才能通过此函数修改。

 
 param有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 cloudID 
 int32 
 区域ID 
 否 
 0 
 
 
 areaID 
 int32 
 数据区ID 
 否 
 本App所在数据区 
 
 
 type 
 int32 
 对象类型
App脚本日志21020；
App运行日志21021；
App性能单次日志21022；
App性能统计日志21023； 
 是 
 
 
 
 timeout 
 int32 
 超时时间ms 
 否 
 10000 
 
 
 input有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 granularity 
 int32 
 控制粒度
1：数据区 
 是 
 
 
 
 logConfig 
 stringMap < var> 
 日志配置项
logConfig.configName=value; 
 是 
 
 
 
 output有效参数： 

 
 
 
 名称 
 类型 
 说明 
 
 
 
 errorCodes 
 int32[] 
 错误码数组 
 
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例1： 按数据区粒度修改App对象日志的配置项

 stringMap<var> param;
stringMap<var> input;
stringMap<var> output;
Result code; 
int32 cloudID = getLocalCloudID();
int32 areaID = 0;
int32 timeout = 10000;
stringMap<var> logConfig;
logConfig.cleanPeriod = 100;
int32[] errorCodes = {};
param.cloudID = cloudID;
param.areaID = areaID;
param.type = (int32)Enum_App_MLType::SCRIPT_LOG; // 枚举须在declare中提前声明
param.timeout = timeout;
input.granularity = (int32)Enum_App_LogGranularity::AREA; // 数据区
input.logConfig = logConfig;
code = Update(param, input, output);
if(0 == code.ret) 
{
 Trace(2, "按数据区粒度修改App对象日志的配置项执行 =", "success");
}
else
{
 Trace(2, "按数据区粒度修改App对象日志的配置项执行 =", "fail");
 errorCodes = output.errorCodes;
 Trace(2, "按数据区粒度修改App对象日志的配置项code.ret =", code.ret);
 Trace(2, "按数据区粒度修改App对象日志的配置项errorCodes =", errorCodes);
}
 

# 3.7.3.2. 按时空对象粒度控制

**Result Update(stringMap\ param,stringMap\ input,stringMap\ &output);**
**功能描述：**按时空对象粒度修改App对象日志的配置项。
**注意事项：**
控制粒度是时空的配置项，才能通过此函数修改。
**param有效参数：**
cloudID
int32
区域ID
否
0
areaID
int32
数据区ID
否
本App所在数据区
type
int32
对象类型
App脚本日志21020；
App运行日志21021；
App性能单次日志21022；
App性能统计日志21023；
是

timeout
int32
超时时间ms
否
10000
**input有效参数：**
granularity
int32
控制粒度
2：根时空对象（含后代）
是

spaceTimeGUID
string
时空对象GUID
为空或不填表示系统时空；
否
系统时空
logConfig
stringMap 
日志配置项
logConfig.configName=value;
是

**output有效参数：**
errorCodes
int32[]
错误码数组
**错误码:**
参见《错误码_App引擎》
**脚本示例1：**按时空对象粒度修改App对象日志的配置项
stringMap param;
stringMap input;
stringMap output;
Result code; 
int32 cloudID = getLocalCloudID();
int32 areaID = 0;
int32 timeout = 10000;
string spaceTimeGUID = "2c4ebc4a-f8bf-40b2-836e-8821ae30479f";
stringMap logConfig;
logConfig.logLevel = 2;
int32[] errorCodes = {};
param.cloudID = cloudID;
param.areaID = areaID;
param.type = (int32)Enum_App_MLType::SCRIPT_LOG; // 枚举须在declare中提前声明
param.timeout = timeout;
input.granularity = (int32)Enum_App_SPACETIME::SPACETIME; // 时空对象（不含后代）
input.spaceTimeGUID = spaceTimeGUID;
input.logConfig = logConfig;
code = Update(param, input, output);
if(0 == code.ret) 
{
 Trace(2, "按时空对象粒度修改App对象日志的配置项执行 =", "success");
}
else
{
 Trace(2, "按时空对象粒度修改App对象日志的配置项执行 =", "fail");
 errorCodes = output.errorCodes;
 Trace(2, "按时空对象粒度修改App对象日志的配置项code.ret =", code.ret);
 Trace(2, "按时空对象粒度修改App对象日志的配置项errorCodes =", errorCodes);
}

#### 3.7.3.2. 按时空对象粒度控制

 Result Update(stringMap<var> param,stringMap<var> input,stringMap<var> &output); 

 功能描述： 按时空对象粒度修改App对象日志的配置项。

 注意事项： 

 
 控制粒度是时空的配置项，才能通过此函数修改。

 
 param有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 cloudID 
 int32 
 区域ID 
 否 
 0 
 
 
 areaID 
 int32 
 数据区ID 
 否 
 本App所在数据区 
 
 
 type 
 int32 
 对象类型
App脚本日志21020；
App运行日志21021；
App性能单次日志21022；
App性能统计日志21023； 
 是 
 
 
 
 timeout 
 int32 
 超时时间ms 
 否 
 10000 
 
 
 input有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 granularity 
 int32 
 控制粒度
2：根时空对象（含后代） 
 是 
 
 
 
 spaceTimeGUID 
 string 
 时空对象GUID
为空或不填表示系统时空； 
 否 
 系统时空 
 
 
 logConfig 
 stringMap< var> 
 日志配置项
logConfig.configName=value; 
 是 
 
 
 
 output有效参数： 

 
 
 
 名称 
 类型 
 说明 
 
 
 
 errorCodes 
 int32[] 
 错误码数组 
 
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例1： 按时空对象粒度修改App对象日志的配置项

 stringMap<var> param;
stringMap<var> input;
stringMap<var> output;
Result code; 
int32 cloudID = getLocalCloudID();
int32 areaID = 0;
int32 timeout = 10000;
string spaceTimeGUID = "2c4ebc4a-f8bf-40b2-836e-8821ae30479f";
stringMap<var> logConfig;
logConfig.logLevel = 2;
int32[] errorCodes = {};
param.cloudID = cloudID;
param.areaID = areaID;
param.type = (int32)Enum_App_MLType::SCRIPT_LOG; // 枚举须在declare中提前声明
param.timeout = timeout;
input.granularity = (int32)Enum_App_SPACETIME::SPACETIME; // 时空对象（不含后代）
input.spaceTimeGUID = spaceTimeGUID;
input.logConfig = logConfig;
code = Update(param, input, output);
if(0 == code.ret) 
{
 Trace(2, "按时空对象粒度修改App对象日志的配置项执行 =", "success");
}
else
{
 Trace(2, "按时空对象粒度修改App对象日志的配置项执行 =", "fail");
 errorCodes = output.errorCodes;
 Trace(2, "按时空对象粒度修改App对象日志的配置项code.ret =", code.ret);
 Trace(2, "按时空对象粒度修改App对象日志的配置项errorCodes =", errorCodes);
}
 

# 3.7.3.3. 按根App对象粒度控制

**Result Update(stringMap\ param,stringMap\ input,stringMap\ &output);**
**功能描述：**按根App对象粒度修改App对象日志的配置项。
**注意事项：**
控制粒度是App的配置项，才能通过此函数修改。
如果按App粒度修改配置项后，再次以时空粒度修改，可以修改成功，对时空内所有App都生效。
**param有效参数：**
cloudID
int32
区域ID
否
0
areaID
int32
数据区ID
否
本App所在数据区
type
int32
对象类型
App脚本日志21020；
App运行日志21021；
App性能单次日志21022；
App性能统计日志21023；
是

timeout
int32
超时时间ms
否
10000
**input有效参数：**
granularity
int32
控制粒度
3：根App对象（含子App）
是

identifierType
int32
对象的标识类型
1：ID，使用ID标识
2：NAME，使用名称标识
是

id
uint64
App对象ID
二选一

name
string
App对象名称
二选一

spaceTimeGUID
string
时空对象GUID
为空或不填表示系统时空；
否
系统时空
logConfig
stringMap 
日志配置项
logConfig.configName=value;
是

**output有效参数：**
errorCodes
int32[]
错误码数组
**错误码:**
参见《错误码_App引擎》
**脚本示例1：**按根App对象粒度修改App对象日志的配置项
stringMap param;
stringMap input;
stringMap output;
Result code; 
int32 cloudID = getLocalCloudID();
int32 areaID = 0;
int32 timeout = 10000;
uint64 id = 5911255985900486666;
stringMap logConfig;
logConfig.logLevel = 2;
int32[] errorCodes = {};
param.cloudID = cloudID;
param.areaID = areaID;
param.type = (int32)Enum_App_MLType::SCRIPT_LOG; // 枚举须在declare中提前声明
param.timeout = timeout;
input.granularity = (int32)Enum_App_SPACETIME::APP; // 根App对象（含子App）
input.identifierType = (int32)Enum_App_IdentifierType::ID; // 枚举须在declare中提前声明
input.id = id;
input.logConfig = logConfig;
code = Update(param, input, output);
if(0 == code.ret) 
{
 Trace(2, "按根App对象粒度修改App对象日志的配置项执行 =", "success");
}
else
{
 Trace(2, "按根App对象粒度修改App对象日志的配置项执行 =", "fail");
 errorCodes = output.errorCodes;
 Trace(2, "按根App对象粒度修改App对象日志的配置项code.ret =", code.ret);
 Trace(2, "按根App对象粒度修改App对象日志的配置项errorCodes =", errorCodes);
}

#### 3.7.3.3. 按根App对象粒度控制

 Result Update(stringMap<var> param,stringMap<var> input,stringMap<var> &output); 

 功能描述： 按根App对象粒度修改App对象日志的配置项。

 注意事项： 

 
 控制粒度是App的配置项，才能通过此函数修改。

 如果按App粒度修改配置项后，再次以时空粒度修改，可以修改成功，对时空内所有App都生效。

 
 param有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 cloudID 
 int32 
 区域ID 
 否 
 0 
 
 
 areaID 
 int32 
 数据区ID 
 否 
 本App所在数据区 
 
 
 type 
 int32 
 对象类型
App脚本日志21020；
App运行日志21021；
App性能单次日志21022；
App性能统计日志21023； 
 是 
 
 
 
 timeout 
 int32 
 超时时间ms 
 否 
 10000 
 
 
 input有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 granularity 
 int32 
 控制粒度
3：根App对象（含子App） 
 是 
 
 
 
 identifierType 
 int32 
 对象的标识类型
1：ID，使用ID标识
2：NAME，使用名称标识 
 是 
 
 
 
 id 
 uint64 
 App对象ID 
 二选一 
 
 
 
 name 
 string 
 App对象名称 
 二选一 
 
 
 
 spaceTimeGUID 
 string 
 时空对象GUID
为空或不填表示系统时空； 
 否 
 系统时空 
 
 
 logConfig 
 stringMap< var> 
 日志配置项
logConfig.configName=value; 
 是 
 
 
 
 output有效参数： 

 
 
 
 名称 
 类型 
 说明 
 
 
 
 errorCodes 
 int32[] 
 错误码数组 
 
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例1： 按根App对象粒度修改App对象日志的配置项

 stringMap<var> param;
stringMap<var> input;
stringMap<var> output;
Result code; 
int32 cloudID = getLocalCloudID();
int32 areaID = 0;
int32 timeout = 10000;
uint64 id = 5911255985900486666;
stringMap<var> logConfig;
logConfig.logLevel = 2;
int32[] errorCodes = {};
param.cloudID = cloudID;
param.areaID = areaID;
param.type = (int32)Enum_App_MLType::SCRIPT_LOG; // 枚举须在declare中提前声明
param.timeout = timeout;
input.granularity = (int32)Enum_App_SPACETIME::APP; // 根App对象（含子App）
input.identifierType = (int32)Enum_App_IdentifierType::ID; // 枚举须在declare中提前声明
input.id = id;
input.logConfig = logConfig;
code = Update(param, input, output);
if(0 == code.ret) 
{
 Trace(2, "按根App对象粒度修改App对象日志的配置项执行 =", "success");
}
else
{
 Trace(2, "按根App对象粒度修改App对象日志的配置项执行 =", "fail");
 errorCodes = output.errorCodes;
 Trace(2, "按根App对象粒度修改App对象日志的配置项code.ret =", code.ret);
 Trace(2, "按根App对象粒度修改App对象日志的配置项errorCodes =", errorCodes);
}
 

# 3.7.4. App对象日志的配置项

**控制粒度：**
1：数据区
2：时空对象（不含后代）
3：根App对象（含子App）
App脚本日志
2、3
int32 logLevel
App对象存库日志级别（1~5）
5

2、3
int32 logFormat
App对象脚本日志输出形式，1：多行输出，2：单行输出
1

2、3
uint32 logLengthLimit
App对象脚本日志单条长度限制
128kb，暂不支持配置

1
uint32 cleanPeriodDeletedApp
被删除的App脚本日志定期清理时间，单位：小时
72小时，暂不支持配置

1
uint32 cleanPeriod
所有App脚本日志定期清理时间，清除所有日志，单位：天
30天[1，30]

1
uint32 capacityLimit
所有App脚本日志滚动清理阈值（超出多少条时滚动清理）
100000条，暂不支持配置

1
uint32 clearStep
所有App脚本日志每次滚动清理条数
10000条，暂不支持配置

3
uint32 capacityLimitPerApp
单个App脚本日志滚动清理阈值（超出多少条时滚动清理）
1000条，暂不支持配置

3
uint32 clearStepPerApp
单个App脚本日志每次滚动清理条数
100条，暂不支持配置
App运行日志
1
uint32 cleanPeriod
App运行日志定期清理时间，清除所有日志，单位：天
30天[1，30]

1
uint32 capacityLimit
App运行日志滚动清理限值（超出多少条时滚动清理）
100000条，暂不支持配置

1
uint32 clearStep
App运行日志每次滚动清理条数
10000条，暂不支持配置
App性能日志
2、3
bool enable
是否开启性能分析
否

2、3
int32[] taskType
开启任务类型（多选），1：OnCreate，2：OnDestroy，3：定时回调，4：订阅回调，5：外部接口调用
无

2、3
bool tsdbEnable
是否开启库操作性能分析
否

2、3
uint32 frequency
性能分析频率，单位：分钟（只针对多次任务与资源占用分析有效）
10分钟[1，60]

1
uint32 cleanPeriod
App性能日志定期清理时间，清除所有日志，单位：天
30天[1，30]

1
uint32 capacityLimit
App性能日志滚动清理限值（超出多少条时滚动清理）
100000条，暂不支持配置

1
uint32 clearStep
App性能日志每次滚动清理条数
10000条，暂不支持配置

### 3.7.4. App对象日志的配置项

 控制粒度： 

 1：数据区

 2：时空对象（不含后代）

 3：根App对象（含子App）

 
 
 
 分类 
 控制粒度 
 配置项名称 
 配置项描述 
 默认值与范围 
 
 
 
 App脚本日志 
 2、3 
 int32 logLevel 
 App对象存库日志级别（1~5） 
 5 
 
 
 
 2、3 
 int32 logFormat 
 App对象脚本日志输出形式，1：多行输出，2：单行输出 
 1 
 
 
 
 2、3 
 uint32 logLengthLimit 
 App对象脚本日志单条长度限制 
 128kb，暂不支持配置 
 
 
 
 1 
 uint32 cleanPeriodDeletedApp 
 被删除的App脚本日志定期清理时间，单位：小时 
 72小时，暂不支持配置 
 
 
 
 1 
 uint32 cleanPeriod 
 所有App脚本日志定期清理时间，清除所有日志，单位：天 
 30天[1，30] 
 
 
 
 1 
 uint32 capacityLimit 
 所有App脚本日志滚动清理阈值（超出多少条时滚动清理） 
 100000条，暂不支持配置 
 
 
 
 1 
 uint32 clearStep 
 所有App脚本日志每次滚动清理条数 
 10000条，暂不支持配置 
 
 
 
 3 
 uint32 capacityLimitPerApp 
 单个App脚本日志滚动清理阈值（超出多少条时滚动清理） 
 1000条，暂不支持配置 
 
 
 
 3 
 uint32 clearStepPerApp 
 单个App脚本日志每次滚动清理条数 
 100条，暂不支持配置 
 
 
 App运行日志 
 1 
 uint32 cleanPeriod 
 App运行日志定期清理时间，清除所有日志，单位：天 
 30天[1，30] 
 
 
 
 1 
 uint32 capacityLimit 
 App运行日志滚动清理限值（超出多少条时滚动清理） 
 100000条，暂不支持配置 
 
 
 
 1 
 uint32 clearStep 
 App运行日志每次滚动清理条数 
 10000条，暂不支持配置 
 
 
 App性能日志 
 2、3 
 bool enable 
 是否开启性能分析 
 否 
 
 
 
 2、3 
 int32[] taskType 
 开启任务类型（多选），1：OnCreate，2：OnDestroy，3：定时回调，4：订阅回调，5：外部接口调用 
 无 
 
 
 
 2、3 
 bool tsdbEnable 
 是否开启库操作性能分析 
 否 
 
 
 
 2、3 
 uint32 frequency 
 性能分析频率，单位：分钟（只针对多次任务与资源占用分析有效） 
 10分钟[1，60] 
 
 
 
 1 
 uint32 cleanPeriod 
 App性能日志定期清理时间，清除所有日志，单位：天 
 30天[1，30] 
 
 
 
 1 
 uint32 capacityLimit 
 App性能日志滚动清理限值（超出多少条时滚动清理） 
 100000条，暂不支持配置 
 
 
 
 1 
 uint32 clearStep 
 App性能日志每次滚动清理条数 
 10000条，暂不支持配置