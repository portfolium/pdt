#!/usr/bin/env node
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reset = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _q = _interopRequireDefault(require("q"));

var _logger = _interopRequireDefault(require("../logger.js"));

var _app = require("../app");

var _git = _interopRequireDefault(require("../git.js"));

var _deployer = require("../deployer.js");

var _config = _interopRequireDefault(require("../config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reset = function reset(app) {
  // default to all
  app = app || 'all';
  var appsToReset = [];

  if (app === 'all') {
    // assign all apps from config
    appsToReset = _config.default.apps;
  } else {
    // make sure app name is valid
    var found = _lodash.default.find(_config.default.apps, {
      name: app
    });

    if (found) {
      appsToReset.push(found);
    }
  } // no such app


  if (appsToReset.length === 0) {
    return _logger.default.error("App not found: ".concat(app));
  } // clean log dir


  _logger.default.purgeLogDir(); // create an array of App objects


  appsToReset = _lodash.default.map(appsToReset, function (app) {
    return new _app.App(app);
  }); // do it!

  _resetApps(appsToReset);
};

exports.reset = reset;

var _resetApps = function _resetApps(apps) {
  var funcs = [];

  _lodash.default.each(apps, function (app) {
    // create promise
    funcs.push(_resetApp(app));
  });

  _q.default.all(funcs).then(function () {
    if (apps.length > 1) {
      _logger.default.prettyLine('*', 'All finished!');
    }
  });
};

var _resetApp = function _resetApp(app) {
  var dir = "".concat(_config.default.projectDir, "/").concat(app.name);
  return _git.default.checkout('master', app.name, dir).then(function () {
    return _git.default.pull(app.name, dir);
  }).then(function () {
    return (0, _deployer.runDeployScript)(app.script, 'master', app.name, _config.default.projectDir);
  }).then(function () {
    // replay logs
    _logger.default.playback(app.name, 'info');

    _logger.default.queue(_logger.default.pretty(app.name, 'All finished'), app.name, 'info', true);

    return true;
  });
};