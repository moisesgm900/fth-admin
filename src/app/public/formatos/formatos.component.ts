import { Component } from '@angular/core';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { CommonModule } from '@angular/common';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-formatos',
  standalone: true,
  imports: [NgxExtendedPdfViewerModule, CommonModule, UpperCasePipe],
  templateUrl: './formatos.component.html',
  styleUrls: ['./formatos.component.scss']
})
export class FormatosComponent {
  menuOpen = true;
  currentPdf: string | null = null;

  menuItems = [
    { id: 1, text: 'ACTA ADMINISTRATIVA COCINERAS', path: 'assets/formatosfth/id1.pdf' },
    { id: 2, text: 'FORMATO DE JUSTIFICACIÓN DE INASISTENCIAS, RETARDOS, SALIDAS ANTES DEL HORARIO ESTABLECIDO Y NO RECONOCIMIENTO DEL RELOJ CHECADOR', path: 'assets/formatosfth/id2.pdf' },
    { id: 3, text: 'HOJA DEL REGISTRO DEL TRABAJADOR', path: 'assets/formatosfth/id3.pdf' },
    { id: 4, text: 'NOTIFICACIÓN DE DESPIDO', path: 'assets/formatosfth/id4.pdf' },
    { id: 5, text: 'RENUNCIA', path: 'assets/formatosfth/id5.pdf' },
    { id: 6, text: 'REQUISITOS DE NUEVO INGRESO', path: 'assets/formatosfth/id6.pdf' },
    { id: 7, text: 'SOLICITUD DE DÍAS DE AUSENCIA (VACACIONES, ANTIGÜEDAD, EMERGENCIA)', path: 'assets/formatosfth/id7.pdf' },
    { id: 8, text: 'SOLICITUD DE EQUIPOS DE COMPUTO DE NUEVO INGRESO', path: 'assets/formatosfth/id8.pdf' },
    { id: 9, text: 'SOLICITUD DE VACACIONES', path: 'assets/formatosfth/id9.pdf' },
  ];

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  selectItem(item: any): void {
    this.currentPdf = item.path;
  }
}