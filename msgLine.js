var msgLine = {}
var msgLineEle = document.querySelector('msgLine');
var text = null

msgLine.notify = (msg, interval = 5000) => {
  if (!msg) return;
  
  // Remove old msg
  if (text) text.remove();
  
  // Append msg to DOM
  text = document.createElement('div');
  text.className = 'msgLine-text';
  text.textContent = msg;
  msgLineEle.appendChild(text);
  
  // Show msg for interval units then turn off
  setTimeout(() => {
    text.remove();
  }, interval);
}

export default msgLine;
