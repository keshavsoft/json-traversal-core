import ifObject from "./ifObject.js";
import ifArray from "./ifArray.js";

function isPureObject(val) {
    return Object.prototype.toString.call(val) === '[object Object]';
};

const startFunc = (inJson, inFuncToRun) => {

    const loopInsideIfObject = isPureObject(inJson);

    if (loopInsideIfObject) {
        ifObject(inJson, "ks", inFuncToRun);
    };

    const loopInsideIsArray = Array.isArray(inJson);

    if (loopInsideIsArray) {
        ifArray(inJson, "ks", inFuncToRun);
    };
};

export default startFunc;