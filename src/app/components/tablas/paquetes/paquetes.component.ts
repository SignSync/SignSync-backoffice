import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl} from '@angular/forms';
import { UsuarioService } from '../usuario/usuario.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-paquetes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers:[UsuarioService],
  templateUrl: './paquetes.component.html',
  styleUrl: './paquetes.component.css'
})
export class PaquetesComponent {
  constructor(private serv:UsuarioService, private fb: FormBuilder){}

  formgroup!:FormGroup;
  idPaquete!:string | null;
  paquetes:any;
  paquete:any;
  contratos:any;

  initFormPaquete():FormGroup{
    return this.fb.group({
      nombre:[''],
      costo:[''],
      idContrato:['']
    })
  }

  ngOnInit(): void {
    this.formgroup = this.initFormPaquete();
    this.getPaquetes();
    this.getContratos();
  }

  getPaquetes():void{
    this.serv.getData('paquetes/listarpaquetes').subscribe({
      next: (data: any) => {
        // console.log('Datos recibidos:', data);
        this.paquetes = data;
        console.log(this.paquetes);
      },
      error: (error) => {
        console.error('Error al obtener las tablas:', error);
        if (error.error?.message === 'No se han encontrado paquetes.') {
          console.error('Error específico identificado:', error.error.message);
        }
      },
      complete: () => {
        console.log('Solicitud completada');
      }
    });
  }
  getContratos():void{
    this.serv.getData('contratos/getcontratosALL').subscribe({
      next: (data: any) => {
        console.log('Datos recibidos:', data);
        this.contratos = data;
      },
      error: (error) => {
        console.error('Error al obtener las tablas:', error);
      },
      complete: () => {
        console.log('Solicitud completada');
      }
    });
  }

  deletePaquete(idPaquete:string):void{
    const data = { idPaquete }
    Swal.fire({
      title: "Estas seguro de eliminar este paquete?",
      text: "Esta acción no será reversible!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminalo!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.serv.deleteData('paquetes/paquete', data).subscribe({
          next: (data: any) => {
            console.log('Datos recibidos:', data);
            if(data.status){
              Swal.fire({
                icon: "success",
                title: "Paquete eliminado correctamente",
                showConfirmButton: false,
                timer: 1500
              }).then(() => {
                this.getPaquetes()
              });
            }
            else{
              Swal.fire({
                icon: "error",
                title: "Hubo un error al eliminar el paquete",
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


  showModal(idPaquete:string):void{
    if(idPaquete !== ''){
      // this.formgroup.get('idContrato')?.disable();
      this.editPaquete(idPaquete);
      return;
    }
    this.reset();
    //
  }

  reset():void{
    console.log('reset')
    this.formgroup.reset();
    this.idPaquete = null;
    // this.formgroup.get('idContrato')?.enable();
  }

  createPaquete(newdata:any):void{
    console.log(newdata)
    this.serv.postData('paquetes/paquete', newdata).subscribe({
      next: (data: any) => {
        console.log('Datos recibidos:', data);
        if(data.status){
          Swal.fire({
            icon: "success",
            title: "Paquete creado correctamente",
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.getPaquetes()
          });
        }
        else{
          Swal.fire({
            icon: "error",
            title: "Hubo un error al crear el paquete",
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.getPaquetes()
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


  editPaquete(idPaquete:string):void{
    // console.log('idPaquete: ' + idPaquete)
    this.idPaquete = idPaquete;
    const params = { idPaquete };
    this.serv.getDataParam('paquetes/paquete', params).subscribe({
      next: (data: any) => {
          // console.log('Datos recibidos:', data);
          this.paquete = data;
          if (data.status) {
            const paquete = data.paquete[0];
            this.formgroup.patchValue({
              nombre: paquete.nombre,
              costo: paquete.costo,
              idContrato: paquete.idContrato
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

    // console.log(this.id_contratista);
    if(!this.idPaquete){
      this.createPaquete(newdata);
      return;
    }

    console.log(newdata)
    newdata.idPaquete = this.idPaquete;
    this.serv.updateData('paquetes/paquete', newdata).subscribe({
      next: (data: any) => {
        console.log('Datos recibidos:', data);
        if(data.status){
          Swal.fire({
            icon: "success",
            title: "Paquete editado correctamente",
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.getPaquetes()
          });
        }
        else{
          Swal.fire({
            icon: "error",
            title: "Hubo un error al editar el paquete",
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.getPaquetes()
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
