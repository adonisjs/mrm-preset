/*
* @adonisjs/mrm-preset
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

const path = require('path')
const { template, packageJson } = require('mrm-core')
const gitUserName = require('git-user-name')

const gh = require('../utils/ghAttributes')
const Services = require('../utils/Services')
const saveFile = require('../utils/saveFile')
const mergeConfig = require('../utils/mergeConfig')

function task (config) {
  mergeConfig(config)
  const ghAttributes = gh('creating README.md file')

  const values = config
    .defaults({
      packageName: packageJson().get('name'),
      repoName: ghAttributes.name,
      owner: ghAttributes.owner,
      ghUsername: gitUserName(),
      force: false,
      appveyorUsername: ghAttributes.owner
    })
    .require('ghUsername', 'packageName', 'license')
    .values()

  const servicesList = values.services || []

  /**
   * Adding typescript when `ts` is true
   */
  if (values.ts) {
    servicesList.push('typescript')
  }

  /**
   * Adding npm and license services too
   */
  servicesList.push('npm', 'license')

  const services = new Services(servicesList, {
    owner: values.owner,
    appveyorUsername: values.appveyorUsername,
    repoName: values.repoName,
    packageName: values.packageName
  })

  const templateFile = values.core ? 'README_CORE.md' : 'README.md'
  const readme = template('README.md', path.join(__dirname, 'templates', templateFile))
  let banner = ''

  /**
   * AdonisJS banner
   */
  if (values.packageName.startsWith('@adonisjs')) {
    banner = `<div align="center"><img src="https://res.cloudinary.com/adonisjs/image/upload/q_100/v1564392111/adonis-banner_o9lunk.png" width="600px"></div>`
  }

  /**
   * Poppinss banner
   */
  if (values.packageName.startsWith('@poppinss')) {
    banner = `<div align="center"><img src="https://res.cloudinary.com/adonisjs/image/upload/q_100/v1557762307/poppinss_iftxlt.jpg" width="600px"></div>`
  }

  let badges = services.getReferences()

  readme.apply(Object.assign({
    servicesUrls: services.getUrls(),
    servicesBadges: badges,
    banner: banner
  }, values))

  /**
   * Create readme file
   */
  saveFile(readme, values.force)
}

task.description = 'Add README.md file'

module.exports = task
