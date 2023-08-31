import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCroppedEvent, ImageCropperModule } from 'ngx-image-cropper';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export type CropperDialogData = {
  image: File;
  width: number;
  height: number;
};

export type CropperDialogResult = {
  blob: Blob;
  imageUrl: string;
};

@Component({
  selector: 'app-cropper-dialog',
  standalone: true,
  imports: [CommonModule, ImageCropperModule, MatButtonModule, MatDialogModule],
  template: `
    <h1 mat-dialog-title>Please crop your image</h1>
    <div mat-dialog-content>
      <image-cropper
        [maintainAspectRatio]="true"
        [aspectRatio]="data.width / data.height"
        [resizeToHeight]="data.height"
        [resizeToWidth]="data.width"
        [onlyScaleDown]="true"
        [imageFile]="data.image"
        (imageCropped)="imageCropped($event)"
      ></image-cropper>
    </div>

    <div mat-dialog-actions>
      <button mat-button [mat-dialog-close]="false">Cancel</button>
      <button mat-button [mat-dialog-close]="result()" cdkFocusInitial>
        Done
      </button>
    </div>
  `,
  styles: [],
})
export class CropperDialogComponent {
  data: CropperDialogData = inject(MAT_DIALOG_DATA);

  result = signal<CropperDialogResult | undefined>(undefined);

  imageCropped(event: ImageCroppedEvent) {
    const { blob, objectUrl } = event;
    if (blob && objectUrl) {
      this.result.set({ blob, imageUrl: objectUrl });
    }
  }
}
