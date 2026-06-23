# JS函数_历史计划库

- 分组：JS函数说明
- 原始章节名：JS函数_历史计划库
- 内容块数量：23
- 来源：WOS4 帮助手册 static/js/file.js

## 正文

# 1. 函数清单

创建
Create(param, input);
删除
Delete(param, input);
修改
Update(param, input);
升级
Upgrade(param, input);
查询
Query(param, input);
订阅
Subscribe(param, input);
取消订阅
UnSubscribe(param, input);

# 1. 函数清单

 
 
 
 函数名称 
 函数原型 
 
 
 
 创建 
 Create(param, input); 
 
 
 删除 
 Delete(param, input); 
 
 
 修改 
 Update(param, input); 
 
 
 升级 
 Upgrade(param, input); 
 
 
 查询 
 Query(param, input); 
 
 
 订阅 
 Subscribe(param, input); 
 
 
 取消订阅 
 UnSubscribe(param, input); 
 
 

# 2. 公共说明

# 2. 公共说明

# 2.1. 入参规则

1、param、input中，必填字段缺少时报错，填写多余字段时忽略。
2、写操作中，给不存在的字段赋值报错。
3、读操作中，查询不存在的字段不报错，返回为null。
4、函数入参的字段名和数据结构的属性名都是不区分大小写的。
5、数值类型参数赋值是支持匹配转换的，比如int32类型可以赋值int16或int64的值。

## 2.1. 入参规则

 1、param、input中，必填字段缺少时报错，填写多余字段时忽略。

 2、写操作中，给不存在的字段赋值报错。

 3、读操作中，查询不存在的字段不报错，返回为null。

 4、函数入参的字段名和数据结构的属性名都是不区分大小写的。

 5、数值类型参数赋值是支持匹配转换的，比如int32类型可以赋值int16或int64的值。

# 3. 函数说明

# 3. 函数说明

# 4. 更多示例

# 4. 更多示例

# 4.1. 时空对象

## 4.1. 时空对象

# 4.1.1. Create

### 4.1.1. Create

# 4.1.1.1. 创建全新时空对象

//示例_创建全新时空对象
////////////////////////////////
debugger;
const cloudID = parseInt(window.location.pathname.split("/")[4]);
main();

async function main()
{
 let param = new StringMap({
 cloudID: cloudID, //访问云ID，省略、0：访问本App的云。
 areaID: 0, //数据区ID，0：默认数据区。
 transactionID: 0, //事务ID，省略、0：无事务。
 timeout: 3000, //超时时间（ms），省略：默认10000ms 
 type: 3701 //数据类型，3701、4701;
 });

 let appspacetimeguid = "";
 let dataFields = ["$name","$parentGUID","$label1","$displayName"];
 let dataValue1 = [];
 let dataValues = [];

 //////////////在根下创建时空////////////////////
 dataValue1 = ["集团1","","lay1","group1"];
 dataValues.push(dataValue1);
 dataValue1 = ["集团2","","lay1","group2"];
 dataValues.push(dataValue1);

 ///////////////在时空下创建时空//////////////////
 dataValue1 = ["时空1","063cb9aa-29f1-4c8a-88ae-63445b38b80b","lay2",""];
 dataValues.push(dataValue1);
 dataValue1 = ["时空2","063cb9aa-29f1-4c8a-88ae-63445b38b80b","lay2",""];
 dataValues.push(dataValue1);

 ///////////////在时空下创建时空//////////////////
 dataValue1 = ["时空3","063cb9aa-29f1-4c8a-88ae-63445b38b80b","lay3",""];
 dataValues.push(dataValue1);
 dataValue1 = ["时空4","063cb9aa-29f1-4c8a-88ae-63445b38b80b","lay3",""];
 dataValues.push(dataValue1);
 
 //////////////////////////////////
 let input = new StringMap({
 dataFields: dataFields,
 dataValues: dataValues,
 appspacetimeguid: appspacetimeguid
 });

 let res = await Create(param, input);
 if (!res || res.ret != 0 || !res.output)
 {
 console.log("Create fail");
 console.log("res=",res);
 } 
 else
 {
 console.log("Create success");
 console.log("ids[]=",res.output.ids);
 console.log("guids[]=",res.output.guids);
 }
}

#### 4.1.1.1. 创建全新时空对象

 //示例_创建全新时空对象
////////////////////////////////
debugger;
const cloudID = parseInt(window.location.pathname.split("/")[4]);
main();

async function main()
{
 let param = new StringMap({
 cloudID: cloudID, //访问云ID，省略、0：访问本App的云。
 areaID: 0, //数据区ID，0：默认数据区。
 transactionID: 0, //事务ID，省略、0：无事务。
 timeout: 3000, //超时时间（ms），省略：默认10000ms 
 type: 3701 //数据类型，3701、4701;
 });

 let appspacetimeguid = "";
 let dataFields = ["$name","$parentGUID","$label1","$displayName"];
 let dataValue1 = [];
 let dataValues = [];

 //////////////在根下创建时空////////////////////
 dataValue1 = ["集团1","","lay1","group1"];
 dataValues.push(dataValue1);
 dataValue1 = ["集团2","","lay1","group2"];
 dataValues.push(dataValue1);

 ///////////////在时空下创建时空//////////////////
 dataValue1 = ["时空1","063cb9aa-29f1-4c8a-88ae-63445b38b80b","lay2",""];
 dataValues.push(dataValue1);
 dataValue1 = ["时空2","063cb9aa-29f1-4c8a-88ae-63445b38b80b","lay2",""];
 dataValues.push(dataValue1);

 ///////////////在时空下创建时空//////////////////
 dataValue1 = ["时空3","063cb9aa-29f1-4c8a-88ae-63445b38b80b","lay3",""];
 dataValues.push(dataValue1);
 dataValue1 = ["时空4","063cb9aa-29f1-4c8a-88ae-63445b38b80b","lay3",""];
 dataValues.push(dataValue1);
 
 //////////////////////////////////
 let input = new StringMap({
 dataFields: dataFields,
 dataValues: dataValues,
 appspacetimeguid: appspacetimeguid
 });

 let res = await Create(param, input);
 if (!res || res.ret != 0 || !res.output)
 {
 console.log("Create fail");
 console.log("res=",res);
 } 
 else
 {
 console.log("Create success");
 console.log("ids[]=",res.output.ids);
 console.log("guids[]=",res.output.guids);
 }
}
 

