ensure_real_tab()
for i in range(25):
    wait(1)
    print('POLL', i, js(r'''
function collectFrames(){const frames=[];function walk(win,path){let doc;try{doc=win.document;}catch(e){return;}frames.push({win,path,href:String(win.location.href)});Array.from(doc.querySelectorAll('iframe')).forEach((f,i)=>walk(f.contentWindow,path+'.'+i));}walk(window,'top');return frames;}
const hit=collectFrames().find(f=>/\/worker-space\/index\.html/.test(f.href));
const doc=hit.win.document;
const body=(doc.body&&doc.body.innerText||'');
const snippets=[];
['onCreate.QueryAssessmentRecords','queryrecords-param-driven','resultText','strmapPara','QUERY_FAILED','FATAL','ERROR','ret'].forEach(k=>{const idx=body.indexOf(k); if(idx>=0) snippets.push({k, idx, text:body.slice(Math.max(0,idx-200), idx+800)});});
return {hasStart:!!doc.querySelector('.wos-editor-debug-start'), hasStop:!!doc.querySelector('.wos-editor-debug-stop'), hasContinue:!!doc.querySelector('.debug-continue-run'), hasStep:!!doc.querySelector('.debug-step-over'), hasInterrupt:!!doc.querySelector('.debug-interrupt-line'), hasResultText:body.includes('resultText'), hasStrmapPara:body.includes('strmapPara'), snippets, text:body.slice(0,1800)};
'''))
