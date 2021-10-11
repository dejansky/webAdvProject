const postgresDB = require('../sequelize-dal/sequelize-pgdb')
const seq_table = postgresDB.table

module.exports = function () {
    const exports = {}

    exports.createTable = function (table, callback) {
        seq_table.create({
            table_id: table.table_id,
            table_seats: table.table_seats     
        })
        .then(() => {
            callback([],seq_table)
        })
        .catch(() => {
            callback(['internal_error'], null)
        })
    }

    exports.getTables = function (callback) {
        seq_table.findAll({
            raw:true
        })
        .then(() => {
            callback([], seq_table)
        })
        .catch(() => {
            callback(['internal_error'], null)
        })
    }

    exports.updateTable = function (table, callback) {
        seq_table.update({
            table_seats: table.table_seats,
        }, {
            where:{
                table_id: table.table_id
            }
        })
        .then(() => {
            callback(null)
        })
        .catch(() => {
            callback(['internal_error'], null)
        })
    }

    exports.deletTable = function (table, callback) {
        seq_table.destroy({
            where: {
                table_id: table.table_id
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