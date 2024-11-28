import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private baseUrl = 'http://127.0.0.1:5000/api'
  constructor(private http:HttpClient) { }

  // Ejemplo: Obtener datos
  getData(endpoint: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${endpoint}`);
  }

  getDataParam(endpoint: string, params: { [key: string]: any }): Observable<any> {
    const httpParams = new HttpParams({ fromObject: params });
    return this.http.get(`${this.baseUrl}/${endpoint}`, { params: httpParams });
  }

  postData(endpoint: string, data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/${endpoint}`, data, { headers });
  }

  postData_files(endpoint: string, data: any): Observable<any> {
    let headers = new HttpHeaders();
    return this.http.post(`${this.baseUrl}/${endpoint}`, data, { headers });
  }

  updateData(endpoint: string, data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.baseUrl}/${endpoint}`, data, { headers });
  }

  updateData_file(endpoint: string, data: any): Observable<any> {
    const headers = new HttpHeaders();
    return this.http.put(`${this.baseUrl}/${endpoint}`, data, { headers });
  }

  deleteData(endpoint: string, data:any): Observable<any> {
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: data, // El cuerpo JSON que se enviará
    };
    return this.http.delete(`${this.baseUrl}/${endpoint}`, options);
  }

}
