import express from 'express'
import { Request, Response } from 'express'
import IControllerBase from '../interfaces/IControllerBase.interface'

class HomeController implements IControllerBase {
    public path = '/';
    public router = express.Router();

    constructor() {
        this.initRoutes();
    };

    public initRoutes() {
        this.router.get('/', this.homeRoute);
    };

    homeRoute = async (req: Request, res: Response) => {
        res.render("home.ejs", {
            user: undefined,
            staffMembers: [],
            data: {}
        });
    };
};

export default HomeController;