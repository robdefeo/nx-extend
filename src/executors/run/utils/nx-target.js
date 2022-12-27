"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NxTarget = void 0;
const tslib_1 = require("tslib");
const devkit_1 = require("@nrwl/devkit");
const childProcess = require("child_process");
const is_api_live_1 = require("./is-api-live");
const wait_1 = require("./wait");
class NxTarget {
    constructor(options) {
        this.killed = false;
        this._options = options;
        this._isAvailable = () => (0, is_api_live_1.isApiLive)(options.checkUrl, {
            rejectUnauthorized: options.rejectUnauthorized
        });
    }
    setup() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield this._startProcess();
                yield this._waitForProcess();
            }
            catch (error) {
                yield this.teardown();
                throw error;
            }
        });
    }
    teardown() {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            devkit_1.logger.info(`Stopping target "${this._options.target}"`);
            yield ((_a = this._killProcess) === null || _a === void 0 ? void 0 : _a.call(this));
            this.killed = true;
        });
    }
    _startProcess() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let processExitedReject = (error) => { };
            this._processExitedPromise = new Promise((_, reject) => (processExitedReject = reject));
            const isAlreadyAvailable = yield this._isAvailable();
            if (isAlreadyAvailable) {
                if (this._options.reuseExistingServer) {
                    devkit_1.logger.info(`Reusing existing server for target "${this._options.target}"`);
                    return;
                }
                throw new Error(`${this._options.checkUrl} is already used, make sure that nothing is running on the port/url or set reuseExistingServer:true.`);
            }
            devkit_1.logger.info(`Starting target "${this._options.target}"`);
            this._killProcess = yield launchProcess(this._options.target, {
                onExit: (code) => processExitedReject(new Error(`Target "${this._options.target}" was not able to start. Exit code: ${code}`)),
                env: this._options.env
            });
            if (this.killed) {
                yield this._killProcess();
            }
        });
    }
    _waitForProcess() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this._waitForAvailability();
            devkit_1.logger.info(`Target "${this._options.target}" is live`);
        });
    }
    _waitForAvailability() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const cancellationToken = { canceled: this.killed };
            const error = yield Promise.race([
                waitFor(this._options, this._isAvailable, cancellationToken),
                this._processExitedPromise
            ]);
            cancellationToken.canceled = true;
            if (error) {
                throw new Error(`Error waiting for target "${this._options.target}" to start.`);
            }
        });
    }
}
exports.NxTarget = NxTarget;
function waitFor(options, waitFn, cancellationToken) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let serverIsLive = yield waitFn();
        let waitTries = 0;
        while (!serverIsLive && !cancellationToken.canceled) {
            devkit_1.logger.debug(`Target "${options.target}" is not live yet, waiting...`);
            yield (0, wait_1.wait)(2);
            waitTries++;
            if (waitTries >= (options.checkMaxTries || 15)) {
                break;
            }
            serverIsLive = yield waitFn();
        }
        return !serverIsLive;
    });
}
function launchProcess(targetString, options) {
    const { project, target, configuration } = (0, devkit_1.parseTargetString)(targetString);
    const spawnedProcess = childProcess.spawn(`npx nx ${target} ${project} ${configuration ? `--configuration=${configuration}` : ''}`, [], {
        stdio: 'inherit',
        detached: true,
        shell: true,
        cwd: process.cwd(),
        env: Object.assign(Object.assign({}, process.env), options.env)
    });
    let processClosed = false;
    spawnedProcess.once('exit', (exitCode, signal) => {
        processClosed = true;
        options.onExit(exitCode, signal);
    });
    spawnedProcess.on('data', (line) => console.error(line.toString()));
    return () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (spawnedProcess.pid && !spawnedProcess.killed && !processClosed) {
            spawnedProcess.removeAllListeners();
            process.kill(-spawnedProcess.pid, 'SIGKILL');
        }
    });
}
//# sourceMappingURL=nx-target.js.map