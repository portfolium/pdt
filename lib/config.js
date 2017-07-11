#!/usr/bin/env node
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var log = console.log;

var instance = null;

var Config = function () {
    function Config() {
        _classCallCheck(this, Config);

        if (!instance) {
            instance = this;
        }

        this.home = _shelljs2.default.env['HOME'];
        this.configDir = this.home + '/.pdt';
        this.configFile = this.configDir + '/pdt.json';

        this._init();

        return instance;
    }

    _createClass(Config, [{
        key: '_init',
        value: function _init() {
            if (!_shelljs2.default.test('-d', this.configDir)) {
                _shelljs2.default.mkdir(this.configDir);
            }

            if (!_shelljs2.default.test('-f', this.configFile)) {
                log('' + _chalk2.default.red('Could not find config file: ' + this.configFile));
                process.exit();
            }

            this._parseConfig();
        }
    }, {
        key: '_parseConfig',
        value: function _parseConfig() {
            this.config = require(this.configFile);
        }
    }, {
        key: 'apps',
        get: function get() {
            return this.config.apps;
        }
    }, {
        key: 'projectDir',
        get: function get() {
            return this.config.projectDir;
        }
    }]);

    return Config;
}();

exports.default = new Config();