import _ from 'lodash';
import q from 'q';
import chalk from 'chalk';
import shell from 'shelljs';
import {prettyLine, execLog} from '../logger.js';
import {execute} from '../execute';
import {App} from '../app';
import config from '../config';
const log = console.log;

export const reset = (app) => {
    // default to all
    app = app || 'all';
    let appsToReset = [];

    if (app === 'all') {
        // assign all apps from config
        appsToReset = config.apps;
    } else {
        // make sure app name is valid
        const found = _.find(config.apps, {name: app});
        if (found) {
            appsToReset.push(found);
        }
    }

    // no such app
    if (appsToReset.length === 0) {
        return log(`${chalk.white.bgRed('No such app:')} ${chalk.red(app)}`);
    }

    // create an array of App objects
    appsToReset = _.map(appsToReset, (app) => {
        return new App(app);
    });

    // do it!
    _resetApps(appsToReset);
}

const _resetApps = (apps) => {
    const funcs = [];
    _.each(apps, (app) => {
        // create promise
        funcs.push(_resetApp(app));
    });
    q.all(funcs)
        .then(() => {
            log(`${chalk.bgCyan.whiteBright('\All done!\n')}`);
        });
}

const _resetApp = (app) => {
    let checkoutStderr, checkoutStdout, pullStdErr, pullStdout = null;
    const dir = `${config.projectDir}/${app.name}`;

    return execute('git checkout master', dir)
        .then(({stderr, stdout}) => {
            checkoutStderr = stderr;
            checkoutStdout = stdout;
            shell.cd(dir);
            return execute('git pull --rebase', dir);
        })
        .then(({stderr, stdout}) => {
            pullStdErr = stderr;
            pullStdout = stdout;
            prettyLine(app.name, 'reset to master');
            execLog(checkoutStdout, checkoutStderr);
            execLog(pullStdout, pullStdErr);
            return stdout;
        });
}
