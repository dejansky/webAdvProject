const postgresDB = require('../sequelize-dal/sequelize-pgdb')
const seq_user = postgresDB.users

module.exports = function () {
    const exports = {}

    //getAllAccounts
    exports.getAllAccounts = function (callback) {
        seq_user.findAll({
                raw: true
            })
            .then(() => {
                console.log('All Sequelize users:' + seq_user)
                callback([], seq_user)
            })
            .catch(errors => {
                console.log(errors)
                callback(['internal_error'], null)
            })
    }

    //createAccount
    exports.createAccount = function (account, callback) {
        seq_user.create({
                username: account.username,
                password: account.password,
                first_name: account.first_name,
                last_name: account.last_name,
                phone_number: account.phone_number,
                email_address: account.email_address
            })
            .then(() => {
                callback(seq_user.username)
            })
            .catch((errors) => {
                if (errors instanceof UniqueConstraintError) {
                    callback(['username_taken'], null)
                } else {
                    callback(['internal_error'], null)
                }
            })
    }

    //updateAccount
    exports.updateAccount = function (account, callback) {
        seq_user.update({
                username: account.username,
                first_name: account.first_name,
                last_name: account.last_name,
                phone_number: account.phone_number,
                email_address: account.email_address,
                admin_flag: account.admin_flag,
                employee_flag: account.employee_flag,

            }, {
                where: {
                    user_id: account.user_id
                }
            })
            .then(() => {
                callback(seq_user.username, null)
            })
            .catch(() => {
                callback(['internal_error'], null)
            })
    }

    //deleteAccount
    exports.deleteAccount = function (account, callback) {
        seq_user.destroy({
                where: {
                    user_id: account.user_id
                }
            })
            .then(() => {
                callback(null)
            })
            .catch(() => {
                callback(['internal_error'], null)
            })
    }

    //updateProfile
    exports.updateProfile = function (profile, callback) {
        seq_user.update({
                first_name: profile.first_name,
                last_name: profile.last_name,
                phone_number: profile.phone_number,
                email_address: profile.email_address
            }, {
                where: {
                    recipe_id: recipe.recipe_id
                }
            })
            .then(() => {
                callback(profile)
            })
            .catch(() => {
                callback(['internal_error'], null)
            })
    }


    //getProfile
    exports.getProfile = function (profile_authentication, callback) {
        seq_user.findAll({
                where: {
                    user_id: profile_authentication.user_id,
                    username: profile_authentication.username
                }
            })
            .then((seq_user) => {
                callback([], seq_user)
            })
            .catch(() => {
                callback(['internal_error'], null)
            })
    }

    //getAccount    
    exports.getAccount = function (login_credentials, callback) {
        console.log('Entered account function')
        seq_user.findAll({
                where: {
                    username: login_credentials.entered_username
                }
            })
            .then((seq_user) => {
                console.log(seq_user, '<<--- USER')
                callback([], seq_user)
            })
            .catch(() => {
                callback(['internal_error'], null)
            })
    }

    return exports
}