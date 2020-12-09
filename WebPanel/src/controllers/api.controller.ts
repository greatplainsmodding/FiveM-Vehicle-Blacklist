import express from 'express'
import { Request, Response } from 'express'
import IControllerBase from '../interfaces/IControllerBase.interface'

class HomeController implements IControllerBase {
    public path = '/api/';
    public router = express.Router();

    constructor() {
        this.initRoutes();
    };

    public initRoutes() {
        this.router.get('/fetch', this.fetchVehicles);
    };

    fetchVehicles = async (req: Request, res: Response) => {
        res.send([
            { vehicle: "tug", owners: ["384187414584754176"] },
            { vehicle: "bus", owners: ["384187414584754176-old"] }
        ]);
    };
};

export default HomeController;