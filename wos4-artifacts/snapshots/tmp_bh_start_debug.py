ensure_real_tab()
print('START', js(r'''
function collectFrames(){const frames=[];function walk(win,path,chain){let doc;try{doc=win.document;}catch(e){return;}frames.push({win,path,href:String(win.location.href),chain});Array.from(doc.querySelectorAll('iframe')).forEach((f,i)=>walk(f.contentWindow,path+'.'+i,chain.concat(f)));}walk(window,'top',[]);return frames;}
const hit=collectFrames().find(f=>/\/worker-space\/index\.html/.test(f.href));
const doc=hit.win.document;
const btn=doc.querySelector('.wos-editor-debug-start');
if(!btn) return {ok:false,error:'start missing'};
btn.click();
return {ok:true, clicked:true};
'''))
for i in range(18):
    wait(1)
    print('POLL', i, js(r'''
function collectFrames(){const frames=[];function walk(win,path){let doc;try{doc=win.document;}catch(e){return;}frames.push({win,path,href:String(win.location.href)});Array.from(doc.querySelectorAll('iframe')).forEach((f,i)=>walk(f.contentWindow,path+'.'+i));}walk(window,'top');return frames;}
const hit=collectFrames().find(f=>/\/worker-space\/index\.html/.test(f.href));
const doc=hit.win.document;
const body=(doc.body&&doc.body.innerText||'');
const vars=body.includes('resultText') || body.includes('strmapPara');
return {hasStart:!!doc.querySelector('.wos-editor-debug-start'), hasStop:!!doc.querySelector('.wos-editor-debug-stop'), hasVars:vars, hasCompileSuccess:body.includes('????')||body.includes('compile'), hasQueryTrace:body.includes('onCreate.QueryAssessmentRecords')||body.includes('queryrecords-param-driven'), errText:(body.match(/FATAL|ERROR|QUERY_FAILED|??|??|??|ret[^\n]{0,50}/g)||[]).slice(0,10), text:body.slice(0,2500)};
'''))
