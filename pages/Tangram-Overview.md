*This is a conceptual overview of the Tangram map rendering engine. For a complete technical reference of Tangram's configuration and parameters, refer to the rest of the documentation.*

Tangram is an open-source 3D rendering engine specifically designed for drawing maps. We are implementing it in two official flavors: [Tangram-JS](https://github.com/tangrams/tangram) for use in web browsers, and [Tangram-ES](https://github.com/tangrams/tangram-es) for native mapping on mobile devices, with the goal of produce identical results with each.

Both libraries use a "scene file" to configure and modify the data sources, filters, and display options used when drawing the map - this scene file is interchangable between libraries.

## Tangram-JS

Tangram-JS is a JavaScript library for use in web browsers. It uses [WebGL](https://www.khronos.org/webgl/) to construct and draw vector and raster map data at high speeds. It provides an API through a `scene.config` object, which is essentially the scene file in JavaScript object form. This config object may be modified at run-time and updated to change nearly any

### Leaflet

Tangram-JS includes an interface to the popular [Leaflet](http://leafletjs.com/) web-mapping library. In this way Tangram-JS is a Leaflet "plugin."

Leaflet handles user interaction such as clicking, zooming, and panning.

### JavaScript Setup

The latest release of Tangram can be included in your web page with a `script` tag:

```html
<script src="https://mapzen.com/tangram/tangram.min.js"></script>
```

Then, Tangram can be instantiated as a Leaflet layer:

```js
    var map = L.map();

    var layer = Tangram.leafletLayer({
        scene: 'scene.yaml'
    });
```

### Builds and Names

Tangram is built in "minified" and debug" versions, named `tangram.min.js` and `tangram.debug.js`. The `min` file is smaller, and so downloads faster – the `debug` file is larger, but is easier to read for debugging purposes. Note that for personal reasons, Tangram requires that the library file be named one of these two things. If you rename the file, Tangram will not draw maps for you.

### Releases

As features are added and bugs are fixed, additional versions are relased. The current release is `v0.9.0`. ([See a list of releases and release notes here.](https://github.com/tangrams/tangram/releases))

If you'd like to refer to a specific release of Tangram, you may specify its version number in the url:

```html
<script src="https://mapzen.com/tangram/0.8/tangram.min.js"></script>
```

## Tangram-ES

Tangram-ES is a C++ library intended for use in mobile applications. It uses [OpenGL ES](https://www.khronos.org/opengles/) to construct and draw vector and raster map data at high speeds. It's available for inclusion in Android apps through an [Android SDK](https://mapzen.com/documentation/tangram/android-sdk/0.4/).

## The Scene File

Both Tangram-JS and Tangram-ES use a "scene file" written in YAML to set up and draw maps; both libraries can use the same scene file, and its structure and syntax is interchangable between the two libraries, with a very small number of exceptions, noted in the documentation with `[JS only]` or `[ES only]`.

## Scene Bundling

More complex map styles can require a large number of assets, including multiple scene files, textures and sprite images, and so on. For ease of transport, a Tangram scene file and its assets may be bundled in a .zip file, which may then be named in place of the .yaml file when specifying a scene file.

For example, with Tangram-JS:

```js
    var map = L.map();

    var layer = Tangram.leafletLayer({
        scene: 'scene.zip'
    });
```

Tangram will unpack the zip internally, expecting only a single .yaml file to be in the zip's root, which it will use as the scene file. Any other .yaml files (eg [basemaps](https://mapzen.com/blog/introducing-refill-cinnabar-and-zinc-styles-for-tangram/) or [blocks](https://github.com/tangrams/blocks) included with the [import](https://mapzen.com/documentation/tangram/import/) block) must therefore be in subdirectories, and all paths in the .yaml file must be relative to this root scene file.

## Documentation

The Tangram documentation has three major sections:

- **Overviews** like this one,
- **Technical References**, and
- **Tutorials** including Walkthroughs.

## Getting Started

The [Tangram Walkthrough] is a step-by-step guide to creating your first Tangram map, and is a great place to start no matter what your eventual goal is.

## Contributing

Questions? Suggestions? Typos? Bug fixes? We welcome contributions, either to the libraries or to the documentation itself. File an issue or a pull request:

- [Tangram-JS issues](https://github.com/tangrams/tangram/issues)
- [Tangram-ES issues](https://github.com/tangrams/tangram-es/issues)
- [Tangram Documentation issues](https://github.com/tangrams/tangram-docs/issues)