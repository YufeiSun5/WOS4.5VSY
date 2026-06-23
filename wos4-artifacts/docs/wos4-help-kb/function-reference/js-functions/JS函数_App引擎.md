# JS函数_App引擎

- 分组：JS函数说明
- 原始章节名：JS函数_App引擎
- 内容块数量：64
- 来源：WOS4 帮助手册 static/js/file.js

## 正文

# 1. 函数清单

功能单元库支持的函数如下：
创建
Create(param, input );
删除
Delete(param, input );
查询
Query(param, input );
修改
Update(param, input);
订阅
Subscribe(param, input );
取消订阅
UnSubscribe(param, input);
接口调用
Call(param, input);
开启事务
BeginTransaction(param, input);
提交事务
CommitTransaction(param, input);
回滚事务
RollbackTransaction(param, input);

# 1. 函数清单

 功能单元库支持的函数如下：

 
 
 
 函数名称 
 函数原型 
 
 
 
 创建 
 Create(param, input ); 
 
 
 删除 
 Delete(param, input ); 
 
 
 查询 
 Query(param, input ); 
 
 
 修改 
 Update(param, input); 
 
 
 订阅 
 Subscribe(param, input ); 
 
 
 取消订阅 
 UnSubscribe(param, input); 
 
 
 接口调用 
 Call(param, input); 
 
 
 开启事务 
 BeginTransaction(param, input); 
 
 
 提交事务 
 CommitTransaction(param, input); 
 
 
 回滚事务 
 RollbackTransaction(param, input); 
 
 

# 2. 公共说明

# 2. 公共说明

# 2.1. 函数返回结果Result

函数返回结果结构：
result = {
 ret: 0, // 返回值
 consumetime: 0, // 执行耗时，单位毫秒
 traceid: "123", // 任务跟踪ID，用于查询跟踪日志，功能单元库函数不返此项的值，为0
 output: { // 返回结构
 ... // 返回具体数据
 }
}
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

 函数返回结果结构：

 result = {
 ret: 0, // 返回值
 consumetime: 0, // 执行耗时，单位毫秒
 traceid: "123", // 任务跟踪ID，用于查询跟踪日志，功能单元库函数不返此项的值，为0
 output: { // 返回结构
 ... // 返回具体数据
 }
}
 
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
(2) 如果有部分成功（无事务时，或开事务的非严格模式时），则errorCodes与fieldValues数组一一对应，成功返回0，失败返回对应错误码。
(3) 如果没有部分成功（开事务的严格模式时），只能全部成功或全部失败，则errorCodes中出现错误的位置返回对应错误码，其他位置都返回未执行的错误码。
针对异步接口的errorCodes信息返回说明如下：
入参校验错误返回在output的errorCodes中，返回一个错误信息。
**脚本示例：**
let param = new StringMap({
 type : -11101; // type类型不存在。
});
 
let input = new StringMap({
 ids: ["96027650047","96027650048","96027650048"], // App对象ID重复
 mode: -100 // mode模式不存在
});
执行过程中系统层面返回的错误信息，返回到callBack中的errorCodes中。
**例如：**执行过程中校验id不存在，该错误信息返回在callBack中，如果是ids数组，则返回的errorCodes长度与ids数组长度对应。

## 2.2. 错误码 errorCodes

 1.批量操作和单个操作都返回errorCodes。

 (1) 如果函数公共入参校验出现错误时，一个操作都没有执行，则errorCodes数组中返回一个错误码。 

 (2) 如果有部分成功（无事务时，或开事务的非严格模式时），则errorCodes与fieldValues数组一一对应，成功返回0，失败返回对应错误码。

 (3) 如果没有部分成功（开事务的严格模式时），只能全部成功或全部失败，则errorCodes中出现错误的位置返回对应错误码，其他位置都返回未执行的错误码。

 
 针对异步接口的errorCodes信息返回说明如下：

 
 
 入参校验错误返回在output的errorCodes中，返回一个错误信息。

 
 脚本示例： 

 let param = new StringMap({
 type : -11101; // type类型不存在。
});
 
let input = new StringMap({
 ids: ["96027650047","96027650048","96027650048"], // App对象ID重复
 mode: -100 // mode模式不存在
});
 
 
 执行过程中系统层面返回的错误信息，返回到callBack中的errorCodes中。

 
 例如： 执行过程中校验id不存在，该错误信息返回在callBack中，如果是ids数组，则返回的errorCodes长度与ids数组长度对应。

# 2.3. 超时时间timeout

超时时间timeout：表示函数操作在完成之前所允许的最大时间。如果这个时间内操作没有完成，则由系统视为失败，主动终止操作。超时时间可以避免长时间等待没有结果的响应，保证系统稳定性。需要设置合理的超时时间。
脚本函数中timeout默认为10000ms，与网关超时无关。
timeout不能设置为0。

## 2.3. 超时时间timeout

 
 超时时间timeout：表示函数操作在完成之前所允许的最大时间。如果这个时间内操作没有完成，则由系统视为失败，主动终止操作。超时时间可以避免长时间等待没有结果的响应，保证系统稳定性。需要设置合理的超时时间。

 脚本函数中timeout默认为10000ms，与网关超时无关。

 timeout不能设置为0。

 

# 2.4. filter字符串说明

filter字符串支持关系运算符（==、!=、>、 =、 filter字符串支持关系运算符（==、!=、>、<、>=、<=）逻辑运算符（与&&、或||、非!） 、包含（in）及正则表达式。

 使用~ 开启正则表达式，正则表达式直接放在/ /之中，后面可带修饰符，目前仅支持i修饰符，表示不区分大小写，即匹配时忽略字符串的大小写。

 操作符优先级如下：

 关系操作符的优先级高于逻辑操作符（与、或）

 逻辑操作符与(&&)的优先级高于或(||)

 圆括号优先级高于与(&&)、或(||)

 过滤字符串时，字符串值需要用双引号括起。

 支持过滤的字段有$name、$label1、$label2、$label3、$copyID 。

 常见过滤举例：

 1、字符串类型

 filter = "$name == \"对象\""; // 名称为对象 
filter = "$name != \"对象\""; // 名称不为对象
filter = "$name in (\"对象1\",\"对象2\",\"对象3\")"; // 名称为对象1或对象2或对象3 
filter = "$name ==~ \"/物料.*/\""; // 正则表达式，名称以物料开头
 
 2、 uint64类型

 filter = "$copyID == 123456"; 
filter = "$copyID = " + StringFromUint(copyID,10); // 值等于变量
 
 3、多条件过滤 

 filter = "$name == \"对象\" && "$lable1 == \"标签1\" || $copyID == 12345678"; 
filter = "$name == \"对象\" && ("$lable1 == \"标签1\" || $copyID == 12345678)";// 优先执行()
 

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

# 3.1.1. 同步调用App接口函数

**Call(param, input);**
**功能描述：**同步调用后台App对象的接口函数。后台App可以是元语言App、NodeJS App等。
**注意事项：**
同步调用（加await关键字），一直等待调用执行完成并返回结果，后续函数不会执行。

不允许跨时空调用。本地调用时，只能调用同一时空内的App；远程调用时，只能调用其远程访问时空列表内的App。

BS模式下，WebJS App对象看做云App对象，调用云后台App是本地调用，按所属时空约束；

CS模式下，WebJS App对象看做端App对象，调用云后台App是远程调用，按访问时空约束。

不支持WebJSApp对象调用端上的任何语言类型的App对象。

用户权限说明：App之间接口调用时，接口函数中执行脚本使用调用方App的用户权限（包括业务、安全、审计、运维）。前端App调用后台App1（如WebJSApp调用后台元语言App），使用前端App用户权限；如果后台App1继续调用后台App2的情况，则使用后台App1的用户权限。
**param有效参数：**
cloudID
number
区域ID
否
0
areaID
number
数据区ID
否
本App所在数据区
type
number
对象类型，21001
是

timeout
number
超时时间ms
否
10000
**input有效参数：**
isParallel
bool
是否开启并发模式。如果为true，则会并发执行该请求
说明：
1、主要针对前端同一会话的多个请求同时访问某个后台数据库(实时库、历史库、计划库、模型库等)的场景，因为后台库子系统会开启事务导致多个请求在串行执行；
2、当前支持的最大并发数为6，超出后的请求需要进行等待；
3、在对call函数执行有顺序要求的场景下，要避免使用并发模式。例如call函数1执行创建，call函数2执行查询，函数2应该在函数1之后执行，这种情况下就应该使用非并发模式。
否
false
identifierType
number
对象的标识类型：
1：ID，使用ID标识；
2：NAME，使用名称标识；
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
被调用函数的输入参数
最多16个输入参数，个数不固定，输入参数个数和类型要和被调功能的输入参数设置保持一致，如果，被调功能的输入参数为空，则params参数的个数也要为0。
是

**返回结果：**
{
 ret: 0, // 返回值
 consumetime: 0, // 执行耗时，单位毫秒
 traceid: "0", // 任务跟踪ID，用于查询跟踪日志，App引擎函数返回0
 output: { 
 returndata:{}, // 被调用函数的返回值
 errorcodes: [] // 错误信息
 }
}
**错误码:**
参见《错误码_App引擎》
**脚本示例1：**
let param = new StringMap({
 type: 21001, // 调用元语言自定义方法
 cloudID:3
});

// 被调用函数的输入参数params
let param1 = new Variant("1978021535812480", "uint64");// 第一个参数
let param2 = new Variant("参数二", "string"); // 第二个参数
let param3Map = new StringMap({ // 第三个参数
 name: "参数三",
 id: "1978021535812490"
});
let param3 = new Variant([param3Map]); 

let input = new StringMap({
 identifierType：1,
 id: "1978021535812492",
 funcname: "func1",
 params: [param1, param2, param3]
});

let res = await Call(param, input);
if(!res.ret){
 // 业务逻辑处理
 let returnValue = res.returndata;
 console.log("接口调用的返回结果为=：", returnValue);
}else{
 console.log("接口调用失败，失败原因=：",res.ret);
}

// 被调自定义方法（元语言）
int64 func1(uint64 value1, string value2, stringMap [] strMap)
{
 Trace(2, "strMap = ", strMap);
 return strMap;
}
**脚本示例2：**
let param = new StringMap({
 type: 21001, // 调用元语言自定义方法
 cloudID: getLocalCloudID(),
});

