//

module.exports = function({recipeRepository,recipeValidator, accountValidator}) {
    const exports = {}

    exports.addDrink = function(session, recipe, callback){
        const errors = []

        accountValidator.isEmployee(session).forEach(element => {
            errors.push(element)
        })

        recipeValidator.validateRecipeDrink(recipe).forEach(element => {
            errors.push(element)
        })

        if (errors.length > 0) {
            callback(errors, null)
            return
        }

        recipeRepository.addDrink(recipe, callback)
    }

    exports.getDrinks = function(callback) {
        recipeRepository.getDrinks(callback)
    }

    exports.updateDrink = function(session, recipe,callback) {
        const errors = []

        accountValidator.isEmployee(session).forEach(element => {
            errors.push(element)
        })

        recipeValidator.validateRecipeDrink(recipe).forEach(element => {
            errors.push(element)
        })

        if (errors.length > 0) {
            callback(errors, null)
            return
        }

        recipeRepository.updateDrink(recipe,callback)
    }

    exports.deleteDrink = function(session, recipe,callback) {
        const errors = []

        accountValidator.isEmployee(session).forEach(element => {
            errors.push(element)
        })

        if (errors.length > 0) {
            callback(errors, null)
            return
        }
        recipeRepository.deleteDrink(recipe,callback)
    }

    exports.getMeals = function(callback) {
        recipeRepository.getMeals(callback)
    }

    exports.addMeal = function(session, recipe, callback){
        const errors = []

        accountValidator.isEmployee(session).forEach(element => {
            errors.push(element)
        })

        recipeValidator.validateRecipeMeal(recipe).forEach(element => {
            errors.push(element)
        })

        if (errors.length > 0) {
            callback(errors, null)
            return
        }
        
        recipeRepository.addMeal(recipe, callback)
    }

    exports.updateMeal = function(session,recipe,callback) {
        const errors = []

        accountValidator.isEmployee(session).forEach(element => {
            errors.push(element)
        })

        recipeValidator.validateRecipeMeal(recipe).forEach(element => {
            errors.push(element)
        })

        if (errors.length > 0) {
            callback(errors, null)
            return
        }
        recipeRepository.updateMeal(recipe,callback)
    }
    
    exports.deleteMeal = function(session, recipe,callback) {
        const errors = []

        accountValidator.isEmployee(session).forEach(element => {
            errors.push(element)
        })

        if (errors.length > 0) {
            callback(errors, null)
            return
        }
        recipeRepository.deleteMeal(recipe,callback)
    }

    return exports
}