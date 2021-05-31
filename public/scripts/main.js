'use strict'

const dropdown = document.getElementsByClassName('dropdown-btn')

const dropMenu = document.getElementById('dropdown-containerID')
const studyGroups = ['Big Data', 'Software 3', '19th Centuary Spanish Poetry']
console.log(studyGroups.length)
// working select code
// const select = document.getElementById('studyGroup')
// for (let i = 0; i < studyGroups.length; i++) {
//   const groupName = studyGroups[i]
//   const addedElement = document.createElement('option')
//   addedElement.textContent = groupName
//   addedElement.value = groupName
//   select.appendChild(addedElement)
// }

// Buggy code for using the Bootstrap dropdown menu
// Continuously adds Big Data to the list on every click

function populateGroups () {
  for (let i = 0; i < studyGroups.length; i++) {
    const groupName = studyGroups[i]
    const addedElement = document.createElement('a')
    addedElement.textContent = groupName
    addedElement.value = groupName
    addedElement.href = '#'
    addedElement.class = 'dropdown-item'
    // if (dropMenu.length === studyGroups.length) { return } else {
    dropMenu.appendChild(addedElement)
    // }
    console.log(i)
  }
}

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
