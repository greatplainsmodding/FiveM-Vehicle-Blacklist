import express from 'express'
import { Request, Response } from 'express'
import IControllerBase from '../interfaces/IControllerBase.interface'
import vehicleModule from '../modules/vehicle';
import passport from 'passport';

interface Req extends Request {
    user: any
}

class HomeController implements IControllerBase {
    public path = '/';
    public router = express.Router();

    constructor(staffPanel: any) {
        this.initRoutes(staffPanel);
    };

    public initRoutes(staffPanel: any) {
        this.router.get('/', staffPanel.isAuthenticated, async (req: Req, res: Response) => {
            let vehicles;
            let permLevel = 0;

            if ((staffPanel.bot.guilds.get(staffPanel.config.discord).members.get(req.user.id)).roles.includes("707268136126382114")) {
                vehicles = await vehicleModule.getAll({});
                permLevel = 1;
            } else {
                const ownedVehicles = await vehicleModule.getAll({ owner: req.user.id });
                const allowedAccess = await vehicleModule.getAll({ access: { "$in": [req.user.id] }});
                vehicles = ownedVehicles.concat(allowedAccess);
            };

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
                            })
                        } else {
                            const accessToRole = staffPanel.bot.guilds.get(staffPanel.config.discord).roles.get(accessTo);
                            if (accessToRole) {
                                access.push({
                                    id: accessTo,
                                    name: accessToRole.name
                                })
                            }
                        }
                    };
                    if (user) {
                        const modifiedVehicle = {
                            _id: veh._id,
                            owner:  user.nick || (user.username + "#" + user.discriminator),
                            ownerID: user.id,
                            access: access,
                            vehicle: veh.vehicle,
                            date: veh.date
                        };

                        outVehicles.push(modifiedVehicle)
                    } else {
                        const modifiedVehicle = {
                            _id: veh._id,
                            owner:  "None",
                            ownerID: "0",
                            access: access,
                            vehicle: veh.vehicle,
                            date: veh.date
                        };
    
                        outVehicles.push(modifiedVehicle)
                    }
                // };
            };
            
            let donators = [];
            staffPanel.bot.guilds.get(staffPanel.config.discord).members.forEach((user) => {
                if (user.roles.includes("706722384173858817") || user.roles.includes("702596068986060950") && !user.roles.includes("706722384173858817")) donators.push(user)
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
        });

        this.router.get("/login", passport.authenticate("discord", {
            scope: ["identify"]
        }), (req, res, next) => {});

        this.router.get("/dashboard/callback", passport.authenticate("discord", { failureRedirect: "/login" }), async (req: Req, res, next) => {
            res.redirect("/");
            staffPanel.Logger(`${req.user.username} (${req.user.id}) just logged into the panel.`)
        });

        this.router.get("/logout", staffPanel.isAuthenticated, (req: Req, res) => {
            staffPanel.Logger(`${req.user.username} (${req.user.id}) just logged out of the panel.`)
            req.logout();
            res.redirect("/login");
        });
    };
};

export default HomeController;