// 被调用函数的输入参数params
let param1 = new Variant(true); // 第一个参数
let param2 = new Variant(8, "int8"); // 第二个参数
let param3 = new Variant(16, "int16"); // 第三个参数
let param4 = new Variant(32, "int32"); // 第四个参数
let param5 = new Variant("64", "int64"); // 第五个参数 
let param6 = new Variant("1441151880758558740", "uint64"); // 第六个参数 
let param7 = new Variant(21.56, "float"); // 第七个参数 
let param8 = new Variant(56.21, "double"); // 第八个参数 
let param9 = new Variant(new Decimal("56.21")); // 第九个参数 
let param10 = new Variant("hello", "string"); // 第十个参数 
let dateT = new Date();
let param11 = new Variant(dateT); // 第十一个参数
let param12Map = new StringMap({ 
 name: "app1",
 id: "1441151880758558740"
});
let param12 = new Variant(param12Map); // 第十二个参数
let param13 = new Variant(StringToArrayBuffer("blob value"), "binary"); // 第十三个参数 
let param14 = new Variant("14789655321352", "timeSpanUi"); // 第十四个参数
let input = new StringMap({
 identifierType: 2,
 name: "ML_拷贝1",
 funcname: "func1",
 params: [param1,param2,param3,param4,param5,param6,param7,param8,param9,param10,param11,param12,param13,param14]
});
let res = await Call(param, input);
if (res.ret == 0) {
 console.log("接口调用func1 = ", "SUCCESS"); 
 console.log("接口调用func1 = ", JSON.stringify(res)); 
} else {
 console.log("接口调用func1 = ", "FAIL"); 
 console.log("接口调用func1 = ", JSON.stringify(res)); 
}

// 被调自定义方法（元语言）
var[] func1(bool boolValue,int8 int8Value,int16 int16Value,int32 int32Value,int64 int64Value,uint64 uint64Value,float floatValue,double doubleValue,decimal decimalValue,string stringValue,dateTime dateTimeValue,stringMap stringMapValue,blob blobValue,timespan timespanValue)
{
 bool boolValue_1 = boolValue;
 int8 int8Value_1 = int8Value;
 int16 int16Value_1 = int16Value;
 int32 int32Value_1 = int32Value;
 int64 int64Value_1 = int64Value;
 uint64 uint64Value_1 = uint64Value;
 float floatValue_1 = floatValue;
 double doubleValue_1 = doubleValue;
 decimal decimalValue_1 = decimalValue;
 string stringValue_1 = stringValue;
 dateTime dateTimeValue_1 = dateTimeValue;
 stringMap stringMapValue_1 = stringMapValue;
 Trace(2, "boolValue_1 = ", boolValue_1);
 Trace(2, "int8Value_1 = ", int8Value_1);
 Trace(2, "int16Value_1 = ", int16Value_1);
 Trace(2, "int32Value_1 = ", int32Value_1);
 Trace(2, "int64Value_1 = ", int64Value_1);
 Trace(2, "uint64Value_1 = ", uint64Value_1);
 Trace(2, "floatValue_1 = ", floatValue_1);
 Trace(2, "doubleValue_1 = ", doubleValue_1);
 Trace(2, "decimalValue_1 = ", decimalValue_1);
 Trace(2, "stringValue_1 = ", stringValue_1);
 Trace(2, "dateTimeValue_1 = ", dateTimeValue_1);
 Trace(2, "stringMapValue_1 = ", stringMapValue_1);
 Trace(2,"blobValue_1 = ", blobValue_1);
 Trace(2,"timespanValue_1 = ", timespanValue_1);
 var[] varArr = {boolValue_1, int8Value_1, int16Value_1, int32Value_1, int64Value_1,uint64Value_1, 
floatValue_1, doubleValue_1, decimalValue_1,stringValue_1, dateTimeValue_1, stringMapValue_1,blobValue_1,timespanValue_1};
 return varArr;
}
**脚本示例3：**
let param = new StringMap({
 type: 21001, // 调用元语言自定义方法
 cloudID: getLocalCloudID(),
});

// 被调用函数的输入参数params
let param1 = new Variant([true, false], "bool[]"); // 第一个参数
let param2 = new Variant([8, -8], "int8[]"); // 第二个参数
let param3 = new Variant([16, -16], "int16[]"); // 第三个参数
let param4 = new Variant([32, -32], "int32[]"); // 第四个参数
let param5 = new Variant(["64","-64"], "int64[]"); // 第五个参数 
let param6 = new Variant(["1441151880758558740", "1441151880758559098"], "uint64[]"); // 第六个参数 
let param7 = new Variant([21.56, -21.56], "float[]"); // 第七个参数 
let param8 = new Variant([56.21, -56.21], "double[]"); // 第八个参数 
let param9_1 = new Variant(new Decimal("56.21")); 
let param9_2 = new Variant(new Decimal("21.56")); 
let param9 = new Variant([param9_1, param9_2]); // 第九个参数 
let param10 = new Variant(["hello", "world"], "string[]"); // 第十个参数 
let dateE = new Date();
let dateS = new Date(dateE - 8 * 60 * 60 * 1000);
let param11 = new Variant([dateS, dateE]); // 第十一个参数
let param12Map_1 = new StringMap({ 
 name: "app1",
 id: "1441151880758558740"
});
let param12Map_2 = new StringMap({ 
 name: "app2",
 id: "1441151880758558741"
});
let param12 = new Variant([param12Map_1, param12Map_2]); // 第十二个参数

let input = new StringMap({
 identifierType: 2,
 name: "ML_拷贝1",
 funcname: "func1",
 params: [param1,param2,param3,param4,param5,param6,param7,param8,param9,param10,param11,param12]
});
let res = await Call(param, input);
if (res.ret == 0) {
 console.log("接口调用func1 = ", "SUCCESS"); 
 console.log("接口调用func1 = ", JSON.stringify(res)); 
} else {
 console.log("接口调用func1 = ", "FAIL"); 
 console.log("接口调用func1 = ", JSON.stringify(res)); 
}

// 被调自定义方法（元语言）
var[] func1(bool[] boolValue,int8[] int8Value,int16[] int16Value,int32[] int32Value,int64[] int64Value,uint64[] uint64Value,float[] floatValue,double[] doubleValue,var[] decimalValue,string[] stringValue,dateTime[] dateTimeValue,stringMap [] stringMapValue)
{
 bool[] boolValue_1 = boolValue;
 int8[] int8Value_1 = int8Value;
 int16[] int16Value_1 = int16Value;
 int32[] int32Value_1 = int32Value;
 int64[] int64Value_1 = int64Value;
 uint64[] uint64Value_1 = uint64Value;
 float[] floatValue_1 = floatValue;
 double[] doubleValue_1 = doubleValue;
 var[] decimalValue_1 = decimalValue;
 string[] stringValue_1 = stringValue;
 dateTime[] dateTimeValue_1 = dateTimeValue;
 stringMap [] stringMapValue_1 = stringMapValue;
 Trace(2, "boolValue_1 = ", boolValue_1);
 Trace(2, "int8Value_1 = ", int8Value_1);
 Trace(2, "int16Value_1 = ", int16Value_1);
 Trace(2, "int32Value_1 = ", int32Value_1);
 Trace(2, "int64Value_1 = ", int64Value_1);
 Trace(2, "uint64Value_1 = ", uint64Value_1);
 Trace(2, "floatValue_1 = ", floatValue_1);
 Trace(2, "doubleValue_1 = ", doubleValue_1);
 Trace(2, "decimalValue_1 = ", decimalValue_1);
 Trace(2, "stringValue_1 = ", stringValue_1);
 Trace(2, "dateTimeValue_1 = ", dateTimeValue_1);
 Trace(2, "stringMapValue_1 = ", stringMapValue_1);
 var[] varArr = {boolValue_1, int8Value_1, int16Value_1, int32Value_1, int64Value_1,uint64Value_1, 
floatValue_1, doubleValue_1, decimalValue_1,stringValue_1, dateTimeValue_1, stringMapValue_1};
 return varArr; 
}
**脚本示例4：**
let param = new StringMap({
 type: 21001, // 调用元语言自定义方法
 cloudID: getLocalCloudID(),
 });

// 被调用函数的输入参数params
let param1 = new Variant(true); 
let param2 = new Variant(8, "int8"); 
let param3 = new Variant(16, "int16"); 
let param4 = new Variant(32, "int32"); 
let param5 = new Variant("64", "int64"); 
let param6 = new Variant("1441151880758558740", "uint64"); 
let param7 = new Variant(21.56, "float"); 
let param8 = new Variant(56.21, "double"); 
let param9 = new Variant(new Decimal("56.21"));
let param10 = new Variant("hello", "string"); 
let dateT = new Date();
let param11 = new Variant(dateT);
let param12Map = new StringMap({ 
 name: "app1",
 id: "1441151880758558740"
});
let param12 = new Variant(param12Map); 
let fieldValues = [];
fieldValues.dataFields = ["dataField1","dataField2","dataField3","dataField4","dataField5","dataField6","dataField7","dataField8","dataField9","dataField10","dataField11","dataField12"];
fieldValues.dataValues = [param1,param2,param3,param4,param5,param6,param7,param8,param9,param10,param11,param12];
let params = new StringMap({ 
 dataFields: fieldValues.dataFields,
 dataValues: fieldValues.dataValues
});

let input = new StringMap({
 identifierType: 2,
 name: "ML_拷贝1",
 funcname: "func1",
 params: [Variant(params)]
});
let res = await Call(param, input);
if (res.ret == 0) {
 console.log("接口调用func1 = ", "SUCCESS"); 
 console.log("接口调用func1 = ", JSON.stringify(res)); 
} else {
 console.log("接口调用func1 = ", "FAIL"); 
 console.log("接口调用func1 = ", JSON.stringify(res)); 
}

// 被调自定义方法（元语言）
stringMap func1(stringMap stringMapValue)
{
 stringMap stringMapValue_1 = stringMapValue;
 Trace(2, "stringMapValue_1 = ", stringMapValue_1);
 return stringMapValue_1;
}

### 3.1.1. 同步调用App接口函数

 Call(param, input); 

 功能描述： 同步调用后台App对象的接口函数。后台App可以是元语言App、NodeJS App等。

 注意事项： 

 
 同步调用（加await关键字），一直等待调用执行完成并返回结果，后续函数不会执行。

 不允许跨时空调用。本地调用时，只能调用同一时空内的App；远程调用时，只能调用其远程访问时空列表内的App。

 BS模式下，WebJS App对象看做云App对象，调用云后台App是本地调用，按所属时空约束；

 CS模式下，WebJS App对象看做端App对象，调用云后台App是远程调用，按访问时空约束。

 不支持WebJSApp对象调用端上的任何语言类型的App对象。

 用户权限说明：App之间接口调用时，接口函数中执行脚本使用调用方App的用户权限（包括业务、安全、审计、运维）。前端App调用后台App1（如WebJSApp调用后台元语言App），使用前端App用户权限；如果后台App1继续调用后台App2的情况，则使用后台App1的用户权限。

 
 param有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 cloudID 
 number 
 区域ID 
 否 
 0 
 
 
 areaID 
 number 
 数据区ID 
 否 
 本App所在数据区 
 
 
 type 
 number 
 对象类型，21001 
 是 
 
 
 
 timeout 
 number 
 超时时间ms 
 否 
 10000 
 
 
 input有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 isParallel 
 bool 
 是否开启并发模式。如果为true，则会并发执行该请求
