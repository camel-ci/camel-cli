'use strict';

const fs = require('fs-extra');
const path = require('path');

const CAMEL_CI_URL = 'https://github.com/camel-ci/camel-cli';

const getHookScript = (createdAt, command) => `#!/bin/sh
# Hook created by Camel CI CLI
#   At: ${createdAt}
#   See: ${CAMEL_CI_URL}
#
# Triggers a camel-ci pipeline to build and run tests

${command}
`;

const setupHook = hookCommand => {
  const hookDate = new Date().toLocaleString();
  const hookScript = getHookScript(hookDate, hookCommand);
  const prePushHookPath = path.join('.git', 'hooks', 'pre-push');

  fs.writeFileSync(prePushHookPath, hookScript, 'utf-8');
  fs.chmodSync(prePushHookPath, 0o0755);
};

module.exports = { setupHook };
