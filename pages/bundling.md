# Bundling Tangram JS

Since v0.12, Tangram JS is a bundleable npm package. Put very simply, this means you don't have to worry about how, when, or where to download it to use or update it when using it in your apps.

(For why this is cool, see Peter Jang's excellent [Modern JavaScript explained for Dinosaurs](https://medium.com/@peterxjang/modern-javascript-explained-for-dinosaurs-f695e9747b70).)

(For more details, see the [Advanced Tangram for Front-End Engineers](https://github.com/tangrams/tangram-play/wiki/Advanced-Tangram-for-front-end-engineers:-bundlers,-frameworks,-etc) page on the [Tangram Play wiki](https://github.com/tangrams/tangram-play/).)

## Boilerplate

If you just want to see some sample code (aka "boilerplate"), we have a few repos set up for you:

- https://github.com/tangrams/browserify-tangram-boilerplate
- https://github.com/tangrams/webpack-tangram-boilerplate
- https://github.com/tangrams/react-webpack-tangram-boilerplate

If you'd like to learn how to set up repos like these from scratch, here are some guides for bundling and using Tangram with the two most popular bundling tools, Browserify and Webpack, on Mac OS X.

- [Browserify Bundling Guide](#browserify-bundling-guide)
- [Webpack Bundling Guide](#webpack-bundling-guide)

# Browserify Bundling Guide

Browserify is the original gangsta of node-style CommonJS module importing in the browser. Here's how to more-or-less recreate the [browserify-tangram-boilerplate](https://github.com/tangrams/browserify-tangram-boilerplate) repo. (This guide assumes you have the latest version of [node.js](https://nodejs.org/download/) installed – it comes with npm.)

Start the same way you do every day, with a fresh, empty directory:

`mkdir tangram-browserify-surprise`
`cd tangram-browserify-surprise`

The surprise is that it works.

Start your npm journey by creating a package.json file, which will organize your expeditionary forces:

`npm init`

You will be asked 10 impertinent questions. Just hit "enter" 10 times and it will all be over.

Next, tell your package.json file that your project has two dependencies, Leaflet and Tangram:

```bash
npm install --save Leaflet
npm install --save Tangram
```

The `npm install` command will download these two libraries and stash them in a directory called "node_modules" – the `--save` option adds these to your package.json "dependencies" section. (If you open package.json now you'll see them.)

Then, tell it that you want to use two other dependencies for development:

```bash
npm install --save-dev Browserify
npm install --save-dev http-server
```

These requirements will be added to your package.json's "dev-dependencies" section. (There's not really any difference between these two for us now, but it's a nice habit to get into for when you're making your own npm packages.) Now on to the code!

First, you'll need a ticket to ride the Mapzen API train. Use your Mapzen account to pick up a free API key here: https://mapzen.com/dashboard. It'll look like `mapzen-XXXXXXX` but with fewer `X`s.

If you don't have a Mapzen account, you'll need to make one to get a key. To do that, you'll need either a [github](http://github.com) account (which is cool and fun) or an email address. If you don't have an email address I salute you, and wish you luck.

Once you get an API key, write it down on a sticky note and affix it to the bottom of your monitor. If you don't do this the next steps won't make sense.

Now we need two more files, `main.js` and our old friend `index.html`. Let's create them like we're on the Sistine Chapel ceiling:

`touch main.js index.html`

Here's some sample code for `main.js` – notice the `require` statements at the top? Those are the good parts. When you're done noticing, replace the part that says `YOUR-KEY-HERE` with the key from the sticky note affixed to the bottom of your monitor.

```javascript
var L = require('leaflet');
var Tangram = require('tangram');

var map = L.map('map');
var layer = Tangram.leafletLayer({
  scene: {
    'import': 'https://mapzen.com/carto/bubble-wrap-style/8/bubble-wrap-style.zip',
    // TODO: get your own API key at https://mapzen.com/dashboard/. It's free!
    'global': { 'sdk_mapzen_api_key': 'YOUR-KEY-HERE' }
  },
  attribution: '<a href="https://mapzen.com/tangram">Tangram</a> | &copy; OSM contributors | <a href="https://mapzen.com/">Mapzen</a>'
});

layer.addTo(map);

map.setView([40.70531887544228, -74.00976419448853], 15); // Yo! NYC maps
```

Now over to our old friend `index.html`.

```html
<html>
  <head>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.0.3/dist/leaflet.css">
    <style>
      /* make the map full-screen */
      #map {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <!-- This bundle is created by Browserify and includes application code, Leaflet, and Tangram. -->
    <script src="./bundle.js"></script>
  </body>
</html>
```

The `stylesheet` link is so that if you use any styled Leaflet components like markers or popups, they'll look right.

The `<script src="./bundle.js"></script>` tag is the whole point of bundling – it's all the JavaScript code necessary, from all the sources, including Leaflet, Tangram, and main.js, all wrapped up together – "bundled," if you will – into a single JavaScript file. No matter what happens to your project, which libraries you add, update, or remove, that file will always be there, silent, waiting.

But we're a bit ahead of ourselves – we haven't told the bundler to bundle the bundle yet. Here's the magic spell:

`browserify main.js -o bundle.js`

Now, because we installed it earlier, you can start an http server with:

`http-server`

Then follow your server right this way, we have a table waiting for you at http://localhost:8080!

Remember: if you slip up somewhere and leave out your API key or flub a filename, you'll have to run that `browserify` command again to update `bundle.js`.


# Webpack Bundling Guide

Webpack is a bit more flexible with its imports – it allows CommonJS "require" statements, but its default is the ES6 "import" syntax. Here's how to more-or-less recreate the [webpack-tangram-boilerplate](https://github.com/tangrams/webpack-tangram-boilerplate) repo. (This guide assumes you have the latest version of [node.js](https://nodejs.org/download/) installed – it comes with npm.)

Start the day right with a freshly-squeezed empty directory:

`mkdir tangram-webpack-surprise`
`cd tangram-webpack-surprise`

The surprise is that I used the same joke twice on one page.

Kick things off with an inaugural package.json file:

`npm init`

Once that's over with, tell your package.json file that your project has two dependencies, Leaflet and Tangram:

```bash
npm install --save Leaflet
npm install --save Tangram
```

The `npm install` command downloads these two libraries and stash them in a directory called "node_modules" – the `--save` option adds them to your package.json "dependencies" section. (If you open package.json now you'll see them.)

Then, tell it that you want to use two other dependencies for development:

```bash
npm install --save-dev Webpack
npm install --save-dev http-server
```

These requirements will be downloaded and added to your package.json's "dev-dependencies" section. (There's no practical difference between these two for us now, but it's a nice habit to get into for when you're publishing your own npm packages.) Now on to the code!

First, you'll need a free Mapzen API key. They're like Bitcoin, but free. Get yours here: https://mapzen.com/dashboard. It'll look like `mapzen-XXXXXXX`, but different.

If you don't have a Mapzen account, you'll need to make one to get a key. To do that, you'll need either a [github](http://github.com) account (which is cool and fun) or an email address. Counseling you on your resistance to either of those technologies is beyond the scope of this guide.

Once you get an API key, write it down backwards on your forehead, unless you can read backwards writing easier than you can write it. If this is the case, don't worry, it's very common.

Now we need two more files, `main.js` and our trusty steed `index.html`. Let's create them from pure nothingness:

`touch main.js index.html`

Here's some sample code for `main.js` – the `import` statements at the top are the ES6 version of the CommonJS `require` statements. I don't know why one is better than the other, but I'm sure somebody has an opinion about that. Now, replace the part that says `YOUR-KEY-HERE` with what you see on your forehead when you look in a mirror, unless you wrote it forwards, in which case you're on your own.

```javascript
import L from 'leaflet';
import Tangram from 'tangram';

var map = L.map('map');
var layer = Tangram.leafletLayer({
  scene: {
    'import': 'https://mapzen.com/carto/bubble-wrap-style/8/bubble-wrap-style.zip',
    // TODO: get your own API key at https://mapzen.com/dashboard/. It's free!
    'global': { 'sdk_mapzen_api_key': 'YOUR-KEY-HERE' }
  },
  attribution: '<a href="https://mapzen.com/tangram">Tangram</a> | &copy; OSM contributors | <a href="https://mapzen.com/">Mapzen</a>'
});

layer.addTo(map);

map.setView([40.70531887544228, -74.00976419448853], 15); // A small island off the coast of America
```

Now over to our trusty steed `index.html`. This is functionally the same as the Browserify example:

```html
<html>
  <head>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.0.3/dist/leaflet.css">
    <style>
      /* make the map full-screen */
      #map {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <!-- This bundle is created by Webpack and includes application code, Leaflet, and Tangram. -->
    <script src="./bundle.js"></script>
  </body>
</html>
```

But wait! Webpack needs one more file:

`touch webpack.config.js`

Open it and paste in:

```javascript
module.exports = {
  entry: './main.js',
  output: {
    filename: './bundle.js'
  },
  module: {
    // Apply `noParse` to Tangram to prevent mangling of UMD boilerplate
    noParse: /tangram\/dist\/tangram/
  }
};
```

In many cases, this file wouldn't be necessary, but there's a gotcha: webpack's default code-optimization routines are a bit rough on Tangram. That `noParse` option prevents many hours of debugging weird and seemingly-unrelated console errors.

Ready to roll! Tell webpack to pack that web:

`webpack`

Now, because we thought ahead, you can start an http server with:

`http-server`

Then set your sights on http://localhost:8080 and feast your eyes on a map of Lower Manhattan.

Remember: if you slip up somewhere and leave out your API key or flub a filename, you'll have to run that `webpack` command again to update the bundle.
