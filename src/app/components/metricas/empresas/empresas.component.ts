import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MetricasService } from '../metricas.service';


import {
  Chart,
  registerables // Importa todos los componentes necesarios
} from 'chart.js';

@Component({
  selector: 'app-empresas',
  standalone: true,
  imports: [],
  templateUrl: './empresas.component.html',
  styleUrl: './empresas.component.css'
})
export class EmpresasComponent {
  @ViewChild('sexoChartCanvas', { static: true }) sexoChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('registroChartCanvas', { static: true }) registroChartCanvas!: ElementRef<HTMLCanvasElement>;
  distribucionSexo: { nombre: string; total_contratos: number }[] = [];
  distribucionRegistros: { sector: string; total: number }[] = [];
  constructor(private serv:MetricasService){
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.fetchDistribucionSexo();
    this.fetchRegistrosDiarios();
  }

  fetchDistribucionSexo():void{
    this.serv.getData('metrics/empresasnumcontratos').subscribe({
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
    this.serv.getData('metrics/empresassector').subscribe({
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
        type: 'pie',
        data: {
          labels: this.distribucionRegistros.map(d => d.sector),
          datasets: [{
            label: 'Registros',
            data: this.distribucionRegistros.map(d => d.total),
            backgroundColor: [
              '#FF99A5', '#FFC966', '#FFEE99', '#6FD7E3', '#BFA1E8',
              '#FFAA75', '#94E8A6', '#6EC7FF', '#BCAAA4', '#FF9DAA',
              '#E6E06C', '#D69CF2', '#A8B7F3', '#FFB5D1', '#FFDB7F',
              '#B8E07C', '#6FD3E6', '#C4DB6F', '#F3FCE6', '#A4D8FF',
              '#FFAB91', '#C4D933', '#6CCFFF', '#8ED6A7', '#DA82D4'
            ]
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
          labels: this.distribucionSexo.map(d => d.nombre),
          datasets: [
            {
              data: this.distribucionSexo.map(d => d.total_contratos),
              backgroundColor: [
                '#FF99A5', '#FFC966', '#FFEE99', '#6FD7E3', '#BFA1E8',
                '#FFAA75', '#94E8A6', '#6EC7FF', '#BCAAA4', '#FF9DAA',
                '#E6E06C', '#D69CF2', '#A8B7F3', '#FFB5D1', '#FFDB7F',
                '#B8E07C', '#6FD3E6', '#C4DB6F', '#F3FCE6', '#A4D8FF',
                '#FFAB91', '#C4D933', '#6CCFFF', '#8ED6A7', '#DA82D4'
              ]
            }
          ]
        }
      });
    }
  }
}
