*This is the technical documentation for Tangram's `sources` block. For a conceptual overview of the way Tangram works with data sources, see the [Filters Overview](Filters-Overview.md).*

## `sources`
The `sources` element is a required top-level element in a Tangram scene file. It declares the beginning of a `sources` block. It takes only one kind of parameter: the _source name_. Any number of _source names_ can be declared.

#### source names
Required _string_, can be anything. No default.

Specifies the beginning of a source block.

The source below is named `osm`:
```yaml
sources:
    osm:
        type: GeoJSON
        url:  http://vector.mapzen.com/osm/all/{z}/{x}/{y}.json
```

#### type
Required _string_. Sets the type of the datasource. No default.

Three options are currently supported:

- `TopoJSON`
- `GeoJSON`
- `MVT` (Mapbox Vector Tiles)

As of v0.2, Tangram supports either tiled or untiled datasources.

#### url
Required _string_. Specifies the source's _URL_. No default.

```yaml
sources:
    osm:
        type: MVT
        url:  https://vector.mapzen.com/osm/all/{z}/{x}/{y}.mvt
```

For the JS version of Tangram _URLs_ can be "schemeless," meaning without the "http:" at the beginning – this ensures that they will be loaded correctly under both http and https.

The URL to a tiled datasource will include special tokens ("{x}", "{z}", etc.) which will be automatically replaced with the appropriate position and zoom coordinates to fetch the correct tile at a given point. Various tilesources may have differing URL schemes.

```yaml
sources:
    local:
        type: GeoJSON
        url:  //localhost:8000/tiles/{x}-{y}-{z}.json
```

An untiled datasource will have a simple _URL_ to a single file:

```yaml
sources:
    overlay:
        type: GeoJSON
        url:  overlay.json
```

Relative _URLs_ are relative to the scene file's location. In the above example, "overlay.json" should be in the same directory as the scene file.

##### layers
Depending on the datasource, you may be able to request specific layers from the tiles by modifying the url:

```yaml
# all layers
http://vector.mapzen.com/osm/all/{z}/{x}/{y}.json

# building layer only
http://vector.mapzen.com/osm/buildings/{z}/{x}/{y}.json
```

##### curly braces
When tiles are requested, Tangram will parse the datasource url and interpret items in curly braces according to the convention used by Leaflet and others,  replacing e.g. `{z}` with the appropriate zoom level.

##### access tokens
The `url` may require an access token:

```yaml
mapbox:
    type: MVT
    url: http://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6-dev/{z}/{x}/{y}.vector.pbf?access_token=...
```

#### `max_zoom`
Optional _integer_. Default is _18_.

Sets the highest zoom level which will be requested from the datasource. At higher zoom levels, the data from this zoom level will continue to be displayed.

```yaml
sources:
    local:
        type: GeoJSON
        url: //localhost:8000/tiles/{x}-{y}-{z}.json
        max_zoom: 15
```

####`enforce_winding`
*This parameter has been deprecated as of Tangram JS v0.5.1. The deprecation is backwards compatible, and data sources will behave correctly with or without this parameter*.

####`scripts`
Optional _[strings]_, specifying the URL of a JavaScript file.

These scripts will be loaded before the data is processed so that they are available to the `transform` function.

```yaml
scripts: [ 'http://url.com/js/script.js', 'local_script.js']
```

####`extra_data`
Optional _YAML_, defining custom data to be used in post-processing.

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

####`transform`
Optional _function_.

This allows the data to be manipulated *after* it is loaded but *before* it is styled. Transform functions are useful for custom post-processing, either where you may not have direct control over the source data, or where you have a dynamic manipulation you would like to perform that incorporates other data separate from the source. The `transform` function is passed a `data` object, with a GeoJSON FeatureCollection assigned to each layer name, e.g. `data.buildings` would provide data from the `buildings` layer, with individual features accessible in `data.buildings.features`. 

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

## examples

```yaml
# Mapzen tiles in TopoJSON format
mapzen:
    type: TopoJSON
    url: http://vector.mapzen.com/osm/all/{z}/{x}/{y}.topojson

# Mapzen tiles in GeoJSON format
mapzen:
    type: GeoJSON
    url: http://vector.mapzen.com/osm/all/{z}/{x}/{y}.json

# Mapzen tiles in Mapbox Vector Tile format
mapzen:
    type: MVT
    url: http://vector.mapzen.com/osm/all/{z}/{x}/{y}.mvt
```

All of our demos were created using the [Mapzen Vector Tiles](https://github.com/mapzen/vector-datasource) service, which hosts tiled [OpenStreetMap](http://openstreetmap.org) data.
