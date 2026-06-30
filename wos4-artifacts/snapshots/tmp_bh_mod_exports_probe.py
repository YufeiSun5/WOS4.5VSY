ensure_real_tab()
print(js(r'''
async function main(){
function collectFrames(){const frames=[];function walk(win,path){let doc;try{doc=win.document;}catch(e){return;}frames.push({win,path,href:String(win.location.href)});Array.from(doc.querySelectorAll('iframe')).forEach((f,i)=>walk(f.contentWindow,path+'.'+i));}walk(window,'top');return frames;}
const hit=collectFrames().find(f=>/\/worker-space\/index\.html/.test(f.href)); const win=hit.win;
const mod=await win.Function("return import('/worker-space/js/index.1780642363899.js')")();
const out=[];
for(const [k,v] of Object.entries(mod)){
  let desc={k, type:typeof v};
  try{
    if(v && typeof v==='object'){
      if('value' in v){desc.value=v.value; desc.isRef=true;}
      else {desc.keys=Object.keys(v).slice(0,10);}
    }
    if(typeof v==='function') desc.name=v.name;
  }catch(e){desc.err=String(e)}
  if(desc.isRef || /debug|break|compile|trace|task|interrupt/i.test(JSON.stringify(desc))) out.push(desc);
}
return out.slice(0,120);
}
return main();
'''))
