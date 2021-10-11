const { response } = require('express')
const express = require('express')

module.exports = function ({ accountManager, globals }) {
    const router = express.Router()

    router.all('/*', function (request, response, next) {
        request.app.locals.layout = 'admin-panel.hbs';
        next();
    })


    router.get('/panel-accounts', function (request, response) {
        const ses_data = {
            is_logged_in: request.session.is_logged_in,
            is_admin: request.session.is_admin,
            is_employee: request.session.is_employee
        }

        accountManager.getAllAccounts(ses_data, function (error, rows) {
            const errors = globals.errorTranslation(error)

            if (errors.length == 0) {
                const model = {
                    users: rows
                }
                response.render("panel-accounts.hbs", model)
            }
            else {
                const model = {
                    errors: errors,
                }
                response.render("panel-accounts.hbs", model)
            }
        })
    })

    router.post('/panel-accounts-update/:id', function (request, response) {

        const ses_data = {
            is_logged_in: request.session.is_logged_in,
            is_admin: request.session.is_admin,
            is_employee: request.session.is_employee
        }

        const account = {
            username: request.body.username,
            first_name: request.body.first_name,
            last_name: request.body.last_name,
            email_address: request.body.email_address,
            phone_number: request.body.phone_number,
            admin_flag: request.body.admin_flag,
            employee_flag: request.body.employee_flag,
            user_id: request.params.id
        }

        console.log(account)

        accountManager.updateAccount(ses_data, account, function (error) {
            const errors = globals.errorTranslation(error)
            if (errors.length == 0) {
                accountManager.getAllAccounts(ses_data, function (error, rows) {
                    const errors = globals.errorTranslation(error)

                    if (errors.length == 0) {
                        const model = {
                            success: true,
                            users: rows
                        }
                        response.render("panel-accounts.hbs", model)
                    } else {
                        const model = {
                            errors: errors,
                        }
                        response.render("panel-accounts.hbs", model)
                    }
                })
            }
            else {
                const model = {
                    errors: errors,
                    users: [account]
                }
                response.render("panel-accounts.hbs", model)
            }
        })

    })

    router.post('/panel-accounts-delete/:id', function (request, response) {
        const ses_data = {
            is_logged_in: request.session.is_logged_in,
            is_admin: request.session.is_admin,
            is_employee: request.session.is_employee
        }

        const account = {
            user_id: request.params.id
        }

        accountManager.deleteAccount(ses_data, account, function (error) {
            const errors = globals.errorTranslation(error)

            if (errors.length == 0) {
                accountManager.getAllAccounts(ses_data, function (error, rows) {
                    const errors = globals.errorTranslation(error)

                    if (errors.length == 0) {
                        const model = {
                            success: true,
                            users: rows
                        }
                        response.render("panel-accounts.hbs", model)
                    } else {
                        const model = {
                            errors: errors,
                        }
                        response.render("panel-accounts.hbs", model)
                    }
                })
            }
            else {
                const model = {
                    errors: errors,
                }
                response.render("panel-accounts.hbs", model)
            }

        })

    })

    return router
}