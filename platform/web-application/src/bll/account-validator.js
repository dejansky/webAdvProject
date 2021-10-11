//

const { request } = require("express")
const bcrypt = require('bcrypt');

module.exports = function ({
    globals
}) {
    const exports = {}

    const values = globals.values()
    
    exports.validateFeedback = function(feedback) {
        const error = []
        const regx = /^[a-zA-Z]([-']?[a-zA-Z]+)*( [a-zA-Z]([-']?[a-zA-Z]+)*)+$/

        console.log(feedback)

        if (feedback.full_name.length > values.MAX_NAME_LENGTH || feedback.full_name.length < values.MIN_NAME_LENGTH ) {
            error.push('fist_name_last_name_invalid')
        }

        if (!regx.test(feedback.full_name)) {
            error.push('fist_name_last_name_nac')
        }   

        if (!feedback.email_address.includes('@') || (!feedback.email_address.includes('.com') && !feedback.email_address.includes('.se'))) {
            error.push('correction_of_email_address')
        }

        if (feedback.message.length > values.MAX_MESSAGE_LENGTH || feedback.message.length < values.MIN_MESSAGE_LENGTH ) {
            error.push('contact_message_error')
        }  


        console.log(error)
        return error
    }

    exports.getErrorsNewAccount = function(account) {
        const error = []
        const regx = /^[a-zA-Z]+$/

        if (account.username.length > values.MAX_USERNAME_LENGTH || account.username.length < values.MIN_USERNAME_LENGTH ) {
            error.push('username_invalid')
        } 

        else if ((account.full_name || account.last_name < values.MIN_NAME_LENGTH) || (account.full_name || account.last_name < values.MAX_NAME_LENGTH)) {
            error.push('fist_name_last_name_invalid')
        }
        else if ( !regx.test(account.full_name) || !regx.test(account.last_name)) {
            error.push('fist_name_last_name_nac')
        }  
        
        else if (!account.email_address.includes('@') || !account.email_address.includes('.com') && !account.email_address.includes('.se')) {
            error.push('correction_of_email_address')
        } 

        else if (isNaN(account.phone_number)) {
            error.push('phone_number_nan')
        } 
        
        else if (account.password != account.password_confirmation) {
            error.push('passwords_not_matching')
        }

        return error
    }

    exports.validateProfileUpdate = function(profile) {
        const error = []
        const regx = /^[a-zA-Z]+$/

        if (((profile.first_name.length || profile.last_name.length) < values.MIN_NAME_LENGTH) || ((profile.first_name.length || profile.last_name.length) > values.MAX_NAME_LENGTH)) {
            error.push('fist_name_last_name_invalid')
        }
        if ( !regx.test(profile.first_name) || !regx.test(profile.last_name)) {
            error.push('fist_name_last_name_nac')
        }  
        
        if (!profile.email_address.includes('@') || !profile.email_address.includes('.com') && !profile.email_address.includes('.se')) {
            error.push('correction_of_email_address')
        } 

        if (isNaN(profile.phone_number)) {
            error.push('phone_number_nan')
        } 
        

        return error
    }


    exports.validateUserLogin = function(login_credentials, user) {
        const errors = []

        if (login_credentials.entered_username == user.username) {
            
            if(bcrypt.compareSync(login_credentials.entered_password, user.password)){
                if(user.employee_flag == 1){
                    user.employee_flag = true
                }
                if(user.admin_flag == 1){
                    user.admin_flag = true
                }
            }
            else{
                errors.push('incorrect_login_credentials')
            }
        }        
        return errors

    }
    exports.isLoggedIn = function(session) {
        const errors = []
        if (session.is_logged_in != true) {
            errors.push('not_logged_in')
        }
        return errors
    }
    exports.isLoggedOut = function(session) {
        const errors = []
        if (session.is_logged_in == true) {
            errors.push('not_logged_out')
        }
        return errors
    }

    exports.isEmployee = function(session) {
        const errors = []
        if (session.is_logged_in != true || session.is_employee != true) {
            errors.push('not_authorized')
        }
        return errors
    }
    

    exports.isAdmin = function(session) {
        const errors = []
        if (session.is_logged_in != true || session.is_admin != true) {
            errors.push('not_authorized')
        }
        return errors
    }

    return exports
}