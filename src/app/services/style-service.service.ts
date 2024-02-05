import { Injectable } from '@angular/core';
import { Database } from './db/database';

@Injectable({
  providedIn: 'root'
})
export class StyleService {
  private static readonly nameStyle = 'Styles'
  static isDarkTheme = true;
  backgroundColor = '#e8eaf6';
  color = '#455a64';
  primary = '#3f51b5';
  secondary = '#807f7993';
  btn = "#dde1e7";
  hoverBtn = "#c6cacf";
  selected = "#00FA9A";
  // primary = '#00BFFF';

  constructor(){
    this.getItems();
    this.update();
  }

  static isDarkThemeStyle(): boolean{
    return this.isDarkTheme;
  }

  toggleTheme() {
    StyleService.isDarkTheme = !StyleService.isDarkTheme;
    if (StyleService.isDarkTheme) {
      this.backgroundColor = '#455a64';
      this.color = '#e8eaf6';
      this.secondary = '#6e717275';
      this.primary ='#00FFFF';
      this.selected = "#3CB371";
    } else {
      this.backgroundColor = '#e8eaf6';
      this.color = '#455a64';
      this.primary ='#3f51b5';
      this.secondary = '#807f7993';
      this.selected = "#00FA9A";
    }
    this.update();
  }

  update(){
    document.documentElement.style.setProperty('--background-color', this.backgroundColor);
    document.documentElement.style.setProperty('--color-text', this.color);
    document.documentElement.style.setProperty('--primary', this.primary);
    document.documentElement.style.setProperty('--secondary', this.secondary);
    document.documentElement.style.setProperty('--color-btn', this.btn);
    document.documentElement.style.setProperty('--hover-btn', this.hoverBtn);
    document.documentElement.style.setProperty('--selected', this.selected);
    Database.saveStyle(StyleService.nameStyle, this.createLocal());
  }

  private createLocal():string{
    return  JSON.stringify({
      isDark : StyleService.isDarkTheme,
      backgroundColor: this.backgroundColor,
      color: this.color,
      primary : this.primary,
      secondary: this.secondary,
      colorBtn : this.btn,
      hover:this.hoverBtn,
      selected: this.selected,
    });
  }

  private getItems(){
    const item = Database.getItem(StyleService.nameStyle);
    if(item){
      const {backgroundColor, color, secondary, isDark, colorIcon, primary, btn, hover, selected } = JSON.parse(item);
      StyleService.isDarkTheme = isDark;
      this.backgroundColor = backgroundColor !=  null ? backgroundColor: this.backgroundColor;
      this.color = color !=  null ? color: this.color;
      this.primary = primary !=  null ? primary: this.primary;
      this.secondary = secondary !=  null ? secondary: this.secondary;
      this.btn = btn != null ? btn : this.btn;
      this.hoverBtn = hover != null ? hover : this.hoverBtn;
      this.selected = selected != null ? selected : this.selected;
    }
  }
}

