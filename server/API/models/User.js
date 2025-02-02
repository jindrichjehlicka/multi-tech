const Promise = require('bluebird')
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'))

function hashPassword(user, options) {
    const SALT_FACTOR = 8

    if (!user.changed('password')) {
        return;
    }

    return bcrypt
        .genSaltAsync(SALT_FACTOR)
        .then(salt => bcrypt.hashAsync(user.password, salt, null))
        .then(hash => {
            user.setDataValue('password', hash)
        })
}

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        email: {
            type: DataTypes.STRING,
            unique: true
        },
        password: DataTypes.STRING,
        mine: {
            type: DataTypes.STRING,
            defaultValue: 'Not Defined'

        },
        admin: {
            type: DataTypes.INTEGER,
            defaultValue: 0

        },

    }, {
        hooks: {
            beforeCreate: hashPassword,
            beforeUpdate: hashPassword,
            beforeSave: hashPassword
        }
    })

    User.prototype.comparePassword = function (password) {
        return bcrypt.compareAsync(password, this.password)
    }

    return User
}
//takes sequelize and data types, returns(define) user model that can be used