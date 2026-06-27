# Deployment Guide

## Requirements
- Google account
- Google Sheets
- Telegram bot
- Node.js
- npm
- clasp
- Git
## Project Structure
- vacation_tracker.js — core vacation management logic
- vacation_notifier.js — Telegram notification logic
- test_bot.js — Telegram connectivity testing
- appsscript.json — Apps Script manifest
- TODO.md — planned improvements and technical debt

## 1. Create Google Sheet
Create or copy a Google Sheet that will be used as the user-facing vacation tracker.
The sheet should contain the expected columns for employees, months, vacation start/end dates, and internal status fields.
## 2. Open Apps Script
In Google Sheets:
Extensions → Apps Script
## 3. Configure Script Properties
Open:
Project Settings → Script Properties
Add:
TELEGRAM_BOT_TOKEN = your Telegram bot token
TELEGRAM_CHAT_ID = your Telegram chat ID
ENABLE_OVERLAP_VALIDATION = true
## 4. Deploy code with clasp
From local project folder:
clasp login
clasp push

## 5. Set up triggers
In Apps Script:
Triggers → Add Trigger
Recommended trigger:

Function: checkVacationsAndNotify
Event source: Time-driven
Type: Week timer
## 6. Test Telegram
Run:
testTelegram()
Expected result:
A test notification appears in the configured Telegram chat.
## 7. Production check
Before using in production:
•	Check that Script Properties are configured. 
•	Check Telegram test notification. 
•	Check that the technical sheet exists. 
•	Check that vacation records are parsed correctly. 
•	Check that duplicate/overlap validation is enabled if needed.
## Security Notes
- Do not store Telegram tokens directly in source code.
- Store secrets in Script Properties.
- Do not commit `.clasp.json`.
- Do not store client-specific spreadsheet IDs in public repositories.
## Architecture Notes
- Google Sheets is used as the business-facing UI layer.
- Apps Script acts as the backend automation layer.
- Telegram is used for lightweight operational notifications.
- Script Properties are used for secret/config separation.