说明：
1、主要针对前端同一会话的多个请求同时访问某个后台数据库(实时库、历史库、计划库、模型库等)的场景，因为后台库子系统会开启事务导致多个请求在串行执行；
2、当前支持的最大并发数为6，超出后的请求需要进行等待；
3、在对call函数执行有顺序要求的场景下，要避免使用并发模式。例如call函数1执行创建，call函数2执行查询，函数2应该在函数1之后执行，这种情况下就应该使用非并发模式。 
 否 
 false 
 
 
 identifierType 
 number 
 对象的标识类型：
1：ID，使用ID标识；
2：NAME，使用名称标识； 
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
 被调用函数的输入参数
最多16个输入参数，个数不固定，输入参数个数和类型要和被调功能的输入参数设置保持一致，如果，被调功能的输入参数为空，则params参数的个数也要为0。 
 是 
 
 
 
 返回结果： 

 {
 ret: 0, // 返回值
 consumetime: 0, // 执行耗时，单位毫秒
 traceid: "0", // 任务跟踪ID，用于查询跟踪日志，App引擎函数返回0
 output: { 
 returndata:{}, // 被调用函数的返回值
 errorcodes: [] // 错误信息
 }
}
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例1： 

 let param = new StringMap({
 type: 21001, // 调用元语言自定义方法
 cloudID:3
});

// 被调用函数的输入参数params
let param1 = new Variant("1978021535812480", "uint64");// 第一个参数
let param2 = new Variant("参数二", "string"); // 第二个参数
let param3Map = new StringMap({ // 第三个参数
 name: "参数三",
 id: "1978021535812490"
});
let param3 = new Variant([param3Map]); 

let input = new StringMap({
 identifierType：1,
 id: "1978021535812492",
 funcname: "func1",
 params: [param1, param2, param3]
});

let res = await Call(param, input);
if(!res.ret){
 // 业务逻辑处理
 let returnValue = res.returndata;
 console.log("接口调用的返回结果为=：", returnValue);
}else{
 console.log("接口调用失败，失败原因=：",res.ret);
}

// 被调自定义方法（元语言）
int64 func1(uint64 value1, string value2, stringMap<var>[] strMap)
{
 Trace(2, "strMap = ", strMap);
 return strMap;
}
 
 脚本示例2： 

 let param = new StringMap({
 type: 21001, // 调用元语言自定义方法
 cloudID: getLocalCloudID(),
});

// 被调用函数的输入参数params
let param1 = new Variant(true); // 第一个参数
let param2 = new Variant(8, "int8"); // 第二个参数
let param3 = new Variant(16, "int16"); // 第三个参数
let param4 = new Variant(32, "int32"); // 第四个参数
let param5 = new Variant("64", "int64"); // 第五个参数 
let param6 = new Variant("1441151880758558740", "uint64"); // 第六个参数 
let param7 = new Variant(21.56, "float"); // 第七个参数 
let param8 = new Variant(56.21, "double"); // 第八个参数 
let param9 = new Variant(new Decimal("56.21")); // 第九个参数 
let param10 = new Variant("hello", "string"); // 第十个参数 
let dateT = new Date();
let param11 = new Variant(dateT); // 第十一个参数
let param12Map = new StringMap({ 
 name: "app1",
 id: "1441151880758558740"
});
let param12 = new Variant(param12Map); // 第十二个参数
let param13 = new Variant(StringToArrayBuffer("blob value"), "binary"); // 第十三个参数 
let param14 = new Variant("14789655321352", "timeSpanUi"); // 第十四个参数
let input = new StringMap({
 identifierType: 2,
 name: "ML_拷贝1",
 funcname: "func1",
 params: [param1,param2,param3,param4,param5,param6,param7,param8,param9,param10,param11,param12,param13,param14]
});
let res = await Call(param, input);
if (res.ret == 0) {
 console.log("接口调用func1 = ", "SUCCESS"); 
 console.log("接口调用func1 = ", JSON.stringify(res)); 
} else {
 console.log("接口调用func1 = ", "FAIL"); 
 console.log("接口调用func1 = ", JSON.stringify(res)); 
}

// 被调自定义方法（元语言）
var[] func1(bool boolValue,int8 int8Value,int16 int16Value,int32 int32Value,int64 int64Value,uint64 uint64Value,float floatValue,double doubleValue,decimal decimalValue,string stringValue,dateTime dateTimeValue,stringMap<var> stringMapValue,blob blobValue,timespan timespanValue)
{
 bool boolValue_1 = boolValue;
 int8 int8Value_1 = int8Value;
 int16 int16Value_1 = int16Value;
 int32 int32Value_1 = int32Value;
 int64 int64Value_1 = int64Value;
 uint64 uint64Value_1 = uint64Value;
 float floatValue_1 = floatValue;
 double doubleValue_1 = doubleValue;
 decimal decimalValue_1 = decimalValue;
 string stringValue_1 = stringValue;
 dateTime dateTimeValue_1 = dateTimeValue;
 stringMap<var> stringMapValue_1 = stringMapValue;
 Trace(2, "boolValue_1 = ", boolValue_1);
 Trace(2, "int8Value_1 = ", int8Value_1);
 Trace(2, "int16Value_1 = ", int16Value_1);
 Trace(2, "int32Value_1 = ", int32Value_1);
 Trace(2, "int64Value_1 = ", int64Value_1);
 Trace(2, "uint64Value_1 = ", uint64Value_1);
 Trace(2, "floatValue_1 = ", floatValue_1);
 Trace(2, "doubleValue_1 = ", doubleValue_1);
 Trace(2, "decimalValue_1 = ", decimalValue_1);
 Trace(2, "stringValue_1 = ", stringValue_1);
 Trace(2, "dateTimeValue_1 = ", dateTimeValue_1);
 Trace(2, "stringMapValue_1 = ", stringMapValue_1);
 Trace(2,"blobValue_1 = ", blobValue_1);
 Trace(2,"timespanValue_1 = ", timespanValue_1);
 var[] varArr = {boolValue_1, int8Value_1, int16Value_1, int32Value_1, int64Value_1,uint64Value_1, 
floatValue_1, doubleValue_1, decimalValue_1,stringValue_1, dateTimeValue_1, stringMapValue_1,blobValue_1,timespanValue_1};
 return varArr;
}
 
 脚本示例3： 

 let param = new StringMap({
 type: 21001, // 调用元语言自定义方法
 cloudID: getLocalCloudID(),
});

// 被调用函数的输入参数params
let param1 = new Variant([true, false], "bool[]"); // 第一个参数
let param2 = new Variant([8, -8], "int8[]"); // 第二个参数
let param3 = new Variant([16, -16], "int16[]"); // 第三个参数
let param4 = new Variant([32, -32], "int32[]"); // 第四个参数
let param5 = new Variant(["64","-64"], "int64[]"); // 第五个参数 
let param6 = new Variant(["1441151880758558740", "1441151880758559098"], "uint64[]"); // 第六个参数 
let param7 = new Variant([21.56, -21.56], "float[]"); // 第七个参数 
let param8 = new Variant([56.21, -56.21], "double[]"); // 第八个参数 
let param9_1 = new Variant(new Decimal("56.21")); 
let param9_2 = new Variant(new Decimal("21.56")); 
let param9 = new Variant([param9_1, param9_2]); // 第九个参数 
let param10 = new Variant(["hello", "world"], "string[]"); // 第十个参数 
let dateE = new Date();
let dateS = new Date(dateE - 8 * 60 * 60 * 1000);
let param11 = new Variant([dateS, dateE]); // 第十一个参数
let param12Map_1 = new StringMap({ 
 name: "app1",
 id: "1441151880758558740"
});
let param12Map_2 = new StringMap({ 
 name: "app2",
 id: "1441151880758558741"
});
let param12 = new Variant([param12Map_1, param12Map_2]); // 第十二个参数

let input = new StringMap({
 identifierType: 2,
 name: "ML_拷贝1",
 funcname: "func1",
 params: [param1,param2,param3,param4,param5,param6,param7,param8,param9,param10,param11,param12]
});
let res = await Call(param, input);
if (res.ret == 0) {
 console.log("接口调用func1 = ", "SUCCESS"); 
 console.log("接口调用func1 = ", JSON.stringify(res)); 
} else {
 console.log("接口调用func1 = ", "FAIL"); 
 console.log("接口调用func1 = ", JSON.stringify(res)); 
}

// 被调自定义方法（元语言）
var[] func1(bool[] boolValue,int8[] int8Value,int16[] int16Value,int32[] int32Value,int64[] int64Value,uint64[] uint64Value,float[] floatValue,double[] doubleValue,var[] decimalValue,string[] stringValue,dateTime[] dateTimeValue,stringMap<var>[] stringMapValue)
{
 bool[] boolValue_1 = boolValue;
 int8[] int8Value_1 = int8Value;
 int16[] int16Value_1 = int16Value;
 int32[] int32Value_1 = int32Value;
 int64[] int64Value_1 = int64Value;
 uint64[] uint64Value_1 = uint64Value;
 float[] floatValue_1 = floatValue;
 double[] doubleValue_1 = doubleValue;
 var[] decimalValue_1 = decimalValue;
 string[] stringValue_1 = stringValue;
 dateTime[] dateTimeValue_1 = dateTimeValue;
 stringMap<var>[] stringMapValue_1 = stringMapValue;
 Trace(2, "boolValue_1 = ", boolValue_1);
 Trace(2, "int8Value_1 = ", int8Value_1);
 Trace(2, "int16Value_1 = ", int16Value_1);
 Trace(2, "int32Value_1 = ", int32Value_1);
 Trace(2, "int64Value_1 = ", int64Value_1);
 Trace(2, "uint64Value_1 = ", uint64Value_1);
 Trace(2, "floatValue_1 = ", floatValue_1);
 Trace(2, "doubleValue_1 = ", doubleValue_1);
 Trace(2, "decimalValue_1 = ", decimalValue_1);
 Trace(2, "stringValue_1 = ", stringValue_1);
 Trace(2, "dateTimeValue_1 = ", dateTimeValue_1);
 Trace(2, "stringMapValue_1 = ", stringMapValue_1);
 var[] varArr = {boolValue_1, int8Value_1, int16Value_1, int32Value_1, int64Value_1,uint64Value_1, 
floatValue_1, doubleValue_1, decimalValue_1,stringValue_1, dateTimeValue_1, stringMapValue_1};
 return varArr; 
}
 
 脚本示例4： 

 let param = new StringMap({
 type: 21001, // 调用元语言自定义方法
 cloudID: getLocalCloudID(),
 });

