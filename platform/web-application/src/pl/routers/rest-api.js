const { response, json } = require('express')
const express = require('express')
const jwt = require('jsonwebtoken');




module.exports = function ({ globals, accountManager, reservationManager }) {
    const router = express.Router()

    const values = globals.values()

    router.use('/*',function (request, response, next) {
        console.log(request.method, request.url)

        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5000")
        response.setHeader("Access-Control-Allow-Methods", "*")
        response.setHeader("Access-Control-Allow-Headers", "*")
        response.setHeader("Access-Control-Allow-Expose-Headers", "*")

        next()
    })

    router.get('/login', function (request, response) {

        response.status(200).json()
    })

    router.post('/login', function (request, response) {

        const token_data = {
            is_logged_in: false
        }

        const authorization_header = request.header('Authorization')
        if (authorization_header != null) {
            const access_token = authorization_header.substring("Bearer ".length)

            jwt.verify(access_token, values.TOKEN_SECRET, function (error, payload) {
                if (error) {
                    return
                } else {
                    token_data.is_logged_in = true
                }
            })
        }


        const login_credentials = {
            grant_type: request.body.grant_type,
            entered_username: request.body.username,
            entered_password: request.body.password
        }

        accountManager.loginUser(token_data, login_credentials, function (error, user) {
            const errors = globals.errorTranslation(error)
            if (errors.length == 0) {
                const payload = {
                    is_logged_in: true,
                    logged_in_username: user.username,
                    logged_in_user_id: user.user_id,
                    is_admin: user.admin_flag,
                    is_employee: user.employee_flag
                }
                jwt.sign(payload, values.TOKEN_SECRET, function (error, token) {
                    response.status(200).json({
                        "access_token": token
                    })
                })
            } else {
                const model = {
                    errors: errors,
                }
                console.log(model)
                response.status(400).json(model)
            }
        })

    })

    router.get('/register', function (request, response) {
        response.status(200).json()
    })

    router.post('/register', function (request, response) {
        const token_data = {
            is_logged_in: false
        }

        const authorization_header = request.header('Authorization')
        if (authorization_header != null) {
            const access_token = authorization_header.substring("Bearer ".length)

            jwt.verify(access_token, values.TOKEN_SECRET, function (error, payload) {
                if (error) {
                    return
                } else {
                    token_data.is_logged_in = true
                }
            })
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

        accountManager.createAccount(token_data, account, function (error, user) {
            const errors = globals.errorTranslation(error)
            console.log(errors, error)
            if (errors.length == 0) {
                response.status(200).json("Account created")
            } else {
                const model = {
                    errors: errors,
                }
                response.status(400).json(model)
            }
        })


    })

    router.get('/home', function (request, response) {

        const authorization_header = request.header('Authorization')
        if (authorization_header == null) {
            response.status(401).end()
            return
        }
        const access_token = authorization_header.substring("Bearer ".length)

        jwt.verify(access_token, values.TOKEN_SECRET, function (error, payload) {
            if (error) {
                console.log(error)
                response.status(401).end()
            } else {
                console.log(payload)
                response.status(200).json(payload)
            }
        })
    })

    router.post('/make-reservation', function (request, response) {

        const authorization_header = request.header('Authorization')
        if (authorization_header == null) {
            response.status(401).end()
            return
        }

        const access_token = authorization_header.substring("Bearer ".length)

        jwt.verify(access_token, values.TOKEN_SECRET, function (error, payload) {
            if (error) {
                const errors = []
                errors.push(error.name)
                response.status(401).end()
            } else {
                const reservation = {
                    user_id: payload.logged_in_user_id,
                    table_id: request.body.table_id,
                    reservation_date: request.body.reservation_date,
                    reservation_time: request.body.reservation_time
                }

                console.log(reservation)

                reservationManager.userCreateReservation(payload, reservation, function (error, result) {
                    const errors = globals.errorTranslation(error)

                    if (errors.length == 0) {
                        response.status(201).json(result)
                    } else {
                        response.status(400).json(errors)
                    }
                })
            }
        })
    })

    router.get('/my-reservations', function (request, response) {

        const authorization_header = request.header('Authorization')
        if (authorization_header == null) {
            response.status(401).end()
            return
        }
        const access_token = authorization_header.substring("Bearer ".length)

        jwt.verify(access_token, values.TOKEN_SECRET, function (error, payload) {
            if (error) {
                const errors = []
                errors.push(error.name)
                response.status(401).json(globals.errorTranslation(errors)) // SEND PROPPER ERROR READ THE OAuth spec...
            } else {
                const user = {
                    username: payload.logged_in_username,
                    user_id: payload.logged_in_user_id
                }
                reservationManager.getAllUserReservations(payload, user, function (error, rows) {
                    const errors = globals.errorTranslation(error)
                    if (errors.length == 0) {
                        const model = {
                            reservations: rows,
                        }
                        response.status(200).json(model)
                    } else {
                        response.status(400).json(errors)
                    }
                })
            }
        })
    })

    router.delete('/my-reservations/:id', function (request, response) {

        const authorization_header = request.header('Authorization')
        if (authorization_header == null) {
            response.status(401).end()
            return
        }
        const access_token = authorization_header.substring("Bearer ".length)

        jwt.verify(access_token, values.TOKEN_SECRET, function (error, payload) {
            if (error) {
                const errors = []
                errors.push(error.name)
                response.status(401).json(globals.errorTranslation(errors)) // SEND PROPPER ERROR READ THE OAuth spec...
            } else {
                const reservation = {
                    user_id: payload.logged_in_user_id,
                    reservation_id: request.params.id //FEL 
                }

                console.log(reservation)

                reservationManager.userCancelReservation(payload, reservation, function (error, reservation) {
                    const errors = globals.errorTranslation(error)

                    if (errors.length == 0) {
                        response.status(204).end()
                    } else {
                        if (error == 'resource_not_exist') {
                            response.status(404).end()
                        }
                        if (error == 'internal_error') {
                            response.status(500).json(error)
                        }
                    }
                })
            }
        })
    })

    router.get('/profile', function (request, response) {

        const authorization_header = request.header('Authorization')
        if (authorization_header == null) {
            response.status(401).end()
            return
        }
        const access_token = authorization_header.substring("Bearer ".length)

        jwt.verify(access_token, values.TOKEN_SECRET, function (error, payload) {
            if (error) {
                const errors = []
                errors.push(error.name)
                response.status(401).json(globals.errorTranslation(errors)) // SEND PROPPER ERROR READ THE OAuth spec...
            } else {
                const profile_authentication = {
                    username: payload.logged_in_username,
                    user_id: payload.logged_in_user_id
                }
                accountManager.getProfile(payload, profile_authentication, function (error, profile) {
                    const errors = globals.errorTranslation(error)

                    if (errors.length == 0) {
                        const model = {
                            profile: profile,
                        }
                        response.status(200).json(model)
                    } else {
                        response.status(400).json(errors)
                    }
                })
            }
        })
    })


    router.put('/profile', function (request, response) {
        console.log('Do we even get here ?')
        const authorization_header = request.header('Authorization')
        if (authorization_header == null) {
            response.status(401).end()
            return
        }
        const access_token = authorization_header.substring("Bearer ".length)

        
        jwt.verify(access_token, values.TOKEN_SECRET, function (error, payload) {
            if (error) {
                const errors = []
                errors.push(error.name)
                response.status(400).json(globals.errorTranslation(errors)) // SEND PROPPER ERROR READ THE OAuth spec...
            } else {
                const profile = {
                    username: payload.logged_in_username,
                    first_name: request.body.first_name,
                    last_name: request.body.last_name,
                    email_address: request.body.email_address,
                    phone_number: request.body.phone_number,
                    id: payload.logged_in_user_id
                }

                accountManager.updateProfile(payload, profile, function (error, result) {
                    const errors = globals.errorTranslation(error)
                    console.log(errors)
                    if (errors.length == 0) {
                        response.status(204).end()
                    } else {
                        const model = {
                            errors: errors,
                            profile: [profile]
                        }
                        response.status(400).json(model)
                    }
                })
            }
        })
    })

    return router
}