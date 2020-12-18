import express from 'express'
import { Request, Response } from 'express'
import IControllerBase from '../interfaces/IControllerBase.interface'
import vehicle from '../modules/vehicle';
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
            } else vehicles = vehicles = await vehicleModule.getAll({ owner: req.user.id });

            const outVehicles = [];
            for (let veh of vehicles) {
                const user = staffPanel.bot.guilds.get(staffPanel.config.discord).members.get(veh.owner);

                const access = [];
                for (let accessTo of veh.access) {
                    const accessToUser = staffPanel.bot.guilds.get(staffPanel.config.discord).members.get(accessTo);
                    if (accessToUser) {
                        access.push({
                            id: accessTo,
                            name: accessToUser.username + accessToUser.discriminator
                        })
                    }
                };

                const modifiedVehicle = {
                    _id: veh._id,
                    owner: user.username + user.discriminator,
                    ownerID: user.id,
                    access: access,
                    vehicle: veh.vehicle,
                    date: veh.date
                };

                outVehicles.push(modifiedVehicle)
            }
            
            let donators = [];
            staffPanel.bot.guilds.get(staffPanel.config.discord).members.forEach((user) => {
                if (user.roles.includes("706722384173858817") || user.roles.includes("702596068986060950") && !user.roles.includes("706722384173858817")) donators.push(user)
            })

            res.render("home.ejs", {
                vehicles: outVehicles,
                donators: donators,
                permLevel: permLevel
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