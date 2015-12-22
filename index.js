var fs = require('fs');
var util = require('util');

var streams = [];
var labels = {};
var chain;

function _log(arg1, arg2) {
  var label = '';
  var msg = '';
  if (typeof arg2 === 'undefined') {
    if (arg1 instanceof Arguments) {
      for (var arg in arg1) {
        msg += util.format(arg1[arg]);
      }
    } else {
      msg = util.format(arg1);
    }
  } else {
    label = arg1;
    if (arg2 instanceof Arguments) {
      for (var arg in arg2) {
        msg += util.format(arg2[arg]);
      }
    } else {
      msg = util.format(arg2);
    }
  }
 
  // build our output customization string
  var str = '';
  if (typeof labels[label] !== 'undefined') {
    for (var j = labels[label].length-1; j >= 0; j--) {
      str = labels[label][j](str);
      if (j == 0) str += ' ';
    }
  }
  // write our string to our streams
  for (var i = 0; i < streams.length; i++) {
    streams[i].write(str+msg+'\n');
  }
  return module.exports;
}

function init(file) {
  if (typeof file !== 'undefined') {
    var writable = fs.createWriteStream(file);
    streams.push(writable);
  }
  if (process.stdin.isTTY) {
    streams.push(process.stdin);
  }
  return module.exports;
}
module.exports.init = init;

function setup() {
  var cur, last;
  chain = cur = last = streams[0];
  for (var i = 0; i < streams.length; i++) {
    cur = streams[i];
    if (last != cur) {
      last.pipe(cur);
    }
    last = cur;
  }
  return module.exports;
}
module.exports.setup = setup;

function _new(label, options) {
  labels[label] = [];
  if (typeof options !== 'undefined') {
    if (options.logLabel == true) {
      labels[label].push(function(str) { return label+str });
    }
    if (options.logTime == true) {
      labels[label].push(doTime);
    }
  }
  streams[label] = [];
  return get(label);
}
module.exports.new = _new;

function get(label) {
  return function() { _log(label, toArguments(arguments)) };
}
module.exports.get = get;
module.exports.log = _new('');

function doTime(str) {
  var new_str = '('+new Date().toISOString() + '):' + str;
  return new_str;
}

function Arguments() {};
function toArguments(obj) {
  var args = new Arguments();
  for (var attr in obj) {
    args[attr] = obj[attr];
  }
  return args;
}
