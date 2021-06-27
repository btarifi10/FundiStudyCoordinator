// Defining constants used for directions links
const URL_BASE = 'https://www.google.com/maps/'
const API_NUM = '1'

function loadMeetingLink (link) {
  const meetingLink = document.getElementById('meeting-link')
  const a = document.createElement('a')
  const text = document.createTextNode('Navigate to meeting')
  a.appendChild(text)
  a.setAttribute('class', 'btn btn-secondary')

  a.href = link.recordset[0].link
  a.target = '_blank' // changes whether or not a new window is created
  meetingLink.appendChild(a)
}

// remove child elements from an element
function removePlace (placeDiv) {
  while (placeDiv.hasChildNodes()) {
    placeDiv.removeChild(placeDiv.lastChild)
  }
}
// ***********************************
// Build a valid URL
function createDirectionLink (location) {
  const URL = `${URL_BASE}dir/?api=${API_NUM}&destination=${location.lat},${location.lng}`
  const encodedURL = encodeURI(URL)
  return encodedURL
}

export {
  loadMeetingLink,
  createDirectionLink,
  removePlace
}
