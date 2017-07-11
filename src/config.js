import fs from 'fs';
import shell from 'shelljs';
import chalk from 'chalk';
const log = console.log;

let instance = null;

class Config {
    constructor() {
        if (!instance) {
            instance = this;
        }

        this.home = shell.env['HOME'];
        this.configDir = `${this.home}/.pdt`;
        this.configFile = `${this.configDir}/pdt.json`;

        this._init();

        return instance;
    }

    _init() {
        if (!shell.test('-d', this.configDir)) {
            shell.mkdir(this.configDir);
        }

        if (!shell.test('-f', this.configFile)) {
            log(`${chalk.red(`Could not find config file: ${this.configFile}`)}`);
            process.exit();
        }

        this._parseConfig();
    }

    _parseConfig() {
        this.config = require(this.configFile);
    }

    get apps() {
        return this.config.apps;
    }

    get projectDir() {
        return this.config.projectDir;
    }
}

export default new Config();
