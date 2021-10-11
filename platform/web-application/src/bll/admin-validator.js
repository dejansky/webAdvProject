//

module.exports = function ({
    globals
}) {
    const exports = {}

    const values = globals.values()

    exports.validateContact = function(contact) {
        const error = []
        const regx = /^[a-zA-Z]([-']?[a-zA-Z]+)*( [a-zA-Z]([-']?[a-zA-Z]+)*)+$/
        const regex_email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        console.log(contact)

        if (contact.full_name.length > values.MAX_NAME_LENGTH || contact.full_name.length < values.MIN_NAME_LENGTH ) {
            error.push('fist_name_last_name_invalid')
        }

        if (!regx.test(contact.full_name)) {
            error.push('fist_name_last_name_nac')
        }
        
        if (!regex_email.test(contact.email_address)) {
            error.push('correction_of_email_address')
        }

        if (!contact.email_address.includes('@') || (!contact.email_address.includes('.com') && !contact.email_address.includes('.se'))) {
            error.push('correction_of_email_address')
        }
        
        console.log(contact.phone_nr)

        if (isNaN(contact.phone_nr)) {
            error.push('phone_number_nan')
        } 
        return error
    }

    exports.validateGeneral = function(settings) {
        const error = []
        const regx = /^[a-zA-Z]([-']?[a-zA-Z]+)*( [a-zA-Z]([-']?[a-zA-Z]+)*)+$/
        const regex_email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/


        if (settings.general_contact_name.length > values.MAX_NAME_LENGTH || settings.general_contact_name.length < values.MIN_NAME_LENGTH ) {
            error.push('fist_name_last_name_invalid')
        }

        if (!regx.test(settings.general_contact_name)) {
            error.push('fist_name_last_name_nac')
        }
        
        if (!regex_email.test(settings.general_contact_email)) {
            error.push('correction_of_email_address')
        }

        if (!settings.general_contact_email.includes('@') || (!settings.general_contact_email.includes('.com') && !settings.general_contact_email.includes('.se'))) {
            error.push('correction_of_email_address')
        }

        if (isNaN(settings.general_contact_phone_nr)) {
            error.push('phone_number_nan')
        } 
        return error
    }

    return exports
}