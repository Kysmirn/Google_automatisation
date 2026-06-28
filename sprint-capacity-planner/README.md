# Sprint Capacity Planner

## What problem it solves
Small development teams often use Google Sheets for sprint planning, but manual workload tracking quickly becomes error-prone.
This project automates:
- developer workload calculation;
- task grouping;
- developer assignment;
- sprint capacity visibility.
The spreadsheet acts as the main UI layer, while Google Apps Script provides backend automation logic.-
--
## Features
- Automatic developer assignment from separator rows
- Automatic workload calculation
- Lightweight sprint planning workflow
- Structured developer grouping
- Batch processing using Apps Script
- Configurable spreadsheet structure
- Manual refresh menu for non-technical users
---
## Stack
- Google Sheets
- Google Apps Script
- JavaScript
- clasp
- Git / GitHub
---
## Architecture
The spreadsheet itself is the primary UI and source of truth.
### Separator rows
Colored separator rows define developer groups.
These rows
- contain the developer name;
- act as logical block headers;
- contain no task data.
### Task rows

Task rows contain:
- task links;
- managers;
- project names;
- notes;
- planned hours.
The `Developer` column is automatically populated by Apps Script based on the nearest separator row above.
This reduces manual input and prevents assignment inconsistencies.
---
## Deployment
See:
- `DEPLOYMENT.md`
---
## Security
- No secrets stored in source code
- No production client data included
- Demo environment uses anonymized test data
- Production spreadsheets should remain private
---
## Future improvements
- Sprint overload validation
- Capacity limit warnings
- Telegram notifications
- Dashboard/reporting layer
- Validation for incorrect row structures
- Configurable sprint capacity per developer
- Improved user feedback alerts
