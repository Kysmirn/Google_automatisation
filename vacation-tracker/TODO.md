# TODO

## Notifications

- Replace legacy even-week test logic with configurable notification scheduling.
- Support two modes:
  - TRIGGER: send when time-driven trigger runs.
  - INTERVAL: send only if configured interval has passed.
- Store settings in Script Properties:
  - NOTIFICATION_MODE
  - NOTIFICATION_INTERVAL_DAYS
  - LAST_NOTIFICATION_SENT_AT

## UI / Menus

- Merge duplicate onOpen() functions into one entry point.
- Split menu creation into helper functions:
  - buildVacationMenu_()
  - buildStatisticsMenu_()
- Make sure all project menus are visible after spreadsheet open.

## Security

- Keep Telegram token and chat ID only in Script Properties.
- Do not commit secrets, tokens, private spreadsheet IDs, or client data.