# 4.1.1.2. 创建指定ID、GUID的时空对象

//示例_创建指定ID、GUID的时空对象（运行库只在非部署类型数据区下支持）
////////////////////////////////
debugger;
const cloudID = parseInt(window.location.pathname.split("/")[4]);
main();

async function main()
{
 let param = new StringMap({
 cloudID: cloudID, //访问云ID，省略、0：访问本App的云。
 areaID: 0, //数据区ID，0：默认数据区。
 transactionID: 0, //事务ID，省略、0：无事务。
 timeout: 3000, //超时时间（ms），省略：默认10000ms 
 type: 3701 //数据类型，3701、4701;
 });

 let appspacetimeguid = "";
 let dataFields = ["$id","$guid","$name","$parentGUID"];
 let dataValue1 = [];
 let dataValues = [];
 
 //////////////在根下创建时空////////////////////
 dataValue1 = ["18158513697557839881","392aa455-d91b-4144-b11d-83c4a2691a56","集团1",""];
 dataValues.push(dataValue1);
 dataValue1 = ["18158513697557839882","b544c252-bc93-4151-a69f-4b87f64ba360","集团2",""];
 dataValues.push(dataValue1);

 ///////////////在时空下创建时空//////////////////
 dataValue1 = ["18158513697557839883","69b87ec0-fbb9-4458-bda0-da1e66ee837f","集团1工厂1","392aa455-d91b-4144-b11d-83c4a2691a56"];
 dataValues.push(dataValue1);
 dataValue1 = ["18158513697557839884","c602c674-220a-4bc8-be34-7f51d4a27087","集团1工厂2","392aa455-d91b-4144-b11d-83c4a2691a56"];
 dataValues.push(dataValue1);

 ///////////////在时空下创建时空//////////////////
 dataValue1 = ["18158513697557839885","727061eb-8f6a-4e3a-8343-6108f4cabf60","集团2工厂1","b544c252-bc93-4151-a69f-4b87f64ba360"];
 dataValues.push(dataValue1);
 dataValue1 = ["18158513697557839886","ca029e0f-dbd8-4a62-9603-78ddcc9fd890","集团2工厂2","b544c252-bc93-4151-a69f-4b87f64ba360"];
 dataValues.push(dataValue1);
 
 //////////////////////////////////
 let input = new StringMap({
 dataFields:dataFields,
 dataValues: dataValues,
 appspacetimeguid: appspacetimeguid
 });

 let res = await Create(param, input);
 if (!res || res.ret != 0 || !res.output)
 {
 console.log("Create fail");
 console.log("res=",res);
 } 
 else
 {
 console.log("Create success");
 console.log("ids[]=",res.output.ids);
 console.log("guids[]=",res.output.guids);
 }
}

#### 4.1.1.2. 创建指定ID、GUID的时空对象

 //示例_创建指定ID、GUID的时空对象（运行库只在非部署类型数据区下支持）
////////////////////////////////
debugger;
const cloudID = parseInt(window.location.pathname.split("/")[4]);
main();

async function main()
{
 let param = new StringMap({
 cloudID: cloudID, //访问云ID，省略、0：访问本App的云。
 areaID: 0, //数据区ID，0：默认数据区。
 transactionID: 0, //事务ID，省略、0：无事务。
 timeout: 3000, //超时时间（ms），省略：默认10000ms 
 type: 3701 //数据类型，3701、4701;
 });

 let appspacetimeguid = "";
 let dataFields = ["$id","$guid","$name","$parentGUID"];
 let dataValue1 = [];
 let dataValues = [];
 
 //////////////在根下创建时空////////////////////
 dataValue1 = ["18158513697557839881","392aa455-d91b-4144-b11d-83c4a2691a56","集团1",""];
 dataValues.push(dataValue1);
 dataValue1 = ["18158513697557839882","b544c252-bc93-4151-a69f-4b87f64ba360","集团2",""];
 dataValues.push(dataValue1);

 ///////////////在时空下创建时空//////////////////
 dataValue1 = ["18158513697557839883","69b87ec0-fbb9-4458-bda0-da1e66ee837f","集团1工厂1","392aa455-d91b-4144-b11d-83c4a2691a56"];
 dataValues.push(dataValue1);
 dataValue1 = ["18158513697557839884","c602c674-220a-4bc8-be34-7f51d4a27087","集团1工厂2","392aa455-d91b-4144-b11d-83c4a2691a56"];
 dataValues.push(dataValue1);

 ///////////////在时空下创建时空//////////////////
 dataValue1 = ["18158513697557839885","727061eb-8f6a-4e3a-8343-6108f4cabf60","集团2工厂1","b544c252-bc93-4151-a69f-4b87f64ba360"];
 dataValues.push(dataValue1);
 dataValue1 = ["18158513697557839886","ca029e0f-dbd8-4a62-9603-78ddcc9fd890","集团2工厂2","b544c252-bc93-4151-a69f-4b87f64ba360"];
 dataValues.push(dataValue1);
 
 //////////////////////////////////
 let input = new StringMap({
 dataFields:dataFields,
 dataValues: dataValues,
 appspacetimeguid: appspacetimeguid
 });

 let res = await Create(param, input);
 if (!res || res.ret != 0 || !res.output)
 {
 console.log("Create fail");
 console.log("res=",res);
 } 
 else
 {
 console.log("Create success");
 console.log("ids[]=",res.output.ids);
 console.log("guids[]=",res.output.guids);
 }
}
 

