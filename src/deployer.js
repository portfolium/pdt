import {execute} from './execute';
import logger from './logger.js';

export const runDeployScript = (scriptName, branch, app, dir) => {
    return execute(`${dir}/${scriptName} ${branch}`)
        .then(({stderr, stdout, code}) => {
            // show err if it's NOT the 'Already on <branch>' message
            if (stderr && stderr.indexOf('Already on') === -1) {
                logger.queue(stderr, app, 'error');
            }
            if (stdout) {
                logger.queue(stdout, app, 'warn');
            }
            if (code === 0) {
                logger.queue(logger.pretty(app, 'finished', `deploy script`), app, 'info');
            } else {
                // we have an error, show the user
                logger.queue(logger.pretty(app, 'ERROR', `deploy script - check the logs with: pdt logs ${app}`, 'error'), app, 'info');
            }
        });
}
