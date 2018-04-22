import { accessSync, appendFile, close, mkdirSync, open, readdir, readFile, truncate, writeFile } from 'fs';
import moment from 'moment';
import { join } from 'path';
// import { debuglog } from 'util';
import { gzip, unzip } from 'zlib';
import { Callback } from '../interface';

// const debugUnCmp = debuglog('uncompress');

export class Logger {
    private baseDir: string;

    constructor(dirPath: string) {
        this.baseDir = join(__dirname, dirPath);
        try {
            accessSync(this.baseDir);
        } catch ( err ) {
            mkdirSync(this.baseDir);
        }
    }

    // Method to write data to given log file
    public append(fileName: string, str: string, callback: Callback) {
        fileName = fileName === 'default' ? moment().format('YYYY-MM-DD') : fileName.trim();
        // Open fileName for appending
        open(`${this.baseDir}${fileName}.log`, 'a', (err, fileDescriptor) => {
            if ( !err && fileDescriptor ) {
                // Append to file and close it
                appendFile(fileDescriptor, str + '\n', (err2) => {
                    if ( !err2 ) {
                        close(fileDescriptor, (err3) => {
                            if ( !err3 ) {
                                callback(false);
                            } else {
                                callback('Error closing file that was being appended', err3);
                            }
                        });
                    } else {
                        callback('Error appending file', err2);
                    }
                });
            } else {
                callback('Error, could not open file for appending', err);
            }
        });
    }

    // List all the logs and optionally include the compressed logs
    public list(includeCompressLogs: boolean, callback: Callback) {
        readdir(this.baseDir, (err, data) => {
            if ( !err && data && data.length > 0 ) {
                const trimmedFileNames: string[] = [];
                data.forEach((filename: string) => {

                    // Add the .log Files
                    if ( filename.indexOf('.log') > -1 ) {
                        trimmedFileNames.push(filename.replace('.log', ''));
                    }

                    // Add the .gz files
                    if ( filename.indexOf('.gz.b64') > -1 && includeCompressLogs ) {
                        trimmedFileNames.push(filename.replace('.gz.b64', ''));
                    }
                });
                callback(false, null, trimmedFileNames);
            } else {
                callback('Error reading directory', err);
            }
        });
    }

    public compress(logId: string, newFileId: string, callback: Callback) {
        const sourceFile = logId + '.log';
        const destFile = newFileId + '.gz.b64';

        // Read the source file
        readFile(this.baseDir + sourceFile, 'utf8', (err, inputString) => {
            if ( !err && inputString ) {
                // Compress the data using gzip
                gzip(inputString, (err2, buffer) => {
                    if ( !err2 && buffer ) {
                        // Send the data to the destination file
                        open(this.baseDir + destFile, 'wx', (err3, fileDescriptor) => {
                            if ( !err3 && fileDescriptor ) {
                                writeFile(fileDescriptor, buffer.toString('base64'), (err4) => {
                                    if ( !err4 ) {
                                        close(fileDescriptor, (err5) => {
                                            if ( !err5 ) {
                                                callback(false);
                                            } else {
                                                callback(true, err5);
                                            }
                                        });
                                    } else {
                                        callback(true, err4);
                                    }
                                });
                            } else {
                                callback(true, err3);
                            }
                        });
                    } else {
                        callback(true, err2);
                    }
                });
            } else {
                callback(true, err);
            }
        });
    }

    // Decompress the contents of a .gz file into a string variable
    public decompress(fileId: string, callback: Callback) {
        const fileName = fileId + '.gz.b64';
        readFile(this.baseDir + fileName, 'utf8', (err, data) => {
            if ( !err && data ) {
                // Inflate the data
                const inputBuffer = Buffer.from(data, 'base64');
                unzip(inputBuffer, (err2, result) => {
                    if ( !err2 && result ) {
                        const str = result.toString();
                        // debugUnCmp(str);
                        callback(false, null, str);
                    } else {
                        callback(true, err2);
                    }
                });
            } else {
                callback(true, err);
            }
        });
    }

    // Truncate a log file
    public truncate(logId: string, callback: Callback) {
        truncate(this.baseDir + logId + '.log', 0, (err) => {
            if ( !err ) {
                callback(false);
            } else {
                callback(true, err);
            }
        });
    }
}