
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
 const page=await browser.newPage({reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const width of [1440,768,390,360]){
 await page.setViewportSize({width,height:900});await page.goto('http://127.0.0.1:5173/',{waitUntil:'domcontentloaded'});
 for(const [lang,country] of [['de','Zypern'],['en','Cyprus'],['fr','Chypre'],['es','Chipre']]){
 await page.locator('.language select').selectOption(lang);
 assert.equal(await page.locator('html').getAttribute('lang'),lang);
 assert.match(await page.locator('.vision h2').innerText(),new RegExp(country));
 assert.equal(await page.locator('#aid-projects article').count(),2);
 assert.equal(await page.locator('.company').count(),1);
 assert.doesNotMatch(await page.locator('main').innerText(),/AKEEM SERVICES|Vielfalt im Denken|Diverse in thought|Deutschland|Germany/);
 for(let i=0;i<3;i++){await page.locator('.hero-chapters button').nth(i).click();assert.ok(await page.locator('h1').innerText());await page.locator('.vision-tabs button').nth(i).click();}
 await page.locator('.company-detail-link').click();assert.ok(await page.getByRole('dialog').innerText());await page.keyboard.press('Escape');
 if(width<=650){await page.locator('.menu-toggle').click();await page.locator('nav a[href="#aid-projects"]').click();assert.equal(await page.locator('nav').isVisible(),false);}
 await page.locator('.aid-footer button').click();await page.locator('textarea').fill('Please tell me more about the aid projects.');
 await page.locator('.form-navigation button[type=submit]').click();await page.locator('input[name=name]').fill('Test User');await page.locator('input[name=email]').fill('test@example.com');await page.locator('input[type=checkbox]').check();await page.locator('.form-navigation button[type=submit]').click();assert.match(await page.locator('.enquiry-review pre').innerText(),/aid projects/);await page.locator('.back-form').click();
 const overflow=await page.evaluate(()=>({page:document.documentElement.scrollWidth>innerWidth,header:document.querySelector('.nav-wrap').scrollWidth>document.querySelector('.nav-wrap').clientWidth}));assert.deepEqual(overflow,{page:false,header:false},lang+' '+width+' overflow');
 if(width===390&&lang==='fr'){await page.locator('#aid-projects').screenshot({path:'scripts/aid-fr-mobile.png'});}
 console.log(lang+' at '+width+'px: passed');
 }
 }
 assert.deepEqual(errors,[]);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
