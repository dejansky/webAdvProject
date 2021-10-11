const postgresDB = require('../sequelize-dal/sequelize-pgdb')
const seq_feedback = postgresDB.feedback
const seq_settings = postgresDB.global_Settings

module.exports = function () {
    const exports = {}

    exports.addFeedback = function (feedback, callback) {
        seq_feedback.create({
            full_name: feedback.full_name,
            email: feedback.email,
            message: feedback.message
        })
            .then(() => {
                callback(seq_feedback.feedback_id)
            })
            .catch(() => {
                callback(['internal_error'], null)
            })
    }

    exports.getGeneralInfo = function (callback) {
        seq_settings.findAll({
            raw: true,
            attributes: [
                "site_title",
                "site_subtitle",
                "site_header",
                "general_contact_name",
                "general_contact_email",
                "opening_times",
                "general_contact_phone_nr"
            ]
        })
            .then((seq_settings) => {
                callback([], seq_settings)
            })
            .catch(() => {
                callback(['internal_error'], null)
            })
    }

    exports.getAboutContent = function (callback) {
        seq_settings.findAll({
            raw: true,
            attributes: [
                "about_content"
            ]
        })
            .then((seq_settings) => {
                callback([], seq_settings)
            })
            .catch(() => ['internal_error'], null)
    }

    exports.getContacts = function (callback) {
        seq_settings.findAll({
            raw: true,
            attributes: [
                "contacts_obj_array"
            ]
        })
            .then((seq_settings) => {
                //kan vara fel??
                callback([], JSON.parse(seq_settings))
            })
            .catch(() => ['internal_error'], null)
    }

    return exports
}