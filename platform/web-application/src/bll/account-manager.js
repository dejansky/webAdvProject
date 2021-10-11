const {response, request} = require("express")
//const bcrypt = require('bcryptjs');
const bcrypt = require('bcrypt');
const saltRounds = 10 //As recommended on the doc

module.exports = function ({
    accountRepository,
    accountValidator,
    globals
}) {
    const exports = {}

    exports.getAllAccounts = function (session, callback) {
        const errors = []

        accountValidator.isEmployee(session).forEach(element => {
            errors.push(element)
        })

        if (errors.length > 0) {
            callback(errors, null)
            return
        }

        accountRepository.getAllAccounts(callback)
    }

    exports.createAccount = function (session, account, callback) {
        const errors = []

        accountValidator.getErrorsNewAccount(account).forEach(element => {
            errors.push(element)
        });
        accountValidator.isLoggedOut(session).forEach(element => {
            errors.push(element)
        })

        if (errors.length > 0) {
            callback(errors, null)
        } else {
            bcrypt.genSalt(saltRounds, function (err, salt) {
                if (err) {
                    errors.push('salt_err')
                    callback(errors, null)
                }
                bcrypt.hash(account.password, salt, function (err, hash) {
                    if (err) {
                        callback(errors, null)
                    } else {
                        account.password = hash //Can we change values like this?
                    }
                    accountRepository.createAccount(account, callback)
                })
            })
        }
    }

    exports.updateAccount = function (session, account, callback) {


        const errors = []
        
        accountValidator.validateProfileUpdate(account).forEach(element => {
            errors.push(element)
        })

        accountValidator.isAdmin(session).forEach(element => {
            errors.push(element)
        })

        if (errors.length > 0) {
            callback(errors, null)
            return
        }

        accountRepository.updateAccount(account, callback)
    }

    exports.deleteAccount = function (session, account, callback) {
        const errors = []

        accountValidator.isLoggedIn(session).forEach(element => {
            errors.push(element)
        })
        accountValidator.isAdmin(session).forEach(element => {
            errors.push(element)
        })

        if (errors.length > 0) {
            callback(errors, null)
            return
        }
        accountRepository.deleteAccount(account, callback)

    }

    exports.updateProfile = function (session, profile, callback) {

        const errors = []

        accountValidator.validateProfileUpdate(profile).forEach(element => {
            errors.push(element)
        })

        accountValidator.isLoggedIn(session).forEach(element => {
            errors.push(element)
        })

        if (errors.length > 0) {
            callback(errors, null)
            return
        }

        accountRepository.updateProfile(profile, callback)
    }

    exports.getProfile = function (session, profile_authentication, callback) {
        const errors = []

        accountValidator.isLoggedIn(session).forEach(element => {
            errors.push(element)
        })

        if (errors.length > 0) {
            callback(errors, null)
            return
        }

        accountRepository.getProfile(profile_authentication, callback)
    }

    exports.loginUser = function (session, login_credentials, callback) {
        const errors = []

        accountValidator.isLoggedOut(session).forEach(element => {
            errors.push(element)
        })

        if (errors.length > 0) {
            callback(errors, null)
            return
        }

        console.log('Do we get here ? ')
        accountRepository.getAccount(login_credentials, function (error, user) {
                error.forEach(element => {
                    errors.push(element)
                })
    
                if (errors.length > 0 || user == null) {
                    callback(errors, null)
                    return
                }

                accountValidator.validateUserLogin(login_credentials, user).forEach(element=>{
                    errors.push(element)
                })                

                console.log(errors)
                if (errors.length > 0) {
                    callback(errors, null)
                    return 
                }
                callback([], user)

        })
    }

    exports.isLoggedOut = function (session, callback) {
        const errors = []

        accountValidator.isLoggedOut(session).forEach(element => {
            errors.push(element)
        })

        if (errors.length > 0) {
            callback(errors, null)
            return
        }
        callback([])

    }

    exports.isLoggedIn = function (session, callback) {
        const errors = []

        accountValidator.isLoggedIn(session).forEach(element => {
            errors.push(element)
        })

        if (errors.length > 0) {
            callback(errors, null)
            return
        }
        callback([])
    }

    exports.isEmployee = function (session, callback) {
        const errors = []

        accountValidator.isEmployee(session).forEach(element => {
            errors.push(element)
        })

        if (errors.length > 0) {
            callback(errors, null)
            return
        }
        callback([])
    }

    exports.isAdmin = function (session, callback) {
        const errors = []

        accountValidator.isAdmin(session).forEach(element => {
            errors.push(element)
        })

        if (errors.length > 0) {
            callback(errors, null)
            return
        }
        callback([])
    }

    return exports
}