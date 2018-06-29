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
    services: [],
    minNodeVersion: '8.0.0',
    core: false
  }).values()

  const hasTravis = values.services.indexOf('travis') > -1
  if (!hasTravis) {
    deleteFiles(['.travis.yml'])
    return
  }

  const travisFile = yaml('.travis.yml')
    .set('language', 'node_js')
    .set('node_js', ['node', values.minNodeVersion])
    .set('sudo', false)
    .set('install', ['npm install'])

  /**
   * For core projects setup slack notifications
   */
  if (values.core) {
    travisFile.set('notifications.slack.secure', 'm91zkX2cLVDRDMBAUnR1d+hbZqtSHXLkuPencHadhJ3C3wm53Box8U25co/goAmjnW5HNJ1SMSIg+DojtgDhqTbReSh5gSbU0uU8YaF8smbvmUv3b2Q8PRCA7f6hQiea+a8+jAb7BOvwh66dV4Al/1DJ2b4tCjPuVuxQ96Wll7Pnj1S7yW/Hb8fQlr9wc+INXUZOe8erFin+508r5h1L4Xv0N5ZmNw+Gqvn2kPJD8f/YBPpx0AeZdDssTL0IOcol1+cDtDzMw5PAkGnqwamtxhnsw+i8OW4avFt1GrRNlz3eci5Cb3NQGjHxJf+JIALvBeSqkOEFJIFGqwAXMctJ9q8/7XyXk7jVFUg5+0Z74HIkBwdtLwi/BTyXMZAgsnDjndmR9HsuBP7OSTJF5/V7HCJZAaO9shEgS8DwR78owv9Fr5er5m9IMI+EgSH3qtb8iuuQaPtflbk+cPD3nmYbDqmPwkSCXcXRfq3IxdcV9hkiaAw52AIqqhnAXJWZfL6+Ct32i2mtSaov9FYtp/G0xb4tjrUAsDUd/AGmMJNEBVoHtP7mKjrVQ35cEtFwJr/8SmZxGvOaJXPaLs43dhXKa2tAGl11wF02d+Rz1HhbOoq9pJvJuqkLAVvRdBHUJrB4/hnTta5B0W5pe3mIgLw3AmOpk+s/H4hAP4Hp0gOWlPA=')
  }

  travisFile.save()
}

task.description = 'Adds .travis.yml file'
module.exports = task