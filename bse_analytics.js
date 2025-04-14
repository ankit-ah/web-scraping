const pool = require('./config/db')
const { getDate } = require('./helpers/dateTransform')

const bse_analytics = async (stock_name) => {

    try {
        // Getting the current date in the required format
        const date = getDate()

        // Defining the time intervals for the specific times we want to track
        const time_for_9_02AM = `${date} 09:02`
        const time_for_9_15AM = `${date} 09:15`
        const time_for_9_30AM = `${date} 09:30`
        const time_for_10AM = `${date} 10:00`

        console.log(time_for_9_02AM,time_for_9_15AM,time_for_9_30AM,time_for_10AM)

        // Querying the database for the stock's price at these specific times
        // converting timestamp to string for easier query
        const data_at_9_02AM = await pool.query(`SELECT last_trade FROM bse_scrape WHERE timestamp::text LIKE '${time_for_9_02AM}%' AND stock_name='${stock_name}'`)
        const data_at_9_15AM = await pool.query(`SELECT last_trade FROM bse_scrape WHERE timestamp::text LIKE '${time_for_9_15AM}%' AND stock_name='${stock_name}'`)
        const data_at_9_30AM = await pool.query(`SELECT last_trade FROM bse_scrape WHERE timestamp::text LIKE '${time_for_9_30AM}%' AND stock_name='${stock_name}'`)
        const data_at_10AM = await pool.query(`SELECT last_trade FROM bse_scrape WHERE timestamp::text LIKE '${time_for_10AM}%' AND stock_name='${stock_name}'`)
        // console.log(stock_name,"-", data_at_9_02AM.rows[0],data_at_9_15AM.rows[0],data_at_9_30AM.rows[0],data_at_10AM.rows[0])

        // Parsing the retrieved prices into float values, removing commas (if any)
        const price_at_9_02AM = parseFloat(data_at_9_02AM?.rows[0]?.last_trade.replace(/,/g, ''))
        const price_at_9_15AM = parseFloat(data_at_9_15AM?.rows[0]?.last_trade.replace(/,/g,''))
        const price_at_9_30AM = parseFloat(data_at_9_30AM?.rows[0]?.last_trade.replace(/,/g,''))
        const price_at_10AM = parseFloat(data_at_10AM?.rows[0]?.last_trade.replace(/,/g,''))

        console.log(price_at_9_02AM,price_at_9_15AM,price_at_9_30AM,price_at_10AM)

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

        console.log(change_in_per_9_02AM_to_9_15AM,change_in_per_9_15AM_to_9_30AM,change_in_per_9_02AM_to_9_30AM,change_in_per_9_30AM_to_10AM,change_in_per_9_02AM_to_10AM)

        // SQL query to insert the calculated analytics into the database
        const query = `INSERT INTO bse_analytics(date, stock_name, interval_9_02am_to_9_15am, interval_9_15am_to_9_30am, interval_9_02am_to_9_30am, interval_9_30am_to_10am, interval_9_02am_to_10am)
                       VALUES($1,$2,$3,$4,$5,$6,$7)`
        await pool.query(query,[date,stock_name,change_in_per_9_02AM_to_9_15AM,change_in_per_9_15AM_to_9_30AM,change_in_per_9_02AM_to_9_30AM,change_in_per_9_30AM_to_10AM,change_in_per_9_02AM_to_10AM])

    } catch (error) {
        console.log(error)
        return error
    }
}

const analyticsDataForMultipleCompanies = async () => {

    const stocks = [
        {name:"tata-motors-ltd"},
        {name:"reliance-industries-ltd"},
        {name:"infosys-ltd"},
        {name:"tata-consultancy-services-ltd"},
        {name:"hdfc-bank-ltd"},
        {name:"state-bank-of-india"},
        {name:"icici-bank-ltd"},
        {name:"bajaj-finance-ltd"},
        {name:"bajaj-finserv-ltd"},
        {name:"larsen--toubro-ltd"},
        {name:"itc-ltd"},
        {name:"tata-steel-ltd"},
        {name:"jsw-steel-ltd"},
        {name:"adani-ports-and-special-economic-zone-ltd"},
        {name:"adani-enterprises-ltd"},
      ];
    const analyticsPromises = stocks.map(async (stock) => {
      return bse_analytics(stock.name);
    });
  
    await Promise.all(analyticsPromises);
  };

//   analyticsDataForMultipleCompanies()
module.exports = analyticsDataForMultipleCompanies