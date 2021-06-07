'use strict'

const mssql = require('mssql')
// Make sure this is private to this module
const config = {
  server: 'team8.database.windows.net',
  database: 'StudyGroupCoordinator',
  // Put login details in env. variables for security
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: 1433,
  // Required for Azure
  options: {
    encrypt: true,
    enableArithAbort: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
}

// Get a mssql connection instance
let isConnected = true
let connectionError = null
const pools = new mssql.ConnectionPool(config)
  .connect().then(pool => {
    console.log('Connected to DB')
    return pool
  })
  .catch(err => {
    // Handle errors
    isConnected = false
    connectionError = err
    console.log(err)
  })

module.exports = {
  sql: mssql,
  pools: pools,
  isConnected: isConnected,
  connectionError: connectionError
}
