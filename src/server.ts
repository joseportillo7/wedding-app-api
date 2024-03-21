import express , { Application } from "express";
import http from 'http'
import cors from 'cors'
import { ConfigServer } from "./config/config";
import { GuestsRouter } from "./services/Guests/routers/guests.router";

class Server extends ConfigServer {
    private app: Application;
    private port: number;
    private server?: http.Server;

    constructor(){
        super();

        this.app = express();
        this.port = Number(process.env.PORT) || 3001
    }

    async connectDB(){
        //code here
    }

    middlewares(){
        this.app.use(cors())

        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true}))
    }

    routes(): express.Router[] {
        return [
            new GuestsRouter().router,
        ];
    }

    async start(){
        try {
            
            //Establecer los middlewares
            this.middlewares()

            //Cargar rutas
            console.log('Estableciendo rutas...');
            this.app.use('/api', this.routes())

            //Inicializar server
            this.server = this.app.listen(this.port, ()=>{
                console.log(`Server running on port: ${this.port}`);
            })
        } catch (error) {
            console.log(error);
        }
    }
}

export default Server;