'use strict';

const fs = require('fs-extra');
const path = require('path');
const { buildDateTimeString, print, elapsedTime } = require('./util');

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

const getReportsPath = () => path.join(process.cwd(), REPORTS_DIR_NAME);

const hasReport = () => fs.existsSync(getReportsPath());

const printReport = () => {
  const fs = require('fs');

  fs.readdir(`${REPORTS_DIR_NAME}`, function(err, reportsList) {
    if (!reportsList.length) {
      print(`No reports found in ${REPORTS_DIR_NAME} directory in the current project.
      Please make sure you have already created at least one report for the current project.`);
    } else {
      let lastReport = reportsList[0];
      let lastReportDate = fs.statSync(`${REPORTS_DIR_NAME}` + '/' + lastReport).mtime;
      reportsList.forEach(function(file) {
        const stats = fs.statSync(`${REPORTS_DIR_NAME}` + '/' + file);
        if (stats.mtime > fs.statSync(`${REPORTS_DIR_NAME}` + '/' + lastReport).mtime) {
          // ctime also usable
          lastReport = file;
          lastReportDate = stats.mtime;
        }
      });
      fs.readFile(`${REPORTS_DIR_NAME}` + '/' + lastReport, (err, reportContent) => {
        if (err) throw err;
        print('Last report generated below: \n');
        print(reportContent.toString());
        print('Total runs done: ' + reportsList.length);
        print('Last report creation date: ' + lastReportDate);
        print('Elapsed time since last report: ' + elapsedTime(new Date(), lastReportDate));
      });
    }
  });
};

module.exports = { REPORTS_DIR_NAME, addReport, hasReport, printReport };
