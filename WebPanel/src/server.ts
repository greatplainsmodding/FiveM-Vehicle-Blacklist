import App from './app'
import * as bodyParser from 'body-parser'
import config from './config.json';
import HomeController from './controllers/home.controller'
import VehicleController from './controllers/vehicle.controller'
import ApiController from './controllers/api.controller'

const app = new App({
    port: config.port,
    controllers: [
        HomeController,
        VehicleController,
        ApiController
    ],
    middleWares: [
        bodyParser.json(),
        bodyParser.urlencoded({ extended: true })
    ]
})

app.listen()