const { response } = require('express')
const express = require('express')


module.exports = function ({ globals, accountManager, reservationManager }) {
    const router = express.Router()

    const values = globals.values()

    router.get('/mypage', function (request, response) {

        response.redirect('reservations')
    })
    /**TODO  */
    router.get('/reservations', function (request, response) {
        request.app.locals.layout = 'user-mypage.hbs';
        const ses_data = {
            is_logged_in: request.session.is_logged_in
        }
        const user = { 
            username: request.session.logged_in_username,
            user_id: request.session.logged_in_user_id
        }
        reservationManager.getAllUserReservations(ses_data, user, function(error, rows) {
            const errors = globals.errorTranslation(error)
            console.log(rows)
            if(errors.length == 0){
                const model = {
                    reservations: rows,
                }
                response.render('user-reservations.hbs', model)
            }else{
                console.log(error)
                response.redirect('/home')
            }
        })        
    })

    router.post('/cancel-reservation/:id', function(request, response) {
        request.app.locals.layout = 'user-mypage.hbs';
        const ses_data = {
            is_logged_in: request.session.is_logged_in,
        }

        const reservation = {
            user_id: request.session.logged_in_user_id,
            reservation_id: request.params.id
        }

        console.log(reservation)

        reservationManager.userCancelReservation(ses_data, reservation, function(error, reservation) {
            const errors = globals.errorTranslation(error)
            
            if(errors.length == 0){
                const model = {
                    success: true,
                }
                response.render('user-reservations.hbs', model)
            }else{
                const model = {
                    errors: errors,
                }
                response.render('user-reservations.hbs', model)
            }
        })
    })

    

    router.get('/profile', function (request, response) {
        const ses_data = {
            is_logged_in: request.session.is_logged_in,
        }
        request.app.locals.layout = 'user-mypage.hbs';

        const profile_authentication = {
            username: request.session.logged_in_username,
            user_id: request.session.logged_in_user_id
        }

        accountManager.getProfile(ses_data,profile_authentication, function (error, profile) {
            const errors = globals.errorTranslation(error)

            if (errors.length == 0) {
                const model = {
                    profile: profile,
                }
                console.log(model)
                response.render("user-profile.hbs", model)
            } else {
                request.app.locals.layout = 'main.hbs';
                const model = {
                    errors: errors
                }
                response.render('authorization.hbs', model)
            }
        })

    })

    router.post('/update-profile', function (request, response) {
        request.app.locals.layout = 'user-mypage.hbs';
        const ses_data = {
            is_logged_in: request.session.is_logged_in,
        }
        
        const profile = {
            username: request.session.logged_in_username,
            first_name: request.body.first_name,
            last_name: request.body.last_name,
            email_address: request.body.email_address,
            phone_number: request.body.phone_number,
            id: request.session.logged_in_user_id
        }

        accountManager.updateProfile(ses_data ,profile, function (error, result) {
            const errors = globals.errorTranslation(error)
            console.log(errors)
            if (errors.length == 0) {
                const model = {
                    success:true
                }
                response.render("user-profile.hbs", model)
            } else {
                const model = {
                    errors: errors,
                    profile: [profile]
                }
                response.render("user-profile.hbs", model)
            }
        })
    })

    router.get('/reserve', function (request, response) {
        
        const model ={
            min_date: globals.todaysDate(),
            min_time: values.OPENING_TIME,
            max_time: values.CLOSING_TIME
        }
        console.log(model)
        response.render("reserve.hbs", model)
    })

    router.post('/make-reservation', function(request, response) {

        const ses_data = {
            is_logged_in: request.session.is_logged_in,
        }

        const reservation = {
            user_id: request.session.logged_in_user_id,
            table_id: request.body.table_id,
            reservation_date: request.body.reservation_date,
            reservation_time: request.body.reservation_time
        }

        console.log(reservation)

        reservationManager.userCreateReservation(ses_data, reservation, function(error, result) {
            const errors = globals.errorTranslation(error)
            
            if(errors.length == 0){
                const model = {
                    success: true,
                    min_date: globals.todaysDate(),
                    min_time: values.OPENING_TIME,
                    max_time: values.CLOSING_TIME
                }
                response.render("reserve.hbs", model)
            }else{
                const model = {
                    errors: errors,
                    reservation: reservation,
                    min_date: globals.todaysDate()
                }
                response.render("reserve.hbs", model)
            }
        })
    })

    router.get('/login', function (request, response) {
        const ses_data = {
            is_logged_in: request.session.is_logged_in
        }
        accountManager.isLoggedOut(ses_data, function (error) {
            const errors = globals.errorTranslation(error)

            if(errors.length == 0){
                response.render('login.hbs')
            }else{
                const model = {
                    errors: errors
                }
                response.render('authorization.hbs', model)
            }
        })
    })

    router.post('/login', function (request, response) {
        const ses_data = {
            is_logged_in: request.session.is_logged_in,
        }

        const login_credentials = {
            entered_username: request.body.entered_username,
            entered_password: request.body.entered_password
        }

        accountManager.loginUser(ses_data, login_credentials, function (error, user) {
            const errors = globals.errorTranslation(error)

            if (errors.length == 0) {
                request.session.is_logged_in = true
                request.session.logged_in_username = user.username
                request.session.logged_in_user_id = user.user_id
                request.session.is_admin = user.admin_flag 
                request.session.is_employee = user.employee_flag
                
                if (request.session.is_admin == true || request.session.is_employee == true) {
                    response.redirect('/panel/')
                    return
                }
                response.redirect('/mypage')
            } else {
                const model = {
                    errors: errors,
                }
                console.log(model)
                response.render("login.hbs", model)
            }
        })

    })

    router.post('/logout', function (request, response) {
        const ses_data = {
            is_logged_in: request.session.is_logged_in,
        }

        accountManager.isLoggedIn(ses_data, function (error) {
            const errors = globals.errorTranslation(error)

            if(errors.length == 0){
                request.session.destroy()
                response.redirect('/home')
            }else{
                request.app.locals.layout = 'main.hbs';
                const model = {
                    errors: errors
                }
                response.render('authorization.hbs', model)
            }
        })
    })

    router.get('/register', function (request, response) {
        const ses_data = {
            is_logged_in: request.session.is_logged_in,
        }

        accountManager.isLoggedOut(ses_data, function (error) {
            const errors = globals.errorTranslation(error)

            if(errors.length == 0){
                response.render("register.hbs")
            }else{
                const model = {
                    errors: errors
                }
                response.render('authorization.hbs', model)
            }
        })

        
    })

    router.post('/register', function (request, response) {

        const ses_data = {
            is_logged_in: request.session.is_logged_in
        }

        const account = {
            username: request.body.username,
            password: request.body.password,
            password_confirmation: request.body.password_confirmation,
            first_name: request.body.first_name,
            last_name: request.body.last_name,
            phone_number: request.body.phone_number,
            email_address: request.body.email_address,
        }

        accountManager.createAccount(ses_data ,account, function (error, account) {
            const errors = globals.errorTranslation(error)
            console.log(errors, error)
            if (errors.length == 0) {
                const model = {
                    success:true
                }
                response.render("register.hbs", model)
                
            } else {
                const model = {
                    errors: errors,
                    username: request.body.username,
                    password: request.body.password,
                    password_confirmation: request.body.password_confirmation,
                    first_name: request.body.first_name,
                    last_name: request.body.last_name,
                    phone_number: request.body.phone_number,
                    email_address: request.body.email_address,
                }
                response.render("register.hbs", model)
            }
        })

    })


    return router
}