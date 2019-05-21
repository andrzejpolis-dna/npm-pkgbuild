import globby from "globby";
import { join, basename } from "path";
import fs from "fs";
import { asArray } from "./util.mjs";

const encodingOptions = { encoding: "utf8" };

async function rm(file) {
  try {
    console.log("rm", file);
    return await fs.promises.unlink(file);
  } catch (error) {
    console.log(error);
  }
}

export async function cleanup(context, stagingDir) {
  for (const name of await globby(["**/package.json"], {
    cwd: stagingDir
  })) {
    const pkgFile = join(stagingDir, name);
    console.log(`cleanup ${pkgFile}`);

    const pkg = JSON.parse(
      await fs.promises.readFile(pkgFile, encodingOptions)
    );

    // unused files may also be deleted
    await Promise.all(
      ["unpkg", "jspm", "shim", "browser", "testling", "source"].map(
        async key => {
          if (pkg[key] !== undefined) {
            if (typeof pkg[key] !== "string") {
              const o = pkg[key];
              for (const k of o) {
                await rm(join(stagingDir, o[k]));
              }
              delete pkg[key];
            } else {
              const file = join(stagingDir, pkg[key]);
              delete pkg[key];
              return rm(file);
            }
          }
        }
      )
    );

    delete pkg.man;
    delete pkg.files;
    delete pkg.directories;

    delete pkg.devDependencies;
    delete pkg.bundleDependencies;
    delete pkg.peerDependencies;
    delete pkg.optionalDependencies;

    delete pkg.sideEffects;
    delete pkg.pika;
    delete pkg.private;
    delete pkg.publishConfig;
    delete pkg.repository;
    delete pkg.license;
    delete pkg.licenses;
    delete pkg.changelog;
    delete pkg.keywords;
    delete pkg.homepage;
    delete pkg.bugs;
    delete pkg.scripts;
    delete pkg.types;
    delete pkg.deprecated;
    delete pkg.description;
    delete pkg.engines;
    delete pkg.author;
    delete pkg.contributors;
    delete pkg.maintainers;
    delete pkg.verb;
    delete pkg.xo;
    delete pkg.prettier;
    delete pkg.jest;
    delete pkg.remarkConfig;
    delete pkg.nyc;
    delete pkg.publishConfig;
    delete pkg.typeScriptVersion;
    delete pkg.typesPublisherContentHash;
    delete pkg.typings;
    delete pkg.systemd;
    delete pkg.pacman;
    delete pkg.lintDeps;
    delete pkg.icon;
    delete pkg.config;
    delete pkg.release;
    delete pkg.template;
    delete pkg.spm;
    delete pkg["precommit.silent"];

    for (const key of Object.keys(pkg)) {
      if (key[0] === "_") {
        delete pkg[key];
      }
    }

    await fs.promises.writeFile(file, JSON.stringify(pkg), encodingOptions);
  }
}
