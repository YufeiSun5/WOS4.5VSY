// Restore scaffold for PalimpsestContent_82 backup. Run only after explicit user approval.
(() => {
  const backupPage = 'PalimpsestContent_82';
  function getEditorWin() {
    const outer = Array.from(document.querySelectorAll('iframe')).find(f => f.src.includes('/public/') && f.getBoundingClientRect().width > 0);
    const inner1 = outer && outer.contentWindow.document.querySelector('iframe');
    const inner2 = inner1 && inner1.contentWindow.document.querySelector('iframe');
    return inner2 ? inner2.contentWindow : (inner1 ? inner1.contentWindow : null);
  }
  const win = getEditorWin();
  if (!win) throw new Error('editor window missing for ' + backupPage);
  return {backupPage, note:'Use before-runtime.json to restore component fields manually or via a project restore script after confirmation.'};
})();
