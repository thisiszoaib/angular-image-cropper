import {
  Component,
  EventEmitter,
  Input,
  NgZone,
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
import {
  Storage,
  getDownloadURL,
  ref,
  uploadBytes,
} from '@angular/fire/storage';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-image-control',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="control-container" [style.width]="imageWidth() + 'px'">
      <div class="image-container">
        <img
          [src]="imageSource()"
          [width]="imageWidth()"
          [height]="imageHeight()"
          class="mat-elevation-z5"
          [style.opacity]="uploading() ? 0.5 : 1"
        />
        <mat-progress-spinner
          [diameter]="50"
          mode="indeterminate"
          *ngIf="uploading()"
        />
      </div>

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
      .control-container {
        display: flex;
        flex-direction: column;
        gap: 16px;
        position: relative;
      }

      .image-container {
        border-radius: 5px;
        position: relative;

        > mat-progress-spinner {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        > img {
          border-radius: inherit;
        }
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

  imagePath = signal('');
  @Input({ required: true }) set path(val: string) {
    this.imagePath.set(val);
  }

  placeholder = computed(
    () => `https://placehold.co/${this.imageWidth()}X${this.imageHeight()}`
  );

  croppedImageURL = signal<string | undefined>(undefined);

  imageSource = computed(() => {
    return this.croppedImageURL() ?? this.placeholder();
  });

  uploading = signal(false);

  dialog = inject(MatDialog);

  fileSelected(event: any) {
    const file = event.target?.files[0];
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
          this.uploadImage(result.blob);
        });
    }
  }

  @Output() imageReady = new EventEmitter<string>();

  constructor() {
    effect(() => {
      if (this.croppedImageURL()) {
        this.imageReady.emit(this.croppedImageURL());
      }
    });
  }

  storage = inject(Storage);
  zone = inject(NgZone);

  async uploadImage(blob: Blob) {
    this.uploading.set(true);
    const storageRef = ref(this.storage, this.imagePath());
    const uploadTask = await uploadBytes(storageRef, blob);
    const downloadUrl = await getDownloadURL(uploadTask.ref);
    this.croppedImageURL.set(downloadUrl);
    this.uploading.set(false);
  }
}
