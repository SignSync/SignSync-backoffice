import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UsuarioService } from '../usuario/usuario.service';
import { ReactiveFormsModule, FormControl, FormBuilder, FormGroup } from '@angular/forms';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-contratistas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [UsuarioService],
  templateUrl: './contratistas.component.html',
  styleUrl: './contratistas.component.css'
})
export class ContratistasComponent {
  constructor(private serv:UsuarioService, private fb: FormBuilder){}

  formgroup!:FormGroup;
  id_contratista!:string | null;
  contratistas:any;
  contratista:any;
  empresas:any;

  initFormContratista():FormGroup{
    return this.fb.group({
      nombre:[''],
      ocupacion:[''],
      domicilio:[''],
      edad:[''],
      fecha_nacimiento:[''],
      telefono:[''],
      idEmpresa:['']
    })
  }

  ngOnInit(): void {
    this.formgroup = this.initFormContratista();
    this.getContratistas();
    this.getEmpresas();
  }

  getContratistas():void{
    this.serv.getData('contratistas/listarcontratistas-all').subscribe({
      next: (data: any) => {
        // console.log('Datos recibidos:', data);
        this.contratistas = data;
        console.log(this.contratistas);
      },
      error: (error) => {
        console.error('Error al obtener las tablas:', error);
      },
      complete: () => {
        console.log('Solicitud completada');
      }
    });
  }
  getEmpresas():void{
    this.serv.getData('empresa/listarempresas').subscribe({
      next: (data: any) => {
        console.log('Datos recibidos:', data);
        this.empresas = data;
      },
      error: (error) => {
        console.error('Error al obtener las tablas:', error);
      },
      complete: () => {
        console.log('Solicitud completada');
      }
    });
  }

  deleteContratista(idContratista:string):void{
    const data = { idContratista }
    Swal.fire({
      title: "Estas seguro de eliminar este contratista?",
      text: "Esta acción no será reversible!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminalo!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.serv.deleteData('contratistas/eliminarcontratista', data).subscribe({
          next: (data: any) => {
            console.log('Datos recibidos:', data);
            if(data.status){
              Swal.fire({
                icon: "success",
                title: "Contratista eliminado correctamente",
                showConfirmButton: false,
                timer: 1500
              }).then(() => {
                this.getContratistas()
              });
            }
            else{
              Swal.fire({
                icon: "error",
                title: "Hubo un error al eliminar al contratista",
                showConfirmButton: false,
                timer: 1500
              });
            }
          },
          error: (error) => {
            console.error('Error al obtener las tablas:', error);
            const errorMessage = error.error?.message || 'Ocurrió un error desconocido';
            Swal.fire({
              icon: "error",
              title: errorMessage,
              showConfirmButton: true
            });
          },
          complete: () => {
            console.log('Solicitud completada');
          }
        });
      }
    });
  }


  showModal(id_contratista:string):void{
    if(id_contratista !== ''){
      this.formgroup.get('idEmpresa')?.disable();
      this.editContratista(id_contratista);
      return;
    }
    this.reset();
    //
  }

  reset():void{
    console.log('reset')
    this.formgroup.reset();
    this.id_contratista = null;
    this.formgroup.get('idEmpresa')?.enable();
  }

  createContratista(newdata:any):void{
    console.log(newdata)
    this.serv.postData('contratistas/crearcontratistas', newdata).subscribe({
      next: (data: any) => {
        console.log('Datos recibidos:', data);
        if(data.status){
          Swal.fire({
            icon: "success",
            title: "Contratista creado correctamente",
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.getContratistas()
          });
        }
        else{
          Swal.fire({
            icon: "error",
            title: "Hubo un error al crear el contratista",
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.getContratistas()
          });
        }
      },
      error: (error) => {
        console.error('Error al editar al usuario:', error);
        const errorMessage = error.error?.message || 'Ocurrió un error desconocido';
        Swal.fire({
          icon: "error",
          title: errorMessage,
          showConfirmButton: true
        });
      },
      complete: () => {
        console.log('Solicitud completada');
      }
    });
  }


  editContratista(id_contratista:string):void{

    console.log('id_contratista: ' + id_contratista)
    this.id_contratista = id_contratista;
    const params = { id_contratista };
    this.serv.getDataParam('contratistas/getcontratista', params).subscribe({
      next: (data: any) => {
          console.log('Datos recibidos:', data);
          this.contratista = data;
          if (data.status) {
            const contratista = data.contratista;
            this.formgroup.patchValue({
              nombre: contratista.nombre,
              ocupacion: contratista.ocupacion,
              domicilio: contratista.domicilio,
              edad: contratista.edad,
              telefono: contratista.telefono,
              idEmpresa: contratista.id_empresa
            });
          }
      },
      error: (error) => {
          console.error('Error al obtener las tablas:', error);
          const errorMessage = error.error?.message || 'Ocurrió un error desconocido';
          Swal.fire({
            icon: "error",
            title: errorMessage,
            showConfirmButton: true
          });
      },
      complete: () => {
          console.log('Solicitud completada');
      }
    });

  }

  edit_submit():void{
    const newdata = this.formgroup.value;
    console.log(newdata)

    console.log(this.id_contratista);
    if(!this.id_contratista){
      console.log('HA CREAR')
      this.createContratista(newdata);
      return;
    }

    newdata.idContratista = this.id_contratista;
    this.serv.updateData('contratistas/editarcontratistas', newdata).subscribe({
      next: (data: any) => {
        console.log('Datos recibidos:', data);
        if(data.status){
          Swal.fire({
            icon: "success",
            title: "Contratista editado correctamente",
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.getContratistas()
          });
        }
        else{
          Swal.fire({
            icon: "error",
            title: "Hubo un error al editar el contratista",
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.getContratistas()
          });
        }
      },
      error: (error) => {
        console.error('Error al editar al contratista:', error);
        const errorMessage = error.error?.message || 'Ocurrió un error desconocido';
        Swal.fire({
          icon: "error",
          title: errorMessage,
          showConfirmButton: true
        });
      },
      complete: () => {
        console.log('Solicitud completada');
      }
    });
  }


  formatDate(fecha: string): string {
    if (!fecha) return ''; // Manejar fechas nulas o indefinidas
    const date = new Date(fecha);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mes empieza en 0
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

}
