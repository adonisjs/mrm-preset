/*
* @adonisjs/mrm-preset
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

const { install, packageJson, file } = require('mrm-core')
const recast = require('recast')
const typeDocContent = `module.exports = require('@adonisjs/mrm-preset/_typedoc.js')()`

function task (config) {
  /**
   * Install required dependencies
   */
  install(['typedoc', 'typedoc-plugin-external-module-name'])

  /**
   * Append script and save file
   */
  const pkgFile = packageJson()
  pkgFile.appendScript('build', 'typedoc --excludePrivate && git add docs').save()

  const typedocFile = file('typedoc.js')

  /**
   * If file exists, then modify it to add module.exports statement
   */
  if (typedocFile.exists()) {
    const ast = recast.parse(typedocFile.get())
    let hasExports = false

    recast.types.visit(ast, {
      visitAssignmentExpression ({ node }) {
        if (!node.left.object || !node.left.property) {
          return false
        }

        if (node.left.object.name !== 'module' || node.left.property.name !== 'exports') {
          return false
        }

        hasExports = true
        return false
      }
    })

    if (!hasExports) {
      ast.program.body = ast.program.body.concat(recast.parse(typeDocContent).program.body)
    }

    typedocFile.save(recast.print(ast).code)
    return
  }

  /**
   * Otherwise save the file with content
   */
  typedocFile.save(typeDocContent)
}

task.description = 'Adds typedoc to the project'
module.exports = task
