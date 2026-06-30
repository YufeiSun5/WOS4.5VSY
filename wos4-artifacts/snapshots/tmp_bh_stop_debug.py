ensure_real_tab()
print(js(r'''
function collectFrames(){const frames=[];function walk(win,path){let doc;try{doc=win.document;}catch(e){return;}frames.push({win,path,href:String(win.location.href)});Array.from(doc.querySelectorAll('iframe')).forEach((f,i)=>walk(f.contentWindow,path+'.'+i));}walk(window,'top');return frames;}
const hit=collectFrames().find(f=>/\/worker-space\/index\.html/.test(f.href));
const doc=hit.win.document;
const btn=doc.querySelector('.debug-stop,.wos-editor-debug-stop');
if(btn){btn.click(); return {clicked:true, cls:btn.className};}
return {clicked:false, hasStart:!!doc.querySelector('.wos-editor-debug-start')};
'''))
for i in range(12):
    wait(1)
    print('STOPPOLL', i, js(r'''
function collectFrames(){const frames=[];function walk(win,path){let doc;try{doc=win.document;}catch(e){return;}frames.push({win,path,href:String(win.location.href)});Array.from(doc.querySelectorAll('iframe')).forEach((f,i)=>walk(f.contentWindow,path+'.'+i));}walk(window,'top');return frames;}
const hit=collectFrames().find(f=>/\/worker-space\/index\.html/.test(f.href)); const doc=hit.win.document; return {hasStart:!!doc.querySelector('.wos-editor-debug-start'), hasStop:!!doc.querySelector('.wos-editor-debug-stop'), text:(doc.body&&doc.body.innerText||'').slice(0,800)};
'''))
