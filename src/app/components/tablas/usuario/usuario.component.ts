import { Component, OnInit } from '@angular/core';
import { UsuarioService } from './usuario.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers:[UsuarioService],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent implements OnInit {

  constructor(private serv:UsuarioService, private fb: FormBuilder){}

  formuser!:FormGroup;
  id_user!:string | null;
  usuarios:any;
  usuario:any;

  usuario_data:any;

  initFormUser():FormGroup{
    return this.fb.group({
      usuario:[''],
      correo:[''],
      contrasena:[''],
      sexo:[''],
      fecha_nacimiento:[''],
    })
  }

  ngOnInit(): void {
    this.formuser = this.initFormUser();
    this.getUsuarios();

  }

  getUsuarios():void{
    this.serv.getData('perfil/listar').subscribe({
      next: (data: any) => {
        console.log('Datos recibidos:', data);
        this.usuarios = data;
      },
      error: (error) => {
        console.error('Error al obtener las tablas:', error);
      },
      complete: () => {
        console.log('Solicitud completada');
      }
    });
  }

  deleteUser(id_user:string):void{
    const data = { id_user }
    Swal.fire({
      title: "Estas seguro de eliminar este usuario?",
      text: "Esta acción no será reversible!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminalo!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.serv.deleteData('perfil/deleteuser ', data).subscribe({
          next: (data: any) => {
            console.log('Datos recibidos:', data);
            if(data.status){
              Swal.fire({
                icon: "success",
                title: "Usuario eliminado correctamente",
                showConfirmButton: false,
                timer: 1500
              }).then(() => {
                this.getUsuarios()
              });
            }
            else{
              Swal.fire({
                icon: "error",
                title: "Hubo un error al eliminar al usuario",
                showConfirmButton: false,
                timer: 1500
              });
            }
          },
          error: (error) => {
            console.error('Error al obtener las tablas:', error);
          },
          complete: () => {
            console.log('Solicitud completada');
          }
        });
      }
    });
  }




  showModal(id_user:string):void{
    if(id_user !== ''){
      this.editUser(id_user);
      return;
    }
    this.reset();
    //
  }

  reset():void{
    console.log('reset')
    this.formuser.reset();
    this.id_user = null;
  }

  createUser(newdata:any):void{
    console.log(newdata)
    this.serv.postData('perfil/createUser', newdata).subscribe({
      next: (data: any) => {
        console.log('Datos recibidos:', data);
        if(data.status){
          Swal.fire({
            icon: "success",
            title: "Usuario creado correctamente",
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.getUsuarios()
          });
        }
        else{
          Swal.fire({
            icon: "error",
            title: "Hubo un error al crear el usuario",
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.getUsuarios()
          });
        }
      },
      error: (error) => {
        console.error('Error al editar al usuario:', error);
      },
      complete: () => {
        console.log('Solicitud completada');
      }
    });
  }


  editUser(id_user:string):void{
    console.log('id_user: ' + id_user)
    this.id_user = id_user;
    const params = { id_user };
    this.serv.getDataParam('perfil/getuser', params).subscribe({
      next: (data: any) => {
          console.log('Datos recibidos:', data);
          this.usuario = data;

          if (data.status && data.usuario.length > 0) {
            const user = data.usuario[0];
            this.formuser.patchValue({
              usuario: user.usuario,
              correo: user.correo,
              fecha_nacimiento: this.formatDate(user.fecha_nacimiento),
              sexo: user.sexo
            });
          }
      },
      error: (error) => {
          console.error('Error al obtener las tablas:', error);
      },
      complete: () => {
          console.log('Solicitud completada');
      }
    });

  }

  edit_submit():void{
    const newdata = this.formuser.value;
    console.log(newdata)

    console.log(this.id_user);
    if(!this.id_user){
      console.log('HA CREAR')
      this.createUser(newdata);
      return;
    }

    newdata.idUsuario = this.id_user;
    this.serv.updateData('perfil/editar', newdata).subscribe({
      next: (data: any) => {
        console.log('Datos recibidos:', data);
        if(data.status){
          Swal.fire({
            icon: "success",
            title: "Usuario editado correctamente",
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.getUsuarios()
          });
        }
        else{
          Swal.fire({
            icon: "error",
            title: "Hubo un error al editar el usuario",
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.getUsuarios()
          });
        }
      },
      error: (error) => {
        console.error('Error al editar al usuario:', error);
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


  verData(id_user:string):void{
    console.log(id_user)
    const params = { id_user };
    this.serv.getDataParam('perfil/getuser', params).subscribe({
      next: (data: any) => {
          console.log('Datos recibidos:', data);

          if (data?.status && data?.usuario?.length > 0) {

            const usuario = data.usuario[0];

            // Generar estatus del servicio y mantenimiento basados en el ID del usuario
            console.log(usuario.id_user)
            usuario.servicio_status = this.getRandomServicio(usuario.id_user);
            usuario.mantenimiento_status =
                usuario.servicio_status === 'Plataforma Pagada'
                    ? this.getRandomMantenimiento(usuario.correo)
                    : 'Sin servicio';

            this.usuario_data = usuario;
          } else {
              console.warn('No se encontraron datos del usuario o la respuesta no es válida.');
              this.usuario_data = {
                  usuario: '-',
                  correo: '-',
                  sexo: '-',
                  fecha_nacimiento: '-',
                  servicio_status: 'Sin servicio',
                  mantenimiento_status: 'Sin servicio',
              };
          }
        },
      error: (error) => {
          console.error('Error al obtener las tablas:', error);
      },
      complete: () => {
          console.log('Solicitud completada');
      }
    });
  }

  private generateHash(id: string): number {
    if (!id || id.length === 0) {
        return 0; // Manejar casos donde el ID está vacío
    }
    id = String(id);
    console.log(id.length)
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = (hash << 5) - hash + id.charCodeAt(i);
        hash = hash & hash;
        console.log(hash)
    }
    console.log(hash)
    return Math.abs(hash); // Asegurarse de que sea positivo
  }

  red:string = '';
  green:string = '';

  getRandomServicio(id: string): string {
    // console.log(id)
    const servicios = ['Plataforma Pagada', 'Plataforma prueba gratuita'];
    const hash = this.generateHash(id);
    const index = hash % servicios.length; // Seleccionar un índice basado en el hash
    // console.log(hash)
    // console.log(index)
    return servicios[index];
  }

  getRandomMantenimiento(id: string): string {
    const mantenimientos = ['Mantenimiento Activo', 'Sin servicio'];
    const hash = this.generateHash(id);
    const index = hash % mantenimientos.length; // Seleccionar un índice basado en el hash
    return mantenimientos[index];
  }

}
