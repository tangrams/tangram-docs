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
        type: GeoJSONTiles
        url:  http://vector.mapzen.com/osm/all/{z}/{x}/{y}.json
```

#### type
Required _string_, no default. Three options are currently supported:

- `TopoJSONTiles`
- `GeoJSONTiles`
- `MVT` (Mapbox Vector Tiles)

#### url
Required _string_. Specifies the source's _URL_.

```yaml
sources:
    osm:
        type: MVT
        url:  http://vector.mapzen.com/osm/all/{z}/{x}/{y}.mvt
```

Other datasources may have different URL schemes:

```yaml
sources:
    local:
        type: GeoJSONTiles
        url:  http://localhost:8000/tiles/{x}-{y}-{z}.json
```

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

#### `max-zoom`
Optional _integer_.

Sets the highest zoom level which will be requested from the datasource. At higher zoom levels, the data from this zoom level will continue to be displayed.

```yaml
sources:
    local:
        type: GeoJSONTiles
        url: localhost:8000//tiles/{x}-{y}-{z}.json
        max-zoom: 15
```

## examples

```yaml
mapzen:
    type: MVT
    url: http://vector.mapzen.com/osm/all/{z}/{x}/{y}.mvt

mapzen-geojson:
    type: GeoJSONTiles
    url: http://vector.mapzen.com/osm/all/{z}/{x}/{y}.json

local:
    type: GeoJSONTiles
    url: http://localhost:8080/all/{z}/{x}/{y}.json

mapzen-topojson:
    type: TopoJSON
    url: http://vector.mapzen.com/osm/all/{z}/{x}/{y}.topojson

osm:
    type: GeoJSONTiles
    url: http://tile.openstreetmap.us/vectiles-all/{z}/{x}/{y}.json

mapbox:
    type: MVT
    url: http://{s:[a,b,c,d]}.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6-dev/{z}/{x}/{y}.vector.pbf?access_token=pk.eyJ1IjoiYmNhbXBlciIsImEiOiJWUmh3anY0In0.1fgSTNWpQV8-5sBjGbBzGg
    max_zoom: 15
```

All of our demos were created using the [Mapzen Vector Tiles](https://github.com/mapzen/vector-datasource) service, which hosts tiled [OpenStreetMap](http://openstreetmap.org) data.