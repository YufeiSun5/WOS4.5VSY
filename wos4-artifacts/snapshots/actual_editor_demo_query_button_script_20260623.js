(async function() {
    debugger
    // 切换时空
    // let spacetimeid = $Variable.spacetimeGUID;
    const STTYPE_ID = 4; // 时空GUID
    let runInfo = {
        stType: STTYPE_ID,
        spaceTime: '4fa17a11-b923-4b36-b1e8-c39ca1bcf62c'
    };
    let changeRes = await changeSpace(runInfo);

    // 切换时空
    function changeSpace(runInfo) {
        return new Promise((resolve) => {
            SetRunInfo(runInfo, function(res) {
                resolve(res);
            });
        });
    }
    var page = this;
    var kids = this.KMComponentsMng && this.KMComponentsMng.$Children || {};

    function propOf(obj) {
        return obj && (obj._props && obj._props.propData || obj.propData || obj);
    }

    function byName(name) {
        var values = Object.values(kids);
        return values.find(function(v) {
            var pd = propOf(v) || {};
            return v && (v.UIName === name || v.name === name || pd.UIName === name || pd.name === name);
        });
    }

    function byProto(proto) {
        return Object.values(kids).find(function(v) {
            var pd = propOf(v) || {};
            return pd.prototypeName === proto;
        });
    }

    function readInput() {
        var input = byName('demo_filter_input') || byProto('ElementInput');
        try {
            if (input && input.getProperty) return String(input.getProperty('value') || '').trim();
        } catch (e) {}
        var pd = propOf(input) || {};
        return String(pd.value || '').trim();
    }

    function setButton(text) {
        var button = byName('demo_query_button') || byProto('ElementButton');
        if (button && typeof button.button === 'function') button.button({
            text: text
        });
        var pd = propOf(button);
        if (pd) pd.text = text;
    }

    function setTable(rows, columns) {
        var table = byName('demo_table') || byProto('ElementTable');
        var cfg = {
            border: true,
            fit: true,
            showHeader: true,
            emptyText: '\u6682\u65e0\u540e\u7aef\u8fd4\u56de\u6570\u636e',
            pagination: true,
            pageSize: 10,
            columns: columns,
            totalData: rows
        };
        if (table && typeof table.table === 'function') table.table(cfg);
        var pd = propOf(table);
        if (pd) pd.detailConfig = 'this.table(' + JSON.stringify(cfg) + ')';
    }

    function setChart(rows) {
        var chart = byName('demo_chart') || byProto('ElementChart');
        var option = {
            color: ['#2563eb'],
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                left: 44,
                right: 24,
                top: 36,
                bottom: 36
            },
            xAxis: {
                type: 'category',
                data: rows.map(function(r) {
                    return r.stationName || r.station || r.areaName || 'row';
                })
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                name: '\u6d41\u91cf',
                type: 'bar',
                data: rows.map(function(r) {
                    return Number(r.flowValue || r.flow || 0);
                })
            }]
        };
        if (chart && typeof chart.SetOption === 'function') chart.SetOption(option, true);
        var pd = propOf(chart);
        if (pd) pd.detailConfig = 'option=' + JSON.stringify(option);
    }

    function unwrap(value) {
        if (!value) return value;
        if (value.value !== undefined) return unwrap(value.value);
        if (value._value !== undefined) return unwrap(value._value);
        return value;
    }

    function listFromReturn(rd) {
        rd = unwrap(rd);
        if (!rd) return [];
        var list = rd.statisticsList || rd.rows || rd.data || rd.result || [];
        list = unwrap(list);
        if (!Array.isArray(list)) return [];
        return list.map(function(x) {
            return unwrap(x) || x;
        });
    }

    function normalizeRows(list) {
        return list.map(function(r, idx) {
            r = unwrap(r) || {};
            return {
                stationName: String(r.stationName || r.station || r['\u7ad9\u70b9'] || r['\u73ed\u6b21\u540d\u79f0'] || ('R' + (idx + 1))),
                areaName: String(r.areaName || r.area || r['\u533a\u57df'] || r['\u8f66\u95f4\u540d\u79f0'] || ''),
                statusText: String(r.statusText || r.status || r['\u72b6\u6001'] || r['\u73ed\u6b21\u7c7b\u578b'] || ''),
                flowValue: String(r.flowValue || r.flow || r['\u6d41\u91cf'] || r['\u8d77\u59cb\u65f6\u95f4'] || ''),
                pressureValue: String(r.pressureValue || r.pressure || r['\u538b\u529b'] || r['\u7ed3\u675f\u65f6\u95f4'] || '')
            };
        });
    }
    var columns = [{
            prop: 'stationName',
            label: '\u7ad9\u70b9',
            minWidth: '140',
            align: 'left'
        },
        {
            prop: 'areaName',
            label: '\u533a\u57df',
            minWidth: '110',
            align: 'center'
        },
        {
            prop: 'statusText',
            label: '\u72b6\u6001',
            minWidth: '110',
            align: 'center'
        },
        {
            prop: 'flowValue',
            label: '\u6d41\u91cf',
            minWidth: '100',
            align: 'right'
        },
        {
            prop: 'pressureValue',
            label: '\u538b\u529b',
            minWidth: '100',
            align: 'right'
        }
    ];
    var filter = readInput();
    setButton('\u540e\u53f0\u67e5\u8be2\u4e2d...');
    page.__lastBackendCall = {
        state: 'pending',
        filter: filter,
        startedAt: Date.now()
    };
    const CLOUDID = Number(location.href.split("GetFileContent")[1].split("/")[1]);
    // const IDENTIFIERTYPE_NAME = 2; // 对象的标识类型=使用名称标识
    // const FU_OBJECT_TYPE = 21001; // APP对象
    // const APP_NAME = 'DemoCrudBackend_CUSTOMFUNC@NadirBack'; // APP对象的名称
    // const FUNC_NAME = "QueryRecords";
    // const param = new StringMap({
    //     type: FU_OBJECT_TYPE,
    //     cloudID: CLOUDID
    // });

    // let areaID = 0;
    // if (undefined !== areaID) {
    //     param._insert("areaID", areaID, "int32");
    // }

    // let inParams = new StringMap({}); // 初始化查询/条件查询/下拉框选项 的入参
    // inParams._insert("filter", filter, "string");

    // let input = new StringMap({
    //     identifierType: IDENTIFIERTYPE_NAME,
    //     name: APP_NAME,
    //     funcname: FUNC_NAME,
    //     params: [new Variant(inParams)]
    //     // params: []
    // });

    // let res = await Call(param, input);
    // console.log(res);
    
    
    var callParam = new StringMap({
        type: 21001,
        // cloudID: (typeof getLocalCloudID === 'function' ? getLocalCloudID() : 107),
        cloudID: CLOUDID,
        areaID: 0,
        // timeout: 5000
    });
    let inParams = new StringMap({}); // 初始化查询/条件查询/下拉框选项 的入参
    inParams._insert("filter", filter, "string");
    var callInput = new StringMap({
        //   identifierType: 1,
        //   id: '5911255985900487006',
        identifierType: 2,
        name: 'DemoCrudBackend_CUSTOMFUNC@NadirBack',
        funcname: 'QueryRecords',
        params: [new Variant(inParams)]
        // params: [new Variant(new StringMap({
        //     filter: filter
        // }))]
    });
    Call(callParam, callInput).then(function(res) {
        page.__lastBackendCall = res;
        var ret = res && res.ret;
        var rd = res && (res.returnData || (res.output && (res.output.returndata || res.output.returnData)) || res.returndata);
        var rows = normalizeRows(listFromReturn(rd));
        if (ret !== 0 || rows.length === 0) {
            rows = [{
                stationName: ret === 0 ? 'EMPTY' : 'CALL_FAIL',
                areaName: 'ret=' + ret,
                statusText: JSON.stringify((res && (res.errorcodes || (res.output && res.output.errorcodes))) || []),
                flowValue: filter,
                pressureValue: String(Date.now())
            }];
        }
        setTable(rows, columns);
        setChart(rows);
        setButton(ret === 0 ? ('\u540e\u7aef\u8fd4\u56de(' + rows.length + ')') : ('backend fail / ' + ret));
    }).catch(function(err) {
        page.__lastBackendCallError = String(err && (err.stack || err.message || err));
        var rows = [{
            stationName: 'JS_ERROR',
            areaName: '',
            statusText: String(err),
            flowValue: filter,
            pressureValue: ''
        }];
        setTable(rows, columns);
        setChart(rows);
        setButton('backend error');
    });
})();
