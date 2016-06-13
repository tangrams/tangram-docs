**YAML** is an object-based data format with a flexible structure. Its specification includes a huge array of wacky abilities, but we only use a few of them.

Here are the most important YAML features to know about when writing Tangram scene files.

## mappings

Tangram makes heavy use of the YAML structures known as "mappings," known elsewhere as "[associative arrays](https://en.wikipedia.org/wiki/Associative_array)" or "dictionaries". They are made up of "key/value pairs" – in these docs, we usually call these _parameters_, because that's how we use them:

```yaml
parameter: value
```

When nested, YAML calls this a "collection" – we usually call it an _element_:
```yaml
element:
    parameter1: value
    parameter2: value
```

By definition, a "mapping" is an orderless collection of objects. For this reason, at a given level within a given object, parameter names must be unique:

```yaml
element:
    parameter1: value
    parameter1: value # not allowed, parameter name is repeated
```

Conflicts may be resolved differently at different times, and you can't rely on document order to resolve them:

```yaml
# only one camera can be active at a time – here, you can't be sure which one it will be.
camera1:
    active: true
camera2:
    active: true
```

Finally, a parameter can't also be an element:
```yaml
# THIS WON'T WORK
parameter1: value1
    subparameter1: value2
```
This is because the value of "parameter1" can't be both "value1" and an object containing other key/value pairs – it has to be one or the other.

In this documentation, we refer to both parameters and elements as "objects".

## object syntax

YAML supports two kinds of syntax when writing nested objects: _block syntax_ and _flow syntax_.

####block syntax

_Block syntax_ requires each level of an object to be indented with spaces – any number of spaces or tabs is allowed, as long as it's consistent throughout the file. It is relatively easy to read, though it tends to result in longer files.

```yaml
element:
    subelement:
        parameter1: value1
        parameter2: value2
    subelement2:
        parameter1: value1
        parameter2: value2
```

_Note:_ if you mix spaces and tabs, the parser will throw an error like this one:
```
YAMLException {name: "YAMLException", reason: "bad indentation of a mapping entry"}
``` 
#### flow syntax
Here is the same object as the first example above, written in the more compact _flow syntax_:
```yaml
element1: { subelement1: { parameter1: value1, parameter2: value2 }, subelement2: { parameter1: value1, parameter2: value2 } }
```

In some cases, this syntax may be harder to read, but it's usually fine for shorter objects, or patterns which are repeated frequently:

```yaml
roads:
    data: { source: local, filter: roads }
```

