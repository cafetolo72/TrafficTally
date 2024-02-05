import * as L from 'leaflet';
import { Crosses, StateMarker } from '../crosses';
import { FirebaService } from '../services/fireba.service';
import { TimerComponent } from '../timer/timer.component';
import { Database } from '../services/db/database';
import { ListenersService } from '../services/listeners.service';
import { ComponentFactoryResolver, Injector } from '@angular/core';
import { PopupComponent } from './popup/popup.component';
import { DecoderLatLng } from '../map/DecoderLatLng';
import { AlertComponent } from '../alert/alert.component';
import { MatDialog } from '@angular/material/dialog';

export class CustomMarker{
  private arrMarkers : Array<L.Marker> = new Array();
  private crosses : Array<Crosses> = new Array();
  private decoderLatLng = new DecoderLatLng();
  private isEdit : boolean = false;
  private isRemove:boolean = false;
  private currentUuid: string  = "";

  icon : L.Icon = L.icon({
    iconSize: [ 25, 41 ],
    iconAnchor: [ 13, 0 ],
    iconUrl: '&#xf3c5',
    shadowUrl: '&#xf3c5'
  });

  constructor(private fireba : FirebaService,
     private componentFactoryResolver: ComponentFactoryResolver,
     private injector: Injector,
     private dialog: MatDialog){
      this.listenerUser();
    }

  async listenerUser() {
    ListenersService.getInstance().getListenerUser().subscribe(async value => {
      if(value){
        this.getCrossesDB();
      }else{
        ListenersService.getInstance().listenerCross(this.arrMarkers, true);
      }
      this.currentUuid = value;
    });
  }

  private getCrossesDB(){
    this.crosses = new Array();
    this.arrMarkers = new Array();
    this.fireba.getCrosses().then(crosses => {
      for(let cross of crosses){
        if(cross instanceof Crosses){
          this.setMarker(this.getMarkerByCross(cross), cross);
        }
      }
      ListenersService.getInstance().listenerCross(this.arrMarkers, false);
    });
  }
  
  setMarker(marker: L.Marker , cross: Crosses){
   this.#listenerMarker(marker, cross);
   this.arrMarkers.push(marker);
   this.crosses.push(cross);
  }

  getMarkers(): Array<L.Marker>{
   return this.arrMarkers;
  }

  getCrosses(): Array<Crosses>{
   return this.crosses;
  }

  newMarker(latlng: L.LatLng): L.Marker{
    const id = this.getNewId();
    const cross = Crosses.dummy(id, `p${id + 1}`, latlng);
    const marker = this.getMarkerByCross(cross);

    const tool = L.tooltip({permanent: true, direction: 'top', className: 'tooltipC'}).setContent('Building');
    marker.bindTooltip(tool).openTooltip();
    
    (async () =>{
      const locations = await this.decoderLatLng.getMultipleStreets(latlng.lat, latlng.lng, 50);
      if(location){
        cross.setStreets(locations.streets);
        cross.setLocation(locations.location);
        if ( locations.streets.length > 1 ) cross.setDirection(Crosses.getDirection2());
        marker.unbindTooltip();
      }
      if(this.currentUuid && this.currentUuid != ""){
        this.fireba.addCross(cross);
        Database.saveCross(cross);
      }
    })();
    
    this.setMarker(marker, cross);
    return marker;
  }

  editMarker(is: boolean){
    this.isEdit = is;
    this.isRemove = false;
   }

  isRemoveMarker(is : boolean){
    this.isRemove = is;
    this.isEdit = false;
  }

  getNewId(): number{
    const max = Math.max(...this.crosses.map(cross=> cross.getId())) + 1;
    return isFinite(max) ? max : 0 ;
  }
  
  #listenerMarker(marker: L.Marker, cross: Crosses){

