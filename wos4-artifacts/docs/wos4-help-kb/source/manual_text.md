# WellinOS4.5 Help Manual Extract

Source: http://221.239.19.118:15535/

Downloaded static resources are under `wos4-artifacts/docs/help-manual/`.

## Top-level Keys

- wos: 0
- app: 76

## Outline


### wos

### app
- 服务器推荐配置 (9 content blocks)
- 应用图标管理 (10 content blocks)
- wos安装卸载流程 (20 content blocks)
- 任务栏应用管理 (10 content blocks)
- 统一登录 (4 content blocks)
- 简介 (8 content blocks)
- 系统设置 (13 content blocks)
- 其他功能 (4 content blocks)
- 实时库 (41 content blocks)
- 模型库 (56 content blocks)
- 计划库 (2 content blocks)
- App引擎介绍 (45 content blocks)
- 快速入门 (25 content blocks)
- 节点管理 (16 content blocks)
- 机架管理 (5 content blocks)
- 系统客户端概述 (8 content blocks)
- 授权管理 (10 content blocks)
- 历史库 (176 content blocks)
- 资源组管理 (26 content blocks)
- 区域管理 (5 content blocks)
- 升级 (4 content blocks)
- 备份恢复管理 (9 content blocks)
- 准入配置管理 (5 content blocks)
- 报警及推送配置 (4 content blocks)
- 固定端对象管理 (10 content blocks)
- 系统任务列表查询 (2 content blocks)
- 安全客户端概述 (24 content blocks)
- 日志 (6 content blocks)
- 安全中心 (31 content blocks)
- 镜像包管理 (4 content blocks)
- 证书管理 (4 content blocks)
- 业务审计 (13 content blocks)
- 操作系统审计 (12 content blocks)
- 防护策略 (10 content blocks)
- 报警管理 (12 content blocks)
- 主客体访问范畴 (5 content blocks)
- 版本更新说明 (8 content blocks)
- 开发必读 (14 content blocks)
- 系统枚举_公共 (28 content blocks)
- 错误码_公共 (3 content blocks)
- 数据结构_模型库 (74 content blocks)
- JS函数_模型库 (12 content blocks)
- 元语言函数_基础语法 (311 content blocks)
- 接口库介绍 (37 content blocks)
- 系统枚举_模型库 (50 content blocks)
- 数据结构_实时库 (17 content blocks)
- JS函数_历史计划库 (23 content blocks)
- 元语言函数_基础函数 (84 content blocks)
- 错误码_模型库 (2 content blocks)
- JS函数_App引擎 (64 content blocks)
- 数据结构_历史计划库 (20 content blocks)
- 系统枚举_实时库 (25 content blocks)
- 错误码_实时库 (2 content blocks)
- 元语言函数_模型库 (277 content blocks)
- 数据结构_接口变量 (16 content blocks)
- 系统枚举_历史计划库 (15 content blocks)
- 错误码_历史计划库 (21 content blocks)
- 系统枚举_接口变量 (12 content blocks)
- 数据结构_安全库 (15 content blocks)
- 错误码_接口变量 (2 content blocks)
- 元语言函数_实时库 (263 content blocks)
- 系统枚举_安全库 (20 content blocks)
- 数据结构_运维库 (27 content blocks)
- 错误码_安全库 (2 content blocks)
- 系统枚举_运维库 (32 content blocks)
- 元语言函数_历史计划库 (211 content blocks)
- 数据结构_App引擎 (4 content blocks)
- 错误码_网关库 (2 content blocks)
- 系统枚举_App引擎 (24 content blocks)
- 元语言函数示例_历史计划库 (244 content blocks)
- 错误码_App引擎 (3 content blocks)
- 元语言函数_接口变量 (42 content blocks)
- 元语言函数_安全库 (178 content blocks)
- 元语言函数_运维库 (207 content blocks)
- 元语言函数_网关库 (30 content blocks)
- 元语言函数_App引擎 (70 content blocks)

## Search Index Samples

- 页面: (root) | 简介 | 简介 > 
浏览器地址栏，输入ip:port/run，即可进入BS桌面运行态登陆页，输入用户名和密码即可进入系统，如图：
![image-20250108142750101](media/BS桌面运行态登陆页.png)
运行系统登录成功后，会加载显示该用户所对应角色的公共客户端，如果有多个情况下，PC端会通过底部栏切换来实现多个客户端查看，移动端则始终加载显示第一个公共应用客户端。如图：
![image-20250108142826373](media/运行态页面.png) | 系统设置 | 系统设置 > 
用来配置应用页面的标题栏是否显示，默认显示，如图：
![](media/标题栏.png)
系统应用没有标题栏。 | 历史库 | 历史库 > 
对象大小
64K
1个对象，假如共有60个属性、成员字段，每个字段假如占8字节，1个对象就是480字节。300万个对象就是480字节*300万，约1.34G。
单条记录大小
不能超过页面大小
页面大小可配：8k /16k /32k /64k，页面越大，性能越低
数据集的大小
目前未分片存，最大为8M
改成分片存，只受磁盘大小限制。
单个资源数据大小
2G

不定长成员大小
16k
string、blob类型
filter大小
8000个字符
filter条件太多，会导致内存不够用。 | 开发必读 | 开发必读 > 
**根据所需的场景选择合适的接口函数**是使用接口函数进行开发的第一步，其步骤如下：
**确定运行环境**：首先确定需要的接口函数在前端执行还是后台执行，接口函数在前端执行时，则查询**JS函数说明**，在后台执行时，则查询**元语言函数说明**。例如：希望获取一个运行在后台的接口函数，***（tips:接口函数运行在前端页面时，表示在前端执行，运行在元语言APP时，表示在后台执行）***
**确定子系统**：需要确定使用哪个子系统的接口函数，例如：对实时、历史、计划的物、事、组织、人员对象或者记录进行增、删、查、改时，则选择**对应库的功能函数说明**；涉及用户、角色时，选择**安全子系统功能函数说明**
**确定操作的数据内容**：需要确定操作的是什么数据，例如：希望对实时业务物对象进行操作，则去**元语言函数_实时库--3函数说明--3.4数据对象**部分查找接口
**确定操作方法**：需要确定对数据进行什么操作，例如：希望对实时业务物对象进行查询操作，则去**元语言函数_实时库--3函数说明--3.4数据对象--查询**部分查找接口
**确定已知信息**：需要确认已知什么信息，根据已知信息选择合适接口，例如：已知业务物模型ID，希望对实时业务物对象进行查询操作，则选择**元语言函数_实时库--3函数说明--3.4数据对象--查询--查询指定模型的对象**接口 | JS函数_App引擎 | JS函数_App引擎 > 
**>closeLoading();**
**功能描述：**生成器中配置启用加载动画功能，由用户根据具体使用场景选择关闭加载动画的时机。
**返回值：** 无
**脚本示例:**
let isShow = true;	// 页面加载完成，关闭加载动画
if(isShow){
    closeLoading();	
} | JS函数_App引擎 > 
**> toLogin();**
**功能描述：**退出登录用户且返回到登录页面。
**返回值：** 无
**脚本示例:**
// 跳转至登录页面
toLogin();
- 组件: 
- 布局: 
- 变量: (root) | 模型库 | 模型库 > 
时序类数据模型包括单灵敏时序物、多灵敏时序物、时序事，时序类模型通常用于孪生现实生活中变化频率非常高的事物，如传感器的测量数据、要求快速响应的工厂数据等。其变化频率往往以秒、毫秒计算。
单灵敏时序物一般应用于Tag变量，只有1个变化值。多灵敏时序物一般用于结构变量，一个设备有多个采集值。 | App引擎介绍 | App引擎介绍 > 
![img](./media/元语言App对象结构.png)
**元语言App对象主要包含以下内容：**
属性

成员

功能函数，分为：
1）内置功能函数
declare：可以声明结构体，不能声明变量，本质上不算一个功能函数。
onCreate：App对象创建（启动运行）时触发执行。
onDestroy：App对象删除（停止运行）时触发执行。
onException：App对象运行异常时触发执行。
2）自定义功能函数（Function）
普通功能函数：一般自定义函数，不作为回调函数使用，被本App对象调用。
订阅回调：订阅函数的回调函数。
异步回调：异步函数的回调函数。
定时回调：定时调用函数的回调函数。 | 快速入门 | 快速入门 > 
用来描述**多个值高频存储、变化**的客观世界物体，其数据需要频繁地写库，如：**采集设备（如定时采集温度、压力、流量等多个值）**。
说明：
多灵敏时序物较单灵敏时序物相比，可在一个模型中同时设置多个灵敏值成员，灵敏值之外的其他属性也可使用非灵敏成员表示。
多灵敏时序物可表示SCADA里的结构变量，一个设备有多个采集值，一个典型应用场景：智能电表有2个标签属性：位置和分组，还有3个采集变量：电流、电压、相位。在此场景中，智能电表即为一个多灵敏时序物模型，位置与分组可设置为非灵敏成员，电流、电压、相位则可设置为灵敏成员。
其孪生的多灵敏时序物对象按照时态分为：实时多灵敏时序物、历史多灵敏时序物，描述现在和过去的状态，无计划时态对象。
实时多灵敏时序物的对象与记录存在于服务器内存中，历史多灵敏时序物的对象与记录存在于服务器硬盘中。 | 历史库 | 历史库 > 
存储死区，是历史单灵敏时序物对象特有的属性，是历史单灵敏时序物记录在进行死区压缩和旋转门压缩时用到的参数。
工业生产中，某些变量值波动频繁，而小范围的波动对系统正常运行没有影响，用户既不关注波动的具体数值，也不需要做进一步的操作处理，针对这种情况，可以配置存储死区，不存储这些小范围变动的数据，减少无用数据占用系统资源。
1、当storageAndCompression.compressionMode=死区压缩时
添加历史单灵敏度时序物记录时，存储死区和有效期共同起作用。时序物的值变化程度若未超出存储死区并且在有效期内，该值会被压缩掉，不进行存储。例如，对象设置存储死区为0.5，则单灵敏值变化范围在-0.5~0.5范围内的记录会被压缩掉。
bool类型的值存储死区默认为0，即存储死区属性值对于bool类型的成员不起作用。
2、当storageAndCompression.compressionMode=旋转门压缩时
存储死区是进行旋转门压缩时的压缩偏差，表示当前样本与当前线性趋势之间的最大差值。 | JS函数_模型库 | JS函数_模型库 > 
const filter;  // 过滤条件表达式
// bool类型
filter = "bool成员 == true";                                                           // 值为true
filter = "bool成员 != 0";                                                              // 值为true

// 整型数值类型，以int32为例
filter = "int32成员 == 0";                                                             // 值为0
filter = "int32成员 > 0";                                                              // 值大于0
filter = "int32成员 <= 0";                                                             // 值小于等于0
filter = "int32成员 in (100,200,300)";                                                 // 值等于100或200或300

// 浮点型数值类型，以float为例
filter = "float成员 == 1.1";                                                           // 值为1.1
filter = "float成员 > 10.11";                                                          // 值大于10.11
filter = "float成员 in (10.01, 20.02, 30.03)";                                         // 值等于10.01或20.02或30.03

// datetime类型成员，可视为uint64类型
const date    = new Date();
const UTCTime = dateToUTCTime(date);
filter        = "datetime成员 >= " + UTCTime;                                           // 时间大于now

// 字符串类型
filter = "$name == \"对象\"";                                                           // 名称为对象
filter = "$name != \"对象\"";                                                           // 名称不为对象
filter = "$name include \"模型1\"";                                                     // 名称包含模型
filter = "$name in (\"对象1\",\"对象2\",\"对象3\")";                                     // 名称为对象1或对象2或对象3
filter = "$name ==~ \"/物料.*/\"";                                                      // 正则表达式，名称以物料开头

// 多条件过滤
filter = "$name == \"对象\" && int32成员 >= 100 || float成员 <= 1.1"; 
filter = "$name == \"对象\" && (int32成员 >= 100 || float成员 <= 1.1)";                  // 优先执行()

// 过滤条件拼接变量
int32 num = 100;
filter = "int32成员 == " + num;                                                         // 值等于变量

