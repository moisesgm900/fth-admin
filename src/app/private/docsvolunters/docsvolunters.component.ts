import { Component, ViewChild, ElementRef , inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, DatePipe } from '@angular/common';
import { ApiService } from '../../shared/services/provider.service';
// Importación correcta para evitar errores en Angular
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExportExcelService } from '../../shared/services/export-excel.service';


declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: { finalY: number };
  }
}
@Component({
  selector: 'app-docsvolunters',
  standalone: true,
  providers: [provideNativeDateAdapter(), DatePipe, { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }],
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, FormsModule, ReactiveFormsModule, MatButtonModule],

  //changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './docsvolunters.component.html',
  styleUrl: './docsvolunters.component.scss'
})

export class DocsvoluntersComponent implements OnInit {
  private form_builder: FormBuilder = inject(FormBuilder);
  form: FormGroup = this.form_builder.group({
    date: [null, [Validators.required, this.weekdayValidator]],


  })
  constructor(private datePipe: DatePipe, public provid: ApiService,private exportExcelService: ExportExcelService ) {
    //console.log(this.provid.getVoluntersdoc());
    this.papeletas = []
    this.labels = []
    this.client = []
    this.cl = []
    this.ObjMap = {}
    this.papeletaspdf = {}
  }
  @ViewChild('wcheck', { static: false }) tabla!: ElementRef;

