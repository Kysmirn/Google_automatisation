# Sprint Reporting Dashboard

## What problem it solves
Small teams often manage sprint work in Google Sheets, but manual reporting quickly becomes unreliable.
This project turns sprint sheets into an automated reporting dashboard with developer and project statistics.
It helps answer:
- how many tasks were solved;
- how many tasks remain in backlog;
- which developers have unresolved work;
- which projects generate the most unresolved tasks;
- what changed in the latest sprint.
---
## Features
- Automatic sprint sheet detection by date-based sheet names
- Backend-controlled task status calculation
- Developer-level statistics across all sprints
- Developer-level statistics for the latest sprint
- Project-level statistics for the latest sprint
- Automatic report sheet generation
- Google Sheets chart generation
- Manual analytics menu for non-technical users
- Locale-independent status logic
---
## Stack
- Google Sheets
- Google Apps Script
- JavaScript
- clasp
- Git / GitHub
---
## Architecture
Google Sheets is used as the main operational UI.
Each sprint is represented as a separate sheet named in the following format:
dd.mm-dd.mm
Example:
02.06-09.06
09.06-16.06
16.06-23.06
The script automatically detects sprint sheets, sorts them by date, and uses the latest sprint for current-period analytics.

###  Data model


####  Expected sprint sheet columns:
Developer | Task | Priority | Manager | Backlog | Project | Notes | Status

#### Backend-controlled status
The Status column is calculated by Apps Script.
Rules:

Backlog = Yes → Unsolved
Backlog = No or empty → Solved
This replaces fragile spreadsheet formulas and makes the automation independent from spreadsheet locale.

#### Reporting layer
The script generates a dedicated report sheet:
Sprint Analytics
The report includes:
•	overall developer statistics across all sprints; 
•	latest sprint statistics by developer; 
•	latest sprint statistics by project; 
•	charts for each report section. 

---

## Deployment

See DEPLOYMENT.md
---

## Security
•	No secrets stored in source code 
•	No external credentials required 
•	No production client data included 
•	Demo data is anonymized 
•	Production spreadsheets should remain private 

---

## Future improvements
•	Configurable sprint naming pattern 
•	Configurable status rules 
•	Dashboard formatting improvements 
•	Automatic trend reports 
•	Export to PDF 
•	Scheduled reporting 
•	Email or Telegram delivery 
•	Additional project-level analytics

