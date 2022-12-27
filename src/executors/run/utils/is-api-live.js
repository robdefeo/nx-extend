"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isApiLive = void 0;
const tslib_1 = require("tslib");
const axios_1 = require("axios");
const https_1 = require("https");
const isApiLive = (url, options = {}) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const axiosConfig = {
        timeout: 500
    };
    if ((options === null || options === void 0 ? void 0 : options.rejectUnauthorized) !== undefined) {
        axiosConfig.httpsAgent = new https_1.Agent({
            rejectUnauthorized: options.rejectUnauthorized
        });
    }
    return axios_1.default
        .get(url, axiosConfig)
        .then((response) => {
        return response.status >= 200 && response.status < 300;
    })
        .catch(() => {
        return false;
    });
});
exports.isApiLive = isApiLive;
//# sourceMappingURL=is-api-live.js.map