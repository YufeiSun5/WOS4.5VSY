ensure_real_tab()
print(js(r'''
function collectFrames(){const frames=[];function walk(win,path){let doc;try{doc=win.document;}catch(e){return;}frames.push({win,path,href:String(win.location.href)});Array.from(doc.querySelectorAll('iframe')).forEach((f,i)=>walk(f.contentWindow,path+'.'+i));}walk(window,'top');return frames;}
const hit=collectFrames().find(f=>/\/worker-space\/index\.html/.test(f.href));
const doc=hit.win.document;
const sels=['.view-line','.line-numbers','.margin-view-overlays','.monaco-scrollable-element','.monaco-editor','.editor-container','textarea.inputarea'];
const out={};
for(const sel of sels){out[sel]=Array.from(doc.querySelectorAll(sel)).slice(0,40).map(e=>{const r=e.getBoundingClientRect(); return {text:(e.innerText||e.textContent||e.value||'').slice(0,500), cls:String(e.className), x:r.x,y:r.y,w:r.width,h:r.height, html:e.outerHTML.slice(0,300)};});}
return out;
'''))
