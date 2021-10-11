const postgresDB = require('../sequelize-dal/sequelize-pgdb')
const seq_settings = postgresDB.global_Settings
const seq_feedback = postgresDB.feedback

module.exports = function () {
    const exports = {}

    exports.getSettings = function (callback) {
        seq_feedback.findAll({
                raw: true
            })
            .then(() => {
                console.log('All settings:' + seq_settings)
                callback([], seq_settings)
            })
            .catch((errors) => {
                console.log(errors)
                callback(['internal_error'], null)
            })
    }

    exports.updateSettings = function (settings, callback) {
        seq_settings.update({
                site_title: settings.site_title,
                site_subtitle: settings.site_subtitle,
                general_contact_name: settings.general_contact_name,
                general_contact_email: settings.general_contact_email,
                opening_times: settings.opening_times,
                general_contact_phone_nr: settings.general_contact_phone_nr,
                about_content: settings.about_content,
                contacts_obj_array: JSON.stringify(settings.contacts_obj_array),
                site_header: settings.site_header
            })
            .then(() => {
                callback([], settings)
            })
            .catch((errors) => {
                callback(['internal_error'], null)
            })

    }

    exports.getContacts = function (callback) {
        seq_settings.findAll({
                raw: true,
                attributes: ['contact_obj_array']
            })
            .then(() => {
                console.log('Constacts:' + seq_settings)
                callback([], seq_settings)
            })
            .catch((errors) => {
                console.log(errors)
                callback(['internal_error'], null)
            })
    } //Osäker på denna!

    exports.addContact = function (contacts_obj_array, callback) {
        seq_settings.create({
                contacts_obj_array: JSON.stringify(settings.contacts_obj_array)
            })
            .then(() => {
                callback([], contacts_obj_array)
            })
            .catch((errors) => {
                callback(['internal_error'], null)
            })
    }

    exports.getFeedback = function (callback) {
        seq_feedback.findAll({
                raw: true
            })
            .then(() => {
                console.log('All feedback:' + seq_feedback)
                callback([], seq_feedback)
            })
            .catch((errors) => {
                console.log(errors)
                callback(['internal_error'], null)
            })
    }

    exports.deleteFeedback = function (feedback, callback) {
        seq_feedback.destroy({
                where: {
                    feedback_id: feedback.feedback_id
                }
            })
            .then(() => {
                callback(null)
            })
            .catch(() => {
                (['internal_error'], null)
            })
    }

    return exports
}