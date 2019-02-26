#!/usr/bin/env node
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkout = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _q = _interopRequireDefault(require("q"));

var _logger = _interopRequireDefault(require("../logger.js"));

var _git = _interopRequireDefault(require("../git.js"));

var _app2 = require("../app");

var _config = _interopRequireDefault(require("../config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var checkout = function checkout(app, branch) {
  // make sure app name is valid
  var found = _lodash.default.find(_config.default.apps, {
    name: app
  });

  if (!found) {
    return _logger.default.error("App not found: ".concat(app));
  } // clean log dir


  _logger.default.purgeLogDir(); // create the app object


  var _app = new _app2.App(found); // get the repo dir


  var dir = "".concat(_config.default.projectDir, "/").concat(_app.name); // invoke the branch selector if no branch was provided

  if (!branch) {
    return _git.default.chooseBranch(_app.name, dir).then(function (branch) {
      if (branch) {
        checkout(app, branch);
      }
    });
  }

  _logger.default.queue(_logger.default.pretty(_app.name, 'running', "git checkout ".concat(branch)), _app.name, 'info', true); // fetch repo


  return _git.default.fetch(_app.name, dir).then(function () {
    return _git.default.checkout(branch, _app.name, dir);
  }).then(function () {
    return _git.default.pull(_app.name, dir);
  }).then(function () {
    // replay logs
    _logger.default.playback(_app.name, 'info');

    _logger.default.queue(_logger.default.pretty(_app.name, 'All finished'), _app.name, 'info', true);
  });
};

exports.checkout = checkout;