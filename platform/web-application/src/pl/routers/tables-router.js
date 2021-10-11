const { request, response } = require('express')
const expess = require('express')

module.exports = function({tableManager, globals, accountManager}) {

    const router = expess.Router()


    router.post('/create-table', function(request, response) {
        const ses_data = {
            is_logged_in: request.session.is_logged_in,
            is_admin: request.session.is_admin,
            is_employee: request.session.is_employee
        }

        const table = {
            table_id: request.body.table_id,
            table_seats: request.body.table_seats
        }

        tableManager.createTable(ses_data, table, function (error, result) {
            console.log('--------------------- ADD DRINK ----------------')
            const errors = globals.errorTranslation(error)
            if (errors.length == 0) {
                tableManager.getTables(function (error, rows) {
                    const errors = globals.errorTranslation(error)

                    if (error.length == 0) {
                        const model = {
                            success: true,
                            tables: rows
                        }
                        response.render("panel-tables.hbs", model)
                    } else {
                        const model = {
                            errors: errors,
                            table: table
                        }
                        response.render("panel-tables.hbs", model)
                    }
                })
            } 
            else{
                const model = {
                    errors: errors,
                    table: table
                }
                response.render("panel-tables.hbs", model)
            }
        })
    })

    router.get('/panel-tables', function(request, response) {
        const ses_data = {
            is_logged_in: request.session.is_logged_in,
            is_admin: request.session.is_admin,
            is_employee: request.session.is_employee
        }

        accountManager.isEmployee(ses_data, function (error) {
            const errors = globals.errorTranslation(error)

            if (errors.length == 0) {
                tableManager.getTables(function (error, rows) {
                    const errors = globals.errorTranslation(error)
                    if (errors.length == 0) {
                        const model = {
                            errors: errors,
                            tables: rows
                        }
                        response.render("panel-tables.hbs",model)
                    } else {
                        const model = {
                            errors: errors
                        }
                        response.render("panel-tables.hbs",model)
                    }
                })
            } 
            else{
                const model = {
                    errors: errors
                }
                response.render("panel-tables.hbs",model)
            }
        })
    })

    router.post('/update-table/:id', function(request, response) {
        const ses_data = {
            is_logged_in: request.session.is_logged_in,
            is_admin: request.session.is_admin,
            is_employee: request.session.is_employee
        }

        const table = {
            table_id: request.params.id,
            table_seats: request.body.table_seats
        }
        
        tableManager.updateTable(ses_data, table, function (error, result) {
            const errors = globals.errorTranslation(error)
            if (errors.length == 0) {
                tableManager.getTables(function (error, rows) {
                    const errors = globals.errorTranslation(error)

                    if (error.length == 0) {
                        const model = {
                            success: true,
                            tables: rows
                        }
                        response.render("panel-tables.hbs", model)
                    } else {
                        const model = {
                            errors: errors,
                            table: table
                        }
                        response.render("panel-tables.hbs", model)
                    }
                })
            } 
            else{
                const model = {
                    errors: errors,
                    table: table
                }
                response.render("panel-tables.hbs", model)
            }

        })
    })

    router.post('/delete-table/:id', function(request, response) {
        const ses_data = {
            is_logged_in: request.session.is_logged_in,
            is_admin: request.session.is_admin,
            is_employee: request.session.is_employee
        }

        const table = {
            table_id: request.params.id,
        }
        
        tableManager.deleteTable(ses_data, table, function (error, result) {
            const errors = globals.errorTranslation(error)

            if (errors.length == 0) {
                tableManager.getTables(function (error, rows) {
                    const errors = globals.errorTranslation(error)

                    if (error.length == 0) {
                        const model = {
                            success: true,
                            tables: rows
                        }
                        response.render("panel-tables.hbs", model)
                    } else {
                        const model = {
                            errors: errors,
                            table: [table]
                        }
                        response.render("panel-tables.hbs", model)
                    }
                })
            } 
            else{
                const model = {
                    errors: errors,
                    table: [table]
                }
                response.render("panel-tables.hbs", model)
            }

        })
    })

    return router

}