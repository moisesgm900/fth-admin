import * as XLSX from 'xlsx';
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExportExcelService {

  constructor() { }

  exportToExcel(jsonData: any, fileName: string): void {
    const dataArray = this.transformJsonToArray(jsonData);
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataArray);
    const workbook: XLSX.WorkBook = { Sheets: { 'report': worksheet }, SheetNames: ['report'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    this.saveAsExcelFile(excelBuffer, fileName);
  }

  private transformJsonToArray(jsonData: any): any[] {
    let dataArray: any[] = [];
    for (let key in jsonData) {
      dataArray.push({

        '': `Producto: ${key} ${jsonData[key].qtys.trim()}`
      });
      jsonData[key].items.forEach((item: any) => {
        dataArray.push({
          Cliente: item.cliente,
          Cantidad: item.product_uom_qty,
          'Cant. paquete': '',
          'Varianza': '',
          '%Varianza': ''
        });
      });

      // Agregar la fila de totalQty al final de cada producto
      dataArray.push({

        Cantidad: `Total: ${key}` + ' ' + jsonData[key].totalQty.toFixed(2) + " " + jsonData[key].qtys.trim()
      });

      // Agregar una fila vacía para mejorar la separación en Excel
      dataArray.push({});
    }
    return dataArray;
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(data, `${fileName}.xlsx`);
  }

  // para hacer el table report 

  exportToExceltable(jsonData: any, fileName: string): void {
    const dataArray = this.transformJsonToArraytable(jsonData);
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataArray);
    const workbook: XLSX.WorkBook = { Sheets: { 'tablereport': worksheet }, SheetNames: ['tablereport'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, fileName);
  }
  private transformJsonToArraytable(jsonData: any): any[] {
    let dataArray: any[] = [];
    for (let key in jsonData) {
      dataArray.push({
        '': ` ${key} `
      });
      console.log(key)
      jsonData[key].items.forEach((item: any) => {
        dataArray.push({
          Producto: item.product,
          Cantidad:item.sum+ ' ' + item.unit_medi_inter,
        });
      });
      dataArray.push({});
    }
    return dataArray;
  }
  //para las especies 

  exportToExcelespecies(jsonData: any, fileName: string): void {
    const dataArray = this.transformJsonToArrayespecies(jsonData);
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataArray);
    const workbook: XLSX.WorkBook = { Sheets: { 'especies': worksheet }, SheetNames: ['especies'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, fileName);
  }
  private transformJsonToArrayespecies(jsonData: any): any[] {
    let dataArray: any[] = [];
    for (let key in jsonData) {
      dataArray.push({
        '': ` ${key} `
      });
      console.log(key)
      jsonData[key].items.forEach((item: any) => {
        dataArray.push({
          Producto: item.product,
          Cantidad: item.qty,
        });
      });
      dataArray.push({});
    }
    return dataArray;
  }
}