#!/usr/bin/env node
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.runDeployScript = undefined;

var _execute = require('./execute');

var _logger = require('./logger.js');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var runDeployScript = exports.runDeployScript = function runDeployScript(scriptName, branch, app, dir) {
    return (0, _execute.execute)(dir + '/' + scriptName + ' ' + branch).then(function (_ref) {
        var stderr = _ref.stderr,
            stdout = _ref.stdout,
            code = _ref.code;

        // show err if it's NOT the 'Already on <branch>' message
        if (stderr && stderr.indexOf('Already on') === -1) {
            _logger2.default.queue(stderr, app, 'error');
        }
        if (stdout) {
            _logger2.default.queue(stdout, app, 'warn');
        }
        if (code === 0) {
            _logger2.default.queue(_logger2.default.pretty(app, 'finished', 'deploy script'), app, 'info');
        } else {
            // we have an error, show the user
            _logger2.default.queue(_logger2.default.pretty(app, 'ERROR', 'deploy script - check the logs with: pdt logs ' + app, 'error'), app, 'info');
        }
    });
};