import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { WidgetPositionService } from './widget-position';

@Component({
  selector: 'app-widget-container',
  templateUrl: './widget-container.component.html',
  styleUrls: ['./widget-container.component.css']
})
export class WidgetContainerComponent implements OnInit {
  @Output() closed = new EventEmitter<boolean>();
  @Input() columns = 1;
  @Input() id : string = "";
  @Input() left: number = 0;
  @Input() top: number = 0;
  @Input() width: string = "300px";
  @Input() height: string = "200px";
  isMobil : boolean = true;
  isMax: boolean = true;
  isDragging: boolean = false;
  lastX: number = 0;
  lastY: number = 0;
  isVisible: boolean = false;

  constructor() {
    WidgetPositionService.load();
  }
  
  ngOnInit(): void {
    WidgetPositionService.getWidgetComponentPosition(this.id).then(data=>{
      if (data) {
        this.left = data.left;
        this.top = data.top;
        this.isMax = data.isMax;
        this.width = data.width;
        this.height = data.height;
      }
      this.init();
      this.isVisible = true;
    });
  }

  onMouseDown(event: MouseEvent | TouchEvent): void {
    event.stopPropagation();
      this.isDragging = true;
      this.lastX = this.getClientX(event);
      this.lastY = this.getClientY(event);
  }

  onMouseMove(event: MouseEvent | TouchEvent): void {
    if (this.isDragging && !this.isMax && !this.isMobil) {
     
     
      const deltaX = this.getClientX(event) - this.lastX;
      const deltaY = this.getClientY(event) - this.lastY;
      this.left += deltaX;
      this.top += deltaY;
      this.lastX = this.getClientX(event);
      this.lastY = this.getClientY(event);
    }
  }

  onMouseUp(): void {
    if (this.isDragging) {
      this.isDragging = false;
      WidgetPositionService.addWidgetComponent(this.id, this.left, this.top, this.width, this.height, this.isMax);
    }
  }

  private getClientX(event: MouseEvent | TouchEvent): number {
    return event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
  }

  private getClientY(event: MouseEvent | TouchEvent): number {
    return event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
  }

  ale(event: any){
  console.log("🚀 ~ file: widget-container.component.ts:84 ~ WidgetContainerComponent ~ ale ~ event:", event)
  }

  toggleMenu() {
    this.closed.emit(true);
  }

  resize(event : any){
    this.isMax = event;

    if(this.isMax){
      this.width = this.height = "100%";
      this.top = this.left = 0;
    }else{

      if(this.tablet()){
        this.width = "80%";
        this.height = "85%";
      }else {
        this.width = "60%";
        this.height = "85%";
      }
    }
  }

  move(event : MouseEvent | TouchEvent){
    const y = this.getClientY(event);
  }

  init(){
    if(this.mobil()){
      this.width = this.height = "100%";
      this.top = this.left = 0;
    }
  }

  mobil(): boolean{
    return this.isMobil = screen.width < 768;
  }

  tablet() : boolean{
    return screen.width < 1050;
  }
}
