
// Restore helper for PalimpsestExcel_82 before backup. Execute only on explicit restore request.
(function(){
  function findEditor(win, path){
    var doc; try { doc = win.document; } catch(e) { return null; }
    if (doc.querySelector('#page_edit_view_area')) return {win:win, doc:doc, path:path};
    var frames = Array.from(doc.querySelectorAll('iframe'));
    for (var i=0;i<frames.length;i++){ var found = findEditor(frames[i].contentWindow, path+'.'+i); if(found) return found; }
    return null;
  }
  return {page:'PalimpsestExcel_82', note:'Load before-runtime.json and restore root rowsManager/component object fields manually; automatic destructive restore intentionally disabled.'};
})();
