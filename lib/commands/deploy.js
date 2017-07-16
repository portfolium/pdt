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

var _git = require('../git.js');

var _git2 = _interopRequireDefault(_git);

var _logger = require('../logger.js');

var _logger2 = _interopRequireDefault(_logger);

var _deployer = require('../deployer.js');

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

    // get the repo dir
    var dir = _config2.default.projectDir + '/' + _app.name;

    // invoke the branch selector if no branch was provided
    if (!branch) {
        return _git2.default.chooseBranch(_app.name, dir).then(function (branch) {
            if (branch) {
                deploy(app, branch);
            }
        });
    }

    _logger2.default.prettyLine(_app.name, 'running', 'deploy ' + branch);

    // fetch repo
    return _git2.default.fetch(_app.name, dir).then(function () {
        return _git2.default.checkout(branch, _app.name, dir);
    }).then(function () {
        return _git2.default.pull(_app.name, dir);
    }).then(function () {
        return (0, _deployer.runDeployScript)(_app.script, branch, _app.name, _config2.default.projectDir);
    }).then(function () {
        // replay logs
        _logger2.default.playback(_app.name, 'info');
        _logger2.default.prettyLine(_app.name, 'All finished!');
    });
};