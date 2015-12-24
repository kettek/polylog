var pLog = require('./index.js');
var perr = pLog.new('Error', {logTime: true, logLabel: true, toTTY: true, toFile: 'error'});
var pdbg = pLog.new('Debug', {logLabel: true, toTTY: true, toFile: 'debug'});
var plog = pLog.log; // default TTY-based logger

//perr('test');

//plog('yo!');
//plog('Warning', 'yo!');
//plog('Warning', 'yo!');
//plog('yo!');

//plog(plog);
//console.log(plog);

var object = { error: 'oops!' };
perr('oh no, error: ', object);

//pdbg(a);

var a = {a: '3'};
pdbg('a', a, 'c');

plog(a);
//console.log(a);