string name = "模型";
filter = "$name == " + "\""+ name + "\"";                                               // 值等于变量 | 元语言函数_基础语法
- 按钮: (root) | 应用图标管理 | 应用图标管理 > 
①显示位置：系统应用显示在第一行，业务应用从第二行开始展示，如图：
![image-20240830140138236](media/显示位置.png)
②显示图标：应用图标默认为<img src="media/元语言功能单元图标.png" alt="image-20240905101315776" style="zoom: 50%;" />、<img src="media/webJS功能单元图标.png" alt="image-20240905101315776" style="zoom: 50%;" />、<img src="media/nodeJS功能单元图标.png" alt="image-20240905101315776" style="zoom: 53%;" />，如果用户在FU模型/拷贝中配置了图标，则显示用户的图标；
③应用分组：选中图标，靠近另一个图标，自动合并为一组，合并为组后自动排列在最左侧，可单机组名进行编辑；点击组图标后，会放大显示出组内详细应用列表，显示位置靠近组图标范围，当失焦后，自动关闭；组内以3列图标进行显示，超出区域后显示滚动条，可以点击结组按钮完成解组操作，如下图：
![image-20240905101315776](media/应用分组.png)
④图标大小：桌面上的应用图标，默认以中等图标展示；其他展示模式包括大(96)、中(48)、小图标(32)切换；切换入口在桌面的系统设置，如图：
![image-20240905101315776](media/展示模式切换.png)
⑤图标状态：除了内置的FU应用，新增的FU应用均有运行和未运行的标识，通过图标灰度，表征其运行状态；
![image-20240905101315776](media/运行状态.png)
图标状态说明：
第一，元语言FU图标状态有三个，高亮表示正常运行、灰色表示未运行或者运行失败、高亮左上角有感叹号表示运行正常但是出现了异常；
第二，webJSFU图标状态有两个，高亮表示正常运行，灰色表示为运行或者运行失败；
第三，对于webJS类型的FU对象，有窗口进行展示，且运行成功后在任务栏会有该FU的图标，应用窗口的关闭和打开不会影响FU运行状态；
第四，CS模式下运行的客户端类型元语言FU/nodeJSFU，退出桌面，即停止运行；BS模式下运行的后台类型元语言FU/nodeJSFU，退出桌面，不停止运行；
第五，不论CS模式还是BS模式，退出桌面，webJSFU都不停止运行；
第六、有界面的元语言FU，会单独启动一个窗口，如图：
![image-20240830142132740](media/元语言界面.png) | 应用图标管理 > 
点击编辑按钮，可以编辑名称、对象ID、默认账号、应用分组和语言配置属性。
运行中的FU应用可以编辑名称、默认账号和应用分组；停止运行的FU应用可以编辑所有属性。
编辑FU应用有两种方式，编辑弹窗如下图：
第一，图标上，右键，出现菜单；
第二，时空对象管理-我创建的，选中图标点击进行编辑；
![](media/编辑.png) | 应用图标管理 > 
分配角色主要应用是，最终运行的时候，可以看到该FU的用户。
只针对BS模式下、webFU、公共应用有该功能。
公共应用分配角色有两种方式，
第一，在时空对象管理工具新建FU对象时，应用类型选择公共应用，点击配置按钮配置角色管理，如下图：
![image-20250108145846168](media/新建公共应用.png)
第二，在桌面右键点击图标后，选择分配角色，可以对应用添加或移除角色，如下图：
![image-20250108145846168](media/分配角色.png)
默认展示已添加角色列表，可以选中角色，点击“移除”按钮，移除角色；
点击“登录运维添加角色”，打开登录弹窗，登录运维后会获取到全部的角色信息，选中角色后，点击“确认添加”，完成角色分配。
![image-20250108145953622](media/分配角色弹窗.png) | wos安装卸载流程 | wos安装卸载流程 > 
云环境安装后7天免费试用期，若继续使用需要及时申请授权文件并导入授权。
在浏览器（推荐使用较新版本的谷歌浏览器）中输入登录地址：http://IP:8687/maintance（IP：单节点为服务器IP，多节点为安装时配置的WellinOS管理服务的虚拟IP），打开WellinOS系统管理中心（也称运维管理中心）。
默认系统管理员用户为：**systemAdmin**，密码为：**<密码已脱敏>**。点击登录进入系统管理中心。
点击**授权安装管理**，点击**导出机器码**，勾选所有节点，点击**导出**按钮，即可在浏览器自动下载机器码。
将导出的机器码发送亚控技术支持人员，由其进行内部流程审批，获取授权文件。授权信息包含如下内容：
**授权到期时间**：根据商务信息确定授权到期日期，在后续授权即将到期时，可根据商务情况进行授权延长
**最大在线用户数**：根据项目用户规模确定最大在线业务用户数
**授权对象数**：业务数据规模限制，即模型、模型拷贝、每种对象的最大数量。不填默认0，表示不做限制。依据商务情况确定。
获取授权文件后，在**授权安装管理**中点击**安装授权**，选择云区域ID（默认为1），选择**授权文件**，点击**确定**按钮即可。 | wos安装卸载流程 > 
右键以管理员身份运行安装包，自定义修改安装路径：
点击**开始安装**按钮，等待安装完成即可。
安装完成后，即可在桌面双击WellinOS图标打开使用。 | wos安装卸载流程 > 
在WellinOS安装路径下找到**terminalUnInstallToolGui.exe**，即为WellinOS客户端卸载程序
右键**以管理员身份运行**，即可进入客户端端卸载界面。
可勾选是否保留历史数据，若选择保留历史数据，卸载完成后会在安装路径下保存一个名称为**terminalDB**的文件夹，此为WellinOS客户端数据，包含时空库模型、对象、脚本等业务数据，在下次安装时可选择直接加载该数据继续使用。
点击**开始卸载**按钮
待进度条达到100%时，显示卸载完成即可 | 任务栏应用管理 | 任务栏应用管理 > 
WellinOS4.5桌面提供帮助手册快速查看入口，如图：
![](media/帮助手册.png)
CS模式，点击帮助手册按钮会通过默认浏览器打开在线帮助手册地址；
BS模式，点击帮助手册按钮会打开新的Tab页，打开在线帮助手册；
手册地址：http://221.239.19.118:14444 | 统一登录
- 表格: (root) | 快速入门 | 快速入门 > 
基于数据模型产生的数字孪生术语包含：**数据模型、模型拷贝、对象、记录**，以下是术语概念及关系介绍
**数据模型**：定义数据**结构**，整个数字孪生的根本
**模型拷贝**：是模型的**拷贝生成物**，创建对象的**必要前提**
**对象**：可表示世间万事万物；作为记录的承载体
**记录**：可记录世间万事万物的信息
**模型、拷贝、对象、记录之间的关系**
flowchart
A(模型)
B(模型拷贝)
E(n个模型拷贝)
C(对象)
G(n个对象)
D(n条记录)
A-->|生成|B-->|创建|C-->|包含|D
A-->|生成|E
B-->|创建|G
**例1：**以水杯为例，解释模型、拷贝、对象、记录关系
目前有一批水杯，水杯有不同的容量、不同的产地、不同的型号、不同的生产厂商，在Excel表格中以下表展示
水杯1
北京
保温杯
500
富光
水杯2
天津
保温杯
1000
乐扣
水杯3
上海
普通杯
2000
特百惠
这一批水杯在WellinOS中是如何表示呢？
首先建**一个业务物模型**，容量、产地、型号、生产厂商这些字段在模型中定义

根据模型生成**一个拷贝**

根据拷贝创建**三个实时物对象**，每个对象的容量、产地、型号、生产厂商赋予不同的值
flowchart
A(水杯模型)
B(水杯模型拷贝)
C(水杯对象)
A-->|生成|B-->|创建|C
**例2：**以多个订单为例，解释模型、拷贝、对象、记录
目前有一批订单，订单有不同的客户、不同的交付时间、生产不同的产品型号、不同的生产数量，在Excel表格中以下表展示
客户1
2024/08/19
XH01
500
客户2
2024/08/19
XH01
1000
客户3
2024/08/22
XH02
2000
这一批订单在WellinOS中是如何表示呢？
首先建**一个业务事模型**，客户名称、交付时间、产品型号、生产数量这些字段在模型中定义

根据模型生成**一个拷贝**

根据拷贝创建**一个实时事对象**

添加**三条记录**表示三个订单信息
flowchart
A(订单模型)
B(订单模型拷贝)
C(订单对象)
D(三条订单记录)
A-->|生成|B-->|创建|C-->|包含|D | 业务审计 | 业务审计 > 
点击【新建】按钮，输入仓库名称、描述，即可完成一个仓库的创建。
![](media/BArecord_8.png)
所建仓库为平级关系，点击仓库列表某名称后，后侧数据表格进行切换展示；
![](media/BArecord_9.png) | 元语言函数_模型库 | 元语言函数_模型库 > 
**Result Update(stringMap\<var> param, stringMap\<var> input, stringMap\<var> &output)**
**功能描述：**
修改资源对象的资源数据。
支持按ID、名称、GUID选择要修改的目标对象。
**param有效参数：**
int32
cloudID
区域ID
否
0
int32
areaID
数据区ID
否
0
int32
type
类型，资源1058
是

int32
timeout
超时时间
否
10000
uint64
transactionID
事务ID
否
0
**input有效参数：**
stringMap<var>[]
conditions
批量操作条件[]
是
默认值
**condition有效参数**
int32
mode
=93
是

int32
updateMode
修改模式：<br/>=1：追加；<br/>=2：移除；<br/>=3：更新；<br />=4：整体修改Replace；
是

int32
identifierType
目标数据标识方法：<br/>=1：使用ID标识；<br/>=2：使用名称标识；<br/>=5：使用GUID标识；
否
5
uint64
id
资源id
三选一必填

string
name
资源名称
三选一必填

string
guid
资源GUID
三选一必填

string[]
strIndexs
各维度的下标，{"$[3]","$\[2][2]","$[5]"}，updateMode=2、3、4模式，参数有效。
是

var\[]
values
updateMode=移除模式,参数无效
是

**identifierType=2时有效参数**




int32
repoIdentifierType
仓库范围数据标识方法：<br/>=1：使用ID标识；<br/>=4：使用别名标识；<br/>=5：使用GUID标识；
否
5
uint64
repoId
仓库id
三选一必填

string
repoAlias
仓库别名
三选一必填

string
repoGuid
仓库GUID
三选一必填

**output有效参数：**
int32[]
errorCodes
错误码数组
**脚本示例1：**通过ID、GUID选择要修改的资源对象
stringMap<var> param, input, output;
result functionRet;
param.type               = 1058;              // 资源对象，对象类型（必填）
param.cloudID            = getLocalCloudID(); // 云ID（选填） 
param.areaID             = 0;                 // 数据区ID（选填） 
param.timeout            = 5000;              // 事务超时时间（选填）
param.transactionID      = (uint64)0;         // 事务ID（选填）
stringMap<var>[] conditions;
stringMap<var> condition;
ondition.mode            = (int32)Enum_MODE_UPDATE_RES::DATA_ARRAY;          // 操作模式  
condition.updateMode     = (int32)Enum_UPDATEMODE_ARRAY::APPEND;             // 修改模式
condition.identifierType = (int32)Enum_IDENTIFIERTYPE::GUID;                 // 数据标识方法（选填）
condition.guid           = "398be061-6cc3-4da7-b015-14dbe856f8c9";           // 资源对象GUID（使用GUID标识时必填）
// condition.identifierType = (int32)Enum_IDENTIFIERTYPE::ID;                // 数据标识方法（选填）
// condition.id             = 1441151880758558721;                           // 资源对象ID（使用ID标识时必填）
condition.values         = {"aa", "bb", "cc"};                               // 表格一行值
input.conditions         = conditions;
functionRet              = Update(param, input, output);
int32[] errorCodes       = output.errorCodes;                                // 返回错误码 | 元语言函数_模型库 > 
**Result Update(stringMap\<var> param, stringMap\<var> input, stringMap\<var> &output)**
**功能描述：**
支持按ID、名称、GUID选择要修改的目标对象。
**param有效参数：**
int32
cloudID
区域ID
否
0
int32
areaID
数据区ID
否
0
int32
type
类型，资源1058
是

int32
timeout
超时时间
否
10000
uint64
transactionID
事务ID
否
0
**input有效参数：**
stringMap<var>[]
conditions
批量操作条件[]
是
默认值
**condition有效参数**
int32
mode
=95，设置表结构
是

int32
updateMode
修改模式：<br/>=1：添加列；<br/>=2：修改列；<br/>=3：删除列；
是

int32
identifierType
目标数据标识方法：<br/>=1：使用ID标识；<br/>=2：使用名称标识；<br/>=5：使用GUID标识；
否
5
uint64
id
资源id
三选一必填

string
name
资源名称
三选一必填

string
guid
资源GUID
三选一必填

string[]
selectColNames
选中列，修改、删除选中列，选中列后追加列
否
为空，省略=最后列添加列
stringMap<var>[]
columns
表格纵列<br />updateMode=添加列,在selectColNames[1]后添加,默认取下标1<br />updatemode=修改列时，长度和selectColNames一致<br />updatemode=删除列时，cplumns无效
是

**identifierType=2时有效参数**




int32
repoIdentifierType
仓库范围数据标识方法：<br/>=1：使用ID标识；<br/>=4：使用别名标识；<br/>=5：使用GUID标识；
否
5
uint64
repoId
仓库id
三选一必填

string
repoAlias
仓库别名
三选一必填

string
repoGuid
仓库GUID
三选一必填

**column有效参数**
string
name
列名
是

int32
valueType
列值类型,修改列时不支持修改类型，参数无效
是

