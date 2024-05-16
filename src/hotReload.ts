import { minimatch } from 'minimatch';
import { loadAllPaths, filterStrings } from '../utils/utils';

export interface ReloadFunctionConfig {
    fnOptions?: any[];
    callbackFunction?: (path: string, pull: any) => Promise<void> | void;
    pathGlob: string;
    path: string;
    pull: any;
}

interface ReloadOptions {
    excluded?: string[];
    onlyReload?: string[];
    functionsToLoad?: ReloadFunctionConfig[];
}

interface ReloadInformation {
    success: string[];
    failed: { error: TypeError; path: string }[];
}

export const hotReload = async (options: ReloadOptions = {}): Promise<ReloadInformation> => {
    const excluded = options.excluded?.filter(filterStrings) ?? [];
    const onlyReload = options.onlyReload?.filter(filterStrings) ?? ['*'];
    const functionsToLoad = options.functionsToLoad?.filter(
        (x) => typeof x?.pathGlob === 'string' && x?.pathGlob?.length > 0
    );
    const toReload: string[] = [];

    const paths = Object.values(require.cache)
        .map((x) => x.filename)
        .sort((a, b) => {
            const isAJson = a.endsWith('.json');
            const isBJson = b.endsWith('.json');
            return isAJson === isBJson ? 0 : isAJson ? -1 : 1;
        });

    if (!onlyReload.length) {
        throw new SyntaxError('No paths to reload since onlyReload is empty');
    }

    for await (const path of paths) {
        if (excluded.length && excluded.some((glob) => minimatch(path, glob, { matchBase: true, dot: true }))) {
            continue;
        }

        if (!onlyReload.length || !onlyReload.some((glob) => minimatch(path, glob, { matchBase: true, dot: true }))) {
            continue;
        }

        toReload.push(path);
    }

    const returnVal = await loadAllPaths(toReload, functionsToLoad);
    return returnVal;
};
