/*
* @adonisjs/mrm-preset
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

const { join } = require('path')
const { chmodSync } = require('fs')
const { execSync } = require('child_process')
const { packageJson, install, lines } = require('mrm-core')

function task () {
  /**
   * Remove existing pre commit hook
   */
  const pkgFile = packageJson()
  pkgFile.unset('husky.hooks.pre-commit')
  pkgFile.save()

  /**
   * Setup husky
   */
  execSync('npx husky install')

  /**
   * Create pre-commit file
   */
  const commitFile = lines('.husky/pre-commit')
    .add('#!/bin/sh')
    .add('. "$(dirname "$0")/_/husky.sh"')
    .add('npx doctoc README.md --title=\'## Table of contents\'')
    .add('git add README.md')

  const fileAlreadyExists = commitFile.exists()
  commitFile.save()

  /**
   * Change mode when file not already exists
   */
  if (!fileAlreadyExists) {
    chmodSync(join(process.cwd(), '.husky/pre-commit'), 0o0755)
  }

  /**
   * Install required dependencies
   */
  install(['doctoc', 'husky'])
}

task.description = 'Generate TOC for readme.md file'
module.exports = task
