import { join } from "path";
import fs from "fs";
import { createContext as ee } from "expression-expander";
import { utf8StreamOptions } from "./util.mjs";

export async function loadPackage(dir) {
  const pkgFile = join(dir, "package.json");
  return JSON.parse(await fs.promises.readFile(pkgFile, utf8StreamOptions));
}

/**
 * Used as a reference throuhout the runtime of the npm-pkgbuild
 * @param {string} dir 
 * @param {Object} properties 
 */
export async function createContext(dir, properties = {}) {
  Object.keys(properties).forEach(k => {
    if (properties[k] === undefined) {
      delete properties[k];
    }
  });

  const pkg = { pacman: {}, ...await loadPackage(dir)};

  properties = { arch: "any", installdir: "", pkgver: pkg.version, ...pkg, ...properties };

  function evaluate(expression) {
    const value = properties[expression];
    return value;
  }

  const eeContext = ee({ evaluate });

  properties = Object.assign(properties, eeContext.expand(pkg.pacman), eeContext.expand(pkg.pacman.properties));

  return {
    dir,
    pkg: eeContext.expand(pkg),
    properties,
    evaluate,
    expand: object => eeContext.expand(object)
  };
}
