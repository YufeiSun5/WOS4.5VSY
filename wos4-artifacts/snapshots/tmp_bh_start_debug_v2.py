ensure_real_tab()
print('START2', js(r'''
function collectFrames(){const frames=[];function walk(win,path){let doc;try{doc=win.document;}catch(e){return;}frames.push({win,path,href:String(win.location.href)});Array.from(doc.querySelectorAll('iframe')).forEach((f,i)=>walk(f.contentWindow,path+'.'+i));}walk(window,'top');return frames;}
const hit=collectFrames().find(f=>/\/worker-space\/index\.html/.test(f.href));
const doc=hit.win.document;
const btn=doc.querySelector('.wos-editor-debug-start');
if(!btn) return {ok:false,error:'start missing', hasStop:!!doc.querySelector('.wos-editor-debug-stop')};
btn.click();
return {ok:true};
'''))
for i in range(35):
    wait(1)
    state = js(r'''
function collectFrames(){const frames=[];function walk(win,path){let doc;try{doc=win.document;}catch(e){return;}frames.push({win,path,href:String(win.location.href)});Array.from(doc.querySelectorAll('iframe')).forEach((f,i)=>walk(f.contentWindow,path+'.'+i));}walk(window,'top');return frames;}
const hit=collectFrames().find(f=>/\/worker-space\/index\.html/.test(f.href));
const doc=hit.win.document;
const body=(doc.body&&doc.body.innerText||'');
const snippets=[];
['onCreate.QueryAssessmentRecords','queryrecords-param-driven','resultText','strmapPara','QUERY_FAILED','FATAL','ERROR','OK','ret'].forEach(k=>{const idx=body.indexOf(k); if(idx>=0) snippets.push({k, idx, text:body.slice(Math.max(0,idx-160), idx+1000)});});
return {hasStart:!!doc.querySelector('.wos-editor-debug-start'), hasStop:!!doc.querySelector('.wos-editor-debug-stop'), hasContinue:!!doc.querySelector('.debug-continue-run'), hasStep:!!doc.querySelector('.debug-step-over'), hasInterrupt:!!doc.querySelector('.debug-interrupt-line'), snippets, text:body.slice(0,1600)};
''')
    print('POLL2', i, state)
    txt = str(state)
    if 'FATAL: 0;ERROR: 0' in txt or 'hasStop' in txt and "True" in txt:
        pass
