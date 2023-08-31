import {
  Component,
  EventEmitter,
  Input,
  Output,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {
  CropperDialogComponent,
  CropperDialogResult,
} from '../cropper-dialog/cropper-dialog.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-image-control',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <div [style.width]="imageWidth() + 'px'">
      <img
        [src]="imageSource()"
        [width]="imageWidth()"
        [height]="imageHeight()"
        class="mat-elevation-z5"
      />
      <input
        #inputField
        hidden
        type="file"
        (change)="fileSelected($event)"
        (click)="inputField.value = ''"
      />
      <button mat-raised-button (click)="inputField.click()">
        Select Photo
      </button>
    </div>
  `,
  styles: [
    `
      div {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      img {
        border-radius: 5px;
      }
    `,
  ],
})
export class ImageControlComponent {
  imageWidth = signal(0);
  @Input({ required: true }) set width(val: number) {
    this.imageWidth.set(val);
  }

  imageHeight = signal(0);
  @Input({ required: true }) set height(val: number) {
    this.imageHeight.set(val);
  }

  placeholder = computed(
    () => `https://placehold.co/${this.imageWidth()}X${this.imageHeight()}`
  );

  croppedImage = signal<CropperDialogResult | undefined>(undefined);

  imageSource = computed(() => {
    if (this.croppedImage()) {
      return this.croppedImage()?.imageUrl;
    }

    return this.placeholder();
  });

  dialog = inject(MatDialog);

  fileSelected(event: any) {
    const file = event.target?.files[0];
    console.log(file);
    if (file) {
      const dialogRef = this.dialog.open(CropperDialogComponent, {
        data: {
          image: file,
          width: this.imageWidth(),
          height: this.imageHeight(),
        },
        width: '500px',
      });

      dialogRef
        .afterClosed()
        .pipe(filter((result) => !!result))
        .subscribe((result: CropperDialogResult) => {
          this.croppedImage.set(result);
        });
    }
  }

  @Output() imageReady = new EventEmitter<Blob>();

  constructor() {
    effect(() => {
      if (this.croppedImage()) {
        this.imageReady.emit(this.croppedImage()?.blob);
      }
    });
  }
}
