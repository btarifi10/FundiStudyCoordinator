import { RetrieveProfile, LeaveGroup } from './load-profile.js'
document.addEventListener('DOMContentLoaded', function () {
  RetrieveProfile()
})

document.querySelector('table tbody').addEventListener('click', function (event) {
  if (event.target.className == 'delete-row-btn') {
    LeaveGroup(event.target.dataset.id)
  }
})
