
(function(){
  var PAL_ST = 'aba6cf7a-0715-4966-8eaf-0f448eba7bc9';
  var PAL_DEV = 'PalimpsestBack_0626R2';
  var PAL_APP = 'PalimpsestBackend_CUSTOMFUNC_CUSTOMFUNC@PalimpsestBack_0626R2';
  function getMgr(ctx){ return ctx && (ctx.KMComponentsMng || (ctx.$parent && ctx.$parent.KMComponentsMng)); }
  function getKids(ctx){ var mgr = getMgr(ctx); return mgr && (mgr.$Children || mgr['$'+'Children']) || {}; }
  function component(ctx,name){ var mgr=getMgr(ctx); if(mgr && typeof mgr.get==='function'){ var direct=mgr.get(name); if(direct) return direct; var pv=mgr.get('PageView'); if(pv && pv.KMComponentsMng && typeof pv.KMComponentsMng.get==='function'){ var viaPage=pv.KMComponentsMng.get(name); if(viaPage) return viaPage; } } var kids=mgr && (mgr.$Children || mgr['$'+'Children']) || {}; if(kids && kids[name]) return kids[name]; return null; }
  function getTable(ctx){
    var table = component(ctx,'pal_assessment_table');
    if(table && table.propData && table.propData.UIName === 'pal_assessment_table') return table;
    var doc = null;
    try { doc = (ctx && ctx.$el && ctx.$el.ownerDocument) || window.document; } catch(e) { doc = window.document; }
    try {
      var el = doc && doc.querySelector && doc.querySelector('.pal_assessment_table');
      if(el && el.__vue__) return el.__vue__;
    } catch(e) {}
    return table;
  }
  function getButton(ctx){ return component(ctx,'pal_query_button'); }
  function columns(){ return [{"prop":"name","label":"记录ID","minWidth":"170","align":"center","type":"","columnKey":"","fixed":false},{"prop":"studentId","label":"学号","minWidth":"120","align":"center","type":"","columnKey":"","fixed":false},{"prop":"dept","label":"批次","minWidth":"90","align":"center","type":"","columnKey":"","fixed":false},{"prop":"mentor","label":"导师","minWidth":"90","align":"center","type":"","columnKey":"","fixed":false},{"prop":"professional","label":"专业能力","minWidth":"85","align":"center","type":"","columnKey":"","fixed":false},{"prop":"attitude","label":"工作态度","minWidth":"85","align":"center","type":"","columnKey":"","fixed":false},{"prop":"task","label":"任务完成","minWidth":"85","align":"center","type":"","columnKey":"","fixed":false},{"prop":"score","label":"综合评分","minWidth":"85","align":"center","type":"","columnKey":"","fixed":false},{"prop":"status","label":"状态","minWidth":"118","align":"center","type":"","columnKey":"","fixed":false},{"prop":"updated","label":"更新时间","minWidth":"145","align":"center","type":"","columnKey":"","fixed":false},{"prop":"actions","label":"操作","minWidth":"240","align":"center","type":"","columnKey":"","fixed":false}]; }
  function cfg(rows){ return {border:false,fit:true,showHeader:true,emptyText:'请先查询真实数据',pagination:true,pageSize:10,currentPage:1,columns:columns(),totalData:rows || []}; }
  function setRows(table, rows){
    rows = rows || [];
    if(!table) return;
    var copy = rows.slice ? rows.slice() : rows;
    if(table.propData){
      table.propData.totalData = rows;
      table.propData.data = rows;
      table.propData.totalLength = rows.length;
    }
    table.totalData = rows;
    table.cacheTotalData = copy;
    table.tableDataCopy = copy;
    if(typeof table.SetData === 'function') table.SetData(rows);
    else if(table.table) table.table(cfg(rows));
    if(table.$forceUpdate) table.$forceUpdate();
    if(table.DoLayout) table.DoLayout();
    if(table.$nextTick) table.$nextTick(function(){ if(table.$forceUpdate) table.$forceUpdate(); if(table.DoLayout) table.DoLayout(); });
    try { window.__palLastRender = { ok:true, rows:rows.length, tableName:table.propData && table.propData.UIName, at:new Date().toISOString() }; } catch(e) {}
  }
  function val(x){
    if(x && typeof x === 'object' && Array.isArray(x.values)) return val(x.values[0]);
    if(x && typeof x === 'object' && x.utcTime) return x.utcTime;
    if(x && typeof x === 'object' && x.stringValue != null) return x.stringValue;
    if(x && typeof x === 'object' && x.uint64Value != null) return String(x.uint64Value);
    if(x && typeof x === 'object' && x.int64Value != null) return String(x.int64Value);
    if(x && typeof x === 'object' && x.int32Value != null) return String(x.int32Value);
    if(x && typeof x === 'object' && x.doubleValue != null) return String(x.doubleValue);
    if(x && typeof x === 'object' && x.boolValue != null) return String(x.boolValue);
    if(x && typeof x === 'object' && x.dateTimeValue){
      var d=x.dateTimeValue;
      return [d.year,d.month,d.day].join('-')+' '+[d.hour,d.minute,d.second].join(':');
    }
    if(x == null) return '';
    return String(x);
  }
  function parsePayload(r){ var payload = r && r.returndata; if(typeof payload === 'string') { try { payload = JSON.parse(payload); } catch(e) { payload = null; } } return payload; }
  function rowsFromResult(r){
    var rawText = r && typeof r.returndata === 'string' ? r.returndata : '';
    var exactRecordIDs = rawText.match(/\b216172782113783\d+\b/g) || [];
    var payload = parsePayload(r);
    var ds = payload && payload.map && payload.map.data && payload.map.data.map && payload.map.data.map.output && payload.map.data.map.output.map && payload.map.data.map.output.map.returndatas && payload.map.data.map.output.map.returndatas.elements && payload.map.data.map.output.map.returndatas.elements[0];
    var cols = ds && ds.colNames || []; var values = ds && ds.rowValues || [];
    function get(row,name){ var i=cols.indexOf(name); return i>=0 ? row[i] : ''; }
    return values.map(function(row,idx){
      var updated = val(get(row,'updated_at')).replace('.0.0','');
      var fieldRecordID = val(get(row,'$recordID'));
      var recordID = exactRecordIDs[idx] || fieldRecordID || '';
      return { name:val(get(row,'id')), studentId:val(get(row,'student_id')), dept:val(get(row,'batch_id')), mentor:val(get(row,'mentor_id')), professional:val(get(row,'professional_score')), attitude:val(get(row,'attitude_score')), task:val(get(row,'task_score')), score:val(get(row,'total_score')), status:val(get(row,'status')), updated:updated, recordID:recordID, teamwork:val(get(row,'teamwork_score')), innovation:val(get(row,'innovation_score')), comment:val(get(row,'comment')), actions:'查看   评分   编辑   更多' };
    });
  }
  function apiRef(name){
    var w = window;
    for(var i = 0; w && i < 8; i++){
      if(typeof w[name] !== 'undefined') return { win: w, value: w[name] };
      if(w === w.parent) break;
      w = w.parent;
    }
    return { win: window, value: undefined };
  }
  function sm(items){
    var StringMapCtor = apiRef('StringMap').value;
    if(!StringMapCtor) throw new Error('StringMap is not defined');
    var m = new StringMapCtor({});
    Object.keys(items || {}).forEach(function(k){ var it = items[k]; if(Array.isArray(it)) m._insert(k, it[0], it[1]); else m._insert(k, it, 'string'); });
    return m;
  }
  function backend(func, params){
    return new Promise(function(resolve, reject){
      var callApi = apiRef('Call');
      var StringMapCtor = apiRef('StringMap').value;
      var VariantCtor = apiRef('Variant').value;
      var cloudApi = apiRef('getLocalCloudID');
      var setRunApi = apiRef('SetRunInfo');
      if(typeof callApi.value !== 'function') return reject(new Error('Call is not defined'));
      if(!StringMapCtor) return reject(new Error('StringMap is not defined'));
      if(!VariantCtor) return reject(new Error('Variant is not defined'));
      function runCall(changeRes){
        callApi.value.call(
          callApi.win,
          new StringMapCtor({type:21001, cloudID:typeof cloudApi.value === 'function' ? cloudApi.value.call(cloudApi.win) : 1, areaID:0, timeout:10000}),
          new StringMapCtor({identifierType:2, name:PAL_APP, funcname:func, params:[new VariantCtor(sm(params || {}))]})
        ).then(function(r){ r.__changeRes = changeRes || null; resolve(r); }).catch(reject);
      }
      if(typeof setRunApi.value === 'function') setRunApi.value.call(setRunApi.win, {stType:4, spaceTime:PAL_ST, devName:PAL_DEV}, runCall);
      else runCall(null);
    });
  }
  function htmlEscape(v){ return String(v == null ? '' : v).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function install(win, ctx){
    win.__palShowDialog = function(title, body, actions){
      var old = win.document.getElementById('pal-runtime-dialog'); if(old) old.remove();
      var wrap = win.document.createElement('div'); wrap.id='pal-runtime-dialog';
      wrap.style.cssText='position:fixed;inset:0;z-index:999999;background:rgba(15,23,42,.28);display:flex;align-items:center;justify-content:center;font-family:Arial,"Microsoft YaHei",sans-serif;';
      var box = win.document.createElement('div'); box.style.cssText='width:520px;max-width:calc(100vw - 40px);background:#fff;border:1px solid #dbe3ef;box-shadow:0 18px 60px rgba(15,23,42,.22);border-radius:8px;overflow:hidden;';
      var head = win.document.createElement('div'); head.style.cssText='height:52px;display:flex;align-items:center;justify-content:space-between;padding:0 18px;border-bottom:1px solid #e5eaf2;font-weight:700;color:#0f172a;font-size:16px;'; head.innerHTML='<span>'+title+'</span>';
      var close = win.document.createElement('button'); close.textContent='×'; close.style.cssText='border:0;background:transparent;font-size:22px;color:#64748b;cursor:pointer;'; close.onclick=function(){wrap.remove();}; head.appendChild(close);
      var content = win.document.createElement('div'); content.style.cssText='padding:16px 18px;color:#334155;font-size:13px;line-height:1.7;'; if(typeof body==='string') content.innerHTML=body; else content.appendChild(body);
      var foot = win.document.createElement('div'); foot.style.cssText='padding:12px 18px;border-top:1px solid #e5eaf2;display:flex;gap:10px;justify-content:flex-end;background:#f8fafc;';
      (actions || [{text:'关闭'}]).forEach(function(a){ var b=win.document.createElement('button'); b.textContent=a.text; b.style.cssText='min-width:82px;height:34px;border-radius:4px;border:1px solid '+(a.primary?'#2563eb':'#cfd8e3')+';background:'+(a.primary?'#2563eb':'#fff')+';color:'+(a.primary?'#fff':'#334155')+';cursor:pointer;font-weight:600;'; b.onclick=function(){ if(a.click) a.click(wrap); else wrap.remove(); }; foot.appendChild(b); });
      box.appendChild(head); box.appendChild(content); box.appendChild(foot); wrap.appendChild(box); win.document.body.appendChild(wrap); return wrap;
    };
    win.__palShowToast = function(text){ var old=win.document.getElementById('pal-runtime-toast'); if(old) old.remove(); var t=win.document.createElement('div'); t.id='pal-runtime-toast'; t.textContent=text; t.style.cssText='position:fixed;right:28px;top:24px;z-index:1000000;background:#0f172a;color:#fff;padding:10px 14px;border-radius:4px;box-shadow:0 8px 24px rgba(15,23,42,.25);font-size:13px;'; win.document.body.appendChild(t); setTimeout(function(){ if(t.parentNode) t.remove(); }, 2600); };
    function patchRow(row, patch){
      if(!row) return null;
      var rows = win.__palRows || [];
      var id = String(row.recordID || '');
      var latest = rows.find(function(r){ return String(r.recordID || '') === id; }) || row;
      Object.keys(patch || {}).forEach(function(k){ latest[k] = patch[k]; });
      if(latest !== row) Object.keys(patch || {}).forEach(function(k){ row[k] = patch[k]; });
      return latest;
    }
    function optimisticRender(message){
      setRows(getTable(ctx), win.__palRows || []);
      setTimeout(function(){ decorateActions(win.__palRows || []); }, 40);
      setTimeout(function(){ decorateActions(win.__palRows || []); }, 260);
      if(message) win.__palShowToast(message);
    }
    function delayedVerify(message, delayMs){
      setTimeout(function(){ win.__palRefreshAssessmentRows(message || '回读验证...'); }, delayMs || 1600);
    }
    function latestRow(row){
      if(!row) return row;
      var id = String(row.recordID || '');
      return (win.__palRows || []).find(function(r){ return String(r.recordID || '') === id; }) || row;
    }
    function ensureAddButton(){
      var old = win.document.getElementById('pal-add-record-button');
      if(old) old.remove();
    }
    win.__palRefreshAssessmentRows = function(buttonText){
      var table = getTable(ctx); var btn = getButton(ctx); if(btn && btn.button) btn.button({text: buttonText || '查询中...'});
      return backend('QueryAssessmentRecords', {action:['query','string'], pageNo:[1,'int32'], pageSize:[20,'int32'], keyword:['','string']}).then(function(r){ if(r && r.ret !== 0) throw new Error('ret='+r.ret); var rows=rowsFromResult(r); win.__palRows=rows; setRows(table, rows); if(btn && btn.button) btn.button({text:'查询真实数据 / '+rows.length+'条'}); win.__palLastAssessmentQuery={ret:r.ret, rows:rows, at:new Date().toISOString()}; install(win, ctx); ensureAddButton(); setTimeout(function(){ decorateActions(rows); }, 80); setTimeout(function(){ decorateActions(rows); }, 420); return rows; }).catch(function(err){ if(btn && btn.button) btn.button({text:'查询失败'}); win.__palLastAssessmentQuery={error:String(err), at:new Date().toISOString()}; setRows(table, [{name:'CALL_FAIL', studentId:'ret=-210133', dept:'backend app missing', mentor:'PalimpsestBack_0626R2', professional:'-', attitude:'-', task:'-', score:'-', status:'查询失败', updated:new Date().toLocaleString(), actions:'查看   评分   编辑   更多'}]); win.__palShowToast('查询失败：'+String(err).slice(0,80)); });
    };
    win.__palTableHandleAction = function(e){
      var rows = win.__palRows || [];
      var row = e && (e.row || e.rowData || e.data || e.currentRow || e.record);
      if(!row && e && typeof e.rowIndex === 'number') row = rows[e.rowIndex];
      if(!row && rows.length === 1) row = rows[0];
      if(!row && rows.length) row = rows[0];
      if(!row){ win.__palShowToast('请先查询真实数据'); return; }
      showMenu(latestRow(row), e || {});
    };
    function showMenu(row, e){
      row = latestRow(row);
      var old = win.document.getElementById('pal-action-menu'); if(old) old.remove();
      var menu = win.document.createElement('div'); menu.id='pal-action-menu';
      var x = e.clientX || (e.event && e.event.clientX) || Math.min(win.innerWidth-180, win.innerWidth*0.78);
      var y = e.clientY || (e.event && e.event.clientY) || Math.min(win.innerHeight-220, win.innerHeight*0.62);
      menu.style.cssText='position:fixed;left:'+Math.max(8,Math.min(x,win.innerWidth-190))+'px;top:'+Math.max(8,Math.min(y,win.innerHeight-230))+'px;z-index:1000000;width:168px;background:#fff;border:1px solid #dbe3ef;border-radius:6px;box-shadow:0 12px 36px rgba(15,23,42,.18);padding:6px;font-size:13px;color:#334155;';
      function item(text, fn){ var b=win.document.createElement('button'); b.textContent=text; b.style.cssText='display:block;width:100%;height:32px;text-align:left;padding:0 10px;border:0;background:#fff;border-radius:4px;cursor:pointer;color:#1e293b;'; b.onmouseenter=function(){b.style.background='#eff6ff';}; b.onmouseleave=function(){b.style.background='#fff';}; b.onclick=function(){ menu.remove(); fn(row); }; menu.appendChild(b); }
      item('查看真实记录', viewRow); item('编辑状态/评语', editRow); item('提交评分', scoreRow); item('删除记录', deleteRow); item('重新查询', function(){ win.__palRefreshAssessmentRows(); });
      win.document.body.appendChild(menu);
      setTimeout(function(){ win.document.addEventListener('click', function closer(ev){ if(!menu.contains(ev.target)){ menu.remove(); win.document.removeEventListener('click', closer, true); } }, true); }, 0);
    }
    function infoHtml(row){ row = latestRow(row); return '<div><b>记录ID：</b>'+htmlEscape(row.name)+'</div><div><b>recordID：</b>'+htmlEscape(row.recordID)+'</div><div><b>学号：</b>'+htmlEscape(row.studentId)+'</div><div><b>批次：</b>'+htmlEscape(row.dept)+'</div><div><b>导师：</b>'+htmlEscape(row.mentor)+'</div><div><b>综合评分：</b>'+htmlEscape(row.score)+'</div><div><b>状态：</b>'+htmlEscape(row.status)+'</div><div><b>更新时间：</b>'+htmlEscape(row.updated)+'</div><div><b>评语：</b>'+htmlEscape(row.comment||'')+'</div>'; }
    function viewRow(row){ row = latestRow(row); win.__palShowDialog('查看考核记录', infoHtml(row), [{text:'关闭'}]); win.__palLastAction={type:'view', row:row}; }
    function editRow(row){
      row = latestRow(row);
      var body = win.document.createElement('div'); body.innerHTML='<label>状态</label><input id="pal-edit-status" style="width:100%;height:34px;margin:6px 0 12px;border:1px solid #cfd8e3;border-radius:4px;padding:0 8px;" value="'+htmlEscape(row.status||'updated_by_frontend')+'"><label>评语</label><textarea id="pal-edit-comment" style="width:100%;height:82px;margin-top:6px;border:1px solid #cfd8e3;border-radius:4px;padding:8px;resize:none;">'+htmlEscape(row.comment||'frontend edit from PalimpsestContent_82')+'</textarea>';
      win.__palShowDialog('编辑真实记录', body, [{text:'取消'}, {text:'提交修改', primary:true, click:function(wrap){ var status=body.querySelector('#pal-edit-status').value; var comment=body.querySelector('#pal-edit-comment').value; var latest=patchRow(row,{status:status,comment:comment}); win.__palLastAction={type:'edit-optimistic', row:latest}; wrap.remove(); optimisticRender('已先更新本地表格，正在写入后端...'); backend('UpdateAssessmentRecord', {recordID:[String(row.recordID),'uint64'], status:[status,'string'], comment:[comment,'string']}).then(function(r){ win.__palLastAction={type:'edit', ret:r.ret, row:latest}; win.__palShowToast('修改返回 ret='+r.ret+'，稍后回读验证'); delayedVerify('修改后回读验证...', 1800); }).catch(function(err){ win.__palShowToast('修改失败：'+String(err).slice(0,80)); delayedVerify('修改失败后回读...', 1000); }); }}]);
    }
    function scoreRow(row){
      row = latestRow(row);
      var body = win.document.createElement('div');
      body.innerHTML=['professional:专业能力','attitude:工作态度','task:任务完成','teamwork:团队协作','innovation:创新能力'].map(function(x){ var p=x.split(':'); var v=row[p[0]] || (p[0]==='teamwork'?'10':p[0]==='innovation'?'10':'0'); return '<label>'+p[1]+'</label><input data-k="'+p[0]+'" type="number" step="0.5" style="width:100%;height:32px;margin:4px 0 8px;border:1px solid #cfd8e3;border-radius:4px;padding:0 8px;" value="'+v+'">'; }).join('') + '<label>评语</label><textarea id="pal-score-comment" style="width:100%;height:66px;margin-top:4px;border:1px solid #cfd8e3;border-radius:4px;padding:8px;resize:none;">frontend score from PalimpsestContent_82</textarea>';
      win.__palShowDialog('提交真实评分', body, [{text:'取消'}, {text:'提交评分', primary:true, click:function(wrap){ var m={recordID:[String(row.recordID),'uint64'], comment:[body.querySelector('#pal-score-comment').value,'string']}; Array.from(body.querySelectorAll('input[data-k]')).forEach(function(inp){ var key=inp.getAttribute('data-k'); var field = key==='professional'?'professional_score':key==='attitude'?'attitude_score':key==='task'?'task_score':key==='teamwork'?'teamwork_score':'innovation_score'; m[field]=[Number(inp.value || 0),'double']; }); backend('SubmitAssessmentScore', m).then(function(r){ win.__palLastAction={type:'score', ret:r.ret, row:row}; wrap.remove(); win.__palShowToast('评分返回 ret='+r.ret); win.__palRefreshAssessmentRows('评分后刷新...'); }).catch(function(err){ win.__palShowToast('评分失败：'+String(err).slice(0,80)); }); }}]);
    }
    function deleteRow(row){ row = latestRow(row); win.__palShowDialog('删除真实记录', '<div>确认删除 <b>'+htmlEscape(row.name)+'</b>？<br>recordID: '+htmlEscape(row.recordID)+'</div>', [{text:'取消'}, {text:'确认删除', primary:true, click:function(wrap){ backend('DeleteAssessmentRecord', {recordID:[String(row.recordID),'uint64']}).then(function(r){ win.__palLastAction={type:'delete', ret:r.ret, row:row}; wrap.remove(); win.__palShowToast('删除返回 ret='+r.ret); win.__palRefreshAssessmentRows('删除后刷新...'); }).catch(function(err){ win.__palShowToast('删除失败：'+String(err).slice(0,80)); }); }}]); }
    function addRow(){
      var stamp = new Date().toISOString().replace(/[-:TZ.]/g,'').slice(0,14);
      var body = win.document.createElement('div');
      body.innerHTML =
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px 12px;">'+
        '<label>业务ID<input data-k="id" style="width:100%;height:32px;margin-top:4px;border:1px solid #cfd8e3;border-radius:4px;padding:0 8px;" value="PAL_UI_'+stamp+'"></label>'+
        '<label>学号<input data-k="student_id" style="width:100%;height:32px;margin-top:4px;border:1px solid #cfd8e3;border-radius:4px;padding:0 8px;" value="S'+stamp.slice(2)+'"></label>'+
        '<label>批次<input data-k="batch_id" style="width:100%;height:32px;margin-top:4px;border:1px solid #cfd8e3;border-radius:4px;padding:0 8px;" value="2024Q2"></label>'+
        '<label>导师<input data-k="mentor_id" style="width:100%;height:32px;margin-top:4px;border:1px solid #cfd8e3;border-radius:4px;padding:0 8px;" value="UI_MENTOR"></label>'+
        '<label>专业能力<input data-k="professional_score" type="number" step="0.5" style="width:100%;height:32px;margin-top:4px;border:1px solid #cfd8e3;border-radius:4px;padding:0 8px;" value="38"></label>'+
        '<label>工作态度<input data-k="attitude_score" type="number" step="0.5" style="width:100%;height:32px;margin-top:4px;border:1px solid #cfd8e3;border-radius:4px;padding:0 8px;" value="18"></label>'+
        '<label>任务完成<input data-k="task_score" type="number" step="0.5" style="width:100%;height:32px;margin-top:4px;border:1px solid #cfd8e3;border-radius:4px;padding:0 8px;" value="18"></label>'+
        '<label>状态<input data-k="status" style="width:100%;height:32px;margin-top:4px;border:1px solid #cfd8e3;border-radius:4px;padding:0 8px;" value="created_by_frontend"></label>'+
        '</div><label style="display:block;margin-top:10px;">评语<textarea data-k="comment" style="width:100%;height:64px;margin-top:4px;border:1px solid #cfd8e3;border-radius:4px;padding:8px;resize:none;">created from PalimpsestContent_82 add dialog</textarea></label>';
      win.__palShowDialog('添加考核记录', body, [{text:'取消'}, {text:'真实新增', primary:true, click:function(wrap){
        var data = {};
        Array.from(body.querySelectorAll('[data-k]')).forEach(function(el){ data[el.getAttribute('data-k')] = el.value; });
        var total = Number(data.professional_score||0) + Number(data.attitude_score||0) + Number(data.task_score||0) + 9 + 9;
        var tempRow = {name:data.id, studentId:data.student_id, dept:data.batch_id, mentor:data.mentor_id, professional:String(data.professional_score||''), attitude:String(data.attitude_score||''), task:String(data.task_score||''), teamwork:'9', innovation:'9', score:String(total), status:data.status || 'creating', updated:new Date().toISOString().slice(0,19).replace('T',' '), recordID:'pending-'+stamp, comment:data.comment, actions:'查看   评分   编辑   更多'};
        win.__palRows = win.__palRows || [];
        win.__palRows.unshift(tempRow);
        win.__palLastAction={type:'create-optimistic', row:tempRow};
        wrap.remove();
        optimisticRender('已先添加到本地表格，正在写入后端...');
        backend('CreateAssessmentRecord', {
          id:[data.id,'string'], student_id:[data.student_id,'string'], batch_id:[data.batch_id,'string'], mentor_id:[data.mentor_id,'string'],
          professional_score:[Number(data.professional_score||0),'double'], attitude_score:[Number(data.attitude_score||0),'double'], task_score:[Number(data.task_score||0),'double'],
          teamwork_score:[9,'double'], innovation_score:[9,'double'], total_score:[total,'double'], status:[data.status,'string'], comment:[data.comment,'string'], deleted:[false,'bool']
        }).then(function(r){ win.__palLastAction={type:'create', ret:r.ret, data:data, result:r, optimistic:tempRow}; win.__palShowToast('新增返回 ret='+r.ret+'，稍后回读验证'); delayedVerify('新增后回读验证...', 2000); }).catch(function(err){ win.__palShowToast('新增失败：'+String(err).slice(0,80)); delayedVerify('新增失败后回读...', 1000); });
      }}]);
    }
    function decorateActions(rows){
      rows = rows || win.__palRows || [];
      var trs = Array.from(win.document.querySelectorAll('.el-table__body-wrapper tbody tr,.el-table__body tbody tr'));
      trs.forEach(function(tr, idx){
        var row = rows[idx]; if(!row) return;
        var tds = Array.from(tr.querySelectorAll('td')); var td = tds[tds.length - 1]; if(!td) return;
        var box = td.querySelector('.cell') || td;
        if(box.getAttribute('data-pal-actions-ready') === row.recordID) return;
        box.setAttribute('data-pal-actions-ready', row.recordID || String(idx));
        box.innerHTML = '';
        box.style.cssText = 'display:flex;justify-content:center;align-items:center;gap:6px;white-space:nowrap;overflow:visible;';
        function btn(text, color, fn){
          var b = win.document.createElement('button');
          b.type = 'button'; b.textContent = text;
          b.style.cssText = 'height:26px;min-width:42px;padding:0 8px;border-radius:4px;border:1px solid '+color+';background:#fff;color:'+color+';font-size:12px;font-weight:600;cursor:pointer;line-height:24px;';
          b.onmouseenter = function(){ b.style.background = color; b.style.color = '#fff'; };
          b.onmouseleave = function(){ b.style.background = '#fff'; b.style.color = color; };
          b.onclick = function(ev){ ev.preventDefault(); ev.stopPropagation(); fn(row, b, ev); };
          box.appendChild(b);
        }
        btn('查看', '#2563eb', function(r){ viewRow(r); });
        btn('评分', '#16a34a', function(r){ scoreRow(r); });
        btn('编辑', '#7c3aed', function(r){ editRow(r); });
        btn('更多', '#475569', function(r,b){ var rr=b.getBoundingClientRect(); showMenu(r,{clientX:rr.left,clientY:rr.bottom+4}); });
      });
      win.__palLastActionDecorate = { rows: trs.length, dataRows: rows.length, at: new Date().toISOString() };
    }
    win.__palDecorateActionButtons = decorateActions;
    win.__palOpenAddAssessmentDialog = addRow;
    ensureAddButton();
  }
  install(window, this);
})();
window.__palRefreshAssessmentRows && window.__palRefreshAssessmentRows('查询中...');
