const { request, response } = require('express')
const expess = require('express')

module.exports = function ({ recipeManager, globals, accountManager }) {

    const router = expess.Router()


    router.get('/panel-recipe-drinks', function (request, response) {
        const ses_data = {
            is_logged_in: request.session.is_logged_in,
            is_admin: request.session.is_admin,
            is_employee: request.session.is_employee
        }

        accountManager.isEmployee(ses_data, function (error) {
            const errors = globals.errorTranslation(error)

            if (errors.length == 0) {
                recipeManager.getDrinks(function (error, rows) {
                    const errors = globals.errorTranslation(error)
                    if (errors.length == 0) {
                        const model = {
                            errors: errors,
                            recipes: rows
                        }
                        console.log(model, "From ROUTER")
                        response.render('panel-drinks.hbs', model)
                    } else {
                        const model = {
                            errors: errors
                        }
                        console.log(model, "From ROUTER")
                        response.render('panel-drinks.hbs', model)
                    }
                })
            } 
            else{
                request.app.locals.layout = 'main.hbs';
                const model = {
                    errors: errors
                }
                response.render('authorization.hbs', model)
            }
        })

    })

    router.post('/create-recipe-drink', function (request, response) {
        const ses_data = {
            is_logged_in: request.session.is_logged_in,
            is_admin: request.session.is_admin,
            is_employee: request.session.is_employee
        }

        const recipe = {
            drink_name: request.body.drink_name,
            drink_description: request.body.drink_description,
            drink_price: request.body.drink_price
        }

        recipeManager.addDrink(ses_data, recipe, function (error, result) {
            console.log('--------------------- ADD DRINK ----------------')
            console.log(error)
            const errors = globals.errorTranslation(error)

            if (errors.length == 0) {
                recipeManager.getDrinks(function (error, rows) {
                    const errors = globals.errorTranslation(error)

                    if (error.length == 0) {
                        const model = {
                            success:true,
                            recipes: rows
                        }
                        response.render('panel-drinks.hbs', model)
                    } else {
                        const model = {
                            errors: errors,
                            recipe: recipe
                        }
                        response.render('panel-drinks.hbs', model)
                    }
                })

            } 
            else{
                const model = {
                    errors: errors,
                    recipe: recipe
                }
                response.render('panel-drinks.hbs', model)
            }
        })
    })

    router.post('/update-recipe-drink/:id', function (request, response) {
        const ses_data = {
            is_logged_in: request.session.is_logged_in,
            is_admin: request.session.is_admin,
            is_employee: request.session.is_employee
        }

        const recipe = {
            drink_id: request.params.id,
            drink_name: request.body.drink_name,
            drink_description: request.body.drink_description,
            drink_price: request.body.drink_price
        }

        recipeManager.updateDrink(ses_data, recipe, function (error, row) {
            const errors = globals.errorTranslation(error)

            if (errors.length == 0) {
                recipeManager.getDrinks(function (error, rows) {
                    const errors = globals.errorTranslation(error)
                    if (error.length == 0) {
                        const model = {
                            success: true,
                            recipes: rows
                        }
                        response.render('panel-drinks.hbs', model)
                    } else {
                        const model = {
                            errors: errors,
                            recipe: recipe
                        }
                        response.render('panel-drinks.hbs', model)
                    }
                })

            } 
            else{
                const model = {
                    errors: errors,
                    recipe: recipe
                }
                response.render('panel-drinks.hbs', model)
            }
        })
    })

    router.post('/delete-recipe-drink/:id', function (request, response) {
        const ses_data = {
            is_logged_in: request.session.is_logged_in,
            is_admin: request.session.is_admin,
            is_employee: request.session.is_employee
        }

        const recipe = {
            drink_id: request.params.id,
        }

        recipeManager.deleteDrink(ses_data, recipe, function (error, row) {
            const errors = globals.errorTranslation(error)

            if (errors.length == 0) {
                recipeManager.getDrinks(function (error, rows) {
                    const errors = globals.errorTranslation(error)

                    if (error.length == 0) {
                        const model = {
                            success: true,
                            recipes: rows
                        }
                        response.render('panel-drinks.hbs', model)
                    } else {
                        const model = {
                            errors: errors,
                            recipe: recipe
                        }
                        response.render('panel-drinks.hbs', model)
                    }
                })

            } 
            else{
                const model = {
                    errors: errors,
                    recipe: recipe
                }
                response.render('panel-drinks.hbs', model)
            }
        })
    })


    router.get('/panel-recipe-meals', function (request, response) {
        const ses_data = {
            is_logged_in: request.session.is_logged_in,
            is_admin: request.session.is_admin,
            is_employee: request.session.is_employee
        }

        accountManager.isEmployee(ses_data, function (error) {
            const errors = globals.errorTranslation(error)

            if (errors.length == 0) {
                recipeManager.getMeals(function (error, rows) {
                    const errors = globals.errorTranslation(error)
                    if (errors.length == 0) {
                        const model = {
                            errors: errors,
                            recipes: rows
                        }
                        console.log(model, "From ROUTER")
                        response.render('panel-meals.hbs', model)
                    } else {
                        const model = {
                            errors: errors
                        }
                        console.log(model, "From ROUTER")
                        response.render('panel-meals.hbs', model)
                    }
                })
            } 
            else{
                request.app.locals.layout = 'main.hbs';
                const model = {
                    errors: errors
                }
                response.render('authorization.hbs', model)
            }
        })

    })

    router.post('/create-recipe-meal', function (request, response) {
        const ses_data = {
            is_logged_in: request.session.is_logged_in,
            is_admin: request.session.is_admin,
            is_employee: request.session.is_employee
        }

        const recipe = {
            meal_name: request.body.meal_name,
            meal_description: request.body.meal_description,
            meal_price: request.body.meal_price
        }

        recipeManager.addMeal(ses_data, recipe, function (error, row) {
            const errors = globals.errorTranslation(error)

            if (errors.length == 0) {
                recipeManager.getMeals(function (error, rows) {
                    const errors = globals.errorTranslation(error)

                    if (error.length == 0) {
                        const model = {
                            success: true,
                            recipes: rows
                        }
                        response.render('panel-meals.hbs', model)
                    } else {
                        const model = {
                            errors: errors,
                            recipe: recipe
                        }
                        response.render('panel-meals.hbs', model)
                    }
                })

            } 
            else{
                const model = {
                    errors: errors,
                    recipe: recipe
                }
                response.render('panel-meals.hbs', model)
            }
        })
    })

    router.post('/update-recipe-meal/:id', function (request, response) {
        const ses_data = {
            is_logged_in: request.session.is_logged_in,
            is_admin: request.session.is_admin,
            is_employee: request.session.is_employee
        }

        const recipe = {
            meal_id: request.params.id,
            meal_name: request.body.meal_name,
            meal_description: request.body.meal_description,
            meal_price: request.body.meal_price
        }

        recipeManager.updateMeal(ses_data, recipe, function (error, row) {
            const errors = globals.errorTranslation(error)

            if (errors.length == 0) {
                recipeManager.getMeals(function (error, rows) {
                    const errors = globals.errorTranslation(error)

                    if (error.length == 0) {
                        const model = {
                            success: true,
                            recipes: rows
                        }
                        response.render('panel-meals.hbs', model)
                    } else {
                        const model = {
                            errors: errors,
                            recipe: recipe
                        }
                        response.render('panel-meals.hbs', model)
                    }
                })

            } 
            else{
                const model = {
                    errors: errors,
                    recipe: recipe
                }
                response.render('panel-meals.hbs', model)
            }
        })
    })

    router.post('/delete-recipe-meal/:id', function (request, response) {
        const ses_data = {
            is_logged_in: request.session.is_logged_in,
            is_admin: request.session.is_admin,
            is_employee: request.session.is_employee
        }

        const recipe = {
            meal_id: request.params.id,
        }

        recipeManager.deleteMeal(ses_data, recipe, function (error, row) {
            const errors = globals.errorTranslation(error)

            if (errors.length == 0) {
                recipeManager.getMeals(function (error, rows) {
                    const errors = globals.errorTranslation(error)

                    if (error.length == 0) {
                        const model = {
                            success: true,
                            recipes: rows
                        }
                        response.render('panel-meals.hbs', model)
                    } else {
                        const model = {
                            errors: errors,
                        }
                        response.render('panel-meals.hbs', model)
                    }
                })
            } 
            else{
                const model = {
                    errors: errors,
                    recipe: recipe
                }
                response.render('panel-meals.hbs', model)
            }
        })
    })

    return router

}