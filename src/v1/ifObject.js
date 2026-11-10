import ifArray from "./ifArray.js";

function isPureObject(val) {
    return Object.prototype.toString.call(val) === '[object Object]';
};

const startFunc = (inObject, inPath, inFuncToRun) => {
    const ifObject = isPureObject(inObject);

    for (const [key, value] of Object.entries(inObject)) {
        const loopInsideIfObject = isPureObject(value);
        inFuncToRun(key, value, inPath);

        if (loopInsideIfObject) {
            startFunc(value, `${inPath}.${key}`, inFuncToRun);
        };

        const loopInsideIsArray = Array.isArray(value);

        if (loopInsideIsArray) {
            ifArray(value, `${inPath}.${key}`);
        };
    };
};

export default startFunc;