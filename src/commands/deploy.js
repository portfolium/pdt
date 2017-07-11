import _ from 'lodash';
import chalk from 'chalk';
import {execute} from '../execute';
import {checkout} from './checkout';
import {App} from '../app';
import config from '../config';
const log = console.log;

export const deploy = (app, branch) => {
    // make sure app name is valid
    const found = _.find(config.apps, {name: app});
    if (!found) {
        return log(`${chalk.red(`App not found: ${app}`)}`);
    }

    // create the app object
    const _app = new App(found);

    // run the checkout to use the branch selector
    return checkout(app, branch)
        .then((checkedOutBranch) => {
            return _runDeployScript(_app.script, checkedOutBranch, config.projectDir);
        });
}

const _runDeployScript = (scriptName, branch, dir) => {
    return execute(`${dir}/${scriptName} ${branch}`)
        .then(({stderr, stdout, code}) => {
            // show err if it's NOT the 'Already on <branch>' message
            if (stderr && stderr.indexOf('Already on') === -1) {
                log(`${chalk.red(stderr)}`);
            }
            if (stdout) {
                log(`${chalk.green(stdout)}`);
            }
            if (code === 0) {
                log(`${chalk.bgCyan.whiteBright('\nDeployed!\n')}`);
            }
        });
}
