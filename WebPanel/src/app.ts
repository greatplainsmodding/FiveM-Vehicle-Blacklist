import express, { Application, Request, Response } from 'express'
import mongoose from 'mongoose';
import config from './config.json'
import passport from 'passport';
import Strategy from 'passport-discord';
import session from 'express-session';
import Logger from './services/Logger';
const Eris = require("eris")

interface App {
    io: any
    server: any
    connections: any
    config: typeof config
}

class App {
    public app: Application
    public port: number;
    public bot: any;
    public Logger: Function;
    public isAuthenticated: Function;

    constructor(appInit: { port: number; middleWares: any; controllers: any; }) {
        this.app = express()
        this.port = appInit.port;
        this.bot = new Eris(config.token);
        this.config = config;
        this.Logger = Logger;

        this.bot.on("ready", () => {
            this.Logger("Bot Started!")
        });

        // Passport
        this.app.use(session({
            secret: config.passport.secret,
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 24 * 60 * 60 * 365 * 1000
            }
        }));
        
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        
        passport.serializeUser((user:any, done:any) => done(null, user));
        passport.deserializeUser((user:any, done:any) => done(null, user));
        
        passport.use(new Strategy.Strategy({
            clientID: config.passport.clientID,
            clientSecret: config.passport.clientSecret,
            callbackURL: config.passport.callbackURL,
            scope: ["identify"]
        }, (accessToken:any, refreshToken:any, profile:any, done:any) => {
            process.nextTick(() => {
                return done(null, profile);
            });
        }));
        
        // Auth
        this.isAuthenticated = function(req:any, res:Response, next:any) {
            if (!req.isAuthenticated()) return res.redirect("/login");
            next();
        };

        this.middleware(appInit.middleWares)
        this.routes(appInit.controllers)
        this.assets()
        this.template()

        this.app.use(function (err, req, res, next) {
            console.error(err.stack)
            res.status(500).send('Something broke! Please contact a head developer!')
        })

        mongoose.connect("mongodb://localhost:27017/VehicleBlacklist", {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false
        }, () => this.Logger("MongoDB connected!"));

        this.bot.connect();
    };

    private middleware(middleWares: { forEach: (arg0: (middleWare: any) => void) => void; }) {
        middleWares.forEach(middleWare => {
            this.app.use(middleWare);
        });
    };

    private routes(controllers: { forEach: (arg0: (controller: any) => void) => void; }) {
        controllers.forEach(controller => {
            const initController = new controller(this);
            this.app.use(initController.path, initController.router);
        });
    };

    private assets() {
        this.app.use(express.static('website/public'));
        this.app.set("views", __dirname + "/../website/views")
    };

    private template() {
        this.app.set('view engine', 'ejs');
    };

    public listen() {
        this.app.listen(this.port, () => {
            this.Logger(`App listening on the http://localhost:${this.port}`);
        });
    };
};

export default App