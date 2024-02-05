import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { StyleService } from './services/style-service.service';
import { FirebaService } from './services/fireba.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'Traffic Tally';
  @Input() reset : boolean = false; 
  public isShowLogin = false;
  public isShowDialog = false;
  public isShowSettingsMap = false;
  public isExpanded: boolean = false;
  public isOpenDash: boolean = false;
  public searchText = "";
  public index: number = 0;

  constructor(private styleService: StyleService, private firebase: FirebaService){}
  
  ngAfterViewInit(): void {
    this.entryKey();
  }

  resetIndex(){
    this.index = 0;
  }

  toggleTheme() {
    this.styleService.toggleTheme();
  }

  expandInput() {
    this.isExpanded = !this.isExpanded;
    let searchField = document.querySelector('.search-field');
    let searchInput = document.getElementById('searchInput') as HTMLInputElement;

    if(searchField && searchInput){
       if(this.isExpanded){
        searchInput.disabled = false;
        searchInput.focus();
      } else {
        searchInput.disabled = true;
        this.searchText = '';
      }
    }
  }

  openSettingsMap(){
    this.isShowSettingsMap = !this.isShowSettingsMap;
  }

  clickMap(event: any){
    this.isExpanded = !event;
  }

  openDash(){
    this.isOpenDash = !this.isOpenDash;
  }

  public showLogin(): void {
    this.isShowDialog = !this.isShowDialog;
  }

  entryKey(){
    const inputElement = document.getElementById('searchInput') as HTMLInputElement;
    if(inputElement){
      inputElement.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
          this.index++;
        }
      });
    }
  }
}

