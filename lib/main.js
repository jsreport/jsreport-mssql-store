const sql = require('mssql')
const Store = require('jsreport-sql-store')

module.exports = function (reporter, definition) {
  if (reporter.options.store.provider !== 'mssql') {
    definition.options.enabled = false
    return
  }

  reporter.documentStore.registerProvider(Store(definition.options, 'mssql', async (q) => {
    const request = new sql.Request()

    for (let i = 0; i < q.values.length; i++) {
      request.input(i + 1, q.values[i])
    }

    const res = await request.query(q.text)

    return {
      records: res.recordset,
      rowsAffected: res.rowsAffected[0]
    }
  }))

  reporter.closeListeners.add('mssql', this, () => sql.close())

  return sql.connect(definition.options.uri || definition.options)
}
