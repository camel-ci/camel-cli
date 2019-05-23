'use strict';

const _ = require('lodash');
const fs = require('fs-extra');
const yaml = require('js-yaml');
const { spawn } = require('child_process');

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

  let output = '';
  const runnerProcess = spawn('gitlab-runner', ['exec', 'shell', 'run']);

  const onData = data => {
    const partialOutput = data.toString();
    process.stdout.write(partialOutput);
    output += partialOutput;
  };
  runnerProcess.stdout.on('data', onData);
  runnerProcess.stderr.on('data', onData);

  runnerProcess.on('close', returnCode => {
    const resultMessage = returnCode === 0 ? 'succeeded' : 'succeeded';
    afterRun(`Status: Job ${resultMessage} \n\nRun output: \n${output}`);
    cleanAfterRun();
  });
};

module.exports = { run };
