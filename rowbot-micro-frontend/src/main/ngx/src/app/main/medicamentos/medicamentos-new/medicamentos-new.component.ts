import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, NgControl, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { DialogService, OTranslateService } from 'ontimize-web-ngx';
import { Observable } from 'rxjs';
import { MedicamentosService } from 'src/app/services/backendClient/medicamentos.service';
import { ValidationService } from 'src/app/services/backendClient/validate.service';
import { FormaFarmaceutica } from '../../model/formaFarmaceutica';
import { MaestrosService } from 'src/app/services/backendClient/maestros.service';

@Component({
  selector: 'app-medicamentos-new',
  templateUrl: './medicamentos-new.component.html',
  styleUrls: ['./medicamentos-new.component.scss']
})
export class MedicamentosNewComponent implements OnInit {

  public mask = [ /[0-9]/, /[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,  /[0-9]/,'.',/[0-9]/,]
  form: FormGroup ;
  comboFormaFarmaceutica: FormaFarmaceutica[] ;

  constructor(
    private dialogRef: MatDialogRef<MedicamentosNewComponent>,
    private formBuilder: FormBuilder,
    private medicamentoService: MedicamentosService,
    private validationService: ValidationService,
    protected dialogService: DialogService,
    private translate: OTranslateService,
    private maestro: MaestrosService
    ) {
      this.form = this.formBuilder.group({
        nombre: ['', Validators.required],
        descripcion:'',
        unidades: ['', Validators.required],
        precioVentaCentimos: '',
        idFormaFarmaceutica: '',
        emblistable: false,
        codigoNacional: ['', {
          validators: [Validators.required],
          asyncValidators: [this.validateCN()],
          updateOn: 'blur'
        }],
        codigoBarras: '',
      });
     }


  ngOnInit() {
    this.maestro.getFormaFarmaceutica().then( listFF =>{
      this.comboFormaFarmaceutica = listFF;
    })
  }

  validateCN(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> => {

      return this.validationService.isValidateCodigoNacional(this.cleanNumbers(control.value, false)).then(info => {
        return info == false ? { mal: true } : null;
      })
    };
  }

  goBack(){
    this.dialogService.confirm(this.translate.get("CLOSE.DIALOG"), this.translate.get("LOST.CHANGES")).then( value=> {
      if (value === true){
        this.dialogRef.close();
      }
    });
  }



  save(){
    if( this.form.valid){
      this.medicamentoService.getIdForCN(this.cleanNumbers(this.form.value.codigoNacional, false)).catch( error => {
        if(error.status== 404){
          this.form.value.codigoNacional = this.cleanNumbers(this.form.value.codigoNacional, false);
          this.form.value.precioVentaCentimos = this.cleanNumbers(this.form.value.precioVentaCentimos, true);
          const medicamento =JSON.stringify( this.form.value);
          this.medicamentoService.create(medicamento).then(value => {
            if(value){
              this.dialogService.info(this.translate.get('CREATE.OK.TITLE'), this.translate.get('CREATE.OK'));
              this.dialogRef.close("creado");
            }
          });
        }
      }).then(infoId => {
        if(infoId){
          this.dialogService.error(this.translate.get('CN.ERROR.TITLE'), this.translate.get('CN.EXIST.TEXT'));
        }
      });
    }
  }

  cleanNumbers(number,  isPrice: boolean){
    number = number.split(",").join( "")
    return number.split(".").join( "");
  }

  onInputChange($event) {
    var value = $event.target.value;
    if (!value) return;

    var plainNumber: number;
    var formattedValue: string;

    var decimalSeparatorIndex = value.lastIndexOf(".");
    if (decimalSeparatorIndex > 0) {
      var wholeNumberPart = value.substring(0, decimalSeparatorIndex);
      var decimalPart = value.substr(decimalSeparatorIndex + 1);
      plainNumber = parseFloat(
        wholeNumberPart.replace(/[^\d]/g, "") + "." + decimalPart
      );
    } else {
      plainNumber = parseFloat(value.replace(/[^\d]/g, ""));
    }

    if (!plainNumber) {
      formattedValue = "";
    } else {
      formattedValue = plainNumber.toFixed(2)
    }
    this.form.controls['precioVentaCentimos'].setValue(formattedValue);

  }


}