bool
unique
值是否唯一，为true时值不允许重复
否
false
**output有效参数：**
int32[]
errorCodes
错误码数组
**脚本示例1：**通过ID、GUID选择要修改的资源对象
stringMap<var> param, input, output;
result functionRet;
stringMap<var>[] conditions;
stringMap<var> condition;
stringMap<var>[] columns;
stringMap<var> column;
string[] colNames;
param.type                = (int32)Enum_MdbType::RESOURCE;                                         // 资源对象，对象类型（必填）
param.cloudID             = getLocalCloudID();                                                     // 云ID（选填） 
param.areaID              = 0;                                                                     // 数据区ID（选填） 
param.timeout             = 5000;                                                                  // 事务超时时间（选填）
param.transactionID       = (uint64)0;                                                             // 事务ID（选填）
condition.mode            = (int32)Enum_MODE_UPDATE_RES::TABLESTRUCT;                              // 操作模式（必填）
condition.updateMode      = (int32)Enum_UPDATEMODE_TABLE::APPEND;                                  // 修改模式（必填）
condition.identifierType  = (int32)Enum_IDENTIFIERTYPE::GUID;                                      // 数据标识方法（选填）
condition.guid            = "86e6a427-eb4d-4cd8-bac1-194a875a0186";                                // 资源对象GUID（使用GUID标识时必填）
// condition.identifierType  = (int32)Enum_IDENTIFIERTYPE::ID;                                     // 数据标识方法（选填）
// condition.id              = "1441151880758558721";                                              // 资源对象ID（使用ID标识时必填）
condition.selectColNames  = colNames;                                                              // 为空代表从末尾追加
column.name               = "name";
column.valueType          = 13;
column.unique             = true;
columns.push(column);
column.name               = "age";
column.valueType          = 4;
column.unique             = true;
columns.push(new column);
condition.columns         = columns;
conditions.push(condition);
input.conditions          = conditions; 
functionRet               = Update(param, input, output);
int32[] errorCodes        = output.errorCodes;                                                      // 返回错误码
**脚本示例2：**通过name选择要修改的资源对象
stringMap<var> param, input, output;
result functionRet;
stringMap<var>[] conditions;
stringMap<var> condition;
string[] colNames;
param.type                     = (int32)Enum_MdbType::RESOURCE;                         // 资源对象，对象类型（必填）
param.cloudID                  = getLocalCloudID();                                     // 云ID（选填） 
param.areaID                   = 0;                                                     // 数据区ID（选填） 
param.timeout                  = 5000;                                                  // 事务超时时间（选填）
param.transactionID            = (uint64)0;                                             // 事务ID（选填）
condition.mode                 = (int32)Enum_MODE_QUERY_RES::TABLESTRUCT;               // 操作模式（必填）        
condition.updateMode           = (int32)Enum_UPDATEMODE_TABLE::APPEND;                  // 追加Append（必填）
// condition.repoIdentifierType   = (int32)Enum_IDENTIFIERTYPE::ID;                     // 仓库范围数据标识方法（选填）
// condition.repoId               = 1441151880758558721;                                // 仓库id（使用ID标识时必填）
// condition.repoIdentifierType   = (int32)Enum_IDENTIFIERTYPE::ALIAS;                  // 仓库范围数据标识方法（选填）
// condition.repoAlias            = "别名1";                                            // 仓库别名（使用别名标识时必填）
condition.repoIdentifierType   = (int32)Enum_IDENTIFIERTYPE::GUID;                      // 仓库范围数据标识方法（选填）
condition.repoGuid             = "d0ee9afa-4716-4868-aad3-7cc81aa926e5";                // 仓库GUID（使用GUID标识时必填）
condition.identifierType       = (int32)Enum_IDENTIFIERTYPE::NAME;
condition.name                 = "资源";
condition.selectColNames       = colNames;
column.name                    = "name";
column.valueType               = 13;
column.unique                  = true;
columns.push(column);
column.name                    = "age";
column.valueType               = 4;
column.unique                  = true;
columns.push(new column);
condition.columns              = columns;
conditions.push(condition);
input.conditions              = conditions;             
functionRet                   = Update(param, input, output);
int32[] errorCodes            = output.errorCodes;        | 元语言函数_模型库 > 
**Result Query(stringMap\<var> param, stringMap\<var> input, stringMap\<var> &output)**
**功能描述：**
查询指定资源对象的资源表格。
支持按ID、名称、GUID选择要查询的目标对象。
**param有效参数：**
int32
cloudID
区域ID
否
0
int32
areaID
数据区ID
否
0
int32
type
类型，资源1058
是

int32
timeout
超时时间
否
10000
uint64
transactionID
事务ID
否
0
**input有效参数：**
stringMap<var>[]
conditions
批量操作条件[]
是
默认值
**condition有效参数**
int32
mode
=94
是

int32
identifierType
目标数据标识方法：<br/>=1：使用ID标识；<br/>=2：使用名称标识；<br/>=5：使用GUID标识；
否
5
uint64
id
资源id
三选一必填

string
name
资源名称
三选一必填

string
guid
资源GUID
三选一必填

string[]
colNames
返回列名
是

string
filter
过滤条件
否

int32
duplicationDealMode
是否允许返回多个重名结果<br/>=1：全部返回；<br/>=2：报错
否
1
**identifierType=2时有效参数**




int32
repoIdentifierType
仓库范围数据标识方法：<br/>=1：使用ID标识；<br/>=4：使用别名标识；<br/>=5：使用GUID标识；
否
5
uint64
repoId
仓库id
三选一必填

string
repoAlias
仓库别名
三选一必填

string
repoGuid
仓库GUID
三选一必填

**output有效参数：**
int32[]
errorCodes
错误码信息
dataSet[]
returnDatas
查询返回数据
**脚本示例1：**最简
stringMap<var> param, input, output;
result functionRet;
stringMap<var> condition;
stringMap<var>[] conditions;
param.type            = (int32)Enum_MdbType::RESOURCE;                      // 资源对象，对象类型（必填）
condition.mode        = (int32)Enum_MODE_QUERY_RES::DATA_TABLE;             // 资源数据查询，查询模式（必填）
condition.guid        = "86e6a427-eb4d-4cd8-bac1-194a875a0186";             // 资源对象GUID（使用GUID标识时必填）
condition.colNames    = {"$name"};                                          // 查询列名（必填）
conditions.push(condition);
input.conditions      = conditions;
functionRet           = Query(param, input, output);
int32[] errorCodes    = output.errorCodes;                                  // 返回错误码
dataSet[] returnDatas = output.returnDatas;                                 // 返回数据集
**脚本示例2：**通过ID、GUID选择要查询的资源对象
stringMap<var> param, input, output;
result functionRet;
stringMap<var> condition;
stringMap<var>[] conditions;
param.type               = (int32)Enum_MdbType::RESOURCE;                             // 资源对象，对象类型（必填）
param.cloudID            = getLocalCloudID();                                         // 云ID（选填） 
param.areaID             = 0;                                                         // 数据区ID（选填） 
param.timeout            = 5000;                                                      // 事务超时时间（选填）
param.transactionID      = (uint64)0;                                                 // 事务ID（选填）
condition.mode           = (int32)Enum_MODE_QUERY_RES::DATA_TABLE;                    // 资源数据查询，查询模式（必填）
// condition.identifierType = (int32)Enum_IDENTIFIERTYPE::ID;                         // 目标数据标识方法（选填）
// condition.id             = 1441151880758558722;                                    // 资源对象id（使用ID标识时必填）
condition.identifierType = (int32)Enum_IDENTIFIERTYPE::GUID;                          // 目标数据标识方法（选填）
condition.guid           = "86e6a427-eb4d-4cd8-bac1-194a875a0186";                    // 资源对象GUID（使用GUID标识时必填）
condition.colNames       = {"$name"};                                                 // 查询列名（必填）
conditions.push(condition);
input.conditions         = conditions;
functionRet              = Query(param, input, output);
int32[] errorCodes       = output.errorCodes;                                         // 返回错误码
dataSet[] returnDatas    = output.returnDatas;                                        // 返回数据集
**脚本示例3：**通过name选择要查询的资源对象
stringMap<var> param, input, output;
result functionRet;
stringMap<var> condition;
stringMap<var>[] conditions;
param.type                   = (int32)Enum_MdbType::RESOURCE;                           // 资源对象，对象类型（必填）
param.cloudID                = getLocalCloudID();                                       // 云ID（选填） 
param.areaID                 = 0;                                                       // 数据区ID（选填） 
param.timeout                = 5000;                                                    // 事务超时时间（选填）
param.transactionID          = (uint64)0;                                               // 事务ID（选填）
condition.mode               = (int32)Enum_MODE_QUERY_RES::TABLE;                       // 资源数据查询，查询模式（必填）
// condition.repoIdentifierType = (int32)Enum_IDENTIFIERTYPE::ID;                       // 仓库数据标识方法（选填）
// condition.repoId             = 1441151880758558721;                                  // 仓库id（使用ID标识时必填）
// condition.repoIdentifierType = (int32)Enum_IDENTIFIERTYPE::ALIAS;                    // 仓库数据标识方法（选填）
// condition.repoAlias          = "别名1";                                               // 仓库别名（使用别名标识时必填）
condition.repoIdentifierType = (int32)Enum_IDENTIFIERTYPE::GUID;                        // 仓库数据标识方法（选填）
condition.repoGuid           = "dc1ef33c-7de4-48f5-bc02-1e4e31d644da";                  // 仓库GUID（使用GUID标识时必填）
condition.identifierType     = (int32)Enum_IDENTIFIERTYPE::NAME;                        // 目标数据标识方法（选填）
condition.name               = "资源";                                                  // 资源对象name（使用GUID标识时必填）
condition.colNames           = {"$name"};                                               // 查询列名（必填）
conditions.push(new condition);
input.conditions             = conditions;
functionRet                  = Query(param, input, output);
int32[] errorCodes           = output.errorCodes;                                       // 返回错误码
dataSet[] returnDatas        = output.returnDatas;                                      // 返回数据集 | 错误码_历史计划库 | 错误码_历史计划库 > 
-30001
cloudID超出允许范围


-30002
cloudID不存在


-30003
areaID超出允许范围


-30004
areaID不存在


-30006
mode不支持


-30007
mode不存在


-30008
输入模式非法
Query()
param.type的类型不支持condition里的mode。1、把对象和记录的type/mode弄混了。2、conditions使用前没有清空，带上了之前的conditon。
-30009
mode与type不匹配
Query()
param.type的类型不支持condition里的mode。1、把对象和记录的type/mode弄混了。2、conditions使用前没有清空，带上了之前的conditon。
-30010
参数非法
Query()
postFilter要和aggregates配合使用
-30012
表达式中的字段不在索引字段集合中
Query(趋势查询)
入参condition里的字段名称有拼写错误。
-30013
获取服务失败


-30014
对象类型错误


-30015
类型不匹配


-30016
数量不匹配


-30017
数组为空
Query()
conditions[]为空数组
-30018
必填参数缺失
Create() Query()
1、app引擎未传入appSpacetimeGUID参数，bug。 2、spaceTimeMode=2，但是没有传spaceTimeID等参数。 3、单个参数和数组参数弄错，例如：spaceTimeID和spaceTimeIDs[]参数弄混，id/name/alias/guid和ids[]/names[]/aliases[]/guids[]参数弄混。 4、参数前缀弄错，identifierType、objectIdentifierType参数弄混、id和objectID弄混...。 5、mode和筛选参数不匹配，数组和非数组参数弄混，例如，单拷贝copyID/copyGUID和多拷贝copyIDs/copyGUIDs，单对象objectName和多对象objectNames，单时刻time和多时刻times...。 6、标识类型identifierType和指定的标识id/name/guid不匹配。 7、参数拼写错误，例如：guids写成了guidis，mulFieldValue写成了newMulFieldValue。 8、QueryJoin()，input的condition缺少returnFields参数
-30020
域/字段个数错误
Create(record)
单灵敏时序物记录的VTQ不能修改，创建记录时，必须指定VTQ这3个字段，且只能传VTQ这3个字段。
-30021
域/字段ID错误
Create(record)
缺少必填参数dataValues
-30022
域/字段记录错误


-30023
域/字段值类型不匹配
Create(obj)
1、数组参数维数错误，例如，dataFields应该是1维数组，但是传入的是2维数组。
-30024
域/字段不匹配


-30025
域/字段类型错误
Query()
returnfields里有不存在的属性、成员名。


Query(record)
趋势查询的趋势字段只支持数值类型，不支持bool、string等非数值类型的$value、灵敏成员。



时序查询模式不支持分组聚合功能，不支持groupFields、aggregates、postFilter、distinct等参数。
-30026
域/字段不存在
Query(运行模型、拷贝)
returnfields里有成员名，运行模型、拷贝查询不支持返回成员，只支持返回属性，例如：$memberList、$sensitiveMemberList。


Query(对象)
returnfields里有不存在的属性、成员名。


