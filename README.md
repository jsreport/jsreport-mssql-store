# jsreport-mssql-store

**[jsreport](https://github.com/jsreport/jsreport) template store extension allowing to persist data in [Microsoft SQL Server](https://www.microsoft.com/en/server-cloud/products/sql-server/)**


## Installation

> npm install jsreport-mssql-store

Then alter jsreport configuration 
```js
{
	"connectionString": { 
	    "name": "mssql",
        "user": "jsreport",
        "password": "password",
        "server": "janblaha-PC\\SQLEXPRESS",
        "database": "jsreport",
        /* required for sql azure */
        "options": {
          "encrypt": true
        }
    }
}
```

Alternatively you can pass the connection string as uri
```js
"connectionString": {
  "name": "mssql",
  "uri": "Server=tcp:jsreport.database.windows.net,1433;Initial Catalog=jsreport;Persist Security Info=False;User ID=myuser;Password=password;MultipleActiveResultSets=False;Encrypt=True;"
}
```

** Make sure your TCP/IP protocol is enabled in the SQL Server Configuration Manager**

After jsreport initializes you should see tables like `jsreport.TemplateType` and others in `jsreport` database.

## Schema changes
If you do changes to the database schema by enabling additional extensions you need to drop the affected tables and let jsreport to reinitialize them. 

## jsreport-core
You can apply this extension also manually to [jsreport-core](https://github.com/jsreport/jsreport-core)

```js
var jsreport = require('jsreport-core')()
jsreport.use(require('jsreport-mssql-store')({ server: '...'}))
```




