import { Component } from '@angular/core';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { trigger, transition, style, animate } from '@angular/animations';
@Component({
  selector: 'app-organigrama',
  standalone: true,
  imports: [CarouselModule],
  templateUrl: './organigrama.component.html',
  styleUrl: './organigrama.component.scss'
})
export class OrganigramaComponent {

    slides2 = [
      {
        id: '1',
        src: 'assets/organigrama/1. ORGANIGRAMA GLOBAL - FEED THE HUNGRY .png',
        alt: 'Slide 1',
        title: 'Organigrama global'
      },
      {
        id: '2',
        src: 'assets/organigrama/2. ORGANIGRAMA OPERACIONES.png',
        alt: 'Slide 2',
        title: 'Organigrama operaciones'
      },
      {
        id: '3',
        src: 'assets/organigrama/3. ORGANIGRAMA GLOBAL ESPECÍFICO.png',
        alt: 'Slide 3',
        title: 'Organigrama global especifico'
      },
      {
        id: '4',
        src: 'assets/organigrama/4. ORGANIGRAMA OPERACIONES ESPECÍFICO.png',
        alt: 'Slide 3',
        title: 'Organigrama operaciones especifico'
      },
      {
        id: '5',
        src: 'assets/organigrama/5. ORGANIGRAMA CONSEJO DIRECTIVO.png',
        alt: 'Slide 3',
        title: 'Organigrama consejo directivo'
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

}
