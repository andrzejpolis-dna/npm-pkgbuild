import globby from "globby";
import { quote } from "./util.mjs";

export async function rpmspec(context, stagingDir, out, options = {}) {
  const pkg = { contributors: [], pacman: {}, ...context.pkg };

  const properties = {
    Name: pkg.name,
    Summary: pkg.description,
    License: pkg.license,
    Version: context.properties.pkgver.replace(/\-.*$/, ""),
    Release: context.properties.pkgrel,
    Packager: pkg.contributors
      .map(
        (c, i) => `${c.name} <${c.email}>`
      )[0],
    URL: pkg.homepage,
  };

  out.write(`${Object.keys(properties)
    .filter(k => properties[k] !== undefined)
    .map(k => `${k}: ${quote(properties[k])}`)
    .join("\n")}

%description
${pkg.description}

%prep

%build
npm install

%install

%files
bin/*
node_modules/*
`);

  for (const name of await globby("**/*", { cwd: stagingDir })) {
    out.write(name + "\n");
  }

  out.end();
}
