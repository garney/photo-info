const modalWidth  = window.innerWidth;
const modalHeight = window.innerHeight;
console.log("Screen width: "+screen.width+" height: "+screen.height);
console.log("Screen available width: "+screen.availWidth+" available height: "+screen.availHeight);
console.log("Window inner width: "+window.innerWidth+" inner height: "+window.innerHeight);
const thumbWidth  = 200;
var filesCount    = 0;
var icnt          = 0;
var metaWidth     = 0;
var msgWidth      = 0;
var makerNotes    = 0;
var warnMessage   = null;
var myWindow      = null;
var keyStatus     = 0;
// keyStatus 0 : initial state
// keyStatus 3 : full screen 
var afStatus      = 0;
// afStatus 0 : show AF point (and face/eye)
// afStatus 1 : omit AF point / face / eye
var metaStatus    = 0;
// metaStatus 0 : initial state
// metaStatus 1 : show Metadata
// metaStatus 2 : omit Metadata
var exifStatus    = 0;
// exifStatus 0 : omit EXIF
// exifStatus 1 : show EXIF
var keySeq        = 0;
var p = { agent:navigator.userAgent.toLowerCase (),function:1,session:Math.random() };
var s = p["session"];
var str = String(s);
var session = str.replace(/^0\./, "");
console.log(session);
var isFullscreenAvailable = document.fullscreenEnabled;
var fullScreen="";
if (isFullscreenAvailable) {
   console.log("Full screen is supported");
   fullScreen=`<button id="fullScreenBTN" class="fullBtn">Full Screen</button>`;
} else {
   console.log("Full screen is NOT supported");
}
var auditArray = new Array();
var inputFiles = new Array();
var inputTypes = new Array();
var inputNames    = new Object();
var lastScrollTop = 0;
// var nodx = document.getElementById("hdrMenu");
// var div5 = document.createElement("div");
// div5.id = "myMenu";
// div5.className = "hdrMenu";
// div5.innerHTML = `<div class="tooltip"><a id="homeButton" class="homeButton" href="../index.html"></a><span class="tooltiptext">Home menu</span></div>
//     <div class="tooltip"><div id="dropzone" class="dropzone"><input type="file" id="image_uploads" name="image_uploads" accept="image/jpeg,image/heif,.HIF,.RAF"></div><span class="tooltiptext">Select image</span></div>
//     <div class="tooltip"><a id="refreshButton" class="refreshButton"></a><span class="tooltiptext">(R)efresh screen</span></div>
//     <div class="tooltip"><a id="helpButton" class="helpButton"></a><span class="tooltiptext">(I)nformation</span></div>`;
// nodx.appendChild(div5);
// var node = document.getElementById("myModals");
// var div3 = document.createElement("div");
// div3.id = "myModal";
// div3.className = "modal";
// div3.innerHTML = `<div id="screenDiv"><canvas id="fullscreen"></canvas></div>
//     <div id="menuContainer">
//     <div id="contextMenu" class="menu">
//       <ul class="menu-options">
//         <li class="menu-option">Full Screen</li>
//         <li class="menu-option">Metadata</li>
//         <li class="menu-option">EXIF</li>
//         <li class="menu-option">Autofocus</li>
//         <li class="menu-option">Refresh</li>
//         <li class="menu-option">Help</li>
//       </ul>
//     </div>
//     </div>`;
// node.appendChild(div3);
// var input  = document.querySelector("input");
// var divx1 = document.getElementById("hdrMiddle1");
// divx1.innerHTML = "Click on the picture icon and select a single image file from a FUJIFILM X Series camera (RAF, HIF or JPG).";
// var divx2 = document.getElementById("hdrMiddle2");
// divx2.innerHTML = "Click on the house icon above left to return to main menu and the (i)nformation icon to display more information about this screen.";
// var divx3 = document.getElementById("hdrNotes");
// divx3.innerHTML = "The latest version of this application supports HIF files from the FujiFilm X-H2S. If subject tracking has been used the results will be overlaid on the image.";
// var divx4 = document.getElementById("hdrContact");
// divx4.innerHTML = "Please address any comments to: exif@solentsystems.com";

////////////////////////////////////////////////////////////////////////
// Process global listeners
////////////////////////////////////////////////////////////////////////
// Help menu button
//   var helpButtonID = document.getElementById("helpButton");
//   helpButtonID.addEventListener("click", function() {
//     if (keyStatus == 0) {
//        if (myWindow == null || myWindow.closed) {
//           myWindow = window.open("https://www.solentsystems.com/common/helpSingle", "_blank", "menubar=yes,toolbar=yes,scrollbars=yes,resizable=yes,top=10,left=100,width=800,height=800");
//        } else {
//           myWindow.close();
//        }
//     }
//   });

// Refresh button
//   var refreshButtonID = document.getElementById("refreshButton");
//   refreshButtonID.addEventListener("click", function() {
//     if (keyStatus == 0) {
//        var imageType = inputTypes[0];
//        if (imageType == "RAF") { functionFullSizeRAF(); } else if (imageType == "HIF") { functionFullSizeHIF(); } else { functionFullSizeJPG(); }
//     }
//   });

// Check for full screen display / exit
// document.addEventListener('fullscreenchange', (event) => {
//   if (document.fullscreenElement) {
// //  console.log(`Element: ${document.fullscreenElement.id} entered full-screen mode.`);
//     keyStatus = 3;
//   } else {
// //  console.log('Leaving full-screen mode.');
//     keyStatus = 0;
//     var totImages = document.getElementById("totalImages");
//     if (totImages.hasChildNodes()) {
//        while (totImages.firstChild) {
//          totImages.removeChild(totImages.firstChild)
//        }
//     }
//     var myModalsID = document.getElementById("myModals");
//     myModalsID.style.display = "block";
//   }
// });

// Process keystrokes
// function addKeydownEvent(e) {
// //console.log("Keypad: keyStatus "+keyStatus+" keySeq "+keySeq+" keyCode "+e.keyCode);
//   if (keyStatus == 0) {
//     if (e.keyCode === 70 || e.keyCode == 38) { // "F" key or up arrow
//         keyStatus = 3;
//         totalImage();
//     } else if (e.keyCode === 72) { // "H" 
//        if (typeof myWindow !== 'undefined') {
//             if (myWindow.closed) {
//                myWindow = window.open("https://www.greybeard.pictures/common/help", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=10,left=100,width=800,height=800");
//             } else {
//                myWindow.close();
//             }
//        } else {
//                myWindow = window.open("https://www.greybeard.pictures/common/help", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=10,left=100,width=800,height=800");
//        }
//     } else if (e.keyCode === 69) { // "E" key
//        if (exifStatus == 1) {
//           exifStatus = 0;
//           document.getElementById("exifScreens").removeChild(document.getElementById("exifBlock"));
//           document.getElementById("exifScreens").style.display = "none";
//        } else {
//           exifStatus = 1;
//           exifDisplay(tagSet);
//        }
//     } else if (e.keyCode === 77) { // "M" key
//        if (keyStatus == 0) {
//           if (metaStatus == 1) {
//              metaStatus = 2;
//              document.getElementById("metaBlock").style.display  = "none";
//           } else if (metaStatus == 2) {
//              metaStatus = 1;
//              document.getElementById("metaBlock").style.display  = "block";
//           }
//        }
//     } else if (e.keyCode === 82) { // "R" key
//        if (keyStatus == 0) {
//           var imageType = inputTypes[0];
//           if (imageType == "RAF") { functionFullSizeRAF(); } else if (imageType == "HIF") { functionFullSizeHIF(); } else { functionFullSizeJPG(); }
//        }
//     } else if (e.keyCode === 65) { // "A" key
//        if (keyStatus == 0) {
//           if (afStatus == 0) { afStatus = 1;
//           } else { afStatus = 0; }
//           var imageType = inputTypes[0];
//           if (imageType == "RAF") { functionFullSizeRAF(); } else if (imageType == "HIF") { functionFullSizeHIF(); } else { functionFullSizeJPG(); }
//        }
//     }
//   } else if (keyStatus == 3) {
//     keyStatus = 0;
//     if (document.fullscreenElement) {
//        if (document.exitFullscreen) { document.exitFullscreen(); }
//        else if (document.mozCancelFullScreen)  { document.mozCancelFullScreen(); }
//        else if (document.webkitExitFullscreen) { document.webkitExitFullscreen(); }
//        else if (document.msExitFullscreen)     { document.msExitFullscreen(); }
//     }
//   }
// }
// document.addEventListener("keydown", addKeydownEvent);

// Check for files selected by user
// input.addEventListener('change', updateImageDisplay);
export function updateImageDisplay(e) { 
  const input = e.target;
  filesCount = input.files.length;
  icnt = 0; 

  var divID = "metaBlock";
  var divPrefix = "mdl";
  var divNode = document.getElementById("imageCanvas");

  var img = input.files[0];
  inputFiles[0]=img.name;
  inputNames[img.name]=0;;

  var arrayReader = new FileReader();
  arrayReader.onloadend = (function(file) {
      return function(evt) {
        var imageFile = evt.target.result;
        var tagSet  = handleBinaryFile(0,imageFile);
        var img = input.files[0];
        // document.getElementById("myMenu").style.opacity = "0.4";
        var auditArrayImage = metadata_extract(0,img,tagSet);
        auditArray[0] = auditArrayImage;
        auditArrayImage.filetype = tagSet.fileType;
//      writeAudit();
        warnMessage = null;
        makerNotes = 0;
        if (typeof tagSet['010f'] == 'undefined') {
           warnMessage = "Unknown camera make";
        } else {
          var makeTest = tagSet['010f'].val;
          if (makeTest.substr(0,8) !== 'FUJIFILM') {
             warnMessage = "Camera make is not supported: "+makeTest;
          } else if (typeof tagSet['927c'] == 'undefined') {
             warnMessage = "FUJIFILM specific EXIF missing from image";
          } else {
             makerNotes = 1;
          }
        }
        console.log("Warning message: %s ",warnMessage);
        // metaScreenDisplay();
        metaStatus = 1;
        afStatus = 0;
        var imageType = auditArrayImage.imagetype;
        if (imageType == "RAF") { functionFullSizeRAF(); } else if (imageType == "HIF") { functionFullSizeHIF(); } else { functionFullSizeJPG(); }
      };
  })(img);
  arrayReader.readAsArrayBuffer(img);
}  



/* helpers.js */

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
      var chr = buffer.getUint8(n);
      str = String.fromCharCode(chr);
      outstr += str;
    }
    return outstr;
  }
  
  function getArrayfromDV(buffer, start, length) {
    var array = new Uint8Array(length);
    var i=0;
    for (var n=start;n<start+length;n++) {
      array[i] = buffer.getUint8(n);
      i++;
    }
    return array;
  }
  

  ////////////////////////////////////////////////////////////////////////
