import { Component, OnInit } from '@angular/core';

import { FileUploader, FileLikeObject } from 'ng2-file-upload';
const uploadAPI = 'http://localhost:8100/api/upload'; 

@Component({
  selector: 'app-multi-file-upload',
  templateUrl: './multi-file-upload.component.html',
  styleUrls: ['./multi-file-upload.component.scss'],
})
export class MultiFileUploadComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({ url: uploadAPI, itemAlias: 'file' });
  public hasBaseDropZoneOver: boolean = false;

  constructor() { }

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
         console.log('FileUpload:uploaded successfully:', item, status, response);
         alert('Your file has been uploaded successfully');
    };
  }
  getFiles(): FileLikeObject[] {
    debugger
    return this.uploader.queue.map((fileItem) => {
      return fileItem.file;
    });
  }

  fileOverBase(ev): void {
    console.log('I am here ')
    this.hasBaseDropZoneOver = ev;
  }

  reorderFiles(reorderEvent: CustomEvent): void {
    console.log('I am here2 ')
    let element = this.uploader.queue.splice(reorderEvent.detail.from, 1)[0];
    this.uploader.queue.splice(reorderEvent.detail.to, 0, element);
  }

}
