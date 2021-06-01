'use strict'

import { UserDetails } from '../libraries/models/UserDetails.js'
const baseUrl = 'http://localhost:6969/api'
const instance = null

export class UserService {
  static getUserServiceInstance () {
    return instance || new UserService()
  }

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
