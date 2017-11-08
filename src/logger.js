import _ from 'lodash';
import chalk from 'chalk';
import shell from 'shelljs';
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
        this.home = shell.env['HOME'];
        this.configDir = `${this.home}/.pdt`;
        this.logDir = `${this.configDir}/logs`;

        this._init();

        return instance;
    }

    _init() {
        this.createLogDir();
    }

    queue(msg, group, level, toStdout = false) {
        if (!msg || !group) {
            return false;
        }

        level = level || 'info';

        // make sure the group exists, if not, initiate it
        if (!this.logs[group]) {
            this.logs[group] = [];
        }

        this.logs[group].push({log: msg, level: level});

        // send log to stdout if specified
        if (toStdout) {
            log(msg);
        }

        // log to file
        this.logToFile(msg, group, level);
    }

    out(msg) {
        log(msg);
    }

    error(msg) {
        log(`${chalk.red(msg)}`);
    }

    playback(group, level) {
        if (!_.has(this.logs, group)) {
            return false;
        }

        _.each(this.logs[group], (l) => {
            // display relevant logs
            if (l.level === level) {
                log(l.log);
            }
        });
    }

    pretty(title, action, message, actionLevel) {
        let msg = [];
        let actionColor;
        switch (actionLevel) {
            case 'success':
                actionColor = 'cyan';
                break;
            case 'error':
                actionColor = 'red';
                break;
            default:
                actionColor = 'cyan';
        }
        msg.push(`${chalk.gray('[')}${chalk.magenta(title)}${chalk.gray(']')}`);
        msg.push(`${chalk[actionColor](action)}`);
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

    logToFile(msg, group, level) {
        const logFile = `${this.logDir}/${group}.log`;
        // TODO - come up with a better way to keep track of log files created
        if (!shell.test('-f', logFile)) {
            shell.touch(logFile);
        }
        // add a single newline
        msg = msg.trim() + '\n';
        // write log to file
        shell.ShellString(msg).toEnd(logFile);
    }

    createLogDir() {
        if (!shell.test('-d', this.logDir)) {
            shell.mkdir(this.logDir);
        }
    }

    purgeLogDir() {
        if (shell.test('-d', this.logDir)) {
            shell.rm('-f', `${this.logDir}/*`);
        }
    }
}

export default new Logger();
