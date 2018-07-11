Tangram is an open-source 3D rendering engine specifically designed for drawing maps, using the [OpenGL](https://en.wikipedia.org/wiki/OpenGL) graphics API. It parses vector data in a variety of formats, and produces a 3D scene with geometry, labels, and icons all built and styled on the fly. It also accepts tiled raster inputs, with special facility for processing terrain data.

Tangram is implemented in two official flavors: [Tangram JS](https://github.com/tangrams/tangram) for use in web browsers, and [Tangram ES](https://github.com/tangrams/tangram-es) for native mapping on mobile devices.

Both libraries use a "scene file" to configure and modify the data sources, filters, and display options used when drawing the map. The scene file is written in YAML using a custom, Tangram-specific syntax.

## Tangram JS

[Tangram JS](https://github.com/tangrams/tangram) is a JavaScript library for use in web browsers. It uses [WebGL](https://www.khronos.org/webgl/) to construct and draw vector and raster map data at high speeds. It provides an API through a `scene.config` object, which is essentially the scene file in JavaScript object form – this config object may be modified at run-time to change nearly any property of the scene.

## Tangram ES

Tangram ES is a C++ library, with a rendering engine based on OpenGL ES, and designed for mobile and embedded systems. It currently targets five platforms: Android, iOS, Mac OS X, Ubuntu Linux, and Raspberry Pi.

## Releases

Tangram JS versions are matched to Leaflet versions to ensure ongoing compatability (primarily relating to scrollwheel zoom behavior). In general, the latest version of Tangram is based on the latest version of Leaflet, but if you require a specific version of Leaflet or Tangram, refer to the below compatability table.

| Tangram version  | Leaflet version 
|------------------|-----------------
| 0.7 and previous | 0.7.7
| 0.8 and later    | 1.x

The latest release of Tangram JS may always be referenced at:

https://unpkg.com/tangram/dist/tangram.min.js

for the minified version, and 

https://unpkg.com/tangram/dist/tangram.debug.js

for the debug version.

If you'd like to use a specific release of Tangram JS, you may specify its version number in its url:

```html
<script src="https://unpkg.com/tangram@0.15.1/dist/tangram.min.js"></script>
```

[See details of the latest Tangram JS release here.](https://github.com/tangrams/tangram/releases/latest)

Tangram ES releases are tagged according to their target platform. 

[See the latest Tangram ES releases here.](https://github.com/tangrams/tangram-es/releases)

Note: the documentation always refers to the latest release of Tangram – reverse compatibility of scene file syntax is not guaranteed.

## Leaflet

`[Tangram JS only]`

Tangram JS includes an interface to the popular [Leaflet](http://leafletjs.com/) web-mapping library. In this way Tangram JS is technically a Leaflet "plugin," with Leaflet handling user interaction such as clicking, zooming, and panning, and Tangram providing the content of each tile.

Note: Tangram requires that the Leaflet map use the default "Web Mercator" Coordinate Reference System, also known as EPSG:3857. As this is the default, it is not necessary to specify it in the Leaflet instantiation, but here's what it would look like if you did:

```javascript
var map = L.map('map', {
    crs: L.CRS.EPSG3857
});
```

### Leaflet options

When Tangram's Leaflet layer is instantiated, various parameters may be passed to the layer inside the _options object_ to control the layer's appearance and behavior.

```javascript
var layer = Tangram.leafletLayer({
    scene: 'scene.yaml',
    attribution: 'attribution string'
});
```
This object may contain any of the [standard Leaflet layer options](http://leafletjs.com/reference.html), plus a number of Tangram-specific options, listed below.

#### introspection

When set to `true`, this parameter will load the scene with `introspection` enabled, making a call to [`scene.setIntrospection(true)`](../API-Reference/Javascript-API.md#setintrospection_boolean_) unnecessary.

```javascript
var layer = Tangram.leafletLayer({
    introspection: true
});
```

#### scene
The required `scene` parameter specifies the URL of the [scene file](Scene-File.md) to be loaded.
```javascript
var layer = Tangram.leafletLayer({
    scene: 'scene.yaml'
});
```

#### preUpdate/postUpdate
The optional `preUpdate` and `postUpdate` parameters allow functions to be referenced or defined, to be called immediately before and/or after Tangram's frame update loop runs (up to 60 frames per second, depending on hardware and scene complexity). These functions are called each frame, continuously, regardless of whether the Tangram scene is animated (e.g. the map may not be visually changing in any way, but the update functions will still be called). They are passed a single argument, a flag indicating if Tangram will render (for `preUpdate`), or just did render (for `postUpdate`) new content.
```javascript
var layer = Tangram.leafletLayer({
    preUpdate: myPreUpdateFunction,
    postUpdate: function(didRender) {
        console.log('postUpdate!');
        if (didRender) {
            console.log('new frame rendered!');
        }
    },
    ...
});
```

#### modifyScrollWheel
By default, Tangram modifies Leaflet's scrollwheel behavior, for better synchronization with its own render loop while zooming. If this interferes with your application, you can disable this behavior with the optional `modifyScrollWheel` option:

```javascript
var layer = Tangram.leafletLayer({
    modifyScrollWheel: false,
    ...
});
```

#### modifyZoomBehavior
By default, Tangram modifies Leaflet's double-click and zoom behavior, to keep the Tangram layer in sync with marker/SVG layers. If this interferes with your application, you can disable this behavior with the optional `modifyZoomBehavior` option:

```javascript
var layer = Tangram.leafletLayer({
    modifyZoomBehavior: false,
    ...
});
```

#### webGLContextOptions
Using this option, WebGL context options may be explicitly added or overridden.

```javascript
var layer = Tangram.leafletLayer({
    scene: ...,
    webGLContextOptions: {
      preserveDrawingBuffer: true,
      antialias: false
    }
  });
```  
### Multiple Maps

Due to architectural limitations, there can be only one Tangram map per "browsing context". This means there can be only one embedded Tangram map on a web page, and one Tangram layer per Leaflet map, although Tangram may be composited with other kinds of Leaflet layers.

An iframe counts as a separate browsing context, so we make frequent use of the [Tangram-frame repository](https://github.com/tangrams/tangram-frame) for this purpose, by using Tangram-frame links as the "src" of iframes.


## The Scene File

Tangram uses a "scene file" written in YAML to configure data sources, filters, and styling rules. Its structure and syntax is interchangable between Tangram JS and Tangram ES, with a very small number of exceptions as noted in the documentation with `[JS only]` or `[ES only]`.

See [Scene File](Scene-File.md).


## Scene Bundling

More complex map styles can require a large number of assets, including multiple scene files, textures and sprite images, and so on. For ease of transport, a Tangram scene file and its assets may be bundled in a .zip file, which may then be named in place of the .yaml file when specifying a scene file.

For example, with Tangram JS:

```js
    var map = L.map();

    var layer = Tangram.leafletLayer({
        scene: 'scene.zip'
    });
    
    layer.addTo(map);
```

Tangram will unpack the zip internally, expecting only a single .yaml file to be in the zip's root, which it will use as the scene file. Any other bundled .yaml files (eg [basemaps](https://mapzen.com/blog/introducing-refill-cinnabar-and-zinc-styles-for-tangram/) or [blocks](https://github.com/tangrams/blocks) included with the [import](../Syntax-Reference/import.md) block) must therefore be in subdirectories, and all paths in the .yaml file must be relative to this root scene file.


## Getting Started

Check out our [Tangram Setup Guides](../Tutorials/Tangram-Setup.md) for more information about getting started with your Tangram installation.


## Contributing

Questions? Suggestions? Typos? Bug fixes? We welcome contributions, either to the libraries or to the documentation itself. Learn more at the links below:

- [Contributing to Tangram JS](https://github.com/tangrams/tangram/blob/master/CONTRIBUTING.md)
- [Tangram ES README](https://github.com/tangrams/tangram-es/blob/master/README.md)
