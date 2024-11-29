import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MetricasService } from '../metricas.service';

import {
  Chart,
  registerables // Importa todos los componentes necesarios
} from 'chart.js';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {
  @ViewChild('sexoChartCanvas', { static: true }) sexoChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('registroChartCanvas', { static: true }) registroChartCanvas!: ElementRef<HTMLCanvasElement>;
  distribucionSexo: { sexo: string; total: number }[] = [];
  distribucionRegistros: { fecha: string; registros_por_dia: number }[] = [];
  constructor(private serv:MetricasService){
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.fetchDistribucionSexo();
    this.fetchRegistrosDiarios();
  }

  fetchDistribucionSexo():void{
    this.serv.getData('metrics/distribucion-sexo').subscribe({
      next: (data: any) => {
        console.log('Datos recibidos:', data);
        this.distribucionSexo = data.metricas || [];
        this.createSexoChart();
      },
      error: (error) => {

        console.error('Error al obtener las tablas:', error);
      },
      complete: () => {
        console.log('Solicitud completada');
      }
    });
  }
  fetchRegistrosDiarios():void{
    this.serv.getData('metrics/registrosdiarios').subscribe({
      next: (data: any) => {
        console.log('Datos recibidos:', data);
        this.distribucionRegistros = data.metricas || [];
        this.createChartRegistros();
      },
      error: (error) => {

        console.error('Error al obtener las tablas:', error);
      },
      complete: () => {
        console.log('Solicitud completada');
      }
    });
  }

  createChartRegistros(): void{
    const ctx = this.registroChartCanvas.nativeElement.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.distribucionRegistros.map(d => d.fecha),
          datasets: [{
            label: 'Registros',
            data: this.distribucionRegistros.map(d => d.registros_por_dia),
            backgroundColor: '#007bff'
          }]
        }
      });
    }

  }

  createSexoChart(): void {
    const ctx = this.sexoChartCanvas.nativeElement.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: this.distribucionSexo.map(d => d.sexo),
          datasets: [
            {
              data: this.distribucionSexo.map(d => d.total),
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
            }
          ]
        }
      });
    }
  }


}
