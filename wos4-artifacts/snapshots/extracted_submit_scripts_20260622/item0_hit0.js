
const SUCCESS_CODE = 0;
const TYPE_META_FU_OBJECT = 21001;
const IDENTIFIER_TYPE_ENUM = {
    ID: 1,
    NAME: 2,
    FULL_NAME: 3,
    ALLIAS: 4, // 别名
    GUID: 5  // GUID
};


// 校验参数
// 获取父时空仓库的最新版本，如果没有则无法提交实例
// 打开实例版本提交页面提交实例
// 调用后台接口，删除实例的旧版本仓库包

main();

async function main()
{

    const spaceTimeRepo = $Variable.currentSpaceTimeRepo;
    if (Object.keys(spaceTimeRepo).length === 0)
    {
        _showMessage("请选择时空", "warning");
        return;
    }

    const instanceList = $Variable.submitInstances;
    if (Object.keys(instanceList).length === 0)
    {
        _showMessage("请选择实例", "warning");
        return;
    }
    const pageName = $Variable.实例版本提交页面名称;
    if (!pageName)
    {
        _showMessage("<实例版本提交页面名称> 为空", "warning");
        return;
    }

    const spaceTimeRepoGuid = spaceTimeRepo.guid;
    const instanceGuids = instanceList.map(item => item.guid);

    // 获取当前时空仓库的最新仓库数据包信息，如果获取不到，则不允许提交实例
    const latestVersionOfSpaceTimeRepo = await _queryLatestVersionOfSpaceTimeRepo(spaceTimeRepoGuid);
    if (latestVersionOfSpaceTimeRepo == undefined)
    {
        return;
    }

    if (latestVersionOfSpaceTimeRepo <= 0)
    {
        _showMessage("因当前时空仓库未提交版本，故无法提交实例");
        return;
    }

    const versionInstruction = `${spaceTimeRepoGuid}_v_${latestVersionOfSpaceTimeRepo}`;
    // await _showChildPage(pageName, spaceTimeRepoGuid, instanceGuids);
    await _showChildPage(pageName, instanceGuids, versionInstruction);

    await _cleanOldVersionListBySpaceTimeRepoGuids([spaceTimeRepoGuid]);
}

async function _queryLatestVersionOfSpaceTimeRepo(spaceTimeRepoGuid)
{
    const params = new StringMap({
        guid: spaceTimeRepoGuid
    });

    const funcName = "IQuerySpaceTimeRepoDetails";
    const funcRes = await _remoteCall(funcName, [new Variant(params)]);
    if (!funcRes || funcRes.errorcode !== SUCCESS_CODE || !funcRes.returndata)
    {
        const errorMessage = `查询时空仓库的最新版本失败`;
        console.error(`[E] <框架页面> :: submitInstances :: <_queryLatestVersionOfSpaceTimeRepo> :: ${errorMessage}, funcRes = `, funcRes);
        _showMessage(errorMessage);
        return;
    }
    return funcRes.returndata.version;
}

async function _cleanOldVersionListBySpaceTimeRepoGuids(spaceTimeRepoGuids)
{
    const params = new StringMap({
        spaceTimeRepoGuids: spaceTimeRepoGuids
    });

    const funcName = "ICleanOldVersionsBySpaceTimeRepoGuids";
    const funcRes = await _remoteCall(funcName, [new Variant(params)]);
    if (!funcRes || funcRes.errorcode !== SUCCESS_CODE)
    {
        const errorMessage = `清理旧的实例版本失败`;
        console.error(`[E] <框架页面> :: submitInstances :: <ICleanOldVersionsBySpaceTimeRepoGuids> :: ${errorMessage}, funcRes = `, funcRes);
        return;
    }
    return true;
}


async function _showChildPage(pageName, instanceGuids, versionInstruction)
{
    const clientWidth = document.body.clientWidth;
    const clientHeight = document.body.clientHeight;

    // let pageHeight = 230 + instanceGuids.length * 38;
    // if (clientHeight < pageHeight)
    // {
    //     pageHeight = clientHeight * 0.8;
    // }
    const pageWidth = clientWidth > 1200 ? 1200 : clientWidth * 0.9;
    const pageHeight = clientHeight > 700 ? 700 : clientHeight * 0.8;

    const pageLeft = (clientWidth - pageWidth) / 2;
    const pageTop = (clientHeight - pageHeight) / 2;

    const styleOptions = {
        width: pageWidth,
        height: pageHeight,
        left: pageLeft,
        top: pageTop,
        draggable: false,
        header: false,
        // title: pageTitle,
        closable: true,
        resizable: false,
        maximizable: false,
    };

    const variables = [
        {
            name: "instanceGuids",
            value: instanceGuids
        },
        {
            name: "versionInstruction",
            value: versionInstruction
        },
    ];

    const options = {
        styleOptions,
        variables,
        stType: 5, // 2：FULLNAME
        spaceTime: $Variable.配置后台时空对象全路径
    };

    return new Promise(resolve =>
    {
        ShowChild(pageName, options, function (transferData)
        {
            console.log(`[D] <实例化框架页面> :: submitInstances :: 接收到 <${pageName}> 传递来的公开事件 transferData = `, transferData);
            const eventName = transferData.eventName;
            if(eventName == "Finish"){
                resolve();
            }
            
            if (eventName === "Confirm" || eventName === "Cancel")
            {
                CloseChild(pageName);
                resolve();
            }
        });
    });
}


function _showChildPage_bak(pageName, spaceTimeRepoGuid, instanceGuids)
{

    const clientHeight = document.body.clientHeight;
    const clientWidth = document.body.clientWidth;

    const pageHeight = 250;
    const pageWidth = 550;

    cons