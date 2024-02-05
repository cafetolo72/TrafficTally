import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

enum types{
  login = "login",
  remove = "remove",
  none = "none",
}

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  stateType : types = types.none
  rememberMe: boolean = false;
  form: FormGroup;
  title: string = "";
  question : string = "";
  check : string = "";

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.stateType = data.type;
    this.form = new FormGroup({
      rememberMe: new FormControl(data.rememberMe || false)
    });
    this.buildData(data.cross)
  }

  buildData(txt : string){
    switch(this.stateType){
      case types.login : {
        this.title = "Recuérdame";
        this.question = "¿Deseas mantener la sesión activa?";
        this.check = "Recuérdame";
        break;
      }
      case types.remove : {
        this.title = "Borrando";
        this.question = `¿Estás seguro de borrar el cruce: ${txt} ?`;
        this.check = "Borrar"
        break;
      }
    }
  }

}
