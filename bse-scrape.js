const { chromium } = require("playwright");
const pool = require("./config/db");

// Helper Function to get date in different format
const { getDate, dateTransform } = require("./helpers/dateTransform");

const baseUrl = `https://www.bseindia.com/stock-share-price/`;

// Helper function to delay execution (in milliseconds)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Core function to scrape data for one company
const scrapeDataForCompany = async (stock, timestamp, browser) => {

  const date = getDate();
  const page = await browser.newPage();

  try {
    const url = `${baseUrl}${stock}`;

    // Navigate to the stock page and wait for network to be idle
    await page.goto(url, {
      waitUntil: "networkidle", 
      timeout: 1000 * 60 * 2,
    });

    await page.waitForTimeout(500); // wait to get page fully loaded page

    // Select element having last trade value
    const lastTradeElement = await page.$("#idcrval");
    const last_trade = lastTradeElement ? await lastTradeElement.textContent() : "N/A";

    // Select element having stock change value
    const changeElement = await page.$(".sensexbluetext.ng-binding");
    const change = changeElement ? await changeElement.textContent() : "N/A";

    console.log(stock.split("/")[0], " - last trade:", last_trade, " | change:", change.split(" ")[0]);

     // Query to insert scraped data into database
    const query = `INSERT INTO bse_scrape(last_trade, change, date, stock_name, timestamp) VALUES($1, $2, $3, $4, $5)`;
    await pool.query(query, [last_trade, change.split(" ")[0], date, stock.split("/")[0], timestamp]);

  } catch (err) {
    console.error(`Error while loading page for ${stock}:`, err.message);

  } finally {
    await page.close();
  }
};

// Function to scrape multiple stocks in batches
const scrapeDataForMultipleCompanies2 = async () => {

  const timestamp = dateTransform(); // Generate timestamp in format (2025-04-15 10:50:00.004+05:30)

  const stocks = [
    { name: "tata-motors-ltd/tatamotors/500570/" },
    { name: "reliance-industries-ltd/reliance/500325/" },
    { name: "infosys-ltd/infy/500209/" },
    { name: "tata-consultancy-services-ltd/tcs/532540/" },
    { name: "hdfc-bank-ltd/hdfcbank/500180/" },
    { name: "state-bank-of-india/sbin/500112/" },
    { name: "icici-bank-ltd/icicibank/532174/" },
    { name: "bajaj-finance-ltd/bajfinance/500034/" },
    { name: "bajaj-finserv-ltd/bajajfinsv/532978/" },
    { name: "larsen--toubro-ltd/lt/500510/" },
    { name: "itc-ltd/itc/500875/" },
    { name: "tata-steel-ltd/tatasteel/500470/" },
    { name: "jsw-steel-ltd/jswsteel/500228/" },
    { name: "adani-ports-and-special-economic-zone-ltd/adaniports/532921/" },
    { name: "adani-enterprises-ltd/adanient/512599/" }
  ];

  // Launch browser (headless mode)
  const browser = await chromium.launch({ headless: true });
  const batchSize = 8; // Number of stocks to scrape in one batch

  // Loop through the stocks in batches
  for (let i = 0; i < stocks.length; i += batchSize) {
    const batch = stocks.slice(i, i + batchSize);

    // Scrape each stock in the current batch
    for (const stock of batch) {
      await scrapeDataForCompany(stock.name, timestamp, browser);
      await delay(1500); // Delay between each request to avoid detection
    }

    console.log(`Finished batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(stocks.length / batchSize)}`);
  }
  console.log(new Date())
  await browser.close();
};

module.exports = scrapeDataForMultipleCompanies2;
