const {chromium} = require('playwright');
const assert = require('node:assert/strict');

// Run against a Vite server started with VITE_SANITY_PROJECT_ID=qaexample.
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:5174';
const photo = {url:'https://cdn.sanity.io/images/qaexample/production/sample-600x400.png',alt:{en:'A project photograph',de:'Ein Projektfoto'}};
const project = {_id:'qa-project',title:{en:'Community water',de:'Wasser für alle'},summary:{en:'A locally managed water project',de:'Ein gemeinsames Wasserprojekt'},description:{en:'Project background\nA second paragraph.'},location:'Test location',status:'ongoing',category:'water',cover:photo,gallery:[{...photo,_key:'one'}]};

(async () => {
 const browser = await chromium.launch({channel:'msedge',headless:true});
 try {
  const page = await browser.newPage();
  const errors=[];
  page.on('pageerror', e => errors.push(e.message));
  let mode='success';
  await page.route('**/*', async route => {
   const url=route.request().url();
   if(url.includes('.apicdn.sanity.io/')) {
    assert.equal(new URL(url).searchParams.get('perspective'),'published');
    if(mode==='failure') return route.fulfill({status:503,body:'Unavailable'});
    return route.fulfill({json:{result:mode==='empty'?[]:[project,{...project,_id:'drafts.hidden',title:{en:'Do not publish'}}]}});
   }
   if(url.startsWith('https://cdn.sanity.io/images/')) return route.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="600" height="400" fill="#c5b186"/></svg>'});
   if(url.startsWith(base)) return route.continue();
   return route.abort();
  });
  for(const width of [1440,390,320]) {
   await page.setViewportSize({width,height:900});
   await page.goto(base,{waitUntil:'domcontentloaded'});
   await page.locator('.aid-card').filter({hasText:'Wasser für alle'}).waitFor();
   assert.equal(await page.locator('.aid-card').count(),1);
   await page.locator('.language select').selectOption('en');
   await page.locator('.aid-details summary').click();
   assert.match(await page.locator('.aid-description').innerText(),/Project background/);
   await page.locator('.aid-gallery img').evaluate(i=>i.decode());
   await page.locator('.aid-cover').evaluate(i=>i.decode());
   assert.equal(await page.locator('.aid-meta').innerText().then(s=>s.includes('Ongoing')),true);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
   await page.locator('.language select').selectOption('fr');
   assert.match(await page.locator('.aid-card').innerText(),/Community water/);
  }
  mode='empty'; await page.reload({waitUntil:'domcontentloaded'});
  await page.locator('.aid-empty').waitFor();
  assert.equal(await page.locator('.aid-card').count(),0);
  mode='failure'; await page.reload({waitUntil:'domcontentloaded'});
  await page.locator('.aid-card').first().waitFor();
  assert.equal(await page.locator('.aid-card').count(),2);
  assert.deepEqual(errors,[]);
  console.log('Welfare QA passed: content, photos, gallery, translations, draft exclusion, empty/error states, desktop and mobile.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
