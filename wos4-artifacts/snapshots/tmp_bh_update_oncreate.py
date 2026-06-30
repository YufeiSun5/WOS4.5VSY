ensure_real_tab()
res = js(r'''
async function main(){
  function collectFrames(){const frames=[];function walk(win,path){let doc;try{doc=win.document;}catch(e){return;}frames.push({win,path,href:String(win.location.href)});Array.from(doc.querySelectorAll('iframe')).forEach((f,i)=>walk(f.contentWindow,path+'.'+i));}walk(window,'top');return frames;}
  const hit=collectFrames().find(f=>/\/worker-space\/index\.html/.test(f.href));
  if(!hit) return {ok:false,error:'worker missing'};
  const win=hit.win;
  const mod=await win.Function("return import('/worker-space/js/index.1780642363899.js')")();
  const me=mod.aT, St=mod.aU, Ke=mod.aV, de=mod.E, io=mod.b2;
  const modelId='1441151880758560281';
  const scriptText = `stringMap<var> strmapPara;
string resultText;

strmapPara["spaceTimeGuid"] = "aba6cf7a-0715-4966-8eaf-0f448eba7bc9";
strmapPara["pageNo"] = (int32)1;
strmapPara["pageSize"] = (int32)10;
strmapPara["status"] = "created_by_frontend";
strmapPara["startTime"] = "2020-01-01 00:00:00";
strmapPara["endTime"] = "2020-01-31 00:00:00";

Trace(2, "onCreate.QueryAssessmentRecords.params", strmapPara);
resultText = QueryAssessmentRecords(strmapPara);
Trace(2, "onCreate.QueryAssessmentRecords.result", resultText);
return resultText;`;
  const req={
    param: me({type:de.TYPE_FUNCTION, areaid:0},{type:'int32Value',areaid:'int32Value'}),
    input: me({names:['onCreate'], modelType:de.TYPE_FUNCTIONUNITMODEL, identifierType:1, modelId:modelId, ...St([me({$script:scriptText}, io)])}, {names:'stringArrayValue', modelType:'int32Value', identifierType:'int32Value', modelId:'uint64Value', version:'int32Value', datafields:'stringArrayValue', datavalues:'valueArray2DValue'})
  };
  const r=await Ke('Update', req);
  return {ok:true, updateRet:r&&r.ret, raw:r, scriptLength:scriptText.length};
}
return main();
''')
print(res)