  statepapeletas = false;
  numeroSalientes: any;
  statelabels = false;
  stateallproducts = false;
  statewcheck = false;
  statewcheckfyv = false;
  papeletas: any[];
  labels: any = [];
  papeletaspdf: any = {};
  labelspdf: any = {};
  client: any[];
  cl: any[];
  ObjMap: any = {};
  values: any[] = []
  prueba: any;
  result: any = {};
  data = {};
  year: any;
  datefull: any;
  numberD: any;
  datelabel: any;
  allproducts: any = []
  wcheck: any = []
  groupedProducts: { [key: string]: { items: any[], totalQty: number, qtys: string } } = {} ;
  ngOnInit() {
    //this.getDocs()
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

  // para generar la info de las papeletas
  Generate_distributionCom() {
    this.labels = []
    this.allproducts = []
    this.groupedProducts = {}
    const d = this.form.value.date
    const weeknumber = this.datePipe.transform(d, 'w');
    this.year = d.getFullYear();
    this.numberD = parseInt(weeknumber ?? '');
    this.datefull = this.datePipe.transform(this.form.value.date, 'longDate')
    const date = { "year": this.year, "week": this.numberD }
    //console.log(date)
    this.provid.getVoluntersdoc('nutrition', 'tool', date).subscribe({
      next: (value: any) => {
        console.log(value)

        console.log(this.numeroSalientes)
        if (value != false) {
          this.numeroSalientes = value[0].numerosalientes
          this.statepapeletas = true
          this.statelabels = false
          this.statewcheck = false
          this.statewcheckfyv = false
          this.stateallproducts = false
        } else {
          alert('No hay informacion para mostrar')
        }
        // console.log(this.papeletas)
        this.papeletas = value
        this.groupedData = this.groupByClientAndCategory(this.papeletas);
        this.data = this.groupedData
        console.log(this.groupedData);
        this.papeletaspdf = this.groupedData

      },
      error: (e: any) => {
        console.log(e);
      }
    })
  }

  generate_labels() {
    console.log('working');

  }
  /*   validador de fechas 
  
    get date(){
      return this.form.get('date');
    }
   */
  groupedData: { [cliente: string]: { [categoria: string]: any[] } } = {};
  groupByClientAndCategory(array: any[]): { [cliente: string]: { [categoria: string]: any[] } } {
    return array.reduce((acc, item) => {
      const { cliente, category } = item;
      // Si el cliente no existe en el acumulador, se inicializa.
      if (!acc[cliente]) {
        acc[cliente] = {};
      }
      // Si la categoría no existe para el cliente, se inicializa.
      if (!acc[cliente][category]) {
        acc[cliente][category] = [];
      }
      // Se agrega el producto a la categoría correspondiente.
      acc[cliente][category].push(item);
      return acc;
    }, {});
  }

  generatePapeletas() {
    this.labels = [];
    const wnumber = 'SMP - ' + this.datePipe.transform(this.form.value.date, 'w');
    const datep = this.datePipe.transform(this.form.value.date, 'longDate');
    const doc = new jsPDF();
    let isFirstPage = true;
    let pageWidth = doc.internal.pageSize.width;
    let pageHeight = doc.internal.pageSize.height;

    Object.entries(this.data).forEach(([cliente, categorias]) => {
      if (!isFirstPage) {
        doc.addPage();
      } else {
        isFirstPage = false;
      }

      let startY = 15;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      let textWidth = doc.getTextWidth(`${cliente}`);
      let wsmp = pageWidth / 4;
      let centerX = (pageWidth - textWidth) / 2;

      // Encabezado
      doc.text(`#${cliente}`, centerX, 10);
      doc.setFontSize(11);
      doc.text(`${wnumber}`, wsmp * 3.3, 10);
      startY += 6;

      const orderedCategories = Object.keys(categorias as Record<string, any>)
        .sort((a, b) => parseInt(a.split(' ')[0]) - parseInt(b.split(' ')[0]));

      orderedCategories.forEach((category, index) => {
        const products = (categorias as any)[category];

        // 🔹 Estimar altura de la tabla (10 px por fila aprox.)
        const estimatedTableHeight = (products.length + 1) * 10 + 20; // +20 para la cabecera y espacio

        // 🔹 Si la categoría no cabe, agregar nueva página
        if (startY + estimatedTableHeight > pageHeight) {
          doc.addPage();
          startY = 15;
        }

        doc.setFontSize(16);
        doc.text(category, 16, startY);
        startY += 5;

        const tableData = products.map((item: any) => [
          item.product + ' / ' + item.en_product,
          item.product_uom_qty + ' ' + item.unit_medi_inter,
          null,
          null
        ]);

        autoTable(doc, {
          startY: startY,
          head: [['Producto', 'Cantidad', 'Check 1', 'Check 2']],
          body: tableData,
          theme: 'grid',
          styles: { fontSize: 14, cellPadding: 2 },
          columnStyles: {
            0: { cellWidth: 95 },
            1: { cellWidth: 40 },
            2: { cellWidth: 23 },
            3: { cellWidth: 23 },
          },
          headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
          margin: { left: 14, right: 14 },
          didDrawPage: function () {
            doc.setFontSize(18);
            let footerWidth = doc.getTextWidth(`${cliente}`);
            let footerX = (pageWidth - footerWidth) / 2;
            let footery = pageWidth / 4;
            doc.text(`#${cliente} `, footerX, pageHeight - 10);
            doc.setFontSize(11);
            doc.text(`${datep} `, footery * 3.3, pageHeight - 10);
          }
        });

        startY = (doc as any).lastAutoTable.finalY + 15;

        // 🔹 Si hay más categorías y la siguiente no cabe, agregar nueva página
        if (startY + 50 > pageHeight && index < orderedCategories.length - 1) {
          doc.addPage();
          startY = 15;
        }
      });
    });

    doc.save(`Papeletas_W-${this.numberD}-${this.year}.pdf`);
  }

  // trae la data para etiquetas 
  generatelabelsgetData() {
    this.papeletas = []
    this.groupedData = {}
    this.data = []
    this.papeletaspdf = []
    const d = this.form.value.date

    const weeknumber = this.datePipe.transform(d, 'w');
    this.datelabel = this.datePipe.transform(d, 'longDate')
    this.year = d.getFullYear();
    this.numberD = parseInt(weeknumber ?? '');
    const date = { "year": this.year, "week": this.numberD }
    this.provid.getVoluntersdoc('nutrition', 'labels', date).subscribe({
      next: (value: any) => {
        this.labels = value
        console.log(value)
        if (value != false) {

          this.statelabels = true
          this.statepapeletas = false
          this.statewcheck = false
          this.stateallproducts = false
          this.statewcheckfyv = false
        } else {
          alert('No hay informacion para mostrar')
        }

        //this.labelspdf = this.groupedData

      },
      error: (e: any) => {
        console.log(e);
      }
    })
  }
  generatelabelspdf() {
    // Sort labels first by client number, then by product name
    const sortedLabels = [...this.labels].sort((a, b) => {
      // First sort by client number (numeric comparison)
      if (a.cliente !== b.cliente) {
        return a.cliente - b.cliente;
      }
      // If same client, sort by product name (case insensitive)
      return a.product.localeCompare(b.product, undefined, { sensitivity: 'base' });
    });

    console.log('Sorted Labels:', sortedLabels);
    console.log('Date Label:', this.datelabel);

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Label dimensions
    const labelWidth = 100; // 10 cm
    const labelHeight = 34; // 3.4 cm
    const pageWidth = doc.internal.pageSize.getWidth(); // 210 mm
    const pageHeight = doc.internal.pageSize.getHeight(); // 297 mm

    // Layout settings
    const marginX = 5;
    const marginY = 11;
    const spaceBetweenLabels = 3;

    let x = marginX;
    let y = marginY;

    // Process sorted labels
    sortedLabels.forEach((item: any) => {
      // Check if we need a new column or page
      if (y + labelHeight > pageHeight) {
        x += labelWidth + spaceBetweenLabels;
        y = marginY;

        if (x + labelWidth > pageWidth) {
          doc.addPage();
          x = marginX;
          y = marginY;
        }
      }

      // Add label content
      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.text(` #${item.cliente}`, x + 15, y + 16);

      doc.setFont("helvetica", "bold");
      doc.text(` ${item.product}`, x + 2, y + 22);

      doc.setFontSize(18);
      doc.text(` ${item.qty}`, x + 2, y + 29);

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(`${this.datelabel}`, x + 55, y + 35);

      // Move to next label position
      y += labelHeight + spaceBetweenLabels;
    });

    // Save PDF
    doc.save(`Etiquetas W-${this.numberD}-${this.year}.pdf`);
  }

  generateallproductsdata() {
    this.papeletas = []
    this.groupedData = {}
    this.data = []
    this.papeletaspdf = []
    const d = this.form.value.date
    this.labels = []

    const weeknumber = this.datePipe.transform(d, 'w');
    this.datelabel = this.datePipe.transform(d, 'longDate')
    this.year = d.getFullYear();
    this.numberD = parseInt(weeknumber ?? '');
    const date = { "year": this.year, "week": this.numberD }
    this.provid.getVoluntersdoc('nutrition', 'allproducts', date).subscribe({
      next: (value: any) => {
        if (value != false) {

          this.statepapeletas = false
          this.statelabels = false
          this.statewcheck = false
          this.stateallproducts = true
          this.statewcheckfyv = false
          this.allproducts = value
          this.groupedProducts = this.allproducts.reduce((acc: any, item: any) => {
            if (!acc[item.product]) {
              acc[item.product] = { items: [], totalQty: 0, qtys: item.unit_medi_inter };

            }
            acc[item.product].items.push(item);
            acc[item.product].totalQty += parseFloat(item.qty);
            return acc;
          }, {} as { [key: string]: { items: any[]; totalQty: number, qtys: string } });
          console.log(this.groupedProducts)

          //this.labelspdf = this.groupedData

        } else {
          alert('No hay informacion para mostrar')
        }
      },
      error: (e: any) => {
        console.log(e);
      }
    })

  }

  generateallproductspdf() {
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
      doc.text('SMP-' + this.numberD + '-' + this.year, 150, 10);
      doc.text(`${dateallproducts}`, 150, 18);
      doc.setFontSize(12);
      doc.text(`Total Cantidad: ${grupo.totalQty.toFixed(2)}  ${grupo.qtys}`, 14, 18);

      const data = grupo.items.map((item, index) => [
        '#' + item.cliente,
        item.qty
      ]);

      autoTable(doc, {
        startY: 25,
        head: [['Cliente', 'Cantidad']],
        body: data,
        theme: 'striped',
        styles: { fontSize: 10 },
        margin: { left: 14, right: 14 }
      });
    });

