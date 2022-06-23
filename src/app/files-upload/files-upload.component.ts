import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, fromEvent, map } from 'rxjs';
import { WorkOrderAttachmentModel } from '../models/work-order-attachment.model';
import { WorkOrdersDataService } from '../services/work-orders-data.service';

@Component({
  selector: 'app-files-upload',
  templateUrl: './files-upload.component.html',
  styleUrls: ['./files-upload.component.scss']
})
export class FilesUploadComponent implements OnInit, AfterViewInit {

  workOrderUuid: String;
  selectedFiles: WorkOrderAttachmentModel[] = [];

  @ViewChild("fileSelector", { static: false }) fileSelectorInput!: ElementRef<HTMLInputElement>;


  constructor(@Inject(MAT_DIALOG_DATA) data: any, private snackBar: MatSnackBar, private ordersDataService: WorkOrdersDataService, private dialogRef: MatDialogRef<FilesUploadComponent>) {
    this.workOrderUuid = data.orderUuid;
  }

  ngAfterViewInit(): void {
    fromEvent(this.fileSelectorInput.nativeElement, 'input').pipe(
      filter(() => this.fileSelectorInput.nativeElement.files != null && this.fileSelectorInput.nativeElement.files.length > 0),
      map(() => this.FilesListToWorkOrderAttachmentModels())
    ).subscribe({
      next: (selectedFiles: WorkOrderAttachmentModel[]) => {
        this.selectedFiles = [...this.selectedFiles, ...selectedFiles];
        this.fileSelectorInput.nativeElement.value = '';
      }
    });
  }

  ngOnInit(): void {
  }

  openFileSelector() {
    this.fileSelectorInput.nativeElement.click();
  }

  FilesListToWorkOrderAttachmentModels(): WorkOrderAttachmentModel[] {
    const filesList: any = this.fileSelectorInput.nativeElement.files;
    const filesArray = [...filesList];
    const selectedFiles: WorkOrderAttachmentModel[] = filesArray
      .map((file: any) => {
        const attachmentModel: WorkOrderAttachmentModel = {
          file: file,
          isUploadInProgress: false,
          uploadResult: ""
        };
        return attachmentModel;
      });
    return selectedFiles;
  }

  private showSuccessUploadSnackBar() {
    this.snackBar.open("Files uploaded successfully.", "Success!", {
      duration: 2000
    });
  }

  uploadAll() {
    this.ordersDataService.uploadFiles(this.workOrderUuid, this.selectedFiles)
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