// Extract and format metadata
////////////////////////////////////////////////////////////////////////
function metadata_extract (seq,img,tagSet) {

    var auditArrayImage = new Object();
  
    var value, tagid;
    auditArrayImage.filename  = img.name;
    auditArrayImage.imagetype = tagSet.imageType;
    auditArrayImage.thumbOffset = tagSet.thumbOffset;
    auditArrayImage.thumbLength = tagSet.thumbLength;
    var fileMB = (Math.round(10 * tagSet.fileSize / (1024 * 1024))) / 10;
    auditArrayImage.filesize  = fileMB+" MBytes";
  
    var orient = 1,orientation = "Landscape";
  //"0112" Orientation
    if (typeof tagSet["0112"] !== 'undefined') {
       var orientorigx;
       var orientorig = tagSet["0112"].val;
       switch (orientorig) {
         case 1 : orientorigx = "0 degrees: correct orientation"; break;
         case 2 : orientorigx = "0 degrees: mirrored"; break;
         case 3 : orientorigx = "180 degrees: upside down"; break;
         case 4 : orientorigx = "180 degrees: mirrored and upside down"; break;
         case 5 : orientorigx = "90 degrees: back-to-front and on its side"; break;
         case 6 : orientorigx = "90 degrees: mirrored and on its side"; break;
         case 7 : orientorigx = "270 degrees: back-to-front and on its far side"; break;
         case 8 : orientorigx = "270 degrees: mirrored: and on its far side"; break;
         default : orientorigx = "Unknown";
       }
       auditArrayImage.orientorigx = orientorigx;
    
       auditArrayImage.orientorig = tagSet["0112"].val;
       if ((tagSet["0112"].val !== 1)&&(tagSet["0112"].val !== 3)) {
          orientation = "Portrait";
          orient = 0;
       }
       auditArrayImage.orient = orient;
       auditArrayImage.orientation = orientation;
    }
  
    var fpos, fposs, afmode, afmodex, afmodey, zonesize, pointsize;
  //"4203" Faces Detected
    if (typeof tagSet["4203"] !== 'undefined') {
       fpos = tagSet["4203"].val;
       auditArrayImage.fpos = fpos;
       auditArrayImage.fposx = fpos.join();
    }
  
  //"4005" Faces Selected
    if (typeof tagSet["4005"] !== 'undefined') {
       fposs = tagSet["4005"].val;
       auditArrayImage.fposs = fposs;
       auditArrayImage.fpossx = fposs.join();
    }
  
    var cropArea1, cropArea2;
  //"1051/2" Digital Tele-Converter Crop Area
    if (typeof tagSet["1052"] !== 'undefined') {
       cropArea1 = tagSet["1052"].val;
       auditArrayImage.cropArea1 = cropArea1;
    }
    if (typeof tagSet["1053"] !== 'undefined') {
       cropArea2 = tagSet["1053"].val;
       auditArrayImage.cropArea2 = cropArea2;
    }
  
  //"1021" Focus Mode
  //if (typeof tagSet["1021"] !== 'undefined') {
  //   focusmode = tagSet["1021"].val;
  //   if (focusmode == 0) { focusmodex = "Auto";
  //   } else { focusmodex = "Manual"; }
  //   auditArrayImage.focusmode  = focusmode;
  //   auditArrayImage.focusmodex = focusmodex;
  //}
  
  //"1022" AF Mode
    if (typeof tagSet["1022"] !== 'undefined') {
       if (tagSet["1022"].val == 1) {
          auditArrayImage.afmode = "Single Point";
       } else if (tagSet["1022"].val == 256) {
          auditArrayImage.afmode = "Zone";
       } else {
          auditArrayImage.afmode = "Wide/Area Tracking";
       }
    }
  
    var focuspixelx,focuspixely;
  //"1023" Focus Pixels
    if (typeof tagSet["1023"] !== 'undefined') {
       focuspixely = tagSet["1023"].val[0];
       focuspixelx = tagSet["1023"].val[1];
       auditArrayImage.focuspixelx = focuspixelx;
       auditArrayImage.focuspixely = focuspixely;
    }
  
  //"102d" Focus Settings
    if (typeof tagSet["102d"] !== 'undefined') {
       var afmodq = "";
       var focusx = tagSet["102d"].val;
       var focus = focusx.toString(16).padStart(8,'0');
       var af3 = focus.substring(2,3);
       var af4 = focus.substring(3,4);
       var af5 = focus.substring(4,5);
       var af6 = focus.substring(5,6);
       var af7 = focus.substring(6,7);
       var af8 = focus.substring(7,8);
       if (af8 == 0) {
       } else {
          afmodq=af6;
          if (af6 == 2) {
          } else if (af6 == 1) {
             if (af4 > 0) {
                var zoneHeight = parseInt(af3, 16) / 2;
                zonesize=af4 + "x" + zoneHeight;
                auditArrayImage.zonesize  = zonesize;
             }
          } else if (af6 == 0) {
             pointsize=af5;
             auditArrayImage.pointsize = pointsize;
          }
          auditArrayImage.afmodex   = afmodq;
       }
    }
  
    var  afmessageText = "";
    if (typeof fposs !== 'undefined') {
       afmessageText = "Faces detected will show as yellow squares - while the object selected (either face or eye) is shown in white";
    } else {
       if (afmodq == 2) {
          afmessageText = "AF Wide/Area Tracking - the focus point is shown as a red target symbol";
       } else if (afmodq == 1) {
          if (typeof zonesize === 'undefined') {
             afmessageText = "AF Zone : the focus point selected by the camera is shown as a red target symbol";
          } else {
             afmessageText = "AF Zone size " + zonesize + " : the focus point selected by the camera is shown as a red target symbol";
          }
       } else if (afmodq == 0) {
          if (pointsize > 0) {
             afmessageText = "AF Single Point size " + pointsize + " : red square shows the area covered by the Single Point";
          } else {
             afmessageText = "AF Single Point : the centre of the point is shown by the red target symbol";
          }
       } else if (typeof focuspixelx !== 'undefined') {
             afmessageText = "Autofocus : the centre of the point is shown by the red target symbol";
       }
       if (typeof fpos !== 'undefined') {
          afmessageText = afmessageText + "<br>Faces detected show as yellow squares (although the camera does not appear to have used them for achieving focus)";
       }
    }
    auditArrayImage.aftext   = afmessageText;
  
    var imagewidth,imageheight;
  //"a002" Image Width
    if (typeof tagSet["a002"] !== 'undefined') {
       imagewidth = tagSet["a002"].val;
    } else {
       imagewidth = this.width;
    }
    auditArrayImage.imagewidth = imagewidth;
  
  //"a003" Image Height
    if (typeof tagSet["a003"] !== 'undefined') {
         imageheight = tagSet["a003"].val;
    } else {
         imageheight = this.height;
    }
    auditArrayImage.imageheight = imageheight;
  
    var label = "Camera Make";
  //"010f" Camera Make
    if (typeof tagSet["010f"] == 'undefined') {
       value = "Unknown Make";
    } else {
       value = tagSet["010f"].val;
    }
    auditArrayImage.make = extractElement(value);
  
    var model,sensor;
    label = "Camera Model";
  //"0110" Camera Model
    if (typeof tagSet["0110"] == 'undefined') {
       value = "Unknown Model";
    } else {
       value = tagSet["0110"].val;
       model = value;
       sensor = CameraSensorArray[value];
    }
    auditArrayImage.model = extractElement(value);
  
    label = "Sensor";
    if (typeof sensor !== 'undefined') {
       switch (sensor) {
         case "CMOS5HR"  : value = "40 MP X-Trans CMOS 5 HR"; break;
         case "CMOS5HS"  : value = "26 MP X-Trans BSI-CMOS 5HS"; break;
         case "CMOSIV"  : value = "26.1 megapixels X-Trans CMOS IV"; break;
         case "CMOSIII" : value = "24MP X-Trans CMOS III"; break;
         case "CMOSII"  : value = "16MP X-Trans CMOS II"; break;
         case "CMOS"    : value = "16MP X-Trans CMOS"; break;
         case "CMOSB1"  : value = "24.2MP APS-C CMOS"; break;
         default : value = "Unknown";
       }
       auditArrayImage.sensor = extractElement(value);
    }
  
    label = "Serial";
  //"a431" Camera Serial
    if (typeof tagSet["a431"] !== 'undefined') {
       value=extractTag(tagSet["a431"].val,"N");
       auditArrayImage.cameraserial = value;
    }
  
    label = "EXIF Version";
  //  "9000" EXIF Version
    if (typeof tagSet["9000"] !== 'undefined') {
       value=extractTag(tagSet["9000"].val,"Y");
       auditArrayImage.exifversion = value;
    }
  
    label = "Manufacture date";
  //"0010" Internal Serial Number
    if (typeof tagSet["0010"] !== 'undefined') {
       var isn = tagSet["0010"].val;
       if (isn.length > 40) {
          auditArrayImage.mandate = "20"+isn.substr(29,2)+":"+isn.substr(31,2)+":"+isn.substr(33,2);
       } else {
          auditArrayImage.mandate = "N/A";
       }
    }
  
    label = "Shutter Count";
  //"1438" Image Count
    if (typeof tagSet["1438"] !== 'undefined') {
       var ic = tagSet["1438"].val;
       var ic1 = "";
       if (typeof model !== 'undefined') {
          ic1 = ImageCountArray[model];
       }
       if ((ic1 == "A")&(ic == 1)) {
       } else if (ic1 !== "C") {
          ic = ic ^ 32768;
       }
       auditArrayImage.shuttercount = extractElement(ic);
    }
  
    label = "Information Field";
  //"1439" Information Field
    if (typeof tagSet["1439"] !== 'undefined') {
       value=extractTag(tagSet["1439"].val,"N");
       auditArrayImage.infofield = value;
    }
  
    label = "Source";
    if (typeof tagSet["0131"] !== 'undefined') {
       var software = tagSet["0131"].val;
       var n1 = software.search(/^Digital Camera .+$/);
       if (n1 == 0) {
          value = "Straight Out of Camera";
       } else {
          value = tagSet["0131"].val;
       }
       auditArrayImage.source = value;
       label = "Firmware Version";
       var n2 = software.search(/Digital.+ Ver/);
       if (n2 > -1) {
          auditArrayImage.firmware=extractElement(software.replace(/.+ Ver/,""));
       }
    }
  
    label = "Rating";
    if (typeof tagSet.rating !== 'undefined') {
       auditArrayImage.rating = tagSet.rating;
    } else if (typeof tagSet["1431"] !== 'undefined') {
       auditArrayImage.rating = extractElement(tagSet["1431"].val);
    }
  
    label = "Lens Make";
    if (typeof tagSet["a433"] !== 'undefined') {
       auditArrayImage.lensmake = extractTag(tagSet["a433"].val,"N");
    }
  
    label = "Lens Model";
    if (typeof tagSet["a434"] !== 'undefined') {
       auditArrayImage.lensmodel = extractTag(tagSet["a434"].val,"N");
    }
  
    label = "Lens Serial";
    if (typeof tagSet["a435"] !== 'undefined') {
       auditArrayImage.lensserial = extractTag(tagSet["a435"].val,"N");
    }
  
  
    label = "Shutter Speed";
    if (typeof tagSet["829a"] !== 'undefined') {
       var num = tagSet["829a"].val.numerator;
       var den = tagSet["829a"].val.denominator;
       var ext;
       if (num > den) {
          ext = num / den;
          ext = ext.toFixed(0);
          value = ext;
       } else {
          ext = den / num;
          ext = ext.toFixed(0);
          value = "1/" + ext;
       }
       auditArrayImage.shutterspeed=extractElement(value);
    }
  
    label = "Aperture";
    if (typeof tagSet["829d"] !== 'undefined') {
       auditArrayImage.aperture = extractTag(tagSet["829d"].val,"N");
    }
  
    label = "ISO";
    if (typeof tagSet["8827"] !== 'undefined') {
       auditArrayImage.iso = extractTag(tagSet["8827"].val,"N");
    }
  
    label = "Exposure Compensation";
    if (typeof tagSet["9204"] !== 'undefined') {
       auditArrayImage.expcomp = extractTag(tagSet["9204"].val,"N");
    }
  
    label = "Focal Length";
    if (typeof tagSet["920a"] !== 'undefined') {
       auditArrayImage.focallength = extractTag(tagSet["920a"].val,"N");
    }
  
    label = "(35mm Format)";
    if (typeof tagSet["a405"] !== 'undefined') {
       auditArrayImage.lens35mm = extractTag(tagSet["a405"].val,"N");
    }
  
    label = "Picture Mode";
    if (typeof tagSet["1031"] !== 'undefined') {
       auditArrayImage.picturemode=extractElement(extractString(tagSet["1031"].tagid,tagSet["1031"].val));
    }
  
    label = "Advanced Filter";
    if (typeof tagSet["1201"] !== 'undefined') {
       auditArrayImage.advancedfilter=extractElement(extractString(tagSet["1201"].tagid,tagSet["1201"].val));
    }
  
    label = "Scene Types";
    if (typeof tagSet["1427"] !== 'undefined') {
       var stc = tagSet["1427"].val;
       value="";
       var sceneTypes = tagSet["1428"].val;
        for (var st4=0;st4 < sceneTypes.length;st4=st4+4) {
            value = value + ScenetypeArray[sceneTypes.substr(st4,4)];
            if (st4 < (sceneTypes.length -4)) {
               value = value + ",";
            }
        }
        auditArrayImage.scenetypes=extractElement(value);
     }
  
  
    label = "Photometry";
    if (typeof tagSet["9207"] !== 'undefined') {
       auditArrayImage.photometry=extractElement(extractString(tagSet["9207"].tagid,tagSet["9207"].val));
    }
  
    label = "Exposure Mode";
    if (typeof tagSet["a402"] !== 'undefined') {
       auditArrayImage.exposuremode=extractElement(extractString(tagSet["a402"].tagid,tagSet["a402"].val));
    }
  
    label = "Image Timestamp";
    if (typeof tagSet["0132"] == 'undefined') {
       if (typeof tagSet["9003"] == 'undefined') {
          value = "Unknown Timestamp";
       } else {
          value = tagSet["9003"].val;
       }
    } else {
       value = tagSet["0132"].val;
    }
    auditArrayImage.timestamp = extractElement(value);
  
    label = "Blur Warning";
    if (typeof tagSet["1300"] !== 'undefined') {
       auditArrayImage.blurwarning = extractElement(extractString(tagSet["1300"].tagid,tagSet["1300"].val));
    }
  
    label = "Focus Warning";
    if (typeof tagSet["1301"] !== 'undefined') {
       auditArrayImage.focuswarning = extractElement(extractString(tagSet["1301"].tagid,tagSet["1301"].val));
    }
  
    label = "Exposure Warning";
    if (typeof tagSet["1302"] !== 'undefined') {
       auditArrayImage.exposurewarning = extractElement(extractString(tagSet["1302"].tagid,tagSet["1302"].val));
    }
  
    label = "Crop Mode";
    if (typeof tagSet["104d"] !== 'undefined') {
       auditArrayImage.cropmode = extractElement(extractString(tagSet["104d"].tagid,tagSet["104d"].val));
    }
  
    label = "Auto Bracketing";
    if (typeof tagSet["1100"] !== 'undefined') {
       auditArrayImage.autobracket = extractTag(tagSet["1100"].val,"N");
    }
  
    var drv,drvm,drvs;
    label = "Drive Mode";
    if (typeof tagSet["1103"] !== 'undefined') {
       drv = tagSet["1103"].val.toString(16).padStart(8,'0');
       drvs = drv.substr(0,2);
       drvm = drv.substr(6,2);
       label = "Drive Speed";
       var drvss = parseInt(drvs, 16);
       if (drvss > 0) { value = drvss + " fps"; } else { value = "N/A"; }
       auditArrayImage.drivespeed = extractElement(value);
       value = "Single";
       if (drvm > "00") { 
         if (auditArrayImage.autobracket == 2) {
           value = "Continuous High/Pre-shot";
         } else if (drvm > "00") { 
           value = "Continuous";
         }
       }
       auditArrayImage.drivemode = extractElement(value);
       console.log("0x1103 "+drv+" drvs "+drvs+" drvm "+drvm+" drvss "+drvss);
    }
  
    label = "Sequence Number";
    if (typeof tagSet["1101"] !== 'undefined') {
       auditArrayImage.sequence = extractTag(tagSet["1101"].val,"N");
    }
  
    label = "Brightness Value";
    if (typeof tagSet["9203"] !== 'undefined') {
       auditArrayImage.brightness = extractTag(tagSet["9203"].val,"N");
    }
  
    label = "Artist";
    if (typeof tagSet["013b"] !== 'undefined') {
       auditArrayImage.artist = extractTag(tagSet["013b"].val,"N");
    }
  
    label = "Copyright";
    if (typeof tagSet["8298"] !== 'undefined') {
       auditArrayImage.copyright = extractTag(tagSet["8298"].val,"N");
    } else {
       auditArrayImage.copyright = "None";
    }
  
    if ((tagSet.imageType == "JPG") || (tagSet.imageType == "HIF")) {
       label = "Image Size";
       if (typeof imagewidth !== 'undefined') {
          var imagesize = imagewidth + "x" + imageheight;
          if (typeof tagSet["a20e"] !== 'undefined') {
             var imagesizex = calculate_image_size(sensor,tagSet["a20e"].val,imagewidth +"x"+imageheight);
             value = imagesizex + " " + imagesize;
          } else {
             value = imagesize;
          }
          auditArrayImage.imagesize = extractElement(value);
       }
       label = "Image Quality";
       if (typeof tagSet["1000"] !== 'undefined') {
          auditArrayImage.imagequality = extractTag(tagSet["1000"].val,"N");
       }
    } else if (tagSet.imageType == "RAF") {
       label = "Raw Size";
       var CFATags = tagSet.CFATags;
       value = CFATags["CFARawWidth"] + " x " + CFATags["CFARawHeight"];
       auditArrayImage.rawsize = extractElement(value);
       label = "Raw Recording";
       if (typeof sensor !== 'undefined') {
          var CFARawCheck  = ((CFATags["CFARawWidth"] * CFATags["CFARawHeight"]) * 2 ) + 2048;
          if (CFARawCheck == CFATags["CFASize"]) {
              value = "Uncompressed";
          } else {
              value = "Compressed";
          }
          auditArrayImage.rawrecording = extractElement(value);
       }
    }
  
    label = "Film Simulation";
    var filmmode, filmmodex, saturation, saturationx;
    if (typeof tagSet["1401"] !== 'undefined') {
       filmmode    = tagSet["1401"].val;
       filmmodex   = FilmModeArray[filmmode];
    }
    if (typeof tagSet["1003"] !== 'undefined') {
       saturation    = tagSet["1003"].val;
       saturationx = SaturationArray[saturation];
    }
    if (typeof filmmode === 'undefined') {
        value = saturationx;
    } else {
        value = filmmodex;
    }
    auditArrayImage.filmsimulation = extractElement(value);
  
    label = "Grain Effect";
    if (typeof tagSet["1047"] !== 'undefined') {
       auditArrayImage.graineffect = extractElement(ColourArray[tagSet["1047"].val]);
    }
  
    label = "BW Warm/Cool";
    if (typeof tagSet["1049"] !== 'undefined') {
       auditArrayImage.bwwarmcool = extractElement(tagSet["1049"].val);
       if (auditArrayImage.bwwarmcool > 127) { auditArrayImage.bwwarmcool = auditArrayImage.bwwarmcool - 256 }
    }
  
    label = "BW Green/Magenta";
    if (typeof tagSet["104b"] !== 'undefined') {
       auditArrayImage.bwgreenmagenta = extractElement(tagSet["104b"].val);
       if (auditArrayImage.bwgreenmagenta > 127) { auditArrayImage.bwgreenmagenta = auditArrayImage.bwgreenmagenta - 256 }
    }
  
    label = "Grain Size";
    if (typeof tagSet["104c"] !== 'undefined') {
       auditArrayImage.grainsize = extractElement(SizeArray[tagSet["104c"].val]);
    } else {
       auditArrayImage.grainsize = "N/A";
    }
  
    label = "Color Chrome Effect";
    if (typeof tagSet["1048"] !== 'undefined') {
       auditArrayImage.colorchrome = extractElement(ColourArray[tagSet["1048"].val]);
    }
  
    label = "Color Chrome FX Blue";
    if (typeof tagSet["104e"] !== 'undefined') {
       auditArrayImage.colorchromefx = extractElement(ColourArray[tagSet["104e"].val]);
    }
  
    label = "Clarity";
    if (typeof tagSet["100f"] !== 'undefined') {
       auditArrayImage.clarity = extractElement(tagSet["100f"].val / 1000);
    }
  
    label = "White Balance";
    if (typeof tagSet["1002"] !== 'undefined') {
       auditArrayImage.whitebalance = extractElement(extractString(tagSet["1002"].tagid,tagSet["1002"].val));
    }
  
    label = "White Balance Custom";
    if (typeof tagSet["1005"] !== 'undefined') {
       auditArrayImage.wbcustom = extractTag(tagSet["1005"].val);
    }
  
    label = "White Balance Fine Tune";
    if (typeof tagSet["100a"] !== 'undefined') {
       var wbred = tagSet["100a"].val[0] / 20;
       var wbblu = tagSet["100a"].val[1] / 20;
       value = "Red  " + wbred + " Blue  " + wbblu;
       auditArrayImage.whitebalanceft = extractElement(value);
    }
    
    var dr,drs,ddr,drp,drpf,drpf;
    if (typeof tagSet["1400"] !== 'undefined') { dr   = tagSet["1400"].val; }
    if (typeof tagSet["1402"] !== 'undefined') { drs  = tagSet["1402"].val; }
    if (typeof tagSet["1403"] !== 'undefined') { ddr  = tagSet["1403"].val; }
    if (typeof tagSet["1443"] !== 'undefined') { drp  = tagSet["1443"].val; }
    if (typeof tagSet["1444"] !== 'undefined') { drpa = tagSet["1444"].val; }
    if (typeof tagSet["1445"] !== 'undefined') { drpf = tagSet["1445"].val; }
  
    if (typeof drs !== 'undefined') {
       value = "N/A";
       if (drs == 0) { value = "Auto "; }
       else if (drs == 1) { value = "Manual DR" + ddr; }
       auditArrayImage.dynamicrange = extractElement(value);
     } else {
       value = "N/A";
       if (typeof drp !== 'undefined') {
          if (drp == 1) {
             if (typeof drpa !== 'undefined') {
                if (drpa == 1) { value = "Fixed Weak "; }
                else if (drpa == 2) { value = "Fixed Strong "; }
             }
          } else {
             if (typeof drpf !== 'undefined') {
                if (drpf == 1) { value = "Auto Weak "; }
                else if (drpf == 2) { value = "Auto Strong "; }
             }
          }
       }
       auditArrayImage.drangepriority = extractElement(value);
     }
  
    label = "Highlight Tone";
    if (typeof tagSet["1041"] !== 'undefined') {
       auditArrayImage.highlight = extractElement(extractString(tagSet["1041"].tagid,tagSet["1041"].val));
    }
  
    label = "Shadow Tone";
    if (typeof tagSet["1040"] !== 'undefined') {
       auditArrayImage.shadow = extractElement(extractString(tagSet["1040"].tagid,tagSet["1040"].val));
    }
   
    label = "Color";
    if (typeof saturationx !== 'undefined') {
       auditArrayImage.color = saturationx;
    }
   
    label = "Sharpness";
    if (typeof tagSet["1001"] !== 'undefined') {
       auditArrayImage.sharpness = extractElement(extractString(tagSet["1001"].tagid,tagSet["1001"].val));
    } else if (typeof tagSet["a40a"] !== 'undefined') {
       auditArrayImage.sharpness = extractElement(extractString(tagSet["a40a"].tagid,tagSet["a40a"].val));
    }
   
    label = "Noise Reduction";
    if (typeof tagSet["100e"] !== 'undefined') {
       auditArrayImage.noisereduction = extractElement(extractString(tagSet["100e"].tagid,tagSet["100e"].val));
    } else if (typeof tagSet["100b"] !== 'undefined') {
       auditArrayImage.noisereduction = extractElement(extractString(tagSet["100b"].tagid,tagSet["100b"].val));
    }
   
    label = "Lens Modulation Optimizer";
    if (typeof tagSet["1045"] !== 'undefined') {
       value = "";
       if (tagSet["1045"].val == 0) { value = "Off"; }
       if (tagSet["1045"].val == 1) { value = "On"; }
       auditArrayImage.lmo = extractElement(value);
    }
   
    label = "Color Space";
    if (typeof tagSet["a001"] !== 'undefined') {
       value = "";
       if (tagSet["a001"].val == 1) { value = "sRGB"; }
       if (tagSet["a001"].val == 2) { value = "Adobe RGB"; }
       if (tagSet["a001"].val == 65535) { value = "Uncalibrated"; }
       auditArrayImage.colorspace = extractElement(value);
    }
   
    label = "Faces Detected";
    if (typeof tagSet["4100"] !== 'undefined') {
       auditArrayImage.faces = extractElement(tagSet["4100"].val);
    }
  
    if (typeof tagSet["102d"] !== 'undefined') {
       var afs = tagSet["102d"].val.toString(16).padStart(8,'0');
       var af3 = afs.substr(2,1);
       var af4 = afs.substr(3,1);
       var af5 = afs.substr(4,1);
       var af6 = afs.substr(5,1);
       var af7 = afs.substr(6,1);
       var af8 = afs.substr(7,1);
       if (af7 == 0) {
          auditArrayImage.preaf = "Off";
       } else {
          auditArrayImage.preaf = "On";
       }
       if (af8 == 0) {
          auditArrayImage.focusmode = "Manual Focus";
       } else {
          if (af8 == 1) {
             auditArrayImage.focusmode = "AF-S";
          } else {
             auditArrayImage.focusmode = "AF-C";
          }
          if (af6 == 2) {
             auditArrayImage.afmode = "Wide/Area Tracking";
          } else if (af6 == 1) {
             if (af4 > 0) {
                var zoneHeight = parseInt(af3, 16) / 2;
                auditArrayImage.afmode = "Zone";
                auditArrayImage.zonesize = af4 + "x" + zoneHeight;
             }
          } else if (af6 == 0) {
             if (af5 > 0) {
                auditArrayImage.afmode = "Single Point";
                auditArrayImage.pointsize = af5;
             }
          }
       }
    }
  
    if (typeof tagSet["102e"] !== 'undefined') {
       var afc = tagSet["102e"].val.toString(16).padStart(8,'0');
        var afc6 = afc.substr(5,1);
        var afc7 = afc.substr(6,1);
        var afc8 = afc.substr(7,1);
        var afcset;
        switch (afc) {
           case "00000102" : afcset = "Set 1 (multi-purpose)"; break;
           case "00000203" : afcset = "Set 2 (ignore obstacles)"; break;
           case "00000122" : afcset = "Set 3 (accelerating subject)"; break;
           case "00000010" : afcset = "Set 4 (suddenly appearing subject)"; break;
           case "00000123" : afcset = "Set 5 (erratic motion)"; break;
           default : afcset = "Set 6 (custom)"; break;
        }
        auditArrayImage.afcset = afcset;
        auditArrayImage.afcts = afc8;
        auditArrayImage.afcsts = afc7;
        var afczone;
        switch (afc6) {
           case "0" : afczone = "Front"; break;
           case "1" : afczone = "Auto"; break;
           case "2" : afczone = "Center"; break;
        }
        auditArrayImage.afczone = afczone;
    }
  
    if (typeof tagSet["102b"] !== 'undefined') {
       var afcp="", afsp="";
       var afpriority = tagSet["102b"].val.toString(16).padStart(4,'0');
       var afp3 = afpriority.substr(2,1);
       var afp4 = afpriority.substr(3,1);
       switch (afp3) {
           case "1" : afcp = "Release"; break;
           case "2" : afcp = "Focus"; break;
       }
       auditArrayImage.afcpriority = afcp;
       switch (afp4) {
           case "1" : afcp = "Release"; break;
           case "2" : afcp = "Focus"; break;
       }
       auditArrayImage.afspriority = afcp;
     }
  
    label = "Unknown AF Coding";
    if (typeof tagSet["102c"] !== 'undefined') {
       auditArrayImage.afunknown = tagSet["102c"].val.toString(16).padStart(5, '0');
    }
  
    label = "Shutter Type";
    if (typeof tagSet["1050"] !== 'undefined') {
       value  = extractString(tagSet["1050"].tagid,tagSet["1050"].val);
       auditArrayImage.shuttertype = extractElement(value);
    }
  
    label = "Flicker Reduction";
    if (typeof tagSet["1446"] !== 'undefined') {
       var flrd1 = tagSet["1446"].val.toString(16).padStart(4,'0');
       var flrd2 = flrd1.substr(1,1);
       var value = "Off";
       if (flrd2 == "1") { value = "On"; }
       auditArrayImage.flicker = extractElement(value);
    }
  
    label = "IS Type";
    if (typeof tagSet["1422"] !== 'undefined') {
       var isType = tagSet["1422"].val;
       label = "IS Type";
       var value="";
       switch (isType[0]) {
         case 0 : value = "None"; break;
         case 1 : value = "Optical"; break;
         case 2 : value = "Sensor-shift"; break;
         case 3 : value = "OIS Lens"; break;
         default : value = "N/A";
        }
       auditArrayImage.istype = extractElement(value);
       var value="";
       label = "IS Mode";
       switch (isType[1]) {
         case 0 : value = "Off"; break;
         case 1 : value = "On (mode 1, continuous)"; break;
         case 2 : value = "On (mode 2, shooting only)"; break;
         default : value = "N/A";
       }
       auditArrayImage.ismode = extractElement(value);
    }
  
    label = "Flash";
    if (typeof tagSet["9209"] !== 'undefined') {
       auditArrayImage.flash = extractElement(extractString(tagSet["9209"].tagid,tagSet["9209"].val));
    }
  
    label = "Flash Mode";
    if (typeof tagSet["1010"] !== 'undefined') {
       auditArrayImage.flashmode = extractElement(extractString(tagSet["1010"].tagid,tagSet["1010"].val));
    }
  
    label = "Flash Exposure Comp";
    if (typeof tagSet["1011"] !== 'undefined') {
       auditArrayImage.flashcomp = extractTag(tagSet["1011"].val,"N");
    }
  
    return auditArrayImage;
  
  }
  
  ////////////////////////////////////////////////////////////////////////
  // Common tag formatting routines
  ////////////////////////////////////////////////////////////////////////
  function extractElement(value) {
  
    var avalue = "";
    var tvalue = typeof value;
    if (typeof value !== 'undefined') {
       if (tvalue !== 'string') {
         avalue = String(value);
       } else {
         var stringx = value.replace(/\0.*$/,"");
         avalue = stringx.trim();
       }
    } else {
       avalue = "N/A";
    }
    return avalue;
  
  }
  
  function extractTag(value,hex) {
  
    var avalue = "None";
    var tvalue = typeof value;
    if (tvalue !== 'string') {
       avalue = String(value);
    } else {
       var stringx = value.replace(/\0.*$/,"");
       avalue = stringx.trim();
    }
    if (hex == "Y") {
       avalue = hex2asc(avalue);
    }
    if (avalue.length == 0) {
       avalue = "None";
    }
    return avalue;
  
  }

  

