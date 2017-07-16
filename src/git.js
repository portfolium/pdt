import _ from 'lodash';
import q from 'q';
import inquirer from 'inquirer';
import {execute} from './execute';
import logger from './logger.js';

let instance = null;

class Git {
    constructor() {
        if (!instance) {
            instance = this;
        }

        return instance;
    }

    fetch(app, dir) {
        return execute('git fetch', dir)
            .then(({stdout, stderr, code}) => {
                logger.execQueue(app, stdout, stderr);
                if (code === 0) {
                    logger.queue(logger.pretty(app, 'finished', `git fetch`), app, 'info');
                }
            });
    }

    checkout(branch, app, dir) {
        return execute(`git checkout ${branch}`, dir)
            .then(({stdout, stderr, code}) => {
                logger.execQueue(app, stdout, stderr);
                if (code === 0) {
                    logger.queue(logger.pretty(app, 'finished', `git checkout ${branch}`), app, 'info');
                }
            });
    }

    pull(app, dir) {
        return execute('git pull --rebase', dir)
            .then(({stdout, stderr, code}) => {
                logger.execQueue(app, stdout, stderr);
                if (code === 0) {
                    logger.queue(logger.pretty(app, 'finished', `git git pull --rebase`), app, 'info');
                }
            });
    }

    status(app, dir, flags) {
        flags = flags || '';
        const cmd = `git status ${flags}`;
        return execute(cmd, dir)
            .then(({stdout, stderr, code}) => {
                return stdout;
            });
    }

    currentBranch(app, dir) {
        return execute('git rev-parse --abbrev-ref HEAD', dir)
            .then(({stdout, stderr, code}) => {
                stdout = stdout.trim();
                logger.prettyLine(app, 'current branch', stdout);
                return stdout;
            });
    }

    chooseBranch(app, dir) {
        return execute('git ls-remote --heads origin', dir)
            .then(({stderr, stdout}) => {
                return this._parseBranches(stdout);
            })
            .then((branches) => {
                return this.currentBranch(app, dir).then((currentBranch) => {
                    return this._showBranchSelector(branches, currentBranch);
                });
            })
            .then((branch) => {
                if (branch) {
                    return branch;
                }
                return null;
            });
    }

    _parseBranches(text) {
        return q.Promise((resolve, reject) => {
            const lines = _.trim(text).split('\n');
            _.each(lines, (line, idx, col) => {
                const ref = line.split('\t').pop();
                col[idx] = _.replace(ref, 'refs/heads/', '');
            });
            return resolve(lines);
        });
    }

    _showBranchSelector(branches, defaultBranch = 'master') {
        const question = {
            type: 'list',
            name: 'branch',
            message: 'Select a branch',
            choices: branches,
            default: defaultBranch,
            pageSize: 20,
        };

        return inquirer.prompt(question)
            .then((answer) => {
                return answer.branch;
            }, (err) => {});
    }
}

export default new Git();
