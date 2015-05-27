**Filters** are used to apply styling rules to specific parts of your data. Filters may be used on two kinds of geojson objects: `FeatureCollections` and `Feature` `properties`.

## FeatureCollection

Say you have a geojson map tile structured like this:

``` yaml
{"buildings": {"type": "FeatureCollection", "features": [...] } }
{"places": {"type": "FeatureCollection", "features": [...] } }
{"roads": {"type": "FeatureCollection", "features": [...] } }
```

A top-level filter is used to associate one of these `FeatureCollections` with a custom named `layer`, and is defined under the `geometry` object, like so:

``` yaml
layers:
    my_buildings_layer:
        geometry:
            source: osm
            filter: buildings
```

You might also see this done using YAML's more compact object notation, like so:

``` yaml
layers:
    buildings:
        geometry: { source: osm, filter: buildings }
```

## Feature properties

These are used to filter by `properties` of `Feature` objects inside a `FeatureCollection`.

Example json data:

``` yaml
"type": "FeatureCollection",
    "features": [
        "type": "Feature",
        "id": "164250696",
        "clipped": true,
        "properties": {
          "source": "openstreetmap.org",
          "kind": "river",
          "name": "Hudson River"
        }
    ]
...
```

Example filters:
```yaml
hudsonriver:
    filter: { name: "Hudson River" }
```

### JavaScript filters
Feature filters also allow JavaScript functions:

```yaml
lake-outline:
    filter: function () { return (feature.kind != 'ocean'); }
```
