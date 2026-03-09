import fs from "node:fs/promises";
import path from "node:path";
import { compileFile } from "./compileFile.js";

async function findHtmlFiles(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            files.push(...await findHtmlFiles(fullPath));
            continue;
        }

        if (entry.isFile() && entry.name.endsWith(".html")) {
            files.push(fullPath);
        }
    }

    return files;
}

function isPrivateTemplate(filePath, rootDir) {
    const relativePath = path.relative(rootDir, filePath);
    const parts = relativePath.split(path.sep);

    return parts.some((part) => part.startsWith("_"));
}

export async function buildProject(inputPath, outputPath) {
    const stat = await fs.stat(inputPath);

    // single file build
    if (stat.isFile()) {
        if (isPrivateTemplate(inputPath, path.dirname(inputPath))) {
            return;
        }

        const html = await compileFile(inputPath);

        await fs.mkdir(path.dirname(outputPath), { recursive: true });
        await fs.writeFile(outputPath, html, "utf8");

        console.log(`[html-compose] built ${inputPath}`);
        return;
    }

    // directory build
    if (stat.isDirectory()) {
        const htmlFiles = await findHtmlFiles(inputPath);

        for (const file of htmlFiles) {
            if (isPrivateTemplate(file, inputPath)) {
                continue;
            }

            const relativePath = path.relative(inputPath, file);
            const outPath = path.join(outputPath, relativePath);

            const html = await compileFile(file);

            await fs.mkdir(path.dirname(outPath), { recursive: true });
            await fs.writeFile(outPath, html, "utf8");
        }

        return;
    }

    throw new Error(`Unsupported input path: ${inputPath}`);
}