////////////////////////////////////////////////////////////////////////
// Display metadata block
////////////////////////////////////////////////////////////////////////
function fszDisplayMetadata(gauditArrayImage) {

    var divNode = document.getElementById("myMetaID");
    var div3    = document.createElement("div");
    div3.id     = "metaBlock";
    div3.classList.add("column");
    div3.classList.add("metadata");
    div3.innerHTML = `<div id=fszexifBlk1 class="column2">
        <div id="fszHdr" class="exifblkHdr"></div>
        <div id="fszSummary" class="exifblk">
          <div class="fszexifhdr" id="fszexifsummaryhdr"> </div> 
        </div>
        <div id="fszCamera" class="exifblk">
          <div class="fszexifhdr" id="fszexifcamerahdr"> </div> <table class="fszexif" id="fszexifcamera"><colgroup><col class="exifa"><col class="exifb"></colgroup></table>
        </div>
        <div id="fszLens" class="exifblk">
          <div class="fszexifhdr" id="fszexiflenshdr">   </div> <table class="fszexif" id="fszexiflens">  <colgroup><col class="exifa"><col class="exifb"></colgroup></table>
        </div>
        <div id="fszOrigin" class="exifblk">
          <div class="fszexifhdr" id="fszexiforiginhdr"> </div> <table class="fszexif" id="fszexiforigin"><colgroup><col class="exifa"><col class="exifb"></colgroup></table>
        </div>
        <div id="fszIq" class="exifblk">
          <div class="fszexifhdr" id="fszexifiqhdr"> </div> <table class="fszexif" id="fszexifiq"><colgroup><col class="exifa"><col class="exifb"></colgroup></table>
        </div>
      </div>
      <div id=fszexifBlk2 class="column2">
        <div id="fszShoot" class="exifblk">
          <div class="fszexifhdr" id="fszexifshoothdr">  </div> <table class="fszexif" id="fszexifshoot"> <colgroup><col class="exifa"><col class="exifb"></colgroup></table>
        </div>
        <div id="fszSht" class="exifblk">
          <div class="fszexifhdr" id="fszexifshthdr"> </div> <table class="fszexif" id="fszexifsht"><colgroup><col class="exifa"><col class="exifb"></colgroup></table>
        </div>
        <div id="fszAf" class="exifblk">
          <div class="fszexifhdr" id="fszexifafhdr"> </div> <table class="fszexif" id="fszexifaf"><colgroup><col class="exifa"><col class="exifb"></colgroup></table>
        </div>
        <div id="fszFlash" class="exifblk">
          <div class="fszexifhdr" id="fszexifflashhdr"> </div> <table class="fszexif" id="fszexifflash"><colgroup><col class="exifa"><col class="exifb"></colgroup></table>
        </div>
    </div>`;
    divNode.appendChild(div3);
    if (warnMessage !== undefined) {
       if (warnMessage !== null) {
          document.getElementById("fszHdr").innerHTML = warnMessage + " - the metadata available will be limited - this application works best with an image file straight out of a FUJIFILM X series camera";
       }
    }
    document.getElementById("fszexifsummaryhdr").innerHTML = auditArrayImage.filename+" "+auditArrayImage.timestamp;
    document.getElementById("fszexifcamerahdr").innerHTML = "Camera Information";
    document.getElementById("fszexiflenshdr").innerHTML   = "Lens Information";
    document.getElementById("fszexifshoothdr").innerHTML  = "Shooting Information";
    document.getElementById("fszexiforiginhdr").innerHTML = "Origin Information";
    if (makerNotes == 1) {
       document.getElementById("fszexifiqhdr").innerHTML     = "IQ Menu";
       document.getElementById("fszexifshthdr").innerHTML    = "Shooting Menu";
       document.getElementById("fszexifafhdr").innerHTML     = "AF/MF Menu";
       document.getElementById("fszexifflashhdr").innerHTML  = "Flash Menu";
    }
  
    var imagetype = auditArrayImage.imagetype;
    var exifclass,label,value;
    exifclass = "exifcamera";
    fszDisplayElement(exifclass,"File Name",auditArrayImage.filename);
    fszDisplayElement(exifclass,"File Size",auditArrayImage.filesize);
    fszDisplayElement(exifclass,"Image Format",auditArrayImage.filetype);
    fszDisplayElement(exifclass,"Camera Make",auditArrayImage.make);
    fszDisplayElement(exifclass,"Camera Model",auditArrayImage.model);
    fszDisplayElement(exifclass,"Sensor",auditArrayImage.sensor);
    fszDisplayElement(exifclass,"Serial",auditArrayImage.cameraserial);
    fszDisplayElement(exifclass,"EXIF Version",auditArrayImage.exifversion);
    fszDisplayElement(exifclass,"Manufacture Date",auditArrayImage.mandate);
    fszDisplayElement(exifclass,"Shutter Count",auditArrayImage.shuttercount);
    fszDisplayElement(exifclass,"Information Field",auditArrayImage.infofield);
    fszDisplayElement(exifclass,"Source",auditArrayImage.source);
    fszDisplayElement(exifclass,"Firmware Version",auditArrayImage.firmware);
    fszDisplayElement(exifclass,"Rating",auditArrayImage.rating);
  
    exifclass = "exiflens";
    label = "Lens Make";
    fszDisplayElement(exifclass,"Lens Make",auditArrayImage.lensmake);
    fszDisplayElement(exifclass,"Lens Model",auditArrayImage.lensmodel);
    fszDisplayElement(exifclass,"Lens Serial",auditArrayImage.lensserial);
  
    exifclass = "exifshoot";
    fszDisplayElement(exifclass,"Shutter Speed",auditArrayImage.shutterspeed);
    fszDisplayElement(exifclass,"Aperture",auditArrayImage.aperture);
    fszDisplayElement(exifclass,"ISO",auditArrayImage.iso);
    fszDisplayElement(exifclass,"Exposure Compensation",auditArrayImage.expcomp);
    fszDisplayElement(exifclass,"Focal Length",auditArrayImage.focallength);
    fszDisplayElement(exifclass,"(35mm format)",auditArrayImage.lens35mm);
    fszDisplayElement(exifclass,"Picture Mode",auditArrayImage.picturemode);
    fszDisplayElement(exifclass,"Advanced Filter",auditArrayImage.advancedfilter);
    fszDisplayElement(exifclass,"Scene Types",auditArrayImage.scenetypes);
    fszDisplayElement(exifclass,"Photometry",auditArrayImage.photometry);
    fszDisplayElement(exifclass,"Exposure Mode",auditArrayImage.exposuremode);
    fszDisplayElement(exifclass,"Image Timestamp",auditArrayImage.timestamp);
    fszDisplayElement(exifclass,"Blur Warning",auditArrayImage.blurwarning);
    fszDisplayElement(exifclass,"Focus Warning",auditArrayImage.focuswarning);
    fszDisplayElement(exifclass,"Exposure Warning",auditArrayImage.exposurewarning);
    fszDisplayElement(exifclass,"Crop Mode",auditArrayImage.cropmode);
    if (typeof auditArrayImage.orientation !== 'undefined') {
       fszDisplayElement(exifclass,"Orientation",auditArrayImage.orientorig+" ("+auditArrayImage.orientation+")");
    }
    fszDisplayElement(exifclass,"Orientation",auditArrayImage.orientorigx);
    fszDisplayElement(exifclass,"Drive Mode",auditArrayImage.drivemode);
    fszDisplayElement(exifclass,"Drive Speed",auditArrayImage.drivespeed);
    fszDisplayElement(exifclass,"Sequence Number",auditArrayImage.sequence);
    fszDisplayElement(exifclass,"Brightness Value",auditArrayImage.brightness);
  
    exifclass = "exiforigin";
    fszDisplayElement(exifclass,"Artist",auditArrayImage.artist);
    fszDisplayElement(exifclass,"Copyright",auditArrayImage.copyright);
  
    if (makerNotes == 1) {
    exifclass = "exifiq";
    fszDisplayElement(exifclass,"Image File Type",imagetype);
    if (imagetype == "JPG") {
       fszDisplayElement(exifclass,"Image Size",auditArrayImage.imagesize);
       fszDisplayElement(exifclass,"Image Quality",auditArrayImage.imagequality);
    } else if (imagetype == "RAF") {
       fszDisplayElement(exifclass,"Raw Size",auditArrayImage.rawsize);
       fszDisplayElement(exifclass,"Raw Recording",auditArrayImage.rawrecording);
    }
  
    fszDisplayElement(exifclass,"Film Simulation",auditArrayImage.filmsimulation);
    fszDisplayElement(exifclass,"Grain Effect",auditArrayImage.graineffect);
    fszDisplayElement(exifclass,"Grain Size",auditArrayImage.grainsize);
    fszDisplayElement(exifclass,"BW Warm/Cool",auditArrayImage.bwwarmcool);
    fszDisplayElement(exifclass,"BW Green/Magenta",auditArrayImage.bwgreenmagenta);
    fszDisplayElement(exifclass,"Color Chrome",auditArrayImage.colorchrome);
    fszDisplayElement(exifclass,"Color Chrome FX",auditArrayImage.colorchromefx);
    fszDisplayElement(exifclass,"Clarity",auditArrayImage.clarity);
    fszDisplayElement(exifclass,"White Balance",auditArrayImage.whitebalance);
    fszDisplayElement(exifclass,"White Balance Fine Tune",auditArrayImage.whitebalanceft);
    fszDisplayElement(exifclass,"Custom White Balance",auditArrayImage.wbcustom);
    fszDisplayElement(exifclass,"Dynamic Range",auditArrayImage.dynamicrange);
    fszDisplayElement(exifclass,"D Range Priority",auditArrayImage.drangepriority);
    fszDisplayElement(exifclass,"Highlight Tone",auditArrayImage.highlight);
    fszDisplayElement(exifclass,"Shadow Tone",auditArrayImage.shadow);
    fszDisplayElement(exifclass,"Color",auditArrayImage.color);
    fszDisplayElement(exifclass,"Noise Reduction",auditArrayImage.noisereduction);
    fszDisplayElement(exifclass,"Sharpness",auditArrayImage.sharpness);
    fszDisplayElement(exifclass,"Lens Modulation Optimizer",auditArrayImage.lmo);
    fszDisplayElement(exifclass,"Color Space",auditArrayImage.colorspace);
    }
  
    if (makerNotes == 1) {
    exifclass = "exifaf";
    fszDisplayElement(exifclass,"Faces Detected",auditArrayImage.faces);
    fszDisplayElement(exifclass,"Focus Mode",auditArrayImage.focusmode);
    fszDisplayElement(exifclass,"Pre AF",auditArrayImage.preaf);
    fszDisplayElement(exifclass,"AF Mode",auditArrayImage.afmode);
    if (auditArrayImage.pointsize) {
       fszDisplayElement(exifclass,"Point Size",auditArrayImage.pointsize);
    }
    if (auditArrayImage.zonesize) {
       fszDisplayElement(exifclass,"Zone Size",auditArrayImage.zonesize);
    }
    fszDisplayElement(exifclass,"AF-C Set",auditArrayImage.afcset);
    fszDisplayElement(exifclass," - Tracking Sensitivity",auditArrayImage.afcts);
    fszDisplayElement(exifclass," - Speed Tracking Sensitivity",auditArrayImage.afcsts);
    fszDisplayElement(exifclass," - Zone",auditArrayImage.afczone);
    fszDisplayElement(exifclass,"AF-C Priority",auditArrayImage.afcpriority);
    fszDisplayElement(exifclass,"AF-S Priority",auditArrayImage.afspriority);
    }
  
    if (makerNotes == 1) {
    exifclass = "exifsht";
    fszDisplayElement(exifclass,"Shutter Type",auditArrayImage.shuttertype);
    fszDisplayElement(exifclass,"Flicker Reduction",auditArrayImage.flicker);
    fszDisplayElement(exifclass,"IS Type",auditArrayImage.istype);
    fszDisplayElement(exifclass,"IS Mode",auditArrayImage.ismode);
    }
  
    if (makerNotes == 1) {
    exifclass = "exifflash";
    fszDisplayElement(exifclass,"Flash",auditArrayImage.flash);
    fszDisplayElement(exifclass,"Flash Mode",auditArrayImage.flashmode);
    fszDisplayElement(exifclass,"Flash Exposure Comp",auditArrayImage.flashcomp);
    }
  
  }
  
  ////////////////////////////////////////////////////////////////////////
  // Display a metadata element
  ////////////////////////////////////////////////////////////////////////
  function fszDisplayElement(exifclass,label,value) {
    if (typeof value !== 'undefined') {
       var mdlclass = "fsz".concat(exifclass);
       var mdltable = document.getElementById(mdlclass);
       var mdlrow   = mdltable.insertRow(-1);
       var mdlcell1 = mdlrow.insertCell(0);
       var mdlcell2 = mdlrow.insertCell(1);
       mdlcell1.innerHTML = label;
       mdlcell2.innerHTML = value;
    }
  }
  

  