# 4.1.2. Delete

### 4.1.2. Delete

# 4.1.2.1. 删除指定对象（mode = 13（缺省））

//示例_删除指定对象，Delete_mode = 13（缺省）（运行库只在非部署类型数据区下支持）
////////////////////////////////
debugger;
const cloudID = parseInt(window.location.pathname.split("/")[4]);
main();

async function main()
{
 let param = new StringMap({
 cloudID: cloudID, //访问云ID，省略、0：访问本App的云。
 areaID: 0, //数据区ID，0：默认数据区。
 transactionID: 0, //事务ID，省略、0：无事务。
 timeout: 3000, //超时时间（ms），省略：默认10000ms 
 type: 3701 //数据类型，3701、4701;
 });

 let appspacetimeguid = "";
 let ids = ["1152921504606852742","1152921504606852741"];
 let guids = ["c3ab4641-b563-4be6-8d2a-2a33bc25334d","4e3ab8dc-9777-414d-aa7d-065676be92c1"];
 let condition1;
 let conditions = [];
 
 ////////////////指定对象ID////////////////
 condition1 = new StringMap({
 mode: 13, //查找模式
 identifierType: 1, //对象标识类型
 ids: ids,
 dealMode: 1, //删除模式，1=有后代则删除失败
 });
 conditions.push(condition1);

 ////////////////指定对象GUID///////////////
 condition1 = new StringMap({
 mode: 13, //查找模式
 identifierType: 5, //对象标识类型
 guids: guids,
 dealMode: 1, //删除模式，1=有后代则删除失败
 });
 conditions.push(condition1);

 //////////////////////////////////
 let input = new StringMap({
 conditions: conditions,
 appspacetimeguid: appspacetimeguid
 });

 let res = await Delete(param, input);
 if (!res || res.ret != 0 || !res.output)
 {
 console.log("Delete fail");
 console.log("res=",res);
 } 
 else
 {
 console.log("Delete success");
 }
}

#### 4.1.2.1. 删除指定对象（mode = 13（缺省））

 //示例_删除指定对象，Delete_mode = 13（缺省）（运行库只在非部署类型数据区下支持）
////////////////////////////////
debugger;
const cloudID = parseInt(window.location.pathname.split("/")[4]);
main();

async function main()
{
 let param = new StringMap({
 cloudID: cloudID, //访问云ID，省略、0：访问本App的云。
 areaID: 0, //数据区ID，0：默认数据区。
 transactionID: 0, //事务ID，省略、0：无事务。
 timeout: 3000, //超时时间（ms），省略：默认10000ms 
 type: 3701 //数据类型，3701、4701;
 });

 let appspacetimeguid = "";
 let ids = ["1152921504606852742","1152921504606852741"];
 let guids = ["c3ab4641-b563-4be6-8d2a-2a33bc25334d","4e3ab8dc-9777-414d-aa7d-065676be92c1"];
 let condition1;
 let conditions = [];
 
 ////////////////指定对象ID////////////////
 condition1 = new StringMap({
 mode: 13, //查找模式
 identifierType: 1, //对象标识类型
 ids: ids,
 dealMode: 1, //删除模式，1=有后代则删除失败
 });
 conditions.push(condition1);

 ////////////////指定对象GUID///////////////
 condition1 = new StringMap({
 mode: 13, //查找模式
 identifierType: 5, //对象标识类型
 guids: guids,
 dealMode: 1, //删除模式，1=有后代则删除失败
 });
 conditions.push(condition1);

 //////////////////////////////////
 let input = new StringMap({
 conditions: conditions,
 appspacetimeguid: appspacetimeguid
 });

 let res = await Delete(param, input);
 if (!res || res.ret != 0 || !res.output)
 {
 console.log("Delete fail");
 console.log("res=",res);
 } 
 else
 {
 console.log("Delete success");
 }
}
 

# 4.1.3. Update

### 4.1.3. Update

# 4.1.3.1. 修改指定对象（mode = 13（缺省））

//示例_修改指定对象，Update_mode = 13（缺省）（运行库只在非部署类型数据区下支持）
////////////////////////////////
debugger;
const cloudID = parseInt(window.location.pathname.split("/")[4]);
main();

