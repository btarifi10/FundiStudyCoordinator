'use strict'

class User {
  constructor (userId, username, userPassword, firstName, lastName, rating, addressLine1, addressLine2, city, postalCode) {
    this.userId = userId
    this.username = username
    this.userPassword = userPassword
    this.firstName = firstName
    this.lastName = lastName
    this.rating = rating
    this.addressLine1 = addressLine1
    this.addressLine2 = addressLine2
    this.city = city
    this.postalCode = postalCode
  }
}

module.exports = { User }
