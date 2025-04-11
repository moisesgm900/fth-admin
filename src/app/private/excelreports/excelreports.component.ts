import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../shared/services/provider.service';
import { ExportExcelService } from '../../shared/services/export-excel.service';
import { CommonModule, DatePipe } from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-excelreports',
  standalone: true,
  providers: [provideNativeDateAdapter(), DatePipe, { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }],
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, FormsModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './excelreports.component.html',
  styleUrl: './excelreports.component.scss'
})
export class ExcelreportsComponent {
  private form_builder: FormBuilder = inject(FormBuilder);
  form: FormGroup = this.form_builder.group({
    date: [null, [Validators.required, this.weekdayValidator]],


  })
  statetablereport = false;
  statespecies = false;
  statehojapedido = false;
  stateequipococina = false;
  year: any;
  numberweek: any;
  orderdata : { [key: string]: { items: any[]} } = {};
  groupedProducts: { [key: string]: { items: any[]} } = {};

  constructor(private datePipe: DatePipe, public provid: ApiService, private exportExcelService: ExportExcelService) {
    //console.log(this.provid.getVoluntersdoc());

  }
  weekdayFilter = (d: Date | null): boolean => {
    if (!d) return false;
    const day = d.getDay();
    return day !== 0 && day !== 6; // 0 es domingo, 6 es sábado

  };
  weekdayValidator(control: AbstractControl): ValidationErrors | any {
    if (!control.value) {
      return null;
    }
    const date = new Date(control.value);
    const day = date.getDay();

    if (day === 0 || day === 6) {
      return { weekendDay: true };
    }

    return null;
  }
  //traer la info para generar el reporte de mesa
  tablereport() {
    const d = this.form.value.date
    const weeknumber = this.datePipe.transform(d, 'w');
    this.year = d.getFullYear();
    this.numberweek = parseInt(weeknumber ?? '');
    const date = { "year": this.year, "week": this.numberweek }
    this.groupedProducts = {}
    this.orderdata = {}
    this.provid.getVoluntersdoc('excelreports', 'tablereport', date).subscribe({
      next: (value: any) => {
        //console.log(value)
        if (value != false) {
          this.statetablereport = true
          this.statespecies = false;
          this.statehojapedido = false;
          this.stateequipococina = false;
          this.groupedProducts =  value.reduce((acc: any, item: any) => {
            if (!acc[item.cate]) {
              acc[item.cate] = { items: [] };

            }
            acc[item.cate].items.push(item);
            return acc;
          }, {} as { [key: string]: { items: any[] } });
          console.log(this.groupedProducts)        

        } else {
          alert('No hay informacion para mostrar')
        }
      },
      error: (e: any) => {
        console.log(e);
      }
    })
  }

