const express = require("express");
const cron = require("node-cron");
const moment = require('moment-timezone')
const cors = require('cors')

const app = express();
const scrapeDataForMultipleCompanies = require("./scrape");
const sgxScrape = require("./sgxscrape");
const sgxAnalytics = require('./sgx_analytics')
const growwAnalytics = require('./groww_analytics')
const db = require("./config/db");
const pool = require("./config/db");
const {dateTransform,getDate} = require('./helpers/dateTransform');
const scrapeDataForMultipleCompanies2  = require("./bsescrape");
const analyticsDataForMultipleCompanies = require("./bse_analytics");

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors())

// Cron job to scrape SGX data from 6AM to 12PM mon to fri
cron.schedule("0-59 6-23 * * 1-5", async () => {
  const date = new Date();
  try {
    await sgxScrape();
    console.log("=====================================");
    console.log(`    | SGX Scrape - Time: ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")} |`);
    console.log("=====================================");
  } catch (err) {
    console.error("Error scraping SGX:", err);
  }
});


// Cron job to scrape data for multiple companies from 9AM to 4PM mon to fri
cron.schedule("0-59 9-15 * * 1-5", async () => {
  const date = new Date();
  try {
    await scrapeDataForMultipleCompanies();
    console.log("===============================================");
    console.log(`  | Multiple Companies Scrape - Time: ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")} |`);
    console.log("===============================================");
  } catch (err) {
    console.error("Error scraping data for multiple companies:", err);
  }
});

//cron job to get sgx analytics mon to fri at 9:10 AM
cron.schedule("10 9 * * 1-5", async () => {
  const date = new Date()
  try {
    await sgxAnalytics()
    console.log("===============================================");
    console.log(`  | sgx analytics - Time: ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")} |`);
    console.log("===============================================");
  } catch (err) {
    console.error("Error calculating sgx analytics:", err);
  }
});

//cron job to get groww analytics mon to fri at 10:10 AM
cron.schedule("10 10 * * 1-5", async () => {
  const date = new Date()
  try {
    await growwAnalytics()
    console.log("===============================================");
    console.log(`  | groww analytics - Time: ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")} |`);
    console.log("===============================================");
  } catch (err) {
    console.error("Error calculating groww analytics:", err);
  }
});


//cron job to scrap bse data at 9:02, 9:15, 9:30 mon to fri 
cron.schedule("2,15,30 9 * * 1-5", async () => {
  const date = new Date()
  try {
    await scrapeDataForMultipleCompanies2()
    console.log("===============================================");
    console.log(`  | bse scrape - Time: ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")} |`);
    console.log("===============================================");
  } catch (err) {
    console.error("Error calculating bse scrape:", err);
  }
});

//cron job to scrap bse data at 10:00 mon to fri 
cron.schedule("0 10 * * 1-5", async () => {
  const date = new Date()
  try {
    await scrapeDataForMultipleCompanies2()
    console.log("===============================================");
    console.log(`  | bse scrape - Time: ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")} |`);
    console.log("===============================================");
  } catch (err) {
    console.error("Error calculating bse scrape:", err);
  }
});

//cron job to bse analytics at 10:15 mon to fri 
cron.schedule("15 10 * * 1-5", async () => {
  const date = new Date()
  try {
    await analyticsDataForMultipleCompanies()
    console.log("===============================================");
    console.log(`  | bse analytics - Time: ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")} |`);
    console.log("===============================================");
  } catch (err) {
    console.error("Error calculating bse analytics:", err);
  }
});

//API to get sgx analytics table for selected date '2025-04-09' is format of date
app.post("/sgx",async(req,res)=>{
  const {date} = req.body
  // const date = getDate()
  // const date = '2025-04-09'
  const result = await pool.query(`SELECT * FROM sgx_nifty_analytics WHERE date = '${date}'`)
  res.send(result.rows)
})

//API to get BSE analytics table for selected date '2025-04-09' is format of date
app.post("/bse_analytics",async(req,res)=>{
  const {date} = req.body
  // const date = getDate()
  // const date = '2025-04-09'
  const result = await pool.query(`SELECT * FROM bse_analytics WHERE date = '${date}'`)
  res.send(result.rows)
})

// Start the Express server and connect to the database
app.listen(5000, () => {
  db.connect();
  console.log("Server is running on http://localhost:5000");
});
