// =============================================================
// vacation_notifier.gs — FINAL STABLE VERSION
// Полная версия с фиксом Date-object из Google Sheets
// =============================================================

// =============================================================
// Проверка отпусков
// =============================================================

function checkVacationsAndNotify() {

  // =========================================================
  // Проверка чётности недели
  // =========================================================

  const now = new Date();

  const startOfYear =
    new Date(now.getFullYear(), 0, 1);

  const daysPassed = Math.floor(
    (
      now.getTime() -
      startOfYear.getTime()
    ) / (24 * 60 * 60 * 1000)
  );

  const weekNumber =
    Math.ceil((daysPassed + 1) / 7);

  // =========================================================
  // ВРЕМЕННО ОТКЛЮЧЕНО ДЛЯ ТЕСТОВ
  // =========================================================

  const result =
  getUpcomingVacationsMessage_();

Logger.log(
  JSON.stringify(result)
);


  if (result && result.message) {

    sendTelegramNotification_(
  result.message
);

    result.upcoming.forEach(v => {

   SpreadsheetApp
  .getActiveSpreadsheet()
  .getSheetByName(TECH_SHEET)
  .getRange(v.rowIndex, 4)
  .setValue('YES');

  });


  } else {

    Logger.log(
      'Предстоящих отпусков нет ' +
      'в окне ' +
      DAYS_AHEAD +
      ' дней.'
    );
  }
}

// =============================================================
// Формирование сообщения
// =============================================================

function getUpcomingVacationsMessage_() {

  const sheet =
    SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(TECH_SHEET);

  if (!sheet) {

    Logger.log(
      'Лист ' +
      TECH_SHEET +
      ' не найден.'
    );

    return 'Ошибка: не найден лист данных.';
  }

  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    return null;
  }

  const data = sheet
    .getRange(2, 1, lastRow - 1, 4)
    .getDisplayValues();

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const limit = new Date(today);

  limit.setDate(
    today.getDate() + DAYS_AHEAD
  );

  const upcoming = [];

  data.forEach((row, i) => {

    const name = row[0];

    const sd =
      parseDdMmYyyy_(row[1]);

    const ed =
      parseDdMmYyyy_(row[2]);

      const notified = row[3];
      

    // =====================================================
    // DEBUG LOG
    // =====================================================

    Logger.log(
      'Проверка: ' +
      name +
      ' | start=' +
      sd +
      ' | end=' +
      ed
    );

    if (
      name &&
      sd &&
      sd >= today &&
      sd < limit &&
      notified !== 'YES'
    ) {

      upcoming.push({

  name,
  startStr: fmtDate(sd),
  endStr: fmtDate(ed),
  sd,
  rowIndex : i + 2

});
    }
  });

  if (!upcoming.length) {

    Logger.log(
      'Подходящих отпусков не найдено.'
    );

    return null;
  }

  upcoming.sort(
    (a, b) => a.sd - b.sd
  );

  let msg =
    '🌴 Напоминание об отпусках:\n\n';

  upcoming.forEach(v => {

    msg +=
      '• ' +
      v.name +
      ' уходит в отпуск с ' +
      v.startStr +
      ' по ' +
      v.endStr +
      '\n';
  });

  Logger.log(
    'Сообщение сформировано:\n' + msg
  );

  return {
  message : msg,
  upcoming
};
}

// =============================================================
// ПАРСИНГ ДАТ
// ГЛАВНЫЙ FIX:
// поддержка Date-object из Google Sheets
// =============================================================

function parseDdMmYyyy_(txt) {

  // =========================================================
  // Date-object из Google Sheets
  // =========================================================

  if (
    txt instanceof Date &&
    !isNaN(txt.getTime())
  ) {

    txt.setHours(0, 0, 0, 0);

    return txt;
  }

  // =========================================================
  // Строка
  // =========================================================

  if (
    !txt ||
    typeof txt !== 'string'
  ) {

    return null;
  }

  const m = txt.match(
    /^(\d{2})\.(\d{2})\.(\d{4})$/
  );

  if (!m) {
    return null;
  }

  const d = new Date(
    Number(m[3]),
    Number(m[2]) - 1,
    Number(m[1])
  );

  d.setHours(0, 0, 0, 0);

  return isNaN(d.getTime())
    ? null
    : d;
}

// =============================================================
// Telegram API
// =============================================================

function sendTelegramNotification_(text) {

  const sp =
    PropertiesService
      .getScriptProperties();

  const botToken =
    sp.getProperty(
      'TELEGRAM_BOT_TOKEN'
    );

  const chatId =
    sp.getProperty(
      'TELEGRAM_CHAT_ID'
    );

  if (!botToken || !chatId) {

    Logger.log(
      'Нет TELEGRAM_BOT_TOKEN ' +
      'или TELEGRAM_CHAT_ID'
    );

    return;
  }

  // =========================================================
  // Правильный URL
  // =========================================================

  const apiUrl =
    'https://api.telegram.org/bot' +
    botToken +
    '/sendMessage';

  const payload = {

    method: 'post',

    contentType: 'application/json',

    payload: JSON.stringify({

      chat_id: chatId,

      text: text

    }),

    muteHttpExceptions: true
  };

  try {

    const response =
      UrlFetchApp.fetch(
        apiUrl,
        payload
      );

    Logger.log(
      response.getContentText()
    );

    Logger.log(
      'Уведомление отправлено.'
    );

  } catch (err) {

    Logger.log(
      'Ошибка отправки: ' + err
    );
  }
}

// =============================================================
// Ручной тест Telegram
// =============================================================

function testTelegramNow() {

  sendTelegramNotification_(
    '✅ Тест Telegram работает'
  );
}
function onOpen() {

  SpreadsheetApp
    .getUi()
    .createMenu('🌴 Vacation System')

    .addItem(
      'Rebuild Tech Table',
      'runRebuild'
    )

    .addItem(
      'Apply Protection',
      'applyProtection'
    )

    .addSeparator()

    .addItem(
      'Send Test Notification',
      'checkVacationsAndNotify'
    )
    .addSeparator()

  .addItem(
    'Enable Overlap Validation',
    'enableOverlapValidation'
  )

  .addItem(
    'Disable Overlap Validation',
    'disableOverlapValidation'
  )

    .addToUi();
}
// =============================================================
// TEST NOTIFICATION
// Отдельная тестовая отправка Telegram уведомления.
// НЕ использует production vacation logic.
// Нужна для проверки:
// - Telegram connectivity
// - Bot permissions
// - Notification pipeline
// =============================================================

function sendTestNotification() {

  sendTelegramNotification(
    '✅ Vacation System test notification.'
  );

  SpreadsheetApp
    .getUi()
    .alert(
      'Test notification sent.'
    );
}