async function main()
{
 let param = new StringMap({
 cloudID: cloudID, //访问云ID，省略、0：访问本App的云。
 areaID: 0, //数据区ID，0：默认数据区。
 transactionID: 0, //事务ID，省略、0：无事务。
 timeout: 3000, //超时时间（ms），省略：默认10000ms 
 type: 3701 //数据类型，3701、4701;
 });
 
 let appspacetimeguid = "";
 let ids = ["1152921504606852742","1152921504606852741"];
 let guids = ["c3ab4641-b563-4be6-8d2a-2a33bc25334d","4e3ab8dc-9777-414d-aa7d-065676be92c1"];
 let dataFields = [];
 let dataValue1 = [];
 let dataValues = [];

 let condition1;
 let conditions = [];

 ////////////////指定对象ID////////////////
 dataFields = ["$name","$parentGUID"];
 dataValues = [];
 
 dataValue1 = ["obj11",""];
 dataValues.push(dataValue1);
 dataValue1 = ["obj12","1a1d3ef3-cb9c-4d5d-bd50-4fedab770cf2"];
 dataValues.push(dataValue1);
 
 condition1 = new StringMap({
 mode: 13, //查找模式
 identifierType: 1, //对象标识类型
 ids: ids,
 dataFields: dataFields,
 dataValues: dataValues
 });
 conditions.push(condition1);

 ////////////////指定对象GUID////////////////
 dataFields = ["$parentGUID"];
 dataValues = [];
 
 dataValue1 = [""];
 dataValues.push(dataValue1);
 dataValue1 = ["727061eb-8f6a-4e3a-8343-6108f4cabf60];
 dataValues.push(dataValue1); 
 
 condition1 = new StringMap({
 mode: 13, //查找模式
 identifierType: 5, //对象标识类型
 guids: guids,
 dataFields: dataFields,
 dataValues: dataValues
 });
 conditions.push(condition1);

 //////////////////////////////////
 let input = new StringMap({
 conditions: conditions,
 appspacetimeguid: appspacetimeguid
 });

 let res = await Update(param, input);
 if (!res || res.ret != 0 || !res.output)
 {
 console.log("Update fail");
 console.log("res=",res);
 } 
 else
 {
 console.log("Update success");
 }
}

#### 4.1.3.1. 修改指定对象（mode = 13（缺省））

 //示例_修改指定对象，Update_mode = 13（缺省）（运行库只在非部署类型数据区下支持）
////////////////////////////////
debugger;
const cloudID = parseInt(window.location.pathname.split("/")[4]);
main();

async function main()
{
 let param = new StringMap({
 cloudID: cloudID, //访问云ID，省略、0：访问本App的云。
 areaID: 0, //数据区ID，0：默认数据区。
 transactionID: 0, //事务ID，省略、0：无事务。
 timeout: 3000, //超时时间（ms），省略：默认10000ms 
 type: 3701 //数据类型，3701、4701;
 });
 
 let appspacetimeguid = "";
 let ids = ["1152921504606852742","1152921504606852741"];
 let guids = ["c3ab4641-b563-4be6-8d2a-2a33bc25334d","4e3ab8dc-9777-414d-aa7d-065676be92c1"];
 let dataFields = [];
 let dataValue1 = [];
 let dataValues = [];

 let condition1;
 let conditions = [];

 ////////////////指定对象ID////////////////
 dataFields = ["$name","$parentGUID"];
 dataValues = [];
 
 dataValue1 = ["obj11",""];
 dataValues.push(dataValue1);
 dataValue1 = ["obj12","1a1d3ef3-cb9c-4d5d-bd50-4fedab770cf2"];
 dataValues.push(dataValue1);
 
 condition1 = new StringMap({
 mode: 13, //查找模式
 identifierType: 1, //对象标识类型
 ids: ids,
 dataFields: dataFields,
 dataValues: dataValues
 });
 conditions.push(condition1);

 ////////////////指定对象GUID////////////////
 dataFields = ["$parentGUID"];
 dataValues = [];
 
 dataValue1 = [""];
 dataValues.push(dataValue1);
 dataValue1 = ["727061eb-8f6a-4e3a-8343-6108f4cabf60];
 dataValues.push(dataValue1); 
 
 condition1 = new StringMap({
 mode: 13, //查找模式
 identifierType: 5, //对象标识类型
 guids: guids,
 dataFields: dataFields,
 dataValues: dataValues
 });
 conditions.push(condition1);

 //////////////////////////////////
 let input = new StringMap({
 conditions: conditions,
 appspacetimeguid: appspacetimeguid
 });

 let res = await Update(param, input);
 if (!res || res.ret != 0 || !res.output)
 {
 console.log("Update fail");
 console.log("res=",res);
 } 
 else
 {
 console.log("Update success");
 }
}
 

# 4.1.4. Query

### 4.1.4. Query

# 4.1.4.1. 查询符合条件的对象（mode = 11）

//示例_查询符合条件的对象，Query_mode = 11
////////////////////////////////
debugger;
const cloudID = parseInt(window.location.pathname.split("/")[4]);
main();

async function main()
{
 let param = new StringMap({
 cloudID: cloudID, //访问云ID，省略、0：访问本App的云。
 areaID: 0, //数据区ID，0：默认数据区。
 transactionID: 0, //事务ID，省略、0：无事务。
 timeout: 3000, //超时时间（ms），省略：默认10000ms 
 type: 3701 //数据类型，3701、4701;
 });

 let appspacetimeguid = "";
 let returnFields = ["$id","$guid","$name","$displayName","$description","$label1","$label2","$label3","$parentGUID","$TRGUID","$timeSpan"];
 
 let condition1;
 let conditions = [];
 
 //////////////查所有////////////////////
 condition1 = new StringMap({
 mode: 11, //查找模式
 returnFields: returnFields
 });
 conditions.push(condition1);

 //////////////按filter过滤查////////////////////
 condition1 = new StringMap({
 mode: 11, //查找模式
 filter: "$name==\"hy\"",
 returnFields: returnFields
 });
 conditions.push(condition1);

 //////////////////////////////////
 let input = new StringMap({
 conditions: conditions,
 appspacetimeguid: appspacetimeguid
 });

 let res = await Query(param, input);
 if (!res || res.ret != 0 || !res.output)
 {
 console.log("Query fail");
 console.log("ret=",ret);
 } 
 else
 {
 console.log("Query success");
 console.log("returndatas=",res.output.returndatas);
 }
}

#### 4.1.4.1. 查询符合条件的对象（mode = 11）

 //示例_查询符合条件的对象，Query_mode = 11
////////////////////////////////
debugger;
const cloudID = parseInt(window.location.pathname.split("/")[4]);
main();

async function main()
{
 let param = new StringMap({
 cloudID: cloudID, //访问云ID，省略、0：访问本App的云。
 areaID: 0, //数据区ID，0：默认数据区。
 transactionID: 0, //事务ID，省略、0：无事务。
 timeout: 3000, //超时时间（ms），省略：默认10000ms 
 type: 3701 //数据类型，3701、4701;
 });

 let appspacetimeguid = "";
 let returnFields = ["$id","$guid","$name","$displayName","$description","$label1","$label2","$label3","$parentGUID","$TRGUID","$timeSpan"];
 
 let condition1;
 let conditions = [];
 
 //////////////查所有////////////////////
 condition1 = new StringMap({
 mode: 11, //查找模式
 returnFields: returnFields
 });
 conditions.push(condition1);

 //////////////按filter过滤查////////////////////
 condition1 = new StringMap({
 mode: 11, //查找模式
 filter: "$name==\"hy\"",
 returnFields: returnFields
 });
 conditions.push(condition1);

 //////////////////////////////////
 let input = new StringMap({
 conditions: conditions,
 appspacetimeguid: appspacetimeguid
 });

 let res = await Query(param, input);
 if (!res || res.ret != 0 || !res.output)
 {
 console.log("Query fail");
 console.log("ret=",ret);
 } 
 else
 {
 console.log("Query success");
 console.log("returndatas=",res.output.returndatas);
 }
}
 

# 4.1.4.2. 查询指定对象（的子对象、对象树）（mode = 13、省略）

//示例_查询指定对象（的子对象、对象树），Query_mode = 13、省略
////////////////////////////////
debugger;
const cloudID = parseInt(window.location.pathname.split("/")[4]);
main();

async function main()
{
 let param = new StringMap({
 cloudID: cloudID, //访问云ID，省略、0：访问本App的云。
 areaID: 0, //数据区ID，0：默认数据区。
 transactionID: 0, //事务ID，省略、0：无事务。
 timeout: 3000, //超时时间（ms），省略：默认10000ms 
 type: 3701 //数据类型，3701、4701;
 });

 let appspacetimeguid = "";
 let ids = ["1152921504606852742","1152921504606852741"];
 let names = ["学庄作业区","砖井作业区"];
 let guids = ["","4e3ab8dc-9777-414d-aa7d-065676be92c1"];
 let returnFields = ["$id","$guid","$name","$displayName","$description","$label1","$label2","$label3","$parentGUID","$TRGUID","$timeSpan"];
 
 let condition1;
 let conditions = [];
 
 //////////////指定对象ID[]查指定时空////////////////////
 condition1 = new StringMap({
 mode: 13, //查找模式
 queryMode: 1, //查询模式，查本身，1;
 identifierType: 1,
 ids: ids,
 returnFields: returnFields
 });
 conditions.push(condition1);

 //////////////指定对象NAME[]查本身+全部后代////////////////////
 condition1 = new StringMap({
 mode: 13, //查找模式
 queryMode: 3, //查询模式，查本身+后代，3;
 identifierType: 2,
 names: names,
 returnFields: returnFields
 });
 conditions.push(condition1);
 
 //////////////指定对象GUID[]查本身+全部后代////////////////////
 condition1 = new StringMap({
 mode: 13, //查找模式
 queryMode: 3, //查询模式，查本身+后代，3;
 identifierType: 5,
 guids: guids,
 filter: "$name include \"作业区\"",
 returnFields: returnFields
 });
 conditions.push(condition1);
 
 //////////////////////////////////
 let input = new StringMap({
 conditions: conditions,
 appspacetimeguid: appspacetimeguid
 });

 let res = await Query(param, input);
 if (!res || res.ret != 0 || !res.output)
 {
 console.log("Query fail");
 console.log("ret=",ret);
 } 
 else
 {
 console.log("Query success");
 console.log("returndatas=",res.output.returndatas);
 }
}

#### 4.1.4.2. 查询指定对象（的子对象、对象树）（mode = 13、省略）

 //示例_查询指定对象（的子对象、对象树），Query_mode = 13、省略
////////////////////////////////
debugger;
const cloudID = parseInt(window.location.pathname.split("/")[4]);
main();

async function main()
{
 let param = new StringMap({
 cloudID: cloudID, //访问云ID，省略、0：访问本App的云。
 areaID: 0, //数据区ID，0：默认数据区。
 transactionID: 0, //事务ID，省略、0：无事务。
 timeout: 3000, //超时时间（ms），省略：默认10000ms 
 type: 3701 //数据类型，3701、4701;
 });

 let appspacetimeguid = "";
 let ids = ["1152921504606852742","1152921504606852741"];
 let names = ["学庄作业区","砖井作业区"];
 let guids = ["","4e3ab8dc-9777-414d-aa7d-065676be92c1"];
 let returnFields = ["$id","$guid","$name","$displayName","$description","$label1","$label2","$label3","$parentGUID","$TRGUID","$timeSpan"];
 
 let condition1;
 let conditions = [];
 
 //////////////指定对象ID[]查指定时空////////////////////
 condition1 = new StringMap({
 mode: 13, //查找模式
 queryMode: 1, //查询模式，查本身，1;
 identifierType: 1,
 ids: ids,
 returnFields: returnFields
 });
 conditions.push(condition1);

 //////////////指定对象NAME[]查本身+全部后代////////////////////
 condition1 = new StringMap({
 mode: 13, //查找模式
 queryMode: 3, //查询模式，查本身+后代，3;
 identifierType: 2,
 names: names,
 returnFields: returnFields
 });
 conditions.push(condition1);
 
 //////////////指定对象GUID[]查本身+全部后代////////////////////
 condition1 = new StringMap({
 mode: 13, //查找模式
 queryMode: 3, //查询模式，查本身+后代，3;
 identifierType: 5,
 guids: guids,
 filter: "$name include \"作业区\"",
 returnFields: returnFields
 });
 conditions.push(condition1);
 
 //////////////////////////////////
 let input = new StringMap({
 conditions: conditions,
 appspacetimeguid: appspacetimeguid
 });

 let res = await Query(param, input);
 if (!res || res.ret != 0 || !res.output)
 {
 console.log("Query fail");
 console.log("ret=",ret);
 } 
 else
 {
 console.log("Query success");
 console.log("returndatas=",res.output.returndatas);
 }
}
 

# 4.1.5. AsyncStartUp

//示例_异步批量启动时空对象（运行库只在非部署类型数据区下支持）
////////////////////////////////
debugger;
const cloudID = parseInt(window.location.pathname.split("/")[4]);
main();

async function main()
{
 let param = new StringMap({
 cloudID: cloudID, //访问云ID，省略、0：访问本App的云。
 areaID: 0, //数据区ID，0：默认数据区。
 transactionID: 0, //事务ID，省略、0：无事务。
 timeout: 3000, //超时时间（ms），省略：默认10000ms
 callBackFuncName: "callBackFunc1", //回调函数名
 type: 3701 //数据类型，3701、4701;
 });

 //////////////指定时空对象[]////////////////////
 let appspacetimeguid = "";
 let ids = ["1152921504606852742","1152921504606852741"];
 let names = ["学庄作业区","砖井作业区"];
 let guids = ["c3ab4641-b563-4be6-8d2a-2a33bc25334d","4e3ab8dc-9777-414d-aa7d-065676be92c1"];
 
 let input = new StringMap({
 identifierType: 1, //对象标识类型
 ids: ids,
 appspacetimeguid: appspacetimeguid,
 });
 
 //let input = new StringMap({
 identifierType: 2, //对象标识类型
 names: names,
 appspacetimeguid: appspacetimeguid,
 });
 
 //let input = new StringMap({
 identifierType: 5, //对象标识类型
 guids: guids,
 appspacetimeguid: appspacetimeguid
 });
 
 //////////////////////////////////
 let res = await AsyncStartUp(param, input);
 if (!res || res.ret != 0 || !res.output)
 {
 console.log("AsyncStartUp fail");
 console.log("res=",res);
 } 
 else
 {
 console.log("AsyncStartUp success");
 }
}

