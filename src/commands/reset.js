import _ from 'lodash';
import q from 'q';
import chalk from 'chalk';
import shell from 'shelljs';
import logger from '../logger.js';
import {execute} from '../execute';
import {App} from '../app';
import git from '../git.js';
import {runDeployScript} from '../deployer.js';
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
            logger.prettyLine(_app.name, 'All finished!');
        });
}

const _resetApp = (app) => {
    const dir = `${config.projectDir}/${app.name}`;

    return git.checkout('master', app.name, dir)
        .then(() => {
            return git.pull(app.name, dir);
        })
        .then(() => {
            return runDeployScript(app.script, 'master', app.name, config.projectDir);
        })
        .then(() => {
            // replay logs
            logger.playback(app.name, 'info');
            logger.prettyLine(app.name, 'All finished!');
        });
}
