export function delay(ms: number) {
    return new Promise(r => setTimeout(() => r(2), ms));
}