#### Syntax examples
For further examples, check out our many fine [demos](https://github.com/tangrams?query=demo)!

## lists

Lists are written differently in each of the above syntax styles.

#### block lists
```yaml
element:
    parameter:
        - item 1
        - item 2
        - item 3
```

####flow lists
```yaml
element: { parameter: [ item1, item2, item3 ] }
```
## syntax mixing

_Block syntax_ can enclose _flow syntax_, but not the other way around – once you start an object in _flow syntax_, you have to finish it before you can move back into _block syntax_.

```yaml
element:
    parameter: { [ item1, item2, item3 ] }

element:
    parameter:
        - item1
        - item2: { parameter1: value1, parameter2: value2 }
        - item3

# THIS WILL NOT WORK
element: { parameter:
    - item1
    - item2
    - item3
```

## data types

Tangram's data types are based on YAML's functionality, but we've extended them a bit in certain contexts.

#### duck typing

YAML interprets data types automatically:

```yaml
5 # that's an int
5.2 # that's a float
duck # obviously a string
5.2 ducks # mixed-type => string
[1.0, .5, .75] # array of floats (aka a parade)
```

#### stops

Our "stops" data structure is a way to define a relationship between two ranges of values. It is defined as an array of two-item arrays, like so:

`[[12, 3], [14, 6], [16, 9]]`

The first value in each pair is always a _zoom level_. The second value in each pair is interpreted in the context of the current parameter. Stops may be used with all color and distance parameters, including `width`, `focal_length`, `fov`, and `z`.

For instance, in a `width` block, if no units are specified, each pair is interpreted as `[zoom, meters]`, because `meters` is the default unit of `width`. The above example will define a value of 3m at zoom 12, 6m at zoom 14, and 9m at zoom 16.

At intermediate zoom levels, values will be interpolated linearly, with behavior depending on draw style and parameter. In the above example, at zoom 13, the value will be 4.5m, and at zoom 13.5, the value will be 5.25m. However, for all `color` values, the values are only be updated when tile geometry is built – typically at whole-number zoom changes.

Outside of the range specified by the stops, the values are capped by the highest and lowest values in the range – so in the above example, the value at zoom 9 is also 3m, and the value at zoom 18 is still 9m.

```yaml
color: [10, [0.3, 0.4, 0.3], [14, [0.5, 0.825, 0.5]]]
width: [[13, 0px], [14, 3px], [16, 5px], [18, 10px]]
```


## reserved keywords

Our YAML parser detects certain keywords contextually based on the element or parameter in which they are used. In these contexts, these words are _reserved keywords_ and can't be used as custom element names.

For example, the [layers](layers.md) element has three possible parameters: `data`, `filter`, and `draw`. It also allows custom _sub-layers_, which can be named anything except "data", "filter", or "draw".

#### `function`

Strings starting with `function` will be passed to the style builder as JavaScript in certain contexts: `color`, `width`, `order`, `interactive`, `visible`, `filter`, `size`, `fill`, and `stroke`.

```yaml
# Single-line JavaScript example:
width: function () { return 2.5 * Math.log(zoom); }
```

#### `$zoom`

The `$zoom` keyword may be used to define [filters](filters.md) with optional `min` and `max` parameters.

```yaml
outline:
   filter: { $zoom: { min: 15, max: 20 } }
```

#### `$geometry`

The `$geometry` keyword can specify a [filter](filters.md) to match a specific type of geometry, for cases when a FeatureCollection includes multiple geometry types:

```yaml
labels:
   filter: { $geometry: point }
```

## multiline strings

One of the reasons we chose YAML as our scene file format is its ability to handle multi-line strings with a minimum of fuss. In _block syntax_ only, start an parameter's value with a "pipe" character (`|`) followed by a newline, and everything that isn't indented _less_ after that will be treated as a single string value, newlines included:

```yaml
element:
    parameter: |
        This is my multi-line string.
        There are many like it,
        But this one is mine.

        It even has an empty line!
        Sublime.

                Indents don't matter
              As long as they don't
            start
          before
        here.
                     Clear?
```

This lets us put code straight into an attribute value, and it still looks like code:

```yaml
# Multi-line JavaScript example:
style:
    color: [0.5, 0.5, 0.5]
    width: |
        function () {
          return 2.5 * Math.log(zoom);
        }

# GLSL Example:
elevator:
    base: polygons
    animated: true
    shaders:
        blocks:
            position: |
                // Elevator buildings
                if (position.z > 0.01) {
                    position.z *= (sin(position.z + u_time) + 1.0);
                }
```
## comments

```yaml
# This is a YAML comment.
# There is no way to write block comments in YAML, sorry.

# To quote http://stackoverflow.com/questions/2276572/how-do-you-do-block-comment-in-yaml:

# If you want to write
# a block-commented Haiku
# you'll need three pound signs
```

Bear in mind that in multi-line strings, pound signs lose their ability to comment code! You'll have to use the comment convention in whatever language you're writing. (This can be a pain when using auto-commenting in text editors.)

## `url`

`url` attributes may be used to link to external YAML files in the `styles` element, as well as in the shader block elements `globals`, `color`, and `position`. This allows for more modular shader construction as well as easy sharing of styles.

#### linked `styles`

```yaml
dots:
    url: styles/dots.yaml
```

When the `url` parameter is used in the `styles` block, the linked `.yaml` file should include a replica of the entire style element as it would appear in the scene file, including the _style name_:

```yaml
# styles/dots.yaml
dots:
    base: polygons
    shaders:
        uniforms:
            ...
```

#### linked shader `blocks`

```yaml
shaders:
    blocks:
        globals:
            url: functions/hsv2rgb.glsl
```

When the `url` attribute is used in place of any `blocks` parameters, the linked `.glsl` file should only include GLSL code, as it would appear in the parameter's value:

```glsl
// hsv2rgb.glsl
vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
```

## JSON compatibility

YAML's capabilities are officially a superset of JSON, which makes conversion between the two formats a cinch.
