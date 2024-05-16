import { delay } from "../utils/delay";
import { getUUID } from "../utils/uuId";
import JsonData from "../data.json" assert { type: "json" };
// start script
export default async () => {
    console.log(JsonData)
    for(let i = 0; i < 5; i++) {
        console.log(getUUID());
        await delay(100)
    }
    console.log("\n\n\n")
    /* // setInterval need to be stopped before u restart them...
     setInterval(() => {
        console.log(getUUID());
     }, 1000)
    */
}