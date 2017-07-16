#!/usr/bin/env node
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.status = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

var _logger = require('../logger.js');

var _logger2 = _interopRequireDefault(_logger);

var _app = require('../app');

var _git = require('../git.js');

var _git2 = _interopRequireDefault(_git);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var long = false;

var status = exports.status = function status(app, options) {
    long = options.long;

    // default to all
    app = app || 'all';
    var appsToShow = [];

    if (app === 'all') {
        // assign all apps from config
        appsToShow = _config2.default.apps;
    } else {
        // make sure app name is valid
        var found = _lodash2.default.find(_config2.default.apps, { name: app });
        if (found) {
            appsToShow.push(found);
        }
    }

    // no such app
    if (appsToShow.length === 0) {
        return _logger2.default.error('App not found: ' + app);
    }

    // create an array of App objects
    appsToShow = _lodash2.default.map(appsToShow, function (app) {
        return new _app.App(app);
    });

    // do it!
    return _showApps(appsToShow);
};

var _showApps = function _showApps(apps) {
    var funcs = [];
    _lodash2.default.each(apps, function (app) {
        // create promise
        funcs.push(_showApp(app));
    });
    return _q2.default.all(funcs).then(function () {
        var title = apps.length > 1 ? '*' : apps[0].name;
        _logger2.default.prettyLine(title, 'All finished!');
        return;
    });
};

var _showApp = function _showApp(app) {
    var dir = _config2.default.projectDir + '/' + app.name;
    var stat = null;

    if (long) {
        stat = _git2.default.status(app.name, dir).then(function (status) {
            _logger2.default.queue(_logger2.default.pretty(app.name, 'status:'), app.name, 'info');
            _logger2.default.queue(status, app.name, 'info');
            return;
        });
    } else {
        stat = _git2.default.currentBranch(app.name, dir).then(function (currentBranch) {
            _logger2.default.queue(_logger2.default.pretty(app.name, 'current branch', currentBranch), app.name, 'info');
            return;
        });
    }

    return stat.then(function () {
        // replay logs
        _logger2.default.playback(app.name, 'info');
        return;
    });
};