### 4.1.5. AsyncStartUp

 //示例_异步批量启动时空对象（运行库只在非部署类型数据区下支持）
////////////////////////////////
debugger;
const cloudID = parseInt(window.location.pathname.split("/")[4]);
main();

async function main()
{
 let param = new StringMap({
 cloudID: cloudID, //访问云ID，省略、0：访问本App的云。
 areaID: 0, //数据区ID，0：默认数据区。
 transactionID: 0, //事务ID，省略、0：无事务。
 timeout: 3000, //超时时间（ms），省略：默认10000ms
 callBackFuncName: "callBackFunc1", //回调函数名
 type: 3701 //数据类型，3701、4701;
 });

 //////////////指定时空对象[]////////////////////
 let appspacetimeguid = "";
 let ids = ["1152921504606852742","1152921504606852741"];
 let names = ["学庄作业区","砖井作业区"];
 let guids = ["c3ab4641-b563-4be6-8d2a-2a33bc25334d","4e3ab8dc-9777-414d-aa7d-065676be92c1"];
 
 let input = new StringMap({
 identifierType: 1, //对象标识类型
 ids: ids,
 appspacetimeguid: appspacetimeguid,
 });
 
 //let input = new StringMap({
 identifierType: 2, //对象标识类型
 names: names,
 appspacetimeguid: appspacetimeguid,
 });
 
 //let input = new StringMap({
 identifierType: 5, //对象标识类型
 guids: guids,
 appspacetimeguid: appspacetimeguid
 });
 
 //////////////////////////////////
 let res = await AsyncStartUp(param, input);
 if (!res || res.ret != 0 || !res.output)
 {
 console.log("AsyncStartUp fail");
 console.log("res=",res);
 } 
 else
 {
 console.log("AsyncStartUp success");
 }
}
 

