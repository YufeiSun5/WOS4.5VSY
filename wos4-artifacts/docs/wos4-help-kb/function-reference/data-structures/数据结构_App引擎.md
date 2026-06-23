# 数据结构_App引擎

- 分组：数据结构
- 原始章节名：数据结构_App引擎
- 内容块数量：4
- 来源：WOS4 帮助手册 static/js/file.js

## 正文

# 1. 数据结构

# 1. 数据结构

# 1.1. App对象

$id
uint64
App对象ID
ReadOnly
ReadOnly
选填
无
系统自动生成，支持创建时指定
$guid
string
App对象GUID
ReadOnly
ReadOnly
不填
无
系统自动生成
$name
string
App对象名称
ReadOnly
ReadWrite
选填
同拷贝
默认继承拷贝的值，创建时可指定
对象名称命名规则与模型库App模型的名称的命名规则保持一致，即：
名称为字母、数字、字符、中文和下划线的组合，不能是空字符串，支持空格等特殊字符，不支持的非法字符有：’（英文单引号）”（英文双引号）?（英文问号）/(英文左斜杠)。
首字符不能是空格，其它合法字符都可以作为首字符，可以为字母、数字、字符、中文和下划线。
$parentID
uint64
父App对象ID
ReadOnly
ReadOnly
不填
0
如果没有父，为0
$copyGUID
string
App拷贝GUID
ReadOnly
ReadOnly
不填
同拷贝

$modelGUID
string
App模型GUID
ReadOnly
ReadOnly
不填
同拷贝

$modelVersion
int32
App模型版本
ReadOnly
ReadOnly
不填
同拷贝

$spaceTimeGUID
string
所属时空GUID
ReadOnly
ReadOnly
不填
无
表示该App对象创建的时空
$runStatus
int8
App对象运行状态
ReadOnly
ReadOnly
不填
无
可查询的运行状态：1：启动中， 2：运行正常，3：运行异常，4：停止中，7：停止异常
不可查询的运行状态：5：已停止，6：启动异常，8：强制删除中
8种状态均可订阅到。
$language
int32
App语言类型
ReadOnly
ReadOnly
不填
同拷贝
1：元语言，2：JS， 3：NodeJS，4：C++，5：QT
$geoGUID
string
关联空间物对象GUID
ReadOnly
ReadWrite
选填
同拷贝
默认继承拷贝的值，创建时可指定
$label1
string
分类标签1
ReadOnly
ReadWrite
选填
同拷贝
默认继承拷贝的值，创建时可指定
$label2
string
分类标签2
ReadOnly
ReadWrite
选填
同拷贝
默认继承拷贝的值，创建时可指定
$label3
string
分类标签3
ReadOnly
ReadWrite
选填
同拷贝
默认继承拷贝的值，创建时可指定
$displayName
string
显示名
ReadOnly
ReadWrite
选填
同拷贝
默认继承拷贝的值，创建时可指定，界面上显示用的
$repoGUID
string
仓库
ReadOnly
ReadOnly
不填
空字符串

$memberList
stringMap []
App对象的成员列表
ReadOnly
ReadWrite
选填
同拷贝
默认继承拷贝的值，创建时可指定

## 1.1. App对象

 
 
 
 属性 
 类型 
 描述 
 修改时 
 修改时-WebJS 
 创建时 
 默认值 
 备注 
 
 
 
 $id 
 uint64 
 App对象ID 
 ReadOnly 
 ReadOnly 
 选填 
 无 
 系统自动生成，支持创建时指定 
 
 
 $guid 
 string 
 App对象GUID 
 ReadOnly 
 ReadOnly 
 不填 
 无 
 系统自动生成 
 
 
 $name 
 string 
 App对象名称 
 ReadOnly 
 ReadWrite 
 选填 
 同拷贝 
 默认继承拷贝的值，创建时可指定
对象名称命名规则与模型库App模型的名称的命名规则保持一致，即：
名称为字母、数字、字符、中文和下划线的组合，不能是空字符串，支持空格等特殊字符，不支持的非法字符有：’（英文单引号）”（英文双引号）?（英文问号）/(英文左斜杠)。
首字符不能是空格，其它合法字符都可以作为首字符，可以为字母、数字、字符、中文和下划线。 
 
 
 $parentID 
 uint64 
 父App对象ID 
 ReadOnly 
 ReadOnly 
 不填 
 0 
 如果没有父，为0 
 
 
 $copyGUID 
 string 
 App拷贝GUID 
 ReadOnly 
 ReadOnly 
 不填 
 同拷贝 
 
 
 
 $modelGUID 
 string 
 App模型GUID 
 ReadOnly 
 ReadOnly 
 不填 
 同拷贝 
 
 
 
 $modelVersion 
 int32 
 App模型版本 
 ReadOnly 
 ReadOnly 
 不填 
 同拷贝 
 
 
 
 $spaceTimeGUID 
 string 
 所属时空GUID 
 ReadOnly 
 ReadOnly 
 不填 
 无 
 表示该App对象创建的时空 
 
 
 $runStatus 
 int8 
 App对象运行状态 
 ReadOnly 
 ReadOnly 
 不填 
 无 
 可查询的运行状态：1：启动中， 2：运行正常，3：运行异常，4：停止中，7：停止异常
