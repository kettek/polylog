/* index.js - polylog
polylog is an intentionally simple logging system.

Usage:
  var pLog = require('polylog');
  // create new Error label with full options
  var perr = pLog.new('Error', {logTime: true, logLabel: true, toTTY: true, toFile: 'error.log'});
  var object = { error: 'oops!' };
  perr('oh no, error: ', object); 
  // output to stdout and file:
  // 2015-12-23T23:27:17.274Z Error: oh no, error: { error: 'oops!' }
  // get default stdout/TTY logger
  var plog = pLog.log; // or pLog.get('');
*/
/* ==== REQUIRES ============================================================ */
var fs = require('fs');
var util = require('util');
var stream = require('stream');
/* ==== GLOBAL OBJECTS ====================================================== */
var pipers = [];  // label-based associative array to stream.PassThrough objects
var labels = {};  // label-based associative array of log-building functions
var enabled = []; // logging state of a given label
/* ==== FUNCTIONS =========================================================== */ 
/* _log(label, arguments)
Internal function that attempts to log with the given label. Arguments parameter
may be anything or an instance of Arguments for variadic arguments. All
arguments are parsed by util.format.
*/
function _log(arg1, arg2) {
  if (enabled[arg1] === false) return;
  // parse arguments
  var label = arg1;
  var msg = '';
  if (arg2 instanceof Arguments) {
    for (arg in arg2) {
      msg += util.format(arg2[arg]);
    }
  } else {
    msg = util.format(arg2);
  }
  // build our output customization string
  var str = '';
  if (typeof labels[label] !== 'undefined') {
    for (var j = labels[label].length-1; j >= 0; j--) {
      str = labels[label][j](str);
      if (j === 0) str += ' ';
    }
  }
  // write to label's Piper
  pipers[label].write(str+msg+'\n');
}
/* _new(label, options)
Creates a new label for logging, such as "Error" or similar.

options object may contain:
  * bool logLabel
    * prepends the label to the log
  * bool logTime
    * prepends the current timestamp in ISO format
  * bool toTTY
    * logs to stdout
  * string toFile
    * logs to a given file

Returns:
  a logging function for the given label
*/
function _new(label, options) {
  labels[label] = [];
  pipers[label] = new stream.PassThrough();
  if (typeof options !== 'undefined') {
    if (options.logTime === true) {
      labels[label].push(function(str) { return new Date().toISOString()+' '+ str; });
    }
    if (options.logLabel === true) {
      labels[label].push(function(str) { return label+':'+str; });
    }
    if (options.toTTY === true) {
      if (process.stdin.isTTY) {
        pipers[label].pipe(process.stdout);
      }
    }
    if (options.toFile) {
      var writable = fs.createWriteStream(options.toFile, { flags: 'a' } );
      pipers[label].pipe(writable);
    }
  }
  enabled[label] = true;
  return get(label);
}
/* get(label)
returns a function that calls the internal log of the given label
*/
function get(label) {
  return function() { _log(label, toArguments(arguments)); };
}
/* disable(label)
disables the given label for logging
*/
function disable(label) {
  enabled[label] = false;
}
/* enable(label)
enables the given label for logging
*/
function enable(label) {
  enabled[label] = true;
}
/* Special internal object format for "variadic" arguments */
function Arguments() {}
function toArguments(obj) {
  var args = new Arguments();
  for (var attr in obj) {
    args[attr] = obj[attr];
  }
  return args;
}
/* ==== EXPOSED METHODS ===================================================== */
module.exports.new = _new;
module.exports.get = get;
module.exports.enable = enable;
module.exports.disable = disable;
/* ==== EXPOSED VARIABLES =================================================== */
module.exports.pipers = pipers;
module.exports.labels = labels;
// create default log
module.exports.log = _new('', {toTTY: true});
