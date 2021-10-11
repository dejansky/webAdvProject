const { response } = require('express')
const express = require('express')

module.exports = function({ globals, reservationManager }) {

    const router = express.Router()

    router.get('/panel-reservations', function(request, response) {
        const ses_data = {
            is_logged_in: request.session.is_logged_in,
            is_employee: request.session.is_employee
        }
        

        reservationManager.getAllReservations(ses_data, function(error, rows) {
            const errors = globals.errorTranslation(error)
            console.log(rows)
            if(errors.length == 0){
                const model = {
                    reservations: rows,
                }
                response.render('panel-reservations.hbs', model)
            }else{
                response.redirect('/home')
            }
        })
    })


    router.post('/panel-reservation-update/:id', function (request, response) {
        const ses_data = {
            is_logged_in: request.session.is_logged_in,
            is_admin: request.session.is_admin,
            is_employee: request.session.is_employee
        }

        const reservation = {
            user_id: request.body.user_id,
            reservation_date: request.body.reservation_date,
            table_id: request.body.table_id,
            reservation_id: request.params.id
        }

        console.log(reservation)
        reservationManager.updateReservation(ses_data, reservation, function (error) {
            const errors = globals.errorTranslation(error)

            if (errors.length == 0) {
                reservationManager.getAllReservations(ses_data, function (error, rows) {
                    const errors = globals.errorTranslation(error)

                    if (errors.length == 0) {
                        const model = {
                            success: true,
                            reservations: rows
                        }
                        response.render("panel-reservations.hbs", model)
                    } else {
                        const model = {
                            errors: errors,
                        }
                        response.render("panel-reservations.hbs", model)
                    }
                })
            }
            else {
                const model = {
                    errors: errors,
                }
                response.render("panel-reservations.hbs", model)
            }

        })

    })

    router.post('/panel-reservation-delete/:id', function (request, response) {
        const ses_data = {
            is_logged_in: request.session.is_logged_in,
            is_admin: request.session.is_admin,
            is_employee: request.session.is_employee
        }

        const reservation = {
            user_id: request.body.user_id,
            reservation_id: request.params.id
        }

        reservationManager.deleteReservation(ses_data, reservation, function (error) {
            const errors = globals.errorTranslation(error)

            if (errors.length == 0) {
                reservationManager.getAllReservations(ses_data, function (error, rows) {
                    const errors = globals.errorTranslation(error)

                    if (errors.length == 0) {
                        const model = {
                            success: true,
                            reservations: rows
                        }
                        response.render("panel-reservations.hbs", model)
                    } else {
                        const model = {
                            errors: errors,
                        }
                        response.render("panel-reservations.hbs", model)
                    }
                })
            }
            else {
                const model = {
                    errors: errors,
                }
                response.render("panel-reservations.hbs", model)
            }

        })

    })

    return router
}