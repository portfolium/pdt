#!/usr/bin/env node
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.execute = undefined;

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var execute = exports.execute = function execute(cmd, cwd) {
    return _q2.default.Promise(function (resolve, reject) {
        if (cwd) {
            _shelljs2.default.cd(cwd);
        }
        _shelljs2.default.exec(cmd, { silent: true }, function (code, stdout, stderr) {
            return resolve({ stderr: stderr, stdout: stdout, code: code });
        });
    });
};