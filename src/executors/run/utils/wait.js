"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wait = void 0;
const wait = (seconds) => new Promise((resolve) => {
    setTimeout(() => {
        resolve();
    }, seconds * 1000);
});
exports.wait = wait;
//# sourceMappingURL=wait.js.map