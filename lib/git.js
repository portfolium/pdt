#!/usr/bin/env node
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _q = _interopRequireDefault(require("q"));

var _inquirer = _interopRequireDefault(require("inquirer"));

var _execute = require("./execute");

var _logger = _interopRequireDefault(require("./logger.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var instance = null;

var Git =
/*#__PURE__*/
function () {
  function Git() {
    _classCallCheck(this, Git);

    if (!instance) {
      instance = this;
    }

    return instance;
  }

  _createClass(Git, [{
    key: "fetch",
    value: function fetch(app, dir) {
      return (0, _execute.execute)('git fetch', dir).then(function (_ref) {
        var stdout = _ref.stdout,
            stderr = _ref.stderr,
            code = _ref.code;

        _logger.default.execQueue(app, stdout, stderr);

        if (code === 0) {
          _logger.default.queue(_logger.default.pretty(app, 'finished', "git fetch"), app, 'info');
        }
      });
    }
  }, {
    key: "checkout",
    value: function checkout(branch, app, dir) {
      return (0, _execute.execute)("git checkout ".concat(branch), dir).then(function (_ref2) {
        var stdout = _ref2.stdout,
            stderr = _ref2.stderr,
            code = _ref2.code;

        _logger.default.execQueue(app, stdout, stderr);

        if (code === 0) {
          _logger.default.queue(_logger.default.pretty(app, 'finished', "git checkout ".concat(branch)), app, 'info');
        }
      });
    }
  }, {
    key: "pull",
    value: function pull(app, dir) {
      return (0, _execute.execute)('git pull --rebase', dir).then(function (_ref3) {
        var stdout = _ref3.stdout,
            stderr = _ref3.stderr,
            code = _ref3.code;

        _logger.default.execQueue(app, stdout, stderr);

        if (code === 0) {
          _logger.default.queue(_logger.default.pretty(app, 'finished', "git git pull --rebase"), app, 'info');
        }
      });
    }
  }, {
    key: "status",
    value: function status(app, dir, flags) {
      flags = flags || '';
      var cmd = "git status ".concat(flags);
      return (0, _execute.execute)(cmd, dir).then(function (_ref4) {
        var stdout = _ref4.stdout,
            stderr = _ref4.stderr,
            code = _ref4.code;
        return stdout;
      });
    }
  }, {
    key: "currentBranch",
    value: function currentBranch(app, dir) {
      return (0, _execute.execute)('git rev-parse --abbrev-ref HEAD', dir).then(function (_ref5) {
        var stdout = _ref5.stdout,
            stderr = _ref5.stderr,
            code = _ref5.code;
        return stdout.trim();
      });
    }
  }, {
    key: "chooseBranch",
    value: function chooseBranch(app, dir) {
      var _this = this;

      return (0, _execute.execute)('git ls-remote --heads origin', dir).then(function (_ref6) {
        var stderr = _ref6.stderr,
            stdout = _ref6.stdout;
        return _this._parseBranches(stdout);
      }).then(function (branches) {
        return _this.currentBranch(app, dir).then(function (currentBranch) {
          _logger.default.prettyLine(app, 'current branch', currentBranch);

          return _this._showBranchSelector(branches, currentBranch);
        });
      }).then(function (branch) {
        if (branch) {
          return branch;
        }

        return null;
      });
    }
  }, {
    key: "_parseBranches",
    value: function _parseBranches(text) {
      return _q.default.Promise(function (resolve, reject) {
        var lines = _lodash.default.trim(text).split('\n');

        _lodash.default.each(lines, function (line, idx, col) {
          var ref = line.split('\t').pop();
          col[idx] = _lodash.default.replace(ref, 'refs/heads/', '');
        });

        return resolve(lines);
      });
    }
  }, {
    key: "_showBranchSelector",
    value: function _showBranchSelector(branches) {
      var defaultBranch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'master';
      var question = {
        type: 'list',
        name: 'branch',
        message: 'Select a branch',
        choices: branches,
        default: defaultBranch,
        pageSize: 20
      };
      return _inquirer.default.prompt(question).then(function (answer) {
        return answer.branch;
      }, function (err) {});
    }
  }]);

  return Git;
}();

var _default = new Git();

exports.default = _default;