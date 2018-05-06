require('should')
process.env.DEBUG = 'jsreport'
const jsreport = require('jsreport-core')

describe('common store tests', () => {
  let reporter

  beforeEach(async () => {
    reporter = jsreport()
      .use(require('../')({
        user: 'test',
        password: 'password',
        server: 'DESKTOP-S79UM9T\\SQLEXPRESS',
        database: 'jsreport'
      }))
    await reporter.init()
  })

  jsreport.tests.documentStore()(() => reporter.documentStore)
})