# 4.1.6. AsyncStop

//示例_异步批量停止时空对象（运行库只在非部署类型数据区下支持）
////////////////////////////////
debugger;
const cloudID = parseInt(window.location.pathname.split("/")[4]);
main();

async function main()
{
 let param = new StringMap({
 cloudID: cloudID, //访问云ID，省略、0：访问本App的云。
 areaID: 0, //数据区ID，0：默认数据区。
 transactionID: 0, //事务ID，省略、0：无事务。
 timeout: 3000, //超时时间（ms），省略：默认10000ms
 callBackFuncName: "callBackFunc1", //回调函数名
 type: 3701 //数据类型，3701、4701;
 });

 //////////////指定时空对象[]////////////////////
 let appspacetimeguid = "";
 let ids = ["1152921504606852742","1152921504606852741"];
 let names = ["学庄作业区","砖井作业区"];
 let guids = ["c3ab4641-b563-4be6-8d2a-2a33bc25334d","4e3ab8dc-9777-414d-aa7d-065676be92c1"];
 
 let input = new StringMap({
 identifierType: 1, //对象标识类型
 ids: ids,
 appspacetimeguid: appspacetimeguid,
 });
 
 //let input = new StringMap({
 identifierType: 2, //对象标识类型
 names: names,
 appspacetimeguid: appspacetimeguid,
 });
 
 //let input = new StringMap({
 identifierType: 5, //对象标识类型
 guids: guids,
 appspacetimeguid: appspacetimeguid
 });
 
 //////////////////////////////////
 let res = await AsyncStop(param, input);
 if (!res || res.ret != 0 || !res.output)
 {
 console.log("AsyncStop fail");
 console.log("res=",res);
 } 
 else
 {
 console.log("AsyncStop success");
 }
}

