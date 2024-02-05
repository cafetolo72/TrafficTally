export class Line {

    static createLine(names: Array<string>, cars: Array<number>, vehicle: Array<number>) : echarts.EChartsOption{
        const serie1 = this.buildSeries(cars, 'Cars', ' red');
        const serie2 = this.buildSeries(vehicle, 'Vehicle', 'green');
        return {
              title: {
                text: '',
                left: '5%'
              },
              legend: {},
              tooltip: {
                trigger: 'axis'
              },
              grid: {
                left: '5%',
                right: '15%',
                bottom: '15%'
              },
              xAxis: {
                type: 'category',
                data: names,
                minorTick: {
                  show: true
                },
                minorSplitLine: {
                  show: true
                }
              },
              yAxis: {
                type: 'value',
                minorTick: {
                  show: true
                },
                minorSplitLine: {
                  show: true
                }
              },
              toolbox: {
                top : 20,
                right: 15,
                feature: {
                  saveAsImage: {}
                }
              },
              dataZoom: [
                {
                  startValue: names[0]
                },
                {
                  type: 'inside'
                }
              ],
              series:  [ serie1, serie2 ],
            }
        }

       static buildSeries(value: any, name: string, color : string) : {}{
            return {
              name: name,
              type: 'line',
              data: value,
              markPoint: {
                data: [
                  { type: 'max', name: 'Max' },
                  { type: 'min', name: 'Min' }
                ]
              },
              markLine: {
                silent: true,
                lineStyle: {
                  color: color
                },
              }
            };
          }
}