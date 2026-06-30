(function(){
  var PAL_ST = 'aba6cf7a-0715-4966-8eaf-0f448eba7bc9';
  var PAL_DEV = 'PalimpsestBack_0626R2';
  var PAL_APP = 'PalimpsestBackend_CUSTOMFUNC_CUSTOMFUNC@PalimpsestBack_0626R2';

  function sm(items){
    var m = new StringMap({});
    Object.keys(items || {}).forEach(function(k){
      var it = items[k];
      if (Array.isArray(it)) m._insert(k, it[0], it[1]);
      else m._insert(k, it, 'string');
    });
    return m;
  }

  function backend(func, params){
    return new Promise(function(resolve, reject){
      SetRunInfo({stType:4, spaceTime:PAL_ST, devName:PAL_DEV}, function(changeRes){
        Call(
          new StringMap({type:21001, cloudID:getLocalCloudID(), areaID:0, timeout:10000}),
          new StringMap({identifierType:2, name:PAL_APP, funcname:func, params:[new Variant(sm(params || {}))]})
        ).then(function(r){
          r.__changeRes = changeRes;
          resolve(r);
        }).catch(reject);
      });
    });
  }

  function esc(v){
    return String(v == null ? '' : v).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function toast(text){
    var old = document.getElementById('pal-runtime-toast');
    if (old) old.remove();
    var t = document.createElement('div');
    t.id = 'pal-runtime-toast';
    t.textContent = text;
    t.style.cssText = 'position:fixed;right:28px;top:24px;z-index:1000000;background:#0f172a;color:#fff;padding:10px 14px;border-radius:4px;box-shadow:0 8px 24px rgba(15,23,42,.25);font-size:13px;';
    document.body.appendChild(t);
    setTimeout(function(){ if (t.parentNode) t.remove(); }, 2600);
  }

  function dialog(title, body, actions){
    var old = document.getElementById('pal-runtime-dialog');
    if (old) old.remove();
    var wrap = document.createElement('div');
    wrap.id = 'pal-runtime-dialog';
    wrap.style.cssText = 'position:fixed;inset:0;z-index:999999;background:rgba(15,23,42,.28);display:flex;align-items:center;justify-content:center;font-family:Arial,"Microsoft YaHei",sans-serif;';
    var box = document.createElement('div');
    box.style.cssText = 'width:560px;max-width:calc(100vw - 40px);background:#fff;border:1px solid #dbe3ef;box-shadow:0 18px 60px rgba(15,23,42,.22);border-radius:8px;overflow:hidden;';
    var head = document.createElement('div');
    head.style.cssText = 'height:52px;display:flex;align-items:center;justify-content:space-between;padding:0 18px;border-bottom:1px solid #e5eaf2;font-weight:700;color:#0f172a;font-size:16px;';
    head.innerHTML = '<span>' + esc(title) + '</span>';
    var close = document.createElement('button');
    close.textContent = '×';
    close.style.cssText = 'border:0;background:transparent;font-size:22px;color:#64748b;cursor:pointer;';
    close.onclick = function(){ wrap.remove(); };
    head.appendChild(close);
    var content = document.createElement('div');
    content.style.cssText = 'padding:16px 18px;color:#334155;font-size:13px;line-height:1.7;';
    content.appendChild(body);
    var foot = document.createElement('div');
    foot.style.cssText = 'padding:12px 18px;border-top:1px solid #e5eaf2;display:flex;gap:10px;justify-content:flex-end;background:#f8fafc;';
    (actions || []).forEach(function(a){
      var b = document.createElement('button');
      b.textContent = a.text;
      b.style.cssText = 'min-width:82px;height:34px;border-radius:4px;border:1px solid ' + (a.primary ? '#2563eb' : '#cfd8e3') + ';background:' + (a.primary ? '#2563eb' : '#fff') + ';color:' + (a.primary ? '#fff' : '#334155') + ';cursor:pointer;font-weight:600;';
      b.onclick = function(){ if (a.click) a.click(wrap); else wrap.remove(); };
      foot.appendChild(b);
    });
    box.appendChild(head);
    box.appendChild(content);
    box.appendChild(foot);
    wrap.appendChild(box);
    document.body.appendChild(wrap);
  }

  function tableVm(){
    var el = document.querySelector('.pal_assessment_table');
    return el && el.__vue__;
  }

  function renderLocalRow(row){
    var table = tableVm();
    window.__palRows = window.__palRows || [];
    window.__palRows.unshift(row);
    if (table) {
      if (table.propData) {
        table.propData.totalData = window.__palRows;
        table.propData.data = window.__palRows;
        table.propData.totalLength = window.__palRows.length;
      }
      if (typeof table.SetData === 'function') table.SetData(window.__palRows);
      if (table.$forceUpdate) table.$forceUpdate();
      if (table.DoLayout) table.DoLayout();
    }
    if (window.__palDecorateActionButtons) {
      setTimeout(function(){ window.__palDecorateActionButtons(window.__palRows); }, 80);
    }
  }

  function openAdd(){
    var stamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
    var body = document.createElement('div');
    body.innerHTML =
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px 12px;">' +
      '<label>业务ID<input data-k="id" style="width:100%;height:32px;margin-top:4px;border:1px solid #cfd8e3;border-radius:4px;padding:0 8px;" value="PAL_UI_' + stamp + '"></label>' +
      '<label>学号<input data-k="student_id" style="width:100%;height:32px;margin-top:4px;border:1px solid #cfd8e3;border-radius:4px;padding:0 8px;" value="S' + stamp.slice(2) + '"></label>' +
      '<label>批次<input data-k="batch_id" style="width:100%;height:32px;margin-top:4px;border:1px solid #cfd8e3;border-radius:4px;padding:0 8px;" value="2024Q2"></label>' +
      '<label>导师<input data-k="mentor_id" style="width:100%;height:32px;margin-top:4px;border:1px solid #cfd8e3;border-radius:4px;padding:0 8px;" value="UI_MENTOR"></label>' +
      '<label>专业能力<input data-k="professional_score" type="number" step="0.5" style="width:100%;height:32px;margin-top:4px;border:1px solid #cfd8e3;border-radius:4px;padding:0 8px;" value="38"></label>' +
      '<label>工作态度<input data-k="attitude_score" type="number" step="0.5" style="width:100%;height:32px;margin-top:4px;border:1px solid #cfd8e3;border-radius:4px;padding:0 8px;" value="18"></label>' +
      '<label>任务完成<input data-k="task_score" type="number" step="0.5" style="width:100%;height:32px;margin-top:4px;border:1px solid #cfd8e3;border-radius:4px;padding:0 8px;" value="18"></label>' +
      '<label>状态<input data-k="status" style="width:100%;height:32px;margin-top:4px;border:1px solid #cfd8e3;border-radius:4px;padding:0 8px;" value="created_by_frontend"></label>' +
      '</div><label style="display:block;margin-top:10px;">评语<textarea data-k="comment" style="width:100%;height:64px;margin-top:4px;border:1px solid #cfd8e3;border-radius:4px;padding:8px;resize:none;">created from PalimpsestContent_82 add dialog</textarea></label>';

    dialog('添加考核记录', body, [
      {text:'取消'},
      {text:'真实新增', primary:true, click:function(wrap){
        var data = {};
        Array.from(body.querySelectorAll('[data-k]')).forEach(function(el){
          data[el.getAttribute('data-k')] = el.value;
        });
        var total = Number(data.professional_score || 0) + Number(data.attitude_score || 0) + Number(data.task_score || 0) + 9 + 9;
        var row = {
          name:data.id,
          studentId:data.student_id,
          dept:data.batch_id,
          mentor:data.mentor_id,
          professional:String(data.professional_score || ''),
          attitude:String(data.attitude_score || ''),
          task:String(data.task_score || ''),
          teamwork:'9',
          innovation:'9',
          score:String(total),
          status:data.status || 'creating',
          updated:new Date().toISOString().slice(0,19).replace('T',' '),
          recordID:'pending-' + stamp,
          comment:data.comment,
          actions:'查看   评分   编辑   更多'
        };
        wrap.remove();
        renderLocalRow(row);
        toast('已先添加到本地表格，正在写入后端...');
        backend('CreateAssessmentRecord', {
          id:[data.id,'string'],
          student_id:[data.student_id,'string'],
          batch_id:[data.batch_id,'string'],
          mentor_id:[data.mentor_id,'string'],
          professional_score:[Number(data.professional_score || 0),'double'],
          attitude_score:[Number(data.attitude_score || 0),'double'],
          task_score:[Number(data.task_score || 0),'double'],
          teamwork_score:[9,'double'],
          innovation_score:[9,'double'],
          total_score:[total,'double'],
          status:[data.status,'string'],
          comment:[data.comment,'string'],
          deleted:[false,'bool']
        }).then(function(r){
          window.__palLastAction = {type:'create', ret:r.ret, data:data, result:r};
          toast('新增返回 ret=' + r.ret + '，稍后回读验证');
          setTimeout(function(){
            if (window.__palRefreshAssessmentRows) window.__palRefreshAssessmentRows('新增后回读验证...');
          }, 2000);
        }).catch(function(err){
          window.__palLastAction = {type:'create-error', error:String(err), data:data};
          toast('新增失败：' + String(err).slice(0, 80));
        });
      }}
    ]);
  }

  if (this && this.button) this.button({text:'新增'});
  openAdd();
}).call(this);
