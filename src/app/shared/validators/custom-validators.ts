import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  
  /**
   * 1. Valida que el correo pertenezca al dominio institucional de la UPC
   */
  static upcEmail(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const email = control.value.toLowerCase().trim();
      const isValid = email.endsWith('@upc.edu.pe');
      
      return isValid ? null : { notUpcEmail: true };
    };
  }

  /**
   * 2. Valida que las contraseñas coincidan en el formulario de registro
   */
  static matchPasswords(controlName: string, matchingControlName: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const control = formGroup.get(controlName);
      const matchingControl = formGroup.get(matchingControlName);

      if (!control || !matchingControl) return null;

      // Si otro validador ya encontró un error en el matchingControl, no hacemos nada
      if (matchingControl.errors && !matchingControl.errors['passwordMismatch']) {
        return null;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        matchingControl.setErrors(null);
        return null;
      }
    };
  }

  /**
   * 3. Evita que el usuario ingrese solo espacios en blanco 
   * (Útil al crear Nombres de Colecciones, Grupos o Temas)
   */
  static notOnlyWhitespace(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value != null && control.value.trim().length === 0) {
        return { whitespace: true };
      }
      return null;
    };
  }
}