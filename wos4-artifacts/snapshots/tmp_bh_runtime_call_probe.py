ensure_real_tab()
print(js(r'''
async function main(){
function walk(win,path){let out=[];let doc;try{doc=win.document;}catch(e){return out;}out.push({win,path,href:String(win.location.href),text:(doc.body&&doc.body.innerText||'').slice(0,200)});Array.from(doc.querySelectorAll('iframe')).forEach((f,i)=>out=out.concat(walk(f.contentWindow,path+'.'+i)));return out;}
const frames=walk(window,'top');
const frame=frames.find(f=>String(f.href).includes('GetFileContent') && (f.text.includes('Palimpsest') || f.text.includes('??') || f.text.includes('????')) ) || frames.find(f=>String(f.href).includes('GetFileContent'));
if(!frame) return {ok:false,error:'runtime frame missing', frames:frames.map(f=>({path:f.path,href:f.href,text:f.text}))};
const win=frame.win;
return {ok:true,path:frame.path,href:frame.href,hasCall:typeof win.Call,hasSetRunInfo:typeof win.SetRunInfo,hasStringMap:typeof win.StringMap, text:frame.text};
}
return main();
'''))
