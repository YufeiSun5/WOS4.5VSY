// Restore script for PalimpsestContent_82 backup. Run only after explicit user confirmation.
(function restorePalimpsestContent82(BACKUP_JSON){
  if (!BACKUP_JSON || BACKUP_JSON.page !== 'PalimpsestContent_82') throw new Error('wrong backup page');
  const view = document.getElementById('page_edit_view_area') && document.getElementById('page_edit_view_area').__vue__;
  const kids = view && view._data && view._data.comMap && view._data.comMap.$Children;
  if (!kids || !Object.keys(kids).length) throw new Error('editor runtime is empty');
  const byKey = Object.fromEntries(Object.entries(kids));
  (BACKUP_JSON.components || []).forEach(c => { const inst = byKey[c.key]; if (!inst) return; if (c.propData && inst.propData) Object.assign(inst.propData, c.propData); if (c.data && inst.data) Object.assign(inst.data, c.data); if (c.options && inst.options) Object.assign(inst.options, c.options); if (c.linkList) inst.linkList = c.linkList; if (c.detailConfig && inst.propData) inst.propData.detailConfig = c.detailConfig; if (c.styleConfig && inst.propData) inst.propData.styleConfig = c.styleConfig; });
  if (view.updateRenderComs) view.updateRenderComs(); if (view.updateDevRenderComs) view.updateDevRenderComs(); if (view.$forceUpdate) view.$forceUpdate();
  return {restored:true, components:(BACKUP_JSON.components||[]).length};
})
