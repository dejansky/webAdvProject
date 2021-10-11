//

const adminValidator = require("./admin-validator")

module.exports = function ({ adminRepository, accountValidator, adminValidator }) {
    const exports = {}

    exports.getSettings = function (session, callback) {
        const errors = []

        accountValidator.isEmployee(session).forEach(element => {
            errors.push(element)
        })

        if (errors.length > 0) {
            callback(errors, null)
            return
        }

        adminRepository.getSettings(callback)

    }

    exports.getContacts = function (callback) {
        adminRepository.getContacts(callback)
    }

    exports.updateSettings = function (session, settings, callback) {


        const errors = []

        accountValidator.isAdmin(session).forEach(element => {
            errors.push(element)
        })

        adminValidator.validateGeneral(settings).forEach(element => {
            errors.push(element)
        })

        if (errors.length > 0) {
            callback(errors, null)
            return
        }

        var contacts_obj_array = []

        if (Array.isArray(settings.contacts_obj_array)) {
            if(settings.contacts_obj_array[0] == undefined){
                contacts_obj_array = []
            }else{
                if(Array.isArray(settings.contacts_obj_array[0])){
                    for (var i = 0; i < settings.contacts_obj_array[0].length; i++) {
                        contacts_obj_array.push({
                            contact_index: i,
                            full_name: settings.contacts_obj_array[0][i],
                            phone_nr: settings.contacts_obj_array[1][i],
                            email_address: settings.contacts_obj_array[2][i]
                        })
                    }
                }else{
                    contacts_obj_array.push({
                        contact_index: 0,
                        full_name: settings.contacts_obj_array[0],
                        phone_nr: settings.contacts_obj_array[1],
                        email_address: settings.contacts_obj_array[2]
                    })
                }
            }
        } else {
            errors.push('internal_error')
        }

        contacts_obj_array.forEach((element)=>{
            adminValidator.validateContact(element).forEach(element => {
                errors.push(element)
            })
        })

        if (errors.length > 0) {
            callback(errors, null)
            return
        }

        console.log(contacts_obj_array, 'the new object')

        const new_settings = {
            site_title: settings.site_title,
            site_subtitle: settings.site_subtitle,
            general_contact_name: settings.general_contact_name,
            general_contact_email: settings.general_contact_email,
            opening_times: settings.opening_times,
            general_contact_phone_nr: settings.general_contact_phone_nr,
            about_content: settings.about_content,
            contacts_obj_array: contacts_obj_array,
            site_header: settings.site_header
        }

        adminRepository.updateSettings(new_settings, callback)
    }

    exports.addContact = function (session, contact_obj, callback) {

        const errors = []

        adminValidator.validateContact(contact_obj).forEach(element => {
            errors.push(element)
        })

        accountValidator.isAdmin(session).forEach(element => {
            errors.push(element)
        })
        

        if (errors.length > 0) {
            callback(errors, null)
            return
        }

        const contacts_obj_array = new Promise((resolve, reject) => {
            adminRepository.getContacts(function (error, rows) {
                if (rows) {
                    resolve(rows)
                } else {
                    reject(error)
                }
            })
        })

        contacts_obj_array.then((rows) => {
            const contacts_obj_array = []
            contact_obj.contact_index = rows.length

            rows.push(contact_obj)

            rows.forEach((element) => {
                contacts_obj_array.push(element)
            })

            adminRepository.addContact(contacts_obj_array, callback)
        }).catch((error) => {
            console.log('Did we get an error ??',error)
        })

    }

    exports.deleteContact = function (session, index, callback) {
        const errors = []

        accountValidator.isAdmin(session).forEach(element => {
            errors.push(element)
        })

        if (errors.length > 0) {
            callback(errors, null)
            return
        }

        const contacts_obj_array = new Promise((resolve, reject) => {
            adminRepository.getContacts(function (error, rows) {
                if (rows) {
                    resolve(rows)
                } else {
                    reject(error)
                }
            })
        })

        contacts_obj_array.then((rows) => {

            const new_contacts_obj_array = []

            console.log(index.contact_index)

            if (index.contact_index == undefined) {
                callback(['internal_error'], null)
                return
            }

            rows.splice(index.contact_index, 1)

            for (var i = 0; i < rows.length; i++) {
                rows[i].contact_index = i
            }

            rows.forEach((element) => {
                new_contacts_obj_array.push(element)
            })


            adminRepository.addContact(new_contacts_obj_array, callback)
        }).catch((error) => {
            console.log(error)
        })
    }

    exports.getFeedback = function (session,callback) {
        const errors = []

        accountValidator.isEmployee(session).forEach(element => {
            errors.push(element)
        })

        if (errors.length > 0) {
            callback(errors, null)
            return
        }

        adminRepository.getFeedback(callback)
    }

    exports.deleteFeedback = function (session,feedback,callback) {
        const errors = []

        accountValidator.isEmployee(session).forEach(element => {
            errors.push(element)
        })

        if (errors.length > 0) {
            callback(errors, null)
            return
        }

        adminRepository.deleteFeedback(feedback,callback)
    }




    return exports
}