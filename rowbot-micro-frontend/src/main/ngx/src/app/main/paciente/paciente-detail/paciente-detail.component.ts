import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, OTranslateService } from 'ontimize-web-ngx';
import { Observable } from 'rxjs';
import { PacienteHttpClient } from 'src/app/services/backendClient/paciente.service';
import { Sexo } from '../paciente-new/paciente-new.component';
import { Paciente } from '../../model/paciente';
import { ValidationService } from 'src/app/services/backendClient/validate.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-paciente-detail',
  templateUrl: './paciente-detail.component.html',
  styleUrls: ['./paciente-detail.component.scss']
})
export class PacienteDetailComponent implements OnInit {
  paciente: Paciente;

  pacienteUpdate: FormGroup;

  sexos: Sexo[] = [
    { value: 'MASCULINO', viewValue: 'Hombre' },
    { value: 'FEMENINO', viewValue: 'Mujer' },
    { value: 'INDEFINIDO', viewValue: 'Indefinido' },
  ];

  constructor(
    private pacienteServicio: PacienteHttpClient,
    private actRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private location: Location,
    public datepipe: DatePipe,
    private validationService: ValidationService,
    protected router: Router,
    private translate: OTranslateService,
    protected dialogService: DialogService
  ) {

    this.pacienteUpdate = this.formBuilder.group({
      id: '',
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      dni: ['', {
        validators: [Validators.required],
        asyncValidators: [this.validateDni()],
        updateOn: 'blur'
      }],
      fechaNacimiento: [null, Validators.required],
      sexo: '',
      notas: '',
      direccion: this.formBuilder.group({
        calle: ['', [Validators.required]],
        portal: '',
        piso: '',
        codigoPostal: '',
        ciudad: '',
      }),
      email: ['', Validators.email],
      telefono: '',

    });


  }

  ngOnInit() {
    const qParamObs: Observable<any> = this.actRoute.queryParams;

    qParamObs.subscribe(params => {
      this.pacienteServicio.getById(params.id).then((value) => {
        this.paciente = value;
        this.setFormValues(this.paciente);
      });
    });
  }


  setFormValues(value: Paciente) {
    var fecha = this.paciente.fechaNacimiento.split("/").map(x => parseInt(x));
    this.pacienteUpdate.setValue(this.paciente);
    this.pacienteUpdate.controls['fechaNacimiento'].setValue(new Date(fecha[2], fecha[1], fecha[0]));
  }

  validateDni(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> => {
      return this.validationService.isValidDni(control.value).then(res => {
          return res == false ? { mal: true } : null;
        }
      );
    };
  }

  delete(){
    this.dialogService.confirm(this.translate.get("BORRAR_TITLE"), this.translate.get("BORRAR_TEXT") +this.pacienteUpdate.value.nombre).then( value=> {
      if (value === true){
        this.pacienteServicio.delete(this.paciente.id);
        this.router.navigate(['main/paciente']);

      }
    });
  }

  goBack(){
    this.location.back()
  }

  save() {
    if (typeof this.pacienteUpdate.value.fechaNacimiento === 'object') {
      let dateTrans = this.datepipe.transform(this.pacienteUpdate.value.fechaNacimiento, 'dd/MM/yyyy').toString();
      this.pacienteUpdate.value.fechaNacimiento = dateTrans;
    }

    if (this.pacienteUpdate.valid) {
      this.pacienteServicio.get("/id?dni=" + this.pacienteUpdate.value.dni).then(idExist => {
        if (idExist == this.pacienteUpdate.value.id) {
          this.update()
        }else {
          this.dialogService.error(this.translate.get('DNI.ERROR.TITLE'), this.translate.get('DNI.EXIST.UPDATE.TEXT'));
        }
      }).catch(error => {
        if (error.status == 404) {
          this.update();
        }
      });

    }
  }

  private update() {
    const pacCreate = JSON.stringify(this.pacienteUpdate.value);
    this.pacienteServicio.update(pacCreate).then(value => {
      if (value) {
        this.router.navigate(['main/paciente']);
      }
    });

  }

}
