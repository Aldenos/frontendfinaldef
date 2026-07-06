import { Component, input } from '@angular/core';

export interface ChartSeries {
  name: string;
  color: string;
}

export interface ChartGroup {
  label: string;
  values: number[]; // Debe coincidir en orden con las 'series'
}

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  templateUrl: './bar-chart.html',
  styleUrl: './bar-chart.css',
})
export class BarChartComponent {
  title = input<string>('');
  subtitle = input<string>('');
  
  // Las leyendas y colores 
  series = input.required<ChartSeries[]>();
  
  // Los datos del backend 
  data = input.required<ChartGroup[]>();
  
  // Valor máximo para calcular la altura relativa
  maxValue = input<number>(100);
}