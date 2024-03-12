import { BaseRouter } from "../../../shared/routing/router";
import { InvitationsController } from '../controllers/invitations.controller'
import  { Request, Response } from "express"


export class InvitationsRouter extends BaseRouter<InvitationsController>{
    constructor(){
        super(InvitationsController)
    }

    routes(): void {
        this.router.get('/upload', (req: Request, res: Response) => this.controller.uploadMembersInformation(req,res))
        this.router.get('/members',(req: Request, res: Response) => this.controller.getMembersInformation(req,res));
    }
}