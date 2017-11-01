*This is the technical documentation for Tangram's `global` block. For a conceptual overview of the Tangram scene file, see the [scene file](Scene-file.md) page.*

*For the shader block, see [`global`](shaders.md#global).*

## `global`
The `global` element is an optional top-level element in a Tangram scene file. It declares the beginning of the `global` block. It takes only one kind of parameter: a _property_. Any number of _properties_ can be declared.

#### `property`
Optional _key/value pair_. *Key* can be any _string_, no default. *Value* can be any _object_, including another nested property, no default.

_Global properties_ are user-defined properties in the scene file that can be substituted for values elsewhere in the file. This is useful for setting a value in multiple places in the scene file simultaneously. It's also useful for setting important values at the top of the scene file, rather than inline. Examples include common colors, language preferences, or visibility flags used to tweak styles.

```yaml
global:
   labels: true # label visibility flag
```

These properties can then be substituted elsewhere in the scene file with the `global.` syntax:

```yaml
layers:
   water:
      data: { ... }
      visible: global.labels
```

```yaml
layers:
   road-labels:
      data: { ... }
      draw:
         text:
            # display labels in preferred language, fallback to default name
            text_source: [global.language, name]
```

#### nesting

Properties can be nested:

```yaml
global:
   colors: # group common colors together
      color1: red
      color2: green
      color3: blue
```

They can then be referenced with nested dot notation (`global.group.property`):

```yaml
landuse:
    data: { ... }
    draw:
        polygons:
            color: global.colors.color2 # nested property
            ...
```

#### use in functions

Global properties are available in JS function filters and properties, using the same syntax:

```yaml
layers:
   point-labels:
      data: { ... }
      draw:
         text:
            text_source: |
               function() {
                  // Make a compound label with "Preferred Name (Local Name)"
                  var preferred = feature[global.language];
                  if (preferred && preferred !== feature.name) {
                     return preferred + '\n(' + feature.name + ')';
                  }
                  return feature.name;
               }
```
