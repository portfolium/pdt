import q from 'q';
import shell from 'shelljs';

export const execute = (cmd, cwd) => {
    return q.Promise((resolve, reject) => {
        if (cwd) {
            shell.cd(cwd);
        }
        shell.exec(cmd, {silent: true}, (code, stdout, stderr) => {
            return resolve({stderr, stdout, code});
        });
    });
}
