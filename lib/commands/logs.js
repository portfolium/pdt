#!/usr/bin/env node
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logs = void 0;

var _shelljs = _interopRequireDefault(require("shelljs"));

var _logger = _interopRequireDefault(require("../logger.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logs = function logs(app) {
  var logFile = "".concat(_logger.default.logDir, "/").concat(app, ".log"); // check for log file

  if (_shelljs.default.test('-f', logFile)) {
    _shelljs.default.exec("cat ".concat(logFile), function (code, stdout, stderr) {
      _logger.default.out(stdout);
    });
  } else {
    _logger.default.error("No logfile for ".concat(app));
  }
};

exports.logs = logs;