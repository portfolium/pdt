#!/usr/bin/env node
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var log = console.log;

var instance = null;

/**
 * There are 3 log levels:
 *    * 1 info  - shows only checkpoint messages
 *    * 2 warn  - shows all stdout messages (plus checkpoint messages)
 *    * 3 error - shows all stdout and stderr messages (plus checkpoint messages)
 */

var Logger = function () {
    function Logger() {
        _classCallCheck(this, Logger);

        if (!instance) {
            instance = this;
        }

        this.logs = {};
        this.home = _shelljs2.default.env['HOME'];
        this.configDir = this.home + '/.pdt';
        this.logDir = this.configDir + '/logs';

        this._init();

        return instance;
    }

    _createClass(Logger, [{
        key: '_init',
        value: function _init() {
            this.createLogDir();
        }
    }, {
        key: 'queue',
        value: function queue(msg, group, level) {
            var toStdout = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

            if (!msg || !group) {
                return false;
            }

            level = level || 'info';

            // make sure the group exists, if not, initiate it
            if (!this.logs[group]) {
                this.logs[group] = [];
            }

            this.logs[group].push({ log: msg, level: level });

            // send log to stdout if specified
            if (toStdout) {
                log(msg);
            }

            // log to file
            this.logToFile(msg, group, level);
        }
    }, {
        key: 'out',
        value: function out(msg) {
            log(msg);
        }
    }, {
        key: 'error',
        value: function error(msg) {
            log('' + _chalk2.default.red(msg));
        }
    }, {
        key: 'playback',
        value: function playback(group, level) {
            if (!_lodash2.default.has(this.logs, group)) {
                return false;
            }

            _lodash2.default.each(this.logs[group], function (l) {
                // display relevant logs
                if (l.level === level) {
                    log(l.log);
                }
            });
        }
    }, {
        key: 'pretty',
        value: function pretty(title, action, message, actionLevel) {
            var msg = [];
            var actionColor = void 0;
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
            msg.push('' + _chalk2.default.gray('[') + _chalk2.default.magenta(title) + _chalk2.default.gray(']'));
            msg.push('' + _chalk2.default[actionColor](action));
            if (message) {
                msg.push('' + _chalk2.default.gray(message));
            }
            return msg.join(' ');
        }
    }, {
        key: 'prettyLine',
        value: function prettyLine(title, action, message) {
            log(this.pretty(title, action, message));
        }
    }, {
        key: 'execQueue',
        value: function execQueue(group, stdout, stderr) {
            // stdout is level warn
            this.queue(stdout, group, 'warn');

            // stdout is level error
            this.queue(stderr, group, 'error');
        }
    }, {
        key: 'logToFile',
        value: function logToFile(msg, group, level) {
            var logFile = this.logDir + '/' + group + '.log';
            // TODO - come up with a better way to keep track of log files created
            if (!_shelljs2.default.test('-f', logFile)) {
                _shelljs2.default.touch(logFile);
            }
            // add a single newline
            msg = msg.trim() + '\n';
            // write log to file
            _shelljs2.default.ShellString(msg).toEnd(logFile);
        }
    }, {
        key: 'createLogDir',
        value: function createLogDir() {
            if (!_shelljs2.default.test('-d', this.logDir)) {
                _shelljs2.default.mkdir(this.logDir);
            }
        }
    }, {
        key: 'purgeLogDir',
        value: function purgeLogDir() {
            if (_shelljs2.default.test('-d', this.logDir)) {
                _shelljs2.default.rm('-f', this.logDir + '/*');
            }
        }
    }]);

    return Logger;
}();

exports.default = new Logger();