import test from "ava";
import { NPMPackContentProvider } from "npm-pkgbuild";

test("NPMPack entries", async t => {
  const content = new NPMPackContentProvider({
    dir: new URL("fixtures/pkg", import.meta.url).pathname
  });

  const entries = {};
  for await (const entry of content) {
    entries[entry.name] = entry;
  }

  t.truthy(entries['package.json']);
});
