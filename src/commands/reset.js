import _ from 'lodash';
import q from 'q';
import logger from '../logger.js';
import {App} from '../app';
import git from '../git.js';
import {runDeployScript} from '../deployer.js';
import config from '../config';

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
        return logger.error(`App not found: ${app}`);
    }

    // clean log dir
    logger.purgeLogDir();

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
            if (apps.length > 1) {
                logger.prettyLine('*', 'All finished!');
            }
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
            logger.queue(logger.pretty(app.name, 'All finished'), app.name, 'info', true);
            return true;
        });
}
