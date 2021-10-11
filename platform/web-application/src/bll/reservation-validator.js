//

module.exports = function ({
    globals
}) {
    const exports = {}

    exports.validateReservation = function (reservation) {
        const error = []
        const values = globals.values()

        const reservation_date = new Date(reservation.reservation_date)
        const todays_date = new Date(globals.todaysDate())

        console.log(reservation_date.getTime(), 'Selected date')
        console.log(todays_date.getTime(), "Todays date")

        const reservation_time =  Date.parse('01/01/2011 ' + String(reservation.reservation_time)) 
        const min_time =  Date.parse('01/01/2011 ' + String(values.OPENING_TIME)) 
        const max_time =  Date.parse('01/01/2011 ' + String(values.CLOSING_TIME)) 


        if (reservation_date.getTime() < todays_date.getTime()) {
            error.push('invalid_date')
        }
        if(reservation_time > max_time || reservation_time < min_time){
            error.push('invalid_time')
        }
        console.log(reservation.table_id, reservation.reservation_date, reservation.reservation_date)

        if(reservation.table_id == undefined){
            error.push('undefined_value')
        }
        
        console.log(error)
        return error
    }

    return exports
}