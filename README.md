# MRM preset Adonis

This repo is the preset used by AdonisJs team to manage and keep their config in sync. It contains a bunch of tasks, which can be used to scaffold a new project and also keep the config files in sync.

## How it works?
All of the tasks exported by this package scaffolds new projects by creating `required config` files and also updates them (if required).

The updates are performed in a way so that your custom changes are preserved. Let's take an example of `.gitignore` file.

1. Preset default `.gitignore` file.

    ```ini
    node_modules
    ```

2. You make following changes inside it.

    ```diff
    node_modules
    + docs
    ```

3. Preset decides to change the config file and add another directory to be ignored.

    ```diff
    node_modules
    + coverage
    ```

4. The final `.gitignore` file will be.

    ```diff
    node_modules
    + docs
    + coverage
    ```

## Setup
The preset must be installed from npm as follows.

```bash
npm i --save-dev @adonisjs/mrm-preset mrm
```

And then run tasks as follows

```bash
./node_modules/.bin/mrm --dir=./node_modules/@adonisjs/mrm-preset <TASK>
```

Better will be to create an npm script task.

```json
{
  "scripts": {
    "mrm": "mrm --dir=node_modules/@adonisjs/mrm-preset"
  }
}
```

## Config
The config is picked from the `config.json` file inside the app root. Different tasks may rely optionally on different config values.

## Sync or not to sync
MRM is not only a scaffolding tool, in-fact it makes it possible to keep config files in sync when something changes in the central preset repo. However, some files like `README.md` or `CONTRIBUTING.md` cannot be kept in sync because of their nature. 

In case, you want to force update these files, make sure to pass `--config:force` when executing related tasks.

## Tasks

- [Gitignore](#gitignore)
- [EditorConfig](#editorconfig)
- [License file](#license-file)
- [Contributing file](#contributing-file)
- [Readme file](#readme-file)
- [Github templates](#github-templates)


### Gitignore (sync)

Adds/Updates `.gitignore` file to the project root with the following contents.

```ini
node_modules
coverage
.DS_STORE
.nyc_output
.idea
.vscode/
*.sublime-project
*.sublime-workspace
*.log
yarn.lock
```

### Editorconfig (sync)

Adds/Updates `.editorconfig` file to the project root with the following contents.

```ini
# http://editorconfig.org

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.json]
insert_final_newline = ignore

[**.min.js]
indent_style = ignore
insert_final_newline = ignore

[MakeFile]
indent_style = tab

[*.md]
trim_trailing_whitespace = false
```

### License file (sync)

Creates `LICENSE.md` file inside the project root. By default the contents is of **MIT License**, however you can define a different license type too inside `config.json` file

```json
{
  "license": "MIT"
}
```

### Contributing file (force sync)

Creates `CONTRIBUTING.md` file inside the project root. This file is **not kept in sync** and hence you are allowed to change it's content freely.

```bash
npm run mrm contributing

# force update
npm run mrm contributing -- --config:force
```

### Readme file (force sync)

Creates a minimal `README.md` file inside the project root. Since each project has it's own unique readme, we **do not sync this file**.

Badges are also added for supported services like.

- travis
- coveralls
- appveyor
- npm license

```bash
npm run mrm readme

# force update
npm run mrm readme -- --config:force
```

### Github templates (sync)
Github templates for issues and PR are created inside `.github/ISSUE_TEMPLATE.md` and `.github/PULL_REQUEST_TEMPLATE.md` respectively.

```bash
npm run mrm github
```

### Package.json file (sync)
Updates the `package.json` file all required scripts and config for the project. The package file structure and installed dependencies highly depends upon the values of `ts` and `services` inside the `config.json` file.

#### For Typescript project
The following dependencies are installed for a Typescript project.

```bash
'ts-node'
'typescript'
'@types/node'
'tslint'
'tslint-eslint-rules'
'del-cli'
```

and following scripts are added to package.json file

```json
{
  "lint": "tslint --project tsconfig.json",
  "clean": "del dist",
  "compile": "npm run lint && npm run clean && tsc",
  "build": "npm run compile",
  "prepublishOnly": "npm run build"
}
```

#### For Javascript project
The following dependencies are installed for a Javascript project.

```bash
'standard'
```

and following scripts are added to package.json file

```json
{
  "lint": "standard"
}
```

#### Coveralls
When the `services` array has `coveralls` as a value, then following dependencies are installed, along with the following **npm scripts**.

```bash
'coveralls'
'nyc'
```

```json
{
  "coverage": "nyc report --reporter=text-lcov | coveralls",
  "posttest": "npm run coverage"
}
```

#### Common config
The following dependencies and scripts are shared across all project types.

```bash
'japa',
'japa-cli',
'cz-conventional-changelog',
'commitizen'
```

```json
{
  "test": "japa",
  "commit": "git-cz",
  "pretest": "npm run lint",  
}
```
