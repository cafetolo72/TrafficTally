import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatHeaderRowDef, MatTableDataSource } from '@angular/material/table';
import { Crosses } from 'src/app/crosses';
import { FirebaService } from 'src/app/services/fireba.service';
import { UtilFiles } from 'src/app/utils/util-files';

interface DataShow{
    id : number;
    name :string;
    streets: string,
    city : string,
    state : string,
    country : string,
    carsCount: string,
    vehicleCount: string,
}

@Component({
  selector: 'app-table',
  templateUrl: 'table.component.html',
  styleUrls: ['table.component.css'],
})
export class TableComponent implements OnChanges, OnInit {
  displayedColumns = ['id', 'name', 'streets', 'carsCount', 'vehicleCount', 'city', 'state', 'country'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() data!: any
  @Input() crosses: Array<Crosses> = new Array();
  currentIndex = 0;
  startX = 0;
  dist = 0;
  index : number = 0;
  isMobil : boolean = screen.width < 768;
  currentRow : string = Object.values(this.displayedColumns)[0];
  dataSource = new MatTableDataSource<DataShow>([{
    id : 0, 
    name :'name',
    streets:  '',
    city: '',
    state : '',
    country : '',
    carsCount: "",
    vehicleCount: "",
  }]);
  
  constructor(private firebase: FirebaService){}

  ngOnInit(): void {
    this.dataSource.data = this.serializeTable();
  }
  
  ngAfterViewInit() {
    const paginatorIntl = this.paginator._intl;
    paginatorIntl.nextPageLabel = '';
    paginatorIntl.previousPageLabel = '';
    paginatorIntl.firstPageLabel = '';
    paginatorIntl.lastPageLabel = '';
    
    this.dataSource.paginator = this.paginator;
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['crosses']){
      this.crosses = changes['crosses'].currentValue;
      if(this.crosses && this.crosses.length >=1){
        this.dataSource.data =  this.serializeTable();
      }
    }
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  serializeTable(): Array<DataShow>{
    const data: Array<DataShow> = new Array();
    this.crosses.forEach(cross => {
      data.push({
        id: cross.getId(),
        name : cross.getName(),
        streets : this.formatText(cross.getStreets().join("\n\r")),
        city: cross.getLocation().city,
        state : cross.getLocation().state,
        country : cross.getLocation().country,
        carsCount: this.map2Str(cross.getCarsCount(), cross.getStreets()),
        vehicleCount :  this.map2Str(cross.getVehicleCount(), cross.getStreets())
      })
    });
    return data;
  }

  map2Str(map : Map<string, number>, streets : Array<string>) : string{
    const str =  Array.from(map.entries())
    .map(([key, value]) => ({
      name :  this.splitStr(key, streets, value),
      index : this.index
    }))
    .sort((a, b) => a.index - b.index)

    return str.map(line => line.name ).join('<br>');
  }

  splitStr(str: string, streets: Array<string>, value : number): string{
    let i = 0;
    streets.forEach(street => {
      if(str.includes(street)){
        this.index = i;
        str = str.replace(street, "");
        str = this.fomat(str, i).concat(": ").concat(this.fomat(value.toString(), i));
      }
      i++
    })
    return str;
  }
  
  formatText(text: string): string {
    const parts = text.split('\n\r');
    let i = -1;
    return parts.map(part => {
      i++;
      return this.fomat(part, i);
    }).join('<br>');
  }

  fomat(str: string, i: number): string{
    return `<span class='colored-text${i}'>${str}</span>`
  }

  changeRow(event : string){
    this.currentRow = event;
  }

  public downloadCSVByDB(){
    this.firebase.getCrosses().then((data: any) => {
      UtilFiles.convertToCSV(data);
    });
  }
}