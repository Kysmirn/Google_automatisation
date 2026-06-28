# Deployment Guide

## Requirements

- Google account
- Google Sheets
- Google Apps Script
- clasp
- Git

---

## 1. Create a demo or production spreadsheet

Create a Google Sheet with the expected sprint planning structure:

- task link
- priority
- manager
- developer
- project
- notes
- planned hours
- actual workload

The `Developer` column is backend-controlled and should not be filled manually.

---

## 2. Add Apps Script code
Open:

Extensions → Apps Script
Add the code from:
src/capacity_planner.js

---

## 3. Configure the spreadsheet layout
The script uses the CONFIG section to map spreadsheet columns.
Default configuration:
LINK_COLUMN: 'A'
DEVELOPER_SOURCE_COLUMN: 'C'
DEVELOPER_TARGET_COLUMN: 'D'
HOURS_COLUMN: 'G'
WORKLOAD_COLUMN: 'H'
EMPTY_COLUMN: 'B'
START_ROW: 2

---

## 4. Prepare separator rows
Each developer block must start with a separator row.
Separator row rules:
•	developer name is placed in the manager/source column; 
•	task link column is empty; 
•	empty marker column is empty; 
•	the row contains no task data. 
Task rows below the separator are assigned to that developer automatically.

---

## 5. Run initial setup

In Google Sheets menu:
Sprint Automation → Update Full Table
Expected result:
•	developer names are populated automatically; 
•	workload values are calculated; 
•	separator rows contain total workload. 

---

## 6. Test after changes
After changing task rows or planned hours:
•	run Update Full Table; 
•	verify the Developer column; 
•	verify the Actual Workload values. 

---

## 7. Production notes
Before production use:
•	test on a copied spreadsheet first; 
•	anonymize demo data before screenshots or public sharing; 
•	do not modify production client sheets directly; 
•	keep production and demo spreadsheets separate.

