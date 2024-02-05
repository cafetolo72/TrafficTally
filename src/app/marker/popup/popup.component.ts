import { ChangeDetectorRef, Component } from '@angular/core';
import { Crosses } from '../../crosses';
import { TimerComponent } from '../../timer/timer.component';
import { Database } from 'src/app/services/db/database';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent{
  public count: number = 0;
  public countVehicle : number = 0;
  cross!: Crosses;
  street: string = "";
  direction: string  = "";
  color: string = "";
  indexDir : number = 0;
  index : number = 0;
  isEdit : boolean = false;
  
  constructor(private cdr: ChangeDetectorRef) { }
  
  public init(){
    const ct = this.cross.getCarsCount().get(`${this.direction} ${this.street}`);
    this.count = ct !== undefined ? ct : this.count;
    
    const ctv = this.cross.getVehicleCount().get(`${this.direction} ${this.street}`);
    this.countVehicle = ctv !== undefined ? ctv : this.countVehicle;
  }

  private startTime(cross: Crosses){    
    if(this.count == 1 || this.countVehicle == 1){
        let timer = TimerComponent.prototype.getInstance();
        timer.start();
        cross.setTime(timer.getTime());
    }
  }
        
  decrementCount = () => {
    if (this.count > 0) {
        this.count--;
        this.#saveData();
        this.cdr.detectChanges();
    }
  };

  incrementCount = () => {
    this.count++;
    this.startTime(this.cross);
    this.#saveData();
    this.cdr.detectChanges();
  };

  incrementCountVehicle = () => {
    this.countVehicle++;
    this.startTime(this.cross);
    this.#saveDataVehicle();
    this.cdr.detectChanges();
  };

  decrementCountVehicle = () => {
    if (this.countVehicle > 0) {
        this.countVehicle--;
        this.#saveDataVehicle();
        this.cdr.detectChanges();
    }
  };
  
  #saveData(){
    this.cross.setCarsCount(`${this.direction} ${this.street}`, this.count);
    Database.saveCross(this.cross);
  }

  #saveDataVehicle(){
      this.cross.setVehicleCount(`${this.direction} ${this.street}`, this.countVehicle);
      Database.saveCross(this.cross);
  }

  changeDirection(){
    this.cross.getDirections()[this.indexDir].directions[this.index] = this.direction;
    Database.saveCross(this.cross);
   }
}
