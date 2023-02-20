var Reader = {
  "active": false,
  "canvas": null,
  "webcam": null,
  "ctx": null,
}

Reader.setCanvas = () => {
	Reader.canvas = document.createElement('canvas');
  Reader.ctx = Reader.canvas.getContext('2d');
}

function setPhotoSourceToScan(selectedPhotos){
	if (!selectedPhotos && window.isMediaStreamAPISupported) {
  	Reader.webcam = document.querySelector('video');
  } else {
  	Reader.webcam = document.querySelector('img');
  }
}

Reader.init = () => {
	var baseurl = '';
  var streaming = false;
  
  setPhotoSourceToScan();
  
  Reader.setCanvas();
  
  if (window.isMediaStreamAPISupported) {
  	Reader.webcam.addEventListener('play', (ev) => {
    	if (!streaming) {
      	setCanvasProperties();
        streaming = true;
      }
    }, false);
  }
  
  function setCanvasProperties() {
    Reader.canvas.width = window.innerWidth;
    Reader.canvas.height = window.innerHeight;
  }
  
  function startCapture(limits) {
    navigator.mediaDevices.getUserMedia(limits).then((stream) => {
      Reader.webcam.srcObject = stream;
      Reader.webcam.setAttribute('playsinline', true);
      Reader.webcam.setAttribute('controls', true);
      setTimeout(() => {
        document.querySelector('video').removeAttribute('controls');
      });
    }).catch((err) => {
      console.log('Error occurred ', err);
    })
  }
  
  if (window.isMediaStreamAPISupported) {
 		navigator.mediaDevices.enumerateDevices().then((devices) => {
    	var device = devices.filter((device) => {
        if (device.kind == "videoinput") {return device;}
      });
      var limits;
      if (device.length > 1) {
        limits = {
          video: {
            mandatory: {
              sourceId: device[device.length - 1].deviceId ? device[device.length - 1].deviceId : null
            }
          },
          audio: false
        };
        
        if (window.iOS) {
          limits.video.facingMode = 'environment';
        }
        
        startCapture(limits);
      } else if (device.length) {
      	limits = {
          video: {
            mandatory: {
              sourceId: device[0].deviceId ? device[0].deviceId : null
            }
          },
          audio: false
        };
        
        if (window.iOS) {
          limits.video.facingMode = 'environment';
        }
        
        if (!constraints.video.mandatory.sourceId && !window.iOS) {
          startCapture({ video: true });
        } else {
        	startCapture(limits);
        }
      }
    }).catch((err) => {
    	console.log('Error occurred ', err);
    });
  }
};

Reader.scan = (selectedPhotos) => {
	Reader.active = true;
  Reader.setCanvas();
  setTimeout(() => {
  	setPhotoSourceToScan(selectedPhotos);
  });
  
  function newDecoderFrame() {
  	if (!Reader.active) return;
    try {
    	Reader.ctx.drawImage(Reader.webcam, 0, 0, Reader.canvas.width, Reader.canvas.height);
      var imgData = Reader.ctx.getImageData(0, 0, Reader.canvas.width, Reader.canvas.height);
    } catch (e) {}
  }
  
  newDecoderFrame();
}

console.log(Reader.active)
