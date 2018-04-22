import { debuglog } from 'util';
import { Logger } from './lib/log';

const debugAppend = debuglog('append');
const debugList = debuglog('list');
const debugCompress = debuglog('compress');
const debugUnCmp = debuglog('uncompress');
const debugTrunc = debuglog('truncate');

const logger = new Logger('/../../.logs/');

logger.append('default', 'Test log 2', (err, msg) => {
    if ( !err ) {
        debugAppend('Logging to file succeeded');
    } else {
        debugAppend('Logging to file failed ', msg ? msg.message : '');
    }
});

logger.list(false, (err, msg, data) => {
    if ( !err ) {
        data.forEach((item: string) => console.log(item));
    } else {
        debugList('Error reading directory: ', msg ? msg.message : '');
    }
});

logger.compress('test_log2', 'test2_cmp', (err, msg) => {
    if ( !err ) {
        debugCompress('Compress Success');
    } else {
        debugCompress(msg ? msg.message : 'Compress Failed');
    }
});

logger.decompress('test2_cmp', (err, data, msg) => {
    if ( !err && data ) {
        console.log(data);
    } else {
        debugUnCmp(msg ? msg.message : '');
    }
});

logger.truncate('test_log2', (err, msg) => {
    if ( !err ) {
        debugTrunc('Truncated successfully');
    } else {
        debugTrunc(msg ? msg.message : 'Truncate Failed');
    }
});

export default Logger;