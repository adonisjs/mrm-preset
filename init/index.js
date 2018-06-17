/*
* @adonisjs/mrm-preset
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

const inquirer = require('inquirer')
const { json } = require('mrm-core')

const projectLang = {
  type: 'list',
  choices: ['Typescript', 'Javascript'],
  message: 'Select the language you want to code in',
  name: 'lang'
}

const isCore = {
  type: 'confirm',
  message: 'Is it a package written by the core team',
  name: 'core'
}

const license = {
  type: 'list',
  choices: ['Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause', 'MIT', 'Unlicense'],
  message: 'Select project license. Select Unlicense if not sure',
  name: 'license'
}

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
    }
  ],
  name: 'services'
}

const appveyorUsername = {
  type: 'input',
  message: 'Enter appveyor username',
  when: function (answers) {
    return answers.services.indexOf('appveyor') > -1
  },
  name: 'appveyorUsername'
}

async function task () {
  const answers = await inquirer.prompt([projectLang, isCore, license, services, appveyorUsername])

  const file = json('config.json')

  file.set({
    core: answers.core,
    ts: answers.lang === 'Typescript',
    license: answers.license,
    services: answers.services
  })

  if (answers.appveyorUsername) {
    file.merge({ appveyorUsername: answers.appveyorUsername })
  }

  file.save()
}

task.description = 'Initiate the project config file'
module.exports = task
