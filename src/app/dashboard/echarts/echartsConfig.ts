export interface dashType{
    id : string,
    name: string,
    icon: string,
    type : string,
    typeChart : string,
}
   
export class EchartsConfig{
   private table : dashType = {
      id : "table",
      name: "Table",
      icon : "fa-table",
      type : "table",
      typeChart :"none",
   };
   
   private pie : dashType = {
      id : "pie",
      name: "Pie",
      icon : "fa-chart-pie",
      type :  "chart",
      typeChart :"pie",
   };
     
   private line : dashType = {
      id : "line",
      name: "Line",
      icon : "fa-chart-line",
      type :  "chart",
      typeChart : "line",
   };

   private bar : dashType = {
      id : "bar",
      name: "Bar",
      icon : "fa-chart-bar",
      type :  "chart",
      typeChart : "bar",
   };
   
   constructor(){}

   getData(): Array<dashType>{
      return Object.values([this.table, this.pie, this.line, this.bar])
   }
    
   static createMap(x: Map<string, number>): Array<any>{
      return Array.from(x.entries()).map(([name, max]) => ({name : name, max : max}));
   }

   static getMax(arr: Array<number>): number {
      const mayorCantidad = arr.reduce((max, dato) => Math.max(max, dato), 0);
      return mayorCantidad;
   }
}