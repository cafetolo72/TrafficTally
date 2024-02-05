export class Bar{

    static createBar(title : string, names: Array<string>, cars : Array<number>, vehicle : Array<number>){
       const serie1 = Bar.buildSerie(cars, 'Cars');
       const serie2 = Bar.buildSerie(vehicle, 'Vehicles');
        return {
          title: {
             text: title,
           },
          xAxis: {
            type: 'category',
            data: names,
          },
          yAxis: {
            type: 'value'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            }
          },
          legend :{},
          toolbox: {
            top : 20,
            right: 15,
            feature: {
              saveAsImage: {}
            }
          },
          dataZoom: [
            {
              startValue: names[0],
            },
            {
              type: 'inside'
            },
          ],
          grid: {
              left: '5%',
              bottom: '10%',
              containLabel: true
          },
          series: [serie1, serie2 ],
        }
    }
    
    static buildSerie(data : Array<number>, name : string): {}{
        return {
            data: data,
            type: 'bar',
            name : name,
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            },
            markPoint: {
              data: [
                { type: 'max', name: 'Max' },
                { type: 'min', name: 'Min' }
              ]
            },
        }
      }
} 