'use strict'

class User {
  constructor (userId, username, userPassword, firstName, lastName, rating) {
    this.userId = userId
    this.username = username
    this.userPassword = userPassword
    this.firstName = firstName
    this.lastName = lastName
    this.rating = rating
  }
}

module.exports = { User }
