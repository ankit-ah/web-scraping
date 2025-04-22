const express = require("express");
const cron = require("node-cron");
const cors = require('cors');

const dotenv = require('dotenv')
dotenv.config()

const app = express();

const db = require("./config/db");
const pool = require("./config/db");

const sgxScrape = require("./sgx-scrape");
const scrapeDataForMultipleCompanies2  = require("./bse-scrape");

const sgxAnalytics = require('./sgx-analytics');
const analyticsDataForMultipleCompanies = require("./bse-analytics");

app.use(express.json()); // Middleware to parse JSON requests
app.use(cors()); // cors setup

// Cron job for scraping SGX data from 6AM to 4PM mon to fri
cron.schedule("0-59 6-17 * * 1-5", async () => {
  const date = new Date();
  try {
    await sgxScrape();
    console.log("=====================================");
    console.log(`    | SGX Scraping - Time: ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")} |`);
    console.log("=====================================");
  } catch (err) {
    console.error("Error scraping SGX:", err);
  }
});

//cron job to get SGX analytics mon to fri at 9:10 AM
cron.schedule("10 9 * * 1-5", async () => {
  const date = new Date()
  try {
    await sgxAnalytics()
    console.log("===============================================");
    console.log(`  | SGX analytics - Time: ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")} |`);
    console.log("===============================================");
  } catch (err) {
    console.error("Error calculating SGX analytics:", err);
  }
});

//cron job of scraping BSE data at 9:02, 9:15, 9:20, 9:25, 9:30 mon to fri 
cron.schedule("2,15,20,25,30 9 * * 1-5", async () => {
  const date = new Date()
  try {
    await scrapeDataForMultipleCompanies2()
    console.log("===============================================");
    console.log(`  | BSE scraping - Time: ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")} |`);
    console.log("===============================================");
  } catch (err) {
    console.error("Error calculating BSE scrape:", err);
  }
});

//cron job of scraping BSE data at 10:00 mon to fri 
cron.schedule("0 10 * * 1-5", async () => {
  const date = new Date()
  try {
    await scrapeDataForMultipleCompanies2()
    console.log("===============================================");
    console.log(`  | BSE scraping - Time: ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")} |`);
    console.log("===============================================");
  } catch (err) {
    console.error("Error calculating BSE scrape:", err);
  }
});

//cron job to get BSE analytics at 10:15 mon to fri 
cron.schedule("15 10 * * 1-5", async () => {
  const date = new Date()
  try {
    await analyticsDataForMultipleCompanies()
    console.log("===============================================");
    console.log(`  | BSE analytics - Time: ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")} |`);
    console.log("===============================================");
  } catch (err) {
    console.error("Error calculating BSE analytics:", err);
  }
});

//API to get SGX analytics table for selected date ('2025-04-09' is format of date)
app.post("/sgx",async(req,res)=>{
  try{
    const {startDate, endDate} = req.body
    const result = await pool.query(`SELECT * FROM sgx_nifty_analytics WHERE date BETWEEN $1 AND $2 ORDER BY date DESC`,[startDate,endDate])
    res.send(result.rows)
  } catch(err){
    console.error(err)
  }
})

//API to get BSE analytics table for selected date ('2025-04-09' is format of date)
app.post("/bse-analytics",async(req,res)=>{
  try {
    const {startDate,endDate} = req.body
    const result = await pool.query(`SELECT * FROM bse_analytics WHERE date BETWEEN $1 AND $2 ORDER BY date DESC`,[startDate,endDate])
    res.send(result.rows)
  } catch (err) {
    console.error(err)
  }
})

//API to get BSE analytics table for selected date ('2025-04-09' is format of date)
app.post("/compare", async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    const sgxQuery = await pool.query(
      `SELECT date, "8AM_to_9AM" FROM sgx_nifty_analytics WHERE date BETWEEN $1 AND $2 ORDER BY date DESC`,
      [startDate, endDate]
    );

    const sgxMap = new Map();
    sgxQuery.rows.forEach(row => {
      if (row["8AM_to_9AM"] !== null) {
        sgxMap.set(new Date(row.date).toISOString().split("T")[0], row["8AM_to_9AM"]);
      }
    });

    const bseQuery = await pool.query(
      `SELECT * FROM bse_analytics WHERE date BETWEEN $1 AND $2 ORDER BY date DESC`,
      [startDate, endDate]
    );

    const finalResponse = [];

    bseQuery.rows.forEach(row => {
      const rowDate = new Date(row.date).toISOString().split("T")[0];
      const sgxVal = sgxMap.get(rowDate);

      if (sgxVal == null) return; // Skip if no SGX value for that date

      const newRow = {};
      for (let key in row) {
        if (key.startsWith("interval")) {
          if(row[key]===null){
            newRow[key] = 'N/A'
          }else{
            newRow[key] = Number(row[key]) > sgxVal ? "+ve" : "-ve";
          }
        } else {
          newRow[key] = row[key];
        }
      }
      finalResponse.push(newRow);
    });

    res.send(finalResponse);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Start the Express server and connect to the database
app.listen(process.env.PORT, () => {
  db.connect()
  console.log("Server is running on http://localhost:5000")
});
