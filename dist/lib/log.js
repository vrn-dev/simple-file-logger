"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var moment_1 = __importDefault(require("moment"));
var path_1 = require("path");
// import { debuglog } from 'util';
var zlib_1 = require("zlib");
// const debugUnCmp = debuglog('uncompress');
var Logger = /** @class */ (function () {
    function Logger(dirPath) {
        this.baseDir = path_1.join(__dirname, dirPath);
        try {
            fs_1.accessSync(this.baseDir);
        }
        catch ( err ) {
            fs_1.mkdirSync(this.baseDir);
        }
    }

    // Method to write data to given log file
    Logger.prototype.append = function (fileName, str, callback) {
        fileName = fileName === 'default' ? moment_1.default().format('YYYY-MM-DD') : fileName.trim();
        // Open fileName for appending
        fs_1.open("" + this.baseDir + fileName + ".log", 'a', function (err, fileDescriptor) {
            if ( !err && fileDescriptor ) {
                // Append to file and close it
                fs_1.appendFile(fileDescriptor, str + '\n', function (err2) {
                    if ( !err2 ) {
                        fs_1.close(fileDescriptor, function (err3) {
                            if ( !err3 ) {
                                callback(false);
                            }
                            else {
                                callback('Error closing file that was being appended', err3);
                            }
                        });
                    }
                    else {
                        callback('Error appending file', err2);
                    }
                });
            }
            else {
                callback('Error, could not open file for appending', err);
            }
        });
    };
    // List all the logs and optionally include the compressed logs
    Logger.prototype.list = function (includeCompressLogs, callback) {
        fs_1.readdir(this.baseDir, function (err, data) {
            if ( !err && data && data.length > 0 ) {
                var trimmedFileNames_1 = [];
                data.forEach(function (filename) {
                    // Add the .log Files
                    if ( filename.indexOf('.log') > -1 ) {
                        trimmedFileNames_1.push(filename.replace('.log', ''));
                    }
                    // Add the .gz files
                    if ( filename.indexOf('.gz.b64') > -1 && includeCompressLogs ) {
                        trimmedFileNames_1.push(filename.replace('.gz.b64', ''));
                    }
                });
                callback(false, null, trimmedFileNames_1);
            }
            else {
                callback('Error reading directory', err);
            }
        });
    };
    Logger.prototype.compress = function (logId, newFileId, callback) {
        var _this = this;
        var sourceFile = logId + '.log';
        var destFile = newFileId + '.gz.b64';
        // Read the source file
        fs_1.readFile(this.baseDir + sourceFile, 'utf8', function (err, inputString) {
            if ( !err && inputString ) {
                // Compress the data using gzip
                zlib_1.gzip(inputString, function (err2, buffer) {
                    if ( !err2 && buffer ) {
                        // Send the data to the destination file
                        fs_1.open(_this.baseDir + destFile, 'wx', function (err3, fileDescriptor) {
                            if ( !err3 && fileDescriptor ) {
                                fs_1.writeFile(fileDescriptor, buffer.toString('base64'), function (err4) {
                                    if ( !err4 ) {
                                        fs_1.close(fileDescriptor, function (err5) {
                                            if ( !err5 ) {
                                                callback(false);
                                            }
                                            else {
                                                callback(true, err5);
                                            }
                                        });
                                    }
                                    else {
                                        callback(true, err4);
                                    }
                                });
                            }
                            else {
                                callback(true, err3);
                            }
                        });
                    }
                    else {
                        callback(true, err2);
                    }
                });
            }
            else {
                callback(true, err);
            }
        });
    };
    // Decompress the contents of a .gz file into a string variable
    Logger.prototype.decompress = function (fileId, callback) {
        var fileName = fileId + '.gz.b64';
        fs_1.readFile(this.baseDir + fileName, 'utf8', function (err, data) {
            if ( !err && data ) {
                // Inflate the data
                var inputBuffer = Buffer.from(data, 'base64');
                zlib_1.unzip(inputBuffer, function (err2, result) {
                    if ( !err2 && result ) {
                        var str = result.toString();
                        // debugUnCmp(str);
                        callback(false, null, str);
                    }
                    else {
                        callback(true, err2);
                    }
                });
            }
            else {
                callback(true, err);
            }
        });
    };
    // Truncate a log file
    Logger.prototype.truncate = function (logId, callback) {
        fs_1.truncate(this.baseDir + logId + '.log', 0, function (err) {
            if ( !err ) {
                callback(false);
            }
            else {
                callback(true, err);
            }
        });
    };
    return Logger;
}());
exports.Logger = Logger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYi9sb2cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx5QkFBNEc7QUFDNUcsa0RBQTRCO0FBQzVCLDZCQUE0QjtBQUM1QixtQ0FBbUM7QUFDbkMsNkJBQW1DO0FBR25DLDZDQUE2QztBQUU3QztJQUdJLGdCQUFZLE9BQWU7UUFDdkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxXQUFJLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3hDLElBQUk7WUFDQSxlQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzVCO1FBQUMsT0FBUSxHQUFHLEVBQUc7WUFDWixjQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzNCO0lBQ0wsQ0FBQztJQUVELHlDQUF5QztJQUNsQyx1QkFBTSxHQUFiLFVBQWMsUUFBZ0IsRUFBRSxHQUFXLEVBQUUsUUFBa0I7UUFDM0QsUUFBUSxHQUFHLFFBQVEsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLGdCQUFNLEVBQUUsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNwRiw4QkFBOEI7UUFDOUIsU0FBSSxDQUFDLEtBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLFNBQU0sRUFBRSxHQUFHLEVBQUUsVUFBQyxHQUFHLEVBQUUsY0FBYztZQUM1RCxJQUFLLENBQUMsR0FBRyxJQUFJLGNBQWMsRUFBRztnQkFDMUIsOEJBQThCO2dCQUM5QixlQUFVLENBQUMsY0FBYyxFQUFFLEdBQUcsR0FBRyxJQUFJLEVBQUUsVUFBQyxJQUFJO29CQUN4QyxJQUFLLENBQUMsSUFBSSxFQUFHO3dCQUNULFVBQUssQ0FBQyxjQUFjLEVBQUUsVUFBQyxJQUFJOzRCQUN2QixJQUFLLENBQUMsSUFBSSxFQUFHO2dDQUNULFFBQVEsQ0FBQyxLQUFL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USxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQzthQUN2QjtRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELHNCQUFzQjtJQUNmLHlCQUFRLEdBQWYsVUFBZ0IsS0FBYSxFQUFFLFFBQWtCO1FBQzdDLGFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssR0FBRyxNQUFNLEVBQUUsQ0FBQyxFQUFFLFVBQUMsR0FBRztZQUMzQyxJQUFLLENBQUMsR0FBRyxFQUFHO2dCQUNSLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNuQjtpQkFBTTtnQkFDSCxRQUFRLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2FBQ3ZCO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0wsYUFBQztBQUFELENBQUMsQUF0SUQsSUFzSUM7QUF0SVksd0JBQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhY2Nlc3NTeW5jLCBhcHBlbmRGaWxlLCBjbG9zZSwgbWtkaXJTeW5jLCBvcGVuLCByZWFkZGlyLCByZWFkRmlsZSwgdHJ1bmNhdGUsIHdyaXRlRmlsZSB9IGZyb20gJ2ZzJztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJztcbi8vIGltcG9ydCB7IGRlYnVnbG9nIH0gZnJvbSAndXRpbCc7XG5pbXBvcnQgeyBnemlwLCB1bnppcCB9IGZyb20gJ3psaWInO1xuaW1wb3J0IHsgQ2FsbGJhY2sgfSBmcm9tICcuLi9pbnRlcmZhY2UnO1xuXG4vLyBjb25zdCBkZWJ1Z1VuQ21wID0gZGVidWdsb2coJ3VuY29tcHJlc3MnKTtcblxuZXhwb3J0IGNsYXNzIExvZ2dlciB7XG4gICAgcHJpdmF0ZSBiYXNlRGlyOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihkaXJQYXRoOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5iYXNlRGlyID0gam9pbihfX2Rpcm5hbWUsIGRpclBhdGgpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYWNjZXNzU3luYyh0aGlzLmJhc2VEaXIpO1xuICAgICAgICB9IGNhdGNoICggZXJyICkge1xuICAgICAgICAgICAgbWtkaXJTeW5jKHRoaXMuYmFzZURpcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBNZXRob2QgdG8gd3JpdGUgZGF0YSB0byBnaXZlbiBsb2cgZmlsZVxuICAgIHB1YmxpYyBhcHBlbmQoZmlsZU5hbWU6IHN0cmluZywgc3RyOiBzdHJpbmcsIGNhbGxiYWNrOiBDYWxsYmFjaykge1xuICAgICAgICBmaWxlTmFtZSA9IGZpbGVOYW1lID09PSAnZGVmYXVsdCcgPyBtb21lbnQoKS5mb3JtYXQoJ1lZWVktTU0tREQnKSA6IGZpbGVOYW1lLnRyaW0oKTtcbiAgICAgICAgLy8gT3BlbiBmaWxlTmFtZSBmb3IgYXBwZW5kaW5nXG4gICAgICAgIG9wZW4oYCR7dGhpcy5iYXNlRGlyfSR7ZmlsZU5hbWV9LmxvZ2AsICdhJywgKGVyciwgZmlsZURlc2NyaXB0b3IpID0+IHtcbiAgICAgICAgICAgIGlmICggIWVyciAmJiBmaWxlRGVzY3JpcHRvciApIHtcbiAgICAgICAgICAgICAgICAvLyBBcHBlbmQgdG8gZmlsZSBhbmQgY2xvc2UgaXRcbiAgICAgICAgICAgICAgICBhcHBlbmRGaWxlKGZpbGVEZXNjcmlwdG9yLCBzdHIgKyAnXFxuJywgKGVycjIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhZXJyMiApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb3NlKGZpbGVEZXNjcmlwdG9yLCAoZXJyMykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggIWVycjMgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaygnRXJyb3IgY2xvc2luZyBmaWxlIHRoYXQgd2FzIGJlaW5nIGFwcGVuZGVkJywgZXJyMyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaygnRXJyb3IgYXBwZW5kaW5nIGZpbGUnLCBlcnIyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygnRXJyb3IsIGNvdWxkIG5vdCBvcGVuIGZpbGUgZm9yIGFwcGVuZGluZycsIGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIExpc3QgYWxsIHRoZSBsb2dzIGFuZCBvcHRpb25hbGx5IGluY2x1ZGUgdGhlIGNvbXByZXNzZWQgbG9nc1xuICAgIHB1YmxpYyBsaXN0KGluY2x1ZGVDb21wcmVzc0xvZ3M6IGJvb2xlYW4sIGNhbGxiYWNrOiBDYWxsYmFjaykge1xuICAgICAgICByZWFkZGlyKHRoaXMuYmFzZURpciwgKGVyciwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgaWYgKCAhZXJyICYmIGRhdGEgJiYgZGF0YS5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRyaW1tZWRGaWxlTmFtZXM6IHN0cmluZ1tdID0gW107XG4gICAgICAgICAgICAgICAgZGF0YS5mb3JFYWNoKChmaWxlbmFtZTogc3RyaW5nKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQWRkIHRoZSAubG9nIEZpbGVzXG4gICAgICAgICAgICAgICAgICAgIGlmICggZmlsZW5hbWUuaW5kZXhPZignLmxvZycpID4gLTEgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cmltbWVkRmlsZU5hbWVzLnB1c2goZmlsZW5hbWUucmVwbGFjZSgnLmxvZycsICcnKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBBZGQgdGhlIC5neiBmaWxlc1xuICAgICAgICAgICAgICAgICAgICBpZiAoIGZpbGVuYW1lLmluZGV4T2YoJy5nei5iNjQnKSA+IC0xICYmIGluY2x1ZGVDb21wcmVzc0xvZ3MgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cmltbWVkRmlsZU5hbWVzLnB1c2goZmlsZW5hbWUucmVwbGFjZSgnLmd6LmI2NCcsICcnKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhmYWxzZSwgbnVsbCwgdHJpbW1lZEZpbGVOYW1lcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCdFcnJvciByZWFkaW5nIGRpcmVjdG9yeScsIGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBjb21wcmVzcyhsb2dJZDogc3RyaW5nLCBuZXdGaWxlSWQ6IHN0cmluZywgY2FsbGJhY2s6IENhbGxiYWNrKSB7XG4gICAgICAgIGNvbnN0IHNvdXJjZUZpbGUgPSBsb2dJZCArICcubG9nJztcbiAgICAgICAgY29uc3QgZGVzdEZpbGUgPSBuZXdGaWxlSWQgKyAnLmd6LmI2NCc7XG5cbiAgICAgICAgLy8gUmVhZCB0aGUgc291cmNlIGZpbGVcbiAgICAgICAgcmVhZEZpbGUodGhpcy5iYXNlRGlyICsgc291cmNlRmlsZSwgJ3V0ZjgnLCAoZXJyLCBpbnB1dFN0cmluZykgPT4ge1xuICAgICAgICAgICAgaWYgKCAhZXJyICYmIGlucHV0U3RyaW5nICkge1xuICAgICAgICAgICAgICAgIC8vIENvbXByZXNzIHRoZSBkYXRhIHVzaW5nIGd6aXBcbiAgICAgICAgICAgICAgICBnemlwKGlucHV0U3RyaW5nLCAoZXJyMiwgYnVmZmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICggIWVycjIgJiYgYnVmZmVyICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2VuZCB0aGUgZGF0YSB0byB0aGUgZGVzdGluYXRpb24gZmlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgb3Blbih0aGlzLmJhc2VEaXIgKyBkZXN0RmlsZSwgJ3d4JywgKGVycjMsIGZpbGVEZXNjcmlwdG9yKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCAhZXJyMyAmJiBmaWxlRGVzY3JpcHRvciApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd3JpdGVGaWxlKGZpbGVEZXNjcmlwdG9yLCBidWZmZXIudG9TdHJpbmcoJ2Jhc2U2NCcpLCAoZXJyNCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCAhZXJyNCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9zZShmaWxlRGVzY3JpcHRvciwgKGVycjUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCAhZXJyNSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHRydWUsIGVycjUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHRydWUsIGVycjQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayh0cnVlLCBlcnIzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHRydWUsIGVycjIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKHRydWUsIGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIERlY29tcHJlc3MgdGhlIGNvbnRlbnRzIG9mIGEgLmd6IGZpbGUgaW50byBhIHN0cmluZyB2YXJpYWJsZVxuICAgIHB1YmxpYyBkZWNvbXByZXNzKGZpbGVJZDogc3RyaW5nLCBjYWxsYmFjazogQ2FsbGJhY2spIHtcbiAgICAgICAgY29uc3QgZmlsZU5hbWUgPSBmaWxlSWQgKyAnLmd6LmI2NCc7XG4gICAgICAgIHJlYWRGaWxlKHRoaXMuYmFzZURpciArIGZpbGVOYW1lLCAndXRmOCcsIChlcnIsIGRhdGEpID0+IHtcbiAgICAgICAgICAgIGlmICggIWVyciAmJiBkYXRhICkge1xuICAgICAgICAgICAgICAgIC8vIEluZmxhdGUgdGhlIGRhdGFcbiAgICAgICAgICAgICAgICBjb25zdCBpbnB1dEJ1ZmZlciA9IEJ1ZmZlci5mcm9tKGRhdGEsICdiYXNlNjQnKTtcbiAgICAgICAgICAgICAgICB1bnppcChpbnB1dEJ1ZmZlciwgKGVycjIsIHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoICFlcnIyICYmIHJlc3VsdCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0ciA9IHJlc3VsdC50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZGVidWdVbkNtcChzdHIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZmFsc2UsIG51bGwsIHN0cik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayh0cnVlLCBlcnIyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayh0cnVlLCBlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBUcnVuY2F0ZSBhIGxvZyBmaWxlXG4gICAgcHVibGljIHRydW5jYXRlKGxvZ0lkOiBzdHJpbmcsIGNhbGxiYWNrOiBDYWxsYmFjaykge1xuICAgICAgICB0cnVuY2F0ZSh0aGlzLmJhc2VEaXIgKyBsb2dJZCArICcubG9nJywgMCwgKGVycikgPT4ge1xuICAgICAgICAgICAgaWYgKCAhZXJyICkge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGZhbHNlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sodHJ1ZSwgZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufSJdfQ==