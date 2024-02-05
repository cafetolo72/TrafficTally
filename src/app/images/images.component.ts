import { Component, EventEmitter, Input, OnChanges, SimpleChanges, Output } from '@angular/core';
import { ArrayImg, DataImg, penguin } from '../constantsImg';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css']
})
export class ImagesComponent implements OnChanges {
  @Input() currentImg: DataImg = penguin;
  @Output() selected = new EventEmitter<DataImg>();
  selectedImage : DataImg  = penguin;
  imageList: Array<DataImg> = ArrayImg;
  showMenu = false;
  isMovil : boolean = true;
  
  constructor() {}
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentImg']) {
      this.selectedImage = changes['currentImg'].currentValue;
    }
  }

  onImageSelected(data: DataImg) {
    this.selectedImage = data;
    this.selected.next(this.selectedImage);
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  hideMenu() {
    this.showMenu = false;
  }
}

