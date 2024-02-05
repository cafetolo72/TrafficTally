export class UtilFiles{
    static firebase: any;
    constructor(){}

    static convertToCSV(data: any){
        let csv = 'Id ; Nombre ; Cruces Coches ; Cruces Semipesados\n';
        for (const value of data) {
            csv += `${value.id} ; ${value.name} ; Coches:  ${[...value?.carsCount.entries()]} ; Semipesados:  ${[...value?.vehicleCount.entries()]} \n`;
        }
        this.downloadCSV(csv);
    }

    static downloadCSV(csv: string): void {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'data.csv');
        link.click();
    }
}