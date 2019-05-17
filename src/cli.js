'use strict';

const { CONFIG_FILE_NAME, isValidTemplate, createConfig, hasConfig, loadConfig } = require('./config');
const { print } = require('./util');

const cli = require('commander');

cli.version('0.1.0');

cli
  .command('init [template]')
  .description('initialize a camel CI/CD environment in the current project')
  .action(template => {
    if (hasConfig()) {
      print(`
        Existing configuration file ${CONFIG_FILE_NAME} found in the current directory.
        Aborting the camel CI/CD environment initialization...`);
    } else {
      const templateName = template || 'base';

      if (!isValidTemplate(templateName)) {
        return print(`
          Unknown template name '${templateName}' was given to use for the configuration. 
          Please provide a valid template name (eg. 'maven') or use the base template.`);
      }

      createConfig(templateName, () => {
        print(`
          A base configuration file called ${CONFIG_FILE_NAME} was created in the current directory.
          This file should be completed to provide the necessary steps to run your CI/CD pipeline.
          Please fill the steps needed to build, test and deploy your project.
          Once all steps are provided, you can manually run a pipeline by using the 'run' command.`);
      });
    }
  });

cli
  .command('run')
  .description('run a full CI/CD pipeline as defined in your config file')
  .option('-r, --report', 'add a report of this operation to the ci-reports directory')
  .action(options => {
    if (!hasConfig()) {
      return print(`
        Missing ${CONFIG_FILE_NAME} config file in the current project.
        Please make sure you are in the correct directory and have a config ready.`);
    }

    print('Starting the process to run a full pipeline based on your configuration...');
    const config = loadConfig();
    print(JSON.stringify(config));

    // Run build/test/deploy based on the config file

    // Generate a report of the build and output it visually

    if (options.withReport) {
      // Add the report in a new file of the local reports folder
    }
  });

cli
  .command('status')
  .description('retrieve a status overview of past builds and reports')
  .action(() => {
    print('Current Status...');
    // Read from the ci-reports folder
    // Output a summary of all builds with main stats
    // Show a visual report of the last pipeline run
  });

cli.parse(process.argv);

// Output help (usage) on missing command
if (!(cli.args && cli.args.length > 0)) {
  cli.help();
}
