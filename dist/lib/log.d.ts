import { Callback } from '../interface';

export declare class Logger {
    private baseDir;

    constructor(dirPath: string);

    public append(fileName: string, str: string, callback: Callback): void;

    public list(includeCompressLogs: boolean, callback: Callback): void;

    public compress(logId: string, newFileId: string, callback: Callback): void;

    public decompress(fileId: string, callback: Callback): void;

    public truncate(logId: string, callback: Callback): void;
}
