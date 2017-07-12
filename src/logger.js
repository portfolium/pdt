import _ from 'lodash';
import chalk from 'chalk';
const log = console.log;

let instance = null;

/**
 * There are 3 log levels:
 *    * 1 info  - shows only checkpoint messages
 *    * 2 warn  - shows all stdout messages (plus checkpoint messages)
 *    * 3 error - shows all stdout and stderr messages (plus checkpoint messages)
 */
class Logger {
    constructor() {
        if (!instance) {
            instance = this;
        }

        this.logs = {};

        return instance;
    }

    queue(log, group, level) {
        if (!log || !group) {
            return false;
        }

        level = level || 'info';

        // make sure the group exists, if not, initiate it
        if (!this.logs[group]) {
            this.logs[group] = [];
        }

        this.logs[group].push({log: log, level: level});
    }

    playback(group, level) {
        if (!_.has(this.logs, group)) {
            return false;
        }

        _.each(this.logs[group], (l) => {
            if (l.level === level) {
                log(l.log);
            }
        });
    }

    pretty(title, action, message) {
        let msg = [];
        msg.push(`${chalk.gray('[')}${chalk.magenta(title)}${chalk.gray(']')}`);
        msg.push(`${chalk.cyan(action)}`);
        if (message) {
            msg.push(`${chalk.gray(message)}`);
        }
        return msg.join(' ');
    }

    prettyLine(title, action, message) {
        log(this.pretty(title, action, message));
    }

    execQueue(group, stdout, stderr) {
        // stdout is level warn
        this.queue(stdout, group, 'warn');

        // stdout is level error
        this.queue(stderr, group, 'error');
    }

    execLog(stdout, stderr, verbose) {
        if (verbose) {
            log(stdout);
        }
        if (stderr) {
            log(`${chalk.red(stderr)}`);
        }
    }
}

export default new Logger();
