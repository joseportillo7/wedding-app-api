import { Request, Response } from 'express'
import * as sqlite3 from 'sqlite3';
import { Guests } from "../../../interfaces/guest";

export class GuestsController {
    constructor(){}

    async uploadGuestInformation(req: Request, res: Response){
        try {
            const { guests } = req.body
            
            // Abrir una conexión a la base de datos (o crearla si no existe)
            const db = new sqlite3.Database('invitados.db');

            // Crear la tabla si no existe
            db.run(`
            CREATE TABLE IF NOT EXISTS Invitados (
                id INTEGER PRIMARY KEY,
                Name TEXT,
                Relation INTEGER,
                Confirmation BOOLEAN,
                IsGroomsman BOOLEAN,
                IsBridesmaid BOOLEAN
            )`);

            // // Inicializar los datos (esto solo se hace la primera vez)
            guests.forEach((guest:Guests) => {
            db.run(`
                INSERT INTO Invitados (Name, Relation, Confirmation, IsGroomsman, IsBridesmaid)
                VALUES (?, ?, ?, ?, ?)`, [guest.Name, guest.Relation, guest.Confirmation, guest.IsGroomsman, guest.IsBridesmaid]);
            });

            // // Cerrar la conexión a la base de datos al finalizar
            // db.close();

            res.json({message: "Carga realizada con exito!"})
        } catch (error) {
            console.log(error);
        }
    }

    async ejecutarConsulta( consulta : string) {
        return new Promise<any[]>((resolve, reject) => {
          // Abrir una conexión a la base de datos (o crearla si no existe)
          const db = new sqlite3.Database('invitados.db');
      
          // Realizar la consulta y almacenar los resultados
          db.all(consulta, [], (error, filas) => {
            if (error) {
              console.error('Error al ejecutar la consulta:', error);
              reject(error);
              return;
            }
      
            // Cerrar la conexión a la base de datos
            db.close();
      
            // Resolver la promesa con los resultados
            resolve(filas);
          });
        });
    }

    async getGuestInformation(req: Request, res: Response){
        try {   
            
            const { name } = req.query;
            
            //Consulta con toda la informacion
            const data_members = await this.ejecutarConsulta(`select * from Invitados`)

            // Consultar todos los invitados
            const  filtered_members : Guests [] = await this.ejecutarConsulta(`select * from Invitados where Name like '%${name}%'`)                  

            if(filtered_members.length === 0 || !filtered_members){
                res.json({message: 'No estas invitado', data: []})
            }else{
                // Consultar los datos filtrados por parametro 'name'
                const result_members = data_members.filter((member:Guests)=>filtered_members[0].Relation === member.Relation)
                
                const guest = (result_members.length > 1) ? `${result_members.length} Invitados` : `${result_members.length} Invitado`


                res.status(200).json({guest: guest, data: result_members})
            }            
            
        } catch (error) {
            console.log(error);
        }
    }

    async getGuestAll(req: Request, res: Response){
        try {
            //Consulta con toda la informacion
            const data_members = await this.ejecutarConsulta(`select * from Invitados`)            
            res.json({message: "Consulta ejecutada correctamente", data: data_members});
        } catch (error) {
            
        }
    }

    async getGuestConfirmation(req: Request, res: Response){
        try {
            const data_members = await this.ejecutarConsulta(`select * from Invitados where Confirmation = 1`)
            const data_members_length = data_members.length
            res.json({message: "Consulta ejecutada correctamente", confirmados: data_members_length, data: data_members})
        } catch (error) {
            res.json({message: "Error ", error})
        }
    }

    async updateGuestInformation(req: Request, res: Response){
        try {
            const { id } = req.params
            const { Name, Relation } = req.query
            await this.ejecutarConsulta(`update Invitados set Name = '${Name}', Relation = ${Number(Relation)} where id = ${Number(id)}`)
            res.status(200).json({
                message: "Registro actualizado correctamente"
            })
        } catch (error) {
            console.log(error);
        }
    }

    async updateGuestConfirmation(req: Request, res: Response){
        try {
            const { id } = req.params
            const { Confirmation } = req.body
            
            await this.ejecutarConsulta(`update Invitados set Confirmation = ${Number(Confirmation)} where id = ${Number(id)}`)
            res.status(200).json({
                message: "Confirmacin realizada con exito"
            })
        } catch (error) {
            console.log(error);
        }
    }

    async createGuest(req: Request, res: Response){
        try {
            const { Name, Relation, Confirmation, IsGroomsman, IsBridesmaid } = req.body

            //Consultar el ultimo id que ha sido creado en base de datos
            const query_last_id = 'select MAX(id) as lastId from Invitados'
            const lastID = (await this.ejecutarConsulta(query_last_id))[0].lastId + 1
            
            //Realizar el insert a Invitados
            const query = `insert into Invitados(id, Name, Relation, Confirmation, IsGroomsman, IsBridesmaid)
                           values(${lastID}, '${Name}', ${Relation}, ${Confirmation}, ${IsGroomsman}, ${IsBridesmaid})`

            const result = await this.ejecutarConsulta(query)
            res.json({message: 'Se agrego al invitado correctamente!'})
        } catch (error) {
            console.log(error);
            res.json({message: "Error agregando invitado!"})
        }
    }
}