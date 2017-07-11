#!/usr/bin/env node
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.execLog = exports.prettyLine = undefined;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = console.log;

var prettyLine = exports.prettyLine = function prettyLine(title, action, message) {
    var msg = [];
    msg.push('' + _chalk2.default.gray('[') + _chalk2.default.magenta(title) + _chalk2.default.gray(']'));
    msg.push('' + _chalk2.default.cyan(action));
    if (message) {
        msg.push('' + _chalk2.default.gray(message));
    }

    log.apply(console, msg);
};

var execLog = exports.execLog = function execLog(stdout, stderr, verbose) {
    if (verbose) {
        log(stdout);
    }
    if (stderr) {
        log('' + _chalk2.default.red(stderr));
    }
};