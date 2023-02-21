import Reader from './reader.js'
import msgLine from './msgLine.js'

window.addEventListener('DOMContentLoaded', () => {
  window.iOS = ['iPad', 'iPhone', 'iPod'].indexOf(navigator.platform) >= 0;
  window.isMediaStreamAPISupported = navigator && navigator.mediaDevices && 'enumerateDevices' in navigator.mediaDevices;
  window.noCameraPermission = false;
  
  var returnText = null;
  var textBoxEle = document.querySelector('#result');
  var resultEle = document.querySelector('.result');
  var resultOverlayEle = document.querySelector('.result-overlay');
  var resultOpenBtn = document.querySelector('.result-open');
  var resultCloseBtn = document.querySelector('.result-close');
  
  var infoEle = document.querySelector('.info');
  var infoOverlayEle = document.querySelector('.info-overlay');
  var helpTextEle = document.querySelector('.help-text');
  var headerIcon = document.querySelector('.header-icon');
  var infoCloseBtn = document.querySelector('info-close');
  
  var scanningEle = document.querySelector('.custom-scanner');
  var scanImgEle = document.querySelector('.scanner-img');
  
  window.overlay = document.querySelector('.overlay');
  
  window.addEventListener('load', (event) => {
    Reader.init();
    
    // set camera overlay size
    setTimeout(() => {
      window.overlay.style.borderStyle = 'solid';
      if (window.isMediaStreamAPISupported) scan();
    }, 1000);
  });
  
  function scan(selectedPhotos = false) {
    if (window.isMediaStreamAPISupported && !window.noCameraPermission) {
      scanningEle.style.display = 'block';
      scanImgEle.style.display = 'block';
    }

    if (selectedPhotos) {
      scanningEle.style.display = 'block';
      scanImgEle.style.display = 'block';
    }
    
    Reader.scan((result) => {
      returnText = result;
      textBoxEle.value = result;
      textBoxEle.select();
      scanningEle.style.display = 'none';
      scanImgEle.style.display = 'none';
      resultEle.classList.remove('result--hide');
      resultOverlayEle.classList.remove('result--hide');
    }, selectedPhotos);
  }
  
  resultOpenBtn.addEventListener('click', () => {
    window.open(`https://www.google.com/search?q=${returnText}`, '_blank', 'toolbar=0,location=0,menubar=0');
    hideResult();
  }, false);
  
  resultCloseBtn.addEventListener('click', hideResult, false);
  
  function hideResult() {
    returnText = null;
    textBoxEle.value = '';
    resultEle.classList.add('result--hide');
    resultOverlayEle.classList.add('result--hide');
    scan();
  }
  
  headerIcon.addEventListener('click', () => {
    infoEle.classList.remove('info--hide');
    infoOverlayEle.classList.remove('info--hide');
  }, false);
  
  infoCloseBtn.addEventListener('click', () => {
    infoEle.classList.add('info--hide');
    infoOverlayEle.classList.add('info--hide');
  }, false);
});
