import { ExecutorContext } from '@nrwl/devkit';
import { NxTargetOptions } from './utils/nx-target';
interface Options {
    runner: 'cypress' | 'playwright' | 'run-commands';
    runnerTarget?: string;
    watch?: boolean;
    targets: NxTargetOptions[];
}
export declare function endToEndRunner(options: Options, context: ExecutorContext): Promise<{
    success: boolean;
}>;
export default endToEndRunner;