// 被调用函数的输入参数params
let param1 = new Variant(true); 
let param2 = new Variant(8, "int8"); 
let param3 = new Variant(16, "int16"); 
let param4 = new Variant(32, "int32"); 
let param5 = new Variant("64", "int64"); 
let param6 = new Variant("1441151880758558740", "uint64"); 
let param7 = new Variant(21.56, "float"); 
let param8 = new Variant(56.21, "double"); 
let param9 = new Variant(new Decimal("56.21"));
let param10 = new Variant("hello", "string"); 
let dateT = new Date();
let param11 = new Variant(dateT);
let param12Map = new StringMap({ 
 name: "app1",
 id: "1441151880758558740"
});
let param12 = new Variant(param12Map); 
let fieldValues = [];
fieldValues.dataFields = ["dataField1","dataField2","dataField3","dataField4","dataField5","dataField6","dataField7","dataField8","dataField9","dataField10","dataField11","dataField12"];
fieldValues.dataValues = [param1,param2,param3,param4,param5,param6,param7,param8,param9,param10,param11,param12];
let params = new StringMap({ 
 dataFields: fieldValues.dataFields,
 dataValues: fieldValues.dataValues
});

let input = new StringMap({
 identifierType: 2,
 name: "ML_拷贝1",
 funcname: "func1",
 params: [Variant(params)]
});
let res = await Call(param, input);
if (res.ret == 0) {
 console.log("接口调用func1 = ", "SUCCESS"); 
 console.log("接口调用func1 = ", JSON.stringify(res)); 
} else {
 console.log("接口调用func1 = ", "FAIL"); 
 console.log("接口调用func1 = ", JSON.stringify(res)); 
}

// 被调自定义方法（元语言）
stringMap<var> func1(stringMap<var> stringMapValue)
{
 stringMap<var> stringMapValue_1 = stringMapValue;
 Trace(2, "stringMapValue_1 = ", stringMapValue_1);
 return stringMapValue_1;
}
 

# 3.1.2. 修改指定App对象参数值

**Update(param, input);**
**功能描述：**修改指定App对象的参数值（读写属性、成员）。
**注意事项：**
仅支持WebJS App对象，只能修改当前App树上的App对象。
**param有效参数：**
cloudID
number
区域ID
否
0
areaID
number
数据区ID
否
本App所在数据区
type
number
对象类型，22001
是

timeout
number
超时时间ms
否
10000
**input有效参数：**
ids
string[]
App对象ID
是

fieldValues
StringMap[]
字段值
一个对象对应一个map
支持对象结构中的读写字段
否

**返回结果：**
{
 ret: 0, // 返回值
 consumetime: 0, // 执行耗时，单位毫秒
 traceid: "0", // 任务跟踪ID，用于查询跟踪日志，App引擎函数返回0
 output: { 
 errorcodes: [] // 错误码
 }
}
**错误码:**
参见《错误码_App引擎》
**脚本示例：**

### 3.1.2. 修改指定App对象参数值

 Update(param, input); 

 功能描述： 修改指定App对象的参数值（读写属性、成员）。

 注意事项： 

 
 仅支持WebJS App对象，只能修改当前App树上的App对象。

 
 param有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 cloudID 
 number 
 区域ID 
 否 
 0 
 
 
 areaID 
 number 
 数据区ID 
 否 
 本App所在数据区 
 
 
 type 
 number 
 对象类型，22001 
 是 
 
 
 
 timeout 
 number 
 超时时间ms 
 否 
 10000 
 
 
 input有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 ids 
 string[] 
 App对象ID 
 是 
 
 
 
 fieldValues 
 StringMap[] 
 字段值
一个对象对应一个map
支持对象结构中的读写字段 
 否 
 
 
 
 返回结果： 

 {
 ret: 0, // 返回值
 consumetime: 0, // 执行耗时，单位毫秒
 traceid: "0", // 任务跟踪ID，用于查询跟踪日志，App引擎函数返回0
 output: { 
 errorcodes: [] // 错误码
 }
}
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例： 

 
 

# 3.1.3. 订阅指定App对象参数值变化

**Subscribe(param, input);**
**onCallBack(callback)；**
**功能描述：**订阅指定App对象的参数值（读写属性、成员）变化。
**注意事项：**
仅针对webjsApp提供此函数。该函数不支持订阅运行状态变化。
不支持跨客户端订阅，只订阅本客户端内App。
一个App中允许重复订阅同一个App对象。不同App中允许重复订阅同一个App对象。取消一个订阅项不会影响其他订阅项。
App对象删除时，系统会自动清除订阅项。
订阅项名称规则：长度最多64个字符，不能为空，不支持空格，英文语言方面不支持除字母和下划线外的任何字符; 不支持数字开头。
**param有效参数：**
cloudID
number
区域ID
否
0
areaID
number
数据区ID
否
本App所在数据区
type
number
对象类型，22001
是

timeout
number
超时时间ms
否
10000
callBackFuncName
function
回调函数
是

**input有效参数：**
mode
int32
订阅模式，=2
是

ids
uint64[]
App对象ID
是

subscribeName
string
订阅项名称 
本App内不能重复
是

pubConfig
stringMap\ 
订阅配置
否

**pubConfig有效参数：**
qos
number
质量等级， AT_MOST_ONCE(0) AT_LEAST_ONCE(1) EXACTLY_ONCE(2)
否
1
cachePersist
boolean
发布缓存是否持久化，默认false
否
false
cacheEvictPolicy
number
发布缓存淘汰策略： FIFO(0)：先进先出， LIFO(1)：后进先出
否
0
cacheMaxSize
number
发布缓存最大条数
否
1000
timeout
number
发布存活超时时间ms
否
30000
cycle
number
发布周期ms 针对PUSH模式起作用
否
0
batchMaxSize
number
单次发布最大条数 针对PUSH模式起作用
否
10
**订阅回调callBack:**
StringMap[] callback，包含字段如下：
id
string
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
fieldNames
string[]
字段名称数组
oldFieldValues
var[]
字段旧值数组
newFieldValues
var[]
字段新值数组
**返回结果：**
{
 ret: 0, // 返回值
 consumetime: 0, // 执行耗时，单位毫秒
 traceid: "0", // 任务跟踪ID，用于查询跟踪日志，App引擎函数返回0
 output: { 
 errorcodes: [] // 错误码
 }
}
**错误码:**
参见《错误码_App引擎》
**脚本示例：**

### 3.1.3. 订阅指定App对象参数值变化

 Subscribe(param, input); 

 onCallBack(callback)； 

 功能描述： 订阅指定App对象的参数值（读写属性、成员）变化。

 注意事项： 

 
 仅针对webjsApp提供此函数。该函数不支持订阅运行状态变化。

 不支持跨客户端订阅，只订阅本客户端内App。

 一个App中允许重复订阅同一个App对象。不同App中允许重复订阅同一个App对象。取消一个订阅项不会影响其他订阅项。

 App对象删除时，系统会自动清除订阅项。

 订阅项名称规则：长度最多64个字符，不能为空，不支持空格，英文语言方面不支持除字母和下划线外的任何字符; 不支持数字开头。

 
 param有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 cloudID 
 number 
 区域ID 
 否 
 0 
 
 
 areaID 
 number 
 数据区ID 
 否 
 本App所在数据区 
 
 
 type 
 number 
 对象类型，22001 
 是 
 
 
 
 timeout 
 number 
 超时时间ms 
 否 
 10000 
 
 
 callBackFuncName 
 function 
 回调函数 
 是 
 
 
 
 input有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 mode 
 int32 
 订阅模式，=2 
 是 
 
 
 
 ids 
 uint64[] 
 App对象ID 
 是 
 
 
 
 subscribeName 
 string 
 订阅项名称 
本App内不能重复 
 是 
 
 
 
 pubConfig 
 stringMap<var> 
 订阅配置 
 否 
 
 
 
 pubConfig有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 qos 
 number 
 质量等级， AT_MOST_ONCE(0) AT_LEAST_ONCE(1) EXACTLY_ONCE(2) 
 否 
 1 
 
 
 cachePersist 
 boolean 
 发布缓存是否持久化，默认false 
 否 
 false 
 
 
 cacheEvictPolicy 
 number 
 发布缓存淘汰策略： FIFO(0)：先进先出， LIFO(1)：后进先出 
 否 
 0 
 
 
 cacheMaxSize 
 number 
 发布缓存最大条数 
 否 
 1000 
 
 
 timeout 
 number 
 发布存活超时时间ms 
 否 
 30000 
 
 
 cycle 
 number 
 发布周期ms 针对PUSH模式起作用 
 否 
 0 
 
 
 batchMaxSize 
 number 
 单次发布最大条数 针对PUSH模式起作用 
 否 
 10 
 
 
 订阅回调callBack: 

 StringMap[] callback，包含字段如下：

 
 
 
 名称 
 类型 
 说明 
 
 
 
 id 
 string 
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
 
 
 fieldNames 
 string[] 
 字段名称数组 
 
 
 oldFieldValues 
 var[] 
 字段旧值数组 
 
 
 newFieldValues 
 var[] 
 字段新值数组 
 
 
 返回结果： 

 {
 ret: 0, // 返回值
 consumetime: 0, // 执行耗时，单位毫秒
 traceid: "0", // 任务跟踪ID，用于查询跟踪日志，App引擎函数返回0
 output: { 
 errorcodes: [] // 错误码
 }
}
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例： 

 
 

# 3.2. 事务控制

## 3.2. 事务控制

# 3.2.1. 开启事务

**BeginTransaction(param, input);**
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
number
区域ID
否
0
timeout
number
超时时间ms
否
10000
**input有效参数：**
timeoutMs
number
事务超时
超过设置时间，事务没有提交或回滚，就自动回滚，如果设置为 BeginTransaction(param, input); 

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
 number 
 区域ID 
 否 
 0 
 
 
 timeout 
 number 
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
 number 
 事务超时
超过设置时间，事务没有提交或回滚，就自动回滚，如果设置为<=0的值按默认的30000毫秒处理。 
 否 
 15000 
 
 
 mode 
 number 
 事务的提交模式
1：不严格提交模式；2：严格完整提交模式 
 否 
 2 
 
 
 transactionType 
 number 
 事务类型
1：业务；2：安全；
开启事务时如果对应类型的用户未登录（用户会话不存在），则开启事务失败； 
 否 
 1 
 
 
 返回结果： 

 {
 ret: 0, // 返回值
 consumetime: 0, // 执行耗时，单位毫秒
 traceid: "0", // 任务跟踪ID，用于查询跟踪日志，App引擎函数返回0
 output: { 
 transactionID: [] // 事务ID
 errorcodes: [] // 错误码
 }
}
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例： 

 let param = new StringMap({
 cloudID:3
});

let input = new StringMap({
 timeoutMs: 3000,
 mode: 2, // 严格事务模式
 transactionType: 2 // 安全事务，操作安全库函数
});

let res = await BeginTransaction(param, input);
if(!res.ret){
 // 业务逻辑处理
 let transacID = res.output.transactionid;
 console.log("事务ID为=：",transacID);
}
 

# 3.2.2. 提交事务

**CommitTransaction(param, input);**
**功能描述：**同步提交事务，就是将事务中所有对后台库的操作同步写到物理磁盘上，事务正常结束。
同步提交事务是等写库的操作完成之后将结果返回。
提交事务本身执行失败时，自动回滚到开启事务前的状态。
**param有效参数：**
cloudID
number
区域ID
否
0
timeout
number
超时时间ms
否
10000
**input有效参数：**
transactionID
string
事务ID
是

