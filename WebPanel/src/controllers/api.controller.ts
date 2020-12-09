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
        this.router.get('/', this.index);
    };

    index = async (req: Request, res: Response) => {
        res.send("api/")
    };
};

export default HomeController;