### 4.1.6. AsyncStop

 //示例_异步批量停止时空对象（运行库只在非部署类型数据区下支持）
////////////////////////////////
debugger;
const cloudID = parseInt(window.location.pathname.split("/")[4]);
main();

async function main()
{
 let param = new StringMap({
 cloudID: cloudID, //访问云ID，省略、0：访问本App的云。
 areaID: 0, //数据区ID，0：默认数据区。
 transactionID: 0, //事务ID，省略、0：无事务。
 timeout: 3000, //超时时间（ms），省略：默认10000ms
 callBackFuncName: "callBackFunc1", //回调函数名
 type: 3701 //数据类型，3701、4701;
 });

 //////////////指定时空对象[]////////////////////
 let appspacetimeguid = "";
 let ids = ["1152921504606852742","1152921504606852741"];
 let names = ["学庄作业区","砖井作业区"];
 let guids = ["c3ab4641-b563-4be6-8d2a-2a33bc25334d","4e3ab8dc-9777-414d-aa7d-065676be92c1"];
 
 let input = new StringMap({
 identifierType: 1, //对象标识类型
 ids: ids,
 appspacetimeguid: appspacetimeguid,
 });
 
 //let input = new StringMap({
 identifierType: 2, //对象标识类型
 names: names,
 appspacetimeguid: appspacetimeguid,
 });
 
 //let input = new StringMap({
 identifierType: 5, //对象标识类型
 guids: guids,
 appspacetimeguid: appspacetimeguid
 });
 
 //////////////////////////////////
 let res = await AsyncStop(param, input);
 if (!res || res.ret != 0 || !res.output)
 {
 console.log("AsyncStop fail");
 console.log("res=",res);
 } 
 else
 {
 console.log("AsyncStop success");
 }
}
 

# 4.2. 运行仓库

## 4.2. 运行仓库

# 4.2.1. Query

### 4.2.1. Query

# 4.2.1.1. 查询符合条件的运行仓库（mode = 210）

//示例_查询符合条件的运行仓库，Query_mode = 210
////////////////////////////////
debugger;
const cloudID = parseInt(window.location.pathname.split("/")[4]);
main();

async function main()
{
 let param = new StringMap({
 cloudID: cloudID, //访问云ID，省略、0：访问本App的云。
 areaID: 0, //数据区ID，0：默认数据区。
 transactionID: 0, //事务ID，省略、0：无事务。
 timeout: 3000, //超时时间（ms），省略：默认10000ms 
 type: 3702 //数据类型，3702、4702;
 });

 let appspacetimeguid = "18c935e8-c65c-4edc-b4a2-ed94bcc1e1cb";
 let returnFields = ["$guid","$name","$spaceTimeGUID","$parentGUID"];
 
 let condition1;
 let conditions = [];
 
 //////////////1在App部署时空里查////////////////////
 condition1 = new StringMap({
 mode: 210, //查找模式
 spaceTimeMode: 1, //时空选择模式，App时空，1
 returnFields: returnFields
 });
 conditions.push(condition1);

 //////////////2在指定时空里查////////////////////
 condition1 = new StringMap({
 mode: 210, //查找模式
 spaceTimeMode: 2, //时空选择模式，指定时空，2
 spaceTimeIdentifierType: 1,//时空对象标识类型，1
 spaceTimeID: "1152921504606852741",
 returnFields: returnFields
 });
 conditions.push(condition1);

 //////////////3在数据区里查////////////////////
 condition1 = new StringMap({
 mode: 210, //查找模式
 spaceTimeMode: 3, //时空选择模式，数据区，3
 returnFields: returnFields
 });
 conditions.push(condition1);
 
 //////////////////////////////////
 let input = new StringMap({
 conditions: conditions,
 appspacetimeguid: appspacetimeguid
 });

 let res = await Query(param, input);
 if (!res || res.ret != 0 || !res.output)
 {
 console.log("Query fail");
 console.log("ret=",ret);
 } 
 else
 {
 console.log("Query success");
 console.log("returndatas=",res.output.returndatas);
 }
}

#### 4.2.1.1. 查询符合条件的运行仓库（mode = 210）

 //示例_查询符合条件的运行仓库，Query_mode = 210
////////////////////////////////
debugger;
const cloudID = parseInt(window.location.pathname.split("/")[4]);
main();

async function main()
{
 let param = new StringMap({
 cloudID: cloudID, //访问云ID，省略、0：访问本App的云。
 areaID: 0, //数据区ID，0：默认数据区。
 transactionID: 0, //事务ID，省略、0：无事务。
 timeout: 3000, //超时时间（ms），省略：默认10000ms 
 type: 3702 //数据类型，3702、4702;
 });

 let appspacetimeguid = "18c935e8-c65c-4edc-b4a2-ed94bcc1e1cb";
 let returnFields = ["$guid","$name","$spaceTimeGUID","$parentGUID"];
 
 let condition1;
 let conditions = [];
 
 //////////////1在App部署时空里查////////////////////
 condition1 = new StringMap({
 mode: 210, //查找模式
 spaceTimeMode: 1, //时空选择模式，App时空，1
 returnFields: returnFields
 });
 conditions.push(condition1);

 //////////////2在指定时空里查////////////////////
 condition1 = new StringMap({
 mode: 210, //查找模式
 spaceTimeMode: 2, //时空选择模式，指定时空，2
 spaceTimeIdentifierType: 1,//时空对象标识类型，1
 spaceTimeID: "1152921504606852741",
 returnFields: returnFields
 });
 conditions.push(condition1);

 //////////////3在数据区里查////////////////////
 condition1 = new StringMap({
 mode: 210, //查找模式
 spaceTimeMode: 3, //时空选择模式，数据区，3
 returnFields: returnFields
 });
 conditions.push(condition1);
 
 //////////////////////////////////
 let input = new StringMap({
 conditions: conditions,
 appspacetimeguid: appspacetimeguid
 });

 let res = await Query(param, input);
 if (!res || res.ret != 0 || !res.output)
 {
 console.log("Query fail");
 console.log("ret=",ret);
 } 
 else
 {
 console.log("Query success");
 console.log("returndatas=",res.output.returndatas);
 }
}
 

