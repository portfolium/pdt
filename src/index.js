import commander from 'commander';
import {
    reset,
    checkout,
    deploy,
} from './commands';

commander
    .version('1.0.0')
    .description('Portfolium Deploy Tool (pdt)');

commander
    .command('reset [app]')
    .alias('r')
    .description('reset one or all apps to latest master branch')
    .action(reset);

commander
    .command('checkout <app> [branch]')
    .alias('co')
    .description('checkout specified branch')
    .action(checkout);

commander
    .command('deploy <app> [branch]')
    .alias('d')
    .description('checkout specified branch and run the deploy script')
    .action(deploy);

commander.parse(process.argv);

// show help if no args are provided
if (!commander.args.length) commander.help();
