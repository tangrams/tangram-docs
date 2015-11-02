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
        type: GeoJson
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

_URLs_ should be "schemeless," meaning without the "http:" at the beginning – this ensures that they will be loaded correctly under both http and https.

```yaml
sources:
    osm:
        type: MVT
        url:  //vector.mapzen.com/osm/all/{z}/{x}/{y}.mvt
```

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
    url: http://{s:[a,b,c,d]}.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6-dev/{z}/{x}/{y}.vector.pbf?access_token=pk.eyJ1IjoiYmNhbXBlciIsImJiOiJWUmh3anY0In0.1fgSTNWpQV8-5sBjGbBzGg
```

#### `max_zoom`
Optional _integer_. No default.

Sets the highest zoom level which will be requested from the datasource. At higher zoom levels, the data from this zoom level will continue to be displayed.

```yaml
sources:
    local:
        type: GeoJson
        url: localhost:8000//tiles/{x}-{y}-{z}.json
        max-zoom: 15
```

####`enforce_winding`
Optional _boolean_. Default for tiled data sources is _false_; default for non-tiled data sources is _true_.

Allows the default to be overridden, for cases where a tiled data source has inconsistent winding order, or for non-tiled sources which are known to be consistent (this can save a small amount of computation).

If a data source has inconsistent winding order, it will manifest as missing vertical surfaces on buildings or other extruded elements.

```yaml
sources:
   osm:
        type: GeoJSON
        url:  http://vector.someothertileservice.com/osm/all/{z}/{x}/{y}.json
        enforce_winding: true # reverse the default, because this source has winding problems
    schools:
        type: GeoJSON
        url: demos/data/school-districts-polygon.geojson
        enforce_winding: false # default for non-tiled sources is true
```

####`scripts`
Optional _[strings]_, specifying the URL of a JavaScript file.

These scripts will be loaded before the data is processed.

```yaml
scripts: [ 'http://url.com/js/script.js', 'local_script.js']
```

####`extra_data`
Optional _[strings]_, specifying the URL of a data file.

This data is made available to `transform` functions as a separate parameter.

```yaml
scripts: [ 'http://url.com/js/script.js', 'local_script.js']

transform: |
    function (data, extra_data) {
        // manipulate data with extra_data
        return data;
    }
```

####`transform`
Optional _function_.

This allows the data to be manipulated before it is sent to the geometry builders.

```yaml
transform: |
    function (data) {
        // manipulate data
        return data;
    }
```

## examples

```yaml
# Mapzen tiles in TopoJSON format
mapzen-topojson:
    type: TopoJSON
    url: http://vector.mapzen.com/osm/all/{z}/{x}/{y}.topojson

# Mapzen tiles in GeoJSON format
mapzen-geojson:
    type: GeoJSON
    url: http://vector.mapzen.com/osm/all/{z}/{x}/{y}.json


# Mapzen tiles in Mapbox Vector Tile format
mapzen:
    type: MVT
    url: http://vector.mapzen.com/osm/all/{z}/{x}/{y}.mvt
```

All of our demos were created using the [Mapzen Vector Tiles](https://github.com/mapzen/vector-datasource) service, which hosts tiled [OpenStreetMap](http://openstreetmap.org) data.
