#!/usr/bin/env node
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _shelljs = _interopRequireDefault(require("shelljs"));

var _chalk = _interopRequireDefault(require("chalk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var log = console.log;
var instance = null;

var Config =
/*#__PURE__*/
function () {
  function Config() {
    _classCallCheck(this, Config);

    if (!instance) {
      instance = this;
    }

    this.home = _shelljs.default.env['HOME'];
    this.configDir = "".concat(this.home, "/.pdt");
    this.configFile = "".concat(this.configDir, "/pdt.json");

    this._init();

    return instance;
  }

  _createClass(Config, [{
    key: "_init",
    value: function _init() {
      if (!_shelljs.default.test('-d', this.configDir)) {
        _shelljs.default.mkdir(this.configDir);
      }

      if (!_shelljs.default.test('-f', this.configFile)) {
        log("".concat(_chalk.default.red("Could not find config file: ".concat(this.configFile))));
        process.exit();
      }

      this._parseConfig();
    }
  }, {
    key: "_parseConfig",
    value: function _parseConfig() {
      this.config = require(this.configFile);
    }
  }, {
    key: "apps",
    get: function get() {
      return this.config.apps;
    }
  }, {
    key: "projectDir",
    get: function get() {
      return this.config.projectDir;
    }
  }, {
    key: "altCommands",
    get: function get() {
      return this.config.altCommands;
    }
  }]);

  return Config;
}();

var _default = new Config();

exports.default = _default;