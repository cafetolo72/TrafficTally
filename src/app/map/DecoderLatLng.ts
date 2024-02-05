import axios from 'axios';
import 'leaflet-routing-machine';
import { LocationCross } from '../crosses';


export class DecoderLatLng{
    private streets: string = "";

    async getStreets(latitud: number, longitud: number): Promise<{street : string, location : LocationCross} | null> {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitud}&lon=${longitud}`;
      try {
        const response = await axios.get(url);
        const address = response.data.address;
        const road = address.road || '';
        const suburb = address.suburb || '';
        const city = address.city || '';
        const state = address.state || '';
        const country = address.country || '';
    
        const calles = [road, suburb, city, state, country].filter(Boolean);
        return {
          street : road,
          location :{
            suburb: suburb,
            state : state,
            city : city,
            country : country,
          }
        };
      } catch (error) {
        console.error('Error al obtener las calles cercanas:', error);
        return null;
      }
    }

    async getMultipleStreets(latitud: number, longitud: number, radius: number): Promise<{streets : Array<string>, location: LocationCross}> {
      let locations!: LocationCross;
      let counter : Map<string, number>= new Map();
      const numPoints = 10;
      
      for (let i = 0; i < numPoints; i++) {
        const angle = (Math.random() * 360) * (Math.PI / 180);
        const distance = Math.random() * radius;
        const lat = latitud + (distance / 111320) * Math.cos(angle);
        const lon = longitud + (distance / (111320 * Math.cos(latitud * (Math.PI / 180)))) * Math.sin(angle);
    
        const calles = await this.getStreets(lat, lon);
        if(calles){
          counter = this.filterMax(counter, calles.street);
          locations = calles.location;
        }
      }
      const sorted =  Array.from(counter.entries()).sort((a, b )=> a[1] - b[1])
                                                  .map(elem => elem[0])
                                                  .filter(item => item != "")
                                                  .reverse();

      return {streets: sorted, location: locations};
    }

    filterMax(array : Map<string,number>, current : string): Map<string, number>{
      if(!array.has(current)){
        array.set(current, 1);
      }else{
        array.forEach((value, key) => {
           if(key == current){
            	array.set(key, ++value);
        	}
        })
      }
      return array;
    }
}