const GROUPS = [
  {
    group_id: '1',
    group_name: 'Phantom Menace',
    date_joined: new Date('1999'),
    group_num: '6',
    group_url: 'PM.html',
    group_online: '4'
  },
  {
    group_id: '2',
    group_name: 'Attack of the Clones',
    date_joined: new Date('2002'),
    group_num: '6',
    group_url: 'AC.html',
    group_online: '4'
  },
  {
    group_id: '3',
    group_name: 'Revenge of the Sith',
    date_joined: new Date('2005'),
    group_num: '6',
    group_url: 'RS.html',
    group_online: '4'
  },
  {
    group_id: '4',
    group_name: 'A New Hope',
    date_joined: new Date('1977'),
    group_num: '6',
    group_url: 'ANH.html',
    group_online: '4'
  },
  {
    group_id: '5',
    group_name: 'The Empire Strikes Back',
    date_joined: new Date('1980'),
    group_num: '6',
    group_url: 'ESB.html',
    group_online: '4'
  },
  {
    group_id: '6',
    group_name: 'Return of the Jedi',
    date_joined: new Date('1983'),
    group_num: '6',
    group_url: 'RJ.html',
    group_online: '4'
  }
]

let userGroups = null

document.addEventListener('DOMContentLoaded', function () {
  fetch('http://localhost:3000/getAll')
    .then(response => response.json())
    .then(data => {
      userGroups = data
      loadHTMLTable(userGroups)
    })
    // .then(data => console.log(data))
  // loadHTMLTable([''])
})

document.querySelector('table tbody').addEventListener('click', function (event) {
  if (event.target.className == 'delete-row-btn') {
    LeaveGroup(event.target.dataset.group_id)
  }
  if (event.target.className == 'navigate-group-btn') {
    handleNavigation(event.target.dataset.group_id)
  }
})

function handleNavigation () {
  location.href = 'memberships.html'
}

const membBtn = document.querySelector('#membership-btn')
membBtn.onclick = function () {
  loadHTMLTable(GROUPS)
  // location.href=("http://127.0.0.1:5500/views/home.html");
}

function loadHTMLTable (data) {
  const table = document.querySelector('table tbody'); 5

  if (data.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan='7'>No Memberships</td></tr>"
    return
  }

  let tableHtml = ''

  data.forEach(function ({ group_id, group_name, date_joined, group_num, group_online, group_url }) {
    tableHtml += '<tr>'
    tableHtml += `<td>${group_id}</td>`
    tableHtml += `<td><a href= ${group_url} id='${group_id}-url'> ${group_name} </a></td>` //  tableHtml += `<td>${group_name}</td>`;
    tableHtml += `<td>${new Date(date_joined).toLocaleString()}</td>`
    tableHtml += `<td>${group_num}</td>`
    tableHtml += `<td>${group_online}</td>`
    tableHtml += `<td><button class="navigate-group-btn" data-id=${group_id}>Navigate</td>`
    tableHtml += `<td><button class="delete-row-btn" data-id=${group_id}>Leave</td>`
    tableHtml += '</tr>'
  })
  table.innerHTML = tableHtml
}

function LeaveGroup (group_id) {
  fetch('http://localhost:3000/leaveGroup/' + group_id, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        location.reload()
      }
    })
}
