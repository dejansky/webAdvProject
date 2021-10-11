//

module.exports = function ({globals}) {
    const exports = {}

    exports.validateTable = function (table) {
        const error = []

        if (isNaN(table.table_id) || isNaN(table.table_seats) ) {
            error.push('table_error')
        }

        return error
    }

    return exports
}