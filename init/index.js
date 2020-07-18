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
  message: 'Is it a package written by the AdonisJs core team',
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
      name: '10.21.0 (Maintenance LTS)',
      value: '10.21.0'
    },
    {
      name: '12.0.0',
      value: '12.0.0'
    },
    {
      name: '12.18.2 (LTS)',
      value: '12.18.2'
    },
    {
      name: '14.5.0',
      value: '14.5.0'
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
  message: 'Select the CI services you want to use',
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
 * The probot applications to use
 * @type {Object}
 */
const probotApps = {
  type: 'checkbox',
  message: 'Select the probot applications you want to use',
  choices: [
    {
      name: 'Stale Issues',
      value: 'stale'
    },
    {
      name: 'Lock Issues',
      value: 'lock'
    },
  ],
  name: 'probotApps'
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
  probotApps.default = existingAnswers.probotApps

  const answers = await inquirer.prompt([
    gitOrigin,
    projectLang,
    minNodeVersion,
    isCore,
    license,
    services,
    appveyorUsername,
    probotApps
  ])

  const fileContent = {
    core: answers.core,
    ts: answers.lang === 'Typescript',
    license: answers.license,
    services: answers.services,
    appveyorUsername: answers.appveyorUsername,
    minNodeVersion: answers.minNodeVersion,
    probotApps: answers.probotApps
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
