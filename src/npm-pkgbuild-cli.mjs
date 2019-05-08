import { version, description } from "../package.json";
import fs, { createReadStream, createWriteStream } from "fs";
import { join } from "path";
import program from "commander";
import { pkgbuild } from "./pkgbuild.mjs";
import { systemd } from "./systemd.mjs";
import { pacman, makepkg } from "./pacman.mjs";
import { content } from "./content.mjs";
import { utf8StreamOptions } from "./util.mjs";
import { createContext } from "./context.mjs";

const cwd = process.cwd();

program
  .description(description)
  .version(version)
  .option("--pkgrel <number>", "package release", 1)
  .option("--pkgver <version>", "package version")
  .option("-p --package <dir>", "package directory", cwd)
  .option("-i --installdir <dir>", "install directory package content base")
  .option("-s --staging <dir>", "staging directory", "build")
  .option(
    "--publish <url>",
    "publishing url of the package (may also be given as env: PACMAN_PUBLISH)",
    process.env.PACMAN_PUBLISH
  )
  .option("--npm-modules", "include npm modules")
  .option("--npm-dist", "include npm dist")
  .command("[stages...]", "stages to execute")
  .action(async (...stages) => {
    stages.pop();

    const staging = program.staging;

    await fs.promises.mkdir(staging, { recursive: true });

    const context = await createContext(program.package, program);

    for (const stage of stages) {
      console.log(`executing ${stage}...`);
      switch (stage) {
        case "pkgbuild":
          await pkgbuild(
            context,
            staging,
            createWriteStream(join(staging, "PKGBUILD"), utf8StreamOptions),
            { npmDist: program.npmDist, npmModules: program.npmModules }
          );
          break;
        case "makepkg":
          makepkg(context, staging);

          break;
        case "systemd":
          await systemd(context, staging);
          break;
        case "pacman":
          await pacman(context, staging);
          break;
        case "content":
          await content(context, staging);
          break;

        default:
          console.error(`unknown stage ${stage}`);
      }
    }
  })
  .parse(process.argv);
