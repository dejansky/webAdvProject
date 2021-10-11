const {
    query
} = require('express')
const db = require('./db')

module.exports = function () {
    const exports = {}


    //Admin
    exports.getAllReservations = function (callback) {
        const query = `SELECT * FROM reservations LEFT JOIN (users,tables)
        ON (users.user_id = reservations.user_id AND tables.table_id = reservations.table_id)
        ORDER BY reservations.reservation_id DESC` //Denna måste vi skapa först
        const values = []

        db.query(query, values, function (error, rows) {
            if (error) {
                console.log(error)
                callback(['Internal Error'], null)
            } else {
                callback([], rows)
            }
        })
    }

    exports.updateReservation = function (reservation, callback) {
        const query = `UPDATE reservations 
        SET 
            reservation_date = ?, 
            table_id = ?
        WHERE 
            user_id = ? AND reservation_id = ?`
        //Fyra om användarnamn ska med
        const values = [
            reservation.reservation_date,
            reservation.table_id,
            parseInt(reservation.user_id),
            parseInt(reservation.reservation_id)
        ]

        db.query(query, values, function (error, rows) {
            if (error) {
                console.log(error)
                callback(['Internal error'], null)
            }else{
                callback([], rows)
            }
        })
    }

    exports.deleteReservation = function (reservation, callback) {
        const query = `DELETE FROM reservations
        WHERE user_id = ? AND reservation_id = ?`
        //Fyra om användarnamn ska med
        const values = [
            parseInt(reservation.user_id),
            parseInt(reservation.reservation_id)
        ]


        db.query(query,values,function(error, rows){
            if (error) {
                console.log(error)
                callback(['Internal error'], null)
            }else{
                callback([], rows)
            }
        })
    }


    exports.getAllUserReservations = function(user, callback) {
        const query = `SELECT reservations.*,users.username, users.user_id, users.first_name, users.last_name, users.phone_number, users.email_address
        FROM reservations LEFT JOIN (users,tables)
        ON (users.user_id = reservations.user_id AND tables.table_id = reservations.table_id)
        WHERE reservations.user_id = ? AND users.username = ?`

        const values = [
            user.user_id,
            user.username
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

    exports.userCreateReservation = function(reservation, callback){
        const query = `INSERT INTO reservations (user_id, table_id, reservation_date, reservation_time) 
        VALUES (?, ?, ?,?)`
        //Fyra om användarnamn ska med
        const values = [
            reservation.user_id,
            reservation.table_id,
            reservation.reservation_date,
            reservation.reservation_time
        ]

        db.query(query, values, function (error, rows) {
            if (error) {
                console.log(error)
                callback(['Internal error'], null)
            }else{
                callback([], rows)
            }
        })
    }

    exports.userCancelReservation = function (reservation, callback) {
        const query = `DELETE FROM reservations 
        WHERE user_id = ? AND reservation_id = ?`
        //Fyra om användarnamn ska med
        const values = [
            parseInt(reservation.user_id),
            parseInt(reservation.reservation_id)
        ]

        console.log(values, 'VALUES')
        db.query(query,values,function(error, rows){
            if (error) {
                console.log(error)
                callback(['Internal error'], null)
            }else{
                if(rows.affectedRows == 0){
                    callback(['resource_not_exist'], rows)
                }
                callback([], rows)
            }
        })
    }

    return exports
}