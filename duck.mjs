import puppeteer from "puppeteer";

const browser = await puppeteer.launch({headless: false}); //launching the headful browser 
const page = await browser.newPage();

await page.goto("https://duckduckgo.com", { waitUntil: 'networkidle2' });
await page.waitForSelector('#searchbox_input');
await page.type('#searchbox_input', 'python');
await page.waitForSelector('.searchbox_searchButton__F5Bwq');
await page.click('.searchbox_searchButton__F5Bwq');

await page.waitForSelector('[data-testid="result"]');

// extracting results using evaluate
const results = await page.evaluate(() => {
  const elements = document.querySelectorAll('[data-testid="result"]');
  return [...elements].map(element => {
    const title = element.querySelector('h2 a').textContent;
    const url = element.querySelector('h2 a').href;
    const descriptionElement = element.querySelector('.kY2IgmnCmOGjharHErah');
    const description = descriptionElement ? descriptionElement.textContent.trim() : '';
    return { title, url, description };
  });
});

// printing each search result to the console
for (const result of results) {
  console.log(result.title);
  console.log(result.url);
  console.log(result.description); 
  console.log()
}

await browser.close();