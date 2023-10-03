import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MedicamentosNewComponent } from '../medicamentos-new/medicamentos-new.component';

@Component({
  selector: 'app-medicamentos-home',
  templateUrl: './medicamentos-home.component.html',
  styleUrls: ['./medicamentos-home.component.scss']
})
export class MedicamentosHomeComponent implements OnInit {

  constructor(
    private dialog: MatDialog
    ) { }
  ngOnInit() {
  }

  createNew(){
    const dialogRef = this.dialog.open(MedicamentosNewComponent, {
      height: '90%',
      width: '80%',
    });
  }
}
