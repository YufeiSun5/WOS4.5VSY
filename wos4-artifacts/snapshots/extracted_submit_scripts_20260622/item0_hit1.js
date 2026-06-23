
const SUCCESS_CODE = 0;
const TYPE_META_FU_OBJECT = 21001;
const IDENTIFIER_TYPE_ENUM = {
    ID: 1,
    NAME: 2,
    FULL_NAME: 3,
    ALLIAS: 4, // 别名
    GUID: 5  // GUID
};

let loadingPopup;

// 校验参数
// 获取父时空仓库的最新版本，如果没有则无法提交实例
// 打开实例版本提交页面提交实例
// 调用后台接口，删除实例的旧版本仓库包

main();

async function main()
{

    try
    {
        const submitInfo = $Variable.submitSpaceTimeRepos;
        if (Object.keys(submitInfo).length === 0)
        {
            _showMessage("提交内容为空", "warning");
            return;
        }

        const pageName = $Variable.时空仓库版本提交页面名称;
        if (!pageName)
        {
            _showMessage("<时空仓库版本提交页面名称> 为空", "warning");
            return;
        }

        if (!submitInfo.spaceTimeRepoGuids || submitInfo.spaceTimeRepoGuids.length === 0)
        {
            _showMessage("要提交的时空仓库guids为空", "warning");
            return;
        }

        if (!submitInfo.versionInstruction || submitInfo.versionInstruction.length === 0)
        {
            _showMessage("版本提交说明为空", "warning");
            return;
        }

        const spaceTimeRepoGuids = submitInfo.spaceTimeRepoGuids;
        const versionInstruction = submitInfo.versionInstruction;
        // await _showChildPage(pageName, spaceTimeRepoGuid, instanceGuids);
        await _showChildPage(pageName, spaceTimeRepoGuids, versionInstruction);

        loadingPopup = _showLoadingPopup(loadingPopup, "清除冗余的仓库数据包中...");

        await _cleanOldVersions(spaceTimeRepoGuids);

        _closeLoadingPopup(loadingPopup);

    } catch (error)
    {
        console.log(`[E] <框架页面> :: submitSpaceTimeRepos 改变时 :: 程序执行错误 :: `, error);
        _showMessage("程序执行错误", "error");
        return;
    }
}

async function _queryLatestVersionOfSpaceTimeRepo(spaceTimeRepoGuid)
{
    const params = new StringMap({
        guid: spaceTimeRepoGuid
    });

    const funcName = "IQuerySpaceTimeRepoDetails";
    const funcRes = await _remoteCall(funcName, [ new Variant(params) ]);
    if (!funcRes || funcRes.errorcode !== SUCCESS_CODE || !funcRes.returndata)
    {
        const errorMessage = `查询时空仓库的最新版本失败`;
        console.error(`[E] <框架页面> :: submitInstances :: <_queryLatestVersionOfSpaceTimeRepo> :: ${errorMessage}, funcRes = `, funcRes);
        _showMessage(errorMessage);
        return;
    }
    return funcRes.returndata.version;
}



async function _cleanOldVersionListBySpaceTimeRepoGuids(spaceTimeRepoGuids, funcDesc = "清除冗余的仓库数据包")
{
    console.log(`[D] ${funcDesc} :: START :: ${new Date().format("yyyy_MM_dd hh:mm:ss")}`);
    
    const params = new StringMap({
        spaceTimeRepoGuids: spaceTimeRepoGuids
    });

    const funcName = "ICleanOldVersionsBySpaceTimeRepoGuids";
    const funcRes = await _remoteCall(funcName, [ new Variant(params) ]);
    if (!funcRes || funcRes.errorcode !== SUCCESS_CODE)
    {
        const errorMessage = `${funcDesc} :: 失败`;
        console.log(`[E] ${errorMessage}, funcRes = `, funcRes);
        console.log(`[E] ${errorMessage}, params = `, params);
        return;
    }
    
    console.log(`[D] ${funcDesc} :: END :: ${new Date().format("yyyy_MM_dd hh:mm:ss")}`);
    return true;
}


async function _cleanOldVersions(spaceTimeRepoGuids, funcDesc = "清除冗余的仓库数据包")
{

    console.log(`[I] ${funcDesc} :: START :: ${new Date().format("yyyy_MM_dd hh:mm:ss")}`)
    console.log(`[D] ${funcDesc} :: spaceTimeRepoGuids = `, spaceTimeRepoGuids);

    const batchSize = 5; // 每批数量
    const batchCount = Math.ceil(spaceTimeRepoGuids.length / batchSize);
    console.log(`[D] ${funcDesc} :: 总数 = `, spaceTimeRepoGuids.length);
    console.log(`[D] ${funcDesc} :: 每批数量 = `, batchSize);
    console.log(`[D] ${funcDesc} :: 总批数 = `, batchCount);

    const concurrentSize = 3; // 并发数量
    const concurrentBatchCount = Math.ceil(batchCount / concurrentSize);

    console.log(`[D] ${funcDesc} :: 并发数量 = `, concurrentSize);
    console.log(`[D] ${funcDesc} :: 总并发批数 = `, concurrentBatchCount);

    const stepDesc = `${funcDesc} :: 总批数 = ${batchCount} :: 总并发批数 = ${concurrentBatchCount}`;




    const results = [];
    for (let i = 0; i < concurrentBatchCount; i++)
    {
        const funcInfo = `${stepDesc} :: 并发批次 = ${i + 1}`;
        console.log(`[I] ${funcInfo} :: START :: ${new Date().format("yyyy_MM_dd hh:mm:ss")}`)
        const promiseArr = [];
        for (let j = i * concurrentSize; j < (i + 1) * concurrentSize; j++)
        {
            const _stepDesc = `${funcInfo} :: 批次 = ${j + 1}`;
            const startIndex = j * batchSize;
            if (startIndex >= spaceTimeRepoGuids.length)
            {
                break;
            }
            const endIndex = Math.min((j + 1) * batchSize, spaceTimeRepoGuids.length);
            const guidsBatch = spaceTimeRepoGuids.slice(startIndex, endIndex);
            promiseArr.push(_cleanOldVersionListBySpaceTimeRepoGuids(guidsBatch