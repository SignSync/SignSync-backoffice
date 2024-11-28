import { Component } from '@angular/core';
import { UsuarioService } from '../usuario/usuario.service';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import Swal from 'sweetalert2';


interface Contrato {
  idContrato: number;
  color: string;
  fecha_entrega: string;
  fecha_inicio: string;
  id_empresa: number;
  lugar: string;
  nombre: string;
  tipo: string;
}


@Component({
  selector: 'app-contratos',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers: [UsuarioService, DatePipe],
  templateUrl: './contratos.component.html',
  styleUrl: './contratos.component.css'
})
export class ContratosComponent {

  constructor(private serv:UsuarioService, private fb: FormBuilder, private datePipe: DatePipe){}

  formgroup!:FormGroup;
  id_user!:string;
  idContrato!:string | null;
  empresas:any;
  contratos:any;
  contrato:any;
  contratistas:any;
  idContratista!:string;

  initFormUser():FormGroup{
    return this.fb.group({
      nombre:[''],
      tipo:[''],
      lugar:[''],
      fecha_entrega:[''],
      fecha_inicio:[''],
      color:[''],
      id_empresa:[''],
      id_contratista:[''],
    })
  }

  ngOnInit(): void {
    this.formgroup = this.initFormUser();
    this.getContratos();
    this.formgroup.get('id_empresa')?.valueChanges.subscribe((value) => {
      console.log('Valor seleccionado:', value);
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

  deleteContrato(idContrato:string):void{
    const data = { idContrato }
    Swal.fire({
      title: "Estas seguro de eliminar este contrato?",
      text: "Esta acción no será reversible!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminalo!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.serv.deleteData('contratos/deletecontrato', data).subscribe({
          next: (data: any) => {
            // console.log('Datos recibidos:', data);
            if(data.status){
              Swal.fire({
                icon: "success",
                title: "Contrato eliminado correctamente",
                showConfirmButton: false,
                timer: 1500
              }).then(() => {
                this.getContratos();
              });
            }
            else{
              Swal.fire({
                icon: "error",
                title: "Hubo un error al eliminar el contrato",
                showConfirmButton: false,
                timer: 1500
              });
            }
          },
          error: (error) => {
            console.error('Error al eliminar el contrato:', error);
          },
          complete: () => {
            console.log('Solicitud completada');
          }
        });
      }
    });
  }


  showModal(idContrato:string):void{
    if(idContrato === ''){
      this.reset();
      this.getEmpresas()
      return;
    }
    this.editContrato(idContrato);
  }

  reset():void{
    this.formgroup.reset();
    this.idContrato = null;
    this.formgroup.get('id_contratista')?.enable();
    this.formgroup.get('id_empresa')?.enable();

  }

  getContratistas():void{
    const idEmpresa = this.formgroup.get('id_empresa')?.value;
    console.log('ID Empresa seleccionada:', idEmpresa);
    const params = { idEmpresa };
    this.serv.getDataParam('contratistas/listarcontratistas', params).subscribe({
      next: (data: any) => {
        console.log('Datos recibidos:', data);
        this.contratistas = data;
      },
      error: (error) => {
        const errorMessage = error.error?.message || 'Ocurrió un error desconocido';
        console.error('Error al obtener los datos:', error);
        Swal.fire({
          icon: "error",
          title: errorMessage,
          // text: "Por favor, seleccione otra empresa o agregue contratistas a esta.",
          showConfirmButton: true
        });
        this.formgroup.get('id_contratista')?.reset();
      },
      complete: () => {
        console.log('Solicitud completada');
      }
    });
  }

  getEmpresas():void{
    this.serv.getData('empresa/listarempresas').subscribe({
      next: (data: any) => {
        console.log(data)
        this.empresas = data;
      },
      error: (error) => {
        console.error('Error al obtener los datos:', error);
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

  createContrato(newdata:any):void{
    console.log('CREATE')
    this.serv.postData('contratos/crearcontrato', newdata).subscribe({
      next: (data: any) => {
        // console.log('Datos recibidos:', data);
        if(data.status){
          Swal.fire({
            icon: "success",
            title: "Contrato creado correctamente",
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.getContratos()
          });

        }
        else{
          Swal.fire({
            icon: "error",
            title: "Hubo un error al crear la empresa",
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.getContratos()
          });
        }
      },
      error: (error) => {
        console.error('Error al editar al crear la empresa:', error);
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

  editContrato(idContrato:string):void{
    console.log(idContrato)
    this.idContrato = idContrato;
    const params = { idContrato };
    this.getEmpresas()

    this.formgroup.get('id_contratista')?.disable();
    this.formgroup.get('id_empresa')?.disable();

    this.serv.getDataParam('contratos/getcontrato', params).subscribe({
      next: (data: any) => {
        console.log('Datos recibidos:', data);
        this.contrato = data;
        if (data.status && data.contratos) {
          const contrato = data.contratos[0].contrato_data;
          console.log(contrato)
          // this.getContratistas(contrato.id_empresa)
          this.formgroup.patchValue({
            nombre: contrato.nombre,
            tipo: contrato.tipo,
            lugar: contrato.lugar,
            fecha_entrega: contrato.fecha_entrega,
            fecha_inicio: contrato.fecha_inicio,
            color: contrato.color,
            id_empresa: contrato.id_empresa,
            id_contratista: contrato.idContratista
          });
          this.idContratista = contrato.idContratista;
          this.getContratistas()
        }
      },
      error: (error) => {
        console.error('Error al obtener los datos:', error);
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
    if (newdata.fecha_inicio) {
      const fechaInicio = typeof newdata.fecha_inicio === 'string'
        ? new Date(newdata.fecha_inicio.replace(/-/g, '/')) // Convertir a objeto Date si es una cadena
        : newdata.fecha_inicio; // Usar directamente si ya es un objeto Date

      newdata.fecha_inicio = this.datePipe.transform(fechaInicio, 'dd-MM-yyyy');
    }

    if (newdata.fecha_entrega) {
      const fechaEntrega = typeof newdata.fecha_entrega === 'string'
        ? new Date(newdata.fecha_entrega.replace(/-/g, '/')) // Convertir a objeto Date si es una cadena
        : newdata.fecha_entrega; // Usar directamente si ya es un objeto Date

      newdata.fecha_entrega = this.datePipe.transform(fechaEntrega, 'dd-MM-yyyy');
    }


    if(!this.idContrato){
      this.createContrato(newdata)
      return;
    }

    newdata.idContrato = this.idContrato;
    newdata.idContratista = this.idContratista;

    console.log('newdata: ')
    console.log( newdata)
    this.serv.updateData('contratos/editcontrato', newdata).subscribe({
      next: (data: any) => {
        // console.log('Datos recibidos:', data);
        if(data.status){
          Swal.fire({
            icon: "success",
            title: "Empresa editado correctamente correctamente",
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.getContratos()
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
            this.getContratos()
          });
        }
      },
      error: (error) => {
        console.error('Error al editar la empresa:', error);
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

}