# 4.2.1.2. 查询指定的运行仓库（mode = 211）

//示例_查询指定运行仓库，Query_mode = 211
////////////////////////////////
debugger;
const cloudID = parseInt(window.location.pathname.split("/")[4]);
main();

async function main()
{
 let param = new StringMap({
 cloudID: cloudID, //访问云ID，省略、0：访问本App的云。
 areaID: 0, //数据区ID，0：默认数据区。
 transactionID: 0, //事务ID，省略、0：无事务。
 timeout: 3000, //超时时间（ms），省略：默认10000ms 
 type: 3702 //数据类型，3702、4702;
 });

 let appspacetimeguid = "18c935e8-c65c-4edc-b4a2-ed94bcc1e1cb";
 let guids = ["18c935e8-c65c-4edc-b4a2-ed94bcc1e1cb","07615856-d87d-4814-8ad1-85b1fb4a6b81"];
 let returnFields = ["$guid","$name","$spaceTimeGUID","$parentGUID"];
 
 let condition1;
 let conditions = [];
 
 //////////////1在App部署时空里，指定GUID[]查////////////////////
 condition1 = new StringMap({
 mode: 211, //查找模式
 spaceTimeMode: 1, //时空选择模式，App时空，1
 guids: guids,
 //packetVersions: [1,3],
 returnFields: returnFields
 });
 conditions.push(condition1);

 //////////////2在指定时空里，指定GUID[]查////////////////////
 condition1 = new StringMap({
 mode: 211, //查找模式
 spaceTimeMode: 2, //时空选择模式，指定时空，2
 spaceTimeIdentifierType: 1,//时空对象标识类型，1
 spaceTimeID: "1152921504606852741",
 guids: guids,
 //packetVersions: [1,3],
 returnFields: returnFields
 });
 conditions.push(condition1);

 //////////////3在数据区里，指定GUID[]查////////////////////
 condition1 = new StringMap({
 mode: 211, //查找模式
 spaceTimeMode: 3, //时空选择模式，数据区
 guids: guids,
 //packetVersions: [1,3],
 returnFields: returnFields
 });
 conditions.push(condition1);
 
 //////////////////////////////////
 let input = new StringMap({
 conditions: conditions,
 appspacetimeguid: appspacetimeguid
 });

 let res = await Query(param, input);
 if (!res || res.ret != 0 || !res.output)
 {
 console.log("Query fail");
 console.log("ret=",ret);
 } 
 else
 {
 console.log("Query success");
 console.log("returndatas=",res.output.returndatas);
 }
}

#### 4.2.1.2. 查询指定的运行仓库（mode = 211）

 //示例_查询指定运行仓库，Query_mode = 211
////////////////////////////////
debugger;
const cloudID = parseInt(window.location.pathname.split("/")[4]);
main();

async function main()
{
 let param = new StringMap({
 cloudID: cloudID, //访问云ID，省略、0：访问本App的云。
 areaID: 0, //数据区ID，0：默认数据区。
 transactionID: 0, //事务ID，省略、0：无事务。
 timeout: 3000, //超时时间（ms），省略：默认10000ms 
 type: 3702 //数据类型，3702、4702;
 });

 let appspacetimeguid = "18c935e8-c65c-4edc-b4a2-ed94bcc1e1cb";
 let guids = ["18c935e8-c65c-4edc-b4a2-ed94bcc1e1cb","07615856-d87d-4814-8ad1-85b1fb4a6b81"];
 let returnFields = ["$guid","$name","$spaceTimeGUID","$parentGUID"];
 
 let condition1;
 let conditions = [];
 
 //////////////1在App部署时空里，指定GUID[]查////////////////////
 condition1 = new StringMap({
 mode: 211, //查找模式
 spaceTimeMode: 1, //时空选择模式，App时空，1
 guids: guids,
 //packetVersions: [1,3],
 returnFields: returnFields
 });
 conditions.push(condition1);

 //////////////2在指定时空里，指定GUID[]查////////////////////
 condition1 = new StringMap({
 mode: 211, //查找模式
 spaceTimeMode: 2, //时空选择模式，指定时空，2
 spaceTimeIdentifierType: 1,//时空对象标识类型，1
 spaceTimeID: "1152921504606852741",
 guids: guids,
 //packetVersions: [1,3],
 returnFields: returnFields
 });
 conditions.push(condition1);

 //////////////3在数据区里，指定GUID[]查////////////////////
 condition1 = new StringMap({
 mode: 211, //查找模式
 spaceTimeMode: 3, //时空选择模式，数据区
 guids: guids,
 //packetVersions: [1,3],
 returnFields: returnFields
 });
 conditions.push(condition1);
 
 //////////////////////////////////
 let input = new StringMap({
 conditions: conditions,
 appspacetimeguid: appspacetimeguid
 });

 let res = await Query(param, input);
 if (!res || res.ret != 0 || !res.output)
 {
 console.log("Query fail");
 console.log("ret=",ret);
 } 
 else
 {
 console.log("Query success");
 console.log("returndatas=",res.output.returndatas);
 }
}