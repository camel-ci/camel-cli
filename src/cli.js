'use strict';

const { print, cleanString } = require('./util');
const { CONFIG_FILE_NAME, isValidTemplate, createConfig, hasConfig, loadConfig, checkConfig } = require('./config');
const { REPORTS_DIR_NAME, addReport, hasReport, printReport } = require('./report');
const { run } = require('./build');

const cli = require('commander');

cli.version('0.2.0');

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
  .description('run a CI/CD pipeline as defined in your config file')
  .option('-t, --test', 'include testing steps to the run')
  .option('-d, --deploy', 'include deploy steps to the run')
  .option('-r, --report', `add a report of this operation to the ${REPORTS_DIR_NAME} directory`)
  .action(options => {
    if (!hasConfig()) {
      return print(`
        Missing ${CONFIG_FILE_NAME} config file in the current project.
        Please make sure you are in the correct directory and have a config ready.`);
    }

    print('Starting a run job based on your configuration...');
    const config = loadConfig();

    if (!checkConfig(config)) {
      return print(`
        ${CONFIG_FILE_NAME} has invalid properties or missing mandatory properties.`);
    }

    run(config, options, output => {
      print(`
        Run Output: 
        ${output}`);

      if (options.report) {
        const cleanOutput = cleanString(output);
        addReport(cleanOutput, reportPath => {
          print(`A report of this run was created at ${reportPath}`);
        });
      }
    });
  });

cli
  .command('status')
  .description('retrieve a status overview of past builds and reports')
  .action(() => {
    print('Current Status... \n');
    if (!hasReport()) {
      return print(`
        Missing ${REPORTS_DIR_NAME} directory in the current project.
        Please make sure you have already created at least one report for the current project.`);
    }

    printReport();
  });

cli.parse(process.argv);

// Output help (usage) on missing command
if (!(cli.args && cli.args.length > 0)) {
  cli.help();
}
