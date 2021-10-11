const { response } = require('express')
const express = require('express')

module.exports = function({ globals, variousManager, recipeManager }) {
    const router = express.Router()

    router.get('/', function(request, response) {
        response.redirect("/home")
    })

    router.get('/home', function(request, response) {
        
        const meals = new Promise((resolve, reject)=>{
            recipeManager.getMeals(function (error, rows) {
                if(rows){
                
                    resolve(rows)
                }else{
                    resolve(error)
                }
            })
        })

        const drinks = new Promise((resolve, reject) =>{
            recipeManager.getDrinks(function (error, rows) {
                if(rows){
                    
                    resolve(rows)
                }else{
                    reject(error)
                }
            })
        })

        Promise.all([meals, drinks]).then((rows)=>{
            
            const model = {
                meals: rows[0],
                drinks: rows[1]
            }
            response.render("home.hbs", model)
        }).catch((error)=>{
            console.log(error, 'error ? ')
            response.render("home.hbs")
        })

    })
    router.get('/about', function(request, response) {
        variousManager.getAboutContent(function (error, content) {
            const errors = globals.errorTranslation(error)
            if(errors.length == 0){
                console.log(content)
                const model = {
                    content:content.about_content
                }
                response.render("about.hbs", model)
            }else{

            }
        })
        
    })

    router.get('/contact', function (request, response) {
        variousManager.getContacts(function (error, rows) {
            const errors = globals.errorTranslation(error)
            console.log(rows)
            if(errors.length == 0){
                const model = {
                    contacts_obj_array: rows
                }
                response.render("contact.hbs", model)
            }else{
                const model = {
                    errors: errors
                }
                response.render("contact.hbs", model)
            }
        })
    })

    router.post('/add-feedback', function (request, response) {

        const feedback = {
            full_name: request.body.full_name,
            email_address: request.body.email_address,
            message: request.body.message
        }
        
        variousManager.addFeedback(feedback, function (error) {
            const errors = globals.errorTranslation(error)
            console.log(error)
            if(errors.length == 0){
                const model = { 
                    success: true,
                }
                response.render("contact.hbs", model)
            }else{
                const model = { 
                    errors: errors,
                    feedback: feedback
                }
                response.render("contact.hbs", model)
            }
        })

    })




    return router
}