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

    public initRoutes(staffPanel) {
        this.router.get('/fetch', async (req: Req, res: Response) => {
            const vehicles = await vehicleModule.getAll({});
            res.send(vehicles)
        });
    };
};

export default HomeController;