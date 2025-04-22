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

