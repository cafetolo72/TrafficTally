import { Crosses } from "../../crosses";
import { Serialize } from "./cross-seralize";

export class Database {
    private static readonly localCross = 'crossess';
    private static crosses: { [key: string]: {} } = {};

    public static saveCross(cross: Crosses){
        Database.crosses[cross.getId()] = Serialize.serializeCross(cross);
        localStorage.setItem(this.localCross, JSON.stringify(this.crosses));
    }

    static async loadDataCrosses() {
        const stored =  Database.getItem(Database.localCross);
        if (stored) {
          Database.crosses = JSON.parse(stored);
        }
    }

    public static getCrosses(): any[]{
        return Object.entries(Database.crosses);
    }

    public static removeCross(id : number){
        if(Database.crosses.hasOwnProperty(id)){
            delete Database.crosses[id];
            localStorage.setItem(this.localCross, JSON.stringify(Database.crosses));
        }
    }

    public static saveWidget(name : string, data: any){
        localStorage.setItem(name, JSON.stringify(data));
    }

    public static saveTime(data: any){
        localStorage.setItem('timestamp', JSON.stringify(data));
    }

    public static saveStyle(name: string, data:string){
        localStorage.setItem(name, data);
    }

    public static saveMap(name: string, data:string){
        localStorage.setItem(name, data);
    }

    public static saveZoom(data:string){
        localStorage.setItem('zoom', data);
    }

    public static saveCoordenates(data: string){
        localStorage.setItem('coordenates', JSON.stringify(data));
    }

    public static setCurrentUser(name : string, data: string){
        localStorage.setItem(name, data);
    }

    public static getItem(name : string):string | null{
        return localStorage.getItem(name);
    }

    public static remove(name: string){
        localStorage.removeItem(name);
    }
}