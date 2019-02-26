#!/usr/bin/env node
"use strict";

var _commander = _interopRequireDefault(require("commander"));

var _commands = require("./commands");

var _config = _interopRequireDefault(require("./config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pkg = require('../package.json');

_commander.default.version(pkg.version).description('Portfolium Deploy Tool (pdt)');

_commander.default.command('reset [app]').alias('r').description('reset one or all apps to latest master branch').action(_commands.reset);

_commander.default.command('checkout <app> [branch]').alias('c').description('checkout specified branch').action(_commands.checkout);

_commander.default.command('deploy <app> [branch]').alias('d').description('checkout specified branch and run the deploy script').action(_commands.deploy);

_commander.default.command('status [app]').alias('s').description('show the current branch for specified app').option('-l, --long', 'long listing mode').action(_commands.status);

_commander.default.command('logs <app>').alias('l').description('show the logs for specified app').action(_commands.logs);

_commander.default.parse(process.argv); // show help if no args are provided


if (!_commander.default.args.length) _commander.default.help();