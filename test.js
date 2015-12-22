var pLog = require('./index.js').init("file")
var perr = pLog.new('Error', {logTime: true, logLabel: true});
var pdbg = pLog.new('Debug', {logLabel: true});
var plog = pLog.get('');

//perr('test');

//plog('yo!');
//plog('Warning', 'yo!');
//plog('Warning', 'yo!');
//plog('yo!');

//plog(plog);
//console.log(plog);

//pdbg(a);

function vara() {
  console.log(arguments);
  var obj = {};
  console.log(arguments[0] instanceof Arguments);
  console.log(typeof arguments);
}

r_vara = function() {
  vara(toArguments(arguments));
}

function Arguments(obj) {};
function toArguments(obj) {
  var arg = new Arguments();
  for (var attr in obj) {
    arg[attr] = obj[attr];
  }
  return arg;
}

var a = {a: '3'};
plog('a', a, 'c');

//plog(a);
//console.log(a);
