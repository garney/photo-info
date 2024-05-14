var inputFiles = new Array();
var inputTypes = new Array();

////////////////////////////////////////////////////////////////////////
// Process image file as an array buffer
////////////////////////////////////////////////////////////////////////
export function handleBinaryFile(seq,binFile) {
    var dataView = new DataView(binFile);
    var offset, jpgSize, fileSize;
    var RAFtest =  getStringFromDB(dataView, 0, 4);
    var HIFtest =  getStringFromDB(dataView, 4, 4);
    var jpgHdr1 = dataView.getUint8(0);
    var jpgHdr2 = dataView.getUint8(1);
    var imageType = "Unknown";
    var tagSet = new Object();
    var fileType;
    var ft = "Unknown";
    fileSize = binFile.byteLength;
    tagSet.fileSize  = fileSize;
    if ((dataView.getUint8(0) == 0xFF) && (dataView.getUint8(1) == 0xD8)) {
       offset = 2;
       fileSize = binFile.byteLength;
       imageType = "JPG";
       var ffe1_offset = 0;
       var hdr, hdrx;
       for (ffe1_offset=0;ffe1_offset<fileSize-1;ffe1_offset++) {
         hdr  = dataView.getUint16(ffe1_offset);
         hdrx = hdr.toString(16).padStart(2, '0');
         if (hdrx == "ffe1") { break; }
       }
       fileType = getStringFromDB(dataView, offset+4, 4);
       tagSet.fileType  = fileType;
       if (hdrx == "ffe1") { 
          offset = offset + ffe1_offset - 2;
       } else {
          tagSet.fileType  = fileType;
          tagSet.imageType = imageType;
          inputTypes[seq]  = imageType;;
          tagSet.abort = true;
          return tagSet;
       }
       if (dataView.getUint16(6) == 0x4a46) {
          ft = "JFIF";
       } else if (dataView.getUint16(6) == 0x4578) {
          ft = "Exif";
       }
    } else if (RAFtest === "FUJI") {
       var CFATags = {};
       var JPGOffset              = dataView.getUint32(84);
       offset                     = JPGOffset + 2;
       var JPGLength              = dataView.getUint32(88);
       jpgSize                    = JPGLength;
       var CFAHeaderOffset        = dataView.getUint32(92);
       CFATags["CFAHeaderOffset"] = dataView.getUint32(92);
       CFATags["CFASize"]         = dataView.getUint32(104);
       CFATags["CFARawHeight"]    = dataView.getUint16(CFAHeaderOffset + 8);
       CFATags["CFARawWidth"]     = dataView.getUint16(CFAHeaderOffset + 10);
       imageType = "RAF";
       fileType = getStringFromDB(dataView, offset + 4, 4);
       tagSet.CFATags=CFATags;
       ft = "Exif";
    } else if (HIFtest === "ftyp") {
       var fnRet = new Object();
       fnRet = extractEXIFfromHIF(fileSize,dataView);
       offset = fnRet.offset;
       imageType = "HIF";
       fileType = "Exif";
       ft = "Exif";
       var thumbOffset = fnRet.thumbStart;
       var thumbLength = fnRet.thumbLength;
       var thumbArray = getArrayfromDV(dataView, thumbOffset, thumbLength);
       var thumbBlob  = new Blob([thumbArray], {type : 'image/jpeg'});
       tagSet.thumb = URL.createObjectURL(thumbBlob);
       tagSet.thumbOffset = fnRet.previewStart;
       tagSet.thumbLength = fnRet.previewLength;
    } else {
       tagSet.abort = true;
       return tagSet;
    }
    tagSet.fileType  = fileType;
    tagSet.imageType = imageType;
    inputTypes[seq]  = imageType;;
    console.log("Binary read image type : ", imageType);
  
    var appLength1  = dataView.getUint16(offset + 2);
    var appLength1a = offset+appLength1+2;
    if ((dataView.getUint8(appLength1a) == 255) && (dataView.getUint8(appLength1a+1) == 225)) { // 0xFFE1
       var appLength2  = dataView.getUint16(appLength1a+2);
       var xmlHdr=getStringFromDB(dataView, appLength1a+4, 28);
       var xmlBdy=getStringFromDB(dataView, appLength1a+33, 350);
       parser = new DOMParser();
       xmlDoc = parser.parseFromString(xmlBdy,"text/xml");
       if (typeof xmlDoc.getElementsByTagName("xmp:Rating")[0] !== 'undefined') {
          var fujiRating = xmlDoc.getElementsByTagName("xmp:Rating")[0].childNodes[0].nodeValue;
       }
       tagSet.rating = fujiRating;
    }
  
    if (dataView.getUint16(offset + 10) == 0x4949) {
       bigEnd = false;
    } else if (dataView.getUint16(offset + 10) == 0x4D4D) {
       bigEnd = true;
    } else {
       console.log("Endian missing");
       tagSet.abort = true;
       return tagSet;
    }
    if (dataView.getUint16(offset+12, !bigEnd) != 0x002A) {
       console.log("0x002A missing");
       tagSet.abort = true;
       return tagSet;
    }
    var firstIFDOffset = dataView.getUint32(offset+14, !bigEnd);
    if (firstIFDOffset < 0x00000008) {
       console.log("Offset less than 8: ", firstIFDOffset);
       tagSet.abort = true;
       return tagSet;
    }
  
    var tiffStart = offset + 10;
    var dirStart = tiffStart + firstIFDOffset;
  
    var nextOffset = readTags(seq, tagSet, dataView, tiffStart, dirStart, bigEnd, "IFD0");
  
    if (ft == "Exif") {
       if (nextOffset > 0) {
          if (imageType == "HIF") {
          } else {
            if (imageType == "RAF") {
               dirStart = offset + nextOffset + 10;
            } else {
               dirStart = nextOffset + 12;
            }
            readTags(seq, tagSet, dataView, tiffStart, dirStart, bigEnd,"IFD1");
            if (tagSet["0201"]) {
               var thumbOffset = tagSet["0201"].val;
               var thumbLength = tagSet["0202"].val;
               var thumbArray = getArrayfromDV(dataView, thumbOffset+tiffStart, thumbLength);
               var thumbBlob  = new Blob([thumbArray], {type : 'image/jpeg'});
               tagSet.thumb = URL.createObjectURL(thumbBlob);
            }
          }
       }
    }
  
    if (tagSet["8769"]) {
       dirStart = tiffStart + tagSet["8769"].val;
       readTags(seq, tagSet, dataView, tiffStart, dirStart, bigEnd, "ExifIFD");
    }
  
    var make="";
    if (typeof tagSet["010f"] !== 'undefined') {
       make = tagSet["010f"].val;
    }
    if ((tagSet["927c"])&&(make == "FUJIFILM")) {
       dirStart  = tagSet['927c'].val + offset + 22;
       tiffStart = tagSet['927c'].val + offset + 10;
       var mkrtest =  getStringFromDB(dataView, tiffStart, 8);
       if (mkrtest == "FUJIFILM") {
          var entries = dataView.getUint16(dirStart, true);
          readTags(seq, tagSet, dataView, tiffStart, dirStart, false, "FUJIFILM");
       }
    }
  
    return tagSet;
  }
  
  ////////////////////////////////////////////////////////////////////////
  // Process all blocks within a Exif segment
  ////////////////////////////////////////////////////////////////////////
  function readTags(seq, tagSet, file, tiffStart, dirStart, bigEnd, tagClass) {
    var entries = file.getUint16(dirStart, !bigEnd),
        entryOffset, tag, i;
  
    for (i=0;i<entries;i++) {
        entryOffset = dirStart + i*12 + 2;
        tagx   = readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd, tagClass);
        if (typeof tagSet[tagx.tagid] === 'undefined') { tagSet[tagx.tagid]=tagx; }
    }
  
    var nextOffset=file.getUint16(entryOffset+12, !bigEnd);
    return nextOffset;
  
  }
  
  ////////////////////////////////////////////////////////////////////////
  // Process individual 12 byte tag block
  ////////////////////////////////////////////////////////////////////////
  function readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd, tagClass) {
    var type        = file.getUint16(entryOffset+2, !bigEnd),
        numValues   = file.getUint32(entryOffset+4, !bigEnd),
        valueOffset = file.getUint32(entryOffset+8, !bigEnd) + tiffStart,
        offset, vals, val, n, numerator, denominator;
  
    var tagx = new Object();
    var tagid  = file.getUint16(entryOffset, !bigEnd);
    var tagidx = tagid.toString(16).padStart(4, '0');
    tagx.tagid = tagidx;
    tagx.type  = type;
    tagx.count = numValues;
    tagx.class = tagClass;
  
    switch (type) {
      case 1: // byte, 8-bit unsigned int
      case 7: // undefined, 8-bit byte, value depending on field
        if (numValues == 1) {
           vals=file.getUint8(entryOffset + 8, !bigEnd);
        } else {
           offset = numValues > 4 ? valueOffset : (entryOffset + 8);
           vals = "";
           for (n=0;n<numValues;n++) {
               var char = file.getUint8(offset + n);
               vals = vals + char.toString(16).padStart(2, '0');
           }
        }
        break;
  
      case 2: // ascii, 8-bit byte
        offset = numValues > 4 ? valueOffset : (entryOffset + 8);
        vals=getStringFromDB(file, offset, numValues-1);
        break;
  
      case 3: // short, 16 bit int
        if (numValues == 1) {
           vals=file.getUint16(entryOffset + 8, !bigEnd);
        } else {
           offset = numValues > 2 ? valueOffset : (entryOffset + 8);
           vals = [];
           for (n=0;n<numValues;n++) {
               vals[n] = file.getUint16(offset + 2*n, !bigEnd);
           }
        }
        break;
  
      case 4: // long, 32 bit int
        if (numValues == 1) {
           vals=file.getUint32(entryOffset + 8, !bigEnd);
        } else {
           vals = [];
           for (n=0;n<numValues;n++) {
               vals[n] = file.getUint32(valueOffset + 4*n, !bigEnd);
           }
        }
        break;
  
      case 5:    // rational = two long values, first is numerator, second is denominator
        if (numValues == 1) {
           numerator = file.getUint32(valueOffset, !bigEnd);
           denominator = file.getUint32(valueOffset+4, !bigEnd);
           vals = new Number(numerator / denominator);
           vals.numerator = numerator;
           vals.denominator = denominator;
        } else {
           vals = [];
           for (n=0;n<numValues;n++) {
               numerator = file.getUint32(valueOffset + 8*n, !bigEnd);
               denominator = file.getUint32(valueOffset+4 + 8*n, !bigEnd);
               vals[n] = new Number(numerator / denominator);
               vals[n].numerator = numerator;
               vals[n].denominator = denominator;
           }
        }
        break;
  
      case 9: // slong, 32 bit signed int
        if (numValues == 1) {
           vals=file.getInt32(entryOffset + 8, !bigEnd);
        } else {
           vals = [];
           for (n=0;n<numValues;n++) {
               vals[n] = file.getInt32(valueOffset + 4*n, !bigEnd);
           }
        }
        break;
  
      case 10: // signed rational, two slongs, first is numerator, second is denominator
        if (numValues == 1) {
           vals = file.getInt32(valueOffset, !bigEnd) / file.getInt32(valueOffset+4, !bigEnd);
        } else {
           vals = [];
           for (n=0;n<numValues;n++) {
               vals[n] = file.getInt32(valueOffset + 8*n, !bigEnd) / file.getInt32(valueOffset+4 + 8*n, !bigEnd);
           }
        }
        break;
      }
      tagx.val=vals;
      if (tagidx == "927c") {
         tagx.val = file.getUint32(entryOffset+8, !bigEnd);
      }
      return tagx;
  }
  
  ////////////////////////////////////////////////////////////////////////
  // Obtain URL for preview JPG within RAF file
  ////////////////////////////////////////////////////////////////////////
  function returnRAFURL(imageFile) {
  
    var dataView = new DataView(imageFile);
    var JPGOffset  = dataView.getUint32(84);
    var JPGLength  = dataView.getUint32(88);
    var imageArray = getArrayfromDV(dataView, JPGOffset, JPGLength);
    var imageBlob  = new Blob([imageArray], {type : 'image/jpeg'});
    return URL.createObjectURL(imageBlob);
  
  }
  
  ////////////////////////////////////////////////////////////////////////
  // Extract EXIF from HIF file
  ////////////////////////////////////////////////////////////////////////
  function extractEXIFfromHIF(fileSize,dataView) {
  
    var thumbIndex = 9999;
    var thumbOffset = 0;
    var thumbStart = 0;
    var thumbLength = 0;
    var previewStart = 0;
    var previewLength = 0;
    const indexArray = new Array();
  
    var byteIndex = 0;
    var exifIndex = 9999;
    var exifStart = 0;
    var eof = "N";
    while (byteIndex < fileSize && eof == "N") {
      var hifAtomSize = dataView.getUint32(byteIndex);
      var hifAtomHdr = getStringFromDB(dataView, byteIndex+4,4);
      if (hifAtomHdr == "meta") {
        var metaIndex = byteIndex + 12;
        var byteTest = byteIndex + hifAtomSize;
        while (metaIndex < byteTest ) {
          let metaSize = dataView.getUint32(metaIndex);
          let metaHdr = getStringFromDB(dataView, metaIndex+4, 4);
          if (metaHdr == "iinf") {
            let iinfCount = dataView.getUint16(metaIndex+12);
            for (let i = 0; i < iinfCount; i++) {
              let iinfid = dataView.getUint16(metaIndex+26+(i*21));
              let iinfnm = getStringFromDB(dataView, metaIndex+30+(i*21), 4);
              if (iinfnm == "Exif") {
                exifIndex = iinfid;
              }
              if (iinfnm == "jpeg") {
                indexArray.push(iinfid);
              }
              if (thumbIndex == 9999 && iinfnm == "jpeg") {
                thumbIndex = iinfid;
              }
            }
          } else if (metaHdr == "iloc") {
            let ilocCount = dataView.getUint16(metaIndex+14);
            for (let i = 0; i < ilocCount; i++) {
              let ilocid = dataView.getUint16(metaIndex+16+(i*16));
              let ilocstart = dataView.getUint32(metaIndex+24+(i*16));
              let iloclength = dataView.getUint32(metaIndex+28+(i*16));
              if (exifIndex < 9999) {
                if (exifIndex == ilocid) {
                  exifStart = ilocstart;
                }
              }
              let fLen = indexArray.length;
              for (let i = 0; i < fLen; i++) {
                if (ilocid == indexArray[i]) {
                  if (thumbLength == 0 || iloclength < thumbLength) {
                    thumbStart = ilocstart;
                    thumbLength = iloclength;
                  }
                  if (previewLength == 0 || iloclength > previewLength) {
                    previewStart = ilocstart;
                    previewLength = iloclength;
                  }
                }
              }
            }
          }
          metaIndex += metaSize;
        }
      }
      if (hifAtomSize == 1) {
        let hifAtomLarge2 = dataView.getUint32(byteIndex+12);
        byteIndex += hifAtomLarge2;
      } else if (hifAtomSize == 0) {
        eof = "Y";
      } else {
        byteIndex += hifAtomSize;
      }
    }
    var offset = 12;
    if (exifStart > 0) { offset = exifStart; }
    return {previewStart,previewLength,thumbStart,thumbLength,offset};
  
  }
  

