//

module.exports = function ({
    globals
}) {
    const exports = {}

    const values = globals.values()

    exports.validateRecipeDrink = function(recipe) {
        const error = []
    
        if (recipe.drink_name.length > values.MAX_NAME_LENGTH || recipe.drink_name.length < values.MIN_NAME_LENGTH ) {
            error.push('recipe_name_length_invalid')
        }

        if (recipe.drink_description.length > values.MAX_MESSAGE_LENGTH || recipe.drink_description.length < values.MIN_MESSAGE_LENGTH ) {
            error.push('recipe_description_length_invalid')
        }

        if (isNaN(recipe.drink_price)) {
            error.push('price_nan')
        }

        if (parseInt(recipe.drink_price) < 0) {
            error.push('price_invalid')
        } 
        return error
    }

    exports.validateRecipeMeal = function(recipe) {
        const error = []
    
        if (recipe.meal_name.length > values.MAX_NAME_LENGTH || recipe.meal_name.length < values.MIN_NAME_LENGTH ) {
            error.push('recipe_name_length_invalid')
        }

        if (recipe.meal_description.length > values.MAX_MESSAGE_LENGTH || recipe.meal_description.length < values.MIN_MESSAGE_LENGTH ) {
            error.push('recipe_description_length_invalid')
        }

        if (isNaN(recipe.meal_price)) {
            error.push('price_nan')
        }

        if (parseInt(recipe.meal_price) < 0) {
            error.push('price_invalid')
        } 
        return error
    }

    return exports
}