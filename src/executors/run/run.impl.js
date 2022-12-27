"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.endToEndRunner = void 0;
const tslib_1 = require("tslib");
const nx_target_1 = require("./utils/nx-target");
let runningTargets = [];
function endToEndRunner(options, context) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let success;
        const { runner, targets } = options, rest = tslib_1.__rest(options, ["runner", "targets"]);
        runningTargets = targets.map((targetOptions) => new nx_target_1.NxTarget(targetOptions));
        // Start all targets
        yield Promise.all(runningTargets.map((nxTarget) => nxTarget.setup()));
        try {
            if (runner === 'cypress') {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const cypressExecutor = require('@nrwl/cypress/src/executors/cypress/cypress.impl').default;
                success = (yield cypressExecutor(rest, context)).success;
            }
            else if (runner === 'playwright') {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const playwrightExecutor = require('@nx-extend/playwright/src/executors/test/test.impl').default;
                success = (yield playwrightExecutor(rest, context)).success;
            }
            else if (runner === 'run-commands') {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const runCommandsExecutor = require('@nrwl/workspace/src/executors/run-commands/run-commands.impl').default;
                success = (yield runCommandsExecutor(rest, context)).success;
            }
            else {
                throw new Error(`Unknown runner "${runner}"`);
            }
        }
        catch (error) {
            console.error(error);
            success = false;
        }
        // Kill all targets
        yield Promise.all(runningTargets.map((nxTarget) => nxTarget.teardown()));
        return { success };
    });
}
exports.endToEndRunner = endToEndRunner;
process.on('SIGINT', function () {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        // Kill all targets
        yield Promise.all(runningTargets.map((nxTarget) => nxTarget.teardown()));
        process.exit();
    });
});
exports.default = endToEndRunner;
//# sourceMappingURL=run.impl.js.map