"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_json_1 = __importDefault(require("./config.json"));
const passport_1 = __importDefault(require("passport"));
const passport_discord_1 = __importDefault(require("passport-discord"));
const express_session_1 = __importDefault(require("express-session"));
const Logger_1 = __importDefault(require("./services/Logger"));
const node_fetch_1 = __importDefault(require("node-fetch"));
node_fetch_1.default("https://staff.blaineccrp.com/api/v1/players/get/76561198980531588").then(res => res.json()).then(res => {
    node_fetch_1.default("https://plugin.tebex.io/user/76561198980531588", {
        headers: {
            ["X-Tebex-Secret"]: "f279d5799213160f376e4e2a5ba7709dd196f1a3"
        }
    }).then(res => res.json()).then(res => console.log(res));
});
const Eris = require("eris");
class App {
    constructor(appInit) {
        this.app = express_1.default();
        this.port = appInit.port;
        this.bot = new Eris(config_json_1.default.token);
        this.config = config_json_1.default;
        this.Logger = Logger_1.default;
        this.bot.on("ready", () => {
            this.Logger("Bot Started!");
        });
        // Passport
        this.app.use(express_session_1.default({
            secret: config_json_1.default.passport.secret,
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 24 * 60 * 60 * 365 * 1000
            }
        }));
        this.app.use(passport_1.default.initialize());
        this.app.use(passport_1.default.session());
        passport_1.default.serializeUser((user, done) => done(null, user));
        passport_1.default.deserializeUser((user, done) => done(null, user));
        passport_1.default.use(new passport_discord_1.default.Strategy({
            clientID: config_json_1.default.passport.clientID,
            clientSecret: config_json_1.default.passport.clientSecret,
            callbackURL: config_json_1.default.passport.callbackURL,
            scope: ["identify"]
        }, (accessToken, refreshToken, profile, done) => {
            process.nextTick(() => {
                return done(null, profile);
            });
        }));
        // Auth
        this.isAuthenticated = function (req, res, next) {
            if (!req.isAuthenticated())
                return res.redirect("/login");
            next();
        };
        this.middleware(appInit.middleWares);
        this.routes(appInit.controllers);
        this.assets();
        this.template();
        this.app.use(function (err, req, res, next) {
            console.error(err.stack);
            res.status(500).send('Something broke! Please contact a head developer!');
        });
        mongoose_1.default.connect("mongodb://localhost:27017/VehicleBlacklist", {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false
        }, () => this.Logger("MongoDB connected!"));
        this.bot.connect();
    }
    ;
    middleware(middleWares) {
        middleWares.forEach(middleWare => {
            this.app.use(middleWare);
        });
    }
    ;
    routes(controllers) {
        controllers.forEach(controller => {
            const initController = new controller(this);
            this.app.use(initController.path, initController.router);
        });
    }
    ;
    assets() {
        this.app.use(express_1.default.static('website/public'));
        this.app.set("views", __dirname + "/../website/views");
    }
    ;
    template() {
        this.app.set('view engine', 'ejs');
    }
    ;
    listen() {
        this.app.listen(this.port, () => {
            this.Logger(`App listening on the http://localhost:${this.port}`);
        });
    }
    ;
}
;
exports.default = App;