Query(record)
returnfields里有不存在的属性、成员名。单灵敏、多灵敏时序物记录不支持返回非灵敏成员。
-30027
域/字段为空


-30028
域/字段重复


-30029
域/字段固化（不可修改）


-30030
时间戳错误


-30031
时间范围错误
Query(record)
开始时间不能比结束时间大
-30032
时间位置顺序错误


-30034
请求中type参数非法


-30035
模型不存在


-30036
无有效的模型数据


-30037
模型拷贝不存在
Create(obj)
WOS:没有部署指定的拷贝。KH：没有加载内置系统拷贝，因为历史库公共配置文件WellinOSCommonAssembly.yaml的InnerBuildFlag开关没有打开，需要设置=1，历史库数据区配置文件WellinOSDataAreaConfig.yaml里缺少配置项：DeployKind=2（非部署模式）。
-30038
对象不存在
Query()
检查指定的type、对象参数是否正确
-30039
对象已经存在


-30040
对象重复


-30041
数据不存在


-30042
无有效的数据


-30043
数据量过多


-30044
数据倒序


-30045
数据类型错误


-30046
数据无效
Query(业务事记录)
查询子记录，mode=101，mainMode=53，returnfields只支持返回属性，不支持返回成员。mainMode=54，returnfields支持返回属性、成员。
-30047
数据版本不存在


-30048
数据版本无效


-30049
过滤条件格式错误


-30050
过滤字符串过长


-30051
名称无效
Create(obj)
名称存在不支持的字符
-30052
无效的时间间隔


-30053
无效的数量


-30054
无效的排序模式（不支持的排序模式）


-30055
不支持的过滤字段（域）
Query(时序事记录)
filter里的字段大小写适配bug
-30056
不支持的过滤字段（域）数据类型


-30057
栅格数量无效


-30058
栅格数量导致时间间隔小于1ms


-30059
内部生成的handle重复导致数据未被插入成功


-30060
数据不完整


-30061
导入的单个包不完整


-30062
对应的偏移不对


-30063
源对象id在导出的数据块中不存在


-30064
源对象与目标对象结构不一致


-30065
记录的filed的数量对不上解析缓存块


-30066
解析缓存块filed的出现了异常


-30067
内存记录校验位错误


-30068
统计模式无效


-30069
统计间隔无效


-30070
缓冲区过小


-30071
字段值错误
Query(记录)
查询记录的returnfields里不支持返回对象的名称、描述等属性。
-30072
未执行


-30073
未检查


-30074
数据集ID不存在
Query(数据集)
指定名称数据集不存在
-30075
无效的赋值规则


-30076
无效的数据集操作命令码
Query(时刻)
mode值非法
-30077
无效的返回模式


-30078
获取灵敏成员失败


-30079
记录中找不到指定jion中的条件


-30080
join的 condition是错误的


-30081
join的条件在dataSet中没有找到


-30082
不支持的join的type


-30083
模型拷贝成员检查错误


-30084
数组数量无效
Create(record)
1个请求里的多个对象的记录总共不能超过2万条。
-30085
模型拷贝无效


-30086
copySource非法


-30087
成员检查错误
Create(obj)
模型版本的成员结构，和库里已生成的对象成员结构不同


Upgrade(obj)
升级对象，成员类型不能变，不能减少，只能增加


Query()
多灵敏时序物记录趋势查询，灵敏成员列表里不存在指定的趋势字段
-30088
请求不支持事务


-30089
数字类型互转失败


-30090
权限校验失败


-30091
内存过滤器初始化失败


-30092
内存过滤器存在相同的索引成员


-30093
升级表的信息异常


-30094
无效的引用对象结构返回模式


-30095
更新数据为空


-30096
不在指定的时空集合中
Query(记录)
指定对象不在指定时空里
-30097
时空权限不足


-30098
对象权限不足


-30099
数据区权限不足


-30100
数据区不存在
Query()
库崩了
-30101
表格不存在


-30102
表格列不存在


-30103
opendb失败


-30104
数据区不可用


-30105
部署数据区下不能进行非部署操作


-30110
param类型无效

param.type值不对
-30111
变量类型错误
Create(obj)
1、数组参数维数错误。例如，dataFields、fieldValues应该是1维数组，但是传入的dataFields、fieldValues不是数组，dataValues应该是2维数组，但是传入的dataValues是1维数组。 2、参数类型错误，例如，uint64写成了int64。


Query()
1、自定义函数返回变量要进行强转才能得到正确的类型，例如：condition.guids={(string)fun1("obj1")};



2、传入的ids类型要是uint64[]类型，元语言脚本示例：condition1.ids = {(uint64)288230376154671847};js脚本示例：let ids = ["1152921504606852742"];
-30112
时间范围版本不存在


-30113
时间范围版本无效


-30114
记录版本无效


-30115
condition个数非法


-30116
时空对象不存在
Create(obj)
App时空对象没有部署，或者没有启动


Query()
spaceTimeMode=1，App时空对象没有部署，或者没有启动
-30117
最大时空不大于等于当前时空


-30118
pb Variant转base Variant失败


-30119
base Variant转pb Variant失败


-30120
拷贝下存在对象，无法删除


-30121
拷贝下存在事记录，无法删除


-30122
某版本模型下除了待删除拷贝还存在其他拷贝，不允许删除此模型


-30123
某版本模型下存在子派生模型


-30124
添加数据模型时modelBlock为空


-30125
删除的时空下有子时空


-30126
删除的时空下有对象
Delete(时空)

-30127
记录版本不存在


-30128
添加模型时，枚举成员关联的枚举模型不存在


-30129
记录版本已发布,不可修改


-30130
创建中dataFields重复


-30131
创建中dataFields非法


-30132
join的过滤条件异常


-30133
join后的返回字段值在子查询中不存在


-30134
统计计算查询returnFields检查出错
Query(obj)
mode=11时，returnFields不支持返回$memberlist
-30135
union 查询returnFields检查出错


-30136
union 查询数据类型间不能转换


-30137
unionMode 检查失败


-30138
guid重复


-30139
时空对象形成环路


-30140
过滤条件是错误的


-30141
统计参数中的offset值不对


-30142
属性和成员字段中包含该过滤字段


-30143
不支持此identifierType类型
Create()
copyIdentifierType参数值不在1、5范围内。


Query()
identifierType值不在支持的范围内。
-30144
表中数据需要升级






-30501
AddKVData失败


-30502
BatchAddKVData失败
Create()
大批量创建对象、记录，分配内存失败，查看配置文件里的kvMemStoreEngine的MemoryTotalLimitMB配置项是否太小。
-30503
BatchAddKVDataEx失败


-30504
UpdateKVData失败


-30505
批量更新kv数据失败


-30506
批量更新kv子数据失败


-30507
删除kv数据失败


-30508
批量删除kv数据失败


-30509
批量删除kv子数据失败


-30510
范围删除kv数据失败


-30511
获取kv数据失败


-30512
批量获取kv数据失败
Query()
申请内存失败
-30513
范围获取kv数据失败


-30514
范围获取kv子数据失败


-30515
查询kv数据失败


-30516
推送kv数据失败
Query()
returnMode=2，返回数据集模式，返回数据转blob存到数据集里，blob超过了8M的上限
-30517
批量推送kv数据失败


-30518
批量推送kv子数据失败


-30519
删除kv数据不存在


-30520
批量删除kv数据不存在


-30521
批量删除kv子数据不存在


-30522
批量添加时序对象失败


-30523
批量添加时序子对象失败


-30524
批量删除时序对象失败


-30525
批量删除时序子对象失败


-30526
添加单灵敏时序对象记录失败
Create()
同一时刻的记录超过了8个版本
-30527
添加多灵敏时序对象记录失败


-30528
删除单灵敏时序对象记录失败


-30529
删除多灵敏时序对象记录失败


-30530
查询单灵敏时序对象记录失败


-30531
查询多灵敏时序对象记录失败
Query(趋势查询)
mode=185，按模型的趋势查询，1个模型，有的对象有灵敏成员，有的没有灵敏成员，查询失败
-30532
创建DB备份失败


-30533
查询DB备份失败


-30534
删除DB备份失败


-30535
查询DB备份信息失败


-30536
查询DB备份信息列表失败


-30537
校验DB备份失败


-30538
停止增量wal备份失败


-30539
修复DB失败


-30540
从备份目录还原DB失败


-30541
获取修复DB状态失败


-30542
获取修复进程失败


-30543
开始事务失败


-30544
准备事务失败


-30545
提交事务失败


-30546
回归事务失败


-30547
获取事务上下文失败


-30548
开始本地事务失败


-30549
提交本地事务失败


-30550
回滚本地事务


-30551
获取时序对象信息失败


-30552
批量获取时序对象信息失败


-30553
mmdb赋值kv数据失败


-30554
mmdb批量赋值kv数据失败


-30555
mmdb批量赋值kv数据-多表 失败


-30556
mmdb获取并锁定kv失败


-30557
mmdb批量获取并锁定kv失败


-30558
DeleteTable失败


-30559
GetTable失败


-30560
AddBlobObject失败


-30600
添加别名失败


-30601
删除别名失败


-30602
修改别名失败


-30603
查询别名失败


-30701
过滤条件中存在不可以过滤的字段


-30702
过滤条件不合法

框架过滤模块解析filter参数里带有非法字符，例如：换行符\n
-30703
过滤条件中类型不匹配


-30704
转换decimal类型出现异常


-30705
过滤模块中出现了空指针


-30706
过滤出现了异常错误


-30707
正则表达式错误


-30708
不支持的逻辑符号


-30709
不支持的数据类型


-30710
解析虚拟字段表达式异常


-30711
暂不支持的虚拟字段处理逻辑


-30712
无法在源数据中找到待比较的值


-31001
对象必填参数缺失


-31002
对象存在但类型与输入类型不匹配


-31003
没有可修改项


-31004
修改的对象字段不支持修改


-31005
创建的独立属性对象上已存在


-31006
对象id与数据区不匹配


-31007
对象独立属性个数超限


-31008
生成对象id失败


-31009
升级的一组对象来自不同的模型，不能同时升级


-31010
升级的一组对象与给的新的拷贝不属于同一个模型


-31011
升级的拷贝关联的不是模型的最高版本


-31012
不支持此对象类型的操作


-31013
外键成员名无效


-31014
外键唯一键名无效


-31015
外键成员名和唯一键名不匹配


-31016
导入模式不被允许创建


-31017
父对象和子对象不在同一个时空内


-31018
父对象GUID不存在


-31019
对象id相同guid不同，对象不可传输


-31020
对象guid相同id不同，对象不可传输


-31021
对象guid相同id相同，但对象结构不一致


-31022
对象不属于AppSpaceTime，无法进行写操作


-31023
对象名在同一个时空下重复，请检查日志


-31024
别名不存在


-31025
别名已存在


-31026
添加或修改对象时不支持给定的字段值


-31027
添加对象时必填的时序物成员未赋值


-31028
添加对象时时序物成员值不在minValue和maxValue范围内


-31029
指定对象名查询时，duplicationDealMode为2存在重复名字的对象


-31030
指定对象名查询时，指定对象名字的对象在时空条件下不存在
Query()

-31031
指定对象别名查询时，存在重复的对象


-31032
指定对象别名查询时，指定对象别名的对象在时空条件下不存在


-31033
指定对象Id查询时，指定对象id的对象在时空条件下不存在


-31034
查询对象condition下对象全部失败
Query(对象)
指定时空不存在，指定对象[]都不存在，param.type和指定对象不匹配
-31035
查询对象condition下对象部分失败
Query()
mode=17，ids[]里有不在指定时空里的对象
-31100
在同一父时空下存在相同名字的子时空


-31101
父时空对象不存在


-31102
给定的时空id或guid已存在


-31103
给定的时空id不允许为系统时空id


-31104
给定的时空id重复


-31105
给定的时空guid重复


-31106
时空模式非法

 | 元语言函数_运维库
- 曲线: (root) | 元语言函数_运维库 | 元语言函数_运维库 > 
Result Query(stringMap<Var> param,stringMap<Var> input,stringMap<Var> &output);
**功能描述：**
	查询节点历史cpu、内存、磁盘、网卡的运行数据记录,根据记录数据可绘制节点cpu、内存、磁盘、网卡运行曲线,可了解一段时间节点的运行情况
2.	最长查7天的数据
3.	该脚本可由业务用户调用
4.	当前远程运维只涉及性能数据，日志，报警三类数据，三类数据都是子云上报到父云，父云会单独存储一份数据。父云关于子云的这些数据和子云本地的数据是两份，他们相互独立，通过镜像上传的方式保证一致性。所以对于性能数据，日志，报警三类数据对象的增删查改，以及存储配置相关接口都需在input中指明regionGUID.
**param参数:**
int32
cloudID
该配置项指的是在端上，远程连接云时，云的区域ID，区域ID取值范围为1-255，若操作本区域，该处为空。
否

int32
type
数据类型,此函数填14017
是

int64
transactionID
事务ID
否

