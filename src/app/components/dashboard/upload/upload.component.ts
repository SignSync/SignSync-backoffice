import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent {

  constructor (private router:Router){}

  navigateToUrl(tabla:string):void {
    this.router.navigate([`dashboard/graficas/${tabla}`]);
  }

}
