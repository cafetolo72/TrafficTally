import { DataImg, penguin } from "../constantsImg";
import { Crosses } from "../crosses";

export class User{
    private uuid: string ="";
    private email: string = "";
    private username : string = "";
    private image: DataImg = penguin;

    constructor(){}

    public setUUid(uuid: string){
        this.uuid = uuid;
    }

    public getUuid(){
        return this.uuid;
    }

    public setEmail(email : string){
        this.email = email;
    }

    public getEmail(){
        return this.email;
    }

    public setUserName(username: string){
        this.username = username;
    }

    public getUsername(){
        return this.username;
    }
    
    public setImage(image: DataImg){
        this.image = image;
    }

    public getImage(){
        return this.image;
    }
}