////////////////////////////////////////////////////////////////////////
// Display Exif block
////////////////////////////////////////////////////////////////////////
function exifDisplay(tagSet) {

    var divNode = document.getElementById("exifScreens");
    var div5    = document.createElement("div");
    div5.id     = "exifBlock";
    div5.classList.add("column");
    div5.classList.add("exifBlock");
    div5.innerHTML = `<div id=exifBlk>
        <div id="exifblk1" class="exifblk1">
          <table id="exifTab" class="exifTab"></table>
        </div>
    </div>`;
    divNode.appendChild(div5);
  
    var exifTable = document.getElementById("exifTab");
    exifTable.style.textAlign = "left";
    divNode.style.display     = "block";
  
  // Single click on EXIF
    var exifID = document.getElementById("exifBlock");
    exifID.addEventListener("click", function() {
       exifStatus = 0;
       divNode.removeChild(exifID);
       divNode.style.display = "none";
    });
  
    function generateTableHead(table) {
      let row   = table.insertRow();
      row.style.height = "50px";
      row.style.backgroundColor = "#b0b8b2";
      let cell1 = row.insertCell();
      cell1.innerHTML = "Class";
      cell1.style.fontWeight = 'bold';
      let cell2 = row.insertCell();
      cell2.innerHTML = "Tag ID";
      cell2.style.fontWeight = 'bold';
      let cell3 = row.insertCell();
      cell3.innerHTML = "Description";
      cell3.style.fontWeight = 'bold';
      let cell4 = row.insertCell();
      cell4.innerHTML = "Type";
      cell4.style.fontWeight = 'bold';
      let cell5 = row.insertCell();
      cell5.innerHTML = "Count";
      cell5.style.fontWeight = 'bold';
      let cell6 = row.insertCell();
      cell6.innerHTML = "Raw Data";
      cell6.style.fontWeight = 'bold';
    }
  
    let table = document.querySelector("table");
    function generateTable(table, data, tagClass) {
      for (let key of Object.keys(data).sort()) {
        if (typeof data[key].val !== 'undefined') {
          if (tagClass == data[key].class) {
             let row  = table.insertRow();
             row.insertCell().innerHTML = data[key].class;
             row.insertCell().innerHTML = key;
             row.insertCell().innerHTML = validTags[key];
             row.insertCell().innerHTML = data[key].type+"("+tagTypes[data[key].type]+")";
             row.insertCell().innerHTML = data[key].count;
             let val = data[key].val;
             if (val.length > 64) {
                val = val.trim();
                if (val.length > 64) {
                   val = "";
                }
                console.log(key+" : "+val+" : "+val.length);
             }
             row.insertCell().innerHTML = val;
             table.rows[0].cells[5].width = "400px";
          }
        }
      }
    }
  
    generateTableHead(exifTable);
    generateTable(exifTable, tagSet, "IFD0");
    generateTableHead(exifTable);
    generateTable(exifTable, tagSet, "IFD1");
    generateTableHead(exifTable);
    generateTable(exifTable, tagSet, "ExifIFD");
    generateTableHead(exifTable);
    generateTable(exifTable, tagSet, "FUJIFILM");
  }
  
