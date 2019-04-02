/*
* @adonisjs/mrm-preset
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

const { yaml, deleteFiles } = require('mrm-core')
const mergeConfig = require('../utils/mergeConfig')

function task (config) {
  mergeConfig(config)

  const values = config.defaults({
    services: ['circleci'],
    minNodeVersion: 'latest',
    core: false
  }).values()

  const hasCircleCi = values.services.indexOf('circleci') > -1
  if (!hasCircleCi) {
    deleteFiles(['.circleci/config.yml'])
    return
  }

  const circleCiFile = yaml('.circleci/config.yml').set('version', 2)
  const versions = values.minNodeVersion === 'latest' ? ['latest'] : [values.minNodeVersion, 'latest']

  /**
   * Define build for each nodejs version. Later we will use workflows to
   * run each version
   */
  versions.forEach((version) => {
    circleCiFile.set(`jobs.build_${version}`, {
      docker: [{
        image: `circleci/node:${version}`
      }],
      working_directory: '~/app',
      steps: [
        'checkout',
        {
          restore_cache: {
            keys: ['v1-dependencies-{{ checksum "package.json" }}', 'v1-dependencies-']
          }
        },
        {
          run: 'npm install'
        },
        {
          save_cache: {
            paths: [ 'node_modules' ],
            key: 'v1-dependencies-{{ checksum "package.json" }}'
          }
        },
        {
          run: 'npm test'
        }
      ]
    })
  })

  circleCiFile.set('workflows', {
    version: 2,
    workflow: {
      jobs: versions.map((version) => `build_${version}`)
    }
  })

  circleCiFile.save()
}

task.description = 'Adds .circleci/config.yml file'
module.exports = task
