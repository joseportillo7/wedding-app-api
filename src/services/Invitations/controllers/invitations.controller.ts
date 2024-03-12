import { Request, Response } from 'express'
import * as sqlite3 from 'sqlite3';
import { members } from '../../../data/members';
import { Members } from "../../../interfaces/members";

export class InvitationsController {
    constructor(){}

    async uploadMembersInformation(req: Request, res: Response){
        try {
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

            // Inicializar los datos (esto solo se hace la primera vez)
            members.forEach((invitado) => {
                console.log(invitado.Name);
            db.run(`
                INSERT INTO Invitados (Name, Relation, Confirmation, IsGroomsman, IsBridesmaid)
                VALUES (?, ?, ?, ?, ?)`, [invitado.Name, invitado.Relation, invitado.Confirmation, invitado.IsGroomsman, invitado.IsBridesmaid]);
            });

            // Cerrar la conexión a la base de datos al finalizar
            db.close();

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

    async getMembersInformation(req: Request, res: Response){
        try {   
            
            const { name } = req.query;
            
            //Consulta con toda la informacion
            const data_members = await this.ejecutarConsulta(`select * from Invitados`)

            
            // Consultar todos los invitados
            const  filtered_members : Members [] = await this.ejecutarConsulta(`select * from Invitados where Name like '%${name}%'`)            

            // Consultar los datos filtrados por parametro 'name'
            const result_members = data_members.filter((member:Members)=>filtered_members[0].Relation === member.Relation)

            res.status(200).json({message: "Consulta realizada con exito!", data: result_members})
            
        } catch (error) {
            console.log(error);
        }
    }
    
}