
// Package helps to scrape and parse the web data
const { chromium } = require("playwright");
const pool = require("./config/db");


// Function to scrape and store single stock data
const scrapeDataForCompany = async (stock, timestamp) => {

  // Playwright chromium initial setup
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {

    // Construct URL dynamically using stock name
    const url = `https://groww.in/stocks/${stock}`;

    await page.goto(url, {
      waitUntil: "networkidle", // // Wait for network to be idle (meaning the page has fully loaded)
      timeout: 120000, // Timeout after 2 minutes if the page doesn't load
    });

    // $$eval() used to find multiple elements with the CSS selector
    const last_trade = await page.$$eval(
      ".lpu38Pri.valign-wrapper.false.displayBase span", // CSS selector to get last_trade value
      (elements) => elements.map((element) => element.textContent.trim()) // Extract the text content of all matching elements
    );

    //$eval() used to find single element with the CSS selector
    const change_in_per = await page.$eval(
      ".lpu38Day.bodyBaseHeavy",
      (element) => element.textContent
    );

    //Change_in_per is in "-0.90 (0.03%)" formate -0.90 is change
    let change = change_in_per.split(" ")[0];

    // Removing the + sign from positive number
    if (change.split("")[0] == "+") {
      change = change.slice(1);
    }

    // Converting (0.03%) to 0.03
    let perc = change_in_per.split(" ")[1].slice(1, 5);

    // Converting stock name tata-motors-ltd to tata_motors_ltd as db not support '-' seperated names
    const modified_stock_name = stock.split("-").join("_");

    console.log(`\t\t\t--- ${modified_stock_name} ---`);
    console.log(`last_trade: ${last_trade[1]}\t\tchange: ${change}\t\tchange_in_per: ${perc}`);

    const existsQuery = `SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = $1 AND TABLE_NAME = $2`
    const exists = await pool.query(existsQuery,["public", modified_stock_name]);

    if (exists.rowCount === 0) {
      const createQuery = `
        CREATE TABLE ${modified_stock_name} (
        id SERIAL PRIMARY KEY,
        last_trade NUMERIC(10, 2),
        change NUMERIC(10, 2),
        change_in_perc NUMERIC(5, 2),
        timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        )`;

      await pool.query(createQuery);
    }

    // Query to store data in db
    const query = `INSERT INTO ${modified_stock_name}(last_trade,change,change_in_perc,timestamp) VALUES($1,$2,$3,$4)`;
    await pool.query(query, [last_trade[1], change, perc,timestamp]);

  } catch (err) {
    console.error(`Error while loading page for ${stock}:`, err);

  } finally {
    await browser.close(); // Close the browser once scraping is done
  }
};

const dateTransform = () => {
  const date = new Date();
  const hrs = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const sec = String(date.getSeconds()).padStart(2, "0");
  const msec = String(date.getMilliseconds()).padStart(3, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${yyyy}-${mm}-${dd} ${hrs}:${min}:${sec}.${msec}+05:30`;
};

const scrapeDataForMultipleCompanies = async () => {

  const stocks = [
    "tata-motors-ltd",
    "reliance-industries-ltd",
    "infosys-ltd",
    "tata-consultancy-services-ltd",
    "hdfc-nifty-smallcap-etf",
    "hdfc-bank-ltd",
    "state-bank-of-india",
    "icici-bank-ltd",
    "bajaj-finance-ltd",
    "bajaj-finserv-ltd",
    "larsen-toubro-ltd",
    "itc-ltd",
    "tata-steel-ltd",
    "jsw-steel-ltd",
    "adani-ports-and-special-economic-zone-ltd",
    "adani-enterprises-ltd",
  ];

  const timestamp = dateTransform();

  // Creating an array of promises for scraping data for each stock
  const scrapePromises = stocks.map(async (stock) => {
    return scrapeDataForCompany(stock, timestamp);
  });

  await Promise.all(scrapePromises); // Wait for all scraping tasks to complete concurrently
};

module.exports = scrapeDataForMultipleCompanies;
