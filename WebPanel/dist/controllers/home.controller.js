"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vehicle_1 = __importDefault(require("../modules/vehicle"));
const passport_1 = __importDefault(require("passport"));
class HomeController {
    constructor(staffPanel) {
        this.path = '/';
        this.router = express_1.default.Router();
        this.initRoutes(staffPanel);
    }
    ;
    initRoutes(staffPanel) {
        this.router.get('/', staffPanel.isAuthenticated, (req, res) => __awaiter(this, void 0, void 0, function* () {
            let vehicles;
            let permLevel = 0;
            if ((staffPanel.bot.guilds.get(staffPanel.config.discord).members.get(req.user.id)).roles.includes("707268136126382114")) {
                vehicles = yield vehicle_1.default.getAll({});
                permLevel = 1;
            }
            else {
                const ownedVehicles = yield vehicle_1.default.getAll({ owner: req.user.id });
                const allowedAccess = yield vehicle_1.default.getAll({ access: { "$in": [req.user.id] } });
                vehicles = ownedVehicles.concat(allowedAccess);
            }
            ;
            const outVehicles = [];
            for (let veh of vehicles) {
                const user = staffPanel.bot.guilds.get(staffPanel.config.discord).members.get(veh.owner);
                // if (user) {
                const access = [];
                for (let accessTo of veh.access) {
                    const accessToUser = staffPanel.bot.guilds.get(staffPanel.config.discord).members.get(accessTo);
                    if (accessToUser) {
                        access.push({
                            id: accessTo,
                            name: accessToUser.nick || accessToUser.username + "#" + accessToUser.discriminator
                        });
                    }
                    else {
                        const accessToRole = staffPanel.bot.guilds.get(staffPanel.config.discord).roles.get(accessTo);
                        if (accessToRole) {
                            access.push({
                                id: accessTo,
                                name: accessToRole.name
                            });
                        }
                    }
                }
                ;
                if (user) {
                    const modifiedVehicle = {
                        _id: veh._id,
                        owner: user.nick || (user.username + "#" + user.discriminator),
                        ownerID: user.id,
                        access: access,
                        vehicle: veh.vehicle,
                        date: veh.date
                    };
                    outVehicles.push(modifiedVehicle);
                }
                else {
                    const modifiedVehicle = {
                        _id: veh._id,
                        owner: "None",
                        ownerID: "0",
                        access: access,
                        vehicle: veh.vehicle,
                        date: veh.date
                    };
                    outVehicles.push(modifiedVehicle);
                }
                // };
            }
            ;
            let donators = [];
            staffPanel.bot.guilds.get(staffPanel.config.discord).members.forEach((user) => {
                if (user.roles.includes("706722384173858817") || user.roles.includes("702596068986060950") && !user.roles.includes("706722384173858817"))
                    donators.push(user);
            });
            let roles = [];
            staffPanel.bot.guilds.get(staffPanel.config.discord).roles.forEach((role) => {
                roles.push({ name: role.name, id: role.id });
            });
            res.render("home.ejs", {
                vehicles: outVehicles,
                donators: donators,
                roles: roles,
                permLevel: permLevel,
                req: {
                    user: req.user
                }
            });
        }));
        this.router.get("/login", passport_1.default.authenticate("discord", {
            scope: ["identify"]
        }), (req, res, next) => { });
        this.router.get("/dashboard/callback", passport_1.default.authenticate("discord", { failureRedirect: "/login" }), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            res.redirect("/");
            staffPanel.Logger(`${req.user.username} (${req.user.id}) just logged into the panel.`);
        }));
        this.router.get("/logout", staffPanel.isAuthenticated, (req, res) => {
            staffPanel.Logger(`${req.user.username} (${req.user.id}) just logged out of the panel.`);
            req.logout();
            res.redirect("/login");
        });
    }
    ;
}
;
exports.default = HomeController;
