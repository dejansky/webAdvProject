const accountValidator = require("./account-validator")

module.exports = function ({variousRepository, accountValidator}) {
    const exports = {}

    exports.addFeedback = function (feedback, callback) {

        const errors = []

        accountValidator.validateFeedback(feedback).forEach(element => {
            errors.push(element)
        })

        if (errors.length > 0) {
            callback(errors, null)
            return
        }

        variousRepository.addFeedback(feedback, callback)
    }

    exports.getGeneralInfo = function (callback) {
        variousRepository.getGeneralInfo(callback)
    }

    exports.getAboutContent = function (callback) {
        variousRepository.getAboutContent(callback)
    }

    exports.getContacts = function (callback) {
        variousRepository.getContacts(callback)
    }
    
    return exports
}