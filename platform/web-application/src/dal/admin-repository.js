//User postgres for this repository
const db = require('./db')
/** TODO !!! */

module.exports = function() {
    const exports = {}

    exports.getSettings = function (callback) {
        const query = `SELECT * FROM global_settings `

        db.query(query, [], function (error, rows) {
            if(error){
                console.log(error)
                callback(['internal_error', null])
            }else{
                const rows_modified = {
                    site_title: rows[0].site_title,
                    site_subtitle: rows[0].site_subtitle,
                    site_header: rows[0].site_header,
                    general_contact_name: rows[0].general_contact_name,
                    general_contact_email: rows[0].general_contact_email,
                    opening_times: rows[0].opening_times,
                    general_contact_phone_nr: rows[0].general_contact_phone_nr,
                    about_content: rows[0].about_content,
                    contacts_obj_array: JSON.parse(rows[0].contacts_obj_array)
                }
                callback([], rows_modified)
            }
        })
    }

    exports.updateSettings = function (settings, callback) {
        const query = `UPDATE global_settings
        SET 
        site_title = ?,
        site_subtitle = ?,
        general_contact_name = ?,
        general_contact_email = ?,
        opening_times = ?,
        general_contact_phone_nr = ?,
        about_content = ?,
        contacts_obj_array = ?,
        site_header = ?`


        const values = [
            settings.site_title,
            settings.site_subtitle,
            settings.general_contact_name,
            settings.general_contact_email,
            settings.opening_times,
            settings.general_contact_phone_nr,
            settings.about_content,
            JSON.stringify(settings.contacts_obj_array),
            settings.site_header
        ]

        db.query(query, values, function (error, result) {
            if(error){
                console.log(error)
                callback(['internal_error', null])
            }else{
                callback([], result)
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
                if(rows[0].contacts_obj_array == undefined || rows[0].contacts_obj_array == null){
                    callback([],[])
                }
                callback([], JSON.parse(rows[0].contacts_obj_array))
            }
        })
    }

    exports.addContact = function (contacts_obj_array,callback) {
        const query = `UPDATE global_settings
        SET 
        contacts_obj_array = ?`

        const values = [
            JSON.stringify(contacts_obj_array)
        ]

        db.query(query, values, function (error, rows) {
            if(error){
                callback(['internal_error', null])
            }else{
                callback([], rows)
            }
        })
    }

    exports.getFeedback = function (callback) {
        const query = `SELECT * FROM feedback`

        db.query(query, [], function (error, rows) {
            if(error){
                console.log(error)
                callback(['internal_error', null])
            }else{
                callback([], rows)
            }
        })
    }

    exports.deleteFeedback = function (feedback, callback) {
        const query = `DELETE FROM feedback WHERE feedback_id = ?`

        const values = [
            feedback.feedback_id
        ]

        db.query(query, values, function (error, rows) {
            if(error){
                console.log(error)
                callback(['internal_error'], null)
            }else{
                callback([], rows)
            }
        })
    }

    return exports
}