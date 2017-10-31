// Polyfill for older browsers
navigator.mediaDevices === undefined ? navigator.mediaDevices = {} : navigator.mediaDevices = navigator.mediaDevices;
// Assign function to legacy function if browser is older
if (navigator.mediaDevices.getUserMedia === undefined) {
  // Setup function
  navigator.mediaDevices.getUserMedia = function (constraints) {
    var getUserMedia = navigator.getUserMedia || webkitGetUserMedia || navigator.mozGetUserMedia;
    // If no legacy API return error
    if (!getUserMedia) {
      return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
    }
    // If legacy API is available
    return new Promise(function (resolve, reject) {
      getUserMedia.call(navigator, constraints, resolve, reject);
    });
  }
}