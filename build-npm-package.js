const {execSync} = require("child_process");
const fs = require("fs");
const path = require("path");
const packageJson = require("./package.json");
(async () => {
  console.log(` › Removing existing build directory`);
  execSync(
    `rm -rf ${path.resolve(
      __dirname,
      "./build"
    )} || echo "no build directory exist"`
  );

  console.log(` › Creating new build directory`);
  fs.mkdirSync(path.resolve(__dirname, "./build"));

  console.log(` › Compiling Typescript`);
  execSync(`tsc --outDir build/lib`);

  console.log(` › Copying README.md`);
  execSync(
    `cp ${path.resolve(__dirname, "./README.md")} ${path.resolve(
      __dirname,
      "./build/README.md"
    )}`
  );

  /**
   * @type {typeof packageJson}
   */
  const cleanedPackageJson = {
    name: packageJson.name,
    version: packageJson.version,
    author: packageJson.author,
    main: packageJson.main,
    repository: packageJson.repository,
    dependencies: packageJson.dependencies,
    license: packageJson.license,
  };

  console.log(` › Pruning and copying package.json`);
  fs.writeFileSync(
    path.resolve(__dirname, "./build/package.json"),
    JSON.stringify(cleanedPackageJson, null, 2)
  );
})();
