const passport = require('passport')

module.exports = function (req, res, next) {
  passport.authenticate('jwt', function (err, user) {
    if (err || !user) {
      res.status(403).send({
        error: 'Access denied'
      })
    } else if(user.admin===1 ){
      
        req.user = user
        next()
      
    
    }
  })(req, res, next)
}  