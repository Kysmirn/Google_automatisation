# Security Notes

## Demo Environment

This repository uses anonymized demo data only.
The public version of the project does not contain:
- real client information;
- real project names;
- internal URLs;
- production sprint data;
- sensitive operational information.
---
## Production Usage
Production spreadsheets should remain private.
Before sharing screenshots, repositories, or demo copies:
- remove client-specific information;
- anonymize task descriptions;
- replace internal links with placeholder URLs;
- remove historical sprint data.
---
## Backend-Controlled Fields
The `Developer` column is backend-controlled and populated automatically by Apps Script.
Manual editing of this column is discouraged.

Recommended production setup:
- hide the technical column;
- protect backend-controlled ranges.
---
## Safe Testing Workflow
Do not modify production spreadsheets directly.
Recommended workflow:
1. Create a full spreadsheet copy
2. Test changes in the copied environment
3. Validate automation behavior
4. Apply verified changes to production
---
## Source Code Safety
This project currently does not store:
- API keys
- tokens
- external credentials
If external integrations are added later:
- store secrets in Script Properties;
- never commit secrets into Git repositories.
---
## Portfolio Usage
This repository is intended for:
- portfolio presentation;
- architecture demonstration;
- workflow examples;
- automation case studies.
It is not intended to expose production business operations.
