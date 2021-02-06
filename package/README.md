### Package file generation

This tasks does lots of work to install handful of packages and update `package.json` file.

The list of operations is based on my personal learnings while maintaining open source projects.

> If your project decides to move between **Javascript** and **Typescript** in between, then this task will take care of removing the unwanted dependencies and install the correct one's.

#### Testing

The [japa](https://github.com/thetutlage/japa) test runner is installed along side with `japaFile.js`.

#### Typescript setup

Typescript projects will have additional setup and dependencies to work out of the box.

Following dependencies are installed.

1. `ts-node`
2. `typescript`
3. `@adonisjs/require-ts`

And following scripts are defined

1. `clean` to clean the build folder before starting the build.
2. `compile` to compile the Typescript code to Javascript.
3. `prePublishOnly` to compile before publishing to npm.

Also `tsconfig.json` and `tslint.json` files will be created. You are free to modify these files
