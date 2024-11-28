import { Component } from '@angular/core';
import { ServicioAPIService } from '../../servicio-api.service';
import { tablas } from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all.component.html',
  styleUrl: './all.component.css'
})
export class AllComponent {

  constructor(private service: ServicioAPIService, private router:Router) {}

  tablasData:any;
  ngOnInit(): void {
    this.service.getTablas().subscribe({
      next: (data: tablas) => {
        console.log('Datos recibidos:', data);
        this.tablasData = data;
        Object.keys(this.tablasData).forEach(tabla => {
          console.log(`Tabla: ${tabla}`);
          console.log('Columnas:', this.tablasData[tabla].columns);
        });
      },
      error: (error) => {
        console.error('Error al obtener las tablas:', error);
      },
      complete: () => {
        console.log('Solicitud completada');
      }
    });
  }

  getKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  navigateToUrl(tabla:string):void {
    this.router.navigate([`tablas/${tabla}`]);
  }

}
