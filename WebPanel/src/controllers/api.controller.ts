import express from 'express'
import { Request, Response } from 'express'
import IControllerBase from '../interfaces/IControllerBase.interface'
import vehicleModule from '../modules/vehicle';

interface Req extends Request {
    user: any
}


class HomeController implements IControllerBase {
    public path = '/api';
    public router = express.Router();

    constructor(staffPanel: any) {
        this.initRoutes(staffPanel);
    };

    public async initRoutes(staffPanel) {
        this.router.get('/fetch', async (req: Req, res: Response) => {
            const outVehicles = [];
            const vehicles = await vehicleModule.getAll({});

            for (let vehicle of vehicles) {
                vehicle.access.push(vehicle.owner)

                outVehicles.push({
                    vehicle: vehicle.vehicle,
                    access: vehicle.access
                })
            };

            res.send(outVehicles)
        });
    };
};

export default HomeController;