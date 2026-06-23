// 声明 repoGuidAndInfoMap;
// 声明 packetGuidAndVersionMap;
// 声明 guidsToBeDeleted; 存储待删除的仓库包 guids
// 声明 guidAndErrorInfoMap; 存储guid和错误码

// 根据传入的guids获取根实例的仓库信息（guid、name），组装 repoGuidAndInfoMap

// 遍历 parentGuidAndChildrenGuidsMap，先打包根仓库，获取到根仓库数据包版本后再打包子仓库（串行）




// test
// $Variable.instanceGuids = ["0c2c0b4c-aeeb-48bb-9af2-cb7ef9217f00", "762669ef-7321-4dd6-8951-fe01a01d8c2a", "706e74fb-efef-4ba0-8705-8eaf0ed64898"];
// $Variable.versionInstruction = "测试打包";


const Enum_taskStatus = {
    NotStarted: 0,      // 未开始
    Running: 1,         // 进行中
    Completed: 2,       // 已完成
    Error: 3,           // 错误
    Aborted: 4          // 中止
};

const Enum_ErrorCode = {
    SUCCESS: 0,
    PARENT_FAILED: 1,
    CHILD_FAILED: 2,
    BROHTER_FAILED: 3,
    ABORT: 4,
    RELATE_FAILED: 5,  // 被同级、父级或后代失败所影响到的相关失败
};

const Enum_RepoType = {
    SPACE_TIME_REPO: "50",
    ROOT_INSTANCE: "102",
    CHILD_INSTANCE: "101",
    AU_ROOT_INSTANCE: "10250",
    AU_CHILD_INSTANCE: "10150",
};

const Enum_RepoTypeStr = {
    SPACE_TIME_REPO: "时空仓库",
    ROOT_INSTANCE: "根实例",
    CHILD_INSTANCE: "子实例",
    AU_ROOT_INSTANCE: "根实例的子AU仓库",
    AU_CHILD_INSTANCE: "子实例的子AU仓库",
    UNKNOWN: "未知"
};


const repoGuidAndInfoMap = new Map();

// 根实例：子实例
const rootInstanceGuidAndChildInstanceGuidsMap = new Map();
const childInstanceGuidAndRootInstanceGuidMap = new Map();
// 根实例：子AU仓库
const rootInstanceGuidAndChildAuRepoGuidsMap = new Map();
const childAuRepoGuidAndRootInstanceGuidMap = new Map();
// 子实例：子AU仓库
const childInstanceGuidAndChildAuRepoGuidsMap = new Map();
const childAuRepoGuidAndChildInstanceGuidMap = new Map();

const packetGuidAndVersionMap = new Map();
const invalidPacketGuidsSet = new Set();

const concurrentPacketCount = 200; // 并发打包数量
let totalCount = 0;
let completedCount = 0;

debugger;

main();

async function main()
{
    try
    {
        const rootInstanceGuids = $Variable.instanceGuids;
        if (!rootInstanceGuids || rootInstanceGuids.length == 0)
        {
            _showMessage("待提交版本的实例guids为空");
            $Event.Cancel();
            return;
        }
        const versionInstruction = $Variable.versionInstruction;
        if (versionInstruction.length == 0)
        {
            _showMessage("版本说明不能为空");
            $Event.Cancel();
            return;
        }

        // 初始化查询仓库列表
        if (!await _initRepos(rootInstanceGuids))
        {
            $Event.Cancel();
            return;
        }

        // 计算 totalCount
        totalCount = repoGuidAndInfoMap.size;

        // 初始化更新任务列表
        _updateTaskListTable();

        // 打包
        console.log("[D] <版本提交进度> 开始打包 :: repoGuidAndInfoMap = ", repoGuidAndInfoMap);
        await _submitRepoVersions(versionInstruction);
        console.log("[D] <版本提交进度> 打包结果 :: repoGuidAndInfoMap = ", repoGuidAndInfoMap);

        // r如果有打包失败的，则需要删除已经打好的数据包
        if (invalidPacketGuidsSet.size > 0)
        {
            await _compileInvalidRepoPackets();
            await _exportFailedInstances();
        }

        // 远程调用清除时空仓库相关旧版本数据包的工具函数 -TODO

        // 提示导出失败的实例信息表格 =TODO

        $Event.Finish();

        close_ElementButton.disabled = false;
        closeIcon_ElementButton.disabled = false;
        abortPacket_ElementButton.disabled = true;
    } catch (error)
    {
        _showMessage("程序执行错误:: " + error.message);
        console.log("[E] <实例版本提交页面> 程序执行错误 :: ", error);
        close_ElementButton.disabled = false;
        closeIcon_ElementButton.disabled = false;
        abortPacket_ElementButton.disabled = true;
    }
}



/** ============================================== 初始化仓库信息 START ================================================ */

// 初始化仓库信息, 一定要按照顺序层层初始化仓库信息
async function _initRepos(rootInstanceGuids)
{
    let filter = "";
    let returnFields = ["$name", "$guid", "$parentguid", "$description"];
    let limit = 100;
    let funcDesc = "";

    if (rootInstanceGuids.length == 0)
    {
        _showMessage(`rootInstanceGuids 为空`);
        return;
    }

    // 初始化根实例仓库
    {
        returnFields = ["$name", "$guid", "$parentguid", "$description"];
        limit = 1000;
        funcDesc = "查询根实例仓库信息列表";
        const repos = await _queryReposByGuids(rootInstanceGuids, returnFields, { limit, funcDesc });
        if (!repos)
        {
            _showMessage(`${funcDesc} :: 失败`);
            return false;
        }

        if (repos.length != rootInstanceGuids.length)
        {
            _showMessage(`${funcDesc} :: 仓库数量(${repos.length}个)与rootInstanceGuids(${rootInstanceGuids.length}个)数量不一致`);
            return false;
        }

        repos.forEach(item =>
        {
            const guid = item.$guid;
            const fullName = item.$name;
            const repoType = Enum_RepoType.ROOT_INSTANCE;
            repoGuidAndInfoMap.set(guid, Object.assign