const sql = require('mssql')
const Store = require('jsreport-sql-store')
const Semaphore = require('semaphore-async-await').default

module.exports = async (reporter, definition) => {
  if (reporter.options.store.provider !== 'mssql') {
    definition.options.enabled = false
    return
  }

  let pool

  async function executeQuery (q, opts = {}) {
    let connection = pool

    async function execute (connection) {
      const request = new sql.Request(connection)

      for (let i = 0; i < q.values.length; i++) {
        request.input(i + 1, q.values[i])
      }

      const res = await request.query(q.text)

      return {
        records: res.recordset,
        rowsAffected: res.rowsAffected[0]
      }
    }

    if (!opts.transaction) {
      return execute(connection)
    }

    return opts.transaction.semaphore.execute(() => execute(opts.transaction))
  }

  const transactionManager = {
    async start () {
      const transaction = new sql.Transaction(pool)

      await transaction.begin()

      transaction.__rolledBack = false

      // this is the recommended way to handle transactions rollbacks
      // and prevent errors when the connection was configured to auto-rollback on fail
      transaction.on('rollback', () => {
        transaction.__rolledBack = true
      })

      transaction.semaphore = new Semaphore(1)

      return transaction
    },
    async commit (tran) {
      await tran.commit()
    },
    async rollback (tran) {
      if (tran.__rolledBack) {
        return
      }

      await tran.rollback()
    }
  }

  const store = Object.assign(
    Store(definition.options, 'mssql', executeQuery, transactionManager),
    {
      close: () => {
        if (pool) {
          return pool.close()
        }
      }
    }
  )

  reporter.documentStore.registerProvider(store)

  pool = await sql.connect(definition.options.uri || definition.options)

  // avoid exposing connection string through /api/extensions
  definition.options = {}
}
