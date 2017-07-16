#!/usr/bin/env node
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _execute = require('./execute');

var _logger = require('./logger.js');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var instance = null;

var Git = function () {
    function Git() {
        _classCallCheck(this, Git);

        if (!instance) {
            instance = this;
        }

        return instance;
    }

    _createClass(Git, [{
        key: 'fetch',
        value: function fetch(app, dir) {
            return (0, _execute.execute)('git fetch', dir).then(function (_ref) {
                var stdout = _ref.stdout,
                    stderr = _ref.stderr,
                    code = _ref.code;

                _logger2.default.execQueue(app, stdout, stderr);
                if (code === 0) {
                    _logger2.default.queue(_logger2.default.pretty(app, 'finished', 'git fetch'), app, 'info');
                }
            });
        }
    }, {
        key: 'checkout',
        value: function checkout(branch, app, dir) {
            return (0, _execute.execute)('git checkout ' + branch, dir).then(function (_ref2) {
                var stdout = _ref2.stdout,
                    stderr = _ref2.stderr,
                    code = _ref2.code;

                _logger2.default.execQueue(app, stdout, stderr);
                if (code === 0) {
                    _logger2.default.queue(_logger2.default.pretty(app, 'finished', 'git checkout ' + branch), app, 'info');
                }
            });
        }
    }, {
        key: 'pull',
        value: function pull(app, dir) {
            return (0, _execute.execute)('git pull --rebase', dir).then(function (_ref3) {
                var stdout = _ref3.stdout,
                    stderr = _ref3.stderr,
                    code = _ref3.code;

                _logger2.default.execQueue(app, stdout, stderr);
                if (code === 0) {
                    _logger2.default.queue(_logger2.default.pretty(app, 'finished', 'git git pull --rebase'), app, 'info');
                }
            });
        }
    }, {
        key: 'status',
        value: function status(app, dir, flags) {
            flags = flags || '';
            var cmd = 'git status ' + flags;
            return (0, _execute.execute)(cmd, dir).then(function (_ref4) {
                var stdout = _ref4.stdout,
                    stderr = _ref4.stderr,
                    code = _ref4.code;

                return stdout;
            });
        }
    }, {
        key: 'currentBranch',
        value: function currentBranch(app, dir) {
            return (0, _execute.execute)('git rev-parse --abbrev-ref HEAD', dir).then(function (_ref5) {
                var stdout = _ref5.stdout,
                    stderr = _ref5.stderr,
                    code = _ref5.code;

                stdout = stdout.trim();
                _logger2.default.prettyLine(app, 'current branch', stdout);
                return stdout;
            });
        }
    }, {
        key: 'chooseBranch',
        value: function chooseBranch(app, dir) {
            var _this = this;

            return (0, _execute.execute)('git ls-remote --heads origin', dir).then(function (_ref6) {
                var stderr = _ref6.stderr,
                    stdout = _ref6.stdout;

                return _this._parseBranches(stdout);
            }).then(function (branches) {
                return _this.currentBranch(app, dir).then(function (currentBranch) {
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
        key: '_parseBranches',
        value: function _parseBranches(text) {
            return _q2.default.Promise(function (resolve, reject) {
                var lines = _lodash2.default.trim(text).split('\n');
                _lodash2.default.each(lines, function (line, idx, col) {
                    var ref = line.split('\t').pop();
                    col[idx] = _lodash2.default.replace(ref, 'refs/heads/', '');
                });
                return resolve(lines);
            });
        }
    }, {
        key: '_showBranchSelector',
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

            return _inquirer2.default.prompt(question).then(function (answer) {
                return answer.branch;
            }, function (err) {});
        }
    }]);

    return Git;
}();

exports.default = new Git();