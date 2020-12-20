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
class HomeController {
    constructor(staffPanel) {
        this.path = '/api';
        this.router = express_1.default.Router();
        this.initRoutes(staffPanel);
    }
    ;
    initRoutes(staffPanel) {
        return __awaiter(this, void 0, void 0, function* () {
            this.router.get('/fetch', (req, res) => __awaiter(this, void 0, void 0, function* () {
                const outVehicles = [];
                const vehicles = yield vehicle_1.default.getAll({});
                for (let vehicle of vehicles) {
                    vehicle.access.push(vehicle.owner);
                    outVehicles.push({
                        vehicle: vehicle.vehicle,
                        access: vehicle.access
                    });
                }
                ;
                res.send(outVehicles);
            }));
        });
    }
    ;
}
;
exports.default = HomeController;
