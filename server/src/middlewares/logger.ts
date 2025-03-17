"use strict"

import morgan from 'morgan';
import fs from 'node:fs';
import path from "node:path";

const now = new Date();
const today = now.toISOString().split('T')[0];
const rootDirectory = path.resolve(__dirname, "../..");
const logDirectory = path.join(rootDirectory, "logs");

if (!fs.existsSync(logDirectory)) {
    console.log("Logs folder has been created ");
    fs.mkdirSync(logDirectory, { recursive: true });
} else {
    console.log("Logs folder exists");
}

const logStream = fs.createWriteStream(
    path.join(logDirectory, `${today}.log`),
    { flags: "a+" }
);

export default morgan("combined", {
    stream: logStream,
});