import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, fromEvent, switchMap } from 'rxjs';
import { DataImportService } from '../services/data-import.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @ViewChild("fileSelector", { static: false }) fileSelectorInput!: ElementRef<HTMLInputElement>;

  is_page_scrolled: boolean = false;

  constructor(private importService: DataImportService, private snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    fromEvent(this.fileSelectorInput.nativeElement, 'input').pipe(
      filter(() => this.fileSelectorInput.nativeElement.files != null && this.fileSelectorInput.nativeElement.files.length > 0),
      switchMap(() => {
        const file = this.fileSelectorInput.nativeElement.files?.item(0);
        this.fileSelectorInput.nativeElement.value = '';
        return this.importService.importFile(file as File);
      })
    ).subscribe({
      next: () => this.snackBar.open('File imported successfully', 'Info.', { duration: 3000 }),
      error: (error) => this.snackBar.open('Failed to import selected file!', 'Error.', { duration: 3000 })
    });
  }

  @HostListener('window:scroll', ['$event.currentTarget.pageYOffset'])
  handleStickyNavigation(sroll_distance: Number) {
    this.is_page_scrolled = sroll_distance >= 100;
  }

  openFileSelector() {
    const fileSelectionElement = this.fileSelectorInput.nativeElement;
    fileSelectionElement.click();
  }

}
