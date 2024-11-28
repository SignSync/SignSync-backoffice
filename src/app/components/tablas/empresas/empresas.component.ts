import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../usuario/usuario.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup} from '@angular/forms';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-empresas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers:[UsuarioService],
  templateUrl: './empresas.component.html',
  styleUrl: './empresas.component.css'
})
export class EmpresasComponent implements OnInit {


  constructor(private serv:UsuarioService, private fb: FormBuilder){}

  formgroup!:FormGroup;
  id_user!:string;
  idEmpresa!:string | null;
  empresas:any;
  empresa:any;
  usuarios:any;

  initFormUser():FormGroup{
    return this.fb.group({
      nombre:[''],
      sector:[''],
      correo:[''],
      telefono:[''],
      descripcion:[''],
      sitio_web:[''],
      id_usuario:[''],
    })
  }

  ngOnInit(): void {
    this.formgroup = this.initFormUser();
    this.getEmpresas();
  }

  getEmpresas():void{
    this.serv.getData('empresa/listarempresas').subscribe({
      next: (data: any) => {
        console.log('Datos recibidos:', data);
        this.empresas = data;
        console.log(this.empresas)
      },
      error: (error) => {
        console.error('Error al obtener las tablas:', error);
      },
      complete: () => {
        console.log('Solicitud completada');
      }
    });
  }

  deleteEmpresa(idEmpresa:string):void{
    const data = { idEmpresa }
    Swal.fire({
      title: "Estas seguro de eliminar esta empresa?",
      text: "Esta acción no será reversible!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminalo!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.serv.deleteData('empresa/eliminarEmpresa', data).subscribe({
          next: (data: any) => {
            // console.log('Datos recibidos:', data);
            if(data.status){
              Swal.fire({
                icon: "success",
                title: "Empresa eliminada correctamente",
                showConfirmButton: false,
                timer: 1500
              }).then(() => {
                this.getEmpresas();
              });
            }
            else{
              Swal.fire({
                icon: "error",
                title: "Hubo un error al eliminar la empresa",
                showConfirmButton: false,
                timer: 1500
              });
            }
          },
          error: (error) => {
            console.error('Error al eliminar la empresa:', error);
          },
          complete: () => {
            console.log('Solicitud completada');
          }
        });
      }
    });
  }

  createEmpresa(newdata:any):void{

    this.serv.postData('empresa/createempresa', newdata).subscribe({
      next: (data: any) => {
        // console.log('Datos recibidos:', data);
        if(data.status){
          Swal.fire({
            icon: "success",
            title: "Empresa creado correctamente",
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.getEmpresas()
          });
        }
        else{
          Swal.fire({
            icon: "error",
            title: "Hubo un error al crear la empresa",
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.getEmpresas()
          });
        }
      },
      error: (error) => {
        console.error('Error al editar al crear la empresa:', error);
      },
      complete: () => {
        console.log('Solicitud completada');
      }
    });
  }

  showModal(idEmpresa:string):void{
    if(idEmpresa === ''){
      this.reset();
      return;
    }
    this.editEmpresa(idEmpresa);
  }

  reset():void{
    this.formgroup.reset();
    this.idEmpresa = null;
    this.getUsuarios()
  }

  getUsuarios():void{
    this.serv.getData('perfil/listar').subscribe({
      next: (data: any) => {
        // console.log('Datos recibidos:', data);
        this.usuarios = data;
      },
      error: (error) => {
        console.error('Error al obtener los datos:', error);
      },
      complete: () => {
        console.log('Solicitud completada');
      }
    });
  }

  editEmpresa(idEmpresa:string):void{
    console.log(idEmpresa)
    this.idEmpresa = idEmpresa;
    const params = { idEmpresa };
    this.getUsuarios()

    this.serv.getDataParam('empresa/getempresa', params).subscribe({
      next: (data: any) => {
        // console.log('Datos recibidos:', data);
        this.empresa = data;
        if (data.status && data.empresa) {
          const empresa = data.empresa;
          console.log(empresa)
          this.formgroup.patchValue({
            nombre: empresa.nombre,
            sector: empresa.sector,
            correo: empresa.correo,
            telefono: empresa.telefono,
            descripcion: empresa.descripcion,
            sitio_web: empresa.sitio_web,
            id_usuario: empresa.id_usuario
          });
        }
      },
      error: (error) => {
          console.error('Error al obtener los datos:', error);
      },
      complete: () => {
          console.log('Solicitud completada');
      }
    });

  }

  edit_submit():void{
    const newdata = this.formgroup.value;

    if(!this.idEmpresa){
      this.createEmpresa(newdata)
      return;
    }

    newdata.id_empresa = this.idEmpresa;
    this.serv.updateData('empresa/editarEmpresa', newdata).subscribe({
      next: (data: any) => {
        // console.log('Datos recibidos:', data);
        if(data.status){
          Swal.fire({
            icon: "success",
            title: "Empresa editado correctamente correctamente",
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.getEmpresas()
          });
        }
        else{
          Swal.fire({
            icon: "error",
            title: "Hubo un error al editar la empresa",
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            // Recargar la página
            this.getEmpresas()
          });
        }
      },
      error: (error) => {
        console.error('Error al editar la empresa:', error);
      },
      complete: () => {
        console.log('Solicitud completada');
      }
    });
  }

}
