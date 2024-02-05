import { Component, ElementRef, Input, OnChanges, SimpleChanges} from '@angular/core';
import { ECharts } from 'echarts';
import * as echarts from 'echarts';
import { NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import { Pie } from '../echarts/pie';
import { Line } from '../echarts/line';
import { Bar } from '../echarts/bar';

enum types{
  line = "line",
  bar = "bar",
  radar = "radar",
  multi = "multilevelpie",
  pie = "pie",
  pie2d = "pie2d",
  column2d = "column2d",
  scroll = "scrollstackedcolumn2d",
  stack3d = "stackedcolumn3d",
}

@Component({
  selector: 'app-chart-base',
  templateUrl: './echart-base.component.html',
  styleUrls: ['./echart-base.component.css'],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useFactory: () => ({ echarts: () => import('echarts') })
    },
  ]
})
export class ChartBaseComponent implements OnChanges {
  @Input() width = '100%';
  @Input() height = '300px';
  @Input() type: string = "line";
  @Input() options = {};
  chartOption!: echarts.EChartsOption;
  private echartsInstance: ECharts | null = null;
  private maxNum : number = 0;
  private min : number = 0;

  constructor(private elementRef: ElementRef) {}

  get instance(): ECharts | null {
    return this.echartsInstance;
  }

  createInstance(element: HTMLElement) {
    this.echartsInstance = echarts.init(element);
    return this.echartsInstance;
  }

  ngOnInit() {
    const chartElement = this.elementRef.nativeElement.querySelector('.chart');
    if (chartElement) {
      this.echartsInstance = this.createInstance(chartElement);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['type']){
      const tp = changes['type'].currentValue;
      this.type = tp;
    }
    if (changes['options']) {
      const option = changes['options'].currentValue;
      if(option){
        this.chartOption = this.switched(option);
      }
    }
  }
  
switched(option : any):{}{
  const x = option.names;
  const y0 = option.valuesCars;
  const y1 = option.valuesVehicle;
  const streets = option.streets;

         switch(this.type){
        case types.pie : {
          return Pie.createPie(x, y0, y1, streets);
        } 
        case types.line : {
          return Line.createLine(x, y0, y1);
        }
        case types.bar : {
          return Bar.createBar('', x, y0, y1);
        }
        default : return this.dummy(x, y0, y1);
      }
  }

  initialized(event: any){

  }
    
  dummy( dataX : any, ...dataY: any) : echarts.EChartsOption{
    return {
      title: {
        text: 'Cars Count',
        left: '5%'
      },
      xAxis: {
        type: 'category',
        data: dataX
      },
      yAxis: {
        type: 'value'
      },
      series: dataY,
    }
  }

  private getMax(arr: []): number {
    const mayorCantidad = arr.reduce((max, dato) => Math.max(max, dato[2]), 0);
    return mayorCantidad;
  }

    ngOnDestroy() {
      if (this.echartsInstance) {
        this.echartsInstance.dispose();
        this.echartsInstance = null;
      }
    }
  }