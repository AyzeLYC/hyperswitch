let package_loader = false; /* false if NodeJS is using CommonJS, true if NodeJS is using ECMAScript */

try {

    require.main;
    
} catch(err) {

    package_loader = true;
    
};

var dependancies = {};

if (package_loader === false) {

    let { group } = require("k6"),
        { Counter } = require("k6/metrics"),
        { readBaseline, storeResult } = require("./helper/compare-result.js"),
        { setup_merchant_apikey } = require("./helper/setup.js"),
        paymentCreateAndConfirmFunc = require("./payment-create-and-confirm.js"),
        paymentConfirmFunc = require("./payment-confirm.js");
    
    dependancies["group"] = group;
    dependancies["Counter"] = Counter;
    dependancies["readBaseline"] = readBaseline;
    dependancies["storeResult"] = storeResult;
    dependancies["setup_merchant_apikey"] = setup_merchant_apikey;
    dependancies["paymentCreateAndConfirmFunc"] = paymentCreateAndConfirmFunc;
    
};
if (package_loader === true) {
    
    import { group } from 'k6';
    import { Counter } from "k6/metrics";
    import { readBaseline, storeResult } from "./helper/compare-result.js";
    import { setup_merchant_apikey } from "./helper/setup.js";
    import paymentCreateAndConfirmFunc from './payment-create-and-confirm.js';
    import paymentConfirmFunc from './payment-confirm.js';
    
    dependancies["group"] = group;
    dependancies["Counter"] = Counter;
    dependancies["readBaseline"] = readBaseline;
    dependancies["storeResult"] = storeResult;
    dependancies["setup_merchant_apikey"] = setup_merchant_apikey;
    dependancies["paymentCreateAndConfirmFunc"] = paymentCreateAndConfirmFunc;
    
};

export const requests = new dependancies["Counter"]("http_reqs");

const baseline = dependancies["readBaseline"]("rps");

export const options = {
    scenarios: {
        contacts: {
            executor: 'per-vu-iterations',
            vus: 10,
            iterations: 100,
            maxDuration: '5m',
        },
    },
};

export function setup() {
    
    return dependancies["setup_merchant_apikey"]();
    
};

export default function (data) {
    
    dependancies["group"]("create payment and confirm", function() {
        
        dependancies["paymentCreateAndConfirmFunc"](data);
        
    });
    dependancies["group"]("create confirmed payment", function() {
        
        dependancies["paymentConfirmFunc"](data);
        
    });
    
};

export function handleSummary(data) {
    
    return dependancies["storeResult"]("rps", baseline, data);
    
};
