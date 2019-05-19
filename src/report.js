'use strict';

const fs = require('fs-extra');
const path = require('path');
const { buildDateTimeString } = require('./util');

const REPORTS_DIR_NAME = 'ci-reports';

const addReport = (content, onCreation) => {
  if (!fs.existsSync(REPORTS_DIR_NAME)) {
    fs.mkdirSync(REPORTS_DIR_NAME);
  }

  const currentDateTimeString = buildDateTimeString(new Date());
  const reportName = `build-${currentDateTimeString}.txt`;

  const reportFilePath = path.join(REPORTS_DIR_NAME, reportName);
  fs.writeFile(reportFilePath, content, error => {
    if (error) throw error;
    onCreation(reportFilePath);
  });
};

module.exports = { REPORTS_DIR_NAME, addReport };
