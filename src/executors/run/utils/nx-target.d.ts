export interface NxTargetOptions {
    target: string;
    checkUrl?: string;
    checkMaxTries?: number;
    env?: {
        [key: string]: string;
    };
    reuseExistingServer?: boolean;
    rejectUnauthorized?: boolean;
}
export declare class NxTarget {
    private _isAvailable;
    private _killProcess?;
    private _processExitedPromise;
    private _options;
    private killed;
    constructor(options: NxTargetOptions);
    setup(): Promise<void>;
    teardown(): Promise<void>;
    private _startProcess;
    private _waitForProcess;
    private _waitForAvailability;
}
