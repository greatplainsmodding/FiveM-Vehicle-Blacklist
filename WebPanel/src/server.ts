import App from './app'

import * as bodyParser from 'body-parser'
import passport from 'passport';
import cookieParser from 'cookie-parser';
import Strategy from 'passport-discord';
import session from 'express-session';

// import loggerMiddleware from './middleware/logger'

import HomeController from './controllers/home.controller'
import ApiController from './controllers/vehicle.controller'

const app = new App({
    port: 5000,
    controllers: [
        new HomeController(),
        new ApiController()
    ],
    middleWares: [
        bodyParser.json(),
        bodyParser.urlencoded({ extended: true })
    ]
})

app.listen()