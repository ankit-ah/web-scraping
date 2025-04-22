import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css"

function App() {
  const [sgxData, setSgxData] = useState([]);
  const [sgxLoading, setSgxLoading] = useState(true);
  const [sgxError, setSgxError] = useState(null);

  const [bseData, setBseData] = useState([]);
  const [bseLoading, setBseLoading] = useState(true);
  const [bseError, setBseError] = useState(null);

  const [comparisonData, setComparisonData] = useState([]);
  const [comparisonLoading, setComparisonLoading] = useState(true);
  const [comparisonError, setComparisonError] = useState(null);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [activeTab, setActiveTab] = useState("sgx");

  const formatDate = (date) => {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
  };

  const modifiedStartDate = formatDate(startDate.toLocaleDateString());
  const modifiedEndDate = formatDate(endDate.toLocaleDateString());

  useEffect(() => {
    axios.post('http://localhost:5000/sgx', { startDate: modifiedStartDate, endDate: modifiedEndDate })
      .then(response => {
        setSgxData(response.data);
        setSgxLoading(false);
      })
      .catch(err => {
        setSgxError(err.message);
        setSgxLoading(false);
      });
  }, [modifiedStartDate, modifiedEndDate]);

  useEffect(() => {
    axios.post('http://localhost:5000/bse-analytics', { startDate: modifiedStartDate, endDate: modifiedEndDate })
      .then(response => {
        setBseData(response.data);
        setBseLoading(false);
      })
      .catch(err => {
        setBseError(err.message);
        setBseLoading(false);
      });
  }, [modifiedStartDate, modifiedEndDate]);

  useEffect(() => {
    axios.post('http://localhost:5000/compare', { startDate: modifiedStartDate, endDate: modifiedEndDate })
      .then(response => {
        setComparisonData(response.data);
        setComparisonLoading(false);
      })
      .catch(err => {
        setComparisonError(err.message);
        setComparisonLoading(false);
      });
  }, [modifiedStartDate, modifiedEndDate]);

  const nameFormater = (name) => {
    const narr = name.split("-");
    return narr.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  };

  const tableStyle = {
    borderCollapse: "collapse",
    width: "100%",
    boxShadow: "0 0 8px rgba(0,0,0,0.1)"
  };

  const thStyle = {
    backgroundColor: "#1e293b",
    color: "#fff",
    padding: "10px",
    textAlign: "center",
    fontSize: "13px"
  };

  const tdStyle = {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    color: 'black',
    fontSize: "13px",
    textAlign: "center"
  };

  const renderSGXTable = () => (
    <>
      <h2>SGX Table</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Id</th>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>6:00AM to 7:00AM</th>
            <th style={thStyle}>7:00AM to 8:00AM</th>
            <th style={thStyle}>8:00AM to 9:00AM</th>
            <th style={thStyle}>6:00AM to 9:00AM</th>
          </tr>
        </thead>
        <tbody>
          {sgxData.map((item, index) => (
            <tr key={index + 1} style={{ backgroundColor: index % 2 === 0 ? "#f8fafc" : "#fff" }}>
              <td style={tdStyle}>{index + 1}</td>
              <td style={tdStyle}>{new Date(item.date).toLocaleDateString()}</td>
              <td style={tdStyle}>{formatCellValueBS(item["6AM_to_7AM"])}</td>
              <td style={tdStyle}>{formatCellValueBS(item["7AM_to_8AM"])}</td>
              <td style={tdStyle}>{formatCellValueBS(item["8AM_to_9AM"])}</td>
              <td style={tdStyle}>{formatCellValueBS(item["6AM_to_9AM"])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

  const renderBSETable = () => (
    <>
      <h2>Analytics Table</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Id</th>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Stock Name</th>
            <th style={thStyle}>09:02 AM to 09:15 AM</th>
            <th style={thStyle}>09:15 AM to 09:20 AM</th>
            <th style={thStyle}>09:20 AM to 09:25 AM</th>
            <th style={thStyle}>09:25 AM to 09:30 AM</th>
            <th style={thStyle}>09:15 AM to 09:30 AM</th>
            <th style={thStyle}>09:02 AM to 09:30 AM</th>
            <th style={thStyle}>09:30 AM to 10:00 AM</th>
            <th style={thStyle}>09:02 AM to 10:00 AM</th>
          </tr>
        </thead>
        <tbody>
          {bseData.map((item, index) => (
            <tr key={index + 1} style={{ backgroundColor: index % 2 === 0 ? "#f8fafc" : "#fff" }}>
              <td style={tdStyle}>{index + 1}</td>
              <td style={tdStyle}>{new Date(item.date).toLocaleDateString()}</td>
              <td style={tdStyle}>{nameFormater(item.stock_name)}</td>
              <td style={tdStyle}>{formatCellValueBS(item.interval_9_02am_to_9_15am)}</td>
              <td style={tdStyle}>{formatCellValueBS(item.interval_9_15am_to_9_20am)}</td>
              <td style={tdStyle}>{formatCellValueBS(item.interval_9_20am_to_9_25am)}</td>
              <td style={tdStyle}>{formatCellValueBS(item.interval_9_25am_to_9_30am)}</td>
              <td style={tdStyle}>{formatCellValueBS(item.interval_9_15am_to_9_30am)}</td>
              <td style={tdStyle}>{formatCellValueBS(item.interval_9_02am_to_9_30am)}</td>
              <td style={tdStyle}>{formatCellValueBS(item.interval_9_30am_to_10am)}</td>
              <td style={tdStyle}>{formatCellValueBS(item.interval_9_02am_to_10am)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

  const formatCellValue = (value) => {
    if (value === "+ve") {
      return <span style={{ color: "green" }}>+ve</span>;
    } else if (value === "-ve") {
      return <span style={{ color: "red" }}>-ve</span>;
    } else {
      return <span style={{ color: "gray" }}>N/A</span>;
    }
  };

  const formatCellValueBS = (value) => {
    if (value > 0) {
      return <span style={{ color: "green" }}>{value}</span>;
    } else if (value < 0) {
      return <span style={{ color: "red" }}>{value}</span>;
    } else if (value == 0) {
      return <span style={{ color: "black" }}>{value}</span>;
    } else {
      return <span style={{ color: "gray" }}>N/A</span>;
    }
  };

  const renderComparisonTable = () => (
    <>
      <h2>Compare Table</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Id</th>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Stock Name</th>
            <th style={thStyle}>09:02 AM to 09:15 AM</th>
            <th style={thStyle}>09:15 AM to 09:20 AM</th>
            <th style={thStyle}>09:20 AM to 09:25 AM</th>
            <th style={thStyle}>09:25 AM to 09:30 AM</th>
            <th style={thStyle}>09:15 AM to 09:30 AM</th>
            <th style={thStyle}>09:02 AM to 09:30 AM</th>
            <th style={thStyle}>09:30 AM to 10:00 AM</th>
            <th style={thStyle}>09:02 AM to 10:00 AM</th>
          </tr>
        </thead>
        <tbody>
          {comparisonData.map((item, index) => (
            <tr key={index + 1} style={{ backgroundColor: index % 2 === 0 ? "#f8fafc" : "#fff" }}>
              <td style={tdStyle}>{index + 1}</td>
              <td style={tdStyle}>{new Date(item.date).toLocaleDateString()}</td>
              <td style={tdStyle}>{nameFormater(item.stock_name)}</td>
              <td style={tdStyle}>{formatCellValue(item.interval_9_02am_to_9_15am)}</td>
              <td style={tdStyle}>{formatCellValue(item.interval_9_15am_to_9_20am)}</td>
              <td style={tdStyle}>{formatCellValue(item.interval_9_20am_to_9_25am)}</td>
              <td style={tdStyle}>{formatCellValue(item.interval_9_25am_to_9_30am)}</td>
              <td style={tdStyle}>{formatCellValue(item.interval_9_15am_to_9_30am)}</td>
              <td style={tdStyle}>{formatCellValue(item.interval_9_02am_to_9_30am)}</td>
              <td style={tdStyle}>{formatCellValue(item.interval_9_30am_to_10am)}</td>
              <td style={tdStyle}>{formatCellValue(item.interval_9_02am_to_10am)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

  return (
    <div style={{ display: "flex", fontFamily: "Arial, sans-serif" }}>
      {/* Sidebar */}
      <div style={{
        width: "220px",
        padding: "20px",
        background: "#1e293b",
        color: "#fff",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        overflowY: "auto",
      }}>
        <h2 style={{ color: "#fff", marginBottom: "30px" }}>Menu</h2>
        <button
          onClick={() => setActiveTab("sgx")}
          style={{
            marginBottom: "10px",
            width: "100%",
            padding: "10px",
            background: activeTab === "sgx" ? "#0ea5e9" : "#334155",
            color: "#fff",
            border: "none",
            cursor: "pointer"
          }}
        >
          SGX
        </button>
        <button
          onClick={() => setActiveTab("bse")}
          style={{
            width: "100%",
            marginBottom: '10px',
            padding: "10px",
            background: activeTab === "bse" ? "#0ea5e9" : "#334155",
            color: "#fff",
            border: "none",
            cursor: "pointer"
          }}
        >
          Stocks
        </button>
        <button
          onClick={() => setActiveTab("compare")}
          style={{
            width: "100%",
            padding: "10px",
            background: activeTab === "compare" ? "#0ea5e9" : "#334155",
            color: "#fff",
            border: "none",
            cursor: "pointer"
          }}
        >
          Price Comparison
        </button>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        padding: "20px",
        marginLeft: "270px",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}>
        <div style={{ marginBottom: "10px" }}>
          <h3 style={{ marginBottom: "5px", marginTop: "1px" }}>Select Date Range</h3>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{marginRight:"10px"}}>
              <DatePicker
                selected={startDate}
                onChange={(date) =>{ setStartDate(date)}}
                dateFormat='dd-MM-YYYY'
                className="custom-datepicker"
                maxDate={new Date()}
              />
            </div>
            <div>
              <DatePicker
                selected={endDate}
                onChange={(date) =>{ startDate<=date && setEndDate(date)}}
                dateFormat='dd-MM-YYYY'
                className="custom-datepicker"
                maxDate={new Date()}
              />
            </div>
          </div>
        </div>

        {sgxLoading || bseLoading || comparisonLoading ? (
          <div>Loading...</div>
        ) : sgxError || bseError || comparisonError ? (
          <div style={{ color: "red" }}>Error: {sgxError || bseError}</div>
        ) : (
          <>
            {activeTab === "sgx" && renderSGXTable()}
            {activeTab === "bse" && renderBSETable()}
            {activeTab === "compare" && renderComparisonTable()}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
