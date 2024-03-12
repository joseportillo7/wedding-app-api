import { Router } from 'express'

export class BaseRouter <C> {
    public router: Router;
    public controller: C;

    constructor(controller: { new (): C }){
        this.router = Router();
        this.controller = new controller();
        this.routes();
    }

    routes() {}
}