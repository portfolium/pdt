import _ from 'lodash';
import q from 'q';
import logger from '../logger.js';
import git from '../git.js';
import {App} from '../app';
import config from '../config';

export const checkout = (app, branch) => {
    // make sure app name is valid
    const found = _.find(config.apps, {name: app});
    if (!found) {
        return logger.error(`App not found: ${app}`);
    }

    // clean log dir
    logger.purgeLogDir();

    // create the app object
    const _app = new App(found);

    // get the repo dir
    const dir = `${config.projectDir}/${_app.name}`;

    // invoke the branch selector if no branch was provided
    if (!branch) {
        return git.chooseBranch(_app.name, dir)
            .then((branch) => {
                if (branch) {
                    checkout(app, branch);
                }
            });
    }

    logger.queue(logger.pretty(_app.name, 'running', `git checkout ${branch}`), _app.name, 'info', true);

    // fetch repo
    return git.fetch(_app.name, dir)
        .then(() => {
            return git.checkout(branch, _app.name, dir);
        })
        .then(() => {
            return git.pull(_app.name, dir);
        })
        .then(() => {
            // replay logs
            logger.playback(_app.name, 'info');
            logger.queue(logger.pretty(_app.name, 'All finished'), _app.name, 'info', true);
        });
}
