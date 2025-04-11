
import { KeyValuePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Collapse, initTWE} from "tw-elements";

import html2canvas from 'html2canvas';
@Component({
  selector: 'app-private',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './private.component.html',
  styleUrl: './private.component.scss'
})
export class PrivateComponent {
  ngOnInit(){

    initTWE({ Collapse });
 
    
   
  }
  data = [
    { nombre: 'Juan Pérez', correo: 'juan.perez@example.com', telefono: '123-456-7890' },
    { nombre: 'Ana López', correo: 'ana.lopez@example.com', telefono: '987-654-3210' },
    { nombre: 'Carlos Ruiz', correo: 'carlos.ruiz@example.com', telefono: '456-789-0123' },
  ];
  isMenuOpen = false;
  isReportDropdownOpen: boolean = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  toggleDropdown() {
    this.isReportDropdownOpen = !this.isReportDropdownOpen;
    
  }

/*   exportToPDF(): void {
    const content = document.getElementById('pdf-content');

    if (content) {
      html2canvas(content).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        //const pdf = new jsPDF('p', 'mm', 'a4');

        // Ajustar la imagen al tamaño de la página PDF
        const imgWidth = 190; // Ancho máximo en mm
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        pdf.save('reporte.pdf');
      });
    } else {
      console.error('No se encontró el contenido para exportar.');
    }
  } */
 


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

}
