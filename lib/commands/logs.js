#!/usr/bin/env node
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.logs = undefined;

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _logger = require('../logger.js');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logs = exports.logs = function logs(app) {
    var logFile = _logger2.default.logDir + '/' + app + '.log';

    // check for log file
    if (_shelljs2.default.test('-f', logFile)) {
        _shelljs2.default.exec('cat ' + logFile, function (code, stdout, stderr) {
            _logger2.default.out(stdout);
        });
    } else {
        _logger2.default.error('No logfile for ' + app);
    }
};