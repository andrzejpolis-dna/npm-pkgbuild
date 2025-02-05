import test from "ava";
import { arch as hostArch } from "process";
import { dirname } from "path";
import {
  FileContentProvider,
  NPMPackContentProvider,
  extractFromPackage,
  npmArchMapping
} from "npm-pkgbuild";

async function efpt(
  t,
  pkg,
  expectedProperties,
  expectedContent,
  expectedDependencies,
  expectedOutput
) {
  for await (const {
    properties,
    sources,
    dependencies,
    output
  } of extractFromPackage(pkg, dirname(new URL(import.meta.url).pathname))) {
    t.deepEqual(properties, expectedProperties, "properties");

    if (expectedContent) {
      t.deepEqual(sources, expectedContent, "content");
    }

    if (expectedDependencies) {
      t.deepEqual(dependencies, expectedDependencies, "dependencies");
    }

    if (expectedOutput) {
      t.deepEqual(output, expectedOutput, "output");
    }
  }
}
efpt.title = (
  providedTitle = "extractFromPackage",
  pkg,
  expectedProperties,
  expectedContent,
  expectedOutput
) =>
  ` ${providedTitle} ${JSON.stringify(pkg)} -> ${JSON.stringify(
    expectedProperties
  )}`.trim();

test(
  efpt,
  {
    name: "n1",
    description: "d1",
    version: "1.2.3",
    cpu: hostArch,
    pkgbuild: {}
  },
  {
    name: "n1",
    description: "d1",
    version: "1.2.3",
    access: "private",
    arch: [npmArchMapping[hostArch]],
    variant: "default"
  }
);

test(
  efpt,
  {
    name: "n1",
    description: "d1",
    version: "1.2.3",
    license: "BSD",
    config: { c1: "v1" },
    repository: "github:/arlac77/npm-pkgbuild",
    pkgbuild: {
      arch: ["aarch64", "x86_64"],
      name: "n2",
      other: "o1",
      output: { deb: {} }
    }
  },
  {
    name: "n2",
    description: "d1",
    version: "1.2.3",
    other: "o1",
    license: "BSD",
    access: "private",
    arch: [npmArchMapping[hostArch] /*"aarch64","x86_64"*/],
    c1: "v1",
    source: "github:/arlac77/npm-pkgbuild",
    variant: "default"
  },
  undefined,
  undefined,
  { deb: {} }
);

test(
  efpt,
  {
    cpu: ["arm64", "x64"],
    pkgbuild: {}
  },
  {
    access: "private",
    arch: [npmArchMapping[hostArch] /*"aarch64","x86_64"*/],
    variant: "default"
  },
  undefined,
  undefined,
  {}
);

test(
  efpt,
  {
    pkgbuild: {}
  },
  {
    access: "private",
    variant: "default"
  },
  undefined,
  undefined,
  {}
);

test(
  efpt,
  {
    contributors: [
      {
        name: "Markus Felten",
        email: "markus.felten@gmx.de"
      }
    ]
  },
  {
    access: "private",
    variant: "default",
    maintainer: "Markus Felten <markus.felten@gmx.de>"
  }
);

test(
  efpt,
  {
    name: "konsum-frontend",
    publishConfig: {
      access: "public"
    },
    pkgbuild: {
      content: {
        "${installdir}": [
          {
            type: "npm-pack"
          },
          {
            base: "build"
          },
          {
            base: "dist"
          }
        ],
        //      "/etc/nginx/sites/common/${name}.conf": "pkgbuild/nginx.conf",
        "/etc/nginx/sites/common/${name}.conf": {
          name: "pkgbuild/nginx.conf",
          owner: "root"
        }
      },
      depends: {
        "nginx-mainline": ">=1.21.1",
        konsum: ">=4.1.0"
      },
      groups: "home automation",
      hooks: "pkgbuild/hooks.sh",
      installdir: "/services/konsum/frontend"
    }
  },
  {
    access: "public",
    groups: "home automation",
    hooks: "pkgbuild/hooks.sh",
    installdir: "/services/konsum/frontend",
    name: "konsum-frontend",
    variant: "default"
  },
  [
    new NPMPackContentProvider(
      { dir: dirname(new URL(import.meta.url).pathname) },
      { destination: "/services/konsum/frontend" }
    ),
    new FileContentProvider(
      { base: "build" },
      { destination: "/services/konsum/frontend" }
    ),
    new FileContentProvider(
      { base: "dist" },
      { destination: "/services/konsum/frontend" }
    ),

    /*new FileContentProvider(
      { base: "pkgbuild", pattern: ["other.conf"] },
      { destination: "/etc/nginx/sites/common/other.conf", owner: "root" }
    ),*/
    new FileContentProvider(
      { name: "pkgbuild/nginx.conf" },
      {
        destination: "/etc/nginx/sites/common/konsum-frontend.conf",
        owner: "root"
      }
    )
  ],
  {
    "nginx-mainline": ">=1.21.1",
    konsum: ">=4.1.0"
  }
);
