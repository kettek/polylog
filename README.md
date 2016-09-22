# polylog
polylog is an intentionally simple logger module for Node.js

## Usage
    var pLog = require('polylog');
    // create new Error label with full options
    var perr = pLog.new('Error', {logTime: true, logLabel: true, toTTY: true, toFile: 'error.log'});
    var object = { error: 'oops!' };
    perr('oh no, error: ', object);
    // or, get default stdout/TTY Logger
    var plog = pLog.log;

See `test.js` for more cases.
