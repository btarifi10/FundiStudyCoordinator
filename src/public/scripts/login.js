'use strict'

const alert = document.getElementById('alert')

document.forms['login-form'].addEventListener('submit', (event) => {
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
