ensure_real_tab()
res = js(r'''
async function main(){
  function collectFrames(){const frames=[];function walk(win,path){let doc;try{doc=win.document;}catch(e){return;}frames.push({win,path,href:String(win.location.href)});Array.from(doc.querySelectorAll('iframe')).forEach((f,i)=>walk(f.contentWindow,path+'.'+i));}walk(window,'top');return frames;}
  const hit=collectFrames().find(f=>/\/worker-space\/index\.html/.test(f.href));
  const win=hit.win;
  const mod=await win.Function("return import('/worker-space/js/index.1780642363899.js')")();
  const me=mod.aT, Ke=mod.aV, de=mod.E, ln=mod.aW;
  const modelId='1441151880758560281';
  const input={modelType:de.TYPE_FUNCTIONUNITMODEL, identifierType:1, modelId:modelId, names:['onCreate','QueryAssessmentRecords'], returnfields:['$script','inputparam','returntype','name']};
  const req={param: me({type:de.TYPE_FUNCTION, areaid:0},{type:'int32Value',areaid:'int32Value'}), input: me(input,{modelType:'int32Value',identifierType:'int32Value',modelId:'uint64Value',names:'stringArrayValue',returnfields:'stringArrayValue'})};
  const out={}; const r=await Ke('Query', req, out);
  return {ret:r&&r.ret, raw:r, out, decoded: ln ? ln(out) : null};
}
return main();
''')
print(res)
