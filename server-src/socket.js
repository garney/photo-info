
import shortId from 'shortid';
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs';
import path from 'path';
import getExif from 'exif';
import sharp from 'sharp';

export default class Socket {
  data;
  dataPath = path.join(process.cwd(), 'photoUpload', 'data.json');
  constructor(socket) {
    this.socket = socket;
    // console.log('connection established');
    console.log(socket.id, 'CONNECTED')
    socket.emit(`connected`, shortId.generate());
    this.setup();
    if(fs.existsSync(this.dataPath)) {
      this.data = this.readData();
    } else {
      this.data = this.writeData();
    }
    this.indexTemplate = fs.readFileSync(path.join(process.cwd(), 'server-src', 'template', 'page.html'), 'utf-8');
  }

  writeData = (data) => {
    data = data || {
      lastUpdated: new Date(),
      images: [

      ]
    };
    fs.writeFileSync(this.dataPath, JSON.stringify(data, null, 3));
    return data;
  } 
  readData = () => {
    const rawData = fs.readFileSync(this.dataPath, 'utf-8');
    return JSON.parse(rawData);
  } 

  roll = (num) => {
      console.log('roll');
      const dice = [];
      for(let i = 0; i < num; i++) {
        dice.push(Math.ceil(Math.random()*6))
      }
      console.log('rolled', dice)
      this.socket.emit('rolled', dice)
  }

  getExif = (imageBuffer) => {
    return new Promise((resolve, reject) => {
      getExif(imageBuffer, (exif) => {
        console.log('🪵 ~ file: socket.js:53 ~ Socket ~ exif:', exif);
        resolve({
          exposureTime: exif['33434']
        });
      });
    });
  }

  generateThumbnail = (imageBuffer) => {
    return new Promise((resolve, reject) => {
      sharp(imageBuffer)
        .resize(200, 200)
        .toBuffer()
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  onPhotoUpload = async (filename, imageBuffer, extension, exif, callback) => {
      console.log('🪵 ~ file: socket.js:25 ~ Socket ~ filename:', filename);
      const folderName = uuidv4();
      // const imageBuffer = Buffer.from(imageBase64, 'base64');
      // const exif = await getExif(imageBuffer);
      const filePath = path.join(process.cwd(), 'photoUpload', folderName, `image.${extension}`);
      const filePathTm = path.join(process.cwd(), 'photoUpload', folderName, `image_thumb.${extension}`);
      const exifPath = path.join(process.cwd(), 'photoUpload', folderName, `exif.json`);
      const htmlPath = path.join(process.cwd(), 'photoUpload', folderName, `index.html`);
      console.log('🪵 ~ file: socket.js:30 ~ Socket ~ filePath:', filePath);
      fs.mkdirSync(path.join(process.cwd(), 'photoUpload', folderName), { recursive: true });
      const thumbnail = await this.generateThumbnail(imageBuffer);
      fs.writeFileSync(filePath, imageBuffer);
      fs.writeFileSync(filePathTm, thumbnail);
      fs.writeFileSync(exifPath, JSON.stringify(exif));
      fs.writeFileSync(htmlPath, this.indexTemplate);
      const url = `/${folderName}/image.${extension}`;
      const urlTm = `/${folderName}/image_thumb.JPG`;
      const imageData = {
        filePath,
        exifPath,
        thumbnail: urlTm,
        imageUrl: url,
        url: `/${folderName}/index.html`,
        id: folderName
      }
      callback(imageData, `File ${filename} uploaded successfully under folder ${folderName}`);
      this.addImageData(imageData);
  }

  addImageData = (data) => {
    this.data.images.push(data);
    this.data = this.writeData(this.data);
    this.socket.emit('updateImageList', this.data);
  }

  getImages = () => {
    this.socket.emit('updateImageList', this.data);
  }
  setup = () => {
    console.log('setup');
    this.socket.on('disconnect', this.onDisconnect);
    this.socket.on('reconnect', this.onReconnect);
    this.socket.on('uploadPhoto', this.onPhotoUpload);
    this.socket.on('getImages', this.getImages);

    //
    this.socket.on('roll', this.roll)
  }
  destroy = () => {
    console.log('destroy');
    this.socket.off('disconnect', this.onDisconnect);
    this.socket.off('reconnect', this.onReconnect);
    this.socket.off('roll', this.roll);
    this.socket.off('uploadPhoto', this.onPhotoUpload);
    this.socket.off('getImages', this.getImages);
  }

  onDisconnect = () => {
    console.log('disconnect');
    this.destroy();
  }
  onReconnect = () => {
    console.log('reconnect');
    this.setup();
  }

  static init(server) {

    const io = require('socket.io')(server);
    Socket.io = io;
    io.on('connection', (socket) => {
      new Socket(socket);
    });
    return io;
  }

}
