#!/usr/bin/env node
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runDeployScript = void 0;

var _execute = require("./execute");

var _logger = _interopRequireDefault(require("./logger.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var runDeployScript = function runDeployScript(scriptName, branch, app, dir) {
  return (0, _execute.execute)("".concat(dir, "/").concat(scriptName, " ").concat(branch)).then(function (_ref) {
    var stderr = _ref.stderr,
        stdout = _ref.stdout,
        code = _ref.code;

    // show err if it's NOT the 'Already on <branch>' message
    if (stderr && stderr.indexOf('Already on') === -1) {
      _logger.default.queue(stderr, app, 'error');
    }

    if (stdout) {
      _logger.default.queue(stdout, app, 'warn');
    }

    if (code === 0) {
      _logger.default.queue(_logger.default.pretty(app, 'finished', "deploy script"), app, 'info');
    } else {
      // we have an error, show the user
      _logger.default.queue(_logger.default.pretty(app, 'ERROR', "deploy script - check the logs with: pdt logs ".concat(app), 'error'), app, 'info');
    }
  });
};

exports.runDeployScript = runDeployScript;