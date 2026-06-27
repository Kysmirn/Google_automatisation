// =============================================================
// vacation_tracker_fixed.gs
// FINAL STABLE VERSION
// =============================================================

const TECH_SHEET = 'Техтаблица';
const DAYS_AHEAD = 14;

const MONTHS = {
  'январь':0,'февраль':1,'март':2,'апрель':3,
  'май':4,'июнь':5,'июль':6,'август':7,
  'сентябрь':8,'октябрь':9,'ноябрь':10,'декабрь':11
};

function onEdit(e) {

  try {

    const sheet = e.range.getSheet();
    const sheetName = sheet.getName();

    if (!/^\d{4}$/.test(sheetName)) return;

    const row = e.range.getRow();
    const col = e.range.getColumn();

    // C,D only
    if (col !== 3 && col !== 4) return;

    normalizeDatesOnEdit(e);

    validateRow(sheet, row);

    rebuildAll();

  } catch(err) {

    Logger.log(err);

  }
}

function normalizeDatesOnEdit(e) {

  const range = e.range;

  const raw = String(range.getValue()).trim();

  if (!raw) return;

  const match = raw.match(/^(\d{1,2})$/);

  if (!match) {

    range.clearContent();
    return;
  }

  const day = Number(match[1]);

  if (day < 1 || day > 31) {

    range.clearContent();
    return;
  }

  range.setValue(day);
}

function getMonthForRow(sheet, row) {

  for (let r = row; r >= 1; r--) {

    const value = String(
      sheet.getRange(r, 2).getValue()
    )
      .trim()
      .toLowerCase();

    if (
      MONTHS.hasOwnProperty(value)
    ) {
      return value;
    }
  }

  return null;
}

function validateRow(sheet, row) {

  const values = sheet
    .getRange(row,1,1,6)
    .getValues()[0];

  const employee = values[0];
  const monthVal = values[1];
  const startVal = values[2];
  const endVal   = values[3];

  const statusCell = sheet.getRange(row,6);

  statusCell.clearContent();

  const monthKey =
    String(monthVal)
      .trim()
      .toLowerCase();

  if (MONTHS.hasOwnProperty(monthKey)) return;

  if (!employee && !startVal && !endVal) return;

  if (
    startVal &&
    (isNaN(startVal) || startVal < 1 || startVal > 31)
  ) {

    statusCell.setValue(
      'Ошибка: Некорректная дата начала.'
    );

    return;
  }

  if (
    endVal &&
    (isNaN(endVal) || endVal < 1 || endVal > 31)
  ) {

    statusCell.setValue(
      'Ошибка: Некорректная дата окончания.'
    );

    return;
  }

  if (
    startVal &&
    endVal &&
    Number(startVal) > Number(endVal)
  ) {

    statusCell.setValue(
      'Ошибка: Дата окончания меньше даты начала.'
    );

    return;
  }

// =========================================================
  // OVERLAP VALIDATION
  // =========================================================

  if (
    isOverlapValidationEnabled()
  ) {

    const data =
      sheet.getDataRange().getValues();

   const currentMonth =
  getMonthForRow(sheet, row);

    for (
      let i = 1;
      i < data.length;
      i++
    ) {

      // skip current row
      if (i + 1 === row) {
        continue;
      }

      const other = data[i];

      const otherEmployee =
        other[0];

      const otherMonth =
  getMonthForRow(sheet, i + 1);

      const otherStart =
        Number(other[2]);

      const otherEnd =
        Number(other[3]);

      // only same month
      if (
        currentMonth !== otherMonth
      ) {
        continue;
      }

      // skip incomplete rows
      if (
        !otherEmployee ||
        !otherStart ||
        !otherEnd
      ) {
        continue;
      }

      if (
  isNaN(otherStart) ||
  isNaN(otherEnd)
) {
  continue;
}

      const overlap = !(
        Number(endVal)
          < otherStart ||

        Number(startVal)
          > otherEnd
      );

      if (overlap) {

        statusCell.setValue(
          'Ошибка: Пересечение отпусков.'
        );

        return;
      }
    }
  }

  statusCell.clearContent();
  
}

