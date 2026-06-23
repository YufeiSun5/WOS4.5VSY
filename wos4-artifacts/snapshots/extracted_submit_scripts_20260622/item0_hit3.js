console.log("[D] 点击了提交版本按钮");

debugger;


main();

async function main()
{

    const childPageName = $Variable.选择提交版本时空仓库页面名称;
    if (childPageName.length == 0)
    {
        _showMessage("选择提交版本时空仓库页面名称 为空", "warning");
        return
    }


    const submitInfo = await _showChildPage(childPageName);
    if (!submitInfo || Object.keys(submitInfo).length === 0 || submitInfo.spaceTimeRepoGuids.length === 0 || submitInfo.versionInstruction.length === 0)
    {
        return;
    }

    // submitInfo = {
    //     spaceTimeRepoGuids: [],
    //     versionInstruction: versionInstruction,
    // };
    $Variable.submitSpaceTimeRepos = submitInfo;
}

async function _showChildPage(pageName)
{
    const clientHeight = document.body.clientHeight;
    const clientWidth = document.body.clientWidth;

    const pageHeight = clientHeight > 800 ? 800 : clientHeight * 0.9;
    const pageWidth = clientWidth > 1200 ? 1200 : clientWidth * 0.9;

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
            name: "实例根仓库信息",
            value: $Variable.实例根仓库信息
        },
        {
            name: "配置后台时空对象全路径",
            value: $Variable.配置后台时空对象全路径
        },
        {
            name: "配置后台APP对象名称",
            value: $Variable.配置后台APP对象名称
        },
        {
            name: "cloudId",
            value: $Variable.cloudId
        }
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
            console.log(`[D] <实例化框架页面> :: 接收到 <${pageName}> 传递来的公开事件 transferData = `, transferData);
            const { eventName, eventParam } = transferData;
            if (eventName == "Confirm")
            {
                resolve(eventParam[0]);
                CloseChild(pageName);
                return;
            }
            if (eventName === "Cancel")
            {
                resolve();
                CloseChild(pageName);
                return;
            }
        });
    });
}

async function _showSubmitPage(pageName, spaceTimeRepoGuids, versionInstruction)
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
            name: "spaceTimeRepoGuids",
            value: spaceTimeRepoGuids
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
            if (eventName === "Confirm" || eventName === "Cancel")
            {
                CloseChild(pageName);
                resolve();
            }
        });
    });
}

function _showMessage(massage, type = "error")
{
    const options = {
        message: massage,
        type: type,
        duration: 3000,
        showClose: true,
    };
    ShowMessage(options);
}