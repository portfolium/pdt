#!/usr/bin/env node
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.execute = void 0;

var _q = _interopRequireDefault(require("q"));

var _shelljs = _interopRequireDefault(require("shelljs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var execute = function execute(cmd, cwd) {
  return _q.default.Promise(function (resolve, reject) {
    if (cwd) {
      _shelljs.default.cd(cwd);
    }

    _shelljs.default.exec(cmd, {
      silent: true
    }, function (code, stdout, stderr) {
      return resolve({
        stderr: stderr,
        stdout: stdout,
        code: code
      });
    });
  });
};

exports.execute = execute;