不可查询的运行状态：5：已停止，6：启动异常，8：强制删除中
8种状态均可订阅到。 
 
 
 $language 
 int32 
 App语言类型 
 ReadOnly 
 ReadOnly 
 不填 
 同拷贝 
 1：元语言，2：JS， 3：NodeJS，4：C++，5：QT 
 
 
 $geoGUID 
 string 
 关联空间物对象GUID 
 ReadOnly 
 ReadWrite 
 选填 
 同拷贝 
 默认继承拷贝的值，创建时可指定 
 
 
 $label1 
 string 
 分类标签1 
 ReadOnly 
 ReadWrite 
 选填 
 同拷贝 
 默认继承拷贝的值，创建时可指定 
 
 
 $label2 
 string 
 分类标签2 
 ReadOnly 
 ReadWrite 
 选填 
 同拷贝 
 默认继承拷贝的值，创建时可指定 
 
 
 $label3 
 string 
 分类标签3 
 ReadOnly 
 ReadWrite 
 选填 
 同拷贝 
 默认继承拷贝的值，创建时可指定 
 
 
 $displayName 
 string 
 显示名 
 ReadOnly 
 ReadWrite 
 选填 
 同拷贝 
 默认继承拷贝的值，创建时可指定，界面上显示用的 
 
 
 $repoGUID 
 string 
 仓库 
 ReadOnly 
 ReadOnly 
 不填 
 空字符串 
 
 
 
 $memberList 
 stringMap [] 
 App对象的成员列表 
 ReadOnly 
 ReadWrite 
 选填 
 同拷贝 
 默认继承拷贝的值，创建时可指定 
 
 

# 1.2. 时空对象

$id
uint64
时空对象ID
ReadOnly
选填
无
系统生成，支持创建时指定
$guid
string
时空对象GUID
ReadOnly
选填
无
系统生成，支持创建时指定
$name
string
时空对象名称
ReadWrite
必填
无

$description
string
时空对象描述
ReadWrite
选填
空字符串

$parentGUID
string
父时空GUID
ReadWrite
选填
0
如果父时空为系统时空，则为空字符串；创建时不指定父时空，则创建在系统时空下。
$TRGUID
string
时间参考，时间坐标系GUID
ReadWrite
选填
0

$timeSpan
DateTime[2]
时间范围
ReadWrite
选填
{1601-01-01 0:0:0, 1601-01-01 0:0:0}

$label1
string
分类标签1
ReadWrite
选填
空字符串

$label2
string
分类标签2
ReadWrite
选填
空字符串

$label3
string
分类标签3
ReadWrite
选填
空字符串

$displayName
string
显示名
ReadWrite
选填
空字符串

$status
int32
状态
ReadOnly
不填
无
2、已部署，3：已启动，4：已停止

## 1.2. 时空对象

 
 
 
 属性 
 类型 
 描述 
 修改时 
 创建时 
 默认值 
 备注 
 
 
 
 $id 
 uint64 
 时空对象ID 
 ReadOnly 
 选填 
 无 
 系统生成，支持创建时指定 
 
 
 $guid 
 string 
 时空对象GUID 
 ReadOnly 
 选填 
 无 
 系统生成，支持创建时指定 
 
 
 $name 
 string 
 时空对象名称 
 ReadWrite 
 必填 
 无 
 
 
 
 $description 
 string 
 时空对象描述 
 ReadWrite 
 选填 
 空字符串 
 
 
 
 $parentGUID 
 string 
 父时空GUID 
 ReadWrite 
 选填 
 0 
 如果父时空为系统时空，则为空字符串；创建时不指定父时空，则创建在系统时空下。 
 
 
 $TRGUID 
 string 
 时间参考，时间坐标系GUID 
 ReadWrite 
 选填 
 0 
 
 
 
 $timeSpan 
 DateTime[2] 
 时间范围 
 ReadWrite 
 选填 
 {1601-01-01 0:0:0, 1601-01-01 0:0:0} 
 
 
 
 $label1 
 string 
 分类标签1 
 ReadWrite 
 选填 
 空字符串 
 
 
 
 $label2 
 string 
 分类标签2 
 ReadWrite 
 选填 
 空字符串 
 
 
 
 $label3 
 string 
 分类标签3 
 ReadWrite 
 选填 
 空字符串 
 
 
 
 $displayName 
 string 
 显示名 
 ReadWrite 
 选填 
 空字符串 
 
 
 
 $status 
 int32 
 状态 
 ReadOnly 
 不填 
 无 
 2、已部署，3：已启动，4：已停止