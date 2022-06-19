import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WorkOrderAttachmentModel } from '../models/work-order-attachment.model';
import { WorkOrdersDataService } from '../services/work-orders-data.service';

@Component({
  selector: 'app-files-upload',
  templateUrl: './files-upload.component.html',
  styleUrls: ['./files-upload.component.scss']
})
export class FilesUploadComponent implements OnInit {

  workOrderUuid: String;
  selectedFiles: WorkOrderAttachmentModel[] = [];

  @ViewChild("fileSelector", { static: false }) fileSelectorInput!: ElementRef<HTMLInputElement>;

  fileSelectionForm: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) data: any, private snackBar: MatSnackBar, private ordersDataService: WorkOrdersDataService, private dialogRef: MatDialogRef<FilesUploadComponent>) {
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
      .map((file: any) => {
        const attachmentModel: WorkOrderAttachmentModel = {
          file: file,
          isUploadInProgress: false,
          uploadResult: ""
        };
        return attachmentModel;
      });
    this.selectedFiles = [...this.selectedFiles, ...validFiles];
  }

  uploadFile(index: number) {
    if (this.selectedFiles[index].uploadResult === "success") return;
    const formData = new FormData();
    formData.append('files', this.selectedFiles[index].file);
    this.selectedFiles[index].isUploadInProgress = true;
    this.selectedFiles[index].uploadResult = "";
    this.ordersDataService.uploadFiles(this.workOrderUuid, formData)
      .subscribe({
        next: () => {
          this.selectedFiles[index].isUploadInProgress = false;
          this.selectedFiles[index].uploadResult = "success";
          this.showSuccessUploadSnackBar();
        },
        error: () => {
          this.selectedFiles[index].isUploadInProgress = false;
          this.selectedFiles[index].uploadResult = "Upload failed.";
        }
      });
  }

  private showSuccessUploadSnackBar() {
    this.snackBar.open("Files uploaded successfully.", "Success!", {
      duration: 2000
    });
  }

  uploadAll() {
    const formData = new FormData();
    this.selectedFiles
      .filter(p => p.uploadResult !== "success")
      .forEach(p => {
        formData.append('files', p.file);
        p.isUploadInProgress = true;
        p.uploadResult = "";
      });
    this.ordersDataService.uploadFiles(this.workOrderUuid, formData)
      .subscribe({
        next: () => {
          this.selectedFiles.forEach(p => {
            p.isUploadInProgress = false;
            p.uploadResult = "success";
          });
          this.showSuccessUploadSnackBar();
          this.dialogRef.close();
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

  isUploadInProgress(): boolean {
    return this.selectedFiles.some(p => p.isUploadInProgress);
  }

  cancelFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  ngOnDestroy(): void {

  }
}
