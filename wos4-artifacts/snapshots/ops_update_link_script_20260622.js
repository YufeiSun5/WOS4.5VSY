/*
 * 创建人：tian.he
 * 函数名：updatePUInstance
 * 描述：更新生产单元实例
 * 步骤：
 * 参数：
 * 返回值：
 */

debugger

// 声明call函数常量
const CALL_BY_NAME = 2;
const API_TYPE = 21001; // 接口类型标识
const TIMEOUT = 1000 * 60 * 5; // 接口请求超时时间
const PARAM_PUBLIC = new StringMap({
    "cloudID": $Variable.cloudID,
    "type": API_TYPE,
    "timeout": TIMEOUT
});

// 消息提示窗函数
function _Infor(massage, type) {
    var options = {
        message: massage,
        type: type,
        duration: 3000,
        showClose: true
    };
    ShowMessage(options);
}

// --------------------------------遮罩层校验状态---------------------------------
// 基于 Promise 的 sleep 函数
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 获取期望结果函数
function getExpectedResult(command) {
    let result = "";
    switch (command) {
        case '更新':
            result = "已启动";
            break;
        default:
            break;
    }
    return result;
}

// 查询时空对象状态函数
function querySTObjectInfo(reposGUID) {
    return new Promise((resolve, reject) => {

        let inputParamMap = new StringMap({});
        inputParamMap._insert("reposGUID", reposGUID, "string[]"); // string[];实例仓库GUID数组

        const input = new StringMap({
            identifierType: CALL_BY_NAME,
            name: $Variable.spaceTimeObjectName,
            funcname: "IQuerySTObjectInfo",
            params: [new Variant(inputParamMap)]
        });

        let pjtMngSTFullPath = $Variable.spaceTimeObjectFullPath;
        let runInfo = {
            stType: 5, // FULLNAME，使用全路径名标识，其他标识参数无效
            spaceTime: pjtMngSTFullPath // 目标页面的时空属性，和sTType配合使用
        }
        SetRunInfo(runInfo, async (resData) => {
            if (0 === resData.ret) {

                let res = await Call(PARAM_PUBLIC, input);

                try {
                    if (0 !== res.ret) {
                        let errormsg = "请求发送失败！请检查后台服务是否运行正常";
                        _Infor(errormsg, "error");
                        return reject("-E- " + errormsg + "，errorCode:" + res.ret);
                    }

                    if (res.errorcodes) {
                        for (let i = 0; i < res.errorcodes.length; i++) {
                            let res_errorcode = res.errorcodes[i];
                            if (0 !== res_errorcode) {
                                _Infor("查询失败！", "error");
                                return reject("-E- IQuerySTObjectInfo()接口错误，errorCode:" + res_errorcode);
                            }
                        }
                    }

                    if (res.returndata) {
                        let res_returndata = res.returndata;
                        if (0 !== res_returndata.errorcode) {
                            _Infor("查询失败！", "error");
                            return reject("-E- " + res_returndata.errormsg + "，errorCode:" + res_returndata.errorcode);
                        }

                        // 返回表格数据
                        return resolve(res_returndata.stobjectlist);
                    }

                } catch (error) {
                    // 保留原始错误栈信息 
                    return reject(`-E- 查询失败！${error.message}`);
                }
            } else {
                let errormsg = resData.msg;
                return reject("-E- " + errormsg + "，errorCode:" + resData.ret);
            }
        });
    });
}

// 查询时空仓库状态函数
function querySTRepoCfgInfo(repoGUID) {
    return new Promise((resolve, reject) => {

        let inputParamMap = new StringMap({});
        inputParamMap._insert("instRepoGUID", repoGUID, "string"); // string;实例仓库GUID

        const input = new StringMap({
            identifierType: CALL_BY_NAME,
            name: $Variable.spaceTimeObjectName,
            funcname: "IQuerySTRepoCfgInfo",
            params: [new Variant(inputParamMap)]
        });

        let pjtMngSTFullPath = $Variable.spaceTimeObjectFullPath;
        let runInfo = {
            stType: 5, // FULLNAME，使用全路径名标识，其他标识参数无效
            spaceTime: pjtMngSTFullPath // 目标页面的时空属性，和sTType配合使用
        }
        SetRunInfo(runInfo, async (resData) => {
            if (0 === resData.ret) {

                let res = await Call(PARAM_PUBLIC, input);

                try {
                    if (0 !== res.ret) {
                        let errormsg = "请求发送失败！请检查后台服务是否运行正常";
                        _Infor(errormsg, "error");
                        return reject("-E- " + errormsg + "，errorCode:" + res.ret);
                    }

                    if (res.errorcodes) {
                        for (let i = 0; i < res.errorcodes.length; i++) {
                            let res_errorcode = res.errorcodes[i];
                            if (0 !== res_errorcode) {
                                _Infor("查询失败！", "error");
                                return reject("-E- IQuerySTRepoCfgInfo()接口错误，errorCode:" + res_errorcode);
                            }
                        }
                    }

                    if (res.returndata) {
                        let res_returndata = res.returndata;
                        if (0 !== res_returndata.errorcode) {
                            _Infor("查询失败！", "error");
                            return reject("-E- " + res_returndata.errormsg + "，errorCode:" + res_returndata.errorcode);
                        }

                        // 返回表格数据
                        return resolve(res_returndata.strepocfglist);
                    }

                } catch (error) {
                    // 保留原始错误栈信息 
                    return reject(`-E- 查询失败！${error.message}`);
                }
            } else {
                let errormsg = resData.msg;
                return reject("-E- " + errormsg + "，errorCode:" + resData.ret);
            }
        });
    });
}

