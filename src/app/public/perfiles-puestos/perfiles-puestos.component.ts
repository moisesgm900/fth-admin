import { Component } from '@angular/core';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { CommonModule } from '@angular/common';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-perfiles-puestos',
  standalone: true,
  imports: [NgxExtendedPdfViewerModule, CommonModule, UpperCasePipe],
  templateUrl: './perfiles-puestos.component.html',
  styleUrl: './perfiles-puestos.component.scss'
})
export class PerfilesPuestosComponent {
 

  menuOpen = true;
  currentPdf: string | null = null;

  menuItems = [
    { id: 1, text: 'DIRECCION DE FINANZAS', path: 'assets/perfiles/id1.pdf' },
    { id: 2, text: 'DIRECCIÓN DE OPERACIONES', path: 'assets/perfiles/id2.pdf' },
    { id: 3, text: 'GERENTE DE CONTABILIDAD', path: 'assets/perfiles/id3.pdf' },
    { id: 4, text: 'ENCARGADA DESARROLLO HUMANO', path: 'assets/perfiles/id4.pdf' },
    { id: 5, text: 'SUBDIRECCIÓN DE OPERACIONES', path: 'assets/perfiles/id5.pdf' },
    { id: 6, text: 'GASTRONOMÍA', path: 'assets/perfiles/id6.pdf' },
    { id: 7, text: 'NUTRICION', path: 'assets/perfiles/id7.pdf' },
    { id: 8, text: 'SUPERVISOR', path: 'assets/perfiles/id8.pdf' },
    { id: 9, text: 'ENCARGADO DE ALMACEN', path: 'assets/perfiles/id9.pdf' },
    { id: 10, text:'COCINERAS', path: 'assets/perfiles/id10.pdf' },
  ];

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  selectItem(item: any): void {
    this.currentPdf = item.path;
  }
}
