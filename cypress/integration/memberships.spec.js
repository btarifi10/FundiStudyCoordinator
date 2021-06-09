'use strict'
import data from '../fixtures/memberships.json'
const GROUPS = data.GROUPS
const GROUPS2 = data.GROUPS2
function createStringComparisons (data) {
  let firstTable = ''

  data.forEach(function ({ group_id, group_name, date_joined, group_num, group_online, group_url }) {
    firstTable += `${group_id}`
    firstTable += `${group_name}` //  tableHtml += `<td>${group_name}</td>`;
    firstTable += `${new Date(date_joined).toLocaleString()}`
    firstTable += `${group_num}`
    firstTable += `${group_online}`
    firstTable += 'Navigate'
    firstTable += 'Leave'
  })
  return firstTable
}

describe('Profile testing links', () => {
})
