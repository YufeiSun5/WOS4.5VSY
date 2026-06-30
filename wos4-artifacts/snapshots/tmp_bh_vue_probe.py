ensure_real_tab()
print(js(r'''
function collectFrames(){const frames=[];function walk(win,path){let doc;try{doc=win.document;}catch(e){return;}frames.push({win,path,href:String(win.location.href)});Array.from(doc.querySelectorAll('iframe')).forEach((f,i)=>walk(f.contentWindow,path+'.'+i));}walk(window,'top');return frames;}
const hit=collectFrames().find(f=>/\/worker-space\/index\.html/.test(f.href));
const win=hit.win, doc=win.document;
function safe(v,depth=0,seen=new WeakSet()){try{if(v==null||typeof v!=='object')return v;if(seen.has(v))return '[cycle]';if(depth>2)return Array.isArray(v)?`[array ${v.length}]`:'[object]';seen.add(v);if(Array.isArray(v))return v.slice(0,10).map(x=>safe(x,depth+1,seen));const out={};for(const k of Object.keys(v).slice(0,80)){if(/script|name|function|break|debug|model|temp|id|version|guid|return|input/i.test(k)){const val=v[k];out[k]=typeof val==='function'?'[function]':safe(val,depth+1,seen);}}return out;}catch(e){return '[err '+e+']';}}
const comps=[];
Array.from(doc.querySelectorAll('*')).forEach((el,i)=>{const c=el.__vueParentComponent; if(!c) return; const txt=(el.innerText||el.textContent||'').slice(0,100); const st=safe(c.setupState||{}); const data=safe(c.data||{}); const props=safe(c.props||{}); const keys=[...Object.keys(c.setupState||{}),...Object.keys(c.data||{}),...Object.keys(c.props||{})].join(','); if(/function|debug|model|script|break|editor|compile/i.test(keys+txt)) comps.push({i, tag:el.tagName, cls:String(el.className).slice(0,120), txt, keys:keys.slice(0,400), st, data, props});});
return comps.slice(0,30);
'''))
