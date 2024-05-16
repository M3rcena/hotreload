import { resolve } from 'path';
import { minimatch } from 'minimatch';
import { ReloadFunctionConfig } from '../src/hotReload';

type FunctionOptions = any[];

interface ReloadInformation {
    success: string[];
    failed: { error: TypeError; path: string }[];
}

export const loadAllPaths = async (
    paths: string[],
    functionPaths: ReloadFunctionConfig[] = []
): Promise<ReloadInformation> => {
    const success: string[] = [];
    const failed: { error: TypeError; path: string }[] = [];
    const reloadFunctionPaths: ReloadFunctionConfig[] = [];

    await Promise.all(
        paths.map(async (path: string) => {
            try {
                delete require.cache[resolve(path)];
                const pull = require(resolve(path));

                const reloadFunction = functionPaths.find((x) =>
                    minimatch(path, x.pathGlob, { matchBase: true, dot: true })
                );

                if (reloadFunction && reloadFunction.callbackFunction) {
                    reloadFunctionPaths.push({ ...reloadFunction, path, pull });
                }

                success.push(path);
            } catch (error) {
                failed.push({ path, error: error as TypeError });
            }
        })
    );

    // Execute callbacks after everything is reloaded
    await Promise.all(
        reloadFunctionPaths.map(async ({ path, pull, callbackFunction }) => {
            try {
                if (callbackFunction) {
                    await callbackFunction(path, pull);
                }
            } catch (error) {
                const index = success.indexOf(path);
                if (index >= 0) {
                    success.splice(index, 1);
                }
                failed.push({ path, error: error as TypeError });
            }
        })
    );

    return { success, failed };
};

export const filterStrings = (str: string): boolean => typeof str === 'string' && str.length > 0;