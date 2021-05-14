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
  mergeConfig(config, {
    services: ['github-actions'],
    minNodeVersion: 'latest',
    core: false
  })

  const hasGithubActions = config.services.indexOf('github-actions') > -1
  if (!hasGithubActions) {
    deleteFiles(['.github/workflows/test.yml'])
    return
  }

  /**
   * Versions to test against. Github actions doesn't allow
   * "latest" keyword as of now
   */
  const versions = config.minNodeVersion === 'latest'
    ? ['16.x']
    : [config.minNodeVersion, '16.x']

  const githubActionsFile = yaml('.github/workflows/test.yml')
  githubActionsFile.set('name', 'test')
  githubActionsFile.set('on', ['push', 'pull_request'])

  /**
   * Define build for each nodejs version. Later we will use workflows to
   * run each version
   */
  const jobs = {
    build: {
      'runs-on': 'ubuntu-latest',
      strategy: {
        matrix: {
          'node-version': versions
        }
      },
      steps: [
        {
          uses: 'actions/checkout@v2'
        },
      ].concat(versions.map((version) => {
        return {
          name: `Use Node.js \${{ matrix.${version} }}`,
          uses: 'actions/setup-node@v1',
          with: {
            'node-version': `\${{ matrix.${version} }}`
          }
        }
      }))
      .concat([
        {
          name: 'Install',
          run: 'npm install'
        },
        {
          name: 'Run tests',
          run: 'npm test'
        }
      ])
    }
  }

  githubActionsFile.set('jobs', jobs)
  githubActionsFile.save()
}

task.description = 'Adds .github/workflows/test.yml file'
module.exports = task