  descargartablereport() {
    const dateallproducts = this.datePipe.transform(this.form.value.date, 'longDate');
    const doc = new jsPDF();

    let primeraPagina = true;

    // Ordenar las claves del objeto groupedProducts alfabéticamente
    const sortedProductKeys = Object.keys(this.groupedProducts).sort();

    sortedProductKeys.forEach(producto => {
      if (!primeraPagina) {
        doc.addPage(); // Agregar nueva página si no es la primera
      }
      primeraPagina = false;

      const grupo = this.groupedProducts[producto];
      console.log(grupo);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(`${producto}`, 14, 10);
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text('SMP-' + this.numberweek + '-' + this.year, 150, 10);
      doc.text(`${dateallproducts}`, 150, 18);
      doc.setFontSize(12);
      //doc.text(`Total Cantidad: ${grupo.totalQty.toFixed(2)}  ${grupo.qtys}`, 14, 18);

      const data = grupo.items.map((item, index) => [
        item.product,
        item.sum + ' '+ item.unit_medi_inter
      ]);

      autoTable(doc, {
        startY: 25,
        head: [['Producto', 'Cantidad']],
        body: data,
        theme: 'grid',
        styles: { fontSize: 10 },
        margin: { left: 14, right: 14 },
        headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] }
      });
    });

    // Descargar el PDF
    doc.save(`Hoja-mesa W-${this.numberweek}-${this.year}.pdf`);
  }
  exporttableexcel(){
    this.exportExcelService.exportToExceltable(this.groupedProducts, `Hoja-mesa W-${this.numberweek}-${this.year}`)
  }
  generatespecies() {
    const d = this.form.value.date;
    const weeknumber = this.datePipe.transform(d, 'w');
    this.year = d.getFullYear();
    this.numberweek = parseInt(weeknumber ?? '');
    const date = { year: this.year, week: this.numberweek };
  
    this.groupedProducts = {};
    this.orderdata = {}
  
    this.provid.getVoluntersdoc('excelreports', 'especies', date).subscribe({
      next: (value: any) => {
        console.log(value);
        if (value !== false) {
          this.statetablereport = false;
          this.statespecies = true;
          this.statehojapedido = false;
          this.stateequipococina = false;
          // Agrupar por cliente
          this.groupedProducts = value.reduce((acc: any, item: any) => {
            if (!acc[item.cliente]) {
              acc[item.cliente] = { items: [] };
            }
            acc[item.cliente].items.push(item);
            return acc;
          }, {} as { [key: string]: { items: any[] } });
  
          // Ordenar por número de cliente
          const sortedEntries = Object.entries(this.groupedProducts).sort((a, b) => {
            const numA = parseInt(a[0].trim().split(' - ')[0], 10);
            const numB = parseInt(b[0].trim().split(' - ')[0], 10);
            return numA - numB;
          });
  
          this.orderdata = Object.fromEntries(sortedEntries);
          console.log(this.orderdata);
  
        } else {
          alert('No hay información para mostrar');
        }
      },
      error: (e: any) => {
        console.error('Error al obtener datos:', e);
      }
    });
  }
  

  descargarespeciespdf() {
    const dateallproducts = this.datePipe.transform(this.form.value.date, 'longDate');
    const doc = new jsPDF();
  
    let startY = 10;
  
    const sortedProductKeys = Object.keys(this.orderdata).sort((a, b) => {
      const numA = parseInt(a.split(' - ')[0], 10);
      const numB = parseInt(b.split(' - ')[0], 10);
      return numA - numB;
    });
  
    sortedProductKeys.forEach((producto, index) => {
      const grupo = this.orderdata[producto];
  
      // Verificar si el cliente cabe en la página
      const nextY = startY + 10 + 10 * grupo.items.length; // Estimación de altura total de la tabla
      if (nextY > 270) {  // Si la tabla no cabe, agregar nueva página
        doc.addPage();
        startY = 10;  // Reiniciar el inicio de la página
      }
  
      // Título del cliente
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(`${producto}`, 14, startY);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text('SMP-' + this.numberweek + '-' + this.year, 150, startY);
      doc.text(`${dateallproducts}`, 150, startY + 8);
  
      const data = grupo.items.map((item) => [
        item.product,
        item.qty.trim()
      ]);
  
      // Dibujar la tabla de productos
      autoTable(doc, {
        startY: startY + 5,  // Aumentamos el espacio entre el cliente y la tabla
        head: [['Producto', 'Cantidad']],
        body: data,
        theme: 'grid',
        styles: { fontSize: 10 },
        margin: { left: 14, right: 14 },
        headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
        didDrawPage: (data) => {
          startY = data.cursor?.y ?? 10;
        }
      });
  
      // Agregar espacio extra antes de la siguiente tabla
      // Si no es el último cliente, agregar un espacio adicional entre las tablas
      if (index < sortedProductKeys.length - 1) {
        startY += 10;  // 10 unidades de espacio extra entre clientes
      }
    });
  
    doc.save(`Especies-${this.numberweek}-${this.year}.pdf`);
  }
  exportespeciesexcel(){
    this.exportExcelService.exportToExcelespecies(this.orderdata, `Especies W-${this.numberweek}-${this.year}`)
  }

  generatehojapedido() {
    const d = this.form.value.date;
    const weeknumber = this.datePipe.transform(d, 'w');
    this.year = d.getFullYear();
    this.numberweek = parseInt(weeknumber ?? '');
    const date = { year: this.year, week: this.numberweek };
  
    this.groupedProducts = {};
    this.orderdata = {}
    this.provid.getVoluntersdoc('excelreports', 'hojapedido', date).subscribe({
      next: (value: any) => {
        if (value !== false) {
          this.statetablereport = false
          this.statespecies = false;
          this.statehojapedido = true;
          this.stateequipococina = false;
  
          // Agrupar por cliente
          this.groupedProducts = value.reduce((acc: any, item: any) => {
            if (!acc[item.cate]) {
              acc[item.cate] = { items: [] };
            }
            acc[item.cate].items.push(item);
            return acc;
          }, {} as { [key: string]: { items: any[] } });
        } else {
          alert('No hay información para mostrar');
        }
      },
      error: (e: any) => {
        console.error('Error al obtener datos:', e);
      }
    });
  }

  descargarhojapedidopdf() {
    const dateallproducts = this.datePipe.transform(this.form.value.date, 'longDate');
    const doc = new jsPDF();
  
    let startY = 10;
  
    // Ordenar claves alfabéticamente (puedes cambiar por orden numérico si lo necesitas)
    const sortedProductKeys = Object.keys(this.groupedProducts).sort();
  
    sortedProductKeys.forEach((producto, index) => {
      const grupo = this.groupedProducts[producto];
  
      // Estimar altura de la tabla (30 de margen superior + 10 por fila)
      const estimatedHeight = 30 + grupo.items.length * 10;
  
      if (startY + estimatedHeight > 270) {
        doc.addPage();
        startY = 10;
      }
  
      // Título
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(`${producto}`, 14, startY);
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text('SMP-' + this.numberweek + '-' + this.year, 150, startY);
      doc.text(`${dateallproducts}`, 150, startY + 8);
      doc.setFontSize(12);
  
      const data = grupo.items.map(item => [
        item.product,
        item.sum + ' ' + item.unit_medi_inter
      ]);
  
      // Dibujar tabla
      autoTable(doc, {
        startY: startY + 15, // espacio debajo del título
        head: [['Producto', 'Cantidad']],
        body: data,
        theme: 'grid',
        styles: { fontSize: 10 },
        margin: { left: 14, right: 14 },
        headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
        didDrawPage: (data) => {
          // Actualizar el cursor vertical
          startY = data.cursor?.y ?? startY;
        }
      });
  
      // Agregar un poco de espacio extra antes del siguiente grupo
      startY += 10;
    });
  
    doc.save(`hoja-pedido W-${this.numberweek}-${this.year}.pdf`);
  }
  
  exportehojapedidoexcel(){
    this.exportExcelService.exportToExceltable(this.groupedProducts, `Hoja-pedido W-${this.numberweek}-${this.year}`)
  }

  generatequipococina(){
    const d = this.form.value.date;
    const weeknumber = this.datePipe.transform(d, 'w');
    this.year = d.getFullYear();
    this.numberweek = parseInt(weeknumber ?? '');
    const date = { year: this.year, week: this.numberweek };
  
    this.groupedProducts = {};
    this.orderdata = {}
  
    this.provid.getVoluntersdoc('excelreports', 'equipococina', date).subscribe({
      next: (value: any) => {
        console.log(value);
        if (value !== false) {
          this.statetablereport = false;
          this.statespecies = false;
          this.statehojapedido = false;
          this.stateequipococina = true;
          // Agrupar por cliente
          this.groupedProducts = value.reduce((acc: any, item: any) => {
            if (!acc[item.cliente]) {
              acc[item.cliente] = { items: [] };
            }
            acc[item.cliente].items.push(item);
            return acc;
          }, {} as { [key: string]: { items: any[] } });
  
          // Ordenar por número de cliente
          const sortedEntries = Object.entries(this.groupedProducts).sort((a, b) => {
            const numA = parseInt(a[0].trim().split(' - ')[0], 10);
            const numB = parseInt(b[0].trim().split(' - ')[0], 10);
            return numA - numB;
          });
  
          this.orderdata = Object.fromEntries(sortedEntries);
          console.log(this.orderdata);
  
        } else {
          alert('No hay información para mostrar');
        }
      },
      error: (e: any) => {
        console.error('Error al obtener datos:', e);
      }
    });
  }
  descargarequipococinapdf(){
    const dateallproducts = this.datePipe.transform(this.form.value.date, 'longDate');
    const doc = new jsPDF();
  
    let startY = 10;
  
    const sortedProductKeys = Object.keys(this.orderdata).sort((a, b) => {
      const numA = parseInt(a.split(' - ')[0], 10);
      const numB = parseInt(b.split(' - ')[0], 10);
      return numA - numB;
    });
  
    sortedProductKeys.forEach((producto, index) => {
      const grupo = this.orderdata[producto];
  
      // Verificar si el cliente cabe en la página
      const nextY = startY + 10 + 10 * grupo.items.length; // Estimación de altura total de la tabla
      if (nextY > 270) {  // Si la tabla no cabe, agregar nueva página
        doc.addPage();
        startY = 10;  // Reiniciar el inicio de la página
      }
  
      // Título del cliente
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(`${producto}`, 14, startY);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text('SMP-' + this.numberweek + '-' + this.year, 150, startY);
      doc.text(`${dateallproducts}`, 150, startY + 8);
  
      const data = grupo.items.map((item) => [
        item.product,
        item.qty.trim() + '' + 'Pieza'
      ]);
  
      // Dibujar la tabla de productos
      autoTable(doc, {
        startY: startY + 5,  // Aumentamos el espacio entre el cliente y la tabla
        head: [['Producto', 'Cantidad']],
        body: data,
        theme: 'grid',
        styles: { fontSize: 10 },
        margin: { left: 14, right: 14 },
        headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
        didDrawPage: (data) => {
          startY = data.cursor?.y ?? 10;
        }
      });
  
      // Agregar espacio extra antes de la siguiente tabla
      // Si no es el último cliente, agregar un espacio adicional entre las tablas
      if (index < sortedProductKeys.length - 1) {
        startY += 10;  // 10 unidades de espacio extra entre clientes
      }
    });
  
    doc.save(`Equipo-cocina W-${this.numberweek}-${this.year}.pdf`);

  }
  exportequipococinaexcel(){
    this.exportExcelService.exportToExcelespecies(this.groupedProducts, `Equipo-cocina W-${this.numberweek}-${this.year}`)
  }
}
