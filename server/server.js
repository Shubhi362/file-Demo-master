//server.js

const path = require('path');
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser')
const app = express();

const DIR = './uploads';
 
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, DIR);
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + '.' + path.extname(file.originalname));
    }
});
let upload = multer({storage: storage});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
 
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8100');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
 
app.get('/api', function (req, res) {
  res.end('file upload');
});
 
app.post('/api/upload',upload.single('file'), function (req, res) {
    if (!req.file) {
        console.log("Your request doesn’t have any file");
        return res.send({
          success: false
        });
    
      } else {
        console.log('Your file has been received successfully');
        return res.send({
          success: true
        })
      }
});
 
const PORT =  8100;
 
app.listen(PORT, function () {
  console.log('Node.js server is running on port ' + PORT);
});