transactionType
number
事务类型
1：业务；2：安全；
否
1
**返回结果：**
{
 ret: 0, // 返回值
 consumetime: 0, // 执行耗时，单位毫秒
 traceid: "0", // 任务跟踪ID，用于查询跟踪日志，App引擎函数返回0
 output: { 
 errorcodes: [] // 错误码
 }
}
**错误码:**
参见《错误码_App引擎》
**脚本示例：**
let param = new StringMap({
 cloudID:3
});

let input = new StringMap({
 transactionID : "1978021535801286", // 事务ID
 transactionType: 2
});

let res = await CommitTransaction(param, input);
if(!res.ret){
 // 业务逻辑处理
 console.log(res);
}

### 3.2.2. 提交事务

 CommitTransaction(param, input); 

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
 number 
 区域ID 
 否 
 0 
 
 
 timeout 
 number 
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
 string 
 事务ID 
 是 
 
 
 
 transactionType 
 number 
 事务类型
1：业务；2：安全； 
 否 
 1 
 
 
 返回结果： 

 {
 ret: 0, // 返回值
 consumetime: 0, // 执行耗时，单位毫秒
 traceid: "0", // 任务跟踪ID，用于查询跟踪日志，App引擎函数返回0
 output: { 
 errorcodes: [] // 错误码
 }
}
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例： 

 let param = new StringMap({
 cloudID:3
});

let input = new StringMap({
 transactionID : "1978021535801286", // 事务ID
 transactionType: 2
});

let res = await CommitTransaction(param, input);
if(!res.ret){
 // 业务逻辑处理
 console.log(res);
}
 

# 3.2.3. 回滚事务

**RollbackTransaction(param, input);**
**功能描述：**回滚事务，事务在运行过程中出现某种异常，事务无法继续执行，系统将事务中对后台库已完成的操作全部撤销，回滚到事务开始之前的状态。
**param有效参数：**
cloudID
number
区域ID
否
0
timeout
number
超时时间ms
否
10000
**input有效参数：**
transactionID
string
事务ID
是

transactionType
number
事务类型
1：业务；2：安全；
否
1
**返回结果：**
{
 ret: 0, // 返回值
 consumetime: 0, // 执行耗时，单位毫秒
 traceid: "0", // 任务跟踪ID，用于查询跟踪日志，App引擎函数返回0
 output: { 
 errorcodes: [] // 错误码
 }
}
**错误码:**
参见《错误码_App引擎》
**脚本示例：**
let param = new StringMap({
 cloudID:3
});

let input = new StringMap({
 transactionID : "1978021535801286", // 事务ID
 transactionType: 2
});

let res = await RollbackTransaction(param, input);
if(!res.ret){
 // 业务逻辑处理
 console.log(res);
}

### 3.2.3. 回滚事务

 RollbackTransaction(param, input); 

 功能描述： 回滚事务，事务在运行过程中出现某种异常，事务无法继续执行，系统将事务中对后台库已完成的操作全部撤销，回滚到事务开始之前的状态。

 param有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 默认值 
 
 
 
 cloudID 
 number 
 区域ID 
 否 
 0 
 
 
 timeout 
 number 
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
 string 
 事务ID 
 是 
 
 
 
 transactionType 
 number 
 事务类型
1：业务；2：安全； 
 否 
 1 
 
 
 返回结果： 

 {
 ret: 0, // 返回值
 consumetime: 0, // 执行耗时，单位毫秒
 traceid: "0", // 任务跟踪ID，用于查询跟踪日志，App引擎函数返回0
 output: { 
 errorcodes: [] // 错误码
 }
}
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例： 

 let param = new StringMap({
 cloudID:3
});

let input = new StringMap({
 transactionID : "1978021535801286", // 事务ID
 transactionType: 2
});

let res = await RollbackTransaction(param, input);
if(!res.ret){
 // 业务逻辑处理
 console.log(res);
}
 

# 3.3. 通用函数

## 3.3. 通用函数

# 3.3.1. 将JS时间对象转换成UTC相对时间

**>dateToUTCTime(date);**
**功能描述：**将JS时间对象转换成需要的UTC相对时间
**参数说明：**
date
date
date类型
**返回值：** 时间戳
**脚本示例:**
const date = new Date();
const UTCTime = dateToUTCTime(date);

### 3.3.1. 将JS时间对象转换成UTC相对时间

 >dateToUTCTime(date); 

 功能描述： 将JS时间对象转换成需要的UTC相对时间

 参数说明： 

 
 
 
 参数名 
 类型 
 说明 
 
 
 
 date 
 date 
 date类型 
 
 
 返回值： 时间戳

 脚本示例: 

 const date = new Date();
const UTCTime = dateToUTCTime(date);
 

# 3.3.2. 将UTC相对时间转换成JS时间对象

**>UTCTimeToDate(utcTime);**
**功能描述：**将UTC相对时间转换成JS时间对象
**参数说明：**
utcTime
var
时间戳
**返回值：** JS时间对象 // date类型
**脚本示例:**
const utcTime = "1643180034";
const date = UTCTimeToDate(utcTime);

### 3.3.2. 将UTC相对时间转换成JS时间对象

 >UTCTimeToDate(utcTime); 

 功能描述： 将UTC相对时间转换成JS时间对象

 参数说明： 

 
 
 
 参数名 
 类型 
 说明 
 
 
 
 utcTime 
 var 
 时间戳 
 
 
 返回值： JS时间对象 // date类型

 脚本示例: 

 const utcTime = "1643180034";
const date = UTCTimeToDate(utcTime);
 

# 3.3.3. 将字符串转换成ArrayBuffer

**> StringToArrayBuffer(str);**
**功能描述：**将字符串转换成ArrayBuffer;
**参数说明：**
str
var
需要转换的字符串
**返回值：** 转换之后的arrayBuffer对象
**脚本示例:**
let str = "stringStr";
let bufferValue = StringToArrayBuffer(str);

### 3.3.3. 将字符串转换成ArrayBuffer

 > StringToArrayBuffer(str); 

 功能描述： 将字符串转换成ArrayBuffer;

 参数说明： 

 
 
 
 参数名 
 类型 
 说明 
 
 
 
 str 
 var 
 需要转换的字符串 
 
 
 返回值： 转换之后的arrayBuffer对象

 脚本示例: 

 let str = "stringStr";
let bufferValue = StringToArrayBuffer(str);
 

# 3.3.4. 将ArrayBuffer转换成字符串

**> ArrayBufferToString(buffer);**
**功能描述：**将字符串转换成ArrayBuffer;
**参数说明：**
buffer
arrayBuffer
需要转换的ArrayBuffer对象
**返回值：** 转换之后的字符串
**脚本示例:**
let str = "stringStr";
let bufferValue = StringToArrayBuffer(str);

let newStr = ArrayBufferToString(bufferValue);

### 3.3.4. 将ArrayBuffer转换成字符串

 > ArrayBufferToString(buffer); 

 功能描述： 将字符串转换成ArrayBuffer;

 参数说明： 

 
 
 
 参数名 
 类型 
 说明 
 
 
 
 buffer 
 arrayBuffer 
 需要转换的ArrayBuffer对象 
 
 
 返回值： 转换之后的字符串

 脚本示例: 

 let str = "stringStr";
let bufferValue = StringToArrayBuffer(str);

let newStr = ArrayBufferToString(bufferValue);
 

# 3.3.5. 关闭加载动画

**>closeLoading();**
**功能描述：**生成器中配置启用加载动画功能，由用户根据具体使用场景选择关闭加载动画的时机。
**返回值：** 无
**脚本示例:**
let isShow = true; // 页面加载完成，关闭加载动画
if(isShow){
 closeLoading(); 
}

### 3.3.5. 关闭加载动画

 >closeLoading(); 

 功能描述： 生成器中配置启用加载动画功能，由用户根据具体使用场景选择关闭加载动画的时机。

 返回值： 无

 脚本示例: 

 let isShow = true; // 页面加载完成，关闭加载动画
if(isShow){
 closeLoading(); 
}
 

# 3.3.6. 跳转到登录页面

**> toLogin();**
**功能描述：**退出登录用户且返回到登录页面。
**返回值：** 无
**脚本示例:**
// 跳转至登录页面
toLogin();

### 3.3.6. 跳转到登录页面

 > toLogin(); 

 功能描述： 退出登录用户且返回到登录页面。

 返回值： 无

 脚本示例: 

 // 跳转至登录页面
toLogin();
 

# 3.4. WebJS内置类型

## 3.4. WebJS内置类型

# 3.4.1. StringMap

​ StringMap是一种关联式容器对象，包含“关键字/映射值”，容器可以存储多组键值对元素，每个键值对元素由1个key值(key Value) 和1个映射值(mapped Value)组成，key值通常是一些序号或索引，映射值是与该key值关联的数据。

### 3.4.1. StringMap

 ​ StringMap是一种关联式容器对象，包含“关键字/映射值”，容器可以存储多组键值对元素，每个键值对元素由1个key值(key Value) 和1个映射值(mapped Value)组成，key值通常是一些序号或索引，映射值是与该key值关联的数据。

# 3.4.1.1. StringMap键值对

​ StringMap键值对是容器里的单个元素，每个pair由1个key值(key Value) 和1个映射值(mapped Value)组成。

#### 3.4.1.1. StringMap键值对

 ​ StringMap键值对是容器里的单个元素，每个pair由1个key值(key Value) 和1个映射值(mapped Value)组成。

# 3.4.1.2. 关键字数据类型说明

StringMap元素的key值的数据类型有限制，只能是string类型。
StringMap的关键作用是一一映射，不允许有两个相同的关键字，每个key值只能对应一个映射值。
String类型的key值不区分大小写，aa和AA是相同的key，不可以同时存在，按aa和AA键值获取的映射值是一样的。
String类型的key值支持各种特殊字符，不支持_开头。

#### 3.4.1.2. 关键字数据类型说明

 StringMap元素的key值的数据类型有限制，只能是string类型。

 StringMap的关键作用是一一映射，不允许有两个相同的关键字，每个key值只能对应一个映射值。

 String类型的key值不区分大小写，aa和AA是相同的key，不可以同时存在，按aa和AA键值获取的映射值是一样的。

 String类型的key值支持各种特殊字符，不支持_开头。

# 3.4.1.3. 映射值数据类型说明

map元素的映射值的数据类型没有限制，支持所有的元语言基本类型。

#### 3.4.1.3. 映射值数据类型说明

 map元素的映射值的数据类型没有限制，支持所有的元语言基本类型。

# 3.4.1.4. 声明map变量

let 变量名 = new StringMap({
 // 键值对
})

#### 3.4.1.4. 声明map变量

 let 变量名 = new StringMap({
 // 键值对
})
 

# 3.4.1.5. StringMap访问

#### 3.4.1.5. StringMap访问

# 3.4.1.5.1. StringMap添加、修改

