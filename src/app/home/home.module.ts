import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { MultiFileUploadComponent } from '../components/multi-file-upload/multi-file-upload.component';
import { FileUploadModule } from 'ng2-file-upload';
import {PhotoBase64Component} from '../component/photo-base64/photo-base64.component';



import { HomePageRoutingModule } from './home-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    FileUploadModule
  ],
  declarations: [HomePage,MultiFileUploadComponent,PhotoBase64Component]
})
export class HomePageModule {}
