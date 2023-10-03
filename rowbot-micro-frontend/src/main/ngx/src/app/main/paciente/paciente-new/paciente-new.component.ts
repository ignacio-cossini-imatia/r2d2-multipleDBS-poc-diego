import { Component, OnInit } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { PacienteHttpClient } from 'src/app/services/backendClient/paciente.service';
import { MatDialogRef } from '@angular/material';
import { Observable, of } from 'rxjs';
import { Paciente } from '../../model/paciente';
import { ValidationService } from 'src/app/services/backendClient/validate.service';
import { map } from 'rxjs/operators';
import { DialogService, OTranslateService } from 'ontimize-web-ngx';

@Component({
  selector: 'app-paciente-new',
  templateUrl: './paciente-new.component.html',
  styleUrls: ['./paciente-new.component.scss']
})
export class PacienteNewComponent implements OnInit {


  pacienteCreate: FormGroup ;
  pacienteNuevo: Paciente;
  emailFormControl = new FormControl('', [Validators.required]);

  maxDate: Date;

  /** se carga del back si hace falta  */
  sexos: Sexo[] = [
    { value: 'MASCULINO', viewValue: 'Hombre' },
    { value: 'FEMENINO', viewValue: 'Mujer' },
    { value: 'INDEFINIDO', viewValue: 'Indefinido' },
  ];

  constructor(
    private pacienteServicio: PacienteHttpClient,
    private validationService: ValidationService,
    public datepipe: DatePipe,
    private formBuilder: FormBuilder,
    protected dialogService: DialogService,
    private translate: OTranslateService,
  private dialogRef: MatDialogRef<PacienteNewComponent>
    ) {
      this.maxDate = new Date();
      this.pacienteCreate = this.formBuilder.group({
        nombre: ['', Validators.required],
        apellidos: ['', Validators.required],
        dni: ['', {validators: [Validators.required],
          asyncValidators: [this.validateDni()],
          updateOn: 'blur'}],

        fechaNacimiento: ['', Validators.required],
        sexo: 'INDEFINIDO',
        notas: '',
        direccion: this.formBuilder.group({
          calle: ['', [Validators.required]],
          portal: '',
          piso: '',
          codigoPostal: '',
          ciudad: '',
        }),
        email: [null,  Validators.email],
        telefono: '',

      });

    }

  ngOnInit() {
  }

  validateDni(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> => {
      return this.validationService.isValidDni(control.value).then(res => {
          return res == false ? { mal: true } : null;
        }
      );
    };
  }

  goBack(){
    this.dialogRef.close();
  }


  save(){
    this.pacienteCreate.value.email == '' ? this.pacienteCreate.controls['email'].setValue(null) : "" ;
    if( this.pacienteCreate.valid){
    this.pacienteServicio.get("/id?dni="+ this.pacienteCreate.value.dni).catch( error => {
      if(error.status== 404){
        let dateTrans = this.datepipe.transform(this.pacienteCreate.value.fechaNacimiento, 'dd/MM/yyyy').toString();
        this.pacienteCreate.value.fechaNacimiento = dateTrans;
        const pacCreate =JSON.stringify( this.pacienteCreate.value);
        this.pacienteServicio.create(pacCreate).then(value => {
          if(value){
            this.dialogRef.close("creado");
          }
        });
      }
    }).then(infoId => {
      if(infoId){
        this.dialogService.error(this.translate.get('DNI.ERROR.TITLE'), this.translate.get('DNI.EXIST.TEXT'));
      }
    });
  }else{
    this.dialogService.error(this.translate.get('VALIDATE.ERROR.TITLE'), this.translate.get('VALIDATE.EXIST.TEXT'));
  }


  }



}

export interface Sexo {
  value: string;
  viewValue: string;
}
