//User postgres for this repository
const db = require('./db')

module.exports = function() {
    const exports = {}

    exports.createTable = function (table,callback) {
        const query = `INSERT INTO tables (table_id, table_seats)
        VALUES (?,?)`

        const values = [
            table.table_id, 
            table.table_seats
        ]

        db.query(query,values,function (error, rows) {
            if(error){
                console.log(error)
                if(error.code == 'ER_DUP_ENTRY'){
                    callback(['duplicate_table_error'], null)
                }else{
                    callback(['internal_error'], null)
                }
                
                
            }else{
                callback([], rows)
            }
        })
    }

    exports.getTables = function (callback) {
        const query = `SELECT * FROM tables`

        db.query(query,[],function (error, rows) {
            if(error){
                console.log(error)
                callback(['internal_error'], null)
            }else{
                callback([], rows)
            }
        })
    }

    exports.updateTable = function (table,callback) {
        const query = `UPDATE tables
        SET  
        table_seats = ?
        WHERE table_id = ?`
        
        const values = [
            table.table_seats,
            table.table_id
        ]

        db.query(query,values,function (error, rows) {
            if(error){
                console.log(error)
                callback(['internal_error'], null)
            }else{
                callback([], rows)
            }
        })
    }

    exports.deleteTable = function (table,callback) {
        const query = `DELETE FROM tables
        WHERE table_id = ?`
        
        const values = [
            table.table_id
        ]

        db.query(query,values,function (error, rows) {
            if(error){
                console.log(error)
                callback(['internal_error'], null)
            }else{
                if(rows.affectedRows == 0){
                    callback(['resource_not_exist'], rows)
                }else{
                    callback([], rows)
                }
            }
        })
    }

    return exports
}