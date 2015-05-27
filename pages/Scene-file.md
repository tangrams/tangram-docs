The **scene file** is a [YAML](http://en.wikipedia.org/wiki/YAML) document which organizes all of the elements Tangram uses to draw a map. YAML is a data format similar in many ways to JSON, but it has some unique features which we thought made it more friendly and easy to use for our purposes. (See the [[YAML]] entry for more about those features.)

## Top-level Elements

There are a variety of top-level elements allowed in a scene file. Each defines the beginning of a _block_ named for the parameter.

####`scene`
Optional parameter. Sets a number of scene-wide parameters:

- `background`: sets the map's background color
- `animated`: a boolean toggle to force per-frame updates.

####`sources`
Required parameter. The `sources` block identifies datasources.

See [[sources]].

####`styles`
Optional parameter. The `styles` block defines rendering styles, which are composed of [[materials]] and [[shaders]].

See [[Styles Overview]] and [[styles]].

####`layers`
Required parameter. The `layers` block divides the data into layers and assigns styling parameters.

See [[Styles Overview]], [[layers]], and [[styling rules]].

####`cameras`
Optional parameter. The `cameras` block allows modifications to the view of the map.

See [[Cameras Overview]] and [[cameras]].

####`lights`
Optional parameter. The `lights` block allows control of the lighting of the map.

See [[Lights Overview]] and [[lights]].

####`textures`
Optional parameter. The `textures` block allows for advanced configuration of textures within [[materials]].

See [[Materials Overview]] and [[textures]].


## The basics
To create a map, the scene file requires only:

- a data source
- data interpretation rules (filters)
- styling rules

Here's a very simple scene file:

```yaml
sources:
    osm:
        type: GeoJSONTileSource
        url:  http://vector.mapzen.com/osm/all/{z}/{x}/{y}.json

layers:
    earth:
        data: { source: osm }
        style: { order: 0, color: green }
    water:
        data: { source: osm }
        style: { order: 1, color: blue }
```

In this example, all three elements are included – this will produce a (very simple) map!

## Examples
For more examples of scene files, check out our [demos](https://github.com/tangrams?query=demo) – ours are usually named `styles.yaml`.

For even more amazing examples, check out Patricio Gonzalez Vivo's [Tangram Sandbox](http://patriciogonzalezvivo.github.io/tangram-sandbox/)!