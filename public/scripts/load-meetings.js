function loadButtons (meeting) {
  const a = document.createElement('button')
  const text = document.createTextNode('Online')
  a.appendChild(text)
  a.setAttribute('class', 'btn btn-primary')
  a.setAttribute('data-id', 'onlineMeet')
  a.setAttribute('type', 'submit')
  meeting.appendChild(a)

  const a2 = document.createElement('button')
  const text2 = document.createTextNode('face-to-face')
  a2.appendChild(text2)
  a2.setAttribute('class', 'btn btn-primary')
  a2.setAttribute('data-id', 'faceMeet')
  a2.setAttribute('type', 'submit')
  meeting.appendChild(a2)
}

function removePlace (placeDiv) {
  while (placeDiv.hasChildNodes()) {
    placeDiv.removeChild(placeDiv.lastChild)
  }
}

function loadPlatform () {
  const placeDiv = document.getElementById('place')
  removePlace(placeDiv)

  const createBreak = document.createElement('br')
  // create the platform division
  const platform_div = document.createElement('div')

  // create label
  const label = document.createElement('label')
  label.setAttribute('for', 'platformInput')
  label.setAttribute('class', 'form-label')
  label.innerHTML = 'Choose Platform'

  // create the platform explanation
  const platform_exp = document.createElement('div')
  platform_exp.setAttribute('class', 'form-text')
  platform_exp.innerHTML = 'Please enter the name of the platform that will be used for the meeting'

  // create the input for the platform
  const inputPlatform = document.createElement('input')
  inputPlatform.type = 'text'
  inputPlatform.setAttribute('class', 'form-control')
  inputPlatform.setAttribute('id', 'platformInput')
  inputPlatform.setAttribute('required', 'required')
  inputPlatform.setAttribute('pattern', "[A-z0-9À-ž'.,\\s+-]+")
  inputPlatform.setAttribute('title', 'Platform name must consist of alphanumeric characters')
  inputPlatform.setAttribute('placeholder', 'Enter platform name...')
  inputPlatform.setAttribute('aria-describedby', 'platformHelp')

  // append
  platform_div.appendChild(label)
  platform_div.appendChild(platform_exp)
  platform_div.appendChild(inputPlatform)
  placeDiv.appendChild(platform_div)
  placeDiv.appendChild(createBreak)

  // Create Link division for input
  // create the link division
  const linkDiv = document.createElement('div')

  // create the link explanation
  const linkExp = document.createElement('div')
  linkExp.setAttribute('class', 'form-text')
  linkExp.setAttribute('id', 'linkHelp')
  linkExp.innerHTML = 'Please enter the name of the platform that will be used for the meeting'

  // create label
  const linkLabel = document.createElement('label')
  linkLabel.setAttribute('for', 'linkInput')
  linkLabel.setAttribute('class', 'form-label')
  linkLabel.innerHTML = 'Please enter the link for the meeting'

  // create the input for the link
  const inputLink = document.createElement('input')
  inputLink.type = 'text'
  inputLink.setAttribute('class', 'form-control')
  inputLink.setAttribute('id', 'linkInput')
  // inputLink.setAttribute('required', 'required')
  inputLink.setAttribute('pattern', "[A-z0-9À-ž'.,\\s+-@:%_~#=&?//\]+")
  inputLink.setAttribute('title', 'link name must consist of alphanumeric characters')
  inputLink.setAttribute('placeholder', 'Enter the link to the meeting...')
  inputLink.setAttribute('aria-describedby', 'linkHelp')
  inputLink.setAttribute('name', 'link')

  linkDiv.appendChild(linkLabel)
  linkDiv.appendChild(linkExp)
  linkDiv.appendChild(inputLink)
  placeDiv.appendChild(linkDiv)
  placeDiv.appendChild(createBreak)
}

function loadLocation () {
  const placeDiv = document.getElementById('place')
  removePlace(placeDiv)

  const createBreak = document.createElement('br')
  // create label
  const label = document.createElement('label')
  label.setAttribute('for', 'addressInput')
  label.setAttribute('class', 'form-label')
  label.innerHTML = 'Choose location'

  // create the input
  const input = document.createElement('input')
  input.type = 'text'
  input.setAttribute('class', 'form-control')
  input.setAttribute('id', 'addressInput')
  input.setAttribute('required', 'required')
  input.setAttribute('pattern', "[A-z0-9À-ž'.,\\s+-º]+")
  input.setAttribute('title', 'Location must consist of alphanumeric characters or use coordinate notation')
  input.setAttribute('placeholder', 'Enter address...')
  input.setAttribute('aria-describedby', 'addressHelp')
  input.setAttribute('name', 'place')

  // create the map explanation
  const map_div = document.createElement('div')
  map_div.setAttribute('class', 'form-text')
  map_div.setAttribute('id', 'addressHelp')
  map_div.innerHTML = 'View the map below to confirm that the correct address has been found'

  // create the map frame
  const map_frame = document.createElement('iframe')
  map_frame.setAttribute('id', 'map')
  map_frame.setAttribute('class', 'rounded')
  map_frame.setAttribute('width', '100%')
  map_frame.setAttribute('height', '400')
  map_frame.setAttribute('frameborder', '0')
  map_frame.setAttribute('style', 'border:0')
  map_frame.setAttribute('src', 'https://www.google.com/maps/embed/v1/place?key=AIzaSyCx_ZKS9QvVboI8DL_D9jDGA4sBHiAR3fU&q=%20&zoom=13')
  map_frame.setAttribute('allowfullscreen', 'allowfullscreen')

  placeDiv.appendChild(label)
  placeDiv.appendChild(input)
  placeDiv.appendChild(map_div)
  placeDiv.appendChild(map_frame)
  placeDiv.appendChild(createBreak)
}

function loadHTMLTable (data, option) {
  const table = document.querySelector('table tbody')
  if (data.recordsets.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan='7'>No meetings</td></tr>"
    return
  }

  let headings = ''
  headings += '<thead>'
  headings += '<th>meeting id</th>'
  headings += '<th>Group Name</th>'
  headings += '<th>creator id</th>'
  headings += '<th>Meeting Time</th>'
  headings += '<th>Place/Location</th>'
  headings += '</thead>'

  let tableHtml = ''
  tableHtml += headings
  data.recordset.forEach(function ({ meeting_id, group_name, creator_id, meeting_time, place, link, is_online }) { // group_num, group_online, group_url }) {
    if (is_online == option) {
      tableHtml += '<tr>'
      tableHtml += `<td id='${meeting_id}-id'>${meeting_id}</td>`
      tableHtml += `<td id='${meeting_id}-meeting-id'>${group_name}</td>`
      tableHtml += `<td id='${meeting_id}-creator-id'>${creator_id}</td>`
      tableHtml += `<td id = '${meeting_id}-meeting-time'>${new Date(meeting_time)}</td>`
      tableHtml += `<td id = '${meeting_id}-place'><a href=${link} target='_blank'>${place}</a></td>`
      tableHtml += `<td id = '${meeting_id}-link'></td>`
      tableHtml += '</tr>'
    }
  })

  table.innerHTML = tableHtml
}

export {
  loadLocation,
  loadPlatform,
  loadHTMLTable,
  loadButtons
}
