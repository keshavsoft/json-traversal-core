import ifObject from "./ifObject.js";

function isPureObject(val) {
    return Object.prototype.toString.call(val) === '[object Object]';
};

const startFunc = (inArray, inPath, inFuncToRun) => {
    inArray.forEach(element => {
        const ifObject = isPureObject(element, inPath, inFuncToRun);

        ifObject(element, `${inPath}.${key}`);
    });
};

export default startFunc;