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

var _logger = require('../logger.js');

var _logger2 = _interopRequireDefault(_logger);

var _app = require('../app');

var _git = require('../git.js');

var _git2 = _interopRequireDefault(_git);

var _deployer = require('../deployer.js');

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
        return _logger2.default.error('App not found: ' + app);
    }

    // clean log dir
    _logger2.default.purgeLogDir();

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
        if (apps.length > 1) {
            _logger2.default.prettyLine('*', 'All finished!');
        }
    });
};

var _resetApp = function _resetApp(app) {
    var dir = _config2.default.projectDir + '/' + app.name;

    return _git2.default.checkout('master', app.name, dir).then(function () {
        return _git2.default.pull(app.name, dir);
    }).then(function () {
        return (0, _deployer.runDeployScript)(app.script, 'master', app.name, _config2.default.projectDir);
    }).then(function () {
        // replay logs
        _logger2.default.playback(app.name, 'info');
        _logger2.default.queue(_logger2.default.pretty(app.name, 'All finished'), app.name, 'info', true);
        return true;
    });
};