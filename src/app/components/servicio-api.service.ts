import { Injectable } from '@angular/core';
import { sign_in } from '../interfaces';
import { Observable,BehaviorSubject  } from 'rxjs';
import { HttpClient} from '@angular/common/http';
import { ApiResponse, tablas } from '../interfaces';
import { sign_up } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ServicioAPIService {
  private apiUrl = 'http://127.0.0.1:5000/';
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();
  constructor(private http: HttpClient) { }

  sign_in(datos: sign_in): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.apiUrl + 'api/sign-in', datos);
  }
  saveUserData(userData: any): void {
    this.setCookie('user_back_id', userData.id, 7);
    this.setCookie('user_back_name', userData.nombre, 7);
    this.setCookie('back_correo', userData.correo, 7);
  }
  // Limpiar las cookies (cerrar sesión)
  clearUserData(): void {
    this.deleteCookie('user_back_id');
    this.deleteCookie('user_back_name');
    this.deleteCookie('back_correo');
  }
  sign_up(data:sign_up):Observable<ApiResponse>{
    return this.http.post<ApiResponse>(this.apiUrl + 'api/sign-up', data);
  }
  // Métodos para gestionar cookies
  private setCookie(name: string, value: string, days: number): void {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
  }

  private deleteCookie(name: string): void {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }
  getCookie(name: string): string | null {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [key, value] = cookie.trim().split('=');
      if (key === name) {
        return value;
      }
    }
    return null;
  }
  // getContratista(id_usuario:any):Observable<ApiResponse>{
  //   return this.http.get<ApiResponse>(this.apiUrl + '/api/contratistas/listarcontratistas?idEmpresa='+id_usuario);
  // }
  // getContratos(id_usuario:any):Observable<ApiResponse>{
  //   return this.http.get<ApiResponse>(this.apiUrl+'/api/contratos/listarcontratos?idEmpresa='+id_usuario)
  // }

  getTablas():Observable<tablas>{
    return this.http.get<tablas>(this.apiUrl+'api/bd/listartablas')
  }
}