////////////////////////////////////////////////////////////////////////
// Conversion routines
////////////////////////////////////////////////////////////////////////
function calculate_image_size(sensor,focalplanex,imagesize) {

   var imagesizex = "";
   if (sensor == "CMOSIII") {
       switch (imagesize) {
         case "6000x4000" : imagesizex = "L 3:2 ";  break;
         case "6000Ã—3376" : imagesizex = "L 16:9 "; break;
         case "4000Ã—4000" : imagesizex = "L 1:1 ";  break;
         case "4240Ã—2832" : imagesizex = "M 3:2 ";  break;
         case "4240Ã—2384" : imagesizex = "M 16:9 "; break;
         case "2832Ã—2832" : imagesizex = "M 1:1 ";  break;
         case "3008Ã—2000" : imagesizex = "S 3:2 ";  break;
         case "3008Ã—1688" : imagesizex = "S 16:9 "; break;
         case "2000Ã—2000" : imagesizex = "S 1:1 ";  break;
       }
   };
   if (sensor == "CMOSIV") {
       if (focalplanex == 2660) {
           switch (imagesize) {
             case "6240x4160" : imagesizex = "L 3:2 " ;  break;
             case "6240x3512" : imagesizex = "L 16:9 ";  break;
             case "4160x4160" : imagesizex = "L 1:1 " ;  break;
           }
       };
       if (focalplanex == 1882) {
           switch (imagesize) {
             case "4416x2944" : imagesizex = "M 3:2 " ;  break;
             case "4416x2488" : imagesizex = "M 16:9 ";  break;
             case "2944x2944" : imagesizex = "M 1:1 " ;  break;
           }
       };
       if (focalplanex == 1330) {
           switch (imagesize) {
             case "3120x2080" : imagesizex = "S 3:2 " ;  break;
             case "3120x1760" : imagesizex = "S 16:9 ";  break;
             case "2080x2080" : imagesizex = "S 1:1 " ;  break;
           }
       };
   };
 
   return imagesizex;
 }
 
 ////////////////////////////////////////////////////////////////////////
 // Conversion routines
 ////////////////////////////////////////////////////////////////////////
 function binHex(bin) {
 
   var hex = "";
   for (var j = 0; j < bin.length; j++) {
       var char = bin.substr(j,1);
       hex = hex + char.toString(16).padStart(2, '0');
   }
   return hex;
 }
 
 function hex2asc(str) {
    var hex = str.toString();//force conversion
     var str = '';
     for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
         str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
     return str;
 }
 
 function hexToSignedInt(hex) {
     if (hex.length % 2 != 0) {
         hex = "0" + hex;
     }
     var num = parseInt(hex, 16);
     var maxVal = Math.pow(2, hex.length / 2 * 8);
     if (num > maxVal / 2 - 1) {
         num = num - maxVal
     }
     return num;
 }
 
 function getStringFromDB(buffer, start, length) {
   var str = "", outstr = "";
   for (var n = start; n < start+length; n++) {
     let chr = buffer.getUint8(n);
     str = String.fromCharCode(chr);
     outstr += str;
   }
   return outstr;
 }
 
 function getArrayfromDV(buffer, start, length) {
   var array = new Uint8Array(length);
   var i=0;
   for (n=start;n<start+length;n++) {
     array[i] = buffer.getUint8(n);
     i++;
   }
   return array;
 }
 
 