"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuestsController = void 0;
const sqlite3 = __importStar(require("sqlite3"));
class GuestsController {
    constructor() { }
    uploadGuestInformation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { guests } = req.body;
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
                guests.forEach((guest) => {
                    db.run(`
                INSERT INTO Invitados (Name, Relation, Confirmation, IsGroomsman, IsBridesmaid)
                VALUES (?, ?, ?, ?, ?)`, [guest.Name, guest.Relation, guest.Confirmation, guest.IsGroomsman, guest.IsBridesmaid]);
                });
                // // Cerrar la conexión a la base de datos al finalizar
                // db.close();
                res.json({ message: "Carga realizada con exito!" });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    ejecutarConsulta(consulta) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
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
        });
    }
    getGuestInformation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = req.query;
                //Consulta con toda la informacion
                const data_members = yield this.ejecutarConsulta(`select * from Invitados`);
                // Consultar todos los invitados
                const filtered_members = yield this.ejecutarConsulta(`select * from Invitados where Name like '%${name}%'`);
                if (filtered_members.length === 0 || !filtered_members) {
                    res.json({ message: 'No estas invitado', data: [] });
                }
                else {
                    // Consultar los datos filtrados por parametro 'name'
                    const result_members = data_members.filter((member) => filtered_members[0].Relation === member.Relation);
                    const guest = (result_members.length > 1) ? `${result_members.length} Invitados` : `${result_members.length} Invitado`;
                    res.status(200).json({ guest: guest, data: result_members });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    updateGuestInformation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { Name, Relation } = req.query;
                yield this.ejecutarConsulta(`update Invitados set Name = '${Name}', Relation = ${Number(Relation)} where id = ${Number(id)}`);
                res.status(200).json({
                    message: "Registro actualizado correctamente"
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    updateGuestConfirmation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { Confirmation } = req.body;
                yield this.ejecutarConsulta(`update Invitados set Confirmation = ${Number(Confirmation)} where id = ${Number(id)}`);
                res.status(200).json({
                    message: "Confirmacin realizada con exito"
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    createGuest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { Name, Relation, Confirmation, IsGroomsman, IsBridesmaid } = req.body;
                //Consultar el ultimo id que ha sido creado en base de datos
                const query_last_id = 'select MAX(id) as lastId from Invitados';
                const lastID = (yield this.ejecutarConsulta(query_last_id))[0].lastId + 1;
                //Realizar el insert a Invitados
                const query = `insert into Invitados(id, Name, Relation, Confirmation, IsGroomsman, IsBridesmaid)
                           values(${lastID}, '${Name}', ${Relation}, ${Confirmation}, ${IsGroomsman}, ${IsBridesmaid})`;
                const result = yield this.ejecutarConsulta(query);
                res.json({ message: 'Se agrego al invitado correctamente!' });
            }
            catch (error) {
                console.log(error);
                res.json({ message: "Error agregando invitado!" });
            }
        });
    }
}
exports.GuestsController = GuestsController;
