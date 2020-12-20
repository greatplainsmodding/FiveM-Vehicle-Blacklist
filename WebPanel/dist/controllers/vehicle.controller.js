"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vehicle_1 = __importDefault(require("../modules/vehicle"));
const moment_1 = __importDefault(require("moment"));
class HomeController {
    constructor(staffPanel) {
        this.path = '/api/vehicle/';
        this.router = express_1.default.Router();
        this.initRoutes(staffPanel);
    }
    ;
    initRoutes(staffPanel) {
        this.router.post('/add', staffPanel.isAuthenticated, (req, res) => __awaiter(this, void 0, void 0, function* () {
            vehicle_1.default.new({
                owner: req.body.owner,
                vehicle: req.body.vehicle,
                access: req.body.access,
                date: moment_1.default()
            });
            res.redirect("/");
            staffPanel.Logger(`${req.user.username} (${req.user.id}) just added ${req.body.vehicle} to the blacklist.`);
        }));
        this.router.post('/delete', staffPanel.isAuthenticated, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield vehicle_1.default.delete({ _id: req.body.vehicleID });
            staffPanel.Logger(`${req.user.username} (${req.user.id}) just deleted ${data.vehicle} from the blacklist.`);
            res.redirect("/");
        }));
        this.router.post('/edit', staffPanel.isAuthenticated, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const vehicle = yield vehicle_1.default.get({ _id: req.body.vehicleID });
            vehicle.owner = req.body.owner || vehicle.owner;
            vehicle.vehicle = req.body.vehicle || vehicle.vehicle;
            if (req.body.access) {
                if (typeof req.body.access === "string") {
                    vehicle.access = [req.body.access];
                }
                else {
                    vehicle.access = req.body.access;
                }
                ;
            }
            else
                vehicle.access = [];
            yield vehicle.save();
            console.log(req.body);
            res.redirect("/");
            staffPanel.Logger(`${req.user.username} (${req.user.id}) just modified ${req.body.vehicle}.`);
        }));
    }
    ;
}
;
exports.default = HomeController;
