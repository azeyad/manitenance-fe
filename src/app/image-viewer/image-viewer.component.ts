import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { EMPTY, finalize, switchMap, tap } from 'rxjs';
import { WorkOrderFileDataModel } from '../models/work-order-file-data-model';
import { WorkOrdersDataService } from '../services/work-orders-data.service';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss']
})
export class ImageViewerComponent implements OnInit {

  private imageHeightOffset = 125;
  imagesList: WorkOrderFileDataModel[] = [];
  activeImageURL: any = "";
  activeImageTitle: String;
  imageLoadFailed = false;
  isLoading = true;
  activeImageIdx = 0;

  _orderUuid: String;
  @Input() set orderUuid(value: String) {
    this._orderUuid = value;
    this.fetchOrderImagesMetadata();
  }
  get orderUuid(): String {
    return this._orderUuid;
  }

  private _imageHeight = 0;
  @Input() set imageHeight(value: number) {
    this._imageHeight = value - this.imageHeightOffset;
  }
  get imageHeight(): number {
    return this._imageHeight;
  }

  constructor(private snackBar: MatSnackBar, private orderDataService: WorkOrdersDataService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

  private fetchOrderImagesMetadata() {
    this.imagesList = [];
    this.activeImageIdx = 0;
    this.resetLoadingParameters();
    this.orderDataService.getWorkOrderImagesMetadata(this.orderUuid).pipe(
      tap((images: WorkOrderFileDataModel[]) => this.imagesList = images),
      switchMap((images: WorkOrderFileDataModel[]) => this.imagesList.length > 0 ?
        this.orderDataService.getWorkOrderImageBytes(this.orderUuid, images[this.activeImageIdx].fileUuid) :
        EMPTY),
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (imageBuffer) => this.renderImage(imageBuffer),
      error: error => this.handleImageLoadingError(error)
    });
  }

  private resetLoadingParameters() {
    this.activeImageURL = "";
    this.isLoading = true;
    this.imageLoadFailed = false;
    this.activeImageTitle = "";
  }

  nextImage(): void {
    const oldIdx = this.activeImageIdx;
    this.activeImageIdx++;
    this.activeImageIdx %= this.imagesList.length;
    if (oldIdx != this.activeImageIdx) {
      this.loadActiveImage();
    }
  }

  prevImage(): void {
    const oldIdx = this.activeImageIdx;
    if (this.activeImageIdx == 0) {
      this.activeImageIdx = this.imagesList.length;
    }
    this.activeImageIdx--;
    if (oldIdx != this.activeImageIdx) {
      this.loadActiveImage();
    }
  }

  private loadActiveImage() {
    this.resetLoadingParameters();
    this.orderDataService.getWorkOrderImageBytes(this.orderUuid, this.imagesList[this.activeImageIdx].fileUuid).pipe(
      finalize(() => this.isLoading = false)
    )
      .subscribe({
        next: (imageBuffer) => this.renderImage(imageBuffer),
        error: error => this.handleImageLoadingError(error)
      });
  }

  private renderImage(imageBuffer: any) {
    this.imageLoadFailed = false;
    this.activeImageTitle = this.imagesList[this.activeImageIdx].fileName;
    const imageBlob = new Blob([imageBuffer], { type: 'image/jpg' });
    this.activeImageURL = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(imageBlob));
  }

  private handleImageLoadingError(error: any) {
    console.log(JSON.stringify(error));
    this.imageLoadFailed = true;
    this.snackBar.open("Failed to load work order images.", "Error!", {
      duration: 2000
    })
  }
}
