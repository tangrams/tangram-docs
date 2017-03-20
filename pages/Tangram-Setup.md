## Mapzen.js

The easiest way to use Tangram in a web page is via [Mapzen.js](https://mapzen.com/documentation/mapzen-js/), which is Mapzen's JavaScript SDK. Mapzen.js combines web support for a variety of Mapzen services, including Tangram, [Mapzen Search](https://mapzen.com/products/search/), and the [Mapzen Basemap Styles](https://mapzen.com/documentation/cartography/styles/).

## Script Tag Setup

Tangram-JS is a JavaScript library designed for use in [Leaflet](http://leaflet.org) maps.

The [latest release of Tangram](github.com/tangrams/tangram/releases) can be included in your web page with a `script` tag:

```html
<script src="https://mapzen.com/tangram/tangram.min.js"></script>
```

Then, Tangram can be instantiated as a Leaflet layer, passing (at a minimum) the scene URL through the [options object](Tangram-Overview/#leaflet-options):

```javascript
var map = L.map();

var layer = Tangram.leafletLayer({
    scene: 'scene.yaml'
});
```

For a complete manual setup tutorial, see our [Tangram Walkthrough](walkthrough.md).

### JavaScript Bundling

Tangram-JS may be imported or required as a module in ES6, CommonJS, or AMD (Asynchronous Module Definition). If in this process the Tangram debug file (`tangram.debug.js`) is renamed, the source map file must also be renamed to match (by adding `.map` to whatever the new file's name is).

## Tangram-ES

Tangram-ES is the C++ version of Tangram, based on OpenGL ES, designed for mobile and embedded systems. It currently targets five platforms: Android, iOS, Mac OS X, Ubuntu Linux, and Raspberry Pi.

For a complete tutorial for setting up Tangram-ES on Android, see our [Android Walkthrough](android-walkthrough.md).

## API keys

To use hosted Mapzen services, including the [Mapzen Vector Tile service](https://mapzen.com/projects/vector-tiles/), you'll need a free [Mapzen API key](https://mapzen.com/developers/).
