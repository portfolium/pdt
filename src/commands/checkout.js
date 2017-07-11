import _ from 'lodash';
import q from 'q';
import chalk from 'chalk';
import inquirer from 'inquirer';
import {prettyLine} from '../logger.js';
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

    // invoke the branch selector if no branch was provided
    if (!branch) {
        return _chooseBranch(_app.name);
    }

    // get the repo dir
    const dir = `${config.projectDir}/${_app.name}`;

    // fetch repo
    return execute('git fetch', dir)
        .then(() => {
            return execute(`git checkout ${branch}`, dir)
                .then(({stderr, stdout}) => {
                    return execute('git pull --rebase', dir).then(() => {
                        return {stderr, stdout};
                    })
                })
                .then(({stderr, stdout}) => {
                    prettyLine(_app.name, 'running', `git checkout ${branch}`);
                    if (stderr) {
                        log(`${chalk.red(`${stderr}`)}`);
                    }
                    return branch;
                });
        });
}

const _chooseBranch = (app) => {
    const dir = `${config.projectDir}/${app}`;
    return execute('git ls-remote --heads origin', dir)
        .then(({stderr, stdout}) => {
            return _parseBranches(stdout);
        })
        .then(_showBranchSelector)
        .then((branch) => {
            if (branch) {
                return checkout(app, branch);
            }
            return null;
        });
}

const _parseBranches = (text) => {
    return q.Promise((resolve, reject) => {
        const lines = _.trim(text).split('\n');
        _.each(lines, (line, idx, col) => {
            const ref = line.split('\t').pop();
            col[idx] = _.replace(ref, 'refs/heads/', '');
        });
        return resolve(lines);
    });

}

const _showBranchSelector = (branches) => {
    const question = {
        type: 'list',
        name: 'branch',
        message: 'Select a branch',
        choices: branches,
        default: 'master',
        pageSize: 20,
    };

    return inquirer.prompt(question)
        .then((answer) => {
            return answer.branch;
        }, (err) => {});
}
