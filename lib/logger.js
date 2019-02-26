#!/usr/bin/env node
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _chalk = _interopRequireDefault(require("chalk"));

var _shelljs = _interopRequireDefault(require("shelljs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var log = console.log;
var instance = null;
/**
 * There are 3 log levels:
 *    * 1 info  - shows only checkpoint messages
 *    * 2 warn  - shows all stdout messages (plus checkpoint messages)
 *    * 3 error - shows all stdout and stderr messages (plus checkpoint messages)
 */

var Logger =
/*#__PURE__*/
function () {
  function Logger() {
    _classCallCheck(this, Logger);

    if (!instance) {
      instance = this;
    }

    this.logs = {};
    this.home = _shelljs.default.env['HOME'];
    this.configDir = "".concat(this.home, "/.pdt");
    this.logDir = "".concat(this.configDir, "/logs");

    this._init();

    return instance;
  }

  _createClass(Logger, [{
    key: "_init",
    value: function _init() {
      this.createLogDir();
    }
  }, {
    key: "queue",
    value: function queue(msg, group, level) {
      var toStdout = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      if (!msg || !group) {
        return false;
      }

      level = level || 'info'; // make sure the group exists, if not, initiate it

      if (!this.logs[group]) {
        this.logs[group] = [];
      }

      this.logs[group].push({
        log: msg,
        level: level
      }); // send log to stdout if specified

      if (toStdout) {
        log(msg);
      } // log to file


      this.logToFile(msg, group, level);
    }
  }, {
    key: "out",
    value: function out(msg) {
      log(msg);
    }
  }, {
    key: "error",
    value: function error(msg) {
      log("".concat(_chalk.default.red(msg)));
    }
  }, {
    key: "playback",
    value: function playback(group, level) {
      if (!_lodash.default.has(this.logs, group)) {
        return false;
      }

      _lodash.default.each(this.logs[group], function (l) {
        // display relevant logs
        if (l.level === level) {
          log(l.log);
        }
      });
    }
  }, {
    key: "pretty",
    value: function pretty(title, action, message, actionLevel) {
      var msg = [];
      var actionColor;

      switch (actionLevel) {
        case 'success':
          actionColor = 'cyan';
          break;

        case 'error':
          actionColor = 'red';
          break;

        default:
          actionColor = 'cyan';
      }

      msg.push("".concat(_chalk.default.gray('[')).concat(_chalk.default.magenta(title)).concat(_chalk.default.gray(']')));
      msg.push("".concat(_chalk.default[actionColor](action)));

      if (message) {
        msg.push("".concat(_chalk.default.gray(message)));
      }

      return msg.join(' ');
    }
  }, {
    key: "prettyLine",
    value: function prettyLine(title, action, message) {
      log(this.pretty(title, action, message));
    }
  }, {
    key: "execQueue",
    value: function execQueue(group, stdout, stderr) {
      // stdout is level warn
      this.queue(stdout, group, 'warn'); // stdout is level error

      this.queue(stderr, group, 'error');
    }
  }, {
    key: "logToFile",
    value: function logToFile(msg, group, level) {
      var logFile = "".concat(this.logDir, "/").concat(group, ".log"); // TODO - come up with a better way to keep track of log files created

      if (!_shelljs.default.test('-f', logFile)) {
        _shelljs.default.touch(logFile);
      } // add a single newline


      msg = msg.trim() + '\n'; // write log to file

      _shelljs.default.ShellString(msg).toEnd(logFile);
    }
  }, {
    key: "createLogDir",
    value: function createLogDir() {
      if (!_shelljs.default.test('-d', this.logDir)) {
        _shelljs.default.mkdir(this.logDir);
      }
    }
  }, {
    key: "purgeLogDir",
    value: function purgeLogDir() {
      if (_shelljs.default.test('-d', this.logDir)) {
        _shelljs.default.rm('-f', "".concat(this.logDir, "/*"));
      }
    }
  }]);

  return Logger;
}();

var _default = new Logger();

exports.default = _default;