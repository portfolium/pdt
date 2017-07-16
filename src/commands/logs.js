import shell from 'shelljs';
import logger from '../logger.js';

export const logs = (app) => {
    const logFile = `${logger.logDir}/${app}.log`;

    // check for log file
    if (shell.test('-f', logFile)) {
        shell.exec(`cat ${logFile}`, (code, stdout, stderr) => {
            logger.out(stdout);
        });
    } else {
        logger.error(`No logfile for ${app}`);
    }
}
