'use strict'

const { User } = require('./models/User')
const db = require('./database-service')
const instance = null

class UserService {
  static getUserServiceInstance () {
    return instance || new UserService()
  }

  async getAllUsers () {
    try {
      const users = await new Promise((resolve, reject) => {
        // Make a query to the database
        db.pools.then((pool) => {
          return pool.request().query('SELECT * FROM users')
        })
        // Send back the result
          .then(result => {
            const theUsers = []
            result.recordset.forEach(({ user_id, username, user_password, first_name, last_name, rating }) => {
              theUsers.push(new User(user_id.toString().trim(), username.toString().trim(), user_password.toString().trim(),
                first_name.toString().trim(), last_name.toString().trim(), rating))
            })
            resolve(theUsers)
          })
      })
      return users
    } catch (error) {
      console.log(error)
    }
  }

  async addNewUser (user) {
    try {
      const status = await new Promise((resolve, reject) => {
        db.pools
          .then((pool) => {
            return pool.request()
              .input('username', db.sql.Char, user.username)
              .input('pass', db.sql.Char, user.user_password)
              .input('first', db.sql.Char, user.first_name)
              .input('last', db.sql.Char, user.last_name)
              .query(`
                    INSERT INTO users (username, user_password, first_name, last_name) 
                    VALUES (@username, @pass, @first, @last);
                `)
          })
          .then(result => {
            resolve(result.rowsAffected[0] === 1)
          })
      })

      console.log(status)
      return status
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = { UserService }
