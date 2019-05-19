'use strict';

const _ = require('lodash');
const fs = require('fs-extra');
const yaml = require('js-yaml');
const { exec } = require('child_process');
const { print } = require('./util');

const GITLAB_FILE_NAME = '.gitlab-ci.yml';

const makeGitlabConfig = config => {
  const gitlabConfig = {
    run: { script: _.compact(_.concat(config.before, config.build, config.test, config.deploy, config.after)) },
  };
  return gitlabConfig;
};

const cleanAfterRun = () => {
  fs.unlinkSync(GITLAB_FILE_NAME);
  fs.removeSync('builds');
};

const run = (config, options, afterRun) => {
  let configToUse = config;
  if (!options.test) {
    configToUse = _.omit(configToUse, 'test');
  }
  if (!options.deploy) {
    configToUse = _.omit(configToUse, 'deploy');
  }

  const gitlabConfigString = yaml.safeDump(makeGitlabConfig(configToUse));
  fs.writeFileSync(GITLAB_FILE_NAME, gitlabConfigString);

  exec('gitlab-runner exec shell run', (error, output) => {
    if (error) {
      return print('Error when starting the runner: ' + error);
    }

    afterRun(output);
    cleanAfterRun();
  });
};

module.exports = { run };
