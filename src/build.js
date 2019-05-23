'use strict';

const _ = require('lodash');
const fs = require('fs-extra');
const yaml = require('js-yaml');
const { exec } = require('child_process');
const { print } = require('./util');

const GITLAB_FILE_NAME = '.gitlab-ci.yml';

const makeGitlabConfig = config => {
  const gitlabScript = _.compact(_.concat(config.before, config.build, config.test, config.deploy, config.after));
  const gitlabConfig = {
    run: { script: _.map(gitlabScript, command => 'call ' + command) },
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

  exec('gitlab-runner exec shell run', (error, stdout, stderr) => {
    let output = '';
    if (error) {
      print('Error when using gitlab runner: ' + error);
      output = `Status: Job failed \n\nstdout: ${stdout} \nstderr: ${stderr}`;
    } else {
      output = `Status: Job succeeded \n\n${stdout}`;
    }
    afterRun(output);
    cleanAfterRun();
  });
};

module.exports = { run };
