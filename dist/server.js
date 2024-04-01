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
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config/config");
const guests_router_1 = require("./services/Guests/routers/guests.router");
class Server extends config_1.ConfigServer {
    constructor() {
        super();
        this.app = (0, express_1.default)();
        this.port = Number(process.env.PORT) || 3001;
    }
    connectDB() {
        return __awaiter(this, void 0, void 0, function* () {
            //code here
        });
    }
    middlewares() {
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
    }
    routes() {
        return [
            new guests_router_1.GuestsRouter().router,
        ];
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //Establecer los middlewares
                this.middlewares();
                //Cargar rutas
                console.log('Estableciendo rutas...');
                this.app.use('/api', this.routes());
                //Inicializar server
                this.server = this.app.listen(this.port, () => {
                    console.log(`Server running on port: ${this.port}`);
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = Server;
