ensure_real_tab()
print(js(r'''
function collectFrames(){const frames=[];function walk(win,path){let doc;try{doc=win.document;}catch(e){return;}frames.push({win,path,href:String(win.location.href)});Array.from(doc.querySelectorAll('iframe')).forEach((f,i)=>walk(f.contentWindow,path+'.'+i));}walk(window,'top');return frames;}
const hit=collectFrames().find(f=>/\/worker-space\/index\.html/.test(f.href));
const doc=hit.win.document;
return Array.from(doc.querySelectorAll('div,span,li,button')).map((e,i)=>{const txt=(e.innerText||e.textContent||'').trim(); if(txt!=='onCreate') return null; const r=e.getBoundingClientRect(); return {i, tag:e.tagName, cls:String(e.className), text:txt, x:r.x,y:r.y,w:r.width,h:r.height, parent:String(e.parentElement&&e.parentElement.className), html:e.outerHTML.slice(0,300)};}).filter(Boolean);
'''))
