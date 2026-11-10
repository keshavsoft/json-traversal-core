import fs from "fs";
import startFunc from "../../src/index.js";

import dataJson from "./data.json" with {type: "json"};
const outputFolderName = "output";

const funcToRun = (key, value, inPath) => {
    // fs.mkdirSync()
    if (inPath === "") {
        fs.mkdirSync(`./${outputFolderName}/${key}`);
        console.log(": ", key, value, inPath);
    } else {
        // const localPathFirstReplace = inPath.replace(".", "./");

        const localPath = inPath.replaceAll(".", "/");
        const localPathToCreate = `${localPath}/${key}`;

        fs.mkdirSync(`./${outputFolderName}/${localPathToCreate}`);
        console.log("key : ", localPathToCreate);
    };

};

startFunc(dataJson, funcToRun);