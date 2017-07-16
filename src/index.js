import commander from 'commander';
import {
    reset,
    checkout,
    deploy,
    status,
    logs,
} from './commands';
const pkg = require('../package.json');

commander
    .version(pkg.version)
    .description('Portfolium Deploy Tool (pdt)');

commander
    .command('reset [app]')
    .alias('r')
    .description('reset one or all apps to latest master branch')
    .action(reset);

commander
    .command('checkout <app> [branch]')
    .alias('c')
    .description('checkout specified branch')
    .action(checkout);

commander
    .command('deploy <app> [branch]')
    .alias('d')
    .description('checkout specified branch and run the deploy script')
    .action(deploy);

commander
    .command('status [app]')
    .alias('s')
    .description('show the current branch for specified app')
    .option('-l, --long', 'long listing mode')
    .action(status);

commander
    .command('logs <app>')
    .alias('l')
    .description('show the logs for specified app')
    .action(logs);

commander.parse(process.argv);

// show help if no args are provided
if (!commander.args.length) commander.help();
