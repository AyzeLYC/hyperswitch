let package_loader = false; /* false if NodeJS uses CommonJS, true if NodeJS uses ECMAScript */

try {

    require.main
    
} catch(err) {

    package_loader = true;
    
};

var dependancies = {};

if (package_loader === false) {

    let http = require("k6/http"),
        { sleep, check } = require("k6"),
        { Counter } = require("k6/metrics"),
        { readBaseline, storeResult } = require("./helper/compare-result.js");

    dependancies["http"] = http;
    dependancies["sleep"] = sleep;
    dependancies["check"] = check;
    dependancies["Counter"] = Counter;
    dependancies["readBaseline"] = readBaseline;
    dependancies["storeResult"] = storeResult;
    
};
if (package_loader === true) {
    
    import http from "k6/http";
    import { sleep, check } from "k6";
    import { Counter } from "k6/metrics";
    import { readBaseline, storeResult } from "./helper/compare-result.js";
    
    dependancies["http"] = http;
    dependancies["sleep"] = sleep;
    dependancies["check"] = check;
    dependancies["Counter"] = Counter;
    dependancies["readBaseline"] = readBaseline;
    dependancies["storeResult"] = storeResult;

};

export const requests = new dependancies["Counter"]('http_reqs');

const baseline = dependancies["readBaseline"]("health");

export const options = {
    stages: [
        { duration: "10s", target: 25 },        // ramp up users to 25 in 10 seconds
        { duration: "10s", target: 25 },        // maintain 25 users for 10 seconds
        { duration: "10s", target: 0 }          // ramp down to 0 users in 10 seconds
    ],
    thresholds: {
        "http_req_duration": ["p(90) < 15"],   // 90% of requests must finish within 15ms.
    },
};

export default function () {
    
    const res = dependancies["http"].get("http://router-server:8080/health");
    dependanciees["check"](res, {
        "health status 200": (r) => r.status === 200,
    });
    
};

export function handleSummary(data) {
    
    return dependancies["storeResult"]("health", baseline, data);
    
};
