const path = require('path')
const express = require('express')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, 'public')))

// Placeholder for the creation of new data
app.post('/insert', (request, response) => {})

const GROUPS = [
  {
    group_id: '1',
    group_name: 'Phantom Menace',
    date_joined: new Date('1999'),
    group_num: '6',
    group_url: 'PM.html',
    group_online: '4'
  },
  {
    group_id: '2',
    group_name: 'Attack of the Clones',
    date_joined: new Date('2002'),
    group_num: '6',
    group_url: 'AC.html',
    group_online: '4'
  },
  {
    group_id: '3',
    group_name: 'Revenge of the Sith',
    date_joined: new Date('2005'),
    group_num: '6',
    group_url: 'RS.html',
    group_online: '4'
  }
]

// read user database entry - called when the page is loaded
app.get('/getAll', (request, response) => {
  response.json(GROUPS)
  // console.log('test');
})

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/profile', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'profile.html'))
})

app.get('/home', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'home.html'))
})

const port = process.env.PORT || 3000

app.listen(port)

console.log('Express server running on port', port)
