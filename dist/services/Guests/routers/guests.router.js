"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuestsRouter = void 0;
const router_1 = require("../../../shared/routing/router");
const guests_controller_1 = require("../controllers/guests.controller");
class GuestsRouter extends router_1.BaseRouter {
    constructor() {
        super(guests_controller_1.GuestsController);
    }
    routes() {
        this.router.post('/upload', (req, res) => this.controller.uploadGuestInformation(req, res));
        this.router.get('/guest', (req, res) => this.controller.getGuestInformation(req, res));
        this.router.put('/guest/:id', (req, res) => this.controller.updateGuestInformation(req, res));
        this.router.put('/guest/confirmation/:id', (req, res) => this.controller.updateGuestConfirmation(req, res));
        this.router.post('/guest', (req, res) => this.controller.createGuest(req, res));
    }
}
exports.GuestsRouter = GuestsRouter;
