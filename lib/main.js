const sql = require('mssql')
const Store = require('jsreport-sql-store')

module.exports = function (reporter, definition) {
  if (reporter.options.store.provider !== 'mssql') {
    definition.options.enabled = false
    return
  }

  const options = Object.assign({}, reporter.options.store, definition.options)

  reporter.documentStore.registerProvider(Store(options, 'mssql', async (q) => {
    const request = new sql.Request()

    for (let i = 0; i < q.values.length; i++) {
      request.input(i + 1, q.values[i])
    }

    const res = await request.query(q.text)

    return {
      records: res.recordset,
      rowsAffected: res.rowsAffected
    }
  }))

  reporter.closeListeners.add('mssql', this, () => sql.close())

  return sql.connect(options.uri || options)
}