////////////////////////////////////////////////////////////////////////
// Display image with focus points 
////////////////////////////////////////////////////////////////////////
function displayFullCanvas (newImage,auditArrayImage) {

    document.getElementById("hdrCont").style.display="none";
    var screenDivID = document.getElementById("screenDiv");
    var bc = document.getElementById("fullscreen");
    screenDivID.removeChild(bc);
    screenDivID.innerHTML = `<canvas id="fullscreen"></canvas>`;
    var bc = document.getElementById("fullscreen");
    var m1 = document.getElementById("menuContainer");
    var m2 = document.getElementById("contextMenu");
    m1.removeChild(m2);
    m1.innerHTML = `<div id="contextMenu" class="menu">
        <ul class="menu-options">
          <li class="menu-option">Full Screen</li>
          <li class="menu-option">Metadata</li>
          <li class="menu-option">EXIF</li>
          <li class="menu-option">Autofocus</li>
          <li class="menu-option">Refresh</li>
          <li class="menu-option">Help</li>
        </ul></div>`;
    var screenWidth = modalWidth;
    var imageWidth  = modalWidth-300;
    var imagetype   = auditArrayImage.imagetype;
    var orientation = auditArrayImage.orientation;
    var orient      = auditArrayImage.orientorig;
    var imagewidth  = auditArrayImage.imagewidth;
    var imageheight = auditArrayImage.imageheight;
    var fpos        = auditArrayImage.fpos;
    var fposs       = auditArrayImage.fposs;
    var cropArea1   = auditArrayImage.cropArea1;
    var cropArea2   = auditArrayImage.cropArea2;
    var focuspixelx = auditArrayImage.focuspixelx;
    var focuspixely = auditArrayImage.focuspixely;
    var pointsize   = auditArrayImage.pointsize;
    var zonesize    = auditArrayImage.zonesize;
    var imagename   = auditArrayImage.filename;
    var aftext      = auditArrayImage.aftext;
    var metawidth   = auditArrayImage.metawidth;
  
    if (typeof orient === 'undefined') {
       imagewidth  = newImage.width;
       imageheight = newImage.height;
       orient = 1;
       if (imageheight > imagewidth) {
          orient = 6;
          imagewidth  = newImage.height;
          imageheight = newImage.width;
       }
    }
  
    var ctx = bc.getContext("2d");
    ctx.clearRect(0, 0, bc.width, bc.height);
    var ctxwidth, ctxheight;
    var lineWidth = 2;
    ctxheight = modalHeight;
    if (4 < orient && orient < 9) {
       ctxwidth  = ctxheight * (imageheight / imagewidth);
    } else {
       ctxwidth  = ctxheight * (imagewidth / imageheight);
    }
    bc.style.marginLeft = "0px";
    var marginLeft = 0;
    if ((4 < orient && orient < 9)||(ctxwidth == ctxheight)) {
       if (ctxwidth < (modalWidth - 365)) {
          marginLeft = ((modalWidth - 365) - ctxwidth) / 2;
          bc.style.marginLeft = marginLeft+"px";
       }
    } else {
       if (ctxwidth > (modalWidth - 365)) {
          ctxwidth  = (modalWidth - 365);
          ctxheight = ctxwidth * (imageheight / imagewidth);
       }
    }
    bc.width  = ctxwidth;
    bc.height = ctxheight;
  
  // Width of available screen = modalWidth
  // Width of canvas           = bc.width
  // If available width for metadata > 350 then increase metadata width
    if ((modalWidth - bc.width) > 350) {
       var metadataWidth = modalWidth - bc.width ;
       document.getElementById("metaScreens").style.width = metadataWidth+"px"; 
       document.getElementById("metaScreens").style.marginLeft = marginLeft+bc.width+"px"; 
    }
    ctx.drawImage(newImage, 0, 0, ctxwidth, ctxheight);
  
  // Show faces
    if (afStatus == 0) {
       if (typeof fposs !== 'undefined') {
          ctx.beginPath();
          var faces = fposs.length / 4;
          var i;
          for (i=0;i<faces;i++) {
              if (orient == 1 || orient == 2) {
                 // Landscape
                 var d1 = (ctxheight * ( fposs[0] / imageheight));
                 var d2 = (ctxwidth  * ( fposs[1] / imagewidth));
                 var d3 = (ctxheight * ( fposs[2] / imageheight));
                 var d4 = (ctxwidth  * ( fposs[3] / imagewidth));
                 ctx.moveTo(d1, d2); ctx.lineTo(d1, d4); ctx.lineTo(d3, d4);
                 ctx.lineTo(d3, d2); ctx.lineTo(d1, d2);
              } else if (orient == 3 || orient == 4) {
                 // Landscape 180
                 var d1 = ctxWidth - (ctxheight * ( fposs[0] / imageheight));
                 var d2 = ctxHeight - (ctxwidth  * ( fposs[1] / imagewidth));
                 var d3 = ctxWidth - (ctxheight * ( fposs[2] / imageheight));
                 var d4 = ctxHeight - (ctxwidth  * ( fposs[3] / imagewidth));
                 ctx.moveTo(d1, d2); ctx.lineTo(d1, d4); ctx.lineTo(d3, d4);
                 ctx.lineTo(d3, d2); ctx.lineTo(d1, d2);
              } else if (orient == 5 || orient == 6) {
                 // Portrait 90
                 var d1 = (ctxheight * ( fposs[0] / imagewidth));
                 var d2 = ctxWidth - (ctxwidth * ( fposs[1] / imageheight));
                 var d3 = (ctxheight * ( fposs[2] / imagewidth));
                 var d4 = ctxWidth - (ctxwidth * ( fposs[3] / imageheight));
                 ctx.moveTo(d2, d1); ctx.lineTo(d4, d1); ctx.lineTo(d4, d3);
                 ctx.lineTo(d2, d3); ctx.lineTo(d2, d1);
              } else if (orient == 7 || orient == 8) {
                 // Portrait 270
                 var d1 = ctxheight - (ctxheight * ( fposs[0] / imagewidth));
                 var d2 = (ctxwidth * ( fposs[1] / imageheight));
                 var d3 = ctxheight - (ctxheight * ( fposs[2] / imagewidth));
                 var d4 = (ctxwidth * ( fposs[3] / imageheight));
                 ctx.moveTo(d2, d1); ctx.lineTo(d4, d1); ctx.lineTo(d4, d3);
                 ctx.lineTo(d2, d3); ctx.lineTo(d2, d1);
              }
          }
          ctx.lineWidth   = lineWidth;
          ctx.strokeStyle = "white";
          ctx.stroke();
          ctx.closePath();
       }
     
       if (typeof fpos !== 'undefined') {
          ctx.beginPath();
          var faces = fpos.length / 4;
          var i;
          for (i=0;i<faces;i++) {
              if (orient == 1 || orient == 2) {
                 // Landscape
                 var d1 = (ctxheight * ( fpos[(i * 4)] / imageheight));
                 var d2 = (ctxwidth * ( fpos[(i * 4) + 1] / imagewidth));
                 var d3 = (ctxheight * ( fpos[(i * 4) + 2] / imageheight));
                 var d4 = (ctxwidth * ( fpos[(i * 4) + 3] / imagewidth));
                 ctx.moveTo(d1, d2); ctx.lineTo(d1, d4); ctx.lineTo(d3, d4);
                 ctx.lineTo(d3, d2); ctx.lineTo(d1, d2);
                 ctx.fillStyle = "yellow";
                 ctx.font = "20px Arial";
                 ctx.fillText(i+1,(ctxheight * ( fpos[(i * 4)] / imageheight)),(ctxwidth * ( fpos[(i * 4) + 1] / imagewidth)));
              } else if (orient == 3 || orient == 4) {
                 // Landscape 180
                 var d1 = ctxwidth - (ctxheight * ( fpos[(i * 4)] / imageheight));
                 var d2 = ctxheight - (ctxwidth * ( fpos[(i * 4) + 1] / imagewidth));
                 var d3 = ctxwidth - (ctxheight * ( fpos[(i * 4) + 2] / imageheight));
                 var d4 = ctxheight - (ctxwidth * ( fpos[(i * 4) + 3] / imagewidth));
                 ctx.moveTo(d1, d2); ctx.lineTo(d1, d4); ctx.lineTo(d3, d4);
                 ctx.lineTo(d3, d2); ctx.lineTo(d1, d2);
                 ctx.fillStyle = "yellow";
                 ctx.font = "20px Arial";
                 ctx.fillText(i+1,ctxwidth-(ctxheight * ( fpos[(i * 4)] / imageheight)),ctxheight-(ctxwidth * ( fpos[(i * 4) + 1] / imagewidth)));
              } else if (orient == 5 || orient == 6) {
                 // Portrait 90
                 var d1 = (ctxheight * ( fpos[(i * 4)] / imagewidth));
                 var d2 = ctxwidth - (ctxwidth * ( fpos[(i * 4) + 1] / imageheight));
                 var d3 = (ctxheight * ( fpos[(i * 4) + 2] / imagewidth));
                 var d4 = ctxwidth - (ctxwidth * ( fpos[(i * 4) + 3] / imageheight));
                 ctx.moveTo(d2, d1); ctx.lineTo(d4, d1); ctx.lineTo(d4, d3);
                 ctx.lineTo(d2, d3); ctx.lineTo(d2, d1);
              } else if (orient == 7 || orient == 8) {
                 // Portrait 270
                 var d1 = ctxheight - (ctxheight * ( fpos[(i * 4)] / imagewidth));
                 var d2 = (ctxwidth * ( fpos[(i * 4) + 1] / imageheight));
                 var d3 = ctxheight - (ctxheight * ( fpos[(i * 4) + 2] / imagewidth));
                 var d4 = (ctxwidth * ( fpos[(i * 4) + 3] / imageheight));
                 ctx.moveTo(d2, d1); ctx.lineTo(d4, d1); ctx.lineTo(d4, d3);
                 ctx.lineTo(d2, d3); ctx.lineTo(d2, d1);
              }
          }
          ctx.lineWidth   = lineWidth;
          ctx.strokeStyle = "yellow";
          ctx.stroke();
          ctx.closePath();
       }
     
  // Show focus point (single or zone) if faces not selected
       var drawnpixelx,drawnpixelx,pointmultiple;
       if (typeof fposs === 'undefined') {
          if (orient == 1 || orient == 2) {
             // Landscape
             drawnpixely = (ctxheight * ( focuspixely / imageheight));
             drawnpixelx = (ctxwidth * ( focuspixelx / imagewidth));
             pointmultiple = 6;
          } else if (orient == 3 || orient == 4) {
             // Landscape 180
             drawnpixely = ctxwidth - (ctxheight * ( focuspixely / imageheight));
             drawnpixelx = ctxheight - (ctxwidth * ( focuspixelx / imagewidth));
             pointmultiple = 6;
          } else if (orient == 5 || orient == 6) {
             // Portrait 90
             drawnpixelx = ctxheight - (imagewidth - focuspixely) * (ctxheight / imagewidth);
             drawnpixely = ctxwidth - (focuspixelx) * (ctxwidth / imageheight);
             pointmultiple = 9;
          } else if (orient == 7 || orient == 8) {
             // Portrait 270
             drawnpixelx = (imagewidth - focuspixely) * (ctxheight / imagewidth);
             drawnpixely = (focuspixelx) * (ctxwidth / imageheight);
             pointmultiple = 9;
          }
          if (typeof pointsize == 'undefined') {
             focusPointx(ctx,drawnpixelx,drawnpixely,lineWidth,screenWidth);
          } else if (pointsize == 0) {
             focusPointx(ctx,drawnpixelx,drawnpixely,lineWidth,screenWidth);
          } else {
             focusPoint(ctx,drawnpixelx,drawnpixely,lineWidth,(ctxwidth/480)*pointmultiple*pointsize);
          }
       }
    }
  
  // Show digital tele-converter area
    if (typeof cropArea1 !== 'undefined') {
       ctx.beginPath();
       if (orient == 1 || orient == 2) {
          // Landscape
          var d1 = (ctxheight * ( cropArea1[0] / imageheight));
          var d2 = (ctxwidth  * ( cropArea1[1] / imagewidth));
          var d3 = (ctxheight * ( ( cropArea1[0] + cropArea2[0] ) / imageheight));
          var d4 = (ctxwidth  * ( ( cropArea1[1] + cropArea2[1] ) / imagewidth));
          ctx.moveTo(d1, d2); ctx.lineTo(d1, d4); ctx.lineTo(d3, d4);
          ctx.lineTo(d3, d2); ctx.lineTo(d1, d2);
       } else if (orient == 3 || orient == 4) {
          // Landscape 180
          var d1 = ctxWidth - (ctxheight * ( cropArea1[0] / imageheight));
          var d2 = ctxHeight - (ctxwidth  * ( cropArea1[1] / imagewidth));
          var d3 = ctxWidth - (ctxheight * ( ( cropArea1[0] + cropArea2[0] ) / imageheight));
          var d4 = ctxHeight - (ctxwidth  * (  ( cropArea1[1] + cropArea2[1] ) / imagewidth));
          ctx.moveTo(d1, d2); ctx.lineTo(d1, d4); ctx.lineTo(d3, d4);
          ctx.lineTo(d3, d2); ctx.lineTo(d1, d2);
       } else if (orient == 5 || orient == 6) {
          // Portrait 90
          var d1 = (ctxheight * ( cropArea1[0] / imagewidth));
          var d2 = ctxWidth - (ctxwidth * ( cropArea1[1] / imageheight));
          var d3 = (ctxheight * ( ( cropArea1[0] + cropArea2[0] ) / imagewidth));
          var d4 = ctxWidth - (ctxwidth * ( ( cropArea1[1] + cropArea2[1] ) / imageheight));
          ctx.moveTo(d2, d1); ctx.lineTo(d4, d1); ctx.lineTo(d4, d3);
          ctx.lineTo(d2, d3); ctx.lineTo(d2, d1);
       } else if (orient == 7 || orient == 8) {
          // Portrait 270
          var d1 = ctxheight - (ctxheight * ( cropArea1[0] / imagewidth));
          var d2 = (ctxwidth * ( cropArea1[1] / imageheight));
          var d3 = ctxheight - (ctxheight * ( ( cropArea1[0] + cropArea2[0] ) / imagewidth));
          var d4 = (ctxwidth * ( ( cropArea1[1] + cropArea2[1] ) / imageheight));
          ctx.moveTo(d2, d1); ctx.lineTo(d4, d1); ctx.lineTo(d4, d3);
          ctx.lineTo(d2, d3); ctx.lineTo(d2, d1);
       }
       ctx.lineWidth   = lineWidth;
       ctx.strokeStyle = "blue";
       ctx.stroke();
       ctx.closePath();
    }
  
  //console.log("orient "+orient);
  //console.log("imagewidth  %s imageheight %s ",imagewidth,imageheight);
  //console.log("modalWidth  %s modalHeight %s ",modalWidth,modalHeight);
  //console.log("ctxwidth    %s ctxheight   %s ",ctxwidth,ctxheight);
  //console.log("bc.width    %s bc.height   %s ",bc.width,bc.height);
  //console.log("focuspixelx %s focuspixely %s ",focuspixelx,focuspixely);
  //console.log("drawnpixelx %s drawnpixely %s ",drawnpixelx,drawnpixely);
  //console.log("bc.style.marginLeft %s ",bc.style.marginLeft);
  
    var canvasx      = canvasy = 0;
    var first_mousex = first_mousey = 0;
    var prev_mousex  = prev_mousey = 0;
    var mousex       = mousey      = 0;
    var cropwidth    = cropheight  = 0;
    var mousedown    = false;
     
    function mouseDown(e) {
       if (e.button == 0) {
          first_mousex = parseInt(e.clientX - canvasx) - marginLeft;
          first_mousey = parseInt(e.clientY - canvasy);
          prev_mousex  = first_mousex;
          prev_mousey  = first_mousey;
          if (auditArrayImage.imagetype != "HIF") {
            mousedown    = true;
          }
  // console.log(auditArrayImage.imagetype+" Down: first_mousex "+first_mousex+" first_mousey "+first_mousey+" prev_mousex "+prev_mousex+" prev_mousey "+prev_mousey);
      }
    }
    bc.addEventListener('mousedown', function(e) { mouseDown(e) });
       
    function mouseUp(e) {
       if (mousedown) {
  // console.log("Up: first_mousex "+first_mousex+" first_mousey "+first_mousey+" prev_mousex "+prev_mousex+" prev_mousey "+prev_mousey+" cropwidth "+cropwidth+" cropheight "+cropheight);
         if (4 < orient && orient < 9) {
            var new_mousex     = first_mousex * imageheight / ctxwidth;
            var new_mousey     = first_mousey * imageheight / ctxwidth;
            var new_cropwidth  = cropwidth    * imageheight / ctxwidth;
            var new_cropheight = cropheight   * imageheight / ctxwidth;
            var new_ctxwidth   = ctxheight    * (new_cropwidth / new_cropheight);
         } else {
            var new_mousex     = first_mousex * imagewidth / ctxwidth;
            var new_mousey     = first_mousey * imagewidth / ctxwidth;
            var new_cropwidth  = cropwidth    * imagewidth / ctxwidth;
            var new_cropheight = cropheight   * imagewidth / ctxwidth;
            var new_ctxwidth   = ctxheight    * (new_cropwidth / new_cropheight);
         }
         if (cropwidth > 0 && cropheight > 0) {
            ctx.clearRect(0, 0, bc.width, bc.height);
            ctx.drawImage(newImage, new_mousex, new_mousey, new_cropwidth, new_cropheight, 0, 0, new_ctxwidth, ctxheight);
   // console.log("Up: first_mousex "+first_mousex+" first_mousey "+first_mousey+" cropwidth "+cropwidth+" cropheight "+cropheight);
         }
         mousedown = false;
       }
    }
    bc.addEventListener('mouseup', function(e) { mouseUp(e) });
     
    function mouseMove(e) {
       mousex = parseInt(e.clientX - canvasx) - marginLeft;
       mousey = parseInt(e.clientY - canvasy);
       if (mousedown) {
         ctx.clearRect(0, 0, bc.width, bc.height);
         ctx.drawImage(newImage, 0, 0, ctxwidth, ctxheight);
         ctx.beginPath();
         if (mousex < first_mousex) { mousex = first_mousex ; }
         if (mousey < first_mousey) { mousey = first_mousey ; }
         if (mousex < prev_mousex) { mousex = prev_mousex ; }
         if (mousey < prev_mousey) { mousey = prev_mousey ; }
         if (mousey > prev_mousey) {
            if (4 < orient && orient < 9) {
               prev_mousey = mousey;
               cropheight  = prev_mousey - first_mousey;
               cropwidth   = cropheight * imageheight / imagewidth;
               prev_mousex = first_mousex + cropwidth;
            } else {
               prev_mousey = mousey;
               cropheight  = prev_mousey - first_mousey;
               cropwidth   = cropheight * imagewidth / imageheight;
               prev_mousex = first_mousex + cropwidth;
            }
         } else {
            if (4 < orient && orient < 9) {
               prev_mousex = mousex;
               cropwidth   = prev_mousex - first_mousex;
               cropheight  = cropwidth * imagewidth / imageheight;
               prev_mousey = first_mousey + cropheight;
            } else {
               prev_mousex = mousex;
               cropwidth   = prev_mousex - first_mousex;
               cropheight  = cropwidth * imageheight / imagewidth;
               prev_mousey = first_mousey + cropheight;
            }
         }
         ctx.rect(first_mousex, first_mousey, cropwidth, cropheight);
         ctx.strokeStyle = 'black';
         ctx.lineWidth = 2;
         ctx.stroke();
       }
    }
    bc.addEventListener('mousemove', function(e) { mouseMove(e) });
  
    const menuID      = document.getElementById("contextMenu");
    const menu        = document.querySelector(".menu");
    const menuOptions = document.querySelectorAll(".menu-option");
    let menuVisible   = false;
  
    const toggleMenu = command => {
      menu.style.display = command === "show" ? "block" : "none";
      menuVisible = !menuVisible;
    };
  
    const setPosition = ({ top, left }) => {
      if (top > (bc.height - 254)) { top = bc.height - 254 ; }
      menu.style.left = `${left}px`;
      menu.style.top  = `${top}px`;
      toggleMenu("show");
    };
  
    window.addEventListener("click", e => {
      if (menuVisible) toggleMenu("hide");
    });
  
    menuOptions.forEach(function(menuOption) {
      menuOption.addEventListener("click", e => {
        let func = e.target.innerHTML;
        console.log("Function selected was : "+func);
        if (func == "Metadata") {
           if (keyStatus == 0) {
              if (metaStatus == 1) {
                 metaStatus = 2;
                 document.getElementById("metaBlock").style.display  = "none";
              } else if (metaStatus == 2) {
                 metaStatus = 1;
                 document.getElementById("metaBlock").style.display  = "block";
              }
           }
        } else if (func == "Autofocus") {
           if (keyStatus == 0) {
              if (afStatus == 0) { afStatus = 1;
              } else { afStatus = 0; }
              var imageType = inputTypes[0];
              if (imageType == "RAF") { functionFullSizeRAF(); } else if (imageType == "HIF") { functionFullSizeHIF(); } else { functionFullSizeJPG(); }
           }
        } else if (func == "EXIF") {
           if (exifStatus == 1) {
              exifStatus = 0;
              document.getElementById("exifScreens").removeChild(document.getElementById("exifBlock"));
              document.getElementById("exifScreens").style.display = "none";
           } else {
              exifStatus = 1;
              exifDisplay(tagSet);
           }
        } else if (func == "Refresh") {
           if (keyStatus == 0) {
              var imageType = inputTypes[0];
              if (imageType == "RAF") { functionFullSizeRAF(); } else if (imageType == "HIF") { functionFullSizeHIF(); } else { functionFullSizeJPG(); }
           }
        } else if (func == "Help") {
           if (myWindow == null || myWindow.closed) {
              myWindow = window.open("https://www.greybeard.pictures/common/help", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=10,left=100,width=800,height=800");
           } else {
              myWindow.close();
           }
        } else if (func == "Full Screen") {
           if (keyStatus == 0) {
              keyStatus = 3;
              totalImage();
           }
        }
      })
    });
  
    window.addEventListener("contextmenu", e => {
      e.preventDefault();
      const origin = {
        left  : e.pageX,
        top   : e.pageY
      };
      setPosition(origin);
      return false;
    });
  
  }
  
  ////////////////////////////////////////////////////////////////////////
  // Display focus point
  ////////////////////////////////////////////////////////////////////////
  function focusPointx (ctx,drawnpixelx,drawnpixely,lineWidth,screenWidth) {
  //  Draw target symbol for zone or wide/tracking
    ctx.beginPath();
    var lineSize   = 15 * screenWidth / 750;
    var circleSize = 10 * screenWidth / 750;
    ctx.moveTo(drawnpixely, drawnpixelx - lineSize);
    ctx.lineTo(drawnpixely, drawnpixelx + lineSize);
    ctx.moveTo(drawnpixely + lineSize, drawnpixelx);
    ctx.lineTo(drawnpixely - lineSize, drawnpixelx);
    ctx.moveTo(drawnpixely, drawnpixelx);
    ctx.arc(drawnpixely, drawnpixelx, circleSize, 0, 2 * Math.PI);
    ctx.lineWidth   = lineWidth;
    ctx.strokeStyle = "#FF0000";
    ctx.stroke();
    ctx.closePath();
  }
  
  function focusPoint (ctx,drawnpixelx,drawnpixely,lineWidth,fsize) {
  //  Draw square for single point
    ctx.beginPath();
    ctx.moveTo(drawnpixely, drawnpixelx - fsize);
    ctx.lineTo(drawnpixely, drawnpixelx + fsize);
    ctx.moveTo(drawnpixely - fsize, drawnpixelx);
    ctx.lineTo(drawnpixely + fsize, drawnpixelx);
    ctx.moveTo(drawnpixely - fsize, drawnpixelx - fsize);
  
    ctx.lineTo(drawnpixely - fsize, drawnpixelx + fsize);
    ctx.lineTo(drawnpixely + fsize, drawnpixelx + fsize);
    ctx.lineTo(drawnpixely + fsize, drawnpixelx - fsize);
    ctx.lineTo(drawnpixely - fsize, drawnpixelx - fsize);
  
    ctx.lineWidth   = lineWidth;
    ctx.strokeStyle = "#FF0000";
    ctx.stroke();
    ctx.closePath();
  }
  
  ////////////////////////////////////////////////////////////////////////
  // Display full size image for JPG file
  ////////////////////////////////////////////////////////////////////////
  var displayFullSizeJPG = function() {
    return function() {
      functionFullSizeJPG();
    }
  }
  
  ////////////////////////////////////////////////////////////////////////
  // Display full size image for RAF file
  ////////////////////////////////////////////////////////////////////////
  var displayFullSizeRAF = function () {
    return function() {
      functionFullSizeRAF();
    }
  }
  
  ////////////////////////////////////////////////////////////////////////
  // Create HTML structure for metadata
  ////////////////////////////////////////////////////////////////////////
  function columnmetadataHTML(divID,divPrefix,divNode) {
  
    var div3 = document.createElement("div");
    div3.id = divID;
    div3.classList.add("column");
    div3.classList.add("metadata");
    div3.innerHTML = `<div id=`+divPrefix+`exifBlk1 class="column1">
        <div id="`+divPrefix+`Column" class="exifblk">
          <div class="`+divPrefix+`columnhdr" id="`+divPrefix+`exifcolumnhdr">  </div> <table class="`+divPrefix+`exif" id="`+divPrefix+`exifcolumn"></table>
        </div>
    </div>`;
    divNode.appendChild(div3);
  
  }
  
  ////////////////////////////////////////////////////////////////////////
  // Display full size image for RAF file
  ////////////////////////////////////////////////////////////////////////
  function functionFullSizeRAF () {
      keySeq = 0;
      var auditArrayImage=auditArray[0];
      var img = input.files[0];
      var arrayReader = new FileReader();
      arrayReader.onloadend = (function(img) {
        return function(evt) {
          var imageFile = evt.target.result;
          var dataView = new DataView(imageFile);
          var JPGOffset  = dataView.getUint32(84);
          var JPGLength  = dataView.getUint32(88);
          var imageArray = getArrayfromDV(dataView, JPGOffset, JPGLength);
          var imageBlob  = new Blob([imageArray], {type : 'image/jpeg'});
          url = URL.createObjectURL(imageBlob);
          var newImage = new Image;
          newImage.onload = function() {
            displayFullCanvas (newImage,auditArrayImage);
            var myModald = document.getElementById("myModal");
            if (typeof myModald == 'undefined') {
               console.log("functionFullSizeRAF myModald undefined");
            } else {
               myModald.style.display = "block";
            }
          }
          newImage.src = url;
        }
      })(img);
      arrayReader.readAsArrayBuffer(img);
  }
  
  ////////////////////////////////////////////////////////////////////////
  // Display full size image for HIF file
  ////////////////////////////////////////////////////////////////////////
  function functionFullSizeHIF () {
      keySeq = 0;
      var auditArrayImage=auditArray[0];
      var img = input.files[0];
      var arrayReader = new FileReader();
      arrayReader.onloadend = (function(img) {
        return function(evt) {
          var imageFile = evt.target.result;
          var dataView = new DataView(imageFile);
          var hifOffset = auditArrayImage.thumbOffset;
          var hifLength = auditArrayImage.thumbLength;
          var imageArray = getArrayfromDV(dataView, hifOffset, hifLength);
          var imageBlob  = new Blob([imageArray], {type : 'image/jpeg'});
          url = URL.createObjectURL(imageBlob);
          var newImage = new Image;
          newImage.onload = function() {
            displayFullCanvas (newImage,auditArrayImage);
            var myModald = document.getElementById("myModal");
            if (typeof myModald == 'undefined') {
               console.log("functionFullSizeRAF myModald undefined");
            } else {
               myModald.style.display = "block";
            }
          }
          newImage.src = url;
        }
      })(img);
      arrayReader.readAsArrayBuffer(img);
  }
  
  ////////////////////////////////////////////////////////////////////////
  // Display full size image for JPG file
  ////////////////////////////////////////////////////////////////////////
  function functionFullSizeJPG() {
    
    keySeq = 0;
    var auditArrayImage=auditArray[0];
    console.log('🪵 ~ file: fuji-exif.js:2055 ~ functionFullSizeJPG ~ auditArrayImage:', auditArrayImage);
    // var img = input.files[0];
    // var newImage = new Image;
    // newImage.onload = function() {
    //   displayFullCanvas (newImage,auditArrayImage);
    //   var myModald = document.getElementById("myModal");
    //   myModald.style.display = "block";
    // }
    // newImage.src = URL.createObjectURL(img);
  }
  
  ////////////////////////////////////////////////////////////////////////
  // Total image - completely fill screen and go into full screen mode
  ////////////////////////////////////////////////////////////////////////
  function totalImage() {
    var imageType = inputTypes[0];
    if (imageType == "RAF") { totalImageRAF(); } else { totalImageJPG(); }
  }
  
  function totalImageJPG() {
    var auditArrayImage=auditArray[0];
    var orient      = auditArrayImage.orientorig;
    var imagewidth  = auditArrayImage.imagewidth;
    var imageheight = auditArrayImage.imageheight;
    var img = input.files[0];
    totalImageHTML();
    var divNode    = document.getElementById("totalImage");
    var newImage = new Image;
    newImage.onload = function() {
      var img = input.files[0];
      var orient      = auditArrayImage.orientorig;
      if (typeof orient === 'undefined') {
         imagewidth  = newImage.width;
         imageheight = newImage.height;
         orient = 1;
         if (imageheight > imagewidth) {
            orient = 6;
            imagewidth  = newImage.height;
            imageheight = newImage.width;
         }
      }
      var myModalsID = document.getElementById("myModals");
      myModalsID.style.display = "none";
      var bc = document.getElementById("totalscreen");
      var ctx = bc.getContext("2d");
      var ctxwidth, ctxheight;
      var lineWidth = 2;
      ctxheight = screen.height;
      if (4 < orient && orient < 9) {
         ctxwidth  = ctxheight * (imageheight / imagewidth);
      } else {
         ctxwidth  = ctxheight * (imagewidth / imageheight);
      }
      bc.width  = ctxwidth;
      bc.height = ctxheight;
      var marginLeft = (screen.width - ctxwidth) / 2;
      bc.style.marginLeft = marginLeft+"px";
      ctx.drawImage(newImage, 0, 0, ctxwidth, ctxheight);
      openFullscreen(divNode);
    }
    newImage.src = URL.createObjectURL(img);
  }
  
  function totalImageRAF() {
    var auditArrayImage=auditArray[0];
    var orient      = auditArrayImage.orientorig;
    var imagewidth  = auditArrayImage.imagewidth;
    var imageheight = auditArrayImage.imageheight;
    var img = input.files[0];
    totalImageHTML();
    var divNode    = document.getElementById("totalImage");
    var arrayReader = new FileReader();
    arrayReader.onloadend = (function(img) {
      return function(evt) {
        var imageFile = evt.target.result;
        var dataView = new DataView(imageFile);
        var JPGOffset  = dataView.getUint32(84);
        var JPGLength  = dataView.getUint32(88);
        var imageArray = getArrayfromDV(dataView, JPGOffset, JPGLength);
        var imageBlob  = new Blob([imageArray], {type : 'image/jpeg'});
        url = URL.createObjectURL(imageBlob);
        var newImage = new Image;
        newImage.onload = function() {
          var img = input.files[0];
          var orient      = auditArrayImage.orientorig;
          if (typeof orient === 'undefined') {
             imagewidth  = newImage.width;
             imageheight = newImage.height;
             orient = 1;
             if (imageheight > imagewidth) {
                orient = 6;
                imagewidth  = newImage.height;
                imageheight = newImage.width;
             }
          }
          var myModalsID = document.getElementById("myModals");
          myModalsID.style.display = "none";
          var bc = document.getElementById("totalscreen");
          var ctx = bc.getContext("2d");
          var ctxwidth, ctxheight;
          var lineWidth = 2;
          ctxheight = screen.height;
          if (4 < orient && orient < 9) {
             ctxwidth  = ctxheight * (imageheight / imagewidth);
          } else {
             ctxwidth  = ctxheight * (imagewidth / imageheight);
          }
          bc.width  = ctxwidth;
          bc.height = ctxheight;
          var marginLeft = (screen.width - ctxwidth) / 2;
          bc.style.marginLeft = marginLeft+"px";
          ctx.drawImage(newImage, 0, 0, ctxwidth, ctxheight);
          openFullscreen(divNode);
        }
        newImage.src = url;
      }
    })(img);
    arrayReader.readAsArrayBuffer(img);
  }
  
  function totalImageHTML() {
  
    var node = document.getElementById("totalImages");
    if (node.hasChildNodes()) {
       while (node.firstChild) {
         node.removeChild(node.firstChild)
       }
    }
  
    var totalImageDiv = document.createElement("div");
    totalImageDiv.id = "totalImage";
    totalImageDiv.className = "totalImage";
    totalImageDiv.innerHTML = `<div id="totalCanvas"><canvas id="totalscreen"></canvas></div>`;
    node.appendChild(totalImageDiv);
  
  // Single click on image
    var totalID = document.getElementById("totalImage");
    totalID.addEventListener("click", function() {
       keyStatus = 0;
       if (document.fullscreenElement) {
          if (document.exitFullscreen) { document.exitFullscreen(); }
          else if (document.mozCancelFullScreen)  { document.mozCancelFullScreen(); }
          else if (document.webkitExitFullscreen) { document.webkitExitFullscreen(); }
          else if (document.msExitFullscreen)     { document.msExitFullscreen(); }
       }
    });
  
  // Right click (prevent contect menu)
    totalID.addEventListener("contextmenu", function(ev) {
      ev.preventDefault();
      return false;
    }, false);
  
  }
  
  function openFullscreen(divNode) {
    if (divNode.requestFullscreen) { divNode.requestFullscreen();
    } else if (divNode.mozRequestFullScreen)    { divNode.mozRequestFullScreen();
    } else if (divNode.webkitRequestFullscreen) { divNode.webkitRequestFullscreen();
    } else if (divNode.msRequestFullscreen)     { divNode.msRequestFullscreen();
    }
  }
  
  ////////////////////////////////////////////////////////////////////////
  // Create HTML for metaScreen Display
  ////////////////////////////////////////////////////////////////////////
  function metaScreenDisplay() {
    var node = document.getElementById("metaScreens");
    var myMetaID;
    if (node.hasChildNodes()) {
       myMetaID = document.getElementById("myMetaID");
       if (myMetaID) {
          node.removeChild(myMetaID);
       }
    }
    var div3 = document.createElement("div");
    div3.id = "myMetaID";
    div3.className = "metaClass";
    node.appendChild(div3);
    var metaID = document.getElementById("myMetaID");
    var auditArrayImage=auditArray[0];
    fszDisplayMetadata(auditArrayImage);
  
  }
  
  function writeAudit() {
    auditArrayImage.session=session;
    auditArrayImage.function="single";
    var json = JSON.stringify(auditArrayImage);
    let xhr = new XMLHttpRequest();
  //$.getJSON("/cgi-enabled/f5.pl", json, function(){auditResponse();});
    let url = "/cgi-enabled/f5.pl";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
       if (xhr.readyState === 4 && xhr.status === 200) {
          console.log("State/status: "+xhr.readyState+" "+xhr.status);
       }
    };
    xhr.send(json);
  
  }
  
  var ImageCountArray = {
    "GFX100S" :  "C",
    "GFX100" :  "C",
    "GFX 50R" :  "B",
    "GFX 50S" :  "B",
    "GFX50S II" :  "C",
    "X-H1"   :  "B",
    "X-H2"   :  "C",
    "X-H2S"   :  "C",
    "X-T1"   :  "A",
    "X-T2"   :  "A",
    "X-T3"   :  "B",
    "X-T4"   :  "C",
    "X-T5"   :  "C",
    "X-Pro2" :  "A",
    "X-Pro3" :  "B",
    "X-T10"  :  "X",
    "X-T20"  :  "B",
    "X-T30"  :  "B",
    "X-T30 II" : "C",
    "X-S10"  :  "C",
    "X-E2S"  :  "X",
    "X-E2"   :  "X",
    "X-E3"   :  "B",
    "X-E4"   :  "C",
    "X100S"  :  "X",
    "X100T"  :  "X",
    "X100F"  :  "X",
    "X100V"  :  "X",
    "X100VI"  :  "C",
    "X-T100" :  "X",
    "X-T200" :  "X",
    "X-A5"   :  "X",
    "X-A7"   :  "X"
  };
  
  var CameraSensorArray = {
    "X-H1"   :  "CMOSIII",
    "X-H2"  :  "CMOS5HR",
    "X-H2S"  :  "CMOS5HS",
    "X-T1"   :  "CMOSII",
    "X-T2"   :  "CMOSIII",
    "X-T3"   :  "CMOSIV",
    "X-T4"   :  "CMOSIV",
    "X-T5"   :  "CMOS5HR",
    "X-Pro2" :  "CMOSIII",
    "X-Pro3" :  "CMOSIV",
    "X-T10"  :  "CMOSII",
    "X-T20"  :  "CMOSIII",
    "X-T30"  :  "CMOSIV",
    "X-S10"  :  "CMOSIV",
    "X-E2S"  :  "CMOSII",
    "X-E2"   :  "CMOSII",
    "X-E3"   :  "CMOSIII",
    "X-E4"   :  "CMOSIV",
    "X100S"  :  "CMOSII",
    "X100T"  :  "CMOSII",
    "X100F"  :  "CMOSIII",
    "X100V"  :  "CMOSIV",
    "X100VI"  :  "CMOS5HR",
    "X-T100" :  "CMOSB1",
    "X-T200" :  "CMOSB1",
    "X-A5"   :  "CMOSB1",
    "X-A7"   :  "CMOSB1"
  };
  
  
  var ScenetypeArray = {
    "0000" : "Auto",
    "1000" : "Portrait",
    "2000" : "Landscape",
    "3000" : "Night",
    "3100" : "Night tripod",
    "4000" : "Macro",
    "5000" : "Backlit",
    "9000" : "Sky",
    "a000" : "Greenery"
  };
  
  var FilmModeArray = {
       0 : "Provia/Standard",
     256 : "",
     272 : "",
     288 : "Astia/Soft",
     304 : "",
     512 : "Velvia/Vivid",
     768 : "",
    1024 : "",
    1280 : "PRO Neg. Std",
    1281 : "PRO Neg. Hi",
    1536 : "Classic Chrome",
    1792 : "Eterna/Cinema",
    2048 : "Classic Negative",
    2304 : "Eterna Bleach Bypass",
    2560 : "Nostalgic Neg",
    2816 : "Reala ACE"
  };
  
  var SaturationArray = {
       0 : "0 (normal)",
     128 : "+1 (medium high)",
     256 : "+2 (high)",
     192 : "+3 (very high)",
     224 : "+4 (highest)",
     384 : "-1 (medium low)",
     512 : "Low",
     768 : "None (B&W)",
     769 : "B&W Red Filter",
     770 : "B&W Yellow Filter",
     771 : "B&W Green Filter",
     784 : "B&W Sepia",
    1024 : "-2 (low)",
    1216 : "-3 (very low)",
    1248 : "-4 (lowest)",
    1280 : "Acros",
    1281 : "Acros Red Filter",
    1282 : "Acros Yellow Filter",
    1283 : "Acros Green Filter"
  };
  
  var ColourArray = {
       0 : "Off",
      32 : "Weak",
      64 : "Strong"
  };
  
  var SizeArray = {
       0 : "N/A",
      16 : "Small",
      32 : "Large"
  };
  
  var StringValues = {
  // ExposureProgram
     "8822" : {
       0 : "Not defined",
       1 : "Manual",
       2 : "Normal program",
       3 : "Aperture priority",
       4 : "Shutter priority",
       5 : "Creative program",
       6 : "Action program",
       7 : "Portrait mode",
       8 : "Landscape mode"
     },
  // ExposureMode
     "a402" : {
       0 : "Auto",
       1 : "Manual",
       2 : "Auto Bracket"
     },
  // MeteringMode
  // Photometry
     "9207" : {
       0 : "Unknown",
       1 : "Average",
       2 : "CenterWeightedAverage",
       3 : "Spot",
       4 : "MultiSpot",
       5 : "MultiSegment",
       6 : "Partial",
       255 : "Other"
     },
  // LightSource
     "9208" : {
       0 : "Unknown",
       1 : "Daylight",
       2 : "Fluorescent",
       3 : "Tungsten",
       4 : "Flash",
       9 : "Fine weather",
       10 : "Cloudy weather",
       11 : "Shade",
       12 : "Daylight fluorescent",
       13 : "Day white fluorescent",
       14 : "Cool white fluorescent",
       15 : "White fluorescent",
       17 : "Standard light A",
       18 : "Standard light B",
       19 : "Standard light C",
       20 : "D55",
       21 : "D65",
       22 : "D75",
       23 : "D50",
       24 : "ISO studio tungsten",
       255 : "Other"
     },
  // Flash
     "9209" : {
       0x0000 : "Flash did not fire",
       0x0001 : "Flash fired",
       0x0005 : "Strobe not detected",
       0x0007 : "Strobe detected",
       0x0009 : "Compulsory flash mode",
       0x000D : "Compulsory flash not detected",
       0x000F : "Compulsory flash detected",
       0x0010 : "Compulsory flash/did not fire",
       0x0018 : "Auto mode/did not fire",
       0x0019 : "Flash fired, auto mode",
       0x001D : "Flash fired, auto mode",
       0x001F : "Flash fired, auto mode",
       0x0020 : "No flash function",
       0x0041 : "Flash fired, red-eye reduction mode",
       0x0045 : "Flash fired, red-eye reduction mode, return light not detected",
       0x0047 : "Flash fired, red-eye reduction mode, return light detected",
       0x0049 : "Flash fired, compulsory flash mode, red-eye reduction mode",
       0x004D : "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
       0x004F : "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
       0x0059 : "Flash fired, auto mode, red-eye reduction mode",
       0x005D : "Flash fired, auto mode, return light not detected, red-eye reduction mode",
       0x005F : "Flash fired, auto mode, return light detected, red-eye reduction mode"
     },
  // SensingMethod
     "a217" : {
            1 : "Not defined",
            2 : "One-chip color area sensor",
            3 : "Two-chip color area sensor",
            4 : "Three-chip color area sensor",
            5 : "Color sequential area sensor",
            7 : "Trilinear sensor",
            8 : "Color sequential linear sensor"
     },
  // SceneCaptureType
     "a406" : {
            0 : "Standard",
            1 : "Landscape",
            2 : "Portrait",
            3 : "Night scene"
     },
  // SceneType
     "a301" : {
            1 : "Directly photographed"
     },
  // CustomRendered
     "a401" : {
            0 : "Normal process",
            1 : "Custom process"
     },
  // WhiteBalance
     "a403" : {
            0 : "Auto",
            1 : "Manual"
     },
  // GainControl
     "a407" : {
            0 : "None",
            1 : "Low gain up",
            2 : "High gain up",
            3 : "Low gain down",
            4 : "High gain down"
     },
  // Contrast
     "a408" : {
            0 : "Normal",
            1 : "Soft",
            2 : "Hard"
     },
  // Saturation
     "a409" : {
            0 : "Normal",
            1 : "Low saturation",
            2 : "High saturation"
     },
  // Sharpness
     "a40a" : {
            0 : "Normal",
            1 : "Soft",
            2 : "Hard"
     },
  // SubjectDistanceRange
     "a40c" : {
            0 : "Unknown",
            1 : "Macro",
            2 : "Close view",
            3 : "Distant view"
     },
  // Shutter Type
     "1050" : {
            0 : "Mechanical",
            1 : "Electronic",
            2 : "Electronic (long shutter speed)",
            3 : "Electronic Front Curtain"
     },
  // Flash Mode
     "1010" : {
    0 : "Auto", 1 : "On", 2 : "Off", 3 : "Red-eye reduction", 4 : "External", 22 : "Commander", 32768 : "Not Attached",
    33056 : "TTL", 33568 : "TTL Auto - Did not fire", 38976 : "Manual", 39008 : "Flash Commander", 39040 : "Multi-flash", 43296 : "1st Curtain (front)",
    43552 : "TTL Slow - 1st Curtain (front)", 43808 : "TTL Auto - 1st Curtain (front)", 44320 : "TTL - Red-eye Flash - 1st Curtain (front)",
    44576 : "TTL Slow - Red-eye Flash - 1st Curtain (front)", 44832 : "TTL Auto - Red-eye Flash - 1st Curtain (front)", 51488 : "2nd Curtain (rear)",
    51744 : "TTL Slow - 2nd Curtain (rear)", 52000 : "TTL Auto - 2nd Curtain (rear)", 52512 : "TTL - Red-eye Flash - 2nd Curtain (rear)",
    52768 : "TTL Slow - Red-eye Flash - 2nd Curtain (rear)", 53024 : "TTL Auto - Red-eye Flash - 2nd Curtain (rear)", 59680 : "High Speed Sync (HSS)"
     },
  // Picture Mode
     "1031" : {
            0 : "Full Auto", 
            1 : "Portrait", 
            2 : "Landscape", 
            3 : "Macro", 
            4 : "Sport",
            5 : "Night", 
            6 : "Program AE", 
            7 : "Natural Light", 
            8 : "Anti-blur",
            9 : "Beach", 
           10 : "Sunset", 
           11 : "Museum", 
           12 : "Party", 
           13 : "Flower",
           14 : "Text", 
           15 : "Natural Light & Flash", 
           16 : "Beach", 
           17 : "Snow", 
           18 : "Fireworks",
           19 : "Underwater", 
           20 : "Portrait Enhancer", 
           22 : "Panorama", 
           23 : "Night (tripod)",
           24 : "Pro Low-light", 
           25 : "Pro Focus", 
           26 : "Portrait 2", 
           48 : "HDR", 
           64 : "Advanced Filter", 
          256 : "Aperture-priority AE",
          512 : "Shutter speed priority AE", 
          768 : "Manual"
     },
  // Blur Warning
     "1300" : {
            0 : "None", 
            1 : "Blur Warning"
     },
  // Focus Warning
     "1301" : {
            0 : "None", 
            1 : "Focus Warning"
     },
  // Exposure Warning
     "1302" : {
            0 : "None", 
            1 : "Exposure Warning"
     },
  // Crop Mode
     "104d" : {
            0 : "N/A", 
            1 : "Full Frame (GFX)",
            2 : "Sports Finder Mode",
            4 : "Electronic Shutter 1.25x Crop",
            8 : "Digital Teleconverter"
     },
  // White Balance
     "1002" : {
            0 : "Auto",
            1 : "Auto (White Priority)",
            2 : "Auto (Ambiance Priority)",
          256 : "Daylight",
          512 : "Cloudy",
          768 : "Daylight Fluorescent",
          769 : "Day White Fluorescent",
          770 : "White Fluorescent",
          771 : "Warm White Fluorescent",
          772 : "Living Room Fluorescent",
         1024 : "Incandescent",
         1280 : "Flash",
         1536 : "Underwater",
         3840 : "Custom",
         3841 : "Custom2",
         3842 : "Custom3",
         3843 : "Custom4",
         3844 : "Custom5",
         4080 : "Kelvin"
     },
  // Highlight Tone
     "1041" : {
        "-64" : "+4 (Hardest)",
        "-48" : "+3 (Very Hard)",
        "-32" : "+2 (Hard)",
        "-16" : "+1 (Medium Hard)",
            0 : "+0 (Normal)",
           16 : "-1 (Medium Soft)",
           32 : "-2 (Soft)"
     },
  // Shadow Tone
     "1040" : {
        "-64" : "+4 (Hardest)",
        "-48" : "+3 (Very Hard)",
        "-32" : "+2 (Hard)",
        "-16" : "+1 (Medium Hard)",
            0 : "+0 (Normal)",
           16 : "-1 (Medium Soft)",
           32 : "-2 (Soft)"
     },
  // Noise Reduction
     "100e" : {
            0 : "Normal",
          384 : "+1 (Medium Strong)",
          256 : "+2 (Strong)",
          448 : "+3 (Very Strong)",
          480 : "+4 (Strongest)",
          640 : "-1 (Medium Weak)",
          512 : "-2 (Weak)",
          704 : "-3 (Very Weak)",
          736 : "-4 (Weakest)"
     },
  // Advanced Filter
     "1201" : {
        65536 : "Pop Color",
       131072 : "Hi Key",
       196608 : "Toy Camera",
       262144 : "Miniature",
       327680 : "Dynamic Tone",
       393217 : "Partial Color Red",
       393218 : "Partial Color Yellow",
       393219 : "Partial Color Green",
       393220 : "Partial Color Blue",
       393221 : "Partial Color Orange",
       393222 : "Partial Color Purple",
       458752 : "Soft Focus",
       589824 : "Low Key"
     },
  // Noise Reduction
     "100b" : {
           64 : "Low",
          128 : "Normal"
     },
  // Sharpness
     "a40a" : {
            0 : "Normal",
            1 : "Soft",
            2 : "Hard"
     },
  // Sharpness
     "1001" : {
            0 : "-4 (softest)",
            1 : "-3 (very soft)",
            2 : "-2 (soft)",
            3 : "0 (normal)",
            4 : "+2 (hard)",
            5 : "+3 (very hard)",
            6 : "+4 (hardest)",
          130 : "-1 (medium soft)",
          132 : "+1 (medium hard)"
     }
  };
  
  function extractString (tagid,value) {
    var string="";
    switch (tagid) {
      case "8822" : // ExposureProgram
      case "9207" : // Photometry
      case "a402" : // ExposureMode
      case "9208" : // LightSource
      case "9209" : // Flash
      case "a217" : // SensingMethod
      case "a406" : // SceneCaptureType
      case "a301" : // SceneType
      case "a401" : // CustomRendered
      case "a403" : // WhiteBalance
      case "a407" : // GainControl
      case "a408" : // Contrast
      case "a409" : // Saturation
      case "a40a" : // Sharpness
      case "a40c" : // SubjectDistanceRange
      case "1050" : // Shutter Type
      case "1010" : // Flash Mode
      case "1031" : // Picture Mode
      case "1300" : // Blur Warning
      case "1301" : // Focus Warning
      case "1302" : // Exposure Warning
      case "104d" : // Crop Mode
      case "1002" : // White Balance
      case "1041" : // Highlight Tone
      case "1040" : // Shadow Tone
      case "100e" : // Noise reduction
      case "1201" : // Advanced Filter
      case "100b" : // Noise reduction
      case "a40a" : // Sharpness
      case "1001" : // Sharpness
      if (typeof StringValues[tagid][value] !== 'undefined') {
         string = StringValues[tagid][value];
      } else {
         string = "N/A";
      }
    }
    return string;
  }
  
  var validTags = {
     "010f" : "Make",
     "0110" : "Model",
     "0112" : "Orientation",
     "011a" : "XResolution",
     "011b" : "YResolution",
     "0128" : "ResolutionUnit",
     "0131" : "Software",
     "0132" : "DateTime",
     "013b" : "Artist",
     "0213" : "YCbCrPositioning",
     "8298" : "Copyright",
     "8769" : "ExifIFDPointer",
     "0103" : "Compression",
     "0112" : "Orientation",
     "011a" : "XResolution",
     "011b" : "YResolution",
     "0128" : "ResolutionUnit",
     "013b" : "Artist",
     "0201" : "ThumbnailOffset",
     "0202" : "ThumbnailLength",
     "0213" : "YCbCrPositioning",
     "829a" : "ExposureTime",
     "829d" : "FNumber",
     "8822" : "ExposureProgram",
     "8827" : "ISOSpeedRatings",
     "8830" : "Unknown",
     "9000" : "ExifVersion",
     "9003" : "DateTimeOriginal",
     "9004" : "DateTimeDigitized",
     "9101" : "ComponentsConfiguration",
     "9102" : "CompressedBitsPerPixel",
     "9201" : "ShutterSpeedValue",
     "9202" : "ApertureValue",
     "9203" : "BrightnessValue",
     "9204" : "ExposureBias",
     "9205" : "MaxApertureValue",
     "9207" : "MeteringMode",
     "9208" : "LightSource",
     "9209" : "Flash",
     "920a" : "FocalLength",
     "a000" : "FlashpixVersion",
     "a001" : "ColorSpace",
     "a002" : "PixelXDimension",
     "a003" : "PixelYDimension",
     "a005" : "InteroperabilityIFDPointer",
     "a20e" : "FocalPlaneXResolution",
     "a20f" : "FocalPlaneYResolution",
     "a210" : "FocalPlaneResolutionUnit",
     "a217" : "SensingMethod",
     "a300" : "FileSource",
     "a301" : "SceneType",
     "a401" : "CustomRendered",
     "a402" : "ExposureMode",
     "a403" : "WhiteBalance",
     "a405" : "FocalLengthIn35mmFilm",
     "a406" : "SceneCaptureType",
     "a40a" : "Sharpness",
     "a40c" : "SubjectDistanceRange",
     "a431" : "SerialNumber",
     "a432" : "Unknown",
     "a433" : "LensMake",
     "a434" : "LensModel",
     "a435" : "LensSerialNumber",
     "0000" : "Version",
     "0010" : "InternalSerialNumber",
     "0020" : "Unknown",
     "1000" : "Quality",
     "1001" : "Sharpness",
     "1002" : "WhiteBalance",
     "1003" : "Saturation",
     "100a" : "WhiteBalanceFineTune",
     "100b" : "NoiseReduction",
     "100e" : "NoiseReduction",
     "1010" : "FujiFlashMode",
     "1011" : "FlashExposureComp",
     "1021" : "FocusMode",
     "1022" : "AFMode",
     "1023" : "FocusPixel",
     "1025" : "Unknown",
     "1026" : "Unknown",
     "102b" : "PrioritySettings",
     "102c" : "Unknown",
     "102d" : "FocusSettings",
     "102e" : "AFCSettings",
     "1030" : "SlowSync",
     "1031" : "PictureMode",
     "1032" : "ExposureCount",
     "1040" : "ShadowTone",
     "1041" : "HighlightTone",
     "1045" : "LensModulationOptimizer",
     "1046" : "Unknown",
     "1047" : "GrainEffect",
     "1048" : "ColorChromeEffect",
     "1049" : "BWAdjustment",
     "104d" : "CropMode",
     "1050" : "ShutterType",
     "1100" : "AutoBracketing",
     "1101" : "SequenceNumber",
     "1103" : "DriveSettings",
     "1200" : "Unknown",
     "1300" : "BlurWarning",
     "1301" : "FocusWarning",
     "1302" : "ExposureWarning",
     "1303" : "Unknown",
     "1304" : "GEImageSize",
     "1305" : "Unknown",
     "1400" : "DynamicRange",
     "1401" : "FilmMode",
     "1402" : "DynamicRangeSetting",
     "1403" : "DevelopmentDynamicRange",
     "1404" : "MinFocalLength",
     "1405" : "MaxFocalLength",
     "1406" : "MaxApertureAtMinFocal",
     "1407" : "MaxApertureAtMaxFocal",
     "1408" : "Unknown",
     "1409" : "Unknown",
     "140a" : "Unknown",
     "1422" : "ImageStabilization",
     "1431" : "Rating",
     "1436" : "ImageGeneration",
     "1438" : "ImageCount",
     "1439" : "Unknown",
     "1442" : "Unknown",
     "1446" : "FlickerReduction",
     "1447" : "Unknown",
     "1448" : "Unknown",
     "4100" : "FacesDetected"
  };
  
  
  var tagTypes = {
     1 : "byte",
     2 : "ascii",
     3 : "short",
     4 : "long",
     5 : "rational",
     7 : "8-bit byte",
     9 : "slong",
    10 : "srational"
  }

  
  ////////////////////////////////////////////////////////////////////////
// Process image file as an array buffer
////////////////////////////////////////////////////////////////////////
function handleBinaryFile(seq,binFile) {
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
    var bigEnd;
    if ((dataView.getUint8(appLength1a) == 255) && (dataView.getUint8(appLength1a+1) == 225)) { // 0xFFE1
       var appLength2  = dataView.getUint16(appLength1a+2);
       var xmlHdr=getStringFromDB(dataView, appLength1a+4, 28);
       var xmlBdy=getStringFromDB(dataView, appLength1a+33, 350);
       var parser = new DOMParser();
       var xmlDoc = parser.parseFromString(xmlBdy,"text/xml");
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
        var tagx   = readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd, tagClass);
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
  