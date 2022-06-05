import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap, tap, timer } from 'rxjs';
import { WorkOrderAttachmentModel } from '../models/work-order-attachment.model';
import { WorkOrdersDataService } from '../services/work-orders-data.service';

@Component({
  selector: 'app-files-upload',
  templateUrl: './files-upload.component.html',
  styleUrls: ['./files-upload.component.scss']
})
export class FilesUploadComponent implements OnInit {

  acceptedMIMETypes = "application/pdf, application/jpeg, application/png";
  workOrderUuid: String;
  selectedFiles: WorkOrderAttachmentModel[] = [];

  @ViewChild("fileSelector", { static: false }) fileSelectorInput!: ElementRef<HTMLInputElement>;

  fileSelectionForm: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) data: any, private snackBar: MatSnackBar, private ordersDataService: WorkOrdersDataService) {
    this.workOrderUuid = data.orderUuid;
    this.fileSelectionForm = new FormGroup({
      file_selection: new FormControl()
    });
  }

  ngOnInit(): void {
    this.trackFileSelection();
  }

  openFileSelector() {
    const fileSelectionElement = this.fileSelectorInput.nativeElement;
    fileSelectionElement.click();
  }

  trackFileSelection() {
    this.fileSelectionForm.get('file_selection')?.valueChanges
      .subscribe({
        next: () => {
          const fileSelectionInput: HTMLInputElement = this.fileSelectorInput.nativeElement;
          this.selectFiles(fileSelectionInput.files);
          this.fileSelectorInput.nativeElement.value = '';
        }
      });
  }

  selectFiles(filesList: any) {
    const filesArray = [...filesList];
    const validFiles: WorkOrderAttachmentModel[] = filesArray
      .filter((file: any) => this.acceptedMIMETypes.indexOf(file.type) >= 0)
      .map((file: any) => {
        const attachmentModel: WorkOrderAttachmentModel = {
          file: file,
          isUploadInProgress: false,
          uploadResult: ""
        };
        return attachmentModel;
      });
    this.selectedFiles = [...this.selectedFiles, ...validFiles];
    if (filesArray.some((file: any) => this.acceptedMIMETypes.indexOf(file.type) < 0)) {
      this.snackBar.open(`Only files of the following MIME types are allowed: ${this.acceptedMIMETypes}`, "Error!", {
        duration: 2000
      });
    }
  }

  uploadFile(index: number) {
    const formData = new FormData();
    formData.append('files', this.selectedFiles[index].file);
    this.selectedFiles[index].isUploadInProgress = true;
    this.selectedFiles[index].uploadResult = "";
    this.ordersDataService.uploadFiles(this.workOrderUuid, formData).pipe(
      tap(() => {
        this.selectedFiles[index].isUploadInProgress = false;
        this.selectedFiles[index].uploadResult = "success";
      }),
      switchMap(() => timer(2000))
    ).subscribe({
      next: () => this.selectedFiles.splice(index, 1),
      error: () => {
        this.selectedFiles[index].isUploadInProgress = false;
        this.selectedFiles[index].uploadResult = "Upload failed.";
      }
    });
  }

  uploadAll() {
    const formData = new FormData();
    this.selectedFiles.forEach(p => {
      formData.append('files', p.file);
      p.isUploadInProgress = true;
      p.uploadResult = "";
    });
    this.ordersDataService.uploadFiles(this.workOrderUuid, formData).pipe(
      tap(() => {
        this.selectedFiles.forEach(p => {
          p.isUploadInProgress = false;
          p.uploadResult = "success";
        });
      }),
      switchMap(() => timer(2000))
    ).subscribe({
      next: () => {
        this.selectedFiles = [];
      }, error: () => {
        this.selectedFiles.forEach(p => {
          p.isUploadInProgress = false;
          p.uploadResult = "Upload failed.";
        });
      }
    });
  }

  isAnyFileNotUploaded(): boolean {
    return this.selectedFiles.some(file => !file.isUploadInProgress && file.uploadResult != 'success')
  }

  openNotesFiles() {

  }

  isUploadInProgress(): boolean {
    return this.selectedFiles.some(p => p.isUploadInProgress);
  }

  cancelFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  ngOnDestroy(): void {

  }
}
