////////////////////////////////////////////////////////////////////////
// Extract and format metadata
////////////////////////////////////////////////////////////////////////
export function metadata_extract (seq,img,tagSet) {

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
  
    label = "Camera Make";
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
  