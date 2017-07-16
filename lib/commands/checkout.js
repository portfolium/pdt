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

var _logger = require('../logger.js');

var _logger2 = _interopRequireDefault(_logger);

var _git = require('../git.js');

var _git2 = _interopRequireDefault(_git);

var _app2 = require('../app');

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var checkout = exports.checkout = function checkout(app, branch) {
    // make sure app name is valid
    var found = _lodash2.default.find(_config2.default.apps, { name: app });
    if (!found) {
        return _logger2.default.error('App not found: ' + app);
    }

    // clean log dir
    _logger2.default.purgeLogDir();

    // create the app object
    var _app = new _app2.App(found);

    // get the repo dir
    var dir = _config2.default.projectDir + '/' + _app.name;

    // invoke the branch selector if no branch was provided
    if (!branch) {
        return _git2.default.chooseBranch(_app.name, dir).then(function (branch) {
            if (branch) {
                checkout(app, branch);
            }
        });
    }

    _logger2.default.queue(_logger2.default.pretty(_app.name, 'running', 'git checkout ' + branch), _app.name, 'info', true);

    // fetch repo
    return _git2.default.fetch(_app.name, dir).then(function () {
        return _git2.default.checkout(branch, _app.name, dir);
    }).then(function () {
        return _git2.default.pull(_app.name, dir);
    }).then(function () {
        // replay logs
        _logger2.default.playback(_app.name, 'info');
        _logger2.default.queue(_logger2.default.pretty(_app.name, 'All finished'), _app.name, 'info', true);
    });
};