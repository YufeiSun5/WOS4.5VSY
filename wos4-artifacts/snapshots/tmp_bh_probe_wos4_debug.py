ensure_real_tab()
print('PAGE', page_info())
print('DIALOGS', js(r'''
const visible=(el)=>{const r=el.getBoundingClientRect();const s=getComputedStyle(el);return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden';};
const dialogs=Array.from(document.querySelectorAll('.el-message-box,.el-dialog,.el-overlay-message-box,[role="dialog"]')).filter(visible).map(el=>({text:(el.innerText||el.textContent||'').trim().slice(0,500), buttons:Array.from(el.querySelectorAll('button,.el-button')).filter(visible).map(b=>(b.innerText||b.textContent||'').trim())}));
function walk(win,path){let out=[];let doc;try{doc=win.document;}catch(e){return [{path,error:String(e),href:''}]};out.push({path,href:String(win.location.href),title:doc.title,text:(doc.body?doc.body.innerText:'').slice(0,300),iframes:doc.querySelectorAll('iframe').length});Array.from(doc.querySelectorAll('iframe')).forEach((f,i)=>{out=out.concat(walk(f.contentWindow,path+'.'+i));});return out;}
return {dialogs,frames:walk(window,'top')};
'''))
