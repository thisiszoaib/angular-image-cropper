import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ImageControlComponent } from './components/image-control/image-control.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, ImageControlComponent],
  template: `
    <mat-toolbar color="primary"> Angular Image Cropper </mat-toolbar>

    <div class="container">
      <app-image-control
        [width]="200"
        [height]="250"
        (imageReady)="imageReady($event)"
      />
    </div>
  `,
  styles: [
    `
      .container {
        padding: 24px;
      }
    `,
  ],
})
export class AppComponent {
  imageReady(blob: Blob) {
    console.log('The image control gave back this blob', blob);
  }
}
