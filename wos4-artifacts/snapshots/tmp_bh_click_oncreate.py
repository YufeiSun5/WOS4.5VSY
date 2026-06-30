ensure_real_tab()
res = js(r'''
function collectFrames(){const frames=[];function walk(win,path,chain){let doc;try{doc=win.document;}catch(e){return;}frames.push({win,path,href:String(win.location.href),chain});Array.from(doc.querySelectorAll('iframe')).forEach((f,i)=>walk(f.contentWindow,path+'.'+i,chain.concat(f)));}walk(window,'top',[]);return frames;}
const hit=collectFrames().find(f=>/\/worker-space\/index\.html/.test(f.href));
if(!hit) return {ok:false,error:'worker missing'};
const doc=hit.win.document;
const candidates=Array.from(doc.querySelectorAll('div,span,li')).filter(e=>(e.innerText||'').trim()==='onCreate');
const el=candidates.find(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;});
if(!el) return {ok:false,error:'onCreate element missing', count:candidates.length};
el.click();
return {ok:true, clicked:(el.innerText||'').trim(), count:candidates.length};
''')
print('CLICK', res)
wait(1.5)
print('STATE', js(r'''
function collectFrames(){const frames=[];function walk(win,path){let doc;try{doc=win.document;}catch(e){return;}frames.push({win,path,href:String(win.location.href)});Array.from(doc.querySelectorAll('iframe')).forEach((f,i)=>walk(f.contentWindow,path+'.'+i));}walk(window,'top');return frames;}
const hit=collectFrames().find(f=>/\/worker-space\/index\.html/.test(f.href));
const doc=hit.win.document;
return {body:(doc.body&&doc.body.innerText||'').slice(0,3000)};
'''))