int32
timeout
超时时间
否

int32
areaID
运维只有一个数据区,该参数对于运维无用
不填

**input参数:**
int32
mode
操作类型
监控节点历史数据=2
是
Datetime
startTime
查询开始时间

是
Datetime
endTime
查询结束时间

是
string
regionGUID
区域GUID
指定所操作的对象是属于哪个云或者端。
是
string
nodeGUID
节点GUID

是
int32
pageIndex
页码
默认第一页,正整数,支持查某一页
否
int32
pageCapacity
页面容量
默认10条,正整数
否
string[]
returnFields
指定返回字段
为空默认返回所有,仅支持定制返回第一层字段,缩进字段为上一层结构中包含的字段<br />{"timestamp",//datetime <br />"nodeID",//int32<br />"disk",//stringMap<Var><br />"cpu",//stringMap<Var><br />"memory",//stringMap<Var><br />"nets",//stringMap<Var>[]<br />"handle",//stringMap<Var>}<br />数据结构同节点实时运行参数
否
**output参数:**
int32
totalPage
总页数((返回表格总数量))
int32
pageIndex
页码(返回的表格数据是第几页)
DataSet
returnData
以表格形式返回returnFields中的字段及结果
**脚本示例：**
stringMap<var> param;
param["cloudID"]=1;
param["timeOut"]=3000;
param["type"]= 14017;
stringMap<var> input;   //输入参数集合
input["mode"] = 2;//查询监控节点历史数据
input["nodeID"] = 1;
input["startTime"] = DateTime(2024, 5, 6, 15, 49, 00, 00);
input["endTime"] = DateTime(2024, 5, 8, 15, 49, 00, 00);
input["pageIndex"]=1;
input["pageCapacity"]=10;
stringMap<Var> output;//返回数据结构体,内部结构如下
Result ret=Query(param,input,output);
If (ret.ret==0){
    Tracestring("查节点历史监控","成功");
    dataSet table = output.returnData;
    //获取单元格数据，方式1：先获取每行数据再获取单元格
        string[] colsName;
        colsName=table.colsNames();
        for(int32 j=1;j<=table.rowLength;j++){
    //获取每一行数据
            var[] row = table.row(j);
            for(int32 m=1;m<=table.colLength;m++){
                //获取每一个单元格数据
                var cell = table.cellByID(j,m);
                Tracestring("列名：",colsName[m]);
                Tracestring("row=：",ConvertToJsonstring(j));
                Tracestring("col =：",ConvertToJsonstring(m));
                Tracestring("cell=：",ConvertToJsonstring(cell));
            }
        }
    
};
**返回结构：**
Struct Result
{
int ret;//结果代码
int consumeTime;//耗时，单位毫秒
int traceID;//跟踪ID，用于查询跟踪日志
};

Struct output
{
DataSet returnData;
int32 totalPage;
int32 pageIndex;
} | 元语言函数_运维库 > 
Result Query(stringMap<Var> param,stringMap<Var> input,stringMap<Var> &output);
**功能描述：**
查询服务实例的历史cpu、内存、磁盘占用值、各性能相关的报警指标历史值,根据记录数据可绘制各服务cpu、内存、磁盘等的运行曲线,可了解一段时间服务实例的运行情况
该脚本可由业务用户调用.
当前远程运维只涉及性能数据，日志，报警三类数据，三类数据都是子云上报到父云，父云会单独存储一份数据。父云关于子云的这些数据和子云本地的数据是两份，他们相互独立，通过镜像上传的方式保证一致性。所以对于性能数据，日志，报警三类数据对象的增删查改，以及存储配置相关接口都需在input中指明regionGUID.
**param参数:**
int32
cloudID
该配置项指的是在端上，远程连接云时，云的区域ID，区域ID取值范围为1-255，若操作本区域，该处为空。
否

int32
type
数据类型,此函数填14017
是

int64
transactionID
事务ID
否

int32
timeout
超时时间
否

int32
areaID
运维只有一个数据区,该参数对于运维无用
不填

**input参数:**
int32
mode
操作类型
监控服务历史数据=4
是
string
regionGuid
区域GUID
指定所操作的对象是属于哪个云或者端
是
Datetime
startTime
查询开始时间

是
Datetime
endTime
查询结束时间

是
string
nodeGuid
节点Guid

是
int32
svcType
服务类型

是
int32
svcInstantiateID
服务实列

是
int32
pageIndex
页码
默认第一页,正整数,支持查某一页记录
否
int32
pageCapacity
页面容量
默认10条,正整数
否
string[]
returnFields
指定返回字段
返回的字段名称//为空默认返回所有,

<br />{ Node1#1/serviceCPUOccupy //int32,模型库服务在节点1上cup占用情况




<br />Node1#1/serviceDiskOccupy//int32,模型库服务在节点1上磁盘占用情况




<br />Node1#1/serviceMemoryOccupy //int32,模型库服务在节点1上内存占用情况




<br />其他性能数据 //其他性能数据主要是各子系统上报到运维的实时变化的报警指标




<br />}
否



**output参数:**
int32
totalPage
总页数((返回表格总数量))
int32
pageIndex
页码(返回的表格数据是第几页)
DataSet
returnData
以表格形式返回returnFields中的字段及结果
**脚本示例：**
stringMap<var> param;
param["cloudID"]=1;
param["timeOut"]=3000;
param["type"]= 14017;
stringMap<var> input;   //输入参数集合
input["mode"] = 4;//查询监控服务历史数据
input["nodeID"] = 1;
input["svcType"] = 1;
input["startTime"] = DateTime(2024, 5, 6, 15, 49, 00, 00);
input["endTime"] = DateTime(2024, 5, 8, 15, 49, 00, 00);
input["pageIndex"]=1;
input["pageCapacity"]=10;
stringMap<Var> output;//返回数据结构体,内部结构如下
Result ret=Query(param,input,output);
if (ret.ret==0){
    Tracestring("查询服务历史监控","成功");
    dataSet table = output.returnData;
    //获取单元格数据，方式1：先获取每行数据再获取单元格
        string[] colsName;
        colsName=table.colsNames();
        for(int32 j=1;j<=table.rowLength;j++){
    //获取每一行数据
            var[] row = table.row(j);
            for(int32 m=1;m<=table.colLength;m++){
                //获取每一个单元格数据
                var cell = table.cellByID(j,m);
                Tracestring("列名：",colsName[m]);
                Tracestring("row=：",ConvertToJsonstring(j));
                Tracestring("col =：",ConvertToJsonstring(m));
                Tracestring("cell=：",ConvertToJsonstring(cell));
            }
        }
    
};
**返回结构：**
Struct Result
{
int ret;//结果代码
int consumeTime;//耗时，单位毫秒
int traceID;//跟踪ID，用于查询跟踪日志
};

Struct output
{
DataSet returnData;
int32 totalPage;
int32 pageIndex;
} | 元语言函数_运维库 > 
Result Query(stringMap<Var> param,stringMap<Var> input,stringMap<Var> &output) ;
**功能描述：**
查询固定端历史cpu、内存、磁盘、网卡的运行数据记录,根据记录数据可绘制节点cpu、内存、磁盘、网卡运行曲线,可了解一段时间节点的运行情况
**param参数:**
int32
cloudID
该配置项指的是在端上，远程连接云时，云的区域ID，区域ID取值范围为1-255，若操作本区域，该处为空。
否

int32
type
数据类型,此函数填14042
是

int64
transactionID
事务ID
否

int32
timeout
超时时间
否

int32
areaID
运维只有一个数据区,该参数对于运维无用
不填

**input参数:**
int32
mode
操作类型
历史数据=2
是
Datetime
startTime
查询开始时间

是
Datetime
endTime
查询结束时间

是
int32
regionID
端ID
端ID范围1050000-2050000。端在同一区域内不可重复，不同区域内，可以出现相同ID的端。
是
int32
pageIndex
页码
默认第一页,正整数,支持查某一页
否
int32
pageCapacity
页面容量
默认10条,正整数
否
string[]
returnFields
指定返回字段
为空默认返回所有,仅支持定制返回第一层字段,缩进字段为上一层结构中包含的字段<br />{"timestamp",//datetime <br />"regionID",//int32<br />"disk",//stringMap<Var><br />"cpu",//stringMap<Var><br />"memory",//stringMap<Var><br />"nets",//stringMap<Var>[]}<br />内部数据结构参见节点实时性能
否
**output参数:**
int32
totalPage
总页数((返回表格总数量))
int32
pageIndex
页码(返回的表格数据是第几页)
DataSet
returnData
以表格形式返回returnFields中的字段及结果
**脚本示例：**
stringMap<var> param;
param["cloudID"]=1;
param["timeOut"]=3000;
param["type"]= 14042;
stringMap<var> input;   //输入参数集合
input["mode"] = 2;//查询监控历史数据
input["regionID"] = 101;
input["startTime"] = DateTime(2024, 6, 26, 15, 49, 00, 00);
input["endTime"] = DateTime(2024, 6, 28, 15, 49, 00, 00);
stringMap<Var> output;//返回数据结构体,内部结构如下
Result ret=Query(param,input,output);
If (ret.ret==0){
    Tracestring("查固定端历史监控","成功");
    dataSet table = output.returnData;
    //获取单元格数据，方式1：先获取每行数据再获取单元格
        string[] colsName;
        colsName=table.colsNames();
        for(int32 j=1;j<=table.rowLength;j++){
    //获取每一行数据
            var[] row = table.row(j);
            for(int32 m=1;m<=table.colLength;m++){
                //获取每一个单元格数据
                var cell = table.cellByID(j,m);
                Tracestring("列名：",colsName[m]);
                Tracestring("row=：",ConvertToJsonstring(j));
                Tracestring("col =：",ConvertToJsonstring(m));
                Tracestring("cell=：",ConvertToJsonstring(cell));
            }
        }
    
};
**返回结构：**
Struct Result
{
int ret;//结果代码
int consumeTime;//耗时，单位毫秒
int traceID;//跟踪ID，用于查询跟踪日志
};

Struct output
{
int32 totalPage;
int32 pageIndex;
DataSet returnData;
}
- 图表: 
- ECharts: 
- 树: (root) | 实时库 | 实时库 > 
数据对象间组成树状，即数据对象之间有分支，并且具有层次关系的结构，可用于表示数据对象之间存在的一对多关系。如下图，每个“树”的节点比如A、B、C...都代表一数量据对象，数据对象间的关系形成“树”形。在树形结构中，树根节点，如图中的A节点，没有前驱节点（父节点），其余每个节点有且只有一个前驱节点（父节点）。叶子节点，如图中的E、K、G、H 、L、M、J节点，没有后续节点（子节点），其余每个节点的后续节点（子节点）可以是一个，也可以是多个，如图：
![img](系统说明.assets/wpsABFtmp.jpg) 
Ø 树节点（Tree Node）：树中的一个独立单元，上图中的每一个圆形所表示的都是一个节点。
Ø 树根（Root）：位于树顶部的节点，也称顶级节点，如上图中的A节点。
Ø 节点的祖先和后代：一个节点的祖先包括父节点、祖父节点、曾祖父节点等，后代包括子节点、孙节点、曾孙节点等，如上图中，节点I的祖先节点有节点D和节点A，后代节点有节点L和节点M。每一个节点和它的后代也构成一棵树。
Ø 层级（Level）：如上图，一个节点和它的后代树，节点是第0层级（level为0）；节点的子第一层级（level为1），节点的孙是第二级（level为2）...
距离是层级的另外一种说法，二者值一样，但是角度不同，如下，
![img](实时库介绍.assets/wpsE0CC.tmp.png)
距离，指后代距离祖先的分隔段数，中间隔着1个对象，分隔段数为2，中间隔着两个对象，分隔段数为3...........；
假设父-子关系如上图，则有：
node1与node1的距离是0；
node2、node3与node1的距离是1；
node4~node6与node1的距离是2；
距离也叫深度、层级；
注意，距离指的是后代到祖先的距离，而不是祖先到后代的距离, 所以distance值一定是非负数； | 实时库 > 
对象的父对象GUID，默认为空串，代表没有父；
注意：
时序物的父是业务物，岗位的父是组织，人员没有父；
对象父子关系不能互为父子，也不允许出现祖先后代关系树出现闭环；
允许只删除父，不删除子，此时子上父guid不会变化；
父对象不为空串时，需要在对象的时空内存在； | 模型库 | 模型库 > 
用户组是用户的一个集合或分类，对应wos3.9中的组织，可以按用户组进行权限配置，用户组拷贝可以与角色拷贝、钥匙拷贝建立关联，表示该用户组的权限。
用户组拷贝之间可以有父子关系，通过parentGUID建立用户组树结构。 | 模型库 > 
角色是用户或用户组的身份，可以按角色进行权限配置。角色拷贝可以与角色拷贝、钥匙拷贝建立关联，表示该角色的权限。
角色拷贝之间可以有父子关系，通过parentID建立角色树结构。 | 模型库 > 
WOS按照时空体系组织业务单元，包括App对象、数据对象（物、事、人员、组织等）。云系统时空下可以创建根时空，根时空下继续创建子时空，形成一棵时空对象树。
时空对象类似一个容器，其中包含业务应用相关的内容（程序+数据）。时空对象之间的操作有时空约束，可以保证业务模块之间的隔离，方便系统的维护，提升系统稳定性。
WOS4.5的时空对象可以在模型库创建，部署到运行库。也可以直接在运行库进行创建。
模型库的时空对象下仅有子时空，每个时空对象有时空仓库配置和镜像配置。
模型库提供ID固定为0的系统时空，存储在默认数据区0中。系统时空本身不可查询、不可修改、不可删除。但可以作为范围查询其包含的内容。
创建子时空时需要指定父时空，创建根时空时指定的父时空是系统时空0。同层级的时空数量数量不做限制。时空层级数量不做限制。 | App引擎介绍 | App引擎介绍 > 
支持根据App拷贝创建根App、子App对象，创建即启动运行。
App拷贝可以来自本地，也可以来自远程WOS（如：云WOS中的App拷贝部署到端WOS）。
子App只能由父App创建。App对象按照父子结构进行组织，形成一棵App对象树。
![](./media/创建App对象.png)
**所属时空（部署时空）：**
所属时空也叫部署时空，表示App对象创建的本地时空。端App对象的所属时空为端时空，云App对象的所属时空为云时空。
BS模式下，WebJS App对象看做云App对象，所属时空为云时空；
CS模式下，WebJS App对象看做端App对象，所属时空为端时空。
**远程访问时空：**
App对象针对每一个远程WOS都可以配置一个远程访问时空。当App对象登录远程WOS后，就可以访问远程访问时空中的App对象和数据对象。
BS模式下，WebJS App可以访问所属云时空的数据；
CS模式下，WebJS App对象访问云上数据，需要配置云上对应时空才能访问。
**App的用户登录：**
创建App对象时支持配置用户列表，用户登录成功后，才可以访问本地WOS数据，或访问远程WOS数据。具体详见【WOS互联】章节，在此不再赘述。 | App引擎介绍 > 
WOS按照时空体系组织业务单元，包括App对象、数据对象（物、事、人员、组织等）。云系统时空下可以创建根时空，根时空下继续创建子时空，形成一棵时空对象树。
时空对象类似一个容器，其中包含业务应用相关的内容（程序+数据）。时空对象之间的操作有时空约束，可以保证业务模块之间的隔离，方便系统的维护，提升系统稳定性。
![](./media/时空对象.png)
**提供时空对象的操作如下：**
查询时空对象列表
查询时空对象树
过滤查询时空对象 | 快速入门
- 函数: (root) | 简介 | 简介 > 
移动鼠标至任务栏左下角LOGO处，会弹出退出登录按钮，点击后，对于CS桌面，窗口关闭；对于BS桌面(开发态)，则退出到登陆页。
![image-20250108142850045](media/退出登陆.png)
对于BS桌面(运行态)，由业务上自己掉退出登陆函数来实现。 | 模型库 | 模型库 > 
一种类型的对象有相同的数据结构、业务逻辑。其数据结构、业务逻辑是该类对象的基因，也就是模型。WOS通过先构建基因（模型），再批量实例化（创建拷贝）的方法，实现快速建模能力。
WOS4.5的模型分为编辑版本和历史版本。
模型在新建时会产生1个编辑版本。编辑版本只有1份，只要模型存在，编辑版本则一定存在。编辑版本的版本号为0。
历史版本通过提交函数生成，提交功能是将编辑版本0当前的数据额外存储一份历史数据。历史版本的版本号为正数，从1开始递增且不回收。
模型只有编辑版本可以修改，历史版本在产生后不会变化（除name、displayname、label、repositoryGUID属性，这些属性会随编辑版本修改而变化）。
模型只有历史版本可以产生拷贝。
每个历史版本可以独立删除，编辑版本不能独立删除，删除编辑版本0表示删除整个模型包括所有历史版本。
查询模型时，支持输入版本号-1表示查询所有历史版本，不包括编辑版本。 | 模型库 > 
App模型支持元语言、webJS、nodeJS、C++、QT、JAVA等多种程序语言。
元语言APP模型支持编辑功能函数，JSApp模型支持编辑功能文件。
App模型内置declare、onCreate、onDestroy、onMessage、onException系统函数，用户不能增、删系统函数，只能修改系统函数脚本。App模型还可以增加自定义函数。
onMessage系统函数有固定入参stringMap<var> message。
onException系统函数有固定入参stringMap<var> message。 | 模型库 > 
App模块模型是公共函数模块，模型里的功能函数可以被其它App模型里的脚本调用，达到代码复用的目的，App模块模型只支持元语言。App模块模型内置declare系统函数，可以添加自定义函数。 | 模型库 > 
域型交互表拷贝用于记录域对型的访问权限配置，安全策略可关联不同的域型交互表，表示该安全策略按该域型交互配置鉴权。
域型交互表有域型关系配置relationship，表示记录的域对型有操作权限。结构见函数定义。 | 计划库 | 计划库 > 
​           历史库是存历史数据的数据库，计划库是存计划数据的数据库，时序数据（单灵敏时序物、多灵敏时序物、时序事）只有历史数据，没有计划数据。计划库所有对象和记录的数据结构、枚举类型、函数功能、错误码和历史库完全一样，只是比历史库少了单灵敏时序物、多灵敏时序物、时序事这几类对象和记录类型，因此，不再重复赘述，请直接查看历史库的相关文档。
​           计划库和历史库只有以下2个区别：
1、计划库比历史库少了单灵敏时序物、多灵敏时序物、时序事这几类对象和记录类型，也就没有特殊的时序物记录查询功能（时刻查询、间隔查询、趋势查询）。
2、type枚举值不同，参见下表：
子系统
子系统服务
3000
4000
对象
业务物对象
3001
4001

单灵敏度时序物对象
3002
无

多灵敏度时序物对象
3003
无

组织对象
3004
4004

人员对象
3005
4005

业务事对象
3006
4006

时序事对象
3007
无

岗位对象
3008
4008




记录
业务物记录
3101
4101

单灵敏度时序物记录
3102
无

多灵敏度时序物记录
3103
无

组织记录
3104
4104

人员记录
3105
4105

业务事记录
3106
4106

时序事记录
3107
无

岗位记录
3108
4108




列表
运行模型成员索引
3201
无？

对象成员索引
3202
4202

对象成员唯一索引
3203
4203

记录版本
3210
4210

外键
3211
4211

时间范围版本
3212
4212

组织岗位
3213
4213




其它
别名
3214
4214

数据集
3301
4301

任务
3302
4302

时空对象
3701
4701

//AU对象
3702
4702

运行仓库对象
3702
4702

资源对象
3758
4758

跨库数据集
18301
18301




模型
业务物模型
3901
4901

单灵敏度时序物模型
3902
无

多灵敏度时序物模型
3903
无

组织模型
3904
4904

人员模型
3905
4905

业务事模型
3906
4906

时序事模型
3907
无

岗位模型
3911
4911




拷贝
业务物拷贝
3801
4801

单灵敏度时序物拷贝
3802
无

多灵敏度时序物拷贝
3803
无

组织拷贝
3804
4804

人员拷贝
3805
4805

业务事拷贝
3806
4806

时序事拷贝
3807
无

岗位拷贝
3808
4808 | App引擎介绍 | App引擎介绍 > 
App引擎：即App计算引擎。
App引擎是WOS系统的计算执行服务，完成App业务功能的调度执行。主要负责App对象的创建（部署启动）、删除（反部署停止）、查询、修改、订阅；App调试、功能调用、接口函数调用、定时调用、事务控制等。
根据支持的语言类型分为：元语言App引擎、WebJS App引擎、NodeJS App引擎等。
- 脚本: (root) | wos安装卸载流程 | wos安装卸载流程 > 
在WellinOS安装路径下找到**terminalUnInstallToolGui.exe**，即为WellinOS客户端卸载程序
右键**以管理员身份运行**，即可进入客户端端卸载界面。
可勾选是否保留历史数据，若选择保留历史数据，卸载完成后会在安装路径下保存一个名称为**terminalDB**的文件夹，此为WellinOS客户端数据，包含时空库模型、对象、脚本等业务数据，在下次安装时可选择直接加载该数据继续使用。
点击**开始卸载**按钮
待进度条达到100%时，显示卸载完成即可 | 模型库 | 模型库 > 
App模型支持元语言、webJS、nodeJS、C++、QT、JAVA等多种程序语言。
元语言APP模型支持编辑功能函数，JSApp模型支持编辑功能文件。
App模型内置declare、onCreate、onDestroy、onMessage、onException系统函数，用户不能增、删系统函数，只能修改系统函数脚本。App模型还可以增加自定义函数。
onMessage系统函数有固定入参stringMap<var> message。
onException系统函数有固定入参stringMap<var> message。 | 模型库 > 
App模块模型是公共函数模块，模型里的功能函数可以被其它App模型里的脚本调用，达到代码复用的目的，App模块模型只支持元语言。App模块模型内置declare系统函数，可以添加自定义函数。 | App引擎介绍 | App引擎介绍 > 
App对象：指通过App拷贝（或App模型）创建在App引擎中的运行对象，包含业务功能执行的逻辑脚本（程序代码）。App对象创建后自动执行脚本代码，从而完成用户的业务功能。
App对象按照运行依赖的App引擎类型及语言类型，分为：元语言App、WebJS App、NodeJS App等。 | App引擎介绍 > 
元语言App：通过元语言App引擎运行的App对象，脚本使用元语言。 | App引擎介绍 > 
WebJS App：通过WebJS App引擎和Web浏览器运行的App对象，脚本使用JavaScript语言。 | App引擎介绍 > 
NodeJS App：通过NodeJS App引擎运行的App对象，脚本使用NodeJS语言。 | App引擎介绍 > 
NodeJS App：通过NodeJS App引擎运行的App对象，脚本使用C++语言。
- 业务物: (root) | 实时库 | 实时库 > 
在时空数据库中，物是客观世界中物理实体的数字孪生体，比如汽车、轮胎等都是物。
物的分类：
ü 时序物：又分为单灵敏度时序物、多灵敏度时序物。
时序物主要指变化较频繁的物，其数据需要频繁地写库，单值频繁写库使用单灵敏度时序物，比如传感器；多值一同频繁写库使用多灵敏度时序物，比如采集设备（如定时采集温度、压力、流量等多个值）。时序物有自己独特的属性：新鲜期（实时）、有效期（历史），单灵敏度时序物还有变化死区（实时）、存储死区（历史）等，请参阅相关术语概念。
单灵敏度时序物分为实时单灵敏度时序物和历史单灵敏度时序物，没有计划单灵敏度时序物。
多灵敏度时序物分为实时多灵敏度时序物和历史多灵敏度时序物，没有计划多灵敏度时序物。
时序历史物支持记录，时序实时物不支持记录；
时序物的父是业务物。
ü 业务物：
业务物不具有时序物的一些特性；
业务物分为业务实时物、业务历史物、业务计划物；
业务历史物和业务计划物支持记录，业务实时物不支持记录； | 实时库 > 
对象的父对象GUID，默认为空串，代表没有父；
注意：
时序物的父是业务物，岗位的父是组织，人员没有父；
对象父子关系不能互为父子，也不允许出现祖先后代关系树出现闭环；
允许只删除父，不删除子，此时子上父guid不会变化；
父对象不为空串时，需要在对象的时空内存在； | 实时库 > 
时间坐标系对象GUID，业务物、组织、人员具有该属性；创建时指定，不能修改；
可以为空串，代表使用系统时间坐标系；
事对象没有时间属性，其时间属性在记录上；
具体含义见上述“时间对象”的介绍； | 模型库 | 模型库 > 
数据模型是对数据结构进行对象化组织与管理的一种抽象表达，是现实事物在系统中的规范化表征形式。
数据模型类型包括业务物、单灵敏物、多灵敏物、组织、岗位、人员、业务事、时序事，共八种。 | 模型库 > 
业务类数据模型包括业务物、业务事、组织、岗位、人员，业务类模型通常用于孪生现实生活中数据的变化频率较低的事物，如锅炉、生产事件、公司的组织结构、人员等。 | 模型库 > 
普通拷贝由模型创建，包括业务物、单灵敏物、多灵敏物、组织、岗位、人员、业务事、时序事、图关系、关系、App、第三方App。
App模块模型没有拷贝。 | 计划库 | 计划库 > 
​           历史库是存历史数据的数据库，计划库是存计划数据的数据库，时序数据（单灵敏时序物、多灵敏时序物、时序事）只有历史数据，没有计划数据。计划库所有对象和记录的数据结构、枚举类型、函数功能、错误码和历史库完全一样，只是比历史库少了单灵敏时序物、多灵敏时序物、时序事这几类对象和记录类型，因此，不再重复赘述，请直接查看历史库的相关文档。
​           计划库和历史库只有以下2个区别：
1、计划库比历史库少了单灵敏时序物、多灵敏时序物、时序事这几类对象和记录类型，也就没有特殊的时序物记录查询功能（时刻查询、间隔查询、趋势查询）。
2、type枚举值不同，参见下表：
子系统
子系统服务
3000
4000
对象
业务物对象
3001
4001

单灵敏度时序物对象
3002
无

多灵敏度时序物对象
3003
无

组织对象
3004
4004

人员对象
3005
4005

业务事对象
3006
4006

时序事对象
3007
无

岗位对象
3008
4008




记录
业务物记录
3101
4101

单灵敏度时序物记录
3102
无

多灵敏度时序物记录
3103
无

组织记录
3104
4104

人员记录
3105
4105

业务事记录
3106
4106

时序事记录
3107
无

岗位记录
3108
4108




列表
运行模型成员索引
3201
无？

对象成员索引
3202
4202

对象成员唯一索引
3203
4203

记录版本
3210
4210

外键
3211
4211

时间范围版本
3212
4212

组织岗位
3213
4213




其它
别名
3214
4214

数据集
3301
4301

任务
3302
4302

时空对象
3701
4701

//AU对象
3702
4702

运行仓库对象
3702
4702

资源对象
3758
4758

跨库数据集
18301
18301




模型
业务物模型
3901
4901

单灵敏度时序物模型
3902
无

多灵敏度时序物模型
3903
无

组织模型
3904
4904

人员模型
3905
4905

业务事模型
3906
4906

时序事模型
3907
无

岗位模型
3911
4911




拷贝
业务物拷贝
3801
4801

单灵敏度时序物拷贝
3802
无

多灵敏度时序物拷贝
3803
无

组织拷贝
3804
4804

人员拷贝
3805
4805

业务事拷贝
3806
4806

时序事拷贝
3807
无

岗位拷贝
3808
4808 | 快速入门
- 时空: (root) | 服务器推荐配置 | 服务器推荐配置 > 
单副本云环境结构是指WellinOS所有的子系统服务（如时空库服务、管理服务等）均以单实例的模式部署在同一节点上，是轻量级的WellinO，该结构只需提供一台物理服务器或虚拟机即可。
该结构无冗余容灾能力，在升级时需要中断业务运行。 | 服务器推荐配置 > 
多副本云环境结构是指WellinOS所有的子系统服务（如时空库服务、管理服务等）均以**双实例 或 三实例**的模式部署在双节点或三节点上，该结构需根据副本数提供对应数量的服务器或虚拟机。
该结构具有一定的冗余容灾能力，在升级时业务无需停机，做到灰度升级。 | 应用图标管理 | 应用图标管理 > 
启动FU有三种方式，
第一，点击图标，启动FU；若FU为启动状态，针对有webJSFU，再次点击即打开对应窗口；针对元语言FU，再次点击不更改状态，依然是运行状态；
第二，图标上，右键，出现菜单；
![image-20240830142614598](media/启动.png)
第三，时空对象管理-我创建的，选中图标点击进行启动，如下图：
![image-20240830142840754](media/时空对象管理-启动.png)
点击启动FU时，图标上会展示转圈的图标，表示启动中：
![image-20240830143121453](media/启动进度.png) | 应用图标管理 > 
停止FU有三种方式，
第一，任务栏上，鼠标移上去，点击关闭。关闭即将FU停止；
![image-20240830142914954](media/任务栏停止.png)
第二，图标上，右键，出现菜单；
第三，时空对象管理-我创建的，选中图标点击进行停止，如下图：
![image-20240830142840754](media/时空对象管理-停止.png) | 应用图标管理 > 
强制停止FU有两种方式，
第一，右键点击图标，点击“强制停止”，如下图：
第二，时空对象管理-我创建的，选中图标点击强制停止，如下图：
![](media/时空对象管理-强制停止.png) | 应用图标管理 > 
删除，即先删除运行中的FU对象，再将桌面上的图标删除；操作方式有三种，
第一，图标上，右键，出现菜单；
第二，时空对象管理-我创建的，选中图标点击进行删除；
第三，时空对象管理-全部，选中对象点击进行删除，如下图：
![](media/时空对象管理-删除.png) | 应用图标管理 > 
强制删除FU有两种方式，
第一，时空对象管理-我创建的，选中图标点击进行强制删除；
第二，时空对象管理-全部，选中对象点击进行强制删除。 | 应用图标管理 > 
点击编辑按钮，可以编辑名称、对象ID、默认账号、应用分组和语言配置属性。
运行中的FU应用可以编辑名称、默认账号和应用分组；停止运行的FU应用可以编辑所有属性。
编辑FU应用有两种方式，编辑弹窗如下图：
第一，图标上，右键，出现菜单；
第二，时空对象管理-我创建的，选中图标点击进行编辑；
![](media/编辑.png) | 应用图标管理 > 
分配角色主要应用是，最终运行的时候，可以看到该FU的用户。
只针对BS模式下、webFU、公共应用有该功能。
公共应用分配角色有两种方式，
第一，在时空对象管理工具新建FU对象时，应用类型选择公共应用，点击配置按钮配置角色管理，如下图：
![image-20250108145846168](media/新建公共应用.png)
第二，在桌面右键点击图标后，选择分配角色，可以对应用添加或移除角色，如下图：
![image-20250108145846168](media/分配角色.png)
默认展示已添加角色列表，可以选中角色，点击“移除”按钮，移除角色；
点击“登录运维添加角色”，打开登录弹窗，登录运维后会获取到全部的角色信息，选中角色后，点击“确认添加”，完成角色分配。
![image-20250108145953622](media/分配角色弹窗.png)
- 安装: (root) | wos安装卸载流程 | wos安装卸载流程 > 
本部分介绍WellinOS产品单副本云环境、多副本云环境的安装流程。其中，单副本云环境、多副本云环境安装流程区别在于安装配置文件的不同，其余前置准备与授权安装等流程均相同。 | wos安装卸载流程 > 
本部分主要检查服务器时间与服务器磁盘大小，以保证安装后系统运行时，业务数据的一致性与稳定可用性。 | wos安装卸载流程 > 
ssh连接服务器，执行命令：date ,  获取当前服务器时间：
date
若服务器时区不为CST时，执行如下命令，修改为东八时区；若时区为CST则无需操作。
export  TZ='Asia/Shanghai'
若服务器时间与当前时间不符时，执行命令，修改服务器时间。此外，若拟安装多副本环境，需待安装的所有节点系统时间保持一致。
date -s "2007-08-03 14:15:00"    //时间需修改为实际时间
之后执行命令，将时间写入硬件中
sudo hwclock --systohc | wos安装卸载流程 > 
执行命令，获取服务器各路径磁盘空间大小
df -h
建议将WellinOS安装在单独的硬盘中，安装于最大的空间路径下。例如图例所示，示例中最大路径为**/**路径，即可将其安装于 /root或/usr 路径下。 | wos安装卸载流程 > 
WellinOS云版安装包名称如下图所示，其中：
**x86**：代表适用于x86架构操作系统
**20260121**：代表安装包版本
可与亚控技术支持人员联系获取对应操作系统版本的最新安装包。
将安装包上传至拟安装单副本或多副本的服务器（拟安装多副本只需将安装包上传至其中一台服务器即可）。执行如下指令将其解压：
tar -zxvf WellinOS4.5_InstallPacket_CloudLinux_x86_20260121.tar.gz
解压后如图所示： | wos安装卸载流程 > 修改安装包配置文件 | wos安装卸载流程 > 
打开安装包  cloud_install_tool/config  路径下的 systemInstallInfo.json 文件，修改如下内容：
**RegionID**：WellinOS云ID，可选择1-255。若企业需安装多套云环境，云ID需确保不重复。
**nodeList部分**：
**IP**：拟安装WellinOS的节点IP
**port**：sh链接端口号，一般为22
**rootName**：节点用户名，需使用root用户
**rootPassword**：节点root用户密码
**installPath**：WellinOS运维管理服务的安装路径，建议选择独立硬盘且较大空间路径。
**serviceDefaultDataAreaList部分：**
**dataPath**：WellinOS时空库等业务服务的安装路径，建议选择独立硬盘且较大空间路径。 | wos安装卸载流程 > 
打开安装包  cloud_install_tool/config  路径下的 systemInstallInfo.json 文件，修改如下内容：
**RegionID**：WellinOS云ID，可选择1-255。若企业需安装多套云环境，云ID需确保不重复。
**accessVip**：WellinOS管理服务的虚拟IP，需使用与安装节点同网段的空闲IP。
**nodeList部分**：
**IP**：拟安装WellinOS的节点IP
**port**：sh链接端口号，一般为22
**rootName**：节点用户名，需使用root用户
**rootPassword**：节点root用户密码
**id**：节点编号，从1开始
**installPath**：WellinOS运维管理服务的安装路径，建议选择独立硬盘且较大空间路径。
当安装多副本时，需按照图框结构增加另外的节点信息，同时修改 **节点编号id** ，确保不重复。如图蓝框所示即为双副本的节点信息结构。
**serviceDefaultDataAreaList部分：**
**copyNodes**：WellinOS时空库等业务服务的安装节点，需与 **节点编号id** 对应，如图示即双副本的节点编号ID。
**dataPath**：WellinOS时空库等业务服务的安装路径，建议选择独立硬盘且较大空间路径。
此外，还需为WellinOS业务接入网关与业务传输网关服务配置虚拟IP。
**serviceInstType18的vip**：WellinOS业务接入网关虚拟IP，需使用与安装节点同网段的空闲IP，用于后续登录WellinOS业务开发系统环境。
**serviceInstType19的vip**：WellinOS业务传输网关虚拟IP，需使用与安装节点同网段的空闲IP，用于后续WellinOS多云间数据传输。若个人或企业后续不需要多套云环境间数据传输，此项可不配置。 | wos安装卸载流程 > 
修改完成后保存，在安装包 /cloud_install_tool  路径下执行如下指令：
./wellinOSInstall
之后在对应进度处输入：**NodeCheck** 与 **Install**，并回车后即开始安装。
等待安装执行完成后显示**INSTALL SUCCESS**，即代表安装完成。（注：安装过程中的执行报错一般可忽略，只要显示**INSTALL SUCCESS**即可） | wos安装卸载流程 > 
云环境安装后7天免费试用期，若继续使用需要及时申请授权文件并导入授权。
在浏览器（推荐使用较新版本的谷歌浏览器）中输入登录地址：http://IP:8687/maintance（IP：单节点为服务器IP，多节点为安装时配置的WellinOS管理服务的虚拟IP），打开WellinOS系统管理中心（也称运维管理中心）。
默认系统管理员用户为：**systemAdmin**，密码为：**<密码已脱敏>**。点击登录进入系统管理中心。
点击**授权安装管理**，点击**导出机器码**，勾选所有节点，点击**导出**按钮，即可在浏览器自动下载机器码。
将导出的机器码发送亚控技术支持人员，由其进行内部流程审批，获取授权文件。授权信息包含如下内容：
**授权到期时间**：根据商务信息确定授权到期日期，在后续授权即将到期时，可根据商务情况进行授权延长
**最大在线用户数**：根据项目用户规模确定最大在线业务用户数
**授权对象数**：业务数据规模限制，即模型、模型拷贝、每种对象的最大数量。不填默认0，表示不做限制。依据商务情况确定。
获取授权文件后，在**授权安装管理**中点击**安装授权**，选择云区域ID（默认为1），选择**授权文件**，点击**确定**按钮即可。
- 权限: (root) | wos安装卸载流程 | wos安装卸载流程 > 
修改完成后保存，在工具包 /cloud_uninstall_tool 路径下执行如下指令，为卸载程序赋予可执行权限：
chmod 777 ./*
之后执行如下指令：
./wellinOSUnInstall
在进度处输入如下指令，即开始进行卸载：
UnInstall
等待卸载执行完成后显示**UNINSTALL SUCCESS**，即代表卸载完成。（注：卸载过程中的执行报错一般可忽略，只要显示**UNINSTALL SUCCESS**即可） | 简介 | 简介 > 
桌面提供BS和CS两种模式，BS模式即浏览器登录访问模式，通过浏览器打开登录WellinOS系统，CS模式即客户端安装模式，需要下载独立安装包进行登录访问，其中两种模式在配置和操作中都有不同，以下介绍两种模式的不同之处。
安装
不需要，浏览器访问即可
需要，下载安装并打开WellinOS系统
登录
打开浏览器输入地址展示登录页
Windows桌面点击WellinOS图标打开端桌面，免登录模式
多云访问
单云模式，不能连接访问其他云环境
多云模式，可以连接访问多个云环境
统一登录
只有当前云，无法增加云账号
默认登录本端，可以添加云登录，可连接多个云环境
时空功能开发工具
不需要登录，直接使用
默认显示第一个已登录的客户端，可以添加多个客户端访问
时空对象管理工具
不需要登录，直接使用
默认显示第一个已登录的客户端，可以添加多个客户端访问
系统运维管理
只能对当前环境进行登录管理
默认显示第一个已登录的客户端，可以添加多个客户端访问
安全管理
只能对当前环境进行登录管理
默认显示第一个已登录的客户端，可以添加多个客户端访问
审计管理
只能对当前环境进行登录管理
默认显示第一个已登录的客户端，可以添加多个客户端访问
打开浏览器输入地址展示登录页，如下图所示：
![](media/桌面-简介-浏览器模式.png)
windows桌面点击WellinOS图标打开端桌面，免登录模式，如下图所示：
![](media/桌面-简介-CS模式.png)
**统一登录：**
单云模式，只有当前云，不能连接访问其他云环境，如下图所示：
![](media/桌面-简介-单云模式.png)
多云模式，可连接访问多个云环境，如下图所示：
![](media/桌面-简介-多云模式.png)
**多云访问、时空功能开发：**
BS模式中不需要登录，直接进入当前云开发界面，无法访问其他云环境；
CS模式中默认显示第一个已登录的客户端，统一登录中登录其他云业务账号后可以添加多个客户端访问，如下图所示：
![](media/桌面-简介-多云开发.png)
**时空对象管理：**
BS模式中不需要登录，直接进入当前云管理界面，无法访问其他云环境；
CS模式中默认显示第一个已登录的客户端，统一登录中登录其他云业务账号后可以添加多个客户端访问，如下图所示：
![](media/桌面-简介-数据管理1.png)
**系统运维、安全管理、审计管理：**
点击运维、安全、审计、时空开发、时空运行等工具，均需要对应的权限，如果对应账号未登录，会有对应的提示信息：
![](media/桌面-简介-统一登录.png)
BS模式中只能对当前环境进行登录管理，无法登录其他云环境；
CS模式中默认显示第一个已登录的客户端，统一登录中登录其他云业务账号后可以添加多个客户端访问，如下图所示（以系统运维为例）：
![](media/桌面-简介-管理工具1.png) | 模型库 | 模型库 > 
安全相关拷贝用于在建模阶段建立安全体系，安全拷贝构建的只是配置信息，并不是实际生效的权限。用户可根据业务需求，在业务拷贝上配置安全策略拷贝，当业务拷贝对象化时，将安全策略拷贝也对象化，业务对象的安全标记关联安全策略对象，实现对业务对象的权限控制。 | 模型库 > 
DTE模型把系统视为主体的集合和客体的集合。主体的集合被称为域，客体的集合被称为型。域和型是相对的，同一个对象作为主体时属于域，作为客体使用时则属于型。
通过配置域对各个型的访问权限，描述主体对客体的访问权限。
域型的集合可以建立细分域型，细分域继承父域对各个型的访问权限。若域A对型B具有访问权限，则域A的细分域也有型B的权限，域A也有型B的细分型的权限。 | 模型库 > 
域型交互表拷贝用于记录域对型的访问权限配置，安全策略可关联不同的域型交互表，表示该安全策略按该域型交互配置鉴权。
域型交互表有域型关系配置relationship，表示记录的域对型有操作权限。结构见函数定义。 | 模型库 > 
安全策略拷贝上关联锁拷贝，表示对客体的操作权限的保护。
安全策略拷贝上关联钥匙拷贝，表示主体具有的操作权限。
钥匙拷贝不显性提供，锁拷贝和钥匙拷贝的ID相同。
锁拷贝分为以下类型，安全标记拷贝上每种类型的锁拷贝只能添加一个。 | 模型库 > 
用户对象是指wos中的业务人员。用户对象在wos系统中既是主体对象也是客体对象。用户作为主体时，根据用户携带的钥匙，判断该用户主体是否对目标客体有操作权限。
用户拷贝通过关联用户组拷贝、角色拷贝、钥匙拷贝，表示该用户的权限。 | 模型库 > 
用户组是用户的一个集合或分类，对应wos3.9中的组织，可以按用户组进行权限配置，用户组拷贝可以与角色拷贝、钥匙拷贝建立关联，表示该用户组的权限。
用户组拷贝之间可以有父子关系，通过parentGUID建立用户组树结构。
- 授权: (root) | wos安装卸载流程 | wos安装卸载流程 > 
本部分介绍WellinOS产品单副本云环境、多副本云环境的安装流程。其中，单副本云环境、多副本云环境安装流程区别在于安装配置文件的不同，其余前置准备与授权安装等流程均相同。 | wos安装卸载流程 > 
云环境安装后7天免费试用期，若继续使用需要及时申请授权文件并导入授权。
在浏览器（推荐使用较新版本的谷歌浏览器）中输入登录地址：http://IP:8687/maintance（IP：单节点为服务器IP，多节点为安装时配置的WellinOS管理服务的虚拟IP），打开WellinOS系统管理中心（也称运维管理中心）。
默认系统管理员用户为：**systemAdmin**，密码为：**<密码已脱敏>**。点击登录进入系统管理中心。
点击**授权安装管理**，点击**导出机器码**，勾选所有节点，点击**导出**按钮，即可在浏览器自动下载机器码。
将导出的机器码发送亚控技术支持人员，由其进行内部流程审批，获取授权文件。授权信息包含如下内容：
**授权到期时间**：根据商务信息确定授权到期日期，在后续授权即将到期时，可根据商务情况进行授权延长
**最大在线用户数**：根据项目用户规模确定最大在线业务用户数
**授权对象数**：业务数据规模限制，即模型、模型拷贝、每种对象的最大数量。不填默认0，表示不做限制。依据商务情况确定。
获取授权文件后，在**授权安装管理**中点击**安装授权**，选择云区域ID（默认为1），选择**授权文件**，点击**确定**按钮即可。 | 简介 | 简介 > 
WellinOS4.5桌面系统（以下简称桌面系统），属于WellinOS平台的可视化操作系统，满足用户在WellinOS平台中对应用的管理、运行等需求。桌面系统内置时空功能开发工具、时空对象管理工具、系统运维管理、安全管理、审计管理、商店、数据接入、转发、抽取工具。
时空功能开发工具：时空仓库管理、时空仓库下的FU以及相关数据的增删改以及通过各类编辑器对FU模型进行开发调试；
时空对象管理工具：时空管理、FU应用管理、实时、历史、计划数据对象管理以及联合查询管理；
系统运维管理：平台运维客户端，包括服务的部署管理、审计、授权、日志查看等；
安全管理：平台安全客户端，包括组织、角色、用户以及锁、钥匙等；
审计客户端：包括各类审计记录的查看和报警记录查看；
![](media/桌面首页.png) | 简介 > 
下载、安装WellinOS端包以后，双击WellinOS4.5.exe即可进入桌面系统；
目前有端用户体系，桌面也提供了端用户切换，登出状态下输入用户的账户和密码后，点击登录按钮完成登录，如下图如下：
![](media/06登录-端登录.png)
端运维用户的登陆管理，在桌面上进行端包升级、FU授权功能时，需要使用运维用户执行。
端业务用户的登陆管理，在桌面、本端业务客户端时，需要使用端业务用户执行。 | 节点管理 | 节点管理 > 
制作授权时，需要先提供机器码，机器码导出有两种方式：
1、通过机器码采集工具；
2、通过运维管理中心导出机器码。
本文重点介绍第二种方式，具体操作为点击操作栏【导出机器码】按钮或者列表上方【批量导出机器码】按钮。
![021](media/nodeinstall021.png) | 授权管理 | 授权管理 > 
WOS4.0中的授权可以控制运行所在机器、授权截止时间、最大在线用户数、各类数据对象数量。
初次安装WOS时，在未安装授权的情况下，将存在7天的试用期，试用期过后，将无法进行业务操作。
授权文件通过初始安装工具安装，也可以在系统客户端中进行安装。运维客户端既可管理云区域授权，也可管理端区域授权。 | 授权管理 > 1.云授权
- 部署: (root) | 服务器推荐配置 | 服务器推荐配置 > 
单副本云环境结构是指WellinOS所有的子系统服务（如时空库服务、管理服务等）均以单实例的模式部署在同一节点上，是轻量级的WellinO，该结构只需提供一台物理服务器或虚拟机即可。
该结构无冗余容灾能力，在升级时需要中断业务运行。 | 服务器推荐配置 > 
多副本云环境结构是指WellinOS所有的子系统服务（如时空库服务、管理服务等）均以**双实例 或 三实例**的模式部署在双节点或三节点上，该结构需根据副本数提供对应数量的服务器或虚拟机。
该结构具有一定的冗余容灾能力，在升级时业务无需停机，做到灰度升级。 | 服务器推荐配置 > 
节点*2/节点\*3
2.1GHz，8核以上
16G 以上
100G 以上
1000M 以上
该配置为WellinOS系统运行的最低配置，适用于存储数据量小、并发使用低的低负载业务场景或学习试用场景。
上述推荐结构和基础配置，是WellinOS在较低负载下，能够正常运行的推荐部署结构和基础运行配置，仅做参考，并不适用于所有的解决方案；具体部署结构，硬件要求，需要根据项目数据规模、用户并发量、业务计算复杂度、服务否需要细化拆分部署等，进一步分析处理，可联系亚控技术支持人员进行个性化推荐。 | 简介 | 简介 > 
WellinOS4.5桌面系统（以下简称桌面系统），属于WellinOS平台的可视化操作系统，满足用户在WellinOS平台中对应用的管理、运行等需求。桌面系统内置时空功能开发工具、时空对象管理工具、系统运维管理、安全管理、审计管理、商店、数据接入、转发、抽取工具。
时空功能开发工具：时空仓库管理、时空仓库下的FU以及相关数据的增删改以及通过各类编辑器对FU模型进行开发调试；
时空对象管理工具：时空管理、FU应用管理、实时、历史、计划数据对象管理以及联合查询管理；
系统运维管理：平台运维客户端，包括服务的部署管理、审计、授权、日志查看等；
安全管理：平台安全客户端，包括组织、角色、用户以及锁、钥匙等；
审计客户端：包括各类审计记录的查看和报警记录查看；
![](media/桌面首页.png) | 实时库 | 实时库 > 
在时空库进行数字孪生的过程：
Step1，构建数据模型。
Step2，根据数据模型生成数据拷贝。
Step3，根据数据拷贝生成数据对象（实时/历史/计划），即客观对象的数字孪生体对象。
Step4，为对象添加数据记录。（并非所有对象都支持记录）
模型是数据的“基因”，模型即业务关心的客观事物对象的参数集合，模型决定数据的结构；
拷贝是“基因”的载体，基因（模型）必须有载体，才能“传播”和使用。拷贝为模型的参数结构加一组参数值，拷贝是运行对象的配置数据。拷贝是根据模型创建的，一个模型版本可以生成多个拷贝。
模型和拷贝是在模型库创建的，通过时空部署功能部署到实时库，或者通过导入功能导入到实时库。实时库提供简单的模型、拷贝管理功能，详情参见相关的功能点。
对象即客观事物对应的数字孪生体；对象是根据拷贝创建的。（广义上，任何目标数据都可称为对象，比如模型也是一种对象；此处指时空库概念中狭义上的对象）
对象分为实时对象、历史对象、计划对象，分别表示客观事物的实时、历史、计划状态。
历史对象包括历史记录，计划对象包括计划记录，实时时序事、业务事对象也有记录。数据记录属于数据对象，依附于数据对象而存在，要想添加数据记录，首先要创建数据对象，删除对象，会一并将对象的记录删除。但并不是所有类型的对象都有记录，比如实时物对象、资源对象等就没有记录。实时库中，只有实时业务事对象和实时时序事对象才有记录。 | 实时库 > 
时空是一个容器，其中包含业务应用相关的内容（程序+数据）。实时库的对象，都处于时空当中。
对象的操作有时空约束，对象的安全鉴权也受时空范围锁的约束，时空之间彼此隔离，容纳不同业务模块的程序和数据。
时空是用一种对象描述的，即时空对象；
在实时库中，可以创建、删除、修改、查询时空对象；
实时库中的时空对象还可以是从模型库部署过来的。
\ APP访问数据限制说明（本云访问）：
（1）APP写数据（增、删、改）时，受APP部署时空的限制，只能操作功能单元部署时空内的数据；
（2）APP读数据（查询、订阅）时，不受APP部署时空的限制，可以访问任意时空内的数据；
\ APP访问数据限制说明（跨云访问）：
（1）APP读、写数据（增、删、改、查询、订阅）时，不受时空的限制，可以访问指定云区域的任意时空（通过在APP上指定）； | 模型库 | 模型库 > 
WOS支持第三方App的部署功能，用户将第三方可运行程序编译打包后，使用zip压缩转换为blob后存储至模型库的第三方app模型中，根据用户提供的启动命令行，App引擎统一进行部署和反部署。
第三方App模型在不同系统中程序包不同，每个模型提供多个数据包的存储，以适配在各种环境下运行。