    marker.addEventListener(('click'), event => {
      if(this.isRemove){
        this.openRememberMeAlert("remove", cross, marker);
      }else{
        const popup = marker.getPopup();
        if(popup){
          popup.setContent(this.createDOM(cross, popup, marker));
        }
      }
    });
  }
  
  #listenerBtnSave(btn: HTMLButtonElement, cross: Crosses, marker: L.Marker, popup: L.Popup){
    btn.addEventListener('click', () => {
      this.stopTimer(cross);
      cross.setState(StateMarker.Save);
      this.fireba.updateCross(cross);
      Database.saveCross(cross);
      marker.setIcon(this.createMarkerIcon(cross.getName(), StateMarker.Save));
      popup.close();
    });
  }

  #listenerBtnClose(popup: L.Popup, btn: HTMLButtonElement){
    btn.addEventListener('click',()=>{
      popup.close();
    });
  }

  private stopTimer(cross: Crosses){
    const timer = TimerComponent.prototype.getInstance();
    timer.stop();
    cross.setTime(timer.getTime());
  }

  getMarkerByCross(cross:Crosses): L.Marker{
    const marker =  L.marker(cross.getCoordinates(), {
      icon: this.createMarkerIcon(cross.getName(), cross.getState()),
    });
    marker.bindPopup(this.createPopUp(cross),{autoClose:false});
    return marker;
  }

  createPopUp(cross:Crosses):L.Popup{
    const popup =  L.popup({interactive:true, closeOnClick: false, closeButton:false})
    .setLatLng(cross.getCoordinates());
    return popup;
  }

  createDOM(cross:Crosses, popup: L.Popup, marker: L.Marker):L.Content{
    
    const divMain = document.createElement("div");
    divMain.style.marginLeft = '2px';
    const parrafMain = this.getParrafMain(cross, '14px');
    divMain.appendChild(parrafMain);
    
    const btnClose = this.getBtnClose();  
    this.#listenerBtnClose(popup, btnClose);
    divMain.appendChild(btnClose);

    const divSave = this.getDivBtnSave(cross, marker, popup);

    for( const [i, street] of cross.getDirections().entries()){
      let stret = cross.getStreets()[street.street]
      const parrafStreet = this.getParrafStreet(cross, street.street, '18px');
      divMain.appendChild(parrafStreet);
      for (const [index, s] of street.directions.entries()) {
        const counter = this.newCounterPopup(cross, s, stret, street.color, i, index);
        divMain.appendChild(counter);
      }
    }

    divMain.appendChild(divSave);
    
    return divMain;
  }

  newCounterPopup(cross: Crosses, streetDirection: string, street: string, color: string, indexStreet : number, index: number): HTMLElement {
    const factory = this.componentFactoryResolver.resolveComponentFactory(PopupComponent);
    const componentRef = factory.create(this.injector);
    const counterPopupInstance = componentRef.instance as PopupComponent;
    counterPopupInstance.color = color;
    counterPopupInstance.cross = cross;
    counterPopupInstance.direction = streetDirection;
    counterPopupInstance.street = street;
    counterPopupInstance.isEdit = this.isEdit;
    counterPopupInstance.index = index;
    counterPopupInstance.indexDir = indexStreet;
    counterPopupInstance.init();
    componentRef.hostView.detectChanges();
    const element = (componentRef.hostView as any).rootNodes[0] as HTMLElement;
    return element;
  }

  openRememberMeAlert( text : string ,cross : Crosses, marker: L.Marker): void {
    const dialogRef = this.dialog.open(AlertComponent, {
      data: { type: text, cross: cross.getName() }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        if(result){
          const mark = this.arrMarkers.filter(mrk=> mrk.getLatLng().equals(marker.getLatLng())).shift();
          this.crosses.filter(crs => crs == cross).shift();
          Database.removeCross(cross.getId());
          this.fireba.removeCross(cross.getId().toString());
          ListenersService.getInstance().listenerCross(this.arrMarkers, true, mark);
        }
      }
    });
  }

  createMarkerIcon(point:string, color: StateMarker = StateMarker.NotSave):L.DivIcon{
    const markerHtmlStyles = `
    background-color: ${color};
    width: 1rem;
    height: 1rem;
    display: block;
    left: -1.5rem;
    top: -1.5rem;
    position: relative;
    border-radius: 3rem 3rem 0;
    transform: rotate(45deg);
    border: 1px solid var(--background-color)`

    const divStyle = `
    display: block;
    position: absolute;
    text-align: center;
    color: black; 
    border-radius: 5px;
    transform: rotate(45deg);
    margin-left: 12px;
    font-weight: 500;
    `;

    const pointStyle = `
    display: block;
    position: relative;
    transform: rotate(-90deg);
    text-align: center;
    color: black; 
    `;
  
    return L.divIcon({
    className: "my-custom-pin",
    iconAnchor: [0, 24],
    popupAnchor: [0, -36],
    html: `<div style="${markerHtmlStyles}" /> <div style="${divStyle}"><p style="${pointStyle}">${point}</p></div>`
    });
  }

  private getParrafMain(cross:Crosses, size: string): HTMLParagraphElement{
    const parraf = document.createElement("input");
    parraf.value = cross.getName();
    parraf.style.width = "100%";
    parraf.style.backgroundColor = 'inherit';
    parraf.style.textAlign = 'center';
    parraf.style.fontSize = size;
    parraf.style.fontWeight = 'blod';
    parraf.style.marginBottom = '10px'
    parraf.style.marginTop = '10px'
    parraf.style.color = 'inherit'
    parraf.style.border = 'none';
    parraf.disabled = !this.isEdit;
    parraf.addEventListener('change', (event) => {
      const val = (event.target as HTMLInputElement).value;
      cross.setName(val);
      this.fireba.updateCross(cross);
      Database.saveCross(cross);
    })
    return parraf;
  }

  private getParrafStreet(cross:Crosses, indexStreet: number, size: string): HTMLParagraphElement{
    const parraf = document.createElement("input");
    parraf.value = cross.getStreets()[indexStreet];
    parraf.style.width = "100%";
    parraf.style.backgroundColor = 'inherit';
    parraf.style.textAlign = 'center';
    parraf.style.fontSize = size;
    parraf.style.fontWeight = 'blod';
    parraf.style.marginBottom = '10px'
    parraf.style.marginTop = '10px'
    parraf.style.color = 'inherit'
    parraf.style.border = 'none';
    parraf.disabled = !this.isEdit;
    parraf.addEventListener('change', (event) => {
      const val = (event.target as HTMLInputElement).value
      cross.setStreet(val, indexStreet);
      this.fireba.updateCross(cross);
      Database.saveCross(cross);
    })
    return parraf;
  }

  private getBtnClose(): HTMLButtonElement{
    const closeBtn = document.createElement("button");
    closeBtn.style.backgroundColor = 'red';
    closeBtn.style.color = 'var(--color-text)';
    closeBtn.textContent = 'X';
    closeBtn.style.right = '10px';
    closeBtn.style.top = '10px';
    closeBtn.style.position = 'absolute';
    closeBtn.style.width = '25px';
    closeBtn.style.height = '25px';
    closeBtn.style.borderRadius = '20px';
    closeBtn.style.border = '0.2px solid var(--background-color)'
    return closeBtn;
  }

  private getDivBtnSave(cross : Crosses, marker: L.Marker, popup: L.Popup): HTMLDivElement {
    const saveBtnContainer = document.createElement("div");
    saveBtnContainer.style.display = "flex";
    saveBtnContainer.style.justifyContent = "flex-end";
    saveBtnContainer.style.marginTop = "10px";
  
    const saveBtn = document.createElement("button");
    saveBtn.style.backgroundColor = 'green';
    saveBtn.style.color = 'white';
    saveBtn.style.border = 'solid 0.5px white';
    saveBtn.style.padding = '8px 16px';
    saveBtn.style.borderRadius = '5px';
    saveBtn.style.cursor = 'pointer';
  
    const icon = document.createElement("i");
    icon.className = "fas fa-save"; 
    icon.style.marginRight = '2px';
  
    saveBtn.appendChild(icon);
    this.#listenerBtnSave(saveBtn, cross, marker, popup);
  
    saveBtnContainer.appendChild(saveBtn);
  
    return saveBtnContainer;
  }
}
