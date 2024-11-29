import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Chart } from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class MetricasService {
  private baseUrl = 'http://127.0.0.1:5000/api'
  constructor(private http:HttpClient) { }



  getData(endpoint: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${endpoint}`);
  }

}