// 添加方式1
let strMap = new StringMap({
 id1:1, 
 name:"yakong"
});
// 添加方式2
strMap.id2 = 2; // map.键名=值;
// 添加方式3
strMap["id3"] = 3; // map["键名"]=值;

// 修改方式1
strMap.id2 = 4; // map.键名=值;
// 修改方式2
strMap["id3"] = 5; // map["键名"]=值;

 3.4.1.5.1. StringMap添加、修改 
 // 添加方式1
let strMap = new StringMap({
 id1:1, 
 name:"yakong"
});
// 添加方式2
strMap.id2 = 2; // map.键名=值;
// 添加方式3
strMap["id3"] = 3; // map["键名"]=值;

// 修改方式1
strMap.id2 = 4; // map.键名=值;
// 修改方式2
strMap["id3"] = 5; // map["键名"]=值;
 

# 3.4.1.5.2. StringMap读取

let strMap = new StringMap({
 id1:1, 
 name:"亚控",
 childStrMap: new StringMap({
 childID : 2,
 name:"西安亚控"
 })
});
// 读取方式1
let parName = strMap.name; // parName = "亚控"
// 读取方式2
let parName = strMap["name"]; // parName = "亚控"
// 两种方式支持混合使用
let chilName = strMap.childStrMap["name"]; // chilName = "西安亚控"

 3.4.1.5.2. StringMap读取 
 let strMap = new StringMap({
 id1:1, 
 name:"亚控",
 childStrMap: new StringMap({
 childID : 2,
 name:"西安亚控"
 })
});
// 读取方式1
let parName = strMap.name; // parName = "亚控"
// 读取方式2
let parName = strMap["name"]; // parName = "亚控"
// 两种方式支持混合使用
let chilName = strMap.childStrMap["name"]; // chilName = "西安亚控"
 

# 3.4.1.6. Map容器的方法

#### 3.4.1.6. Map容器的方法

# 3.4.1.6.1. 添加键值对元素

**number >.__insert(var key,var value,var type)**
**功能描述：**向map容器中添加键值对元素
**参数说明：**
key
string
key值
是
value
var
映射值
是
type
var
映射值类型
否
**返回值：整数**
**0：**成功
**非0：**失败
**脚本示例：**
const strMap1 = new StringMap({});
strMap1._insert("name","yakong"); // type省略，默认为字符串类型
strMap1._insert("id","12345"); // type省略，默认为uint64类型
strMap1._insert("id1","12345","string"); // 指定了映射值的类型为string 
strMap1._insert("id2", 123); // type省略，默认为int32类型
strMap1._insert("id3", 123.12); // type省略，默认为double类型

 3.4.1.6.1. 添加键值对元素 
 number >.__insert(var key,var value,var type) 

 功能描述： 向map容器中添加键值对元素

 参数说明： 

 
 
 
 参数名 
 类型 
 说明 
 是否必要 
 
 
 
 key 
 string 
 key值 
 是 
 
 
 value 
 var 
 映射值 
 是 
 
 
 type 
 var 
 映射值类型 
 否 
 
 
 返回值：整数 

 
 0： 成功

 非0： 失败

 
 脚本示例： 

 const strMap1 = new StringMap({});
strMap1._insert("name","yakong"); // type省略，默认为字符串类型
strMap1._insert("id","12345"); // type省略，默认为uint64类型
strMap1._insert("id1","12345","string"); // 指定了映射值的类型为string 
strMap1._insert("id2", 123); // type省略，默认为int32类型
strMap1._insert("id3", 123.12); // type省略，默认为double类型
 

# 3.4.1.6.2. 获取map中所有的键(key)

**var[] >._keys();**
**功能描述：**获取map对象中所有的键（key）。
**返回值： var[]**
**查找成功：**返回map对象中的所有键（key）
**空数组：**返回结果为空，map中没有键值对
**脚本示例：**
const strMap1 = new StringMap({
 id:1
});
strMap1._insert("name","yakong");
let key = strMap1._keys(); // key = ["id","name"]

 3.4.1.6.2. 获取map中所有的键(key) 
 var[] >._keys(); 

 功能描述： 获取map对象中所有的键（key）。

 返回值： var[] 

 
 查找成功： 返回map对象中的所有键（key）

 空数组： 返回结果为空，map中没有键值对

 
 脚本示例： 

 const strMap1 = new StringMap({
 id:1
});
strMap1._insert("name","yakong");
let key = strMap1._keys(); // key = ["id","name"]
 

# 3.4.1.6.3. 获取map中所有的值(value)

**var[] >._values();**
**功能描述：**获取map中所有的值（value）。
**返回值： var[]**
**查找成功：**返回map中的所有值（value）
**空数组：**返回结果为空，map中没有键值对
**脚本示例：**
const strMap1 = new StringMap({
 id:1
});
strMap1._insert("name","yakong");
let key = strMap1._values(); // key =[1, 'yakong']

 3.4.1.6.3. 获取map中所有的值(value) 
 var[] >._values(); 

 功能描述： 获取map中所有的值（value）。

 返回值： var[] 

 
 查找成功： 返回map中的所有值（value）

 空数组： 返回结果为空，map中没有键值对

 
 脚本示例： 

 const strMap1 = new StringMap({
 id:1
});
strMap1._insert("name","yakong");
let key = strMap1._values(); // key =[1, 'yakong']
 

# 3.4.1.6.4. 判断key是否存在

**bool >._containsKey(string key)** 
**功能描述：**判断指定的key在map中是否存在，存在返回1，不存在返回0。
**返回值： bool**
**存在：**true
**不存在：**false
**脚本示例：**
const strMap1 = new StringMap({
 id:1
});
let isExit = strMap1._containsKey("id"); // isExit = true
let isExit1 = strMap1._containsKey("name"); // isExit = false

 3.4.1.6.4. 判断key是否存在 
 bool >._containsKey(string key) 

 功能描述： 判断指定的key在map中是否存在，存在返回1，不存在返回0。

 返回值： bool 

 
 存在： true

 不存在： false

 
 脚本示例： 

 const strMap1 = new StringMap({
 id:1
});
let isExit = strMap1._containsKey("id"); // isExit = true
let isExit1 = strMap1._containsKey("name"); // isExit = false
 

# 3.4.1.6.5. 删除键值对元素

**number >._erase(string key)**
**功能描述：**通过key值定位，删除map容器里的键值对元素。
**返回值： bool**
**存在：**true
**不存在：**false
**脚本示例：**
const strMap1 = new StringMap({
 id:1
});
strMap1._insert("name","yakong");
let earse = strMap1._earse("name"); // earse = true

 3.4.1.6.5. 删除键值对元素 
 number >._erase(string key) 

 功能描述： 通过key值定位，删除map容器里的键值对元素。

 返回值： bool 

 
 存在： true

 不存在： false

 
 脚本示例： 

 const strMap1 = new StringMap({
 id:1
});
strMap1._insert("name","yakong");
let earse = strMap1._earse("name"); // earse = true
 

# 3.4.1.6.6. 清空容器

**>._clear()**
**功能描述：**删除map容器里的所有键值对元素。
**脚本示例:**
const strMap1 = new StringMap({
 id:1
});
strMap1._insert("name","yakong");
strMap1._clear(); 

 3.4.1.6.6. 清空容器 
 >._clear() 

 功能描述： 删除map容器里的所有键值对元素。

 脚本示例: 

 const strMap1 = new StringMap({
 id:1
});
strMap1._insert("name","yakong");
strMap1._clear(); 
 

# 3.4.1.6.7. 按key值获取映射值

**功能描述：通过key值定位，获取map容器里的键值对的映射值。**
var map容器变量.at(string key)
var map容器变量.find string key
**脚本示例:**
const strMap1 = new StringMap({
 id:1
});
strMap1._insert("name","yakong"); 
let value1 = strMap1._at("id"); // value1 = 1
let value2 = strMap1._find("name"); // valu2 = "yakong"

 3.4.1.6.7. 按key值获取映射值 
 功能描述：通过key值定位，获取map容器里的键值对的映射值。 

 
 
 
 按key值获取映射值 
 
 
 
 var map容器变量.at(string key) 
 
 
 var map容器变量.find string key 
 
 
 脚本示例: 

 const strMap1 = new StringMap({
 id:1
});
strMap1._insert("name","yakong"); 
let value1 = strMap1._at("id"); // value1 = 1
let value2 = strMap1._find("name"); // valu2 = "yakong"
 

# 3.4.1.6.8. 获取键值对数量

**number >._size()**
**功能描述：**获取map容器里的键值对数量。
**脚本示例:**
const strMap1 = new StringMap({
 id:1
});
strMap1._insert("name","yakong");
let size = strMap1._size(); // size = 2

 3.4.1.6.8. 获取键值对数量 
 number >._size() 

 功能描述： 获取map容器里的键值对数量。

 脚本示例: 

 const strMap1 = new StringMap({
 id:1
});
strMap1._insert("name","yakong");
let size = strMap1._size(); // size = 2
 

# 3.4.2. Variant

Variant对应的是元语言中的var类型，由于前端调用后台的给定的参数需要是var数组，因此需要在webJsFu中内置Variant类型；具体使用参见远程调用章节；

### 3.4.2. Variant

 Variant对应的是元语言中的var类型，由于前端调用后台的给定的参数需要是var数组，因此需要在webJsFu中内置Variant类型；具体使用参见远程调用章节；

# 3.4.2.1. 声明Variant变量

// 声明Variant类型变量
let 变量名 = new Variant(变量值,变量类型);
// 声明Variant数组类型变量
let 变量名 = new Variant([
new Variant(变量值,变量类型),
new Variant(变量值,变量类型),
...
]);
示例：
// 声明Variant类型变量
let param1 = new Variant("1978021535812480", "uint64");
let param2 = new Variant("参数二", "string");
let param3Map = new StringMap({ 
 name: "参数三",
 id: "1978021535812490"
});
let param4 = new Variant(100,"int8");

// 声明Variant数组类型变量
let param = new Variant([
 param1,
 param2,
 new Variant(param3Map),
 param4
]);

#### 3.4.2.1. 声明Variant变量

 // 声明Variant类型变量
let 变量名 = new Variant(变量值,变量类型);

 // 声明Variant数组类型变量
let 变量名 = new Variant([

 new Variant(变量值,变量类型),

 new Variant(变量值,变量类型),

 ...

 ]);

 示例：

 // 声明Variant类型变量
let param1 = new Variant("1978021535812480", "uint64");
let param2 = new Variant("参数二", "string");
let param3Map = new StringMap({ 
 name: "参数三",
 id: "1978021535812490"
});
let param4 = new Variant(100,"int8");

// 声明Variant数组类型变量
let param = new Variant([
 param1,
 param2,
 new Variant(param3Map),
 param4
]);
 

# 3.4.3. DataSet

DataSet即行列数据集，是一组行列数据的集合。
一个DataSet数据集如下所示：
55
4.5
45
4.3
2.5
654
56
4.4
46
4.3
2.6
646

