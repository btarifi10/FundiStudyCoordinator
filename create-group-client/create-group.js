
const button = document.getElementById('add-group-btn')
const database = []

button.addEventListener('click', function () {
  const paragraph = document.createElement('p')
  const userinput = document.getElementById('group-name-input')
  const grouplist = document.getElementById('groupList')

  if ((userinput.value != '') && (!(database.includes(userinput.value)))) {
    database.push(userinput.value)
    const text = document.createTextNode(userinput.value)
    paragraph.appendChild(text)
    grouplist.append(paragraph)

  } else {
    alert('Please enter a valid group name')
  }
}, false)
