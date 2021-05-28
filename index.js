const path = require('path')
const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
})

const port = process.env.PORT || 3000

app.listen(port)

console.log('Express server running on port', port)
