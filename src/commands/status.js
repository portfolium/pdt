import _ from 'lodash';
import q from 'q';
import logger from '../logger.js';
import {App} from '../app';
import git from '../git.js';
import config from '../config';
let long = false;

export const status = (app, options) => {
    long = options.long;

    // default to all
    app = app || 'all';
    let appsToShow = [];

    if (app === 'all') {
        // assign all apps from config
        appsToShow = config.apps;
    } else {
        // make sure app name is valid
        const found = _.find(config.apps, {name: app});
        if (found) {
            appsToShow.push(found);
        }
    }

    // no such app
    if (appsToShow.length === 0) {
        return logger.error(`App not found: ${app}`);
    }

    // create an array of App objects
    appsToShow = _.map(appsToShow, (app) => {
        return new App(app);
    });

    // do it!
    return _showApps(appsToShow);
}

const _showApps = (apps) => {
    const funcs = [];
    _.each(apps, (app) => {
        // create promise
        funcs.push(_showApp(app));
    });
    return q.all(funcs)
        .then(() => {
            const title = (apps.length > 1) ? '*' : apps[0].name;
            logger.prettyLine(title, 'All finished!');
            return;
        });
}

const _showApp = (app) => {
    const dir = `${config.projectDir}/${app.name}`;
    let stat = null;

    if (long) {
        stat = git.status(app.name, dir)
            .then((status) => {
                logger.queue(logger.pretty(app.name, 'status:'), app.name, 'info');
                logger.queue(status, app.name, 'info');
                return;
            });
    } else {
        stat = git.currentBranch(app.name, dir)
            .then((currentBranch) => {
                logger.queue(logger.pretty(app.name, 'current branch', currentBranch), app.name, 'info');
                return;
            });
    }

    return stat.then(() => {
        // replay logs
        logger.playback(app.name, 'info');
        return;
    })
}
