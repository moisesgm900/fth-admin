import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../shared/services/provider.service';
import { Router } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  constructor(private fb: FormBuilder, public provid: ApiService, private router: Router, private snackBar: MatSnackBar) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
isLoading = false;
loginSuccess = false; 
  signin() {
  if (this.loginForm.invalid) {
    return;
  }

  this.isLoading = true;
  this.loginSuccess = false;

  const email = this.loginForm.value.email;
  const password = this.loginForm.value.password;

  this.provid.login(email, password).subscribe({
    next: (response: any) => {
      this.isLoading = false;

      if (response.success) {
        this.snackBar.open('¡Bienvenido!', 'Cerrar', {
          panelClass: ['success-snackbar'],
          duration: 3000,
        });
        this.router.navigate(['/private']);
        this.provid.guardarToken(response.token);

        this.loginSuccess = true;

        // Después de 2 segundos, reinicia el estado
        setTimeout(() => {
          this.loginSuccess = false;
        }, 2000);

      } else {
        this.snackBar.open('¡Correo o contraseña inválidos!', 'Cerrar', {
          panelClass: ['error-snackbar'],
          duration: 3000,
        });
      }
    },
    error: (err: any) => {
      this.isLoading = false;
      console.error(err);
      this.snackBar.open('¡Correo o contraseña inválidos!', 'Cerrar', {
        panelClass: ['error-snackbar'],
        duration: 3000,
      });
    }
  });
}

}
