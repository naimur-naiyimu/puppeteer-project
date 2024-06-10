import puppeteer from "puppeteer";

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    try {
        await page.goto("https://bing.com", { waitUntil: 'networkidle2' });
        await page.waitForSelector('#sb_form_q');
        await page.type('#sb_form_q', 'top tech company');
        await page.waitForSelector('#search_icon');
        await page.click('#search_icon');

        await page.waitForNavigation({ waitUntil: 'networkidle2' });
        
        // Ensure the selector is correct. Use a more specific selector if necessary.
        await page.waitForSelector('#b_results .b_algo');

        // Extracting results using evaluate
        const results = await page.evaluate(() => {
            const elements = document.querySelectorAll('#b_results .b_algo');
            return [...elements].map(element => {
                const title = element.querySelector('h2 a')?.innerText;
                const url = element.querySelector('h2 a')?.href;
                const descriptionElement = element.querySelector('.b_caption p');
                const description = descriptionElement ? descriptionElement.innerText : null;
                
                // Skip the result if it doesn't have a title
                if (!title) return null;

                return { title, url, description };
            }).filter(result => result !== null); // Filter out null results
        });

        // Printing each search result to the console
        for (const result of results) {
            console.log(result.title);
            console.log(result.url);
            console.log(result.description);
            console.log();
        }
    } catch (error) {
        console.error("Error occurred:", error);
    } finally {
        await browser.close();
    }
})();
