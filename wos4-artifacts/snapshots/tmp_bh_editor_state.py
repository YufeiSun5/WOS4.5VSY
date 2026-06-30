ensure_real_tab()
res = js(r'''
function collectFrames(){const frames=[];function walk(win,path){let doc;try{doc=win.document;}catch(e){return;}frames.push({win,path,href:String(win.location.href)});Array.from(doc.querySelectorAll('iframe')).forEach((f,i)=>walk(f.contentWindow,path+'.'+i));}walk(window,'top');return frames;}
const hit=collectFrames().find(f=>/\/worker-space\/index\.html/.test(f.href));
if(!hit) return {ok:false,error:'worker missing'};
const win=hit.win, doc=win.document;
const models = win.monaco && win.monaco.editor ? win.monaco.editor.getModels().map((m,i)=>({i, uri:String(m.uri), lang:m.getLanguageId(), lineCount:m.getLineCount(), text:m.getValue().slice(0,2000)})) : [];
const keys = Object.keys(win).filter(k=>/model|function|editor|store|pinia|debug/i.test(k)).slice(0,120);
const body=(doc.body&&doc.body.innerText||'').slice(0,3000);
return {ok:true, href:hit.href, title:doc.title, modelCount:models.length, models, keys, body};
''')
print(res)
