import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: UserModel;
  rememberUser = false;

  constructor( private auth: AuthService, private router: Router ) { }

  ngOnInit() {
    this.user = new UserModel();
    if (localStorage.getItem('email')) {
      this.user.email = localStorage.getItem('email');
      this.rememberUser = true;
    }
  }

  login( form: NgForm) {
    
    if(form.invalid) return;

    Swal.fire({
      position: 'center',
      title: 'Iniciando Sesión...',
      showConfirmButton: false,
      allowOutsideClick: false
    })
    Swal.showLoading();

    this.auth.login( this.user ).subscribe( resp => {
      
      console.log(resp);
      Swal.close();

      if (this.rememberUser) {
        localStorage.setItem('email', this.user.email);
      }

      this.router.navigateByUrl('/home');
      
    }, (err) => {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: err.error.error.message,
        showConfirmButton: true
      })
      
    })
    
  }
}
