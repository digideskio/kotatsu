#!/usr/bin/env node
/**
 * Kotatsu CLI
 * ============
 *
 * The CLI tool that will call the lib's function.
 */
var kotatsu = require('./index.js'),
    path = require('path'),
    fs = require('fs');

// Building the CLI
var argv = require('yargs')
  .locale('en')
  .usage('Usage: kotatsu {options} [entry]')
  .demand(1)

  // Options
  .option('c', {
    alias: 'config',
    describe: 'Optional webpack config that will be merged with kotatsu\'s one (useful if you need specific loaders).'
  })
  .option('o', {
    alias: 'output',
    describe: 'Optional output directory where built files should be written (DO NOT use an existing directory because it will be erased).'
  })
  .option('s', {
    alias: 'sourcemaps',
    describe: 'Should source maps be computed for easier debugging?',
    type: 'boolean',
    default: false
  })

  // Help
  .help('h')
  .alias('h', 'help')
  .argv;

var entry = argv._[0],
    config = {};

// Should we load a config file?
if (argv.config)
  config = require(path.join(process.cwd(), argv.config));

// Ensuring that our entry exists
try {
  var stats = fs.lstatSync(entry);
}
catch (e) {
  console.error('Entry file does not exist:', entry);
  process.exit(1);
}

if (!stats.isFile()) {
  console.error('Entry file does not exist:', entry);
  process.exit(1);
}

// Creating the watcher
var watcher = kotatsu({
  cwd: process.cwd(),
  entry: entry,
  config: config,
  output: argv.output,
  sourcemaps: argv.sourcemaps
});
