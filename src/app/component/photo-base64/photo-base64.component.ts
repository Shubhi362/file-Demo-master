import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import * as _ from 'lodash';
import { Plugins, FilesystemDirectory, FilesystemEncoding, Capacitor } from '@capacitor/core';
import {DomSanitizer} from '@angular/platform-browser';




const { Filesystem } = Plugins;
import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-photo-base64',
  templateUrl: './photo-base64.component.html',
  styleUrls: ['./photo-base64.component.scss'],
})
export class PhotoBase64Component implements OnInit {
  imageError: string;
    isImageSaved: boolean;
    cardImageBase64: string;
    singleImageBase64:string[]=[];
    fileName:string;
    filePath:string;
    clicked:boolean=false;

  constructor(
    private _DomSanitizationService: DomSanitizer,
    public storage: Storage, private file:File) { }

  ngOnInit() {}
  
  async fileChangeEvent(fileInput: any) {
    this.imageError = null;
    debugger;
    if (fileInput.target.files && fileInput.target.files[0]) {

        // Size Filter Bytes
        const fileName=fileInput.target.files[0].name;
        const max_size = 20971520;
        const allowed_types = ['image/png', 'image/jpeg'];
        const max_height = 15200;
        const max_width = 25600;

        if (fileInput.target.files[0].size > max_size) {
            this.imageError =
                'Maximum size allowed is ' + max_size / 1000 + 'Mb';

            return false;
        }

        if (!_.includes(allowed_types, fileInput.target.files[0].type)) {
            this.imageError = 'Only Images are allowed ( JPG | PNG )';
            return false;
        }
        const reader = new FileReader();
        reader.onload = (e: any) => {
          debugger;

            const image = new Image();
            image.src = e.target.result;
            image.onload = async rs => {
                const img_height = rs.currentTarget['height'];
                const img_width = rs.currentTarget['width'];

                console.log(img_height, img_width);


                if (img_height > max_height && img_width > max_width) {
                    this.imageError =
                        'Maximum dimentions allowed ' +
                        max_height +
                        '*' +
                        max_width +
                        'px';
                    return false;
                } else {
                    const imgBase64Path = e.target.result;
                    this.cardImageBase64 = imgBase64Path;
                    console.log(this.cardImageBase64)
                    this.isImageSaved = true;
                    // this.previewImagePath = imgBase64Path;
                }
                try {
                  const result = await Filesystem.writeFile({
                    path: 'secrets/'+fileName,
                    data:this.cardImageBase64,
                    directory: FilesystemDirectory.Documents,
                    recursive:true
                   
                  }).then(
                    () => {
                      Filesystem.getUri({
                        directory: FilesystemDirectory.Documents,
                        path:'secrets/'+fileName
                      }).then(
                        result => {
                          debugger;
                          let path = Capacitor.convertFileSrc(result.uri);
                          //this.fileEncryption.encrypt(result.uri,'123');
                         
                        },
                        err => {
                          console.log(err);
                        }
                      );
                    },err => {
                      console.log(err);
                    }
                  );
                
                  console.log(fileName);
                  this.fileName=fileName;
                  this.filePath='secrets/'+fileName;
                  this.storage.set(fileName,'secrets/'+fileName)
                  // this.storage.set(fileName);
                  console.log('Wrote file', result);
                  
                  
                } catch(e) {
                  console.error('Unable to write file', e);
                }

              
            };
        };
        debugger

        reader.readAsDataURL(fileInput.target.files[0]);
    }
}

removeImage() {
    this.cardImageBase64 = null;
    this.isImageSaved = false;
    this.storage.remove(this.fileName)
}


allFiles:[{name:string,path:string}]=[{name:"",path:""}];
getAllFIles(){
  debugger;
  this.clicked=true;
  this.storage.forEach((path,name)=>{
   var obj={name:"",path:""};
   obj.name=name;
   obj.path=path;

     
   this.allFiles.push(obj);
   
  })
}

clearList(){
  this.allFiles=[{name:"",path:""}];
  this.clicked=false;
}

async showImage(obj){
 
  debugger;
  console.log(FilesystemDirectory.Data)
//  / this.singleImageBase= FilesystemDirectory.Data+'/secrets/'+obj.name;
  let contents = await Filesystem.readFile({
    path: 'secrets/'+obj.name,
    directory: FilesystemDirectory.Documents,
    encoding: FilesystemEncoding.UTF8
    // encoding: FilesystemEncoding.UTF8
  });
  debugger;
  this.singleImageBase64[obj.name]=contents.data;
  // 'data:image/jpeg;base64,'+
}

}
