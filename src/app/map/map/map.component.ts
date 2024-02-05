import { AfterViewInit, Component, ComponentFactoryResolver, EventEmitter, Injector, Input, OnChanges, OnDestroy, Output, SimpleChanges} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.heat';
import { ArrayMaps, CartoCdn, MapsInterface } from '../constants-maps';
import { FirebaService } from 'src/app/services/fireba.service';
import { Database } from 'src/app/services/db/database';
import 'leaflet-routing-machine';
import { CustomMarker } from 'src/app/marker/custom-marker';
import { ListenersService } from 'src/app/services/listeners.service';
import { MatDialog } from '@angular/material/dialog';

enum StatesEnum{
  add = "Add",
  edit = "Edit",
  remove = "Remove",
  none = "none"
}

interface State{
  name : StatesEnum,
  icon: string
}
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Output() reset = new EventEmitter<boolean>();
  @Output() clickMap = new EventEmitter<boolean>();
  @Input() isShowSettings: boolean = false;
  @Input() searchText = "";
  @Input() index = 0;
  public map!: L.Map;
  private markers: CustomMarker;
  public isMyPosition : boolean = false;
  private markPosition: L.Marker | undefined;
  private circlePosition: L.Circle | undefined;
  public isChangeMap : boolean = false;
  public arrayMaps = ArrayMaps;
  public currentMap : MapsInterface = CartoCdn;
  public isForMarker = false;
  public isExpanded : boolean = false;
  public isOpenEdit : boolean = false;
  public isHeat : boolean = false;
  public currentState : StatesEnum = StatesEnum.none;
  private testHeat!: L.HeatLayer; 
  public states : State[] = [{
    name: StatesEnum.add,
    icon : "fa-plus-circle",
  },{
    name: StatesEnum.edit,
    icon : "fa-edit",
  },
  {
    name: StatesEnum.remove,
    icon : "fa-trash",
  },
]

  constructor(private firebase: FirebaService, 
    private componentFactoryResolver: ComponentFactoryResolver,
    private dialog: MatDialog,
    private injector: Injector){
    this.markers = new CustomMarker(this.firebase, componentFactoryResolver, injector, dialog);
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.map.on('click', (e: L.LeafletMouseEvent) => this.onMapClick(e));
    this.map.on('zoomend',(e)=> Database.saveZoom(e.target.getZoom().toString()));
    this.map.on('moveend', (event) => Database.saveCoordenates(event.target._lastCenter));
  }
  
  private initMap(): void{
    this.map = L.map('map', {
      center: this.getCoordenates(),
      zoom: this.getZoom(),
      zoomControl: false,
    });
  
    this.getMap();
    this.addLayers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchText'] ) {
      this.searchText = changes['searchText'].currentValue;
      if(this.map) this.searchMark();
    }

    if (changes['index'] ) {
      this.index = changes['index'].currentValue;
      if(this.map) this.searchMark();
    }
    
    if (changes['isShowSettings'] ) {
      this.isShowSettings = changes['isShowSettings'].currentValue;
      this.isChangeMap = this.isChangeMap && !this.isShowSettings ? this.isShowSettings : this.isChangeMap;
    }
  }

  private getMap(){
    const mp = Database.getItem('map');
    if(mp){
      this.currentMap = this.arrayMaps.filter(item=> item.name == mp)[0];
      this.setMap(this.currentMap);
    }else{
      this.setMap(CartoCdn);
    }
  }
  
  private getZoom(): number{
    const zoom = Database.getItem('zoom');
    return zoom ? (Number(zoom)) : 16;
  }

  private getCoordenates(): L.LatLng{
    const coor = Database.getItem('coordenates');
    return coor ? JSON.parse(coor) : new L.LatLng(38.34388016548309,  -0.4924999248518215);
  }
  
  public setMap(map: MapsInterface){
    this.map.eachLayer((layer: any) => {
      if (layer instanceof L.TileLayer) {
        this.map.removeLayer(layer);
      }
    });
    Database.saveMap('map', map.name);
    map.tile.addTo(this.map);
  }
  
  private addLayers(){
    ListenersService.getInstance().getListenerCross().subscribe(arr => {
      
      if(arr.mark && arr.mark instanceof L.Marker){
        this.removeMarker(arr.mark);
      }else{ 
        if(!arr.isRemove){
          L.layerGroup([...arr.cross]).addTo(this.map);
        }else{
          arr.cross.forEach( (item: L.Marker) => this.map.removeLayer(item));
        }
      }
    })
  }
  
  onOpenEdit(){
    this.isOpenEdit = !this.isOpenEdit;
    this.currentState = StatesEnum.none;
    this.markers.editMarker(false);
    this.markers.isRemoveMarker(false);
  }
  
  public changeMap(){
    this.isChangeMap = !this.isChangeMap;
  }
  
  private onMapClick = (e: L.LeafletMouseEvent) => {
    this.isChangeMap = false;
    this.clickMap.next(true);
    this.eventCloseMap();
    this.addMarker(e);
  }
  
  public addMarker(e: L.LeafletMouseEvent){
    if(this.currentState == StatesEnum.add){
      const mark = this.markers.newMarker(e.latlng);
      this.map.addLayer(mark);
    }
  }
  
  public removeMarker(mark: L.Marker){
    if(mark){
      this.map.eachLayer((layer) => {
        if (layer instanceof L.Marker && layer.getLatLng().equals(mark.getLatLng())) {
          this.map.removeLayer(layer);
        }
      });
    }
  }
  
  public openMenu(){
    this.isMyPosition = !this.isMyPosition;
    if(this.isMyPosition){
      this.listenerLocate();
    }else{
      this.removeLocation();
    }
  }
  
  private removeLocation(){
    if(this.markPosition && this.circlePosition){
      this.map.removeLayer(this.markPosition)
      this.map.removeLayer(this.circlePosition)
      this.markPosition = undefined;
      this.circlePosition = undefined;
    }
  }
  
  private listenerLocate(){
    this.map.locate({setView:true, maxZoom:16})
    .on('locationfound', (e)=>{
      if(!this.markPosition){
        this.markPosition =  L.marker(e.latlng);
        this.circlePosition = L.circle(e.latlng, 20);
        this.map.addLayer(this.markPosition);
        this.map.addLayer(this.circlePosition)
      }
    }).on('locationerror',(error)=>{
      console.log(error)
    });
  }
  
  public mapHeat(){
    this.isHeat = !this.isHeat;
    if(this.isHeat){
      let arr: L.HeatLatLngTuple[] = this.markers.getCrosses().map(elem => [
        elem.getCoordinates().lat , elem.getCoordinates().lng, 
        this.getCantidad(elem.getCarsCount()) + this.getCantidad(elem.getVehicleCount()
        )]);
        let maxCount : number = this.obtenerMayorCantidad(arr);
        if (this.map) {
          const optionsHeat = {
            radius: 20,
            blur: 10,
            maxZoom: 16,
            gradient: {
              0.4: 'blue',
              0.65: 'yellow',
              1: 'red'
            },
            max: maxCount,
          };
          this.testHeat = L.heatLayer(arr, optionsHeat);
          this.testHeat.addTo(this.map);
        }
      }else{
        this.map.removeLayer(this.testHeat);
      }
    }
    
    private obtenerMayorCantidad(arr: L.HeatLatLngTuple[]): number {
      const mayorCantidad = arr.reduce((max, dato) => Math.max(max, dato[2]), 0);
      return mayorCantidad;
    }
    
    private getCantidad(map: Map<string,number>): number{
    const cantidades = Array.from(map.values());
    const sumaTotal = cantidades.reduce((acumulador, cantidad) => acumulador + cantidad, 0);
    
    return sumaTotal;
  }
  
  searchMark(){
    const lowerSearchText = this.searchText.toLowerCase();
    const crosses = this.markers.getCrosses();
    
    if (crosses) {
      const matchingCross = crosses.filter(elem =>
        elem.getName().trim().toLowerCase() == lowerSearchText.trim() ||
        elem.getStreets().some(street => street.toLowerCase().includes(lowerSearchText))
        );
        if (matchingCross?.length > 0 && lowerSearchText != "") {
          if(this.index < matchingCross.length){
            this.map.setView(matchingCross[this.index].getCoordinates(), 20);
          }else{
            this.index = 0;
            this.reset.emit(true);
          }
        } else {
          this.map.setView([38.34388016548309, -0.4924999248518215], 17);
        }
      }
    }

    public changeState(state: StatesEnum){
      this.currentState = this.currentState == state ? StatesEnum.none : state;
      
      switch(this.currentState){
        case StatesEnum.add : this.editMarker(false); break
        case StatesEnum.edit : this.editMarker(true); break
        case StatesEnum.remove : this.markers.isRemoveMarker(true); break;
        default : this.markers.isRemoveMarker(false); break;
      }
    }
    
    public editMarker(is: boolean){
      this.markers.editMarker(is);
    }
    
    eventCloseMap(){
      ListenersService.getInstance().eventCloseMap();
    }
    
    isClc(){
      this.isExpanded = !this.isExpanded;
    }

    ngOnDestroy(): void {}
}
