*This is the technical documentation for Tangram's `sources` block. For a conceptual overview of the way Tangram works with data sources, see the [Filters Overview](Filters-Overview.md).*

## `sources`
The `sources` element is a required top-level element in a Tangram scene file. It declares the beginning of a `sources` block. It takes only one kind of parameter: the _source name_. Any number of _source names_ can be declared.

```yaml
sources:
    # Mapzen tiles in TopoJSON format
    mapzen-topojson:
        type: TopoJSON
        url: https://tile.mapzen.com/mapzen/vector/v1/all/{z}/{x}/{y}.topojson

    # Mapzen tiles in GeoJSON format
    mapzen-geojson:
        type: GeoJSON
        url: https://tile.mapzen.com/mapzen/vector/v1/all/{z}/{x}/{y}.json

    # Mapzen tiles in Mapbox Vector Tile format
    mapzen-mvt:
        type: MVT
        url: https://tile.mapzen.com/mapzen/vector/v1/all/{z}/{x}/{y}.mvt

    # Mapzen terrain tiles
    mapzen-terrain:
        type: Raster
        url: https://tile.mapzen.com/mapzen/terrain/v1/normal/{z}/{x}/{y}.png
```

All of our demos were created using the [Mapzen Vector Tiles](https://github.com/mapzen/vector-datasource) service, which hosts tiled [OpenStreetMap](http://openstreetmap.org) data.

#### source names
Required _string_, can be anything. No default.

Specifies the beginning of a source block.

The source below is named `mapzen`:
```yaml
sources:
    mapzen:
        type: GeoJSON
        url: https://tile.mapzen.com/mapzen/vector/v1/all/{z}/{x}/{y}.json
```

### required source parameters
Source objects can take a number of parameters – only [`type`](#type) and [`url`](#url) are required.

#### type
Required _string_. Sets the type of the datasource. No default.

Four options are currently supported:

- `TopoJSON`
- `GeoJSON`
- `MVT` (Mapbox Vector Tiles)
- `Raster`

Note that these names are _case-sensitive_. As of v0.2, Tangram supports either tiled or untiled datasources.

Note: Tangram expects tiles in `TopoJSON` or `GeoJSON` formats to contain latitude-longitude coordinates.

#### url
Required _string_. Specifies the source's _URL_. No default.

```yaml
sources:
    mapzen:
        type: MVT
        url: https://tile.mapzen.com/mapzen/vector/v1/all/{z}/{x}/{y}.mvt
```

The URL to a tiled datasource will include special tokens ("{x}", "{z}", etc.) which will be automatically replaced with the appropriate position and zoom coordinates to fetch the correct tile at a given point. Use of `https://` (SSL) is recommended when possible, to avoid browser security warnings: in cases where the page hosting the map is loaded securely via `https://`, most browsers require other resources including tiles to be as well).

Various tilesources may have differing URL schemes, and use of `http://` may still be useful for local development, for example:

```yaml
sources:
    local:
        type: GeoJSON
        url: http://localhost:8000/tiles/{x}-{y}-{z}.json
```

An untiled datasource will have a simple _URL_ to a single file:

```yaml
sources:
    overlay:
        type: GeoJSON
        url: overlay.json
```

Relative _URLs_ are relative to the scene file's location. In the above example, "overlay.json" should be in the same directory as the scene file.

##### layers
Depending on the datasource, you may be able to request specific layers from the tiles by modifying the url:

```yaml
# all layers
https://tile.mapzen.com/mapzen/vector/v1/all/{z}/{x}/{y}.json

# building layer only
https://tile.mapzen.com/mapzen/vector/v1/buildings/{z}/{x}/{y}.topojson
```

##### curly braces
When tiles are requested, Tangram will parse the datasource url and interpret items in curly braces according to conventions used by Leaflet and others. Tangram currently supports `{x}` `{y}` for tile coordinates and `{z}` for zoom level, as well as `{s}` for subdomain when paired with the [`url_subdomains`](#url_subdomains) parameter.

```yaml
mapzen:
    type: TopoJSON
    url: https://tile.mapzen.com/mapzen/vector/v1/all/{z}/{x}/{y}.topojson
```

In the example above, Tangram will automatically replace `{x}`, `{y}`, and `{z}` with the correct tile coordinates and zoom level for each tile, depending on which tiles are visible in the current scene, and the result will be something like:

`https://tile.mapzen.com/mapzen/vector/v1/all/16/19296/24640.topojson`

#### url_subdomains

If an `{s}` parameter is used in a url, the `url_subdomains` parameter should define an array specifying the subdomains to be used in tile requests:

```yaml
sources:
    source-name:
        type: MVT
        url: https://{s}.some-tile-server.com/{z}/{y}/{x}.mvt
        url_subdomains: [a, b, c]
```

This example would cause the following hosts to be used for tile requests:

https://a.some-tile-server.com/{z}/{y}/{x}.mvt
https://b.some-tile-server.com/{z}/{y}/{x}.mvt
https://c.some-tile-server.com/{z}/{y}/{x}.mvt

##### access tokens
The `url` may require an access token:

```yaml
mapbox:
    type: MVT
    url: https://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6-dev/{z}/{x}/{y}.vector.pbf?access_token=...
```

##### MBTiles

[[ES-only](https://github.com/tangrams/tangram-es)] If the _URL_ of a data source has a file extension of `.mbtiles` then the specified file will be accessed as an MBTiles database and used as a tile set according to the MBTiles specification (following the proposed [version 2.0](https://github.com/pnorman/mbtiles-spec/blob/2.0/2.0/spec.md)).

In addition to PNG and JPEG raster tiles, MBTiles can also provide vector tiles using any of the supported [`type`](#type) values. The `type` for an MBTiles data source should match the format of the tile data in the MBTiles database.

Here is an example configuration of an MBTiles source:

```yaml
mbtiles-source:
    type: TopoJSON # The source expects TopoJSON tile data.
    url: data/tileset.mbtiles # The MBTiles file is located relative to the scene file.
    max_zoom: 16 # Other parameters are applied as usual.
```

If you are developing an Android application that uses an MBTiles file located in external storage, your application will need to [request permissions](https://developer.android.com/training/permissions/index.html) to read the file.

### optional source parameters

#### `bounds`
Optional _array of lat/lngs_. No default.

The `bounds` of a data source are specified as a single, flattened 4-element array of lat/lng values, in the order `[w, s, e, n]`. When specified, tiles for this datasource will not be requested outside of this bounding box.

```yaml
sources:
    mapzen:    
        type: TopoJSON
        url: https://tile.mapzen.com/mapzen/vector/v1/all/{z}/{x}/{y}.topojson
        bounds: [-74.1274, 40.5780, -73.8004, 40.8253] # [w, s, e, n]
```

#### `enforce_winding`
*This parameter has been deprecated as of Tangram JS v0.5.1. The deprecation is backwards compatible, and data sources will behave correctly with or without this parameter*.

#### `scripts`
[[JS-only](https://github.com/tangrams/tangram)] Optional _[strings]_, specifying the URL of a JavaScript file.

These scripts will be loaded before the data is processed so that they are available to the [`transform`](sources.md#transform) function.

```yaml
scripts: [ 'https://url.com/js/script.js', 'local_script.js']
```

#### `tms`
Setting `tms: true` on the source will enable support for the TMS tile coordinate protocol.

```yaml
sources:
    mapzen:    
        type: TopoJSON
        url: http://demo.opengeo.org/geoserver/gwc/service/tms/ 1.0.0/ne:ne@EPSG:900913@png/{z}/{x}/{y}.png
        tms: true
```

#### `extra_data`
[[JS-only](https://github.com/tangrams/tangram)] Optional _YAML_, defining custom data to be used in post-processing.

This data is made available to `transform` functions as the second parameter. `extra_data` could also be manipulated dynamically at run-time, via the `scene.config` variable (the serialized form of the scene file); for example, `scene.config.sources.source_name.extra_data` could be assigned an arbitrary JSON object, after which `scene.rebuild()` could be called to re-process the tile data.

```yaml
extra_data:
    Broadway: Wide St.
    Wall St.: Tall St.
    Water St.: Wine St.

transform: |
    function (data, extra_data) {
        // manipulate data with extra_data
        var keys = Object.keys(extra_data);
        if (data.roads) {
            data.roads.features.forEach(function(feature) {
                if (extra_data[feature.properties.name]) {
                    feature.properties.name = extra_data[feature.properties.name]; // selectively rename features
                }
            });
        }
        return data;
    }
```

#### `filtering`
Optional _string_, one of `mipmap`, `linear`, or `nearest`. Default is `mipmap` for images with dimensions which are powers of two (e.g. 256 or 512) and `linear` for non-power-of-two images.

Sets a texture filtering mode to be set for `Raster` sources only.

Raster tiles are generally power-of-two. Other sizes are scaled to fit the tile square.

Setting `filtering: nearest` allows for the raster tiles to be pixelated when scaled past their max_zoom.

#### `generate_label_centroids`
Optional _boolean_. Default is _false_.

A toggle for creating labels at the centroids of polygons for non-tiled GeoJSON and TopoJSON sources.

When set to `true` new _point_ geometries will be added to the data source, one located at the geometrical center (or "centroid") of every _polygon_. Each point will receive a [`{"label_placement" : "true"}`](Filters-Overview.md#label_placement) property which may be filtered against, as well as a copy of the associated feature's properties.

This allows a single label to be placed at the centroid of a polygon region, instead of multiple labels when the polygon is tiled.

If the feature in question is a multipolygon, the centroid _point_ will be added to the largest polygon in the group.

```yaml
sources:
    local:
        type: GeoJSON
        url: https://tile.mapzen.com/mapzen/vector/v1/all/{z}/{x}/{y}.json
        max_zoom: 15
        generate_label_centroids: true
```

#### `max_display_zoom`, `min_display_zoom`
Optional _integer_. No default.

`max_display_zoom` sets the highest zoom level which will be requested from the datasource. `min_display_zoom` sets the lowest zoom level which will be requested from the datasource. Outside of this range, tiles will not be requested nor displayed.

```yaml
sources:
    local:
        type: GeoJSON
        url: https://tile.mapzen.com/mapzen/vector/v1/all/{z}/{x}/{y}.json
        min_display_zoom: 9
        max_display_zoom: 18
```

#### `max_zoom`
Optional _integer_. Default is _18_.

Sets the highest zoom level which will be requested from the datasource. At higher zoom levels, the data from this zoom level will continue to be displayed.

There is no corresponding `min_zoom` parameter, for reasons of performance.

```yaml
sources:
    local:
        type: GeoJSON
        url: https://tile.mapzen.com/mapzen/vector/v1/all/{z}/{x}/{y}.json
        max_zoom: 15
```

#### `rasters`
Optional _list_ of `Raster` sources to be "attached" to the `source`. No default for non-`Raster` sources. A `Raster` source is available to itself by default.

Attaching a `Raster` to another `source` makes that `Raster` available to any shaders used to draw that `source` via the [`sampleRaster()`](styles.md#raster) function.

(See [Geometry Masking](Raster-Overview.md#Geometry-Masking) for examples.)

**Note:** a simple _string_ value will not function correctly – even a single `raster` must be in _list_ format, e.g. surrounded by square brackets:

```yaml
sources:
  terrain-normals:
      type: Raster
      url: https://tile.mapzen.com/mapzen/terrain/v1/normal/{z}/{x}/{y}.png
```

When a `Raster` source itself has additional raster sources set in the `rasters` property, the "parent" source will be the first raster sampler, and those from `rasters` will be added afterward. (essentially it is as if the parent source was inserted as the first item in the rasters array).

For more, see the [Raster Overview](Raster-Overview.md).

#### `tile_size`
Optional _int_. Must be a power of 2, greater than or equal to `256`. Default is `256`. No units.

This specifies the size in pixels that each map tile will cover in the viewport (when the camera is positioned top-down). Traditionally map tiles for the "web Mercator" projection are 256x256 pixels, but some tile services now provide tiles intended for display at 512x512 pixels as well.

For backwards compatability, Tangram will fetch the zoom level which would cover the equivalent geographical area as a traditional 256px tile. For instance, `tile_size: 512` will cause tiles from _one zoom level lower_ than the current view zoom.

```yaml
sources:
   mapzen:
      type: ...
      url: ...
      tile_size: 512
```

#### `transform`
[[JS-only](https://github.com/tangrams/tangram)] Optional _function_.

This allows the data to be manipulated *after* it is loaded but *before* it is styled. Transform functions are useful for custom post-processing, either where you may not have direct control over the source data, or where you have a dynamic manipulation you would like to perform that incorporates other data separate from the source. The `transform` function is passed a `data` object, with a GeoJSON FeatureCollection assigned to each layer name, e.g. `data.buildings` would provide data from the `buildings` layer, with individual features accessible in `data.buildings.features`.

The `transform` function is supported for all tiled and untiled GeoJSON, TopoJSON, and MVT data sources.

```yaml
transform: |
    function (data) {
        // manipulate data
        if (data.roads) {
            data.roads.features.forEach(function(feature) {
                if (feature.properties.name) {
                    feature.properties.name += ' test!'; // add a string to each feature name
                }
            });
        }
        return data;
    }
```

#### `url_params`
Optional _object_. No default.

The `url_params` block can contain any number of key-value pairs which will be appended to the source `url`. This allows the dynamic definition of parameters such as queries or api keys.

```yaml
sources:
    vector-tiles:
        url: https://tile.mapzen.com/mapzen/vector/v1/all/{z}/{x}/{y}.topojson
        url_params:
            api_key: vector-tiles-h2UV1dw
```