### 3.4.3. DataSet

 DataSet即行列数据集，是一组行列数据的集合。

 一个DataSet数据集如下所示：

 
 
 
 进水温度 
 进水压力 
 出水温度 
 出水压力 
 液位 
 流量 
 
 
 
 55 
 4.5 
 45 
 4.3 
 2.5 
 654 
 
 
 56 
 4.4 
 46 
 4.3 
 2.6 
 646 
 
 

# 3.4.3.1. 属性

rowLength
数据集行数
let data = res.output.returnData;
let len = data.rowLength; // 行数
colLength
数据集列数
let data = res.output.returnData; 
let len = data.colLength; // 列数

#### 3.4.3.1. 属性

 
 
 
 属性名 
 描述 
 示例 
 
 
 
 rowLength 
 数据集行数 
 let data = res.output.returnData;
let len = data.rowLength; // 行数 
 
 
 colLength 
 数据集列数 
 let data = res.output.returnData; 
let len = data.colLength; // 列数 
 
 

# 3.4.3.2. 方法

#### 3.4.3.2. 方法

# 3.4.3.2.1. 获取指定行号的单行数据

**var[] >.row(number rowID)；**
**功能描述：**获取指定行号的单行数据。
**参数说明：**
rowID
number
行号，webJS行号位置从0开始，与元语言有区别
**返回值：**var[]类型，如果行号不存在，则返回空数组；
**脚本示例：**
let data = res.output.returnData;
let rowValue = data.row(0); // 获取第一行数据

 3.4.3.2.1. 获取指定行号的单行数据 
 var[] >.row(number rowID)； 

 功能描述： 获取指定行号的单行数据。

 参数说明： 

 
 
 
 参数名称 
 类型 
 说明 
 
 
 
 rowID 
 number 
 行号，webJS行号位置从0开始，与元语言有区别 
 
 
 返回值： var[]类型，如果行号不存在，则返回空数组；

 脚本示例： 

 let data = res.output.returnData;
let rowValue = data.row(0); // 获取第一行数据
 

# 3.4.3.2.2. 获取数据集的列名

**var[] >.colsNames()；**
**功能描述：**获取数据集的列名。
**返回值：**string[]类型
**脚本示例：**
let data = res.output.returnData;
let colsName = data.colsNames(); // 数据集列名

 3.4.3.2.2. 获取数据集的列名 
 var[] >.colsNames()； 

 功能描述： 获取数据集的列名。

 返回值： string[]类型

 脚本示例： 

 let data = res.output.returnData;
let colsName = data.colsNames(); // 数据集列名
 

# 3.4.3.2.3. 获取指定列名的单列数据

**var[] >.colByName(string colName)；**
**功能描述：**获取指定列名的单列数据，返回var数组。
**参数说明：**
colName
string
数据集列名
**返回值：**var[]类型，如果列名不存在，则返回空数组；
**脚本示例：**
let data = res.output.returnData;
let colValue = data.colByName("$name"); // 获取$name列的所有数据

 3.4.3.2.3. 获取指定列名的单列数据 
 var[] >.colByName(string colName)； 

 功能描述： 获取指定列名的单列数据，返回var数组。

 参数说明： 

 
 
 
 参数名称 
 类型 
 说明 
 
 
 
 colName 
 string 
 数据集列名 
 
 
 返回值： var[]类型，如果列名不存在，则返回空数组；

 脚本示例： 

 let data = res.output.returnData;
let colValue = data.colByName("$name"); // 获取$name列的所有数据
 

# 3.4.3.2.4. 获取指定行号、列号的单元格数据

**var>.cellByID(number rowID, number colID)；**
**功能描述：**获取指定行号、列号的单元格数据。
**参数说明：**
rowID
number
行号
colID
number
列号
**返回值：**var，单元格的数值，如果指定的单元格不存在，返失败错误信息
**脚本示例：**
let data = res.output.returnData;
let Value = data.cellByID(0,0); // 获取1行1列的数据

 3.4.3.2.4. 获取指定行号、列号的单元格数据 
 var>.cellByID(number rowID, number colID)； 

 功能描述： 获取指定行号、列号的单元格数据。

 参数说明： 

 
 
 
 参数名称 
 类型 
 说明 
 
 
 
 rowID 
 number 
 行号 
 
 
 colID 
 number 
 列号 
 
 
 返回值： var，单元格的数值，如果指定的单元格不存在，返失败错误信息

 脚本示例： 

 let data = res.output.returnData;
let Value = data.cellByID(0,0); // 获取1行1列的数据
 

# 3.4.3.2.5. 获取指定行号、列名的单元格数据

**var>.cellByName(number rowID, string colName)；**
**功能描述：**获取指定行号、列名的单元格的数据。
**参数说明：**
rowID
number
行号
colName
string
列名
**返回值：**var，单元格的数值，如果指定的单元格不存在，返失败错误信息
**脚本示例：**
let data = res.output.returnData;
let Value = data.cellByName(0,"$id"); // 获取1行列名为$id的数据

 3.4.3.2.5. 获取指定行号、列名的单元格数据 
 var>.cellByName(number rowID, string colName)； 

 功能描述： 获取指定行号、列名的单元格的数据。

 参数说明： 

 
 
 
 参数名称 
 类型 
 说明 
 
 
 
 rowID 
 number 
 行号 
 
 
 colName 
 string 
 列名 
 
 
 返回值： var，单元格的数值，如果指定的单元格不存在，返失败错误信息

 脚本示例： 

 let data = res.output.returnData;
let Value = data.cellByName(0,"$id"); // 获取1行列名为$id的数据
 

# 3.4.3.2.6. DateSet转var数组

**var[\][]>.toVarArray()；**
**功能描述：**将后台库返回的dataSet表转成var[\][]数组。
**返回值：**var[\][]
**脚本示例：**
let data = res.output.returnData;
let revValue = data.toVarArray(); // 将dataSet转成二维数组

 3.4.3.2.6. DateSet转var数组 
 var[][]>.toVarArray()； 

 功能描述： 将后台库返回的dataSet表转成var[][]数组。

 返回值： var[][]

 脚本示例： 

 let data = res.output.returnData;
let revValue = data.toVarArray(); // 将dataSet转成二维数组
 

# 3.5. NodeJS关系数据库操作函数

## 3.5. NodeJS关系数据库操作函数

# 3.5.1. 创建关系数据库连接

**>CreateSqlConnect(connectName, type, options);**
**功能描述：**在本地创建一个关系数据库的连接。
**注意事项：**
连接名不能重复；
连接名在本WOS内有效，本WOS中运行的nodejs功能单元都可以使用这个连接操作关系数据库；
**输入参数:**
connectName
string
连接名
是
type
number
关系数据库类型 
1：mysql
是
options
object
连接信息
{
 host: "192.168.30.174",// 数据库服务器的地址
 user:user: "user1",// 用户名
 password: "wellintech",// 密码
 database:"WOS",// 数据库名称
 port:3306,// 端口
 charset:,// 连接的字符集
}
参见https://www.npmjs.com/package/mysql#connection-options
否
**返回结果：**
{
 ret: 0, // 返回值
 message： "" // 执行错误时返回的描述信息
}
**错误码:**
参见《错误码_App引擎》
**脚本示例：**
let connectName = "亚控_mysql"; 
let type = 1; // mysql
let options = {
 host: "192.168.30.74",
 port: 3306,
 database: "WOS",
 user: "user1",
 password: "wellintech"
};
let createRes = await CreateSqlConnect(connectName , type, options);
if (createRes.ret == 0) {
 Trace(2, "创建成功", "");
} else {
 Trace(2, "创建失败", createRes);
}

### 3.5.1. 创建关系数据库连接

 >CreateSqlConnect(connectName, type, options); 

 功能描述： 在本地创建一个关系数据库的连接。

 注意事项： 

 
 连接名不能重复；

 连接名在本WOS内有效，本WOS中运行的nodejs功能单元都可以使用这个连接操作关系数据库；

 
 输入参数: 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 
 
 
 connectName 
 string 
 连接名 
 是 
 
 
 type 
 number 
 关系数据库类型 
1：mysql 
 是 
 
 
 options 
 object 
 连接信息
{
 host: "192.168.30.174",// 数据库服务器的地址
 user:user: "user1",// 用户名
 password: "wellintech",// 密码
 database:"WOS",// 数据库名称
 port:3306,// 端口
 charset:,// 连接的字符集
}
参见 https://www.npmjs.com/package/mysql#connection-options 
 否 
 
 
 返回结果： 

 {
 ret: 0, // 返回值
 message： "" // 执行错误时返回的描述信息
}
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例： 

 let connectName = "亚控_mysql"; 
let type = 1; // mysql
let options = {
 host: "192.168.30.74",
 port: 3306,
 database: "WOS",
 user: "user1",
 password: "wellintech"
};
let createRes = await CreateSqlConnect(connectName , type, options);
if (createRes.ret == 0) {
 Trace(2, "创建成功", "");
} else {
 Trace(2, "创建失败", createRes);
}
 

# 3.5.2. 执行SQL语句

**>SqlExecute(connectName, sql, options);**
**功能描述：**执行sql语句。
**输入参数:**
connectName
string
连接名
是
sql
string
sql语句
是
options
object
配置信息，例如事务ID
否
**返回结果：**
{
 ret: 0, // 返回值
 message： "", // 执行错误时返回的描述信息
 data: [{}] // 查询语句返回的数据
}
**错误码:**
参见《错误码_App引擎》
**脚本示例：**
let connectName = "亚控_mysql"; 
const sql = "select * from alarm_information limit 0, 1000;"
let options = {transactionID: 1};
let executeRes = await SqlExecute(connectName, sql, options);
if (executeRes.ret == 0) {
 console.log("执行成功");
 console.log(executeRes.data); // 返回数据，查询才有
} else {
 console.log("执行失败", executeRes);
}

### 3.5.2. 执行SQL语句

 >SqlExecute(connectName, sql, options); 

 功能描述： 执行sql语句。

 输入参数: 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 
 
 
 connectName 
 string 
 连接名 
 是 
 
 
 sql 
 string 
 sql语句 
 是 
 
 
 options 
 object 
 配置信息，例如事务ID 
 否 
 
 
 返回结果： 

 {
 ret: 0, // 返回值
 message： "", // 执行错误时返回的描述信息
 data: [{}] // 查询语句返回的数据
}
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例： 

 let connectName = "亚控_mysql"; 
const sql = "select * from alarm_information limit 0, 1000;"
let options = {transactionID: 1};
let executeRes = await SqlExecute(connectName, sql, options);
if (executeRes.ret == 0) {
 console.log("执行成功");
 console.log(executeRes.data); // 返回数据，查询才有
} else {
 console.log("执行失败", executeRes);
}
 

# 3.5.3. 删除关系数据库连接

