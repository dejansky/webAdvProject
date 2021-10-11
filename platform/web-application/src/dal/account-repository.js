const { query } = require('express')
const db = require('./db')

module.exports = function() {
    const exports = {}

    exports.getAllAccounts = function(callback) {
        const query = `SELECT * FROM users`
        const values = []

        db.query(query, values, function(error, rows) {
            if (error) {
                console.log(error)
                callback(['internal_error'], null)
            } else {
                callback([], rows)
            }
        })
    }

    exports.createAccount = function(account, callback) {
        const query = `INSERT INTO users(username, password, first_name, last_name, phone_number, email_address)
        VALUES (?,?,?,?,?,?)`
        const values = [
            account.username,
            account.password,
            account.first_name,
            account.last_name,
            account.phone_number,
            account.email_address
        ]

        db.query(query, values, function(error, rows) {
            if (error) {
                console.log(error)
                if(error.code == 'ER_DUP_ENTRY'){
                    callback(['user_exists_error'], null)
                }else{
                    callback(['internal_error'], null)
                }
            } else {
                callback([], rows.inserId)
            }
        })
    }

    exports.updateAccount = function(account, callback) {
        const query = `UPDATE users 
        SET 
            username = ?, 
            first_name = ?, 
            last_name = ?, 
            phone_number = ?,
            email_address = ?, 
            admin_flag = ?,
            employee_flag = ? 
        WHERE 
            user_id = ?`

        const values = [
            account.username,
            account.first_name,
            account.last_name,
            account.phone_number,
            account.email_address,
            account.admin_flag,
            account.employee_flag,
            account.user_id     
        ]
        db.query(query, values, function(error, rows) {
            if (error) {
                console.log(error)
                callback(['internal_error'], null)
            } else {
                callback([], rows)
            }
        })
    }

    exports.deleteAccount = function(account, callback) {
        const query = `DELETE FROM users
        WHERE user_id = ?`
        const values = [
            account.user_id
        ]

        db.query(query, values, function(error, rows) {
            if (error) {
                console.log(error)
                callback(['internal_error'], null)
            } else {
                callback([], rows)
            }
        }) 
    }

    exports.updateProfile = function(profile, callback) {
        const query = `UPDATE users 
        SET 
            first_name = ?, 
            last_name = ?, 
            phone_number = ?,
            email_address = ? 
        WHERE 
            user_id = ?`

        const values = [
            profile.first_name,
            profile.last_name,
            profile.phone_number,
            profile.email_address,
            profile.id,
        ]

        db.query(query, values, function(error, rows) {
            if (error) {
                console.log(error)
                callback(['internal_error'], null)
            } else {
                callback([], rows)
            }
        })
    }

    exports.getProfile = function(profile_authentication,callback) {
        const query = `SELECT username, first_name, last_name, phone_number, email_address FROM users 
        WHERE user_id = ? AND username = ?`

        const values = [
            profile_authentication.user_id,
            profile_authentication.username
        ]
        console.log(values)

        db.query(query, values, function(error, rows) {
            if (error) {
                console.log(error)
                callback(['internal_error'], null)
            } else {
                callback([], rows)
            }
        }) 
    }

    exports.getAccount = function(login_credentials,callback) {
        const query = `SELECT * FROM users 
        WHERE username = ?`
        
        const values = [
            login_credentials.entered_username
        ]

        db.query(query, values, function(error, rows) {
            if (error) {
                console.log(error)
                callback(['internal_error'], null)
            } else {
                if(rows.length == 0){
                    callback(['user_does_not_exist'], rows[0])
                    return
                }
                callback([], rows[0])
            }
        }) 
    }

    return exports
}