// 遮罩层校验实际时空对象和时空仓库状态函数
function loadingFunc(repoGUID) {
    return new Promise(async (resolve, reject) => {
        // 获取当前操作的期望结果
        let expectedResult = getExpectedResult($Variable.commandType);

        // 设置标志位参数
        let bVerifySTObjFlag = false;
        let bVerifySTRepoCfgFlag = false;

        // 设置轮询参数
        let pollCount = 0;
        const maxPolls = 2400; // 20分钟
        const pollInterval = 500; // 500毫秒

        // 校验操作的实际状态
        while (true) {
            try {
                // 查询校验时空对象和时空仓库的部署、运行状态
                if (!bVerifySTObjFlag) {
                    // 先查询校验时空对象的部署、运行状态是否符合预期
                    let stObjectInfo = await querySTObjectInfo([repoGUID]);
                    for (let i = 0; i < stObjectInfo.length; i++) {
                        if ((expectedResult === stObjectInfo[i].deploy_state) || (expectedResult === stObjectInfo[i].running_state)) {
                            bVerifySTObjFlag = true; // 校验成功，则开始校验时空仓库的状态
                            break;
                        }
                    }
                }
                if (bVerifySTObjFlag) {
                    // 当时空对象状态校验通过后，才开始查询校验时空仓库的部署、运行状态是否符合预期
                    let stRepoCfgInfo = await querySTRepoCfgInfo(repoGUID);
                    for (let i = 0; i < stRepoCfgInfo.length; i++) {
                        if ((expectedResult === stRepoCfgInfo[i].deploy_state) || (expectedResult === stRepoCfgInfo[i].running_state)) {
                            bVerifySTRepoCfgFlag = true; // 全部校验成功，则执行关闭遮罩层操作
                        } else {
                            bVerifySTRepoCfgFlag = false; // 若某个校验失败，则继续轮询校验状态
                            break;
                        }
                    }
                }

                // 状态全部校验通过，撤销部署特殊处理
                if (bVerifySTRepoCfgFlag) {
                    return resolve(0);
                }

                // 休眠等待
                await sleep(pollInterval);

                // 增加轮询计数
                pollCount++;

                // 检查是否达到最大轮询次数
                if (pollCount >= maxPolls) {
                    console.log('轮询结束，已达到最大查询次数');
                    return resolve(-1);
                }
            } catch (error) {
                console.error(error);
                return resolve(-1);
            }
        }

    });
}
// --------------------------------遮罩层校验状态---------------------------------

// 部署、批量部署生产单元实例函数
function _UpdatePUInstance(puInstanceItem, repopktversion) {
    return new Promise((resolve, reject) => {

        let paramMap = new StringMap({});
        paramMap._insert("instRepoGUID", puInstanceItem.purepoguid, "string"); // string;根实例仓库GUID
        paramMap._insert("updateVersion", repopktversion, "int32"); // int32;更新版本

        const input = new StringMap({
            identifierType: CALL_BY_NAME,
            name: $Variable.spaceTimeObjectName,
            funcname: "IUpdatePUInstance",
            params: [new Variant(paramMap)]
        });

        let pjtMngSTFullPath = $Variable.spaceTimeObjectFullPath;
        let runInfo = {
            stType: 5, // FULLNAME，使用全路径名标识，其他标识参数无效
            spaceTime: pjtMngSTFullPath // 目标页面的时空属性，和sTType配合使用
        }
        SetRunInfo(runInfo, async function(resData) {
            if (0 === resData.ret) {

                let res = await Call(PARAM_PUBLIC, input);

                try {
                    if (0 !== res.ret) {
                        let errormsg = "请求发送失败！请检查后台服务是否运行正常";
                        _Infor(errormsg, "error");
                        console.log("-E- " + errormsg + "，ret:", res.ret);
                        return resolve(-1);
                    }

                    if (res.errorcodes) {
                        for (let i = 0; i < res.errorcodes.length; i++) {
                            let res_errorcode = res.errorcodes[i];
                            if (0 !== res_errorcode) {
                                // _Infor("更新失败！", "error");
                                console.log("-E- IUpdatePUInstance()接口错误，errorCode:", res_errorcode);
                                return resolve(-1);
                            }
                        }
                    }

                    if (res.returndata) {
                        let res_returndata = res.returndata;
                        if (0 !== res_returndata.errorcode) {
                            // _Infor("更新失败！", "error");
                            console.log(res_returndata.errormsg);
                            return resolve(-1);
                        }

                        // 调用遮罩层
                        let loadRet = await loadingFunc(puInstanceItem.purepoguid);
                        return resolve(loadRet);
                    }
                } catch (e) {
                    // _Infor("更新失败！", "error");
                    console.log(e);
                    return resolve(-1);
                }
            } else {
                let errormsg = resData.msg;
                // _Infor(errormsg, "error");
                console.log("-E- " + errormsg + "，ret:", resData.ret);
                return resolve(-1);
            }
        });
    });
}

