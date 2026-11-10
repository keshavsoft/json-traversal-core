import startFunc from "../../src/v1/index.js";

import dataJson from "./data.json" with {type: "json"};

const funcToRun = (key, value, inPath) => {
    console.log("key : ", key, value, inPath);
};

startFunc(dataJson, funcToRun);