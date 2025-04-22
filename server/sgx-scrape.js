const cheerio = require("cheerio"); // Cheerio is used for parsing HTML and extracting data
const axios = require("axios");

const pool = require("./config/db");
const url = "https://sgxnifty.org/";

let result = {};

// Function to scrape the website and extract data
const scrapeWebsite = async () => {

  try {
    // Getting formatted date for timestamp creation
    const timestamp = formateDate()
    const { data } = await axios.get(url);

    // Load the HTML data into Cheerio for easy manipulation
    const $ = cheerio.load(data);

    // Select the first table and second table on the page that contains the required data (main-table)
    const firstTable = $("table.main-table").first();
    const secondTable = $("table.main-table").eq(1);

    // Extract data from the first table (Last Trade, Change, and Percentage Change)
    firstTable.find("tbody").each((rowIndex, row) => {

      // Extract the values from the corresponding columns in the row
      const lastTrade = $(row).find("td.main-change").eq(0).text().trim();
      const change = $(row).find("td.main-change").eq(1).text().trim();
      const changeInPer = $(row).find("td.main-change").eq(2).text().trim();

      // Store the extracted values in the result object
      result.lastTrade = lastTrade;
      result.change = change;
      result.changeInPer = changeInPer;

    });

    // Extract data from the second table (High, Low, and Open values)
    secondTable.find("tbody").each((rowIndex, row) => {

      const high = $(row).find("td.main-sub").eq(0).text().trim();
      const low = $(row).find("td.main-sub").eq(1).text().trim();
      const open = $(row).find("td.main-sub").eq(2).text().trim();

      result.high = high;
      result.low = low;
      result.open = open;

    });

    const { lastTrade, change, changeInPer, high, low, open } = result;

    console.log(`\t\t\t--- SGX scrape data ---`);
    console.log(`last_trade: ${lastTrade}\t\tchange: ${change}\t\tchange_in_per: ${changeInPer}`);
    
    //SQL query to store the data in db
    const query = `INSERT INTO sgx_nifty(last_trade,change,change_in_perc,high,low,open,timestamp) VALUES($1,$2,$3,$4,$5,$6,$7)`;
    const dataStored = await pool.query(query, [
      lastTrade,
      change,
      changeInPer,
      high,
      low,
      open,
      timestamp
    ]);

    return result;

  } catch (error) {
    console.error("Error scraping the website:", error);
  }
};

// Function to crete date in this format ('2025-04-15 10:50:00.004+05:30')
const formateDate = () => {
  const date = new Date()
  const yy = date.getFullYear()
  const mm = String(date.getMonth()+1).padStart(2,"0")
  const dd = String(date.getDate()).padStart(2,"0")
  const hh = String(date.getHours()).padStart(2,"0")
  const min = String(date.getMinutes()).padStart(2,"0")
  const sec = String(date.getSeconds()).padStart(2,"0")
  const msec = String(date.getMilliseconds()).padStart(3,"0")
  return `${yy}-${mm}-${dd} ${hh}:${min}:${sec}.${msec}+5:30`
}

module.exports = scrapeWebsite;
