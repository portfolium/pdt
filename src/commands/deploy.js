import _ from 'lodash';
import chalk from 'chalk';
import {execute} from '../execute';
import {checkout} from './checkout';
import {App} from '../app';
import git from '../git.js';
import logger from '../logger.js';
import {runDeployScript} from '../deployer.js';
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

    // get the repo dir
    const dir = `${config.projectDir}/${_app.name}`;

    // invoke the branch selector if no branch was provided
    if (!branch) {
        return git.chooseBranch(_app.name, dir)
            .then((branch) => {
                if (branch) {
                    deploy(app, branch);
                }
            });
    }

    logger.prettyLine(_app.name, 'running', `deploy ${branch}`);

    // fetch repo
    return git.fetch(_app.name, dir)
        .then(() => {
            return git.checkout(branch, _app.name, dir);
        })
        .then(() => {
            return git.pull(_app.name, dir);
        })
        .then(() => {
            return runDeployScript(_app.script, branch, _app.name, config.projectDir);
        })
        .then(() => {
            // replay logs
            logger.playback(_app.name, 'info');
            logger.prettyLine(_app.name, 'All finished!');
        });
}
