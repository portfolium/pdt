#!/usr/bin/env node
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.deploy = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _execute = require('../execute');

var _checkout = require('./checkout');

var _app2 = require('../app');

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = console.log;

var deploy = exports.deploy = function deploy(app, branch) {
    // make sure app name is valid
    var found = _lodash2.default.find(_config2.default.apps, { name: app });
    if (!found) {
        return log('' + _chalk2.default.red('App not found: ' + app));
    }

    // create the app object
    var _app = new _app2.App(found);

    // run the checkout to use the branch selector
    return (0, _checkout.checkout)(app, branch).then(function (checkedOutBranch) {
        return _runDeployScript(_app.script, checkedOutBranch, _config2.default.projectDir);
    });
};

var _runDeployScript = function _runDeployScript(scriptName, branch, dir) {
    return (0, _execute.execute)(dir + '/' + scriptName + ' ' + branch).then(function (_ref) {
        var stderr = _ref.stderr,
            stdout = _ref.stdout,
            code = _ref.code;

        // show err if it's NOT the 'Already on <branch>' message
        if (stderr && stderr.indexOf('Already on') === -1) {
            log('' + _chalk2.default.red(stderr));
        }
        if (stdout) {
            log('' + _chalk2.default.green(stdout));
        }
        if (code === 0) {
            log('' + _chalk2.default.bgCyan.whiteBright('\nDeployed!\n'));
        }
    });
};