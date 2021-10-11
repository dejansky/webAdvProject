const express = require('express');
const path = require('path');
const expressHandlebars = require('express-handlebars');
const redis = require("redis");
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');

module.exports = function({ restAPI,accountRouter, reservationRouter, variousRouter, adminRouter, userRouter, tableRouter, recipeRouter, globals, variousManager }) {
    
    const app = express()
    
    const values = globals.values()

    app.use(bodyParser.json());

    app.use(bodyParser.urlencoded({
        extended: true
    }))

    app.engine('hbs', expressHandlebars({
        extname: 'hbs',
        defaultLayout: 'main.hbs',
        layoutsDir: path.join(__dirname, 'layouts')
    }))

    const {
        SES_TIME_TO_LIVE = values.ONE_HOUR,
            SES_SECRET = values.SESSION_SECRET,
            SES_NAME = values.SESSION_NAME,
    } = process.env

    let RedisStore = require('connect-redis')(session);
    let redisClient = redis.createClient({
        host: 'redis'
    });
    app.use(cookieParser())
    app.use(session({
        name: SES_NAME,
        store: new RedisStore({ client: redisClient }),
        resave: false,
        saveUninitialized: false,
        secret: SES_SECRET,
        cookie: {
            maxAge: SES_TIME_TO_LIVE,
            sameSite: true,
        },
    }));


 
    
    //Attach layout
    app.all('/*', function(request, response, next) {
        request.app.locals.layout = 'main.hbs';
        next()
    })

    app.all('/*', async function(request, response, next) {
        const errors = []
        const general_settings = new Promise((resolve, reject)=>{
            variousManager.getGeneralInfo(function (error, rows) {
                if(rows){
                    resolve(rows)
                }else{
                    reject(error)
                }
            })
        })

        await Promise.all([general_settings]).then((rows) => {
            request.app.locals.general_settings = rows[0]
    
        }).catch((error) => {
            errors.push(error)
            request.app.locals.error = true
            request.app.locals.errors = errors
        })

        next()
    })

    app.use(function(request, response, next) {
        const is_logged_in = request.session.is_logged_in
        response.locals.is_logged_in = is_logged_in

        const is_admin = request.session.is_admin
        response.locals.is_admin = is_admin

        const is_employee = request.session.is_employee
        response.locals.is_employee = is_employee

        const logged_in_username = request.session.logged_in_username
        response.locals.logged_in_username = logged_in_username

        const logged_in_user_id = request.session.logged_in_user_id
        response.locals.logged_in_user_id = logged_in_user_id
    
        console.log("is_logged_in = >", is_logged_in,' is_admin = > ', is_admin, 'is_employee',is_employee,'logged in user: ', logged_in_username , 'logged in user_id', logged_in_user_id)
        next()
    })

    app.use('/api/', restAPI) //This is the simplest solution to avoid CRF protection which is not needed in REST API, as REST is statless and should not use cookies(keep track of user data)
    // Althogh i do not feel like this is a propper solution, but no time left to seek a good solution. If time left do something like this https://stackoverflow.com/questions/38820342/disable-csrf-protection-for-specific-url-pattern-in-spring-boot
    
    app.use(csrf({cookie: true}))

    app.use(function (request, response, next) {
        const token = request.csrfToken()
        response.cookie('XSRF-TOKEN', token)
        response.app.locals.csrfToken = token
        next()
    })

    app.use('/panel/', adminRouter)
    app.use('/panel/', accountRouter)
    app.use('/panel/', reservationRouter)
    app.use('/panel/', tableRouter)
    app.use('/panel/', recipeRouter)
    app.use('/', variousRouter)
    app.use('/', userRouter)

    app.set('views', path.join(__dirname, 'views'));
    app.use(express.static(path.join(__dirname, 'public')));

    return app
}