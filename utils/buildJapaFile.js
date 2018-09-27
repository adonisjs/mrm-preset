/*
* @adonisjs/mrm-preset
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

const recast = require('recast')

/**
 * Added to japaFile.js for Typescript
 */
const japaCliTsContent = `const { configure } = require('japa')
configure({
  files: ['test/**/*.spec.ts']
})`

/**
 * Added to japaFile.js for Javascript
 */
const japaCliJsContent = `const { configure } = require('japa')
configure({
  files: ['test/**/*.spec.js']
})`

/**
 * Add to japaFile.js when project uses Typescript
 */
const tsRegisterContent = `require('ts-node/register')\n\n`

/**
 * Returns the name of the require module. It is the job
 * of the consumer to pass the `CallExpression` node
 * to this method.
 *
 * @method getRequireName
 *
 * @param  {Object}       node
 *
 * @return {String|Null}
 */
function getRequireName (node) {
  if (!node.callee || node.callee.name !== 'require') {
    return null
  }

  if (node.arguments[0].type !== 'Literal') {
    return null
  }

  return node.arguments[0].value
}

module.exports = function (existingContent, ts) {
  let japaCliRequired = false

  /**
   * We set tsNodeRequired to true when project is not using
   * typescript. By doing this, we simply skip the typescript
   * related checks and do not add typescript related code
   * to japaFile.js
   */
  let tsNodeRequired = !ts

  const ast = recast.parse(existingContent)

  /**
   * Looking for all callExpressions and finding neccessary `require`
   * calls.
   */
  recast.types.visit(ast, {
    visitCallExpression ({ node }) {
      if (!japaCliRequired && getRequireName(node) === 'japa') {
        japaCliRequired = true
      }

      if (!tsNodeRequired && getRequireName(node) === 'ts-node/register') {
        tsNodeRequired = true
      }

      return false
    }
  })

  /**
   * Add japa/cli require statement when missing
   */
  if (!japaCliRequired) {
    ast.program.body = recast.parse(ts ? japaCliTsContent : japaCliJsContent).program.body.concat(ast.program.body)
  }

  /**
   * Add ts related code when missing. Also make sure this is added
   * as the first line inside the japaFile.js file
   */
  if (!tsNodeRequired) {
    ast.program.body = recast.parse(tsRegisterContent).program.body.concat(ast.program.body)
  }

  /**
   * String and return a string back
   */
  return recast.print(ast).code
}
