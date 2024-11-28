import { Component,InputOptions,OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ServicioAPIService } from '../servicio-api.service';
import { Router } from '@angular/router';
import { ApiResponse } from '../../interfaces';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { infoEmpresa,ApiResponseEmpresa,CrearContratista,Contratista,CrearContrato} from '../../interfaces';
@Component({
  selector: 'app-navegacion',
  standalone: true,
  imports: [RouterOutlet,CommonModule,ReactiveFormsModule],
  templateUrl: './navegacion.component.html',
  styleUrl: './navegacion.component.css'
})
export default class NavegacionComponent implements OnInit{
  formContratista!:FormGroup;
  formcontrato!:FormGroup
  formempresa!:FormGroup
  id_empresa:number|any
  usuario:string = ''
  contratistas:boolean = false
  empresa:boolean = false
  id:number|any
  cargando:boolean = false
  empresacreada: boolean = false
  empresainfo:ApiResponseEmpresa|any
  contratislista:Contratista |any
  constructor(private fb:FormBuilder,public servicio:ServicioAPIService,private router: Router){}
  ngOnInit(): void {
    this.formContratista = this.initFormContratis();
    this.formcontrato = this.initFormContrato()
    this.formempresa = this.initFormCrearEmpresa();
    let nombreusuario = this.servicio.getCookie('user_back_name')
    if(nombreusuario){
      this.usuario = nombreusuario;
    }else{
      this.usuario = 'Usuario no identificado'
    }
    let id_usuario = this.servicio.getCookie('user_back_id')
    if(id_usuario){
      this.id = id_usuario
    }else{
      this.router.navigate(['/sign-in']);
    }
  }
  initFormContratis():FormGroup{
    return this.fb.group({
      nombre:[''],
      edad:[''],
      ocupacion:[''],
      domicilio:[''],
      telefono:['']
    })
  }
  initFormContrato():FormGroup{
    return this.fb.group({
      nombre:[''],
      tipo:[''],
      color:[''],
      lugar:[''],
      fecha_inicio:[''],
      fecha_entrega:[''],
      id_contratista:['']
    })
  }
  initFormCrearEmpresa():FormGroup{
    return this.fb.group({
      nombre:[''],
      sector:[''],
      ubicacion:[''],
      correo:[''],
      telefono:[''],
      sitio_web:[''],
      descripcion:['']
    })
  }
  cerrarsesion(){
    this.servicio.clearUserData();
    this.router.navigate(['sign-in']);
  }

}
