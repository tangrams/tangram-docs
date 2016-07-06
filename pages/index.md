[Tangram](https://mapzen.com/projects/tangram) is a flexible mapping engine, designed for real-time rendering of 2D and 3D maps from vector tiles. Built around [OpenStreetMap](http://www.openstreetmap.org/) data, Tangram provides optional control over almost every aspect of the map-making process, including cartography, lighting, and geometry customization.

Map styles, data filters, labels, and even graphics card code can be defined in a human-readable and -writable plain-text [scene file](Scene-file.md), and APIs permit direct interactive control of the style. Changing the color is just the beginning; every Tangram map is a 3D scene, so you also can modify [lights](Lights-Overview.md) and [cameras](Cameras-Overview.md).

Tangram is designed to use vector data sources such as Mapzen’s free [vector tile service](https://mapzen.com/projects/vector-tiles), which is a tiled, hosted version of the OpenStreetMap database. Besides points and lines, these data sources contain metadata, which Tangram can use to [filter](Filters-Overview.md) the data and change drawing styles in real time.

![Example Tangram map](images/refill_map.png)

All of these effects are possible thanks to [OpenGL](https://en.wikipedia.org/wiki/OpenGL). You can write graphics card programs, known as [shaders](Shaders-Overview.md), and even JavaScript to add interactivity, mix data sources, and control the design of your maps.

Tangram is available in two delicious flavors: [Tangram JS](https://github.com/tangrams/tangram) for browser-based mapping, and [Tangram ES](https://github.com/tangrams/tangram-es) for native mobile mapping.

### Conceptual Overviews

Tangram supports standard map styling conventions, but a Tangram map is also technically a 3D scene. You don't have to know anything about 3D to make a Tangram map, but if you'd like to dig deeper into the unique world of Tangram styles, the **Concept Overviews** section is a good place to start.

### Technical Reference

Tangram maps are styled using a custom styling syntax inside of a YAML scene file. This file describes a hierarchy of objects which control every aspect of your map, including data sources, feature layers, lights, cameras, textures, and more.

The **Syntax Reference** section of the documentation enumerates and describes the objects allowed in the scene file, and enumerates all of their properties.

Specific documentation about implementing Tangram on various platforms is available in the **API documentation**. The scene file syntax is platform-independent, and should function the same way everywhere – any exceptions are marked.

### Demos and Examples

A variety of example maps are available at our documentation's [Demos and Examples](https://mapzen.com/documentation/tangram/Demos/) page. 

Learn more about the concepts, objects, and parameters of the scene file in the topics in the sidebar. Or, to jump right in, follow this [walkthrough](walkthrough.md) to learn how to make a map with Tangram JS. More tutorials are available on the [Tutorials](tutorials/Tutorials.md) page.

Tangram is free and open source, and is available for both commercial and non-commercial purposes. The [source code](https://github.com/tangrams) is open to view and modify, and contributions are welcomed.  
