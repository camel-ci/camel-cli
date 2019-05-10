'use strict';

const fs = require('fs');
const path = require('path');

const CONFIG_FILE_NAME = '.camelci.yml';
const TEMPLATES_DIR_NAME = 'templates';
const TEMPLATES = ['base'];

const getConfigPath = () => path.join(process.cwd(), CONFIG_FILE_NAME);

const hasConfig = () => fs.existsSync(getConfigPath());

const isValidTemplate = templateName => TEMPLATES.includes(templateName);

const createConfig = (templateName, onCreation) => {
  const templateFileName = templateName + CONFIG_FILE_NAME;
  const templateFilePath = path.join(__dirname, '../', TEMPLATES_DIR_NAME, templateFileName);
  const configFilePath = getConfigPath();
  fs.copyFile(templateFilePath, configFilePath, error => {
    if (error) throw error;
    onCreation();
  });
};

const parseConfig = () => {
  // Parse local config and return the corresponding config object
};

module.exports = { CONFIG_FILE_NAME, isValidTemplate, hasConfig, createConfig, parseConfig };
