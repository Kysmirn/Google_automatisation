# Vacation Tracker Automation

Google Apps Script automation for managing employee vacation records in Google Sheets and sending Telegram notifications.

## What it does

- Uses Google Sheets as a lightweight business UI.
- Tracks employee vacation periods.
- Sends Telegram reminders about upcoming vacations.
- Stores sensitive configuration in Script Properties.
- Supports a technical/backend sheet separated from the user-facing sheet.
- Includes helper functions for testing Telegram connectivity.

## Stack

- Google Sheets
- Google Apps Script
- Telegram Bot API
- clasp
- Git / GitHub

## Security

Telegram bot token and chat ID are not stored in source code.

They are stored in Google Apps Script Properties:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

## Project structure

```text
vacation-tracker/
├── appsscript.json
├── test_bot.js
├── vacation_notifier.js
├── vacation_tracker.js
├── TODO.md
└── README.md