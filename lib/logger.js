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

        return instance;
    }

    _createClass(Logger, [{
        key: 'queue',
        value: function queue(log, group, level) {
            if (!log || !group) {
                return false;
            }

            level = level || 'info';

            // make sure the group exists, if not, initiate it
            if (!this.logs[group]) {
                this.logs[group] = [];
            }

            this.logs[group].push({ log: log, level: level });
        }
    }, {
        key: 'playback',
        value: function playback(group, level) {
            if (!_lodash2.default.has(this.logs, group)) {
                return false;
            }

            _lodash2.default.each(this.logs[group], function (l) {
                if (l.level === level) {
                    log(l.log);
                }
            });
        }
    }, {
        key: 'pretty',
        value: function pretty(title, action, message) {
            var msg = [];
            msg.push('' + _chalk2.default.gray('[') + _chalk2.default.magenta(title) + _chalk2.default.gray(']'));
            msg.push('' + _chalk2.default.cyan(action));
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
        key: 'execLog',
        value: function execLog(stdout, stderr, verbose) {
            if (verbose) {
                log(stdout);
            }
            if (stderr) {
                log('' + _chalk2.default.red(stderr));
            }
        }
    }]);

    return Logger;
}();

exports.default = new Logger();