import { LatLng } from "leaflet";
import { Crosses, LocationCross } from "src/app/crosses";

export class Serialize{
    constructor(){}

    public static serializeCross(cross: Crosses): {}{
        return  {
            id: cross.getId(),
            name : cross.getName(),
            streets: cross.getStreets(),
            coordinates: this.serializeLtlg(cross.getCoordinates()),
            directions: cross.getDirections(),
            carsCount: Object.fromEntries(cross.getCarsCount().entries()),
            vehicleCount: Object.fromEntries(cross.getVehicleCount().entries()),
            state: cross.getState().toString(),
            time: cross.getTime(),
            location : this.serializeLocation(cross.getLocation()),
        };
    }
  
    public static serializeLtlg(latlg: LatLng):{}{
      return {
        lat: latlg.lat,
        lng: latlg.lng,
      };
    }
  
    static serializeLocation(location : LocationCross): {}{
      return {
        city : location.city,
        suburb : location.suburb,
        state : location.state,
        country : location.country,
      }
    }

    public static getCurrentTimestamp(): {} {
      return {
        timestamp : Math.floor(Date.now())
      }
    }
}