// const { hotReload } = require("hotreload"); // you should require from a package.
import { hotReload } from "../index";

// you have 30 seconds, to change the project files: utils/delay.js, utils/uuId.js, data.json, exports/stonks.js
require("./exports/stonks.ts")();

async function reloadProject() {
    const res = await hotReload({
        excluded: [ "**/node_modules/**", "**/index.js" ], // don't reload stuff with node_modules in path
        onlyReload: [ "**/*.js", "**/*.json" ], // only reload stuff which ends with *.js or **/*.json
        functionsToLoad: [ // array of objects, with pathGlobs, and callbackFunction, which get's executed when the pathGlob match is true
            {
                pathGlob: "**/exports/**/*.ts",
                callbackFunction: (path, pull) => {
                    pull();
                },
                path: "", // Pass it somehow
                pull: undefined // And this
            }
        ]
    })
    console.log(`Successfully reloaded ${res.success.length} Paths, and failed on ${res.failed.length}`)
    res.failed.forEach(data => console.error(data));
    return; // you could also return res;
}
// reload project in 30 seconds
setTimeout(async () => {
    await reloadProject();
}, 15000)