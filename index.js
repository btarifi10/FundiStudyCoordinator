const path = require('path')
const express = require('express')
const app = express()

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/createGroup', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'create-join-group.html'))
})

const port = process.env.PORT || 3000

app.listen(port)

console.log('Express server running on port', port)