**>DeleteSqlConnect(connectName);**
**功能描述：**删除本地创建的关系数据库连接。
**输入参数:**
connectName
string
连接名
是
**返回结果：**
{
 ret: 0, // 返回值
 message： "" // 执行错误时返回的描述信息
}
**错误码:**
参见《错误码_App引擎》
**脚本示例：**
let connectName = "亚控_mysql"; 
let deleteRes = await DeleteSqlConnect(connectName);
if (deleteRes.ret == 0) {
 Trace(2, "删除成功", "");
} else {
 Trace(2, "删除失败", deleteRes);
}

### 3.5.3. 删除关系数据库连接

 >DeleteSqlConnect(connectName); 

 功能描述： 删除本地创建的关系数据库连接。

 输入参数: 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 
 
 
 connectName 
 string 
 连接名 
 是 
 
 
 返回结果： 

 {
 ret: 0, // 返回值
 message： "" // 执行错误时返回的描述信息
}
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例： 

 let connectName = "亚控_mysql"; 
let deleteRes = await DeleteSqlConnect(connectName);
if (deleteRes.ret == 0) {
 Trace(2, "删除成功", "");
} else {
 Trace(2, "删除失败", deleteRes);
}
 

# 3.5.4. 开启关系数据库事务

**>BeginSqlTransaction(connectName, timeout);**
**功能描述：**开启关系数据库的事务
**输入参数:**
connectName
string
连接名
是
timeout
number
超时时间，默认值10000ms，超时后事务自动回滚
否
**返回结果：**
{
 ret: 0, // 返回值
 transactionID： 1 // 事务ID
}
**错误码:**
参见《错误码_App引擎》
**脚本示例：**
let connectName = "亚控_mysql"; 
let timeout = 20000; 
let res = await BeginSqlTransaction(connectName, timeout);
if res.ret == 0) {
 Trace(2, "开启事务成功", "");
} else {
 Trace(2, "开启事务失败", res);
}

### 3.5.4. 开启关系数据库事务

 >BeginSqlTransaction(connectName, timeout); 

 功能描述： 开启关系数据库的事务

 输入参数: 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 
 
 
 connectName 
 string 
 连接名 
 是 
 
 
 timeout 
 number 
 超时时间，默认值10000ms，超时后事务自动回滚 
 否 
 
 
 返回结果： 

 {
 ret: 0, // 返回值
 transactionID： 1 // 事务ID
}
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例： 

 let connectName = "亚控_mysql"; 
let timeout = 20000; 
let res = await BeginSqlTransaction(connectName, timeout);
if res.ret == 0) {
 Trace(2, "开启事务成功", "");
} else {
 Trace(2, "开启事务失败", res);
}
 

# 3.5.5. 提交关系数据库事务

**>CommitSqlTransaction(connectName, transactionID);**
**功能描述：**提交关系数据库的事务
**输入参数:**
connectName
string
连接名
是
transactionID
number
事务ID
是
**返回结果：**
{
 ret: 0 // 返回值
}
**错误码:**
参见《错误码_App引擎》
**脚本示例：**
let connectName = "亚控_mysql"; 
let transactionID = 1; 
let res = await CommitSqlTransaction(connectName, transactionID);
if res.ret == 0) {
 Trace(2, "提交事务成功", "");
} else {
 Trace(2, "提交事务失败", "");
}

### 3.5.5. 提交关系数据库事务

 >CommitSqlTransaction(connectName, transactionID); 

 功能描述： 提交关系数据库的事务

 输入参数: 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 
 
 
 connectName 
 string 
 连接名 
 是 
 
 
 transactionID 
 number 
 事务ID 
 是 
 
 
 返回结果： 

 {
 ret: 0 // 返回值
}
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例： 

 let connectName = "亚控_mysql"; 
let transactionID = 1; 
let res = await CommitSqlTransaction(connectName, transactionID);
if res.ret == 0) {
 Trace(2, "提交事务成功", "");
} else {
 Trace(2, "提交事务失败", "");
}
 

# 3.5.6. 回滚关系数据库事务

**>RollbackSqlTransaction(connectName, transactionID);**
**功能描述：**回滚关系数据库的事务
**输入参数:**
connectName
string
连接名
是
transactionID
number
事务ID
是
**返回结果：**
{
 ret: 0 // 返回值
}
**错误码:**
参见《错误码_App引擎》
**脚本示例：**
let connectName = "亚控_mysql"; 
let transactionID = 1; 
let res = await RollbackSqlTransaction(connectName, transactionID);
if res.ret == 0) {
 Trace(2, "回滚事务成功", "");
} else {
 Trace(2, "回滚事务失败", "");
}

### 3.5.6. 回滚关系数据库事务

 >RollbackSqlTransaction(connectName, transactionID); 

 功能描述： 回滚关系数据库的事务

 输入参数: 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 
 
 
 connectName 
 string 
 连接名 
 是 
 
 
 transactionID 
 number 
 事务ID 
 是 
 
 
 返回结果： 

 {
 ret: 0 // 返回值
}
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例： 

 let connectName = "亚控_mysql"; 
let transactionID = 1; 
let res = await RollbackSqlTransaction(connectName, transactionID);
if res.ret == 0) {
 Trace(2, "回滚事务成功", "");
} else {
 Trace(2, "回滚事务失败", "");
}
 

# 3.6. NodeJS定时器操作函数

## 3.6. NodeJS定时器操作函数

# 3.6.1. 发起定时调用

**>TimerCall(param, input);**
**功能描述：**发起本App的定时调用。
**注意事项：**
callBackFuncName只能是本App的自定义功能。
callBackFuncName回调功能无输入参数。
callBackFuncName回调功能无返回值。
repeat参数为0时，无限次调用CallbackFunction功能。
如果repeat不等于0，定时调用次数超过了repeat设置的次数之后，该定时器会自动被清除，定时器句柄ID失效。
定时器如果太多，会影响精度，1个App最多发起32个定时调用。
1个进程内，建议定时器个数不要超过512，否则，会影响精度。
功能A定时回调功能A，会形成循环调用，不允许这样使用。
A定时回调功能B，B又定时回调A，容易让CPU资源一直被占用，不限制用户这样使用，但是也不建议用户这样使用。
**param有效参数：**
areaID
number
App对象所在数据区，不填为默认数据区
否
type
number
对象类型:
23001（nodeJSApp）；
是
timeout
number
超时时间ms
否
callBackFuncName
function
回调函数
是
**input有效参数：**
delay
number
延迟启动时间，默认为0，单位ms
否
period
number
定时周期，ms
是
repeat
number
重复周期调用的次数，为0时，表示无限次调用
是
**返回结果：**
{
 ret: 0, // 返回值
 timerID: 123456 // 定时器句柄ID 
}
**错误码:**
参见《错误码_App引擎》
**脚本示例：**
// 自定义回调函数cb
async function cb() {
 Trace(2, "定时执行成功！", "");
}

// 发起定时调用
var param = new StringMap({
 type: 23001,
 areaID: 0,
 timeOut: 30000,
 callBackFuncName: cb,
});
var input = new StringMap({
 delay: 0,
 period: 1000,
 repeat: 0
});
let res = await TimerCall(param, input);

### 3.6.1. 发起定时调用

 >TimerCall(param, input); 

 功能描述： 发起本App的定时调用。

 注意事项： 

 
 callBackFuncName只能是本App的自定义功能。

 callBackFuncName回调功能无输入参数。

 callBackFuncName回调功能无返回值。

 repeat参数为0时，无限次调用CallbackFunction功能。

 如果repeat不等于0，定时调用次数超过了repeat设置的次数之后，该定时器会自动被清除，定时器句柄ID失效。

 定时器如果太多，会影响精度，1个App最多发起32个定时调用。

 1个进程内，建议定时器个数不要超过512，否则，会影响精度。

 功能A定时回调功能A，会形成循环调用，不允许这样使用。

 A定时回调功能B，B又定时回调A，容易让CPU资源一直被占用，不限制用户这样使用，但是也不建议用户这样使用。

 
 param有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 
 
 
 areaID 
 number 
 App对象所在数据区，不填为默认数据区 
 否 
 
 
 type 
 number 
 对象类型:
23001（nodeJSApp）； 
 是 
 
 
 timeout 
 number 
 超时时间ms 
 否 
 
 
 callBackFuncName 
 function 
 回调函数 
 是 
 
 
 input有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 
 
 
 delay 
 number 
 延迟启动时间，默认为0，单位ms 
 否 
 
 
 period 
 number 
 定时周期，ms 
 是 
 
 
 repeat 
 number 
 重复周期调用的次数，为0时，表示无限次调用 
 是 
 
 
 返回结果： 

 {
 ret: 0, // 返回值
 timerID: 123456 // 定时器句柄ID 
}
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例： 

 // 自定义回调函数cb
async function cb() {
 Trace(2, "定时执行成功！", "");
}

// 发起定时调用
var param = new StringMap({
 type: 23001,
 areaID: 0,
 timeOut: 30000,
 callBackFuncName: cb,
});
var input = new StringMap({
 delay: 0,
 period: 1000,
 repeat: 0
});
let res = await TimerCall(param, input);
 

# 3.6.2. 取消定时调用

**>DelTimer(param, input);**
**功能描述：**取消本App的定时调用。
**注意事项：**
当创建定时器所指定的repeat不等于0，定时调用次数超过了repeat设置的次数时，该定时器 会自动被删除，定时器句柄ID失效，再按该ID调删除定时器函数,找不到定时器，返回失败。
在onDestroy里调用取消定时调用函数，会返回失败，因为功能单元库在执行onDestroy之前删除了所有的定时器。
**param有效参数：**
timeout
number
超时时间ms
否
**input有效参数：**
timerID
number
定时器句柄ID
是
**返回结果：**
{
 ret: 0 // 返回值
}
**错误码:**
参见《错误码_App引擎》
**脚本示例：**
// 取消定时调用
var param = new StringMap({
 timeOut: 30000
});
var input = new StringMap({
 timerID: 123456
});
let res = await DelTimer(param, input);

### 3.6.2. 取消定时调用

 >DelTimer(param, input); 

 功能描述： 取消本App的定时调用。

 注意事项： 

 
 当创建定时器所指定的repeat不等于0，定时调用次数超过了repeat设置的次数时，该定时器 会自动被删除，定时器句柄ID失效，再按该ID调删除定时器函数,找不到定时器，返回失败。

 在onDestroy里调用取消定时调用函数，会返回失败，因为功能单元库在执行onDestroy之前删除了所有的定时器。

 
 param有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 
 
 
 timeout 
 number 
 超时时间ms 
 否 
 
 
 input有效参数： 

 
 
 
 名称 
 类型 
 说明 
 是否必填 
 
 
 
 timerID 
 number 
 定时器句柄ID 
 是 
 
 
 返回结果： 

 {
 ret: 0 // 返回值
}
 
 错误码: 

 参见《错误码_App引擎》

 脚本示例： 

 // 取消定时调用
var param = new StringMap({
 timeOut: 30000
});
var input = new StringMap({
 timerID: 123456
});
let res = await DelTimer(param, input);