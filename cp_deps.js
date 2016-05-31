#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const libDir = path.join(__dirname, "app", "lib");
const pkg = require(path.resolve(__dirname, "package.json"));

const deps = pkg.dependencies;

for (let key in deps) {
    let dep = key;
    let repoPath = path.resolve(__dirname, "node_modules", dep);

    let mainPkg = path.join(repoPath, "package.json");
    let main = JSON.parse(fs.readFileSync(mainPkg, "utf-8")).main;

    let mainPath = path.join(repoPath, main);

    let mainFile = fs.readFileSync(mainPath, "utf-8");
    let mainOutPath = path.resolve(libDir, path.basename(mainPath));
    fs.writeFileSync(mainOutPath, mainFile);

    console.log(`Copied ${mainPath} over to ${mainOutPath}.`);
}
