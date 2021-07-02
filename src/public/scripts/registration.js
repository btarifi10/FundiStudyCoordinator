'use strict'

const alert = document.getElementById('alert')

document.forms['registration-form'].addEventListener('submit', (event) => {
  event.preventDefault()
  // TODO do something here to show user that form is being submitted

  fetch(event.target.action, {
    method: 'POST',
    body: new URLSearchParams(new FormData(event.target)) // event.target is the form
  })// or resp.text() or whatever the server sends
    .then(body => {
      if (body.redirected) {
        window.location.href = body.url
        return
      }
      return body.json()
    })
    .then(message => {
      if (message) { displayError(message.message) }
    })
    .catch(error => {
      console.log(error)
    })
})

function displayError (message) {
  alert.classList.remove('d-none')
  alert.innerText = message
}

function addAddress () {
  const addressDiv = document.getElementById('address-section')
  const addressBtn = document.getElementById('address-button')

  if (addressDiv.classList.contains('d-none')) {
    addressDiv.classList.remove('d-none')
    document.getElementById('address-line-1').required = true
    document.getElementById('city').required = true
    addressBtn.classList.remove('btn-secondary')
    addressBtn.classList.add('btn-danger')
    addressBtn.innerHTML = 'Remove address'
  } else {
    addressDiv.classList.add('d-none')
    document.getElementById('address-line-1').required = false
    document.getElementById('city').required = false

    addressBtn.classList.add('btn-secondary')
    addressBtn.classList.remove('btn-danger')
    addressBtn.innerHTML = 'Add address'
  }
}
