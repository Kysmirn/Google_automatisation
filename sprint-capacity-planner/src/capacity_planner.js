/**
 * АВТОМАТИЗАЦИЯ СПРИНТ-ТАБЛИЦЫ
 * Версия: 1.0
 */

// ========== НАСТРОЙКИ ==========
const CONFIG = {
  SHEET_NAME: '',
  LINK_COLUMN: 'A',
  DEVELOPER_SOURCE_COLUMN: 'C',
  DEVELOPER_TARGET_COLUMN: 'D',
  HOURS_COLUMN: 'G',
  WORKLOAD_COLUMN: 'H',
  EMPTY_COLUMN: 'B',
  START_ROW: 2
};

// ========== ОСНОВНАЯ ФУНКЦИЯ ==========
function onEdit(e) {
  const sheet = e.source.getActiveSheet();

  if (CONFIG.SHEET_NAME && sheet.getName() !== CONFIG.SHEET_NAME) {
    return;
  }

  updateDeveloperNames(sheet);
  updateWorkload(sheet);
}

// ========== ФУНКЦИЯ 1: Копирование имен разработчиков ==========
function updateDeveloperNames(sheet) {
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  }

  const lastRow = sheet.getLastRow();
  if (lastRow < CONFIG.START_ROW) return;

  const linkCol = columnToIndex(CONFIG.LINK_COLUMN);
  const nameSourceCol = columnToIndex(CONFIG.DEVELOPER_SOURCE_COLUMN);
  const nameTargetCol = columnToIndex(CONFIG.DEVELOPER_TARGET_COLUMN);
  const emptyCol = columnToIndex(CONFIG.EMPTY_COLUMN);

  const range = sheet.getRange(
    CONFIG.START_ROW,
    1,
    lastRow - CONFIG.START_ROW + 1,
    Math.max(linkCol, nameSourceCol, nameTargetCol, emptyCol)
  );

  const values = range.getValues();

  let currentDeveloper = '';

  for (let i = 0; i < values.length; i++) {
    const row = values[i];

    const linkCell = row[linkCol - 1];
    const emptyCell = row[emptyCol - 1];
    const nameSourceCell = row[nameSourceCol - 1];

    const isSeparator = !linkCell && !emptyCell;

    if (isSeparator) {
      currentDeveloper = nameSourceCell || '';
      values[i][nameTargetCol - 1] = '';
    } else if (linkCell) {
      values[i][nameTargetCol - 1] = currentDeveloper;
    }
  }

  range.setValues(values);
}

// ========== ФУНКЦИЯ 2: Расчет занятости ==========
function updateWorkload(sheet) {
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  }

  const lastRow = sheet.getLastRow();
  if (lastRow < CONFIG.START_ROW) return;

  const linkCol = columnToIndex(CONFIG.LINK_COLUMN);
  const nameSourceCol = columnToIndex(CONFIG.DEVELOPER_SOURCE_COLUMN);
  const nameTargetCol = columnToIndex(CONFIG.DEVELOPER_TARGET_COLUMN);
  const hoursCol = columnToIndex(CONFIG.HOURS_COLUMN);
  const workloadCol = columnToIndex(CONFIG.WORKLOAD_COLUMN);
  const emptyCol = columnToIndex(CONFIG.EMPTY_COLUMN);

  const range = sheet.getRange(
    CONFIG.START_ROW,
    1,
    lastRow - CONFIG.START_ROW + 1,
    Math.max(
      linkCol,
      nameSourceCol,
      nameTargetCol,
      hoursCol,
      workloadCol,
      emptyCol
    )
  );

  const values = range.getValues();

  for (let i = 0; i < values.length; i++) {
    const row = values[i];

    const linkCell = row[linkCol - 1];
    const emptyCell = row[emptyCol - 1];
    const developerName = row[nameSourceCol - 1];

    const isSeparator = !linkCell && !emptyCell;

    if (isSeparator && developerName) {
      let totalHours = 0;

      for (let j = 0; j < values.length; j++) {
        const taskRow = values[j];

        const taskLink = taskRow[linkCol - 1];
        const taskDeveloper = taskRow[nameTargetCol - 1];
        const taskHours = parseFloat(taskRow[hoursCol - 1]) || 0;

        if (taskLink && taskDeveloper === developerName) {
          totalHours += taskHours;
        }
      }

      values[i][workloadCol - 1] = totalHours || '';
    }
  }

  range.setValues(values);
}

// ========== ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ==========
function columnToIndex(column) {
  let index = 0;

  for (let i = 0; i < column.length; i++) {
    index =
      index * 26 +
      (column.charCodeAt(i) - 'A'.charCodeAt(0) + 1);
  }

  return index;
}

// ========== РУЧНОЙ ЗАПУСК ==========
function runInitialSetup() {
  const sheet =
    SpreadsheetApp
      .getActiveSpreadsheet()
      .getActiveSheet();

  updateDeveloperNames(sheet);
  updateWorkload(sheet);

  SpreadsheetApp
    .getUi()
    .alert('✅ Table updated successfully!');
}

// ========== МЕНЮ ==========
function onOpen() {
  const ui = SpreadsheetApp.getUi();

  ui.createMenu('🚀 Sprint Automation')
    .addItem(
      '▶️ Update Full Table',
      'runInitialSetup'
    )
    .addItem(
      '👤 Update Developers',
      'updateDeveloperNames'
    )
    .addItem(
      '⏱️ Update Workload',
      'updateWorkload'
    )
    .addToUi();
}