ensure_real_tab()
print(js(r'''
function collectFrames(){const frames=[];function walk(win,path,chain){let doc;try{doc=win.document;}catch(e){return;}frames.push({win,path,href:String(win.location.href),chain});Array.from(doc.querySelectorAll('iframe')).forEach((f,i)=>walk(f.contentWindow,path+'.'+i,chain.concat(f)));}walk(window,'top',[]);return frames;}
const hit=collectFrames().find(f=>/\/worker-space\/index\.html/.test(f.href));
const doc=hit.win.document;
const el=Array.from(doc.querySelectorAll('div,span,li')).find(e=>(e.innerText||'').trim()==='onCreate' && e.getBoundingClientRect().width>0 && e.getBoundingClientRect().height>0);
if(el) el.click();
return {clicked:!!el, body:(doc.body&&doc.body.innerText||'').slice(0,4000)};
'''))
wait(1)
print(js(r'''
function collectFrames(){const frames=[];function walk(win,path){let doc;try{doc=win.document;}catch(e){return;}frames.push({win,path,href:String(win.location.href)});Array.from(doc.querySelectorAll('iframe')).forEach((f,i)=>walk(f.contentWindow,path+'.'+i));}walk(window,'top');return frames;}
const hit=collectFrames().find(f=>/\/worker-space\/index\.html/.test(f.href));
const doc=hit.win.document;
return {body:(doc.body&&doc.body.innerText||'').slice(0,5000), buttons:Array.from(doc.querySelectorAll('button,.el-button')).map(b=>(b.innerText||b.textContent||'').trim()).filter(Boolean).slice(0,80)};
'''))
