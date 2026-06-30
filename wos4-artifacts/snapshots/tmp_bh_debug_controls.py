ensure_real_tab()
print(js(r'''
function collectFrames(){const frames=[];function walk(win,path,chain){let doc;try{doc=win.document;}catch(e){return;}frames.push({win,path,href:String(win.location.href),chain});Array.from(doc.querySelectorAll('iframe')).forEach((f,i)=>walk(f.contentWindow,path+'.'+i,chain.concat(f)));}walk(window,'top',[]);return frames;}
const hit=collectFrames().find(f=>/\/worker-space\/index\.html/.test(f.href));
const doc=hit.win.document;
const selectors=['.wos-editor-debug-start','.wos-editor-debug-stop','.debug-continue-run','.debug-step-over','.debug-stop','.monaco-editor','.glyph-margin','.line-numbers'];
const out={};
for(const sel of selectors){out[sel]=Array.from(doc.querySelectorAll(sel)).map(e=>{const r=e.getBoundingClientRect();return {text:(e.innerText||e.textContent||'').trim().slice(0,80), cls:e.className, x:r.x,y:r.y,w:r.width,h:r.height, visible:r.width>0&&r.height>0};}).slice(0,20)}
return out;
'''))
