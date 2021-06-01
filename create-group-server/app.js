// document.addEventListener('DOMContentLoaded', function () {
//   loadHTMLTable([])
// })

// function loadHTMLTable (data) {
//   const table = document.querySelector('table tbody')
//   //   let tableHTML = ""

//   if (data.length === 0) {
//     table.innerHTML = "<tr><td class='no-data' colspan='5'>No Groups</td></tr>"
//   }
// }

const express = require('express')
const app = express()
app.listen(3000, () => console.log('listening at 3000'))
app.use(express.static('public'))
app.use(express.json({ limit: '1mb' }))

const database = []

app.post('/api', (request, response) => {
  console.log(request)
})