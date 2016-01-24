require('should')
var jsreport = require('jsreport-core')
var templates = require('jsreport-templates')
var data = require('jsreport-data')
var store = require('../')

describe('store', function () {
  var reporter
  var collection

  beforeEach(function (done) {
    reporter = jsreport()
    reporter.use(templates())
    reporter.use(data())
    reporter.use(store({
      user: 'jsreport',
      password: 'password',
      server: 'janblaha-PC\\SQLEXPRESS',
      database: 'jsreport'
    }))
    reporter.init().then(function () {
      return reporter.documentStore.drop()
    }).then(function () {
      return reporter.documentStore.init()
    }).then(function () {
      collection = reporter.documentStore.collection('templates')
      done()
    }).catch(done)
  })

  it('should be able to insert and query', function () {
    return collection.insert({content: 'foo'}).then(function () {
      return collection.find({}).then(function (res) {
        res.should.have.length(1)
        res[0].content.should.be.eql('foo')
      })
    })
  })
})
