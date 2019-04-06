/*
* @adonisjs/mrm-preset
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

const inquirer = require('inquirer')
const { json, ini } = require('mrm-core')
const debug = require('debug')('adonis:mrm-init')
const { execSync } = require('child_process')
const chalk = require('chalk')

/**
 * Asking for project language
 *
 * @type {Object}
 */
const projectLang = {
  type: 'list',
  choices: ['Typescript', 'Javascript'],
  message: 'Select the language you want to code in',
  name: 'lang'
}

const gitOrigin = {
  type: 'input',
  message: 'Enter git origin url',
  validate (input) {
    return !input ? 'Please create a git project and enter it\'s remote origin' : true
  },
  when () {
    const gitFile = ini('.git/config')
    if (!gitFile.exists()) {
      return true
    }
    const origin = gitFile.get('remote "origin"')
    return !origin || !origin.url
  },
  name: 'gitOrigin'
}

/**
 * Whether written by the core team or not
 *
 * @type {Object}
 */
const isCore = {
  type: 'confirm',
  message: 'Is it a package written by the core team',
  name: 'core'
}

/**
 * The minimum node version supported by the project.
 *
 * @type {Object}
 */
const minNodeVersion = {
  type: 'list',
  message: 'Select the minimum node version your project will support',
  name: 'minNodeVersion',
  choices: [
    {
      name: '8.0.0 (Legacy)',
      value: '8.0.0'
    },
    {
      name: '10.15.3 (LTS carbon)',
      value: '10.15.3'
    },
    {
      name: '11.0.0',
      value: '11.0.0'
    },
    {
      name: 'latest',
      value: 'latest'
    }
  ]
}

/**
 * The project license
 *
 * @type {Object}
 */
const license = {
  type: 'list',
  choices: ['Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause', 'MIT', 'Unlicense'],
  message: 'Select project license. Select Unlicense if not sure',
  name: 'license'
}

/**
 * Services to be used by the project
 *
 * @type {Object}
 */
const services = {
  type: 'checkbox',
  message: 'Select the CI services you are planning to use',
  choices: [
    {
      name: 'Travis',
      value: 'travis'
    },
    {
      name: 'Appveyor',
      value: 'appveyor'
    },
    {
      name: 'Coveralls',
      value: 'coveralls'
    },
    {
      name: 'Circle CI',
      value: 'circleci'
    }
  ],
  name: 'services'
}

/**
 * The appveyor username. Only asked when services
 * has `appveyor` in it
 *
 * @type {Object}
 */
const appveyorUsername = {
  type: 'input',
  message: 'Enter appveyor username',
  when: function (answers) {
    return answers.services.indexOf('appveyor') > -1
  },
  name: 'appveyorUsername'
}

/**
 * Running the task, asking questions and create a project
 * specific config file.
 *
 * @method task
 *
 * @return {void}
 */
async function task () {
  const file = json('config.json')
  const existingAnswers = file.get()

  /**
   * Fill existing values
   */
  projectLang.default = existingAnswers.ts ? 'Typescript' : 'Javascript'
  minNodeVersion.default = existingAnswers.minNodeVersion
  isCore.default = existingAnswers.core
  license.default = existingAnswers.license
  services.default = existingAnswers.services
  appveyorUsername.default = existingAnswers.appveyorUsername

  const answers = await inquirer.prompt([
    gitOrigin,
    projectLang,
    minNodeVersion,
    isCore,
    license,
    services,
    appveyorUsername
  ])

  const fileContent = {
    core: answers.core,
    ts: answers.lang === 'Typescript',
    license: answers.license,
    services: answers.services,
    appveyorUsername: answers.appveyorUsername,
    minNodeVersion: answers.minNodeVersion
  }

  debug('init %o', fileContent)

  file.set(fileContent)
  file.save()

  /**
   * Initiate git repo, when answers has gitOrigin
   */
  if (answers.gitOrigin) {
    console.log(chalk.yellow('git init'))
    execSync('git init')

    console.log(chalk.yellow(`git remote add origin ${answers.gitOrigin}`))
    execSync(`git remote add origin ${answers.gitOrigin}`)
  }
}

task.description = 'Initiate the project config file'
module.exports = task
