const { query } = require('express')
const db = require('./db')
/**TODOO */

module.exports = function() {
    const exports = {}
    
    exports.addFeedback = function(feedback, callback) {
        const query = `INSERT INTO feedback(full_name, email, message)
        VALUES (?, ?, ?)` //use $n("where n is a number") instead of ?

        const values = [
            feedback.full_name,
            feedback.email_address,
            feedback.message
        ]

        console.log(values, 'From repository')

        db.query(query, values, (error, rows)=> {
            if (error) {
                console.log(error)
                callback(['internal_error'], null)
            } else {
                callback([], rows)
            }
        })
    }

    exports.getGeneralInfo = function (callback) {
        const query = `SELECT site_title, site_subtitle, site_header, general_contact_name, general_contact_email, opening_times, general_contact_phone_nr  FROM global_settings`

        db.query(query, [], function (error, rows) {
            if(error){
                console.log(error)
                callback(['internal_error', null])
            }else{
                callback([], rows)
            }
        })
    }

    exports.getAboutContent= function (callback) {
        const query = `SELECT about_content FROM global_settings`

        db.query(query, [], function (error, rows) {
            if(error){
                console.log(error)
                callback(['internal_error', null])
            }else{
                callback([], rows[0])
            }
        })
    }

    exports.getContacts = function (callback) {
        const query = `SELECT contacts_obj_array
        FROM global_settings`

        db.query(query, [], function (error, rows) {
            if(error){
                console.log(error)
                callback(['internal_error', null])
            }else{
                callback([], JSON.parse(rows[0].contacts_obj_array))
            }
        })
    }


    return exports
}