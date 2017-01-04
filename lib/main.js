var sql = require('mssql')
var Store = require('jsreport-sql-store')

module.exports = function (reporter, definition) {
  var options = {}
  definition.enabled = false

  if (reporter.options.connectionString && reporter.options.connectionString.name.toLowerCase() === 'mssql') {
    options = reporter.options.connectionString
    definition.enabled = true
  }

  if (Object.getOwnPropertyNames(definition.options).length) {
    options = definition.options
    reporter.options.connectionString = options
    definition.enabled = true
  }

  if (!definition.enabled) {
    return
  }

  reporter.documentStore.provider = new Store(reporter, 'mssql', function (q) {
    var request = new sql.Request()

    for (var i = 0; i < q.values.length; i++) {
      request.input(i + 1, q.values[i])
    }

    return request.query(q.text).then(function (res) {
      return {
        records: res,
        rowsAffected: request.rowsAffected
      }
    })
  })

  return sql.connect(reporter.options.connectionString.uri || reporter.options.connectionString)
}
