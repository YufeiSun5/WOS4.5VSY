import { connect } from 'browser-harness';
const h = await connect({ name: process.env.BU_NAME, cdpUrl: process.env.BU_CDP_URL });
const page = await h.getActivePage();
await page.waitForTimeout(500);
const info = await page.evaluate(() => {
  const dialogs = Array.from(document.querySelectorAll('.el-dialog__wrapper, .el-message-box__wrapper, .v-modal, [role="dialog"]')).map((el:any) => {
    const r = el.getBoundingClientRect();
    const st = getComputedStyle(el);
    return { cls: el.className, text: (el.innerText||'').slice(0,300), display: st.display, visibility: st.visibility, rect: {x:r.x,y:r.y,w:r.width,h:r.height} };
  }).filter((x:any)=>x.display!=='none' && x.visibility!=='hidden');
  return { url: location.href, title: document.title, text: document.body.innerText.slice(0,800), dialogs };
});
console.log(JSON.stringify(info, null, 2));
await page.screenshot({ path: 'wos4-artifacts/screenshots/pal_current_state_after_resume_20260627.png', fullPage: false });
