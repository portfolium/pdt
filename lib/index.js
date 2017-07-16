#!/usr/bin/env node
'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _commands = require('./commands');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pkg = require('../package.json');

_commander2.default.version(pkg.version).description('Portfolium Deploy Tool (pdt)');

_commander2.default.command('reset [app]').alias('r').description('reset one or all apps to latest master branch').action(_commands.reset);

_commander2.default.command('checkout <app> [branch]').alias('c').description('checkout specified branch').action(_commands.checkout);

_commander2.default.command('deploy <app> [branch]').alias('d').description('checkout specified branch and run the deploy script').action(_commands.deploy);

_commander2.default.command('status [app]').alias('s').description('show the current branch for specified app').option('-l, --long', 'long listing mode').action(_commands.status);

_commander2.default.command('logs <app>').alias('l').description('show the logs for specified app').action(_commands.logs);

_commander2.default.parse(process.argv);

// show help if no args are provided
if (!_commander2.default.args.length) _commander2.default.help();