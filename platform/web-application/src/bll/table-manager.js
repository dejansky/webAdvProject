//

module.exports = function ({tableRepository, accountValidator, tableValidator}) {
    const exports = {}

    exports.createTable = function(session, table,callback){
        const errors = []

        tableValidator.validateTable(table).forEach(element => {
            errors.push(element)
        })

        accountValidator.isEmployee(session).forEach(element => {
            errors.push(element)
        })

        if (errors.length > 0) {
            callback(errors, null)
            return
        }

        tableRepository.createTable(table,callback)
    }

    exports.getTables = function(callback){
        tableRepository.getTables(callback)
    }

    exports.updateTable = function(session, table,callback){
        const errors = []

        tableValidator.validateTable(table).forEach(element => {
            errors.push(element)
        })
        
        accountValidator.isEmployee(session).forEach(element => {
            errors.push(element)
        })

        if (errors.length > 0) {
            callback(errors, null)
            return
        }

        tableRepository.updateTable(table,callback)
    }

    exports.deleteTable = function(session,table,callback){
        const errors = []

        accountValidator.isEmployee(session).forEach(element => {
            errors.push(element)
        })

        if (errors.length > 0) {
            callback(errors, null)
            return
        }

        tableRepository.deleteTable(table,callback)
    }

    return exports
}