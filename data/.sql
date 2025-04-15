-- To create SGX table

CREATE TABLE sgx_nifty (
    id SERIAL PRIMARY KEY,
    last_trade VARCHAR(20),
    change VARCHAR(20),
    change_in_perc VARCHAR(20),
	high VARCHAR(20),
	low VARCHAR(20),
	open VARCHAR(20),
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- To create stocks table

CREATE TABLE tata_motors_ltd (
    id SERIAL PRIMARY KEY,
    last_trade NUMERIC(10, 2),
    change NUMERIC(10, 2),
    change_in_perc NUMERIC(5, 2),
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reliance_industries_ltd (
    id SERIAL PRIMARY KEY,
    last_trade NUMERIC(10, 2),
    change NUMERIC(10, 2),
    change_in_perc NUMERIC(5, 2),
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE infosys_ltd (
    id SERIAL PRIMARY KEY,
    last_trade NUMERIC(10, 2),
    change NUMERIC(10, 2),
    change_in_perc NUMERIC(5, 2),
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tata_consultancy_services_ltd (
    id SERIAL PRIMARY KEY,
    last_trade NUMERIC(10, 2),
    change NUMERIC(10, 2),
    change_in_perc NUMERIC(5, 2),
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE hdfc_nifty_smallcap_etf (
    id SERIAL PRIMARY KEY,
    last_trade NUMERIC(10, 2),
    change NUMERIC(10, 2),
    change_in_perc NUMERIC(5, 2),
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE hdfc_bank_ltd (
    id SERIAL PRIMARY KEY,
    last_trade NUMERIC(10, 2),
    change NUMERIC(10, 2),
    change_in_perc NUMERIC(5, 2),
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE state_bank_of_india (
    id SERIAL PRIMARY KEY,
    last_trade NUMERIC(10, 2),
    change NUMERIC(10, 2),
    change_in_perc NUMERIC(5, 2),
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE icici_bank_ltd (
    id SERIAL PRIMARY KEY,
    last_trade NUMERIC(10, 2),
    change NUMERIC(10, 2),
    change_in_perc NUMERIC(5, 2),
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bajaj_finance_ltd (
    id SERIAL PRIMARY KEY,
    last_trade NUMERIC(10, 2),
    change NUMERIC(10, 2),
    change_in_perc NUMERIC(5, 2),
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bajaj_finserv_ltd (
    id SERIAL PRIMARY KEY,
    last_trade NUMERIC(10, 2),
    change NUMERIC(10, 2),
    change_in_perc NUMERIC(5, 2),
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE larsen_toubro_ltd (
    id SERIAL PRIMARY KEY,
    last_trade NUMERIC(10, 2),
    change NUMERIC(10, 2),
    change_in_perc NUMERIC(5, 2),
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE itc_ltd (
    id SERIAL PRIMARY KEY,
    last_trade NUMERIC(10, 2),
    change NUMERIC(10, 2),
    change_in_perc NUMERIC(5, 2),
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tata_steel_ltd (
    id SERIAL PRIMARY KEY,
    last_trade NUMERIC(10, 2),
    change NUMERIC(10, 2),
    change_in_perc NUMERIC(5, 2),
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE jsw_steel_ltd (
    id SERIAL PRIMARY KEY,
    last_trade NUMERIC(10, 2),
    change NUMERIC(10, 2),
    change_in_perc NUMERIC(5, 2),
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE adani_ports_and_special_economic_zone_ltd (
    id SERIAL PRIMARY KEY,
    last_trade NUMERIC(10, 2),
    change NUMERIC(10, 2),
    change_in_perc NUMERIC(5, 2),
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE adani_enterprises_ltd (
    id SERIAL PRIMARY KEY,
    last_trade NUMERIC(10, 2),
    change NUMERIC(10, 2),
    change_in_perc NUMERIC(5, 2),
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- To create analytics table

CREATE TABLE sgx_nifty_analytics (
    id SERIAL PRIMARY KEY,
    date DATE,
    "6AM_to_7AM" NUMERIC(5,2),
    "7AM_to_8AM" NUMERIC(5,2),
    "8AM_to_9AM" NUMERIC(5,2),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE groww_analytics (
    id SERIAL PRIMARY KEY,
    date DATE,
    stock_name VARCHAR(100),
    interval_9_02AM_to_9_15AM NUMERIC(5,2),
    interval_9_15AM_to_9_30AM NUMERIC(5,2),
    interval_9_02AM_to_9_30AM NUMERIC(5,2),
    interval_9_30AM_to_10AM NUMERIC(5,2),
    interval_9_02AM_to_10AM NUMERIC(5,2),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
)

CREATE TABLE bse_analytics (
    id SERIAL PRIMARY KEY,
    date DATE,
    stock_name VARCHAR(100),
    interval_9_02AM_to_9_15AM NUMERIC(5,2),
    interval_9_15AM_to_9_30AM NUMERIC(5,2),
    interval_9_02AM_to_9_30AM NUMERIC(5,2),
    interval_9_30AM_to_10AM NUMERIC(5,2),
    interval_9_02AM_to_10AM NUMERIC(5,2),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
)

-- To create BSE scrape table

CREATE TABLE bse_scrape (
    id SERIAL PRIMARY KEY,
    last_trade VARCHAR(20),
    change VARCHAR(20),
    date DATE,
	stock_name VARCHAR(100),
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- To get table data in descending order

SELECT * FROM adani_ports_and_special_economic_zone_ltd ORDER BY id DESC

SELECT * FROM tata_motors_ltd ORDER BY id DESC

SELECT * FROM tata_steel_ltd ORDER BY id DESC

SELECT * FROM reliance_industries_ltd ORDER BY id DESC

SELECT * FROM infosys_ltd ORDER BY id DESC

SELECT * FROM tata_consultancy_services_ltd ORDER BY id DESC

SELECT * FROM hdfc_nifty_smallcap_etf ORDER BY id DESC

SELECT * FROM hdfc_bank_ltd ORDER BY id DESC

SELECT * FROM state_bank_of_india ORDER BY id DESC

SELECT * FROM icici_bank_ltd ORDER BY id DESC

SELECT * FROM bajaj_finance_ltd ORDER BY id DESC

SELECT * FROM bajaj_finserv_ltd ORDER BY id DESC

SELECT * FROM larsen_toubro_ltd ORDER BY id DESC

SELECT * FROM itc_ltd ORDER BY id DESC

SELECT * FROM tata_steel_ltd ORDER BY id DESC

SELECT * FROM jsw_steel_ltd ORDER BY id DESC

SELECT * FROM adani_enterprises_ltd ORDER BY id DESC

select * from groww_analytics ORDER BY id DESC

select * from sgx_nifty_analytics ORDER BY id DESC