// 查询生产单元实例的仓库数据包版本列表函数
function _QueryRepoPacketsList(puInstanceItem) {
    return new Promise((resolve, reject) => {

        let paramMap = new StringMap({});
        paramMap._insert("selectRepoGUID", puInstanceItem.purepoguid, "string"); // string;选择的仓库GUID

        const input = new StringMap({
            identifierType: CALL_BY_NAME,
            name: $Variable.spaceTimeObjectName,
            funcname: "IQueryRepoPacketsList",
            params: [new Variant(paramMap)]
        });

        let pjtMngSTFullPath = $Variable.spaceTimeObjectFullPath;
        let runInfo = {
            stType: 5, // FULLNAME，使用全路径名标识，其他标识参数无效
            spaceTime: pjtMngSTFullPath // 目标页面的时空属性，和sTType配合使用
        }
        SetRunInfo(runInfo, async function(resData) {
            if (0 === resData.ret) {

                let res = await Call(PARAM_PUBLIC, input);

                try {
                    if (0 !== res.ret) {
                        let errormsg = "请求发送失败！请检查后台服务是否运行正常";
                        _Infor(errormsg, "error");
                        console.log("-E- " + errormsg + "，ret:", res.ret);
                        return resolve(-1);
                    }

                    if (res.errorcodes) {
                        for (let i = 0; i < res.errorcodes.length; i++) {
                            let res_errorcode = res.errorcodes[i];
                            if (0 !== res_errorcode) {
                                _Infor("查询失败！", "error");
                                console.log("-E- IQueryRepoPacketsList()接口错误，errorCode:", res_errorcode);
                                return resolve(-1);
                            }
                        }
                    }

                    if (res.returndata) {
                        let res_returndata = res.returndata;
                        if (0 !== res_returndata.errorcode) {
                            _Infor("查询失败！", "error");
                            console.log(res_returndata.errormsg);
                            return resolve(-1);
                        }
                        // 解析数据
                        let repopktversionlist = res_returndata.repopktversionlist;
                        let repopktversion = 0;
                        for (let i = 0; i < repopktversionlist.length; i++) {
                            let repopktversionitem = repopktversionlist[i];
                            // 获取最新版本
                            if (repopktversionitem > puInstanceItem.current_version) {
                                if (repopktversionitem > repopktversion) {
                                    repopktversion = repopktversionitem;
                                }
                            }
                        }
                        return resolve(repopktversion);
                    }

                    return resolve(-1);
                } catch (e) {
                    _Infor("查询失败！", "error");
                    console.log(e);
                    return resolve(-1);
                }
            } else {
                let errormsg = resData.msg;
                _Infor(errormsg, "error");
                console.log("-E- " + errormsg + "，ret:", resData.ret);
                return resolve(-1);
            }
        });
    });
}

async function main() {

    let puInstanceItem = $Variable.selectPUInstancesList[0];

    // 查询当前节点最新数据包
    let repopktversion = await _QueryRepoPacketsList(puInstanceItem);
    if (-1 === repopktversion) {
        _Infor("查询当前节点最新数据包失败！", "error");
        return;
    } else if (0 === repopktversion) {
        _Infor("当前节点不存在最新数据包！", "error");
        return;
    }

    $Variable.commandType = "更新";

    // 打开遮罩层
    let options = {
        text: `${$Variable.commandType}中，请等待...`,
        background: 'rgba(30, 28, 28, 0.5)'
    };
    let loadItem = ShowLoading(options);

    // 更新生产单元实例
    let retCode = await _UpdatePUInstance(puInstanceItem, repopktversion);
    if (0 !== retCode) {
        _Infor(`${$Variable.commandType}失败！`, "error");
    } else {
        _Infor(`${$Variable.commandType}成功！`, "success");
    }

    // 关闭遮罩层
    loadItem();
    $Variable.bClickButton = false;
    // 触发执行刷新生产单元实例信息函数
    $Variable.queryPUInstancesInfo = !$Variable.queryPUInstancesInfo;

    return;
}

main();
