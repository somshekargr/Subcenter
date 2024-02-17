import { FormGroup, ValidatorFn } from '@angular/forms';

// custom validator to check that two fields match
export function mustMatch(controlName: string, matchingControlName: string): ValidatorFn {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      return null;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      return { mustMatch: true };
    }

    return null;
  }
}