function rebuildAll() {

  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  let tech =
    ss.getSheetByName(TECH_SHEET);

  if (!tech) {

    tech = ss.insertSheet(TECH_SHEET);

  }

  tech.clear();

  tech.getRange(1,1,1,4)
    .setValues([[
      'Сотрудник',
      'Дата начала',
      'Дата окончания',
      'Notified'
    ]]);

  const output = [];

  ss.getSheets().forEach(sheet => {

    const sheetName = sheet.getName();

    if (!/^\d{4}$/.test(sheetName)) return;

    const year = Number(sheetName);

    const data = sheet.getDataRange().getValues();

    let currentMonth = null;

    for (let i = 1; i < data.length; i++) {

      const row = data[i];

      const employee = row[0];
      const monthVal = row[1];
      const startVal = row[2];
      const endVal   = row[3];

      const monthKey =
        String(monthVal)
          .trim()
          .toLowerCase();

      if (MONTHS.hasOwnProperty(monthKey)) {

        currentMonth = MONTHS[monthKey];
        continue;
      }

      if (
        currentMonth === null ||
        !employee ||
        !startVal ||
        !endVal
      ) continue;

      const startDate = new Date(
        year,
        currentMonth,
        Number(startVal)
      );

      const endDate = new Date(
        year,
        currentMonth,
        Number(endVal)
      );

      output.push([
        employee,
        fmtDate(startDate),
        fmtDate(endDate),
        ''
      ]);
    }
  });

  if (output.length) {

    tech.getRange(
      2,
      1,
      output.length,
      4
    ).setValues(output);
  }

  tech.autoResizeColumns(1,3);
}

function fmtDate(d) {

  return Utilities.formatDate(
    d,
    Session.getScriptTimeZone(),
    'dd.MM.yyyy'
  );
}

function runRebuild() {

  rebuildAll();

  Logger.log(
    'Техтаблица пересобрана.'
  );
}

// =============================================================
// PROTECTION SYSTEM
// =============================================================

function applyProtection() {

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  ss.getSheets().forEach(sheet => {

    const name = sheet.getName();

    // =========================================================
    // Только годовые листы
    // =========================================================

    if (!/^\d{4}$/.test(name)) {
      return;
    }

    // =========================================================
    // Снять старые protections
    // =========================================================

    const protections =
      sheet.getProtections(
        SpreadsheetApp.ProtectionType.RANGE
      );

    protections.forEach(p => {

      try {
        p.remove();
      } catch(err) {}
    });

    // =========================================================
    // HEADER
    // =========================================================

    protectRange(
      sheet.getRange('A1:F1'),
      'HEADER'
    );

    // =========================================================
    // STATUS COLUMN
    // =========================================================

    protectRange(
      sheet.getRange('F:F'),
      'STATUS'
    );

    // =========================================================
    // MONTH ROWS
    // =========================================================

    const data =
      sheet.getDataRange().getValues();

    for (let i = 0; i < data.length; i++) {

      const row = data[i];

      const monthKey =
        String(row[1])
          .trim()
          .toLowerCase();

      if (MONTHS.hasOwnProperty(monthKey)) {

        protectRange(
          sheet.getRange(i + 1, 1, 1, 6),
          'MONTH_ROW'
        );
      }
    }
  });

  // =========================================================
  // TECH SHEET
  // =========================================================

  const tech =
    ss.getSheetByName(TECH_SHEET);

  if (tech) {

    const protections =
      tech.getProtections(
        SpreadsheetApp.ProtectionType.SHEET
      );

    protections.forEach(p => {

      try {
        p.remove();
      } catch(err) {}
    });

    const protection =
      tech.protect();

    protection.setDescription(
      'TECH_SHEET_PROTECTION'
    );

    protection.setWarningOnly(true);
  }

  Logger.log(
    'Protection applied.'
  );

   SpreadsheetApp
    .getUi()
    .alert(
      'Protection applied successfully.'
    );

}
  
// =============================================================
// HELPER
// =============================================================

function protectRange(range, description) {

  const protection =
    range.protect();

  protection.setDescription(description);

  protection.setWarningOnly(true);
}
function getConfig(key) {

  return PropertiesService
    .getScriptProperties()
    .getProperty(key);
}

function setConfig(key, value) {

  PropertiesService
    .getScriptProperties()
    .setProperty(
      key,
      value
    );
}

// =============================================================
// FEATURE FLAGS
// =============================================================

function enableOverlapValidation() {

  setConfig(
    'ENABLE_OVERLAP_VALIDATION',
    'true'
  );

  SpreadsheetApp
    .getUi()
    .alert(
      'Overlap validation ENABLED.'
    );
}

function disableOverlapValidation() {

  setConfig(
    'ENABLE_OVERLAP_VALIDATION',
    'false'
  );

  SpreadsheetApp
    .getUi()
    .alert(
      'Overlap validation DISABLED.'
    );
}
function isOverlapValidationEnabled() {

  return getConfig(
    'ENABLE_OVERLAP_VALIDATION'
  ) === 'true';
}