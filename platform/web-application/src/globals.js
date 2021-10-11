// This file contains the values & functions used repeatedly in various files and routers hence the name globlas


module.exports = function() {

    const exports = {}

    exports.todaysDate = function(){
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = yyyy + '-' + mm + '-' + dd;

        return today
    }

    exports.values = function() {

        const values = {
            MAX_USERNAME_LENGTH: 10,
            MIN_USERNAME_LENGTH: 3,
            MIN_NAME_LENGTH: 2,
            MAX_NAME_LENGTH: 20,
            MIN_MESSAGE_LENGTH: 5,
            MAX_MESSAGE_LENGTH: 200,
            ONE_HOUR: 1000*60*60,
            SESSION_NAME: 'session',
            SESSION_SECRET: '199b345fb09ff8e01f507dbd1ab557a1',
            TOKEN_SECRET: '292d9127d0e9eb1b97564ae843ab44320ea8c562', 
            OPENING_TIME: '10:00',
            CLOSING_TIME: '22:00',
        }

        return values
    }

    exports.errorTranslation = function(error_arr) {

        const errorTranslations = {
            username_invalid: 'The username must consists of 3 to 10 characters',
            fist_name_last_name_invalid: 'First name and last name must be at least 2 characters and 20 at most',
            fist_name_last_name_nac: 'First name and last name must not consist of anything else but letters aA-zZ',
            correction_of_email_address: 'Please enter a valid email address',
            passwords_not_matching: 'The entered passwords do not match',            
            internal_error: 'Something went wrong',
            email_not_valid: 'Email address is not valid ! ',
            user_does_not_exist:'Username or password is incorrect', //Same message as we do not want to give any clues to the hacker
            incorrect_login_credentials: 'Username or password is incorrect',
            //Reservation validation
            reservation_info_insufficient: "Insufficient reservation information. Please enter number of guests, time and date.",
            not_authorized: 'You are not authorized to perform this action',
            not_logged_in: 'You must be logged IN',
            not_logged_out: 'You must be logged OUT',
            JsonWebTokenError:'API Error',
            resource_not_exist: 'Resource does not exist',
            user_exists_error: 'Username already in use',
            salt_err: 'Something went wrong please try again later',
            phone_number_nan: 'Please enter a valid phone number',
            contact_message_error: 'Message must be consist of 5 to 200 latters',
            table_error: 'Table id and number of seats must be numbers',
            duplicate_table_error:'Table with that id already exists',
            invalid_date: 'Please select a valid date',
            invalid_time: 'Please select a time between 10:00 and 22:00',
            price_invalid: 'Price invalid, can not be nagative',
            price_nan: 'Price must be an number',
            recipe_name_length_invalid: 'Recipe name must be at least 2 characters and 20 at most',
            recipe_description_length_invalid: 'Description consist of at least 5 characts and 200 at most',
            undefined_value: 'Please select a value',
        }

        const errorMessages = error_arr.map(e => errorTranslations[e])
        console.log(errorMessages)

        return errorMessages
    };

    return exports
}