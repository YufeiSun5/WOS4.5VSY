// WOS4 page runtime restore helper for PalimpsestContent_82
// Created with wos4-page-runtime-backup. Run only after explicit user approval.
(function(){
  const backupPage = 'PalimpsestContent_82';
  function walk(win){
    let doc; try { doc = win.document; } catch(e) { return null; }
    if (doc.getElementById('page_edit_view_area')) return win;
    for (const f of Array.from(doc.querySelectorAll('iframe'))) { const got = walk(f.contentWindow); if (got) return got; }
    return null;
  }
  const win = walk(window);
  if (!win) throw new Error('editor runtime missing for '+backupPage);
  const view = win.document.getElementById('page_edit_view_area').__vue__;
  const kids = view && view._data && view._data.comMap && view._data.comMap.$Children;
  if (!kids) throw new Error('comMap children missing');
  return {page: backupPage, message: 'Load before-runtime.json and apply component/layout fields explicitly; this stub intentionally does not overwrite automatically.', componentCount: Object.keys(kids).length};
})();
