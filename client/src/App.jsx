import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [data2, setData2] = useState([]);
  const [loading2, setLoading2] = useState(true);
  const [error2, setError2] = useState(null);

  const [startDate, setStartDate] = useState(new Date())

  const formatDate = (date) => {
    const dateBreakdown = date.split('/')
    return `${dateBreakdown[2]}-${dateBreakdown[1]}-${dateBreakdown[0]}`
  }
  const modifiedDate = formatDate(startDate.toLocaleDateString())

  useEffect(() => {
    axios.post('http://localhost:5000/sgx',{date:modifiedDate}) 
      .then(response => {
        setData(response.data); 
        setLoading(false); 
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [modifiedDate]);

  useEffect(() => {
    axios.post('http://localhost:5000/bse_analytics',{date:modifiedDate})  
      .then(response => {
        setData2(response.data); 
        setLoading2(false); 
      })
      .catch(err => {
        setError2(err);
        setLoading2(false);
      });
  }, [modifiedDate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }


  if (loading2) {
    return <div>Loading...</div>;
  }

  if (error2) {
    return <div>{error2}</div>;
  }

  const nameFormater = (name) => {
    const narr = name.split("-")
    const capitalizedNarr = narr.map((word)=>{
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    return capitalizedNarr.join(" ")
  }

  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
    <div className="App" style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
    <div>
      <DatePicker selected={startDate} startDate={startDate} onChange={(date)=>setStartDate(date)}/>
    </div>
      <h2>SGX Table</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>6AM to 7AM</th>
            <th>7AM to 8AM</th>
            <th>8AM to 9AM</th>
            <th>6AM to 9AM</th>
            {/* <th>Created At</th> */}
          </tr>
        </thead>
        <tbody>
          {data.map((item,index) => (
            <tr key={index+1}>
              <td>{index+1}</td>
              <td>{new Date(item.date).toLocaleDateString()}</td>
              <td >{item["6AM_to_7AM"]}</td>
              <td>{item["7AM_to_8AM"]}</td>
              <td>{item["8AM_to_9AM"]}</td>
              <td>{item["6AM_to_9AM"]}</td>
              {/* <td>{new Date(item.created_at).toLocaleString()}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
        <div className="App" style={{display:"flex",flexDirection:"column",alignItems:"center",margin:"20px"}}>
        <h2>Analytics Table</h2>
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Stock Name</th>
              <th> 9:02 AM to 9:15 AM </th>
              <th>9:15 AM to 9:30 AM</th>
              <th>9:02 AM to 9:30 AM</th>
              <th>9:30 AM to 10:00 AM</th>
              <th>9:02 AM to 10:00 AM</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data2.map((item,index) => (
              <tr key={index+1}>
                <td>{index+1}</td>
                <td>{new Date(item.date).toLocaleDateString()}</td>
                <td>{nameFormater(item.stock_name)}</td>
                <td>{item.interval_9_02am_to_9_15am === "NaN" ? "N/A" : item.interval_9_02am_to_9_15am}</td>
                <td>{item.interval_9_15am_to_9_30am === "NaN" ? "N/A" : item.interval_9_15am_to_9_30am}</td>
                <td>{item.interval_9_02am_to_9_30am === "NaN" ? "N/A" : item.interval_9_02am_to_9_30am}</td>
                <td>{item.interval_9_30am_to_10am === "NaN" ? "N/A" : item.interval_9_30am_to_10am}</td>
                <td>{item.interval_9_02am_to_10am === "NaN" ? "N/A" : item.interval_9_02am_to_10am}</td>
                {/* <td>{new Date(item.created_at).toLocaleString()}</td> */}
                <td style={{color:item.interval_9_02am_to_10am>0? "green" : "red"}}>{item.interval_9_02am_to_10am > 0 ? "Profit": "Loss"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
