import ifObject from "./ifObject.js";
import ifArray from "./ifArray.js";

function isPureObject(val) {
    return Object.prototype.toString.call(val) === '[object Object]';
};

const startFunc = (inJson, inFuncToRun) => {

    const loopInsideIfObject = isPureObject(inJson);

    if (loopInsideIfObject) {
        ifObject(inJson, "", inFuncToRun);
    };

    const loopInsideIsArray = Array.isArray(inJson);

    if (loopInsideIsArray) {
        ifArray(inJson, "", inFuncToRun);
    };
};

export default startFunc;