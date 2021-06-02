'use strict'

import { UserDetails } from '../libraries/models/UserDetails.js'

// TODO: replace hardcoded things
const baseUrl = 'http://localhost:4200/api'
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
        fetch(baseUrl + '/currentUser')
          .then(response => response.json())
          .then(data => {
            resolve(new UserDetails(data.id, data.username))
          })
      })
      return user
    } catch (error) {
      console.log(error)
    }
  }
}