    // Descargar el PDF
    doc.save(`todos productos_W-${this.numberD}-${this.year}.pdf`);

  }
  // este trae el w-check para carnes frias
  generatewcheck() {
    this.papeletas = []
    this.groupedData = {}
    this.data = []
    this.papeletaspdf = []
    const d = this.form.value.date
    this.labels = []
    this.allproducts = []
    this.groupedProducts = {}
    const weeknumber = this.datePipe.transform(d, 'w');
    this.datelabel = this.datePipe.transform(d, 'longDate')
    this.year = d.getFullYear();
    this.numberD = parseInt(weeknumber ?? '');
    const date = { "year": this.year, "week": this.numberD }
    this.provid.getVoluntersdoc('nutrition', 'wcheck', date).subscribe({
      next: (value: any) => {
        if (value != false) {
          this.statepapeletas = false
          this.statelabels = false
          this.statewcheck = true
          this.statewcheckfyv = false
          this.stateallproducts = false
          this.groupedProducts = value.reduce((acc: any, item: any) => {
            if (!acc[item.product]) {
              acc[item.product] = { items: [], totalQty: 0, qtys: item.unit_medi_inter };
            }
            acc[item.product].items.push(item);
            acc[item.product].totalQty += parseFloat(item.qty);
            return acc;
          }, {} as { [key: string]: { items: any[]; totalQty: number, qtys: string } });
          console.log(this.groupedProducts)

          //this.labelspdf = this.groupedData
        }
      },
      error: (e: any) => {
        console.log(e);
      }
    })



  }
  //generar el pdf de carnes frias
  generatewcheckpdf() {
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
      doc.text('SMP-' + this.numberD + '-' + this.year, 150, 10);
      doc.text(`${dateallproducts}`, 150, 18);
      doc.setFontSize(12);
      doc.text(`Total Cantidad: ${grupo.totalQty.toFixed(2)}  ${grupo.qtys}`, 14, 18);

      const data = grupo.items.map((item, index) => [
        '#' + item.cliente,
        item.qty
      ]);

      autoTable(doc, {
        startY: 25,
        head: [['Cliente', 'Cantidad', 'Cant. paquete	', 'Varianza', '%Varianza']],
        body: data,
        theme: 'grid',
        styles: { fontSize: 10 },
        margin: { left: 14, right: 14 },
        headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] }
      });
    });

    // Descargar el PDF
    doc.save(`W-Check-carnes W-${this.numberD}-${this.year}.pdf`);

  }

  // este trae la info de la wcheck para frutas y verduras con unidad de medida Kg.
  generatecheckfyv() {
    this.papeletas = []
    this.groupedData = {}
    this.data = []
    this.papeletaspdf = []
    const d = this.form.value.date
    this.labels = []
    this.allproducts = []
    this.groupedProducts = {}
    const weeknumber = this.datePipe.transform(d, 'w');
    this.datelabel = this.datePipe.transform(d, 'longDate')
    this.year = d.getFullYear();
    this.numberD = parseInt(weeknumber ?? '');
    const date = { "year": this.year, "week": this.numberD }
    this.provid.getVoluntersdoc('nutrition', 'wcheckfyv', date).subscribe({
      next: (value: any) => {
        if (value != false) {
          this.statepapeletas = false
          this.statelabels = false
          this.statewcheck = false
          this.stateallproducts = false
          this.statewcheckfyv = true
          this.groupedProducts = value.reduce((acc: any, item: any) => {
            if (!acc[item.product]) {
              acc[item.product] = { items: [], totalQty: 0, qtys: item.unit_medi_inter };
            }
            acc[item.product].items.push(item);
            acc[item.product].totalQty += parseFloat(item.qty);
            return acc;
          }, {} as { [key: string]: { items: any[]; totalQty: number, qtys: string } });
          console.log(this.groupedProducts)

          //this.labelspdf = this.groupedData
        }
      },
      error: (e: any) => {
        console.log(e);
      }
    })

  }
  // este es para generar el pdf wcheck de frutas y verduras 
  generatewchefyvpdf() {
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
      doc.text('SMP-' + this.numberD + '-' + this.year, 150, 10);
      doc.text(`${dateallproducts}`, 150, 18);
      doc.setFontSize(12);
      doc.text(`Total Cantidad: ${grupo.totalQty.toFixed(2)}  ${grupo.qtys}`, 14, 18);

      const data = grupo.items.map((item, index) => [
        '#' + item.cliente,
        item.qty
      ]);

      autoTable(doc, {
        startY: 25,
        head: [['Cliente', 'Cantidad', 'Cant. paquete	', 'Varianza', '%Varianza']],
        body: data,
        theme: 'grid',
        styles: { fontSize: 10 },
        margin: { left: 14, right: 14 },
        headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] }
      });
    });

    // Descargar el PDF
    doc.save(`W-Check-frutas y verduras W-${this.numberD}-${this.year}.pdf`);
  }
  generatewcheckexcelcarnes() {
    //console.log(this.groupedProducts)
    this.exportExcelService.exportToExcel(this.groupedProducts, `W-Check-carnes W-${this.numberD}-${this.year}`)
  }
  generatewcheckexcelfyv() {
    //console.log(this.groupedProducts)
    this.exportExcelService.exportToExcel(this.groupedProducts, `W-Check-frutas y verduras W-${this.numberD}-${this.year}`)
  }

}
