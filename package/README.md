### Package file generation

This tasks does lots of work to install handful of packages and update `package.json` file.

The list of operations is based on my personal learnings while maintaining open source projects.

> If your project decides to move between **Javascript** and **Typescript** in between, then this task will take care of removing the unwanted dependencies and install the correct one's.

#### Testing
The [japa](https://github.com/thetutlage/japa) test runner is installed along side with `japaFile.js`. If your project makes use of Typescript, then the test runner will configured to run `.ts` files.

#### Linter
If using Javascript then [standard](https://standardjs.com/) will be configured, otherwise for Typescript projects [tslint](https://palantir.github.io/tslint/) is used.

#### Coverage reporting
If you select `coveralls` in the list of `services`, then coverage reporting dependencies will be installed and `after_test` hooks are set.

1. `nyc` is used for collecting coverage report.
2. `coveralls` node module is used to pipe the coverage report to Coveralls.

#### Typescript setup
Typescript projects will have additional setup and dependencies to work out of the box.

Following dependencies are installed.

1. ts-node
2. typescript
3. @types/node
4. tslint
5. tslint-eslint-rules


And following scripts are defined

1. `clean` to clean the build folder before starting the build.
2. `compile` to compile the Typescript code to Javascript.
3. `prePublishOnly` to compile before publishing to npm.


Also `tsconfig.json` and `tslint.json` files will be created. You are free to modify these files

#### Pkg ok

[pkg-ok](https://npm.im/pkg-ok) is installed to ensure that files that get published to npm does exists. Make sure to read their README file for more info.

