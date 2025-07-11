
# 📊 Stock Portfolio & Market Index Database

A MySQL-based relational database to track personal stock portfolios and maintain curated lists of top companies from major global stock indices. This system offers a structured backend for building stock tracking apps, conducting market analysis, or managing personal investment records.

---

## 📌 About the Project

This project provides a self-hosted, lightweight database schema for managing:

- User portfolios and watchlists
- Historical stock data
- Pre-loaded company lists from three major indices:
  - **S&P 100 (Top US Companies)**
  - **Nifty 100 (India – NSE)**
  - **Sensex Top 100 (India – BSE)**

All schemas and starter data are provided via a single SQL script for quick setup.

---

## 🛠️ Built With

- [MySQL](https://www.mysql.com/)
- [MySQL Workbench](https://www.mysql.com/products/workbench/) (or any SQL client of your choice)

---

## 🔑 Key Features

- **Relational Schema**  
  Link users, portfolios, watchlists, and stock history in a clean and scalable way.

- **Pre-populated Index Tables**  
  Includes 100 top companies each from S&P 100, Nifty 100, and Sensex 100.

- **Extensible Design**  
  Easy to extend for transactions, sectors, or fundamental stock data.

- **Standardized Tickers**  
  Uses formats like `.NS` for NSE and `.BO` for BSE for consistency.

---

## 🗂️ Database Schema Overview

**Database:** `stock_portfolio`

### Core Tables

- `users`: User credentials or metadata  
- `portfolio`: Stock holdings per user (with quantity and price)  
- `watchlist`: Stocks tracked by users  
- `stock_history`: For daily stock data (open, high, low, close)

### Index Tables

- `us_top_100`:  
  > Top 100 US companies  
  Columns: `id`, `company_name`, `ticker_symbol`

- `nifty_top_100`:  
  > Nifty 100 companies (India, NSE)  
  Columns: `id`, `company_name`, `ticker_symbol` (e.g., `RELIANCE.NS`)

- `sensex_top_100`:  
  > Sensex 100 companies (India, BSE)  
  Columns: `id`, `company_name`, `ticker_symbol` (e.g., `RELIANCE.BO`)

---

## 🚀 Getting Started

### 📋 Prerequisites

- [MySQL Server](https://dev.mysql.com/downloads/mysql/)
- (Optional) [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)

### ⚙️ Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your_username/your_repository_name.git
   ```

2. **Launch MySQL Workbench** or connect via terminal.

3. **Create the Database**
   ```sql
   CREATE DATABASE stock_portfolio;
   ```

4. **Run the SQL Script**
   Open `database_setup.sql`, select the `stock_portfolio` database, and execute the script to create and populate all tables.

---

## 📈 Usage Examples

```sql
-- View top 10 US companies
SELECT * FROM us_top_100 LIMIT 10;

-- Search for companies in Nifty 100 starting with 'Tata'
SELECT company_name, ticker_symbol FROM nifty_top_100 WHERE company_name LIKE 'Tata%';

-- Count total companies in Sensex 100
SELECT COUNT(*) AS total_companies FROM sensex_top_100;
```

---

## 🤝 Contact

Created by **Revanth Malagi**  
📧 [revanthmalagi@gmail.com](mailto:revanthmalagi@gmail.com)  
🌐 [LinkedIn – Revanth Malagi](https://www.linkedin.com/in/revanth-malagi/)
