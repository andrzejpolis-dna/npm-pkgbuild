import { join } from "path";
import { execa } from "execa";
import { EmptyContentEntry, ReadableStreamContentEntry } from "content-entry";
import { keyValueTransformer } from "key-value-transformer";
import { Packager } from "./packager.mjs";
import { copyEntries, transform } from "../util.mjs";

const attributes = [{ pattern: /DEBIAN\/.*(inst|rm)/, mode: 0o775 }];

export class DEB extends Packager {
  static get name() {
    return "deb";
  }

  static get fileNameExtension() {
    return ".deb";
  }

  static get fields() {
    return fields;
  }

  get packageFileName() {
    const p = this.properties;
    return `${p.name}_${p.version}_${p.arch}${this.constructor.fileNameExtension}`;
  }

  async execute(sources, options) {
    const properties = this.properties;
    const mandatoryFields = this.mandatoryFields;
    const staging = await this.tmpdir;

    function* controlProperties(k, v, presentKeys) {
      if (k === undefined) {
        for (const p of mandatoryFields) {
          if (!presentKeys.has(p)) {
            const v = properties[p];
            yield [p, v === undefined ? fields[p].default : v];
          }
        }
      } else {
        yield [k, properties[k] || v];
      }
    }

    const debianControlName = "DEBIAN/control";
    const transformers = [
      {
        match: entry => entry.name === debianControlName,
        transform: async entry =>
          new ReadableStreamContentEntry(
            entry.name,
            keyValueTransformer(await entry.readStream, controlProperties)
          ),
        createEntryWhenMissing: () => new EmptyContentEntry(debianControlName)
      }
    ];

    await copyEntries(transform(sources, transformers), staging, attributes);

    await execa("dpkg", ["-b", staging, options.destination]);

    return join(options.destination, this.packageFileName);
  }
}

/**
 * @see https://www.debian.org/doc/debian-policy/ch-controlfields.html
 * @see https://linux.die.net/man/5/deb-control
 */

const fields = {
  Package: { alias: "name", type: "string", mandatory: true },
  Version: { alias: "version", type: "string", mandatory: true },
  Maintainer: { alias: "maintainer", type: "string", mandatory: true },
  Description: { alias: "description", type: "string", mandatory: true },
  Section: { type: "string", recommended: true },
  Priority: { type: "string", recommended: true },
  Essential: { type: "boolean" },
  Origin: { type: "string" },
  Architecture: {
    alias: "arch",
    type: "string",
    default: "any",
    mandatory: true
  },
  Homepage: { alias: "homepage", type: "string" },
  Bugs: { alias: "bugs", type: "string" },
  Depends: { alias: "depends", type: "packageList" },
  Recommends: { type: "packageList" },
  Suggests: { type: "packageList" },
  Provides: { type: "packageList" },
  Breaks: { type: "packageList" },
  Replaces: { type: "packageList" },

  Source: { alias: "source", type: "string" },
  Uploaders: { mandatory: false },
  "Installed-Size": {}
};
