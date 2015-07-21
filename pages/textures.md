*This is the technical documentation for Tangram's `textures` block. For an overview of the ways textures can be used by Tangram, see the [Materials Overview](Materials-Overview.md).*

##`textures`
The `textures` element is an optional top-level element in the [scene file](scene-file.md). It has only one kind of sub-element: a named _texture object_.

```yaml
textures:
    pois:
        url: demos/images/marker.png
    brick:
        url: demos/images/brick.jpg
```

####`texture`
Optional _named texture, _URL_, or _texture object_. No default.

A _texture object_ may be defined either in the top-level `textures` element or inline.

When defined in the top-level `textures` element, it is declared as a _texture name_ which allows it to be referenced by name in other `texture` parameters, including in `styles` and `materials` definitions:

```yaml
# here we define and name the texture
textures:
    pois:
        url: images/poi_icons_18@2x.png

# here we reference the above texture
styles:
    pois-style:
        base: points
        texture: pois
```

A _texture object_ may also be defined inline, anywhere a `texture` parameter may be specified:
```
# defining a texture 
styles:
    rock:
        base: polygons
        material:
            normal:
                texture:
                    url: rock.jpg
                mapping: uv
```

```yaml
# defining a texture inline in the texture parameter of a style based on points
styles:
    animals-style:
        base: points
        texture:
            url: path/to/image.png
            filtering: mipmap
            sprites:
                bunny: [0, 0, 32, 32]
                fox: [0, 32, 32, 32]
```

Whether defined in the `textures` element or inline, at a minimum, a URL must be passed:

```yaml
textures:
    ghost:
        url: images/ghost.png
```

```yaml
styles:
    points:
        texture: images/ghost.png
```

## `texture` parameters

####`url`

URL


#### `filtering`
Optional _string_, one of `linear`, `nearest`, or `mipmap`. Defaults to `linear`.

Sets the filtering mode for the texture, which determines quality at various zoom levels.

```yaml
    ghost:
        url: demos/images/ghost.png
        filtering: mipmap
```

#### `sprites`
Optional parameter. Defines the start of a `sprites` block.

`sprites` take only one kind of parameter: the _sprite name_. Any number of sprites may be defined.

#### sprite name
Required _string_. Can be anything. No default.

Defines an area of a texture to be used as an individual sprite, as _[x origin, y origin, width, height]_ in pixels. 

```yaml
    pois:
        url: demos/images/poi_icons_32.png
        filtering: mipmap
        sprites:
            airport: [0, 0, 32, 32]
            restaurant: [0, 777, 32, 32]
            cafe: [0, 814, 32, 32]
            museum: [0, 518, 32, 32]
```
