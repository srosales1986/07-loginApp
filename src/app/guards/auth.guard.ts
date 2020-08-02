import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor ( private auth: AuthService, private router: Router ) {

  }
  canActivate(): boolean {

    if (!this.auth.isAuth()) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Debe iniciar sesión',
        showConfirmButton: false,
        timer: 1500,
        allowOutsideClick: false
      })
      this.router.navigateByUrl('/login');
      return this.auth.isAuth();
    }
    return this.auth.isAuth();
  }
  
}
