module.exports = function({
    reservationRepository,
    reservationValidator, //Do we need this? Yes, to handle errors for the reservation
    accountValidator
}) {
    const exports = {}

    exports.getAllReservations = function(session,callback) {
        const errors = []
        
        accountValidator.isEmployee(session).forEach(element => {
            errors.push(element)
        })

        if (errors.length > 0) {
            callback(errors, null)
            return
        }

        reservationRepository.getAllReservations(callback)
    }

    

    exports.updateReservation = function(session,reservation, callback) {
        //Errors from the reservationValidator 

        const errors = []

        accountValidator.isEmployee(session).forEach(element => {
            errors.push(element)
        })

        if (errors.length > 0) {
            callback(errors, null)
            return
        }

        reservationRepository.updateReservation(reservation, callback)
    }

    exports.deleteReservation = function(session, reservation, callback) {
        //Errors from the reservationValidator 
        const errors = []

        accountValidator.isEmployee(session).forEach(element => {
            errors.push(element)
        })

        if (errors.length > 0) {
            callback(errors, null)
            return
        }
        reservationRepository.deleteReservation(reservation, callback)
    }

    exports.getAllUserReservations = function(session,user,callback) {
        const errors = []

        accountValidator.isLoggedIn(session).forEach(element => {
            errors.push(element)
        })

        if (errors.length > 0) {
            callback(errors, null)
            return
        }

        reservationRepository.getAllUserReservations(user,callback)
    }

    exports.userCreateReservation = function(session,reservation, callback) {
        //Errors from the reservationValidator 
        const errors = []

        reservationValidator.validateReservation(reservation).forEach(element => {
            errors.push(element)
        })

        accountValidator.isLoggedIn(session).forEach(element => {
            errors.push(element)
        })

        if (errors.length > 0) {
            callback(errors, null)
            return
        }

        reservationRepository.userCreateReservation(reservation, callback)
    }
    
    exports.userCancelReservation = function(session, reservation, callback) {
        //Errors from the reservationValidator 

        const errors = []

        accountValidator.isLoggedIn(session).forEach(element => {
            errors.push(element)
        })

        if (errors.length > 0) {
            callback(errors, null)
            return
        }

        reservationRepository.userCancelReservation(reservation, callback)
    }


    return exports
}