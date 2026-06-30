// Restore helper for PalimpsestExpandTable_82_Demo.
function restorePalimpsestExpandDemo(backup) {
  var childrenKey = String.fromCharCode(36) + 'Children';
  var view = document.getElementById('page_edit_view_area').__vue__;
  var kids = view._data.comMap[childrenKey];
  var root = backup.rootKey && kids[backup.rootKey];
  if (!root) throw new Error('root not found in current runtime');
  if (backup.rootData && root.data) Object.assign(root.data, backup.rootData);
  if (view.updateRenderComs) view.updateRenderComs();
  if (view.updateDevRenderComs) view.updateDevRenderComs();
  if (view.) view.();
  return {ok:true, rootKey: backup.rootKey, componentCount: backup.components && backup.components.length};
}
