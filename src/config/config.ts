import * as dotenv from 'dotenv'

export abstract class ConfigServer {
    constructor(){
        const nodeNameEnv = this.createPathEnv(this.nodeEnv);
        dotenv.config({ path: nodeNameEnv})
    }

    public getEnviroment(key: string){
        if(key === 'NODE_ENV') return '';
        const result = process.env[key]
        if(!result) console.log('No se encontro variable de entorno: ', key);
    }

    public get nodeEnv(): string {
        return this.getEnviroment('NODE_ENV')?.trim() || ''
    }

    public createPathEnv( path: string): string {
        const arrEnv: string[] = ["env"];

        if(path.length > 0){
            const stringToArray = path.split('.');
            arrEnv.unshift(...stringToArray)
        }

        return '.' + arrEnv.join('.')
    }
}