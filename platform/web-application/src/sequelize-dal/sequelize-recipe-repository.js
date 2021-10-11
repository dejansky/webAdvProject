const postgresDB = require('../sequelize-dal/sequelize-pgdb')
const seq_recipe = postgresDB.recipe
const seq_drink = postgresDB.drink
const seq_meal = postgresDB.meal

module.exports = function () {
    const exports = {}

    exports.addDrink = function (recipe, callback) {
        seq_recipe.create({
                recipe_type: 'type_drink'
            }),
            seq_drink.create({
                recipe_name: recipe.drink_name,
                recipe_description: recipe.drink_description,
                recipe_price: recipe.drink_price
            })
            .then(() => {
                callback(null)
            })
            .catch(() => {
                callback(['internal_error'], null)
            })
    }

    exports.getDrinks = function (callback) {
        seq_drink.findAll({
                raw: true
            })
            .then(() => {
                callback([], seq_drink)
            })
            .catch(errors => {
                callback(['internal_error'], null)
            })
    }

    exports.updateDrink = function (recipe, callback) {
        seq_drink.update({
                recipe_name: recipe.drink_name,
                recipe_description: recipe.drink_description,
                recipe_price: recipe.drink_price,
            }, {
                where: {
                    recipe_id: recipe.recipe_id
                }
            })
            .then(() => {
                callback(seq_drink)
            })
            .catch(() => {
                callback(['internal_error'], null)
            })
    }

    exports.deleteDrink = function (recipe, callback) {
        seq_drink.destroy({
                where: {
                    recipe_id: recipe.recipe_id
                }
            })
            .then(() => {
                callback(null)
            })
            .catch(() => {
                callback(['internal_error'], null)
            })
    }

    //**//////////////////////////////
    //        Meals
    /////////////////////////////**//

    exports.addMeal = function (recipe, callback) {
        seq_recipe.create({
                recipe_type: 'type_meal'
            }),
            seq_meal.create({
                recipe_name: recipe.meal_name,
                recipe_description: recipe.meal_description,
                recipe_price: recipe.meal_price
            })
            .then(() => {
                callback([], recipe.recipe_id)
            })
            .catch(() => {
                callback(['internal_error'], null)
            })
    }

    exports.getMeals = function (callback) {
        seq_meal.findAll({
                raw: true
            })
            .then(() => {
                callback([], seq_meal)
            })
            .catch(errors => {
                callback(['internal_error'], null)
            })
    }

    exports.updateMeal = function (recipe, callback) {
        seq_drink.update({
                recipe_name: recipe.meal_name,
                recipe_description: recipe.meal_description,
                recipe_price: recipe.meal_name,
            }, {
                where: {
                    recipe_id: recipe.recipe_id
                }
            })
            .then(() => {
                callback(seq_meal)
            })
            .catch(() => {
                callback(['internal_error'], null)
            })
    }

    exports.deleteDrink = function (recipe, callback) {
        seq_drink.destroy({
                where: {
                    recipe_id: recipe.recipe_id
                }
            })
            .then(() => {
                callback(null)
            })
            .catch(() => {
                callback(['internal_error'], null)
            })
    }

    return exports
}