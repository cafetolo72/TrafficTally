import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map/map.component';
import { MatIconModule} from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule} from '@angular/material/button';
import { MatSelectModule} from '@angular/material/select';
import { MatInputModule} from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { ImagesComponent } from './images/images.component';
import { WidgetContainerComponent } from './widget-container/widget-container.component';
import { AlertComponent } from './alert/alert.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PopupComponent } from './marker/popup/popup.component';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
import { ChartBaseComponent } from './dashboard/echart-base/echart-base.component';
import { MatTableModule } from '@angular/material/table';
import { TableComponent } from './dashboard/table/table.component';

import {MatPaginatorModule} from '@angular/material/paginator';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    LoginComponent,
    ImagesComponent,
    WidgetContainerComponent,
    AlertComponent,
    PopupComponent,
    DashboardComponent,
    ChartBaseComponent,
    TableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatDividerModule,
    MatChipsModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTabsModule,
    MatCheckboxModule,
    DragDropModule,
    MatToolbarModule,
    MatTooltipModule,
    MatButtonToggleModule,
    MatTableModule,
    MatPaginatorModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(()=> getAuth()),
    NgxEchartsModule.forRoot({ echarts }),
  ],
  providers: [ ],
  bootstrap: [AppComponent],
})
export class AppModule { }
