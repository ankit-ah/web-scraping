const pool = require('./config/db')
const { getDate } = require('./helpers/dateTransform') // Helper Function to get date in format (2025-04-15)

// Function to calculate Groww analytics with time intervals
const groww_analytics = async (stock_name) => {

    try {
        const date = getDate()

        // Defining the time intervals for the specific time we want to track
        const time_for_9_02AM = `${date} 09:02`
        const time_for_9_15AM = `${date} 09:15`
        const time_for_9_30AM = `${date} 09:30`
        const time_for_10AM = `${date} 10:00`
        // console.log(time_for_9_02AM,time_for_9_15AM,time_for_9_30AM,time_for_10AM)

        // Querying the database for the stock's price at these specific times
        // converting timestamp to string for easier query
        const data_at_9_02AM = await pool.query(`SELECT last_trade FROM ${stock_name} WHERE timestamp::text LIKE '${time_for_9_02AM}%'`)
        const data_at_9_15AM = await pool.query(`SELECT last_trade FROM ${stock_name} WHERE timestamp::text LIKE '${time_for_9_15AM}%'`)
        const data_at_9_30AM = await pool.query(`SELECT last_trade FROM ${stock_name} WHERE timestamp::text LIKE '${time_for_9_30AM}%'`)
        const data_at_10AM = await pool.query(`SELECT last_trade FROM ${stock_name} WHERE timestamp::text LIKE '${time_for_10AM}%'`)

        // Parsing the retrieved prices into float values, removing commas (if any)
        const price_at_9_02AM = parseFloat(data_at_9_02AM?.rows[0]?.last_trade.replace(/,/g, ''))
        const price_at_9_15AM = parseFloat(data_at_9_15AM?.rows[0]?.last_trade.replace(/,/g,''))
        const price_at_9_30AM = parseFloat(data_at_9_30AM?.rows[0]?.last_trade.replace(/,/g,''))
        const price_at_10AM = parseFloat(data_at_10AM?.rows[0]?.last_trade.replace(/,/g,''))
        // console.log(price_at_9_02AM,price_at_9_15AM,price_at_9_30AM,price_at_10AM)

        // If any price is NaN (not a valid number), we return early
        if(price_at_9_02AM===NaN || price_at_9_15AM===NaN || price_at_9_30AM===NaN || price_at_10AM===NaN){
            return 
        }

        // Calculating the percentage change in stock price between various time intervals
        const change_in_per_9_02AM_to_9_15AM = (((price_at_9_15AM-price_at_9_02AM)/price_at_9_02AM)*100).toFixed(2)
        const change_in_per_9_15AM_to_9_30AM = (((price_at_9_30AM-price_at_9_15AM)/price_at_9_15AM)*100).toFixed(2)
        const change_in_per_9_02AM_to_9_30AM = (((price_at_9_30AM-price_at_9_02AM)/price_at_9_02AM)*100).toFixed(2)
        const change_in_per_9_30AM_to_10AM = (((price_at_10AM-price_at_9_30AM)/price_at_9_30AM)*100).toFixed(2)
        const change_in_per_9_02AM_to_10AM = (((price_at_10AM-price_at_9_02AM)/price_at_9_02AM)*100).toFixed(2)
        // console.log(change_in_per_9_02AM_to_9_15AM,change_in_per_9_15AM_to_9_30AM,change_in_per_9_02AM_to_9_30AM,change_in_per_9_30AM_to_10AM,change_in_per_9_02AM_to_10AM)

        // SQL query to insert the calculated analytics into the database
        const query = `INSERT INTO groww_analytics(date, stock_name, interval_9_02am_to_9_15am, interval_9_15am_to_9_30am, interval_9_02am_to_9_30am, interval_9_30am_to_10am, interval_9_02am_to_10am)
                       VALUES($1,$2,$3,$4,$5,$6,$7)`
        await pool.query(query,[date,stock_name,change_in_per_9_02AM_to_9_15AM,change_in_per_9_15AM_to_9_30AM,change_in_per_9_02AM_to_9_30AM,change_in_per_9_30AM_to_10AM,change_in_per_9_02AM_to_10AM])

    } catch (error) {
        console.log(error)
        return error
    }
}

// Function to calculate analytics for multiple stocks with time intervals
const analyticsDataForMultipleCompanies = async () => {

    const stocks = [
      "tata_motors_ltd",
      "reliance_industries_ltd",
      "infosys_ltd",
      "tata_consultancy_services_ltd",
      "hdfc_nifty_smallcap_etf",
      "hdfc_bank_ltd",
      "state_bank_of_india",
      "icici_bank_ltd",
      "bajaj_finance_ltd",
      "bajaj_finserv_ltd",
      "larsen_toubro_ltd",
      "itc_ltd",
      "tata_steel_ltd",
      "jsw_steel_ltd",
      "adani_ports_and_special_economic_zone_ltd",
      "adani_enterprises_ltd",
    ];
  
    // Create an array of promises to run scraping tasks concurrently
    const analyticsPromises = stocks.map(async (stock) => {
      return groww_analytics(stock);
    });
  
    await Promise.all(analyticsPromises);
  };

module.exports = analyticsDataForMultipleCompanies