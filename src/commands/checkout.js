import _ from 'lodash';
import q from 'q';
import chalk from 'chalk';
import inquirer from 'inquirer';
import logger from '../logger.js';
import git from '../git.js';
import {execute} from '../execute';
import {App} from '../app';
import config from '../config';
const log = console.log;

export const checkout = (app, branch) => {
    // make sure app name is valid
    const found = _.find(config.apps, {name: app});
    if (!found) {
        log(`${chalk.red(`App not found: ${app}`)}`);
        return q.reject(`App not found: ${app}`);
    }

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

    logger.prettyLine(_app.name, 'running', `git checkout ${branch}`);

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
            logger.prettyLine(_app.name, 'All finished!');
        });
}
