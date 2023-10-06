import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getStorage, provideStorage } from '@angular/fire/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCQFqfgcwI6ynvVpXfLOAOYEHstCegL9CQ',
  authDomain: 'image-cropper-control.firebaseapp.com',
  projectId: 'image-cropper-control',
  storageBucket: 'image-cropper-control.appspot.com',
  messagingSenderId: '398885936902',
  appId: '1:398885936902:web:f09e8854362657790e4887',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    importProvidersFrom([
      provideFirebaseApp(() => initializeApp(firebaseConfig)),
      provideStorage(() => getStorage()),
    ]),
  ],
};
