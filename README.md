# ascii-media
Turns Video into Ascii art.

Currently only renders webcam data.

## Todo ##
- Add support for images
- Add support for videos
- Convert JS to TS

## How ##

Add `ASCII.js` to your project

```html
  <!doctype html>
    <html class="no-js" lang="">
      <head>
        
        ...

      </head>
      <body>
        
        ...

        // Add the polyfill if using in <IE10 
        <script src="js/mediaDevicePolyfill.js"></script>
        // Add Script to footer
        <script src="js/ASCII.js"></script>
      
      </body>
```

## Example ## 
```javascript 
var Renderer = new ASCII({
  el: document.getElementById('main'),
  webcam: true
});

Renderer.then(function (data) {
  console.log("Ready :: ", data);
}).catch(function (err) {
  console.log("Failed :: ", err)
})
```

## API ##
| Name | Meaning | Type |
| ---- | ----| ---- |
| `el` | Image/Video element to retrieve image data | `Required` |
| `webcam` | To use webcam data | `true` / `false`|
| `fn` | Callback function (Currently not implemented) | |
