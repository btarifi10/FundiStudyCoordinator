const path = require('path')
const express = require('express')
const app = express()
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : false}));

// Placeholder for the creation of new data
 app.post('/insert', (request, response)=>{});

// read user database entry - called when the page is loaded
app.get('/getAll', (request, response) => {
  response.json({
    success: true
  });
  //console.log('test');
})


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
})

const port = process.env.PORT || 3000

app.listen(port)

console.log('Express server running on port', port)
