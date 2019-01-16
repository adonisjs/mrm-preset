![](https://res.cloudinary.com/adonisjs/image/upload/q_100/v1547549861/mrm_entbte.png)

AdonisJs preset for [mrm](https://github.com/sapegin/mrm) to keep the project configuration files **in-sync** and **consistent across** various projects.

## What is MRM?

**You might be curious to know what the heck is MRM?**

MRM is a command line tool to scaffold new projects. But instead of just creating the initial set of files, it has powerful utilities to update them as well.

For better explanation, I recommend reading [this article](https://blog.sapegin.me/all/mrm) by the project author.

## What is MRM Preset?

This module is a custom preset of tasks for MRM and is used by [AdonisJs](https://adonisjs.com) and many other projects I author.

You can also create a preset for your own needs. However, just go through the tasks once to see if they fit your needs and that way you can avoid creating your own tasks.

## Getting started

Let's quickly learn how to use this preset, before we dig into the specifics of tasks.

```sh
npm i --save-dev mrm @adonisjs/mrm-preset
```

Add script to `package.json` file

```sh
{
 "scripts": {
   "mrm": "mrm --preset=@adonisjs/mrm-preset"
 }
}
```

and then run it as follows

```sh
## Initiate by creating config file
npm run mrm init
```

```sh
## Execute all tasks (for new projects)
npm run mrm all
```

## Tasks
Let's focus on all the tasks supported by AdonisJs preset.

<!-- TASKS START -->
<!-- DO NOT MODIFY MANUALLY. INSTEAD RUN `npm run docs` TO REGENERATE IT -->

### Appveyor
Appveyor tasks creates a configuration file `(appveyor.yml)` in the root of your project. The tasks depends on the config file `config.json` and requires following key/value pairs.

```json
{
  "services": ["appveyor"],
  "minNodeVersion": "10.0"
}
```

To remove support for `appveyor` from your project, just `npm run mrm appveyor` task by removing the `appveyor` keyword from the `services` array. 

```json
{
  "services": []
}
```

```sh
npm run mrm appveyor
```

### Contributing.md template
Creates `.github/CONTRIBUTING.md` file. This file is shown by Github to users [creating new issues](https://help.github.com/articles/setting-guidelines-for-repository-contributors).

The content of the template is pre-defined and is not customizable. If you want custom template, then it's better to create the file by hand.

1. Template for Typescript
   The [typescript template](https://github.com/adonisjs/mrm-preset/blob/master/contributing/templates/CONTRIBUTING_TS.md) is used when `ts=true` inside the config file.
   
    ```json
    {
      "ts": true
    }
    ``` 

2. Otherwise the [default template](https://github.com/adonisjs/mrm-preset/blob/master/contributing/templates/CONTRIBUTING.md) will be used.
### Editorconfig file
Creates a `.editorconfig` file inside the project root. The editor config file is a way to keep the editor settings consistent regardless of the the editor you open the files in.

You may need a [plugin](https://editorconfig.org/#download) for your editor to make `editorconfig` work.

The file is generated with settings defined inside the [task file](https://github.com/adonisjs/mrm-preset/blob/master/editorconfig/index.js#L20) and again is not customizable.
### Github templates

Creates issues and PR template for Github. The contents of these templates will be pre-filled anytime someone wants to create a new issue or PR.

1. [Issues template content](https://github.com/adonisjs/mrm-preset/blob/master/github/templates/issues.md)
2. [PR template](https://github.com/adonisjs/mrm-preset/blob/master/github/templates/pr.md)
### Gitignore template

Creates `.gitignore` file in the root of your project. Following files and folders are ignored by default. However, you can add more to the template.

```
node_modules
coverage
.DS_STORE
.nyc_output
.idea
.vscode/
*.sublime-project
*.sublime-workspace
*.log
build
docs
dist
yarn.lock
shrinkwrap.yaml
package-lock.json
```


### License template

Creates `LICENSE.md` file in the root of your project. 

You can choose from one of the [available licenses](https://github.com/sapegin/mrm-tasks/tree/master/packages/mrm-task-license/templates) when running `npm run init` command or define it by hand inside `config.json` file.

```json
{
  "license": "MIT"
}
```

If not defined, will fallback to `package.json` file or `MIT`.
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


### Readme file

Generates a Readme file using a [pre-defined template](https://github.com/adonisjs/mrm-preset/blob/master/readme/templates/README.md). Feel free to change the contents of the file, since it's just a starting point.
### Readme file TOC

Generates table of contents for the readme file. This tasks registers a `git hook` to automatically generate the TOC before every commit.

Under the hood npm package [doctoc](https://npm.im/doctoc) is used for generating the TOC, so make sure to read their readme file as well.

### Travis 
Travis tasks creates a configuration file `(.travis.yml)` in the root of your project. The tasks depends on the config file `config.json` and requires following key/value pairs.

```json
{
  "services": ["travis"],
  "minNodeVersion": "10.0"
}
```

To remove support for `travis` from your project, just `npm run mrm travis` task by removing the `travis` keyword from the `services` array.

```json
{
  "services": []
}
```

```sh
npm run mrm travis
```
### TypeDoc

Configures [typedoc](http://typedoc.org/) to generate API documentation for Typescript projects. Along with that, two additional plugins are installed.

- typedoc-plugin-external-module-name
- typedoc-plugin-single-line-tags
### Validate commit

Configures a git hook to validate the commit messages. This is great, if you want to ensure that contributors to your project must form commit messages as per a given standard.

The default standard used is [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular) and rules are defined inside this [template](https://github.com/adonisjs/mrm-preset/blob/develop/validateCommit/conventional/template.md), which is copied over to your project `.github` folder for readers reference.


<!-- TASKS END -->
