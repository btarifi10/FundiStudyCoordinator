
'use strict'
// import { UserService } from './UserService.js'
const dropdown = document.getElementsByClassName('dropdown-btn')
const dropdownAllGroups = document.getElementsByClassName('dropdown-btn2')
const dropMenu = document.getElementById('dropdown-containerID')
const dropMenuAllGroups = document.getElementById('dropdown-containerAllGroups')

// To be replaced with database functionality therefore a more complex container was not implemented
const studyGroups = ['Big Data', 'Software 3', 'Sociology']
const hrefValues = ['big-data', 'software', 'sociology']
// const userService = UserService.getUserServiceInstance()
const currentUser = null

function populateGroups () {
  for (let i = 0; i < studyGroups.length; i++) {
    const groupName = studyGroups[i]
    const addedElement = document.createElement('a')
    addedElement.textContent = groupName
    addedElement.value = groupName
    addedElement.href = hrefValues[i]
    addedElement.id = hrefValues[i]
    addedElement.class = 'dropdown-item'
    dropMenu.appendChild(addedElement)
  }
}

// Populates the inital dropdown menu selection with the study groups listed above and then subsequently highlights them
// when mouse is hovered over each item
for (let i = 0; i < dropdown.length; i++) {
  populateGroups()
  dropdown[i].addEventListener('click', function () {
    this.classList.toggle('active')
    const dropdownContent = this.nextElementSibling

    if (dropdownContent.style.display === 'block') {
      dropdownContent.style.display = 'none'
    } else {
      dropdownContent.style.display = 'block'
    }
  })
}

// Functionality enabling the group to be searched for
function groupSearch () {
  const searchTerm = document.getElementById('inputValue')
  // Allows both cases to be correctly identified
  const filter = searchTerm.value.toLowerCase()
  const a = dropMenu.getElementsByTagName('a')
  for (let i = 0; i < a.length; i++) {
    const groupName = a[i].textContent || a[i].innerText
    if (groupName.toLowerCase().indexOf(filter) > -1) {
      a[i].style.display = ''
    } else {
      a[i].style.display = 'none'
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  fetch('http://localhost:3000/get-groups')//  , {
    .then(response => response.json())
    .then(data => {
      console.log(data)
      populateAllGroups(data)
    })
})

function populateAllGroups (data) {
  data.recordset.forEach(function ({ group_name }) {
    const groupName = `${group_name}`
    const addedElement = document.createElement('a')
    addedElement.textContent = groupName
    addedElement.value = groupName

    dropMenuAllGroups.appendChild(addedElement)
  })
}

for (let i = 0; i < dropdownAllGroups.length; i++) {
  dropdownAllGroups[i].addEventListener('click', function () {
    this.classList.toggle('active')
    const dropdownContent = this.nextElementSibling

    if (dropdownContent.style.display === 'block') {
      dropdownContent.style.display = 'none'
    } else {
      dropdownContent.style.display = 'block'
    }
  })
}

function entireGroupSearch () {
  const searchTerm = document.getElementById('inputGroupSearch')
  // Allows both cases to be correctly identified
  const filter = searchTerm.value.toLowerCase()
  const a = dropMenuAllGroups.getElementsByTagName('a')
  for (let i = 0; i < a.length; i++) {
    const groupName = a[i].textContent || a[i].innerText
    if (groupName.toLowerCase().indexOf(filter) > -1) {
      a[i].style.display = ''
    } else {
      a[i].style.display = 'none'
    }
  }
}
