import express from 'express';
import { Request, Response } from 'express';
import IControllerBase from '../interfaces/IControllerBase.interface';
import vehicleModule from '../modules/vehicle';
import moment from 'moment';

interface Req extends Request {
    user: any;
};

class HomeController implements IControllerBase {
    public path = '/api/vehicle/';
    public router = express.Router();

    constructor(staffPanel: any) {
        this.initRoutes(staffPanel);
    };

    public initRoutes(staffPanel: any) {
        this.router.post('/add', staffPanel.isAuthenticated, async (req: Req, res: Response) => {
            vehicleModule.new({
                owner: req.body.owner,
                vehicle: req.body.vehicle,
                access: req.body.access,
                date: moment()
            });
    
            res.redirect("/");
            staffPanel.Logger(`${req.user.username} (${req.user.id}) just added ${req.body.vehicle} to the blacklist.`);
        });

        this.router.post('/delete', staffPanel.isAuthenticated, async (req: Req, res: Response) => {
            const data = await vehicleModule.delete({ _id: req.body.vehicleID });
            staffPanel.Logger(`${req.user.username} (${req.user.id}) just deleted ${data.vehicle} from the blacklist.`);
            res.redirect("/");
        });

        this.router.post('/edit', staffPanel.isAuthenticated, async (req: Req, res: Response) => {
            const vehicle = await vehicleModule.get({ _id: req.body.vehicleID });
            vehicle.owner = req.body.owner || vehicle.owner;
            vehicle.vehicle = req.body.vehicle || vehicle.vehicle;

            if (req.body.access) {
                if (typeof req.body.access === "string") {
                    vehicle.access = [req.body.access];
                } else {
                    vehicle.access = req.body.access;
                };
            } else vehicle.access = [];

            await vehicle.save();

            res.redirect("/");
            staffPanel.Logger(`${req.user.username} (${req.user.id}) just modified ${req.body.vehicle}.`);
        });
    };
};

export default HomeController;