/*
* @adonisjs/mrm-preset
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

const { template, ini, MrmError } = require('mrm-core')
const { join } = require('path')
const gh = require('parse-github-url')

const mergeConfig = require('../utils/mergeConfig')

function task (config) {
  mergeConfig(config)

  /**
   * Ensure .git/config file exists
   */
  const ghFile = ini('.git/config')
  if (!ghFile.exists()) {
    throw new MrmError('Initiate git repo before creating github templates')
  }

  /**
   * Ensure origin is defined
   */
  const origin = ghFile.get('remote "origin"')
  if (!origin || !origin.url) {
    throw new MrmError('Add remote origin before creating github templates')
  }

  const ghAttributes = gh(origin.url)
  const { core, repo } = config
    .defaults({
      repo: ghAttributes.repo
    })
    .values()

  /**
   * Default templates
   */
  const issuesStandard = template('.github/ISSUE_TEMPLATE.md', join(__dirname, 'templates', 'issues.md'))
  const pr = template('.github/PULL_REQUEST_TEMPLATE.md', join(__dirname, 'templates', 'pr.md'))

  /**
   * Required only when core is true
   */
  const issuesBugs = template('.github/ISSUE_TEMPLATE/bug_report.md', join(__dirname, 'templates', 'bugs.md'))
  const issuesFeatures = template('.github/ISSUE_TEMPLATE/feature_request.md', join(__dirname, 'templates', 'features.md'))

  if (core) {
    issuesBugs.apply().save()
    issuesFeatures.apply().save()
  } else {
    issuesStandard.apply().save()
  }

  pr.apply({ repo }).save()
}

task.description = 'Adds Github related templates'
module.exports = task
