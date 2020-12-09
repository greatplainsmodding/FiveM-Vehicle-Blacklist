import express from 'express'
import { Application } from 'express'
import mongoose from 'mongoose';

interface App {
    io: any
    server: any
    connections: any
}

class App {
    public app: Application
    public port: number;

    constructor(appInit: { port: number; middleWares: any; controllers: any; }) {
        this.app = express()
        this.port = appInit.port;

        this.middleware(appInit.middleWares)
        this.routes(appInit.controllers)
        this.assets()
        this.template()

        mongoose.connect("mongodb://localhost:27017/BCCRP-XYZ", {
            useUnifiedTopology: true,
            useNewUrlParser: true
        }, () => console.log("MongoDB connected!"));
    };

    private middleware(middleWares: { forEach: (arg0: (middleWare: any) => void) => void; }) {
        middleWares.forEach(middleWare => {
            this.app.use(middleWare);
        });
    };

    private routes(controllers: { forEach: (arg0: (controller: any) => void) => void; }) {
        controllers.forEach(controller => {
            this.app.use(controller.path, controller.router);
        });
    };

    private assets() {
        this.app.use(express.static('website/public'));
        this.app.set("views", __dirname + "/../website/views")
    };

    private template() {
        this.app.set('view engine', 'ejs');
    };

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the http://localhost:${this.port}`);
        });
    };
};

export default App