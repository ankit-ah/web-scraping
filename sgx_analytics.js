const pool = require('./config/db')
const { getDate } = require('./helpers/dateTransform') // Helper Function to get date in format (2025-04-15)

// Function to calculate SGX analytics with time intervals
const sgx_analytics = async () => {

    try {
        const date = getDate()

        // Defining the time intervals for the specific times we want to track
        const time_for_6AM = `${date} 06:00` // '2025-04-15 06:00'
        const time_for_7AM = `${date} 06:54` // change time to 07:00, due to unavailabilty of data taken 06:54
        const time_for_8AM = `${date} 08:00`
        const time_for_9AM = `${date} 09:00`
        // console.log(time_for_6AM,time_for_7AM,time_for_8AM,time_for_9AM)

        // Querying the database for the stock's price at these specific times
        // converting timestamp to string for easier query
        const data_at_6AM = await pool.query(`SELECT last_trade FROM sgx_nifty WHERE timestamp::text LIKE '${time_for_6AM}%'`)
        const data_at_7AM = await pool.query(`SELECT last_trade FROM sgx_nifty WHERE timestamp::text LIKE '${time_for_7AM}%'`)
        const data_at_8AM = await pool.query(`SELECT last_trade FROM sgx_nifty WHERE timestamp::text LIKE '${time_for_8AM}%'`)
        const data_at_9AM = await pool.query(`SELECT last_trade FROM sgx_nifty WHERE timestamp::text LIKE '${time_for_9AM}%'`)

        // Parsing the retrieved prices into float values, removing commas (if any)
        const price_at_6AM = parseFloat(data_at_6AM?.rows[0]?.last_trade.replace(/,/g, ''))
        const price_at_7AM = parseFloat(data_at_7AM?.rows[0]?.last_trade.replace(/,/g,''))
        const price_at_8AM = parseFloat(data_at_8AM?.rows[0]?.last_trade.replace(/,/g,''))
        const price_at_9AM = parseFloat(data_at_9AM?.rows[0]?.last_trade.replace(/,/g,''))
        // console.log(price_at_6AM,price_at_7AM,price_at_8AM,price_at_9AM)

        // Calculating the percentage change in stock price between various time intervals
        const change_in_per_6AM_to_7AM = (((price_at_7AM-price_at_6AM)/price_at_6AM)*100).toFixed(2)
        const change_in_per_7AM_to_8AM = (((price_at_8AM-price_at_7AM)/price_at_7AM)*100).toFixed(2)
        const change_in_per_8AM_to_9AM = (((price_at_9AM-price_at_8AM)/price_at_8AM)*100).toFixed(2)
        const change_in_per_6AM_to_9AM = (((price_at_9AM-price_at_6AM)/price_at_6AM)*100).toFixed(2)
        // console.log(change_in_per_6AM_to_7AM,change_in_per_7AM_to_8AM,change_in_per_8AM_to_9AM,change_in_per_6AM_to_9AM)

        // If any price is NaN (not a valid number), we return early
        if(change_in_per_6AM_to_7AM===NaN || change_in_per_7AM_to_8AM===NaN || change_in_per_8AM_to_9AM===NaN || change_in_per_6AM_to_9AM===NaN){
            return
        }

        // SQL query to insert the calculated analytics into the database
        const query = `INSERT INTO sgx_nifty_analytics(date,"6AM_to_7AM","7AM_to_8AM","8AM_to_9AM","6AM_to_9AM") VALUES($1,$2,$3,$4,$5)`
        await pool.query(query,[date,change_in_per_6AM_to_7AM,change_in_per_7AM_to_8AM,change_in_per_8AM_to_9AM,change_in_per_6AM_to_9AM])

    } catch (error) {
        console.log(error)
        return error
    }
}

module.exports = sgx_analytics