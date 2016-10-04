*This is a conceptual overview of the Tangram map rendering engine. For a complete technical reference of Tangram's configuration and parameters, refer to the rest of the documentation.*

Tangram is an open-source 3D rendering engine specifically designed for drawing maps, using the [OpenGL](https://en.wikipedia.org/wiki/OpenGL) graphics API. It parses tiled and untiled vector data in a variety of sources, and produces a 3D scene with geometry, labels, and icons all built and styled on the fly. It also accepts tiled raster inputs, with special facility for processing terrain data.

Tangram is implemented in two official flavors: [Tangram-JS](https://github.com/tangrams/tangram) for use in web browsers, and [Tangram-ES](https://github.com/tangrams/tangram-es) for native mapping on mobile devices.

Both libraries use a "scene file" to configure and modify the data sources, filters, and display options used when drawing the map. The scene file is written in YAML using a custom, Tangram-specific syntax.

## Tangram-JS

[Tangram-JS](https://github.com/tangrams/tangram) is a JavaScript library for use in web browsers. It uses [WebGL](https://www.khronos.org/webgl/) to construct and draw vector and raster map data at high speeds. It provides an API through a `scene.config` object, which is essentially the scene file in JavaScript object form – this config object may be modified at run-time to change nearly any property of the scene.

### Leaflet

Tangram-JS includes an interface to the popular [Leaflet](http://leafletjs.com/) web-mapping library. In this way Tangram-JS is technically a Leaflet "plugin," with Leaflet handling user interaction such as clicking, zooming, and panning, and Tangram providing the content of each tile.

Note: Tangram requires that the Leaflet map use the default "Web Mercator" Coordinate Reference System, also known as EPSG:3857. As this is the default, it is not necessary to specify it in the Leaflet instantiation, but here's what that would look like:

```javascript
var map = L.map('map', {
    crs: L.CRS.EPSG3857
});
```

### JavaScript Setup

The latest release of Tangram can be included in your web page with a `script` tag:

```html
<script src="https://mapzen.com/tangram/tangram.min.js"></script>
```

Then, Tangram can be instantiated as a Leaflet layer, passing (at a minimum) the scene name through the [options object](#options-object):

```javascript
var map = L.map();

var layer = Tangram.leafletLayer({
    scene: 'scene.yaml'
});
```

### Builds and Names

Tangram is built in "minified" and debug" versions, named `tangram.min.js` and `tangram.debug.js`. The `min` file is smaller, and so downloads faster – the `debug` file is larger, but is easier to read for debugging purposes. Note that for personal reasons, Tangram requires that the library file be named one of these two things. If you rename the file, Tangram will not draw maps for you.

### Releases

As we add features and fix bugs, we will release additional versions. The current release is `v0.9.0`. ([See a list of releases and release notes here.](https://github.com/tangrams/tangram/releases))

If you'd like to use a specific release of Tangram, you may specify its version number in the url:

```html
<script src="https://mapzen.com/tangram/0.8/tangram.min.js"></script>
```

### options object

When Tangram's Leaflet layer is instantiated, various parameters may be passed to the layer inside the _options object_ to control the layer's appearance and behavior.

```javascript
var layer = Tangram.leafletLayer({
    scene: 'scene.yaml',
    attribution: 'attribution string'
});
```
This object may contain any of the [standard Leaflet layer options](http://leafletjs.com/reference.html), plus a number of Tangram-specific options, listed below.

#### scene
The `scene` parameter specifies the URL of the [scene file](Scene-file.md) to be loaded.
```javascript
var layer = Tangram.leafletLayer({
    scene: 'scene.yaml'
});
```
#### attribution
The `attribution` parameter specifies HTML which will be inserted into the Leaflet attribution string.
```javascript
var layer = Tangram.leafletLayer({
    attribution: 'Map made with <a href="https://mapzen.com/tangram" target="_blank">Tangram</a>'
});
```
#### preUpdate/postupdate
The `preUpdate` and `postUpdate` parameters allow functions to be referenced or defined, to be run immediately before or after Tangram draws a frame.
```javascript
var layer = Tangram.leafletLayer({
    preUpdate: myPreUpdateFunction,
    postUpdate: function() {
        console.log('postUpdate!');
    }
});
```

### Multiple Maps

Due to architectural limitations, there can be only one Tangram map per "browsing context". This means there can be only one embedded Tangram map on a web page, and one Tangram layer per Leaflet map. To work around this, multiple maps may be loaded in iframes – we make frequent use of the [Tangram-frame repository](https://github.com/tangrams/tangram-frame) for this purpose, by using Tangram-frame links as the "src" of iframes.

## Tangram-ES

[Tangram-ES](https://github.com/tangrams/tangram-es) is a C++ library intended for use in mobile applications. It uses [OpenGL ES](https://www.khronos.org/opengles/) to construct and draw vector and raster map data at high speeds. It is available for inclusion in Android apps through an [Android SDK](https://mapzen.com/documentation/tangram/android-sdk/0.4/).

## The Scene File

Both Tangram-JS and Tangram-ES use a "scene file" written in YAML to set up and draw maps; both libraries can use the same scene file, and its structure and syntax is interchangable between the two libraries, with a very small number of exceptions as noted in the documentation with `[JS only]` or `[ES only]`.

## Scene Bundling

More complex map styles can require a large number of assets, including multiple scene files, textures and sprite images, and so on. For ease of transport, a Tangram scene file and its assets may be bundled in a .zip file, which may then be named in place of the .yaml file when specifying a scene file.

For example, with Tangram-JS:

```js
    var map = L.map();

    var layer = Tangram.leafletLayer({
        scene: 'scene.zip'
    });
    
    layer.addTo(map);
```

Tangram will unpack the zip internally, expecting only a single .yaml file to be in the zip's root, which it will use as the scene file. Any other .yaml files (eg [basemaps](https://mapzen.com/blog/introducing-refill-cinnabar-and-zinc-styles-for-tangram/) or [blocks](https://github.com/tangrams/blocks) included with the [import](https://mapzen.com/documentation/tangram/import/) block) must therefore be in subdirectories, and all paths in the .yaml file must be relative to this root scene file.

## Documentation

The Tangram documentation has three major sections:

- **Overviews** like this one,
- **Syntax Reference**, and
- **Tutorials**.

## Getting Started

The [Tangram Walkthrough](https://mapzen.com/documentation/tangram/walkthrough/) is a step-by-step guide to creating your first Tangram map, and is a great place to start no matter what your eventual goal is.

## Contributing

Questions? Suggestions? Typos? Bug fixes? We welcome contributions, either to the libraries or to the documentation itself. Learn more or file an issue at the links below:

- [Tangram-JS README](https://github.com/tangrams/tangram/blob/master/README.md)
- [Tangram-JS issues](https://github.com/tangrams/tangram/issues)
- [Tangram-ES README](https://github.com/tangrams/tangram-es/blob/master/README.md)
- [Tangram-ES issues](https://github.com/tangrams/tangram-es/issues)
- [Tangram Documentation issues](https://github.com/tangrams/tangram-docs/issues)
- [Contributing to Tangram-JS](https://github.com/tangrams/tangram/blob/master/CONTRIBUTING.md)
