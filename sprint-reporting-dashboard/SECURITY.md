# Security Notes

## Demo Repository Policy
This repository contains a demo version of an internal sprint reporting tool.
All production client data has been removed or anonymized.
---
## Removed From Demo
The demo version does NOT contain:
- production spreadsheet URLs;
- webhook endpoints;
- Bitrix integrations;
- API tokens;
- email credentials;
- Script Properties secrets;
- internal project names;
- client identifiers;
- production task links.
---
## Data Protection
All demo sprint data uses:

- fake project names;
- fake task links;
- anonymized developer names;
- anonymized manager names;
- synthetic notes and descriptions.
---
## Recommended Production Practices
For real production deployments:
- store secrets in Script Properties;
- avoid hardcoded credentials;
- restrict spreadsheet access;
- use separate demo environments;
- avoid exposing operational analytics publicly.
---
## Current Security Scope
This project is intended as:
- portfolio demonstration
- internal analytics example;
- Apps Script automation showcase.
It is not intended as a hardened enterprise analytics platform.
