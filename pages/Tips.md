Here are some tips and hints for getting the most out of Tangram.

## Tangram Play

[Tangram Play] is a real-time Tangram scene file editor.

## Data Problems

Having data problems? Most of the time we find that this is caused by **malformed GeoJSON**. You can check your GeoJSON validity with a linter like [geojsonlint.com].

## Leaflet options

As Tangram-JS is a Leaflet plugin, any Leaflet option is available to you, including flyto, markers, and clustering.

## Updating things

The Tangram JS API allows you to make changes on the fly - when you change the config, do updateConfig - when you change something more high-level you may need to call rebuild() - and in some cases requestRedraw(). For instance:

## Custom fonts

Web fonts are supported!

## Switch styles

reload a scene with load()

## hiding layers from imported styles

to tell an imported layer not to draw:
layername:
    visible:false

## ordering labels and points - blend mode

## functions

where can javascript functions be used?
