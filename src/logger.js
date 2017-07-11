import chalk from 'chalk';
const log = console.log;

export const prettyLine = (title, action, message) => {
    let msg = [];
    msg.push(`${chalk.gray('[')}${chalk.magenta(title)}${chalk.gray(']')}`);
    msg.push(`${chalk.cyan(action)}`);
    if (message) {
        msg.push(`${chalk.gray(message)}`);
    }

    log.apply(console, msg);
}

export const execLog = (stdout, stderr, verbose) => {
    if (verbose) {
        log(stdout);
    }
    if (stderr) {
        log(`${chalk.red(stderr)}`);
    }
}
