import fs from "node:fs/promises";
import path from "node:path";

export async function compileFile(filePath, props = {}) {

    const content = await fs.readFile(filePath, "utf8");

    const include = async (includePath, childProps = {}) => {
        const resolvedPath = path.resolve(path.dirname(filePath), includePath);

        return await compileFile(resolvedPath, {
            ...props,
            ...childProps
        });
    }

    const ifHelper = (condition, html) => {
        return condition ? html : '';
    }

    const renderer = new Function(
        "props",
        "include",
        "iff",
        `
    return (async () => {
      return String.raw\`${content}\`;
    })();
    `
    );

    return await renderer(props, include, ifHelper);
}