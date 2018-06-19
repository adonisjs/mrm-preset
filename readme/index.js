/*
* @adonisjs/mrm-preset
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

const { template, packageJson } = require('mrm-core')
const path = require('path')
const gitUserName = require('git-user-name')

const mergeConfig = require('../utils/mergeConfig')
const Services = require('../utils/Services')
const gh = require('../utils/ghAttributes')

function task (config) {
  mergeConfig(config)
  const ghAttributes = gh('creating README.md file')

  const values = config
    .defaults({
      packageName: packageJson().get('name'),
      repoName: ghAttributes.name,
      owner: ghAttributes.owner,
      ghUsername: gitUserName(),
      appveyorUsername: ghAttributes.owner
    })
    .require('ghUsername', 'packageName', 'license')
    .values()

  const services = new Services(values.services || [], {
    owner: values.owner,
    appveyorUsername: values.appveyorUsername,
    repoName: values.repoName,
    packageName: values.packageName
  })

  const templateFile = values.core ? 'README_CORE.md' : 'README.md'
  const readme = template('README.md', path.join(__dirname, 'templates', templateFile))

  let badges = services.getReferences()

  /**
   * If project uses typescript, then make sure to add Typescript
   * badges to the badges list
   */
  if (values.ts) {
    badges += `\n![](https://img.shields.io/badge/Uses-Typescript-294E80.svg?style=flat-square&colorA=ddd)`
  }

  readme.apply(Object.assign({
    servicesUrls: services.getUrls(),
    servicesBadges: badges
  }, values))

  /**
   * Create readme file
   */
  readme.save()
}

task.description = 'Add README.md file'

module.exports = task
