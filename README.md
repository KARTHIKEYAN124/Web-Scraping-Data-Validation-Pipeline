# Web-Scraping-Data-Validation-Pipeline
This project demonstrates a real-world backend workflow using TypeScript, where data is scraped from a website, validated, and processed into structured outputs with simulated JIRA ticket generation.
🚀 Web Scraping & Data Validation Pipeline (TypeScript)

This project demonstrates a real-world backend workflow using TypeScript, where data is scraped from a website, validated, and processed into structured outputs with simulated JIRA ticket generation.

📌 Overview

The application scrapes product data from a demo e-commerce website and performs validation checks to ensure data quality.

✅ Extracts product title and price
✅ Filters valid products
❌ Detects invalid products
📝 Generates JIRA-style error reports
⚙️ Tech Stack
TypeScript
Node.js
Axios (HTTP requests)
Cheerio (HTML parsing)
🔄 Workflow
Scraping Phase
Fetch HTML content from books.toscrape.com
Parse DOM using Cheerio
Extract product details (title, price)
Validation Phase
Check for:
Missing title
Price below threshold (< £20)
Processing Phase
Valid products → Logged as clean data
Invalid products → Converted into structured JIRA tickets
📊 Sample Output
Scraping website.....

Valid Product: A Light in the Attic
Valid Product: Tipping the Velvet

======JIRA TICKET========
Summary: Invalid product: The Coming Woman
Description:
 Errors:
Price is too low (<20)
==================
🧠 Key Features
🔍 Real-time data scraping
🧹 Data cleaning and validation
⚠️ Error handling and reporting
🧾 JIRA-style ticket simulation
📦 Modular TypeScript architecture
🎯 Use Cases
Backend data pipelines
Content aggregation systems
Data quality validation workflows
ETL (Extract, Transform, Load) processes
📁 Project Structure
src/
 ├── index.ts        # Entry point (validation + logging)
 └── scraper.ts      # Scraping logic
▶️ How to Run
npm install
npx ts-node src/index.ts
💡 Learning Outcomes

This project demonstrates:

How to build a web scraper using TypeScript
Handling real-world messy data
Implementing data validation pipelines
Structuring backend code for scalability
Simulating production-level error tracking systems
🔥 Future Improvements
Add pagination support (scrape multiple pages)
Store results in a database (MongoDB/PostgreSQL)
Export data to JSON/CSV
Integrate real JIRA API
Add retry & rate-limiting mechanisms
