#!/usr/bin/env node
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.status = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _q = _interopRequireDefault(require("q"));

var _logger = _interopRequireDefault(require("../logger.js"));

var _app = require("../app");

var _git = _interopRequireDefault(require("../git.js"));

var _config = _interopRequireDefault(require("../config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var long = false;

var status = function status(app, options) {
  long = options.long; // default to all

  app = app || 'all';
  var appsToShow = [];

  if (app === 'all') {
    // assign all apps from config
    appsToShow = _config.default.apps;
  } else {
    // make sure app name is valid
    var found = _lodash.default.find(_config.default.apps, {
      name: app
    });

    if (found) {
      appsToShow.push(found);
    }
  } // no such app


  if (appsToShow.length === 0) {
    return _logger.default.error("App not found: ".concat(app));
  } // create an array of App objects


  appsToShow = _lodash.default.map(appsToShow, function (app) {
    return new _app.App(app);
  }); // do it!

  return _showApps(appsToShow);
};

exports.status = status;

var _showApps = function _showApps(apps) {
  var funcs = [];

  _lodash.default.each(apps, function (app) {
    // create promise
    funcs.push(_showApp(app));
  });

  return _q.default.all(funcs).then(function () {
    var title = apps.length > 1 ? '*' : apps[0].name;

    _logger.default.prettyLine(title, 'All finished!');

    return;
  });
};

var _showApp = function _showApp(app) {
  var dir = "".concat(_config.default.projectDir, "/").concat(app.name);
  var stat = null;

  if (long) {
    stat = _git.default.status(app.name, dir).then(function (status) {
      _logger.default.queue(_logger.default.pretty(app.name, 'status:'), app.name, 'info');

      _logger.default.queue(status, app.name, 'info');

      return;
    });
  } else {
    stat = _git.default.currentBranch(app.name, dir).then(function (currentBranch) {
      _logger.default.queue(_logger.default.pretty(app.name, 'current branch', currentBranch), app.name, 'info');

      return;
    });
  }

  return stat.then(function () {
    // replay logs
    _logger.default.playback(app.name, 'info');

    return;
  });
};