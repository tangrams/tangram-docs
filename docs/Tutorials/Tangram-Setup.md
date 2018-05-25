## Script Tag Setup

[Tangram JS](https://github.com/tangrams/tangram) is a JavaScript library designed for use in [Leaflet](http://leaflet.org) maps.

The [latest release of Tangram](https://github.com/tangrams/tangram/releases) can be included in your web page with a `script` tag:

```html
<script src="https://unpkg.com/tangram/dist/tangram.min.js"></script>
```

Then, Tangram can be instantiated as a Leaflet layer, passing (at a minimum) the scene URL through the [options object](../Overviews/Tangram-Overview.md#leaflet-options):

```javascript
var map = L.map();

var layer = Tangram.leafletLayer({
    scene: 'scene.yaml'
});
```

A Tangram map may be de-instantiated, with all associated resources de-allocated, by calling `layer.remove()` on the leafletLayer.

For a complete manual setup tutorial, see our [Tangram Walkthrough](walkthrough.md).

### JavaScript Bundling

Tangram JS may be imported or required as a module in ES6, CommonJS, or AMD (Asynchronous Module Definition). For more information about bundling Tangram, see the [Advanced Tangram for Front-End Engineers](https://github.com/tangrams/tangram-play/wiki/Advanced-Tangram-for-front-end-engineers:-bundlers,-frameworks,-etc) page on the [Tangram Play wiki](https://github.com/tangrams/tangram-play/).

## Tangram ES

[Tangram ES](https://github.com/tangrams/tangram-es) is the C++ version of Tangram, based on OpenGL ES, designed for mobile and embedded systems. It currently targets five platforms: Android, iOS, Mac OS X, Ubuntu Linux, and Raspberry Pi.

For a complete tutorial for setting up Tangram ES on Android, see our [Android Walkthrough](android-walkthrough.md).

## API keys

To use hosted Nextzen services, including the [Nextzen Vector Tile service](https://www.nextzen.org/#vector-tiles), you'll need a free [Nextzen API key](https://developers.nextzen.org).
