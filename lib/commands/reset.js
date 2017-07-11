#!/usr/bin/env node
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.reset = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _logger = require('../logger.js');

var _execute = require('../execute');

var _app = require('../app');

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = console.log;

var reset = exports.reset = function reset(app) {
    // default to all
    app = app || 'all';
    var appsToReset = [];

    if (app === 'all') {
        // assign all apps from config
        appsToReset = _config2.default.apps;
    } else {
        // make sure app name is valid
        var found = _lodash2.default.find(_config2.default.apps, { name: app });
        if (found) {
            appsToReset.push(found);
        }
    }

    // no such app
    if (appsToReset.length === 0) {
        return log(_chalk2.default.white.bgRed('No such app:') + ' ' + _chalk2.default.red(app));
    }

    // create an array of App objects
    appsToReset = _lodash2.default.map(appsToReset, function (app) {
        return new _app.App(app);
    });

    // do it!
    _resetApps(appsToReset);
};

var _resetApps = function _resetApps(apps) {
    var funcs = [];
    _lodash2.default.each(apps, function (app) {
        // create promise
        funcs.push(_resetApp(app));
    });
    _q2.default.all(funcs).then(function () {
        log('' + _chalk2.default.bgCyan.whiteBright('\All done!\n'));
    });
};

var _resetApp = function _resetApp(app) {
    var checkoutStderr = void 0,
        checkoutStdout = void 0,
        pullStdErr = void 0,
        pullStdout = null;
    var dir = _config2.default.projectDir + '/' + app.name;

    return (0, _execute.execute)('git checkout master', dir).then(function (_ref) {
        var stderr = _ref.stderr,
            stdout = _ref.stdout;

        checkoutStderr = stderr;
        checkoutStdout = stdout;
        _shelljs2.default.cd(dir);
        return (0, _execute.execute)('git pull --rebase', dir);
    }).then(function (_ref2) {
        var stderr = _ref2.stderr,
            stdout = _ref2.stdout;

        pullStdErr = stderr;
        pullStdout = stdout;
        (0, _logger.prettyLine)(app.name, 'reset to master');
        (0, _logger.execLog)(checkoutStdout, checkoutStderr);
        (0, _logger.execLog)(pullStdout, pullStdErr);
        return stdout;
    });
};