*This is the technical documentation for Tangram's `fonts` block. For an overview of Tangram's labeling capabilities, see the [`text`](Styles-Overview.md#text-1) entry in the [Styles Overview](Styles-Overview.md).*

##`fonts`
The `fonts` element is an optional top-level element in the [scene file](Scene-file.md). It has only one kind of sub-element: a named _font definition_.

A _font definition_ can define a font in one of two ways: through _external CSS_, or with any number of `font face definitions`.

####`external`
[[JS-only](https://github.com/tangrams/tangram)] With this method of defining a font, the value of the _font definition_ is set to "`external`":

```
fonts:
    Poiret One: external
```

This requires that a corresponding CSS declaration be made in the HTML:

`<link href='https://fonts.googleapis.com/css?family=Poiret+One' rel='stylesheet' type='text/css'>`

Tangram will identify the externally-loaded typeface by name and make it available for use in _text_ labels.

####font face definition
A _font face definition_ may be used as the value of the _font definition_. This is an object with a number of possible parameters:

  - `weight`: defaults to `normal`, may also be `bold` or a numeric font weight, e.g. `500`
  - `style`: defaults to `normal`, may also be `italic`
  - `url`: the URL to load the font from. For maximum browser compatibility, fonts should be either `ttf`, `otf`, or `woff` (`woff2` is [currently supported](http://caniuse.com/#search=woff2) in Chrome and Firefox but not other major browsers). As with other scene resources, `url` is relative to the scene file.

An example of a _font face definition_ with a single parameter, _url_:

```yaml
fonts:
    Montserrat:
        url: https://fonts.gstatic.com/s/montserrat/v7/zhcz-_WihjSQC0oHJ9TCYL3hpw3pgy2gAi-Ip7WPMi0.woff
```

Example of a _font face definition_ with multiple parameters:

```
fonts:
    Open Sans:
        - weight: 300
          url: fonts/open sans-300normal.ttf
        - weight: 300
          style: italic
          url: fonts/open sans-300italic.ttf
        - weight: 400
          url: fonts/open sans-400normal.ttf
        - weight: 400
          style: italic
          url: fonts/open sans-400italic.ttf
        - weight: 600
          url: fonts/open sans-600normal.ttf
        - weight: 600
          style: italic
          url: fonts/open sans-600italic.ttf
        - weight: 700
          url: fonts/open sans-700normal.ttf
        - weight: 700
          style: italic
          url: fonts/open sans-700italic.ttf
        - weight: 800
          url: fonts/open sans-800normal.ttf
        - weight: 800
          style: italic
          url: fonts/open sans-800italic.ttf
```

When _font definitions_ are declared in this way, the fonts from the associated _urls_ will be used when the appropriate combination of _font-family_, _style_, and _weight_ parameters are specified in a style's [`font`](draw.md#font) block:

```yaml
draw:
    text:
        font:
            family: Open Sans
            style: italic
            weight: 300
```

For more, see [font parameters](draw.md#font-parameters).
