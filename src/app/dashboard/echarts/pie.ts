import { StyleService } from "src/app/services/style-service.service";

export class Pie{

    static createPie(names:Array<string>, carsValue : Array<number>, vehicleValue : Array<number>, streets : Map<string, number>):echarts.EChartsOption{
      const color =  StyleService.isDarkThemeStyle() ? '#e8eaf6' : '#455a64';
      // const serie1 = this.buildSerie(this.createMap(names, carsValue));
        // const serie2 = this.buildSerie(this.createMap(names, vehicleValue));
        const street = this.buildSerie(this.createMap(streets), color);
        return {
            title: {
              text: '',
              left: '5%'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)',
              position: ['32.5%', '10%']
            },      
            toolbox: {
              top : 20,
              right: 15,
              feature: {
                saveAsImage: {}
              }
            },
            legend: this.buildLegend(color),
            series: [street],
          }
      }

      static buildSerie(data : any, color : string):{}{
        const isMobil : boolean =  screen.width <= 768;
        const lbl = this.lblLayout(isMobil);
       return {
         name: '',
            type: 'pie',
            radius: '50%',
            center: ['40%', '50%'],
            data: data,
            avoidLabelOverlap: false,
            label: {
              show: !isMobil,
              fontFamily : 'Verdana',
              color : color,
              position :  isMobil ? 'center' : 'outside',
            },
            emphasis: {
              label : {
                show : true,
                fontSize : '18px',
                fontWeight : 'bold',
              },
              itemStyle: {
                  shadowBlur: 0,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.1)'
              }
            },
            labelLine: {
              show: !isMobil
            },
            labelLayout : lbl,
        }
      }

      static createMap(x: Map<string, number>): Array<any>{
        return Array.from(x.entries()).map(([name, max]) => ({name : name, value : max}));
      }

       static buildLegend(color : string): {}{
        const isHorizontal = screen.width < 768;
        if(isHorizontal){
          return {
              type: 'scroll',
              orient: 'horizontal',
              bottom: 0,
              pageIconColor: color,
              textStyle: {
                color: color,
              }
          }
        }else{
          return {
            type: 'scroll',
            orient: 'vertical',
            right: 40,
            top: 30,
            pageIconColor: color,
            textStyle: {
              color: color,
            }
          }
        }
      }

      legend(min: number, max : number , color: string): {}{
        return {
          gt: min,
          lte: max,
          color: color
        };
      }

      static lblLayout(isMobil: boolean): {}{
        if(!isMobil) return {}
        return{
            moveOverlap : 'shiftX',
            y : '5%',
        };
      }
    }