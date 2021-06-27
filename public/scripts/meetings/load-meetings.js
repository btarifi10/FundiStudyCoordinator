// import {moment}
/* --------- Remove previous contents added to the element----------- */
function removePlace (placeDiv) {
  while (placeDiv.hasChildNodes()) {
    placeDiv.removeChild(placeDiv.lastChild)
  }
}

/* ----------------- Load the online meeting form ------------------- */
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
  inputPlatform.setAttribute('data-cy', 'platform-input')

  // append
  platform_div.appendChild(label)
  platform_div.appendChild(platform_exp)
  platform_div.appendChild(inputPlatform)
  placeDiv.appendChild(platform_div)
  placeDiv.appendChild(createBreak)

  // Create Link division for input
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
  inputLink.setAttribute('data-cy', 'link-input')

  linkDiv.appendChild(linkLabel)
  linkDiv.appendChild(linkExp)
  linkDiv.appendChild(inputLink)
  placeDiv.appendChild(linkDiv)
  placeDiv.appendChild(createBreak)
}

/* -------------- Load the face-to-face meeting form ---------------- */
function loadLocation () {
  const placeDiv = document.getElementById('place')
  removePlace(placeDiv)

  const createBreak = document.createElement('br')

  const rowDiv = document.createElement('div')
  rowDiv.setAttribute('class', 'row')
  const leftColDiv = document.createElement('div')
  leftColDiv.setAttribute('class', 'col-md-8')
  const rightColDiv = document.createElement('div')
  rightColDiv.setAttribute('class', 'col-md-4')

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
  input.setAttribute('data-cy', 'address-input')

  const inputHelp = document.createElement('div')
  inputHelp.setAttribute('id', 'location-hint')
  inputHelp.setAttribute('class', 'form-text d-none')
  inputHelp.innerText = ''
  leftColDiv.appendChild(input)

  const btnGroup = document.createElement('div')
  btnGroup.setAttribute('class', 'btn-group')

  const recommendButton = document.createElement('button')
  recommendButton.type = 'button'
  recommendButton.setAttribute('class', 'btn btn-success dropdown-toggle')
  recommendButton.setAttribute('id', 'recommendDropdown')
  recommendButton.setAttribute('data-toggle', 'dropdown')
  recommendButton.setAttribute('aria-haspopup', 'true')
  recommendButton.setAttribute('aria-expanded', 'false')
  recommendButton.setAttribute('data-cy', 'recommend-btn')
  recommendButton.innerText = 'Recommend Locations'
  btnGroup.appendChild(recommendButton)

  const popupDiv = document.createElement('div')
  popupDiv.setAttribute('class', 'dropdown-menu')
  popupDiv.setAttribute('aria-labelledby', 'recommendDropdown')
  // Most central recommendation
  const btn1 = document.createElement('button')
  btn1.type = 'button'
  btn1.setAttribute('class', 'dropdown-item')
  btn1.setAttribute('onclick', 'recommendCentralLocation()')
  btn1.setAttribute('data-cy', 'central-location-btn')
  btn1.innerText = 'Most central member\'s address'
  // Current user address
  const btn2 = document.createElement('button')
  btn2.type = 'button'
  btn2.setAttribute('class', 'dropdown-item')
  btn2.setAttribute('onclick', 'recommendUserLocation()')
  btn2.setAttribute('data-cy', 'user-location-btn')
  btn2.innerText = 'Your address'
  // University address
  const btn3 = document.createElement('button')
  btn3.type = 'button'
  btn3.setAttribute('class', 'dropdown-item')
  btn3.setAttribute('onclick', 'recommendUniLocation()')
  btn3.setAttribute('data-cy', 'uni-location-btn')
  btn3.innerText = 'Wits'
  popupDiv.appendChild(btn1)
  popupDiv.appendChild(btn2)
  popupDiv.appendChild(btn3)
  btnGroup.appendChild(popupDiv)
  rightColDiv.appendChild(btnGroup)
  rowDiv.appendChild(leftColDiv)
  rowDiv.appendChild(rightColDiv)

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
  map_frame.setAttribute('data-cy', 'map')

  placeDiv.appendChild(label)
  placeDiv.appendChild(rowDiv)
  placeDiv.appendChild(inputHelp)
  placeDiv.appendChild(createBreak)
  placeDiv.appendChild(map_div)
  placeDiv.appendChild(map_frame)
  placeDiv.appendChild(createBreak)
}

/** ------------------- VIEW MEETINGS HELPERS ---------------------- **/
/* ------------- Load the View Meetings Options buttons ------------- */
function loadButtons (meeting) {
  const a = document.createElement('button')
  const text = document.createTextNode('Online')
  a.appendChild(text)
  a.setAttribute('class', 'btn btn-primary')
  a.setAttribute('data-id', 'onlineMeet')
  a.setAttribute('id', 'onlineMeet')
  a.setAttribute('data-cy', 'onlineMeetingView')
  a.setAttribute('type', 'submit')

  const i = document.createElement('i')
  i.setAttribute('class', 'fas fa-globe')
  a.appendChild(i)
  meeting.appendChild(a)

  const a2 = document.createElement('button')
  const text2 = document.createTextNode('face-to-face')
  a2.appendChild(text2)
  a2.setAttribute('class', 'btn btn-primary')
  a2.setAttribute('data-id', 'faceMeet')
  a2.setAttribute('data-cy', 'face2faceMeetingView')
  a2.setAttribute('type', 'submit')
  const i2 = document.createElement('i')
  i2.setAttribute('class', 'fa fa-map-marker')
  a2.appendChild(i2)
  meeting.appendChild(a2)
}

/* ------------- Calculate the remaining time ------------- */
function getTimeRemaining (chosenTime, current_time) {
  // to seconds
  let sec_remaining = Math.abs(chosenTime.getTime() - current_time.getTime()) / (1000)

  // first calculate thenumber of whole days
  const days_remaining = Math.floor(sec_remaining / 86400)
  sec_remaining -= days_remaining * 86400 // subtract the number of days

  const hours_remaining = Math.floor(sec_remaining / 3600) % 24
  sec_remaining -= hours_remaining * 3600

  const min_remaining = Math.floor(sec_remaining / 60) % 60
  sec_remaining -= min_remaining * 60

  sec_remaining = Math.floor(sec_remaining % 60)
  // }

  return {
    days: days_remaining,
    hours: hours_remaining,
    minutes: min_remaining,
    seconds: sec_remaining
  }
}

export {
  loadLocation,
  loadPlatform,
  loadButtons,
  getTimeRemaining
}
