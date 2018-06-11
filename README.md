# MRM preset Adonis

This repo is the preset used to AdonisJs team to manage and keep their config in sync. It contains a bunch of tasks, which can be used to scaffold a new project and also keep the config files in sync.

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

## Tasks

- [Gitignore](#gitignore)
- 




