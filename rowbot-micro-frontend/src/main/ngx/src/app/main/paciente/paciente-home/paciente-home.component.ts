import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, PageEvent } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'ontimize-web-ngx';
import { PacienteHttpClient } from 'src/app/services/backendClient/paciente.service';
import { PacienteNewComponent } from '../paciente-new/paciente-new.component';
import { Paciente } from '../../model/paciente';

@Component({
  selector: 'app-paciente-home',
  templateUrl: './paciente-home.component.html',
  styleUrls: ['./paciente-home.component.scss'],
})
export class PacienteHomeComponent implements OnInit {

  displayedColumns: string[] = ['select','nombre', 'apellidos', 'dni','email', 'telefono'];
  dataSource: Paciente[];

  //paginator info
  length = 50;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  pageEvent: PageEvent;
 /** */

  constructor(private pacienteServicio: PacienteHttpClient,
    protected router: Router,
    protected dialogService: DialogService,
    private route: ActivatedRoute,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.pacienteServicio.getFilter(this.pageIndex, this.pageSize).then( value => {
      this.length= value.totalElements;
      this.dataSource= value.content;
      this.length= value.totalElements;
    });

  }

  createNew(){
    const dialogRef = this.dialog.open(PacienteNewComponent, {
      height: '90%',
      width: '80%',
    });
    dialogRef.afterClosed().subscribe(isOk => {
      if(isOk){
        this.ngOnInit();
      }
    })
  }

  clickedRows(row){
    this.router.navigate(['main/paciente/update'] , {queryParams:{'id': row.id}});

  }

  selection = new SelectionModel<Paciente>(true, []);
  checkboxLabel(row?: Paciente): string {
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  delete(){
    var idArray =  this.selection.selected.map(x =>  x.id);
    var texmen: string = this.selection.selected.map(x => x.nombre).join( ", ");

    this.dialogService.confirm('Borrar', 'Se borraran los usuarios '+ texmen).then( value=> {
      if (value === true){
        this.pacienteServicio.deleteMultiple(idArray);
        this.ngOnInit();
        this.selection.clear();
      }
    });
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;

    this.pacienteServicio.getFilter(this.pageIndex, this.pageSize).then( value => {
      this.dataSource= value.content;

    });

  }
  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }
}
