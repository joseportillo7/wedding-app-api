import { BaseRouter } from "../../../shared/routing/router";
import { GuestsController } from '../controllers/guests.controller'
import  { Request, Response } from "express"


export class GuestsRouter extends BaseRouter<GuestsController>{
    constructor(){
        super(GuestsController)
    }

    routes(): void {
        this.router.post('/upload', (req: Request, res: Response) => this.controller.uploadGuestInformation(req,res))
        this.router.get('/guest',(req: Request, res: Response) => this.controller.getGuestInformation(req,res));
        this.router.get('/guest/all', (req: Request, res: Response)=>this.controller.getGuestAll(req,res));
        this.router.put('/guest/:id',(req: Request, res: Response) => this.controller.updateGuestInformation(req,res))
        this.router.put('/guest/confirmation/:id',(req: Request, res: Response) => this.controller.updateGuestConfirmation(req,res))
        this.router.post('/guest',(req:Request, res: Response)=> this.controller.createGuest(req,res))
    }
}