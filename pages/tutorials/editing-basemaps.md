Mapzen has published a number of stylish yet functional [basemaps](https://mapzen.com/products/maps/), equally suitable for the home or office. They can be used as standalone Leaflet layers using [Mapzen.js](https://mapzen.com/documentation/mapzen-js/):

```javascript
var map = L.Mapzen.map('map', {
  center: [40.74429, -73.99035],
  zoom: 15,
  scene: L.Mapzen.BasemapStyles.Refill
})
```

Or, you can put your own data on top of them with [Tangram](https://mapzen.com/products/tangram/), using the [`import`](https://mapzen.com/documentation/tangram/import/) feature.

```yaml
import: https://www.nextzen.org/carto/walkabout-style/walkabout-style.yaml

global:
    sdk_mapzen_api_key: mapzen-xxxxxxx     # set this value to your Mapzen API key

sources:
    _mine:
        type: GeoJSON
        url: https://gist.githubusercontent.com/anonymous/3a123362d5154004c8627c58861fd4ad/raw/158818805546eb51caac93d7f6c029c744bc9d7e/map.geojson

layers:
    _blob:
        data: { source: _mine }
        draw:
            polygons:
                order: 360
                color: [.5, 1, .5]
            lines:
                order: 361
                width: 5px
                color: [.5, .5, 1]
```

![refill basemap with custom data on top](https://tangrams.github.io/tangram-docs/tutorials/editing-basemaps/editing-basemaps1.jpg)
[( Open this example in Play ▶)](https://mapzen.com/tangram/play/?scene=https://tangrams.github.io/tangram-docs/tutorials/editing-basemaps/editing-basemaps1.yaml&lines=1#5/38.720/-79.717)

But what if you want to customize the house style itself? This is a bit trickier, and involves a bit of detective work.

First, you must know which features you wish to modify. The broader the class of features you want to change, the trickier it will be to change them. In our house styles, a given feature may be affected by multiple sets of drawing rules, with slightly different styles for various sub-classifications of the data, and at various zoom levels. So, once you've picked a feature to modify, you must understand how that feature is currently drawn.

## Basic Style Override

Before we start pulling apart a house style, let's start with a simpler example to see a basic style override. Here's a very basic Tangram scene file:

```yaml
sources:
    nextzen:
        type: TopoJSON
        url: https://tile.nextzen.org/tilezen/vector/v1/all/{z}/{x}/{y}.topojson?api_key=xxxxxxx
scene:
    background:
        color: white
layers:
    roads:
        data: { source: nextzen }
        draw:
            lines:
                color: gray
                width: 2px
        major_road:
            filter: { kind: major_road }
            draw:
                lines:
                    color: '#cc6666'
                    width: 2px
```
![simple road map](https://tangrams.github.io/tangram-docs/tutorials/editing-basemaps/editing-basemaps2.jpg)
[( Open in Play ▶)](https://mapzen.com/tangram/play/?scene=https://tangrams.github.io/tangram-docs/tutorials/editing-basemaps/simple-basemap.yaml#11.8002/41.3381/69.2698)

This scene file can be imported as a base style in another Tangram scene file, like so:

```yaml
import: https://tangrams.github.io/tangram-docs/tutorials/editing-basemaps/simple-basemap.yaml
```

Once it's been imported, to modify it, first identify the parameter you want to change. Then re-declare that parameter's whole branch, starting at the root level and terminating with the new parameter, including the new value. This will tell Tangram exactly which value you want to replace.

As an example, let's change the `color` of the `major_road` sublayer. We don't need to include any of the other parameters in that layer, unless we want to change them – they already exist in the imported style, and will still take effect.

```yaml
import: https://tangrams.github.io/tangram-docs/tutorials/editing-basemaps/simple-basemap.yaml

layers:
    roads:
        major_road:
            draw:
                lines:
                    color: orange
```
![simple map with colored major roads](https://tangrams.github.io/tangram-docs/tutorials/editing-basemaps/editing-basemaps3.jpg)
[( Open in Play ▶)](https://mapzen.com/tangram/play/?scene=https://tangrams.github.io/tangram-docs/tutorials/editing-basemaps/editing-basemaps3.yaml#11.8002/41.3381/69.2698)

## Customizing a House Style

The Mapzen house styles are significantly more complex. Take the case of [Refill](https://github.com/tangrams/refill-style), which is deceptively simple-looking. Though it is monochrome, it includes dozens of places where road color is specified, depending on the classification of road, its datasource, even the zoom level at which it's drawn. This means you'll have to change color values in many places.

So let's try it. First, download the Refill scene file and look it over in the text editor of your choice: https://www.nextzen.org/carto/refill-style-no-labels/6/refill-style-no-labels.yaml

(We'll be working with version 6 of the Refill style. As Mapzen's basemap styles are still in active development we recommend pegging an import to a specific major version, so you enjoy any minor and patch updates but are ensured of stable named scene elements. See the [cartography docs](https://mapzen.com/documentation/cartography/versioning/) for info and current [major versions](https://mapzen.com/documentation/cartography/styles/).)

Once you have the scene file open, search for the "roads" layer, which can be found by searching for `roads:` – it starts like this:

```yaml
roads:
    data: { source: nextzen, layer: roads }
    filter: { not: { kind: rail } }
    draw:
        lines:
        ...
```

Copy the entire "roads" layer into a new document in an editor somewhere. If your editor allows you to edit in multiple places at once (such as Sublime Text, with its Command+D "Quick Add Next" option), that feature will come in handy for the next step.

We want to delete any branch which doesn't end with a `lines: color:` – so all of the `filter` declarations, all the `width` declarations, any other draw style blocks like `polygon` or `point`, and even the `outline` declarations – all of those and their descendants can be deleted.

For example, this block:

```yaml
minor_road:
    filter: { kind: minor_road }
    draw:
        lines:
            color: [[12, global.minor_road1], [17, global.minor_road2]]
            width: [[12, 1.0px], [14, 1.5px], [15, 3px], [16, 5m]]
            outline:
                width: [[12, 0px], [14, .5px], [17, 1px]]
```

Would become this:

```yaml
minor_road:
    draw:
        lines:
            color: [[12, global.minor_road1], [17, global.minor_road2]]
```

The result will be a big tree, with every branch terminating with a `lines` block with a single `color` parameter underneath. Once you have that, celebrate by changing all those color values to something festive. Red is a classic choice:

```yaml
minor_road:
    draw:
        lines:
            color: red
```

As of this writing, the roads layer is almost 1400 lines long, but after editing, it should be closer to 200 – and all made up of `color` declarations.

Paste this layer into your new scene file under a `layers` object, just below the `import` object, and all of your custom color declarations will overwrite the ones in the import.

Here's an example scene file: https://github.com/tangrams/tangram-docs/blob/gh-pages/tutorials/editing-basemaps/editing-basemaps4.yaml

And here's what it looks like rendered by Tangram:

![Refill with red roads](https://tangrams.github.io/tangram-docs/tutorials/editing-basemaps/editing-basemaps4.jpg)
[( Open in Play ▶)](https://mapzen.com/tangram/play/?scene=https://tangrams.github.io/tangram-docs/tutorials/editing-basemaps/editing-basemaps4.yaml#11.8002/41.3381/69.2698)

Congratulations! Those are the basics of customizing an imported scene file. In fact, there are no advanced techniques – that's it.

Questions? Comments? Drop us a line [on GitHub](http://github.com/tangrams/tangram/issues), [on Twitter](http://twitter.com/tangramjs), or [via email](mailto:tangram@mapzen.com).