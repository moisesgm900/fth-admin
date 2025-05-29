import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { trigger, transition, style, animate } from '@angular/animations';
@Component({
  selector: 'app-intranet',
  standalone: true,
  imports: [ CommonModule, CarouselModule],
  templateUrl: './intranet.component.html',
  styleUrl: './intranet.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class IntranetComponent {
  statecultura = true
  stateorganigrama = false
  menuOpen = true;
  stateformatos = false 
  selectedItem: any = null;

  menuItems = [
    { id: 1, icon: '', text: 'CULTURA ORGANIZACIONAL' },
    { id: 2, icon: '', text: 'ORGANIGRAMA' },
    { id: 3, icon: '', text: 'FORMATOS FTH' },

    { id: 4, icon: '', text: 'PERFILES DE PUESTO Y ACTIVIDADES' }
  ];
  images = [
    'assets/MISION.png',
    'assets/VALORES.png',
    'assets/PILARES.png'
  ];

  slides = [
    {
      id: '1',
      src: 'assets/MISION.png',
      alt: 'Slide 1',
      title: 'Misión'
    },
    {
      id: '2',
      src: 'assets/VALORES.png',
      alt: 'Slide 2',
      title: 'Valores'
    },
    {
      id: '3',
      src: 'assets/PILARES.png',
      alt: 'Slide 3',
      title: 'Pilares'
    }
  ];





  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    autoplaySpeed: 1000,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,

    responsive: {
      0: { items: 1 },
      600: { items: 1 },
      1000: { items: 1 }
    },
    nav: false,
    animateOut: 'fadeOut',
    animateIn: 'fadeIn'
  };

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  selectItem(item: any) {
    this.selectedItem = item;
    console.log(item)
    console.log(item.id)
    if (item.id == 1) {
      this.statecultura = true
      this.stateorganigrama = false
    }
    if (item.id == 2) {
      this.stateorganigrama = true
      this.statecultura = false
    }
    if(item.id ==3 ){
       this.stateorganigrama = false
      this.statecultura = false
      this.stateformatos =true
    }
  }

}
