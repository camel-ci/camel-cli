'use strict';

const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');

const CONFIG_FILE_NAME = '.camelci.yml';
const TEMPLATES_DIR_NAME = 'templates';
const TEMPLATES = ['base', 'maven', 'gradle', 'ant', 'scala', 'ruby', 'python'];

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

const loadConfig = () => {
  return yaml.safeLoad(fs.readFileSync(getConfigPath()));
};

const checkConfig = config => {
  const exepectedPropertiesArray = ['before', 'after', 'build', 'test', 'deploy'];
  const givenPropertiesArray = [];
  let result = true;
  for (const key in config) {
    if (!exepectedPropertiesArray.includes(key)) {
      result = false;
      break;
    }
    givenPropertiesArray.push(key);
  }
  if (!givenPropertiesArray.includes('build')) {
    result = false;
  }
  return result;
};

module.exports = { CONFIG_FILE_NAME, isValidTemplate, hasConfig, createConfig, loadConfig, checkConfig };
