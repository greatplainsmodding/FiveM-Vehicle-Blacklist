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
        this.router.post('/add', this.add);
        this.router.post('/remove', this.remove);
        this.router.post('/update', this.update);
    };

    add = async (req: Request, res: Response) => {
        res.send("add")
    };

    remove = async (req: Request, res: Response) => {
        res.send("remove")
    };

    update = async (req: Request, res: Response) => {
        res.send("update")
    };
};

export default HomeController;