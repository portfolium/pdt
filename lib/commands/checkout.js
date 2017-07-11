#!/usr/bin/env node
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.checkout = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _logger = require('../logger.js');

var _execute = require('../execute');

var _app2 = require('../app');

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = console.log;

var checkout = exports.checkout = function checkout(app, branch) {
    // make sure app name is valid
    var found = _lodash2.default.find(_config2.default.apps, { name: app });
    if (!found) {
        log('' + _chalk2.default.red('App not found: ' + app));
        return _q2.default.reject('App not found: ' + app);
    }

    // create the app object
    var _app = new _app2.App(found);

    // invoke the branch selector if no branch was provided
    if (!branch) {
        return _chooseBranch(_app.name);
    }

    // get the repo dir
    var dir = _config2.default.projectDir + '/' + _app.name;

    // fetch repo
    return (0, _execute.execute)('git fetch', dir).then(function () {
        return (0, _execute.execute)('git checkout ' + branch, dir).then(function (_ref) {
            var stderr = _ref.stderr,
                stdout = _ref.stdout;

            return (0, _execute.execute)('git pull', dir).then(function () {
                return { stderr: stderr, stdout: stdout };
            });
        }).then(function (_ref2) {
            var stderr = _ref2.stderr,
                stdout = _ref2.stdout;

            (0, _logger.prettyLine)(_app.name, 'running', 'git checkout ' + branch);
            if (stderr) {
                log('' + _chalk2.default.red('' + stderr));
            }
            return branch;
        });
    });
};

var _chooseBranch = function _chooseBranch(app) {
    var dir = _config2.default.projectDir + '/' + app;
    return (0, _execute.execute)('git ls-remote --heads origin', dir).then(function (_ref3) {
        var stderr = _ref3.stderr,
            stdout = _ref3.stdout;

        return _parseBranches(stdout);
    }).then(_showBranchSelector).then(function (branch) {
        if (branch) {
            return checkout(app, branch);
        }
        return null;
    });
};

var _parseBranches = function _parseBranches(text) {
    return _q2.default.Promise(function (resolve, reject) {
        var lines = _lodash2.default.trim(text).split('\n');
        _lodash2.default.each(lines, function (line, idx, col) {
            var ref = line.split('\t').pop();
            col[idx] = _lodash2.default.replace(ref, 'refs/heads/', '');
        });
        return resolve(lines);
    });
};

var _showBranchSelector = function _showBranchSelector(branches) {
    var question = {
        type: 'list',
        name: 'branch',
        message: 'Select a branch',
        choices: branches,
        default: 'master',
        pageSize: 20
    };

    return _inquirer2.default.prompt(question).then(function (answer) {
        return answer.branch;
    }, function (err) {});
};