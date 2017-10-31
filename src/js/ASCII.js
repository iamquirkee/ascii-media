function ASCII(opts) {

  var _self = this;
  var _options = opts || {};
  _self.options = _options;
  _self.canvas = document.createElement('canvas');
  _self.ctx = _self.canvas.getContext('2d');

  // ASCII
  _self.asciiChars = ['@', '#', '$', '=', '*', '!', ';', ':', '~', '-', ',', '.', '&nbsp;'];
  _self.asciiLength = _self.asciiChars.length - 1;

  // Frames
  _self.frameSkip = 3;
  _self.currentFrame = 0;

  return new Promise(function (resolve, reject) {

    // Check for if element is decleared
    if (_options.el === undefined || _options.el === null) {
      reject("No element declared");
    } else {

      if (_options.el.nodeName === 'IMG') {

        // If Image
        _options.el.addEventListener('load', function () {
          _self.render();
          resolve(_self);
        });

      } else if (_options.el.nodeName === 'VIDEO') {

        if (_options.webcam) {

          // If Video Webcam
          navigator.mediaDevices.getUserMedia({
            audio: false,
            video: true
          }).then(function (stream) {

            _self.mediaStream = stream;

            if ("srcObject" in _options.el) {
              _options.el.srcObject = stream;
            } else {
              _options.el.src = window.URL.createObjectURL(stream);
            }

          }).catch(function (err) {

            reject("Video stream is not supported");

          })

        }

        _options.el.addEventListener('error', function (evt) {
          if (!_options.webcam) {
            reject("Video failed to load", evt)
          }
        }, true);

        _options.el.addEventListener('loadeddata', function () {
          // Set dimensions
          _self.height = _options.el.videoHeight * 0.25;
          _self.width = _options.el.videoWidth * 0.25;
          _self.canvas.height = _self.height;
          _self.canvas.width = _self.width;

          // Start play loop
          _self.play();
          // Return ready
          resolve(_self);
        });

      } else {

        reject("Target element must be Image or Video");

      }

    }

  })

}

ASCII.prototype = {
  play: function () {
    // Play video
    this.options.el.play();
    // Start rendering
    this.isPlaying = true;
    this.render();
  },
  pause: function () {
    // Pause video
    this.options.el.pause();
    // Pause rendering
    this.isPlaying = false;
  },
  render: function () {
    if (this.isPlaying) {

      this.currentFrame++;

      if ((this.currentFrame % this.frameSkip) == 0) {

        this.ctx.drawImage(this.options.el, 0, 0, this.width, this.height);
        this.imageData = this.ctx.getImageData(0, 0, this.width, this.height).data;

        var asciiStr = this.getAsciiString();
        document.getElementById('ascii').innerHTML = asciiStr;

      }

      /*
      // For Debugging
      if (this.currentFrame > 6) {
        this.pause();
      }
      */

      // Render
      window.requestAnimationFrame(this.render.bind(this));


    }
  },
  getChar: function (val) {
    return this.asciiChars[parseInt(val * this.asciiLength, 10)];
  },
  getAsciiString: function () {

    var len = this.width * this.height,
      d = this.imageData,
      str = '',
      row = 0;

    for (var currentPixel = 0; currentPixel < len; currentPixel++) {
      if (
        currentPixel % this.width === 0 &&
        currentPixel != 0
      ) {
        str += '\n';
        row++;
      }
      var r = d[currentPixel * 4];
      var g = d[(currentPixel * 4) + 1];
      var b = d[(currentPixel * 4) + 2];
      val = Math.max(r, g, b) / 255
      str += this.getChar(val)
    }

    return str;

  }

}