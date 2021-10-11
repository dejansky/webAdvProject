//User postgres for this repository
const db = require('./db')
/**TODOO */

module.exports = function () {
    const exports = {}

    exports.addDrink = function (recipe, callback) {

        const query = `INSERT INTO recipes(recipe_type)
        VALUES (?)`
        const values = [
            'type_drink'
        ]

        db.query(query, values, function (error, id) {
            if (error) {
                callback(['internal_error'], null)
            } else {
                const query = `INSERT INTO drink(recipe_id, recipe_name, recipe_description, recipe_price)
                VALUES (last_insert_id(),?,?,?)`

                const values = [
                    recipe.drink_name,
                    recipe.drink_description,
                    recipe.drink_price
                ]

                console.log(values)

                db.query(query, values, function (error, row) {
                    if (error) {
                        console.log(error)
                        callback(['internal_error'], null)
                    } else {
                        callback([], row)
                    }
                })
            }
        })
    }

    exports.getDrinks = function (callback) {


        const query = `SELECT * FROM drink
        LEFT JOIN recipes ON drink.recipe_id = recipes.recipe_id
        WHERE recipes.recipe_type = ?`

        const values = [
            'type_drink',
        ]

        db.query(query, values, function (erorr, rows) {
            if (erorr) {
                console.log(erorr)
                callback(['internal_error'], null)
            } else {
                callback([], rows)
            }
        })
    }

    exports.updateDrink = function (recipe, callback) {
        //Optional query is to use UPDATE drink USING recipes WHERE drink.recipe_id = $1 AND recipes.recipe_id = $1
        //Results in shorter code, but complicates if one would like to Update the recipes table aswell



        const query = `UPDATE drink
                SET 
                recipe_name = ?,
                recipe_description = ?,
                recipe_price = ?
                WHERE 
                recipe_id = ?
                `
        const values = [
            recipe.drink_name,
            recipe.drink_description,
            recipe.drink_price,
            recipe.drink_id,
        ]
        console.log(values)

        db.query(query, values, function (error, rows) {
            if (error) {
                console.log(error)
                callback(['internal_error'], null)
            } else {
                callback([], rows)
            }
        })

    }

    exports.deleteDrink = function (recipe, callback) {
        const query = `DELETE FROM recipes
        WHERE 
        recipe_id = ? AND recipe_type = ?`

        const values = [
            recipe.drink_id,
            'type_drink'
        ]

        db.query(query, values, function (error, rows) {
            if (error) {
                console.log(error)
                callback(['internal_error'], null)
            } else {
                callback([], rows)
            }
        })
    }


    exports.addMeal = function (recipe, callback) {
        const query = `INSERT INTO recipes(recipe_type)
        VALUES (?)`
        const values = [
            'type_meal'
        ]

        db.query(query, values, function (error, id) {
            if (error) {
                callback(['internal_error'], null)
            } else {
                const query = `INSERT INTO meal(recipe_id, recipe_name, recipe_description, recipe_price)
                VALUES (last_insert_id(),?,?,?)`

                const values = [
                    recipe.meal_name,
                    recipe.meal_description,
                    recipe.meal_price
                ]

                console.log(values)

                db.query(query, values, function (error, rows) {
                    if (error) {
                        console.log(error)
                        callback(['internal_error'], null)
                    } else {
                        callback([], rows)
                    }
                })
            }
        })

    }

    exports.getMeals = function (callback) {

        const query = `SELECT * FROM meal
        LEFT JOIN recipes ON meal.recipe_id = recipes.recipe_id
        WHERE recipes.recipe_type = ?`


        const values = [
            'type_meal',
        ]

        db.query(query, values, function (erorr, rows) {
            if (erorr) {
                console.log(erorr)
                callback(['internal_error'], null)
            } else {
                callback([], rows)
            }
        })
    }

    exports.updateMeal = function (recipe, callback) {

        const query = `UPDATE meal
                SET 
                recipe_name = ?,
                recipe_description = ?,
                recipe_price = ?
                WHERE 
                recipe_id = ?
                `
        const values = [
            recipe.meal_name,
            recipe.meal_description,
            recipe.meal_price,
            recipe.meal_id
        ]

        db.query(query, values, function (error,rows) {
            if (error) {
                console.log(error)
                callback(['internal_error'], null)
            } else {
                callback([], rows)
            }
        })
    }

    exports.deleteMeal = function (recipe, callback) {
        const query = `DELETE FROM recipes
        WHERE 
        recipe_id = ? AND recipe_type = ?`

        const values = [
            recipe.meal_id,
            'type_meal'
        ]

        db.query(query, values, function (error, rows) {
            if (error) {
                console.log(error)
                callback(['internal_error'], null)
            } else {
                callback([], rows)
            }
        })
    }

    return exports
}