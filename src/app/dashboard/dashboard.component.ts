import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Database } from '../services/db/database';
import { Crosses } from '../crosses';
import { EchartsConfig, dashType } from './echarts/echartsConfig';

interface DataShow{
  names : Array<string>;
  valuesCars : Array<number>;
  valuesVehicle : Array<number>;
  streets : Map<string, number>
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends EchartsConfig {
  @Output() closed = new EventEmitter<boolean>();
  crosses: Array<Crosses> = new Array();
  dashCenter: dashType = this.getData()[0];
  arr :Array<dashType> = new Array();
  data : any;
  isMobil : boolean = true;
  isMax : boolean = true;
  width : string = "100%";
  height : string = "100%";
  
  
  constructor() {
    super();
    this.getWidth();
    this.arr = this.getData();
    Database.loadDataCrosses().then(() => {
      this.init();
    });
  }

  init(){
    this.load().then(dat => {
      if(dat) this.data = dat;
    });
  }
  
  async load(): Promise<DataShow | null>{
    this.crosses = Database.getCrosses().map(cross => Crosses.build(cross[1]) as Crosses);
    if(this.crosses){
       return  {
        names : this.getNames(),
        valuesCars : this.getCarsCount(),
        valuesVehicle : this.getVehiclesCount(),
        streets : this.getCountStreet(),
      };
    }
    return null;
  }

  getNames(): Array<string>{
    return this.crosses.map(crs => crs.getName())
  }

  getCarsCount(): Array<number>{
    return this.crosses.map(crs => crs.getCarsCount().size < 1 ? 0 : this.getCantidad(crs.getCarsCount()));
  }

  getVehiclesCount(){
    return this.crosses.map(crs => crs.getVehicleCount().size < 1 ? 0 : this.getCantidad(crs.getVehicleCount()));
  }

  getSreets(): Array<string>{
    const allStreets = this.crosses.map(obj => obj.getStreets()).flat();
    const uniqueStreets = [...new Set(allStreets)];
    return uniqueStreets;
  }

  more():Map<string, number>{
    const map : Map<string,number> = new Map();
    this.crosses.filter(cross => cross)

    this.crosses.forEach(crs => {
      
    })
    return map; 
  }

  getCountStreet(): Map<string, number>{
    const map : Map<string, number>= new Map();
    this.crosses.forEach(crs => {
      crs.getStreets().forEach(street => {
        if(!map.has(street)){
          map.set(street, this.getCant(street, crs.getCarsCount()) + this.getCant(street, crs.getVehicleCount()))
        }else{
          let value = map.get(street);
          if(value)
          map.set(street, value += this.getCant(street ,crs.getCarsCount()) + this.getCant(street, crs.getVehicleCount()))
        }
      })
    })
    return map;
  }

  getCant(street: string, map: Map<string,number>): number{
    const mp = new Map();
    for( const [key, value] of map){
      if(key.includes(street)){
        if(!mp.has(street)){
          mp.set(street, value);
        }else{
          let cant = mp.get(street);
          if(cant) mp.set(street, cant += value);
        }
      }
    }
    return this.getCantidad(mp);
  }

  private getCantidad(map: Map<string,number>): number{
    const cantidades = Array.from(map.values());
    const sumaTotal = cantidades.reduce((acumulador, cantidad) => acumulador + cantidad, 0);
    return sumaTotal;
  }

  changeCenter(event: dashType){
    this.dashCenter = event;
  }

  getWidth(){
    this.isMobil = screen.width < 768 ? true : false;
  }
}
