const { response, json } = require('express')
const express = require('express')

module.exports = function ({ globals, adminManager, accountManager}) {
    const router = express.Router()

    router.all('/*', function (request, response, next) {
        request.app.locals.layout = 'admin-panel.hbs';
        next();
    })

    router.get('/', function (request, response) {
        response.redirect('/panel/panel-main')
    })


    router.get('/panel-main', function (request, response) {
        console.log("-----------------------GET-------------------------")
        const ses_data = {
            is_logged_in: request.session.is_logged_in,
            is_admin: request.session.is_admin,
            is_employee: request.session.is_employee
        }

        console.log(request.body, "The Body")

        adminManager.getSettings(ses_data,function (error, rows) {
            const errors = globals.errorTranslation(error)
            if (errors.length == 0) {
                const model = {
                    settings_item: [rows]
                }
                console.log(model)
                response.render('panel-main.hbs', model)
            } else {
                const model = {
                    errors: errors
                }
                response.render('panel-main.hbs', model)
            }
        })

    })

    router.post('/panel-main-update', function (request, response) {
        console.log("-------------------------UPDATE----------------------------")

        const ses_data = {
            is_logged_in: request.session.is_logged_in,
            is_admin: request.session.is_admin,
            is_employee: request.session.is_employee
        }

        const settings = {
            site_title: request.body.site_title,
            site_subtitle: request.body.site_subtitle,
            general_contact_name: request.body.general_contact_name,
            general_contact_email: request.body.general_contact_email,
            opening_times: request.body.opening_times,
            general_contact_phone_nr: request.body.general_contact_phone_nr,
            about_content: request.body.about_content,
            contacts_obj_array: [request.body.full_name,request.body.phone_nr,request.body.email_address],
            site_header: request.body.site_header
        }

        
        adminManager.updateSettings(ses_data, settings, function (error, rows) {
            const errors = globals.errorTranslation(error)

            if (errors.length == 0) {
                adminManager.getSettings(ses_data,function (error, rows) {
                    const errors = globals.errorTranslation(error)

                    if (error.length == 0) {
                        const model = {
                            success: true,
                            settings_item: [rows]
                        }
                        response.render('panel-main.hbs', model)
                    } else {
                        const model = {
                            errors: errors,
                        }
                        response.render('panel-main.hbs', model)
                    }
                })
            } 
            else{
                const model = {
                    errors: errors,
                }
                response.render('panel-main.hbs', model)
            }
        })
    })

    router.post('/panel-main-add-contact', function (request, response) {
        console.log("-------------------------ADD CONTACT----------------------------")

        const ses_data = {
            is_logged_in: request.session.is_logged_in,
            is_admin: request.session.is_admin,
            is_employee: request.session.is_employee
        }

        const contact_obj = {
            contact_index: null,
            full_name: request.body.full_name,
            phone_nr: request.body.phone_nr,
            email_address: request.body.email_address
        }

        adminManager.addContact(ses_data, contact_obj, function (error, result) {
            const errors = globals.errorTranslation(error)
            if (errors.length == 0) {
                adminManager.getSettings(ses_data,function (error, rows) {
                    const errors = globals.errorTranslation(error)

                    if (error.length == 0) {
                        const model = {
                            success:true,
                            settings_item: [rows]
                        }
                        response.render('panel-main.hbs', model)
                    } else {
                        const model = {
                            errors: errors,
                        }
                        response.render('panel-main.hbs', model)
                    }
                })
            } 
            else{
                const model = {
                    settings_item:[],
                    errors: errors,
                    contact_obj: contact_obj
                }
                response.render('panel-main.hbs', model)
            }
        })
    })

    router.post('/panel-main-delete-contact/:id', function (request, response) {
        console.log("-------------------------DELETE CONTACT----------------------------")

        const ses_data = {
            is_logged_in: request.session.is_logged_in,
            is_admin: request.session.is_admin,
            is_employee: request.session.is_employee
        }

        const contact_obj = {
            // contact_index: request.body['contact_index']
            contact_index: request.params.id

        }

        adminManager.deleteContact(ses_data, contact_obj, function (error, result) {
            const errors = globals.errorTranslation(error)
            if (errors.length == 0) {
                adminManager.getSettings(ses_data,function (error, rows) {
                    const errors = globals.errorTranslation(error)
                    if (error.length == 0) {
                        const model = {
                            success: true,
                            settings_item: [rows]
                        }
                        console.log(rows.contacts_obj_array)
                        response.render('panel-main.hbs', model)
                    } else {
                        const model = {
                            errors: errors,
                        }
                        response.render('panel-main.hbs', model)
                    }
                })
            } 
            else{
                const model = {
                    settings_item:[],
                    errors: errors,
                }
                response.render('panel-main.hbs', model)
            }
        })
    })

    router.get('/panel-feedback', function (request, response) {
        console.log("-----------------------GET-------------------------")
        const ses_data = {
            is_logged_in: request.session.is_logged_in,
            is_admin: request.session.is_admin,
            is_employee: request.session.is_employee
        }
        adminManager.getFeedback(ses_data,function (error, rows) {
            const errors = globals.errorTranslation(error)
            console.log(rows)
            if (errors.length == 0) {
                const model = {
                    feedback: rows
                }
                console.log(model)
                response.render('panel-feedback.hbs', model)
            } else {
                const model = {
                    errors: errors
                }
                response.render('panel-feedback.hbs', model)
            }
        })

    })

    router.post('/panel-feedback-delete', function (request, response) {
        console.log("-------------------------DELETE CONTACT----------------------------")

        const ses_data = {
            is_logged_in: request.session.is_logged_in,
            is_admin: request.session.is_admin,
            is_employee: request.session.is_employee
        }

        const feedback = {
            feedback_id: request.body.feedback_id
        }

        adminManager.deleteFeedback(ses_data, feedback, function (error, result) {
            const errors = globals.errorTranslation(error)
            if (errors.length == 0) {
                adminManager.getFeedback(ses_data,function (error, rows) {
                    const errors = globals.errorTranslation(error)
                    if (error.length == 0) {
                        const model = {
                            success: true,
                            feedback: rows
                        }
                        response.render('panel-main.hbs', model)
                    } else {
                        const model = {
                            errors: errors,
                        }
                        response.render('panel-main.hbs', model)
                    }
                })
            } 
            else{
                const model = {
                    feedback: [],
                    errors: errors,
                }
                response.render('panel-main.hbs', model)
            }
        })
    })


    return router
}