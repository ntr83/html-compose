#!/usr/bin/env node

import path from "node:path";
import watch from "node-watch";
import { buildProject } from "../src/buildProject.js";

const args = process.argv.slice(2);

const srcDir = args[0] || "src";
const distDir = args[1] || "dist";
const isWatch = args.includes("--watch");

async function runBuild() {
    try {
        await buildProject(path.resolve(srcDir), path.resolve(distDir));
        console.log("[html-compose] build complete");
    } catch (err) {
        console.error("[html-compose] build error");
        console.error(err);
    }
}

await runBuild();

if (isWatch) {
    console.log("[html-compose] watch mode");

    watch(srcDir, { recursive: true }, async (eventType, filename) => {

        if (!filename.endsWith(".html")) return;

        console.log(`[html-compose] ${eventType}: ${filename}`);

        await runBuild();
    });
}