const {
  User
} = require('../models')
const jwt = require('jsonwebtoken')
const config = require('../config/config')

//helper method
function jwtSignUser(user) {
  
  return jwt.sign(user, config.authentication.jwtSecret, {
    expiresIn: 60 * 60 * 24 * 7
  })
}
module.exports = {
  async register(req, res) {
    try {
      const user = await User.create(req.body)
      res.send(user.toJSON())
     
    } catch (err) {
      res.status(400).send({
        error: 'This email is alrady in use'
      })
    }
  },

  async login(req, res) {
    try {
      const {
        email,
        password
      } = req.body
      const user = await User.findOne({
        where: {
          email: email
        }
      })

      if (!user) {
        return res.status(403).send({
          error: 'The login information was incorrect'
        })
      }
      const isPasswordValid = await user.comparePassword(password)
      if (!isPasswordValid) {
        return res.status(403).send({
          error: 'The login information was incorrect'
        })
      }
      const userJson = user.toJSON()
      res.send({
        user: userJson,
        token: jwtSignUser(userJson)
      })
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to log in'
      })
    }
  }
}