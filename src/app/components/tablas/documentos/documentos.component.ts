import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { UsuarioService } from '../usuario/usuario.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-documentos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers:[UsuarioService],
  templateUrl: './documentos.component.html',
  styleUrl: './documentos.component.css'
})
export class DocumentosComponent {
  constructor(private serv:UsuarioService, private fb: FormBuilder){}
  formgroup!:FormGroup;
  idDocumento!:string | null;
  documentos:any;
  documento:any;
  contratos:any;
  filepath!:string | null;

  selectedFile: File | null = null;

  initFormDocumento():FormGroup{
    return this.fb.group({
      nombre:[''],
      file:[''],
      idContrato:['']
    })
  }

  ngOnInit(): void {
    this.formgroup = this.initFormDocumento();
    this.getDocumentos();
    this.getContratos();
  }

  getDocumentos():void{
    this.serv.getData('documentos/listardocumentosall').subscribe({
      next: (data: any) => {
        // console.log('Datos recibidos:', data);
        this.documentos = data;
        console.log(this.documentos);
      },
      error: (error) => {
        console.error('Error al obtener las tablas:', error);
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

  deleteDocumento(idDocumento:string):void{
    const data = { idDocumento }
    Swal.fire({
      title: "Estas seguro de eliminar este documento?",
      text: "Esta acción no será reversible!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminalo!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.serv.deleteData('documentos/deletedocumento', data).subscribe({
          next: (data: any) => {
            console.log('Datos recibidos:', data);
            if(data.status){
              Swal.fire({
                icon: "success",
                title: "Documento eliminado correctamente",
                showConfirmButton: false,
                timer: 1500
              }).then(() => {
                this.getDocumentos()
              });
            }
            else{
              Swal.fire({
                icon: "error",
                title: "Hubo un error al eliminar el documento",
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


  showModal(idDocumento:string):void{
    if(idDocumento !== ''){
      // this.formgroup.get('idContrato')?.disable();
      this.editDocumento(idDocumento);
      return;
    }
    this.reset();
    //
  }

  reset():void{
    console.log('reset')
    this.formgroup.reset();
    this.idDocumento = null;
    this.filepath = null;
    // this.formgroup.get('idContrato')?.enable();
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB de límite
        Swal.fire({
          icon: "error",
          title: "El archivo es demasiado grande",
          text: "Debe ser menor a 5MB",
          showConfirmButton: true
        });
        return;
      }
      this.selectedFile = file; // Asignar archivo válido
    }
  }

  createDocumento(newdata:any):void{
    const formData = new FormData();
    formData.append('nombre', newdata.nombre);
    formData.append('idContrato', newdata.idContrato);
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    } else {
      Swal.fire({
        icon: "error",
        title: "Archivo faltante",
        text: "Por favor selecciona un archivo para subir",
        showConfirmButton: true
      });
      return;
    }


    console.log(formData)
    this.serv.postData_files('documentos/creardocumento', formData).subscribe({
      next: (data: any) => {
        console.log('Datos recibidos:', data);
        if(data.status){
          Swal.fire({
            icon: "success",
            title: "Documento creado correctamente",
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.getDocumentos()
          });
        }
        else{
          Swal.fire({
            icon: "error",
            title: "Hubo un error al crear el paquete",
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.getDocumentos()
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


  editDocumento(idDocumento:string):void{
    // console.log('idPaquete: ' + idPaquete)
    this.idDocumento = idDocumento;
    const params = { idDocumento };
    this.serv.getDataParam('documentos/getdocumento', params).subscribe({
      next: (data: any) => {
          // console.log('Datos recibidos:', data);
          this.documento = data;
          if (data.status) {
            const documento = data.documento[0];
            this.formgroup.patchValue({
              nombre: documento.nombre,
              idContrato: documento.idContrato
            });
            this.filepath =  documento.url;
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
    if(!this.idDocumento){
      this.createDocumento(newdata);
      return;
    }

    console.log(newdata)
    const formData = new FormData();
    formData.append('nombre', newdata.nombre);
    formData.append('idContrato', newdata.idContrato);
    formData.append('idDocumento', this.idDocumento);
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    } else {
      Swal.fire({
        icon: "error",
        title: "Archivo faltante",
        text: "Por favor selecciona un archivo para subir",
        showConfirmButton: true
      });
      return;
    }

    this.serv.updateData('documentos/editardocumento', formData).subscribe({
      next: (data: any) => {
        console.log('Datos recibidos:', data);
        if(data.status){
          Swal.fire({
            icon: "success",
            title: "Paquete editado correctamente",
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.getDocumentos()
          });
        }
        else{
          Swal.fire({
            icon: "error",
            title: "Hubo un error al editar el documento",
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.getDocumentos()
          });
        }
      },
      error: (error) => {
        console.error('Error al editar al documento:', error);
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
