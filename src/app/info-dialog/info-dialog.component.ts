import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.scss']
})
export class InfoDialogComponent implements OnInit {

  message: String;

  constructor(@Inject(MAT_DIALOG_DATA) data: any) {
    this.message = data.message;
  }

  ngOnInit(): void {
  }

}
