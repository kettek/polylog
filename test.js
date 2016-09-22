var pLog = require('./index.js');

// use default TTY-only logger
  var log = pLog.log;
  log('A test message!');
// create an Error logger with timestamp, labeling, and output to TTY and 'error' file
  var error = pLog.new('Error', {logTime: true, logLabel: true, toTTY: true, toFile: 'error'});
  error('Something erroneous happened!');
// create a Debug logger with labeling, outputting to TTY and 'debug' file
  var debug = pLog.new('Debug', {logLabel: true, toTTY: true, toFile: 'debug'});
  var a = {a: '3'};
  debug(a);
// create a file logger, outputting to 'file'
  var log_to_file = pLog.new('File', {toFile: 'file'});
  log_to_file('Logged to file');



/*plog('beginning timing test');

var start = Date.now();
var tty = pLog.new('tty', {logTime: true, logLabel: true, toTTY: true});
var file = pLog.new('file', {logTime: true, logLabel: true, toTTY: false, toFile: 'file'});
var ttyfile = pLog.new('ttyfile', {logTime: true, logLabel: true, toTTY: true, toFile: 'file'});

var data = '...................................................';
for (var i = 0; i < 22; i++) {
  data += data;
}

var tty_start = Date.now();
tty(data);
console.log('tty: %d bytes in %dms', data.length, (Date.now() - tty_start));
tty_start = Date.now();
file(data);
console.log('file: %d bytes in %dms', data.length, (Date.now() - tty_start));
tty_start = Date.now();
ttyfile(data);
console.log('ttyfile: %d bytes in %dms', data.length, (Date.now() - tty_start));
*/
//console.log(a);
