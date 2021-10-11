const postgresDB = require('../sequelize-dal/sequelize-pgdb')
const seq_reservation = postgresDB.reservation
const seq_user = postgresDB.user
const seq_table = postgresDB.table

module.exports = function () {
    const exports = {}

    exports.getAllReservations = function (callback) {
        seq_reservation.findAll({
                where: {
                    table_id: seq_table.table_id,
                    user_id: seq_user.reservation_id
                },
                include: [{
                    model: {
                        seq_table,
                        seq_user
                    },
                    required: false, //forces a left join
                }]
            })
            .then(() => {
                callback(null)
            })
            .catch(() => {
                callback(['internal_error'], null)
            })
    }

    exports.updateReservation = function (reservation, callback) {
        seq_reservation.update({
                reservation_date: reservation.reservation_date,
                //reservation_time: reservation.reservation_time,
                table_id: reservation.table_id
            }, {
                where: {
                    user_id: parseInt(reservation.user_id),
                    reservation_id: parseInt(reservation.reservation_id)
                }
            })
            .then(() => {
                callback([], seq_reservation)
            })
            .catch(() => {
                callback(['internal_error'], null)
            })
    }

    exports.deleteReservation = function (reservation, callback) {
        seq_reservation.destroy({
                where: {
                    user_id: parseInt(reservation.user_id),
                    reservation_id: parseInt(reservation.reservation_id)
                }
            })
            .then(() => {
                callback(null)
            })
            .catch(() => {
                callback(['internal_error'], null)
            })
    }

    exports.getAllUserReservations = function (user, callback) {
        seq_reservation.findAll({
                where: {
                    table_id: seq_table.table_id,
                    user_id: seq_user.reservation_id
                },
                include: [{
                    model: {
                        seq_table, 
                        seq_user
                    },
                    required: false, //forces a left join
                }]
            })
            .then(() => {
                callback(null)
            })
            .catch(() => {
                callback(['internal_error'], null)
            })

    }

    exports.userCreateReservation = function (reservation, callback) {
        seq_reservation.create({
                user_id: reservation.user_id,
                table_id: reservation.table_id,
                reservation_date: reservation.reservation_date
                //reservation_time: reservation.reservation_time
            })
            .then(() => {
                callback([], reservation.reservation_id)
            })
            .catch(() => {
                callback(['internal_error'], null)
            })
    }

    exports.userCancelReservation = function (reservation, callback) {
        seq_reservation.destroy({
                where: {
                    user_id: reservation.user_id
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