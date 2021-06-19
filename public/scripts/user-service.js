'use strict'

// TODO: Add more details to user such as list of groups, personal info, etc.
class UserDetails {
  constructor (id, username, firstName, lastName, rating) {
    if (typeof (id) === 'string') { this.id = parseInt(id) } else { this.id = id }
    this.username = username
    this.firstName = firstName
    this.lastName = lastName
    this.rating = rating
  }
}

// TODO: replace hardcoded things
const instance = null

export class UserService {
  // Only allows one instance of UserService to exist.
  static getUserServiceInstance () {
    return instance || new UserService()
  }

  // Make API call to retrieve current user
  async getCurrentUser () {
    try {
      const user = await new Promise((resolve, reject) => {
        fetch('api/currentUser')
          .then(response => response.json())
          .then(data => {
            resolve(new UserDetails(data.userId, data.username, data.firstName, data.lastName, data.rating))
          })
      })
      return user
    } catch (error) {
      console.log(error)
    }
  }
}
