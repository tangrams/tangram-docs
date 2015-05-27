With the [Tangram map renderer](https://mapzen.com/projects/tangram), you quickly can make beautiful and useful 2D and 3D maps. With easy customizations, you can have fine control over almost every aspect of your map's appearance, including symbols, lighting, geometry, and feature labels, and see your changes immediately. Tangram is free and [open source](https://github.com/tangrams/tangram), and supports several vector data formats.

Follow this step-by-step walkthrough to make your first map with Tangram. You will get a sample Tangram map running on your machine and be able to make simple changes to the map's appearance by editing a few lines of code. 

To complete this walkthrough, you need a [browser that supports WebGL](https://get.webgl.org/), a text editor, and [Python](https://www.python.org/downloads/), which may already be installed as part of your operating system. You will need to maintain an Internet connection while you are working so you can access the map source data, which is being streamed from Mapzen's servers. While the steps are written for a Mac, you could use other operating systems as long as you can run a web server locally. It should take you about 30 minutes to complete the exercises. 

###View the Tangram example map

1. Open a browser to the [Tangram sample website](tangrams.github.io/simple-demo/). This is an example map showing some of the basic features of Tangram. By default, the map opens to the southern (lower) tip of Manhattan in New York City, United States.
2. Use your mouse to pan and zoom the map. Take note of the map's appearance, as you will be updating the scene later in the exercise.

	![simple-demo initial map](/images/simple-demo-initial.png)

3. Close the browser.

###Download the Tangram simple-demo repository

The style files are stored in a GitHub software repository called tangrams/simple-demo.

1. Navigate to [https://github.com/tangrams/simple-demo](https://github.com/tangrams/simple-demo).
2. Make a copy of the simple-demo repository. You can choose to download the .zip file from the link on the page, or [clone the repository](https://help.github.com/articles/cloning-a-repository/) using the GitHub client application or command line utilities. Access to the repository is public, so you do not need to be signed in with a GitHub account. However, if you want to do more advanced work with Tangram and build your own maps that use data from Mapzen’s servers, you will need a GitHub account to obtain a [developer access key](http://mapzen.com/developers).
3. Open the local simple-demo folder and explore the contents. 

	![simple-demo repository files](/images/repo-files.png)

The folder contains some general website and mapping components (such as tools for [Leaflet](http://leafletjs.com/)), documentation, and the file Tangram uses to set the visual appearance of the map (`scene.yaml`).

###Set up Tangram to run from your machine

You were viewing the demo on a remote server before, but now you will set it up to run from a web server on your own machine. This will allow you to make changes to the Tangram styles and immediately see the results. To start the server, you will need to enter a few command line instructions using the terminal window.

When you are running the demo locally, the map styling information (scene.yaml) and the files used to build the webpage (such as index.html) are coming from your machine. However, the underlying map data is vector tiles from Mapzen’s servers.

Vector tiles are square-shaped collections of geographic data that contain the map feature geometry, such as lines and points. Information about how map features are drawn is maintained in a separate stylesheet file. For many purposes, vector tiles are more flexible than raster tiles, which are images that already have the visual appearance of the map features integrated in them. The steps in this walkthrough would be different with raster tiles because you would also need to regenerate the tile images themselves each time you made a change to the styling, rather than only updating the stylesheet.

> Tip:  By default, terminal windows open into your home directory, so you will need to drill into the folder structure to get to the simple-demo folder. Alternatively, add a shortcut to your context menu so you can right-click a folder in Finder and start the terminal window in that location. To enable this, open System Preferences, click Keyboard, and click Shortcuts. In the list, click Services and check New Terminal at Folder.

1. Open a terminal window to the location where you downloaded simple-demo.
2. At the prompt, type `python -m SimpleHTTPServer` to start a web server using Python. You should receive a message similar to this in the terminal: `Serving HTTP on 0.0.0.0 port 8000 ...`
3. Open your browser to `http://localhost:8000`. (“Localhost” is a shortcut hostname that a computer can use to refer to itself, and is not viewable by anyone else.) If it was successful, you should see the same demo map as you viewed earlier. If you are having problems, you can instead try the command `python -m http.server 8000` (for use with Python 3).

As you pan and zoom the map, notice that the URL updates to append #, /, and numbers to represent the zoom level (such as #16) and coordinates of the map (such as 40.7085/-73.9903). You can also see this URL pattern on the original simple-demo website. You can always delete those numbers from the URL to return to the original state of the demo.

![URL with zoom level and coordinates](/images/local-host-url.png)

Be sure to keep the terminal window open while you are working on this walkthrough.

###View the Tangram scene file

Tangram uses a human-readable format called `.yaml` to organize all the styling elements needed to draw a map. This file, known as a scene, specifies the source of the data, which layers from that source to display on the map, and rules about how to draw those layers, such as color and line thickness. 

Beyond the steps in this walkthrough, you can play with other elements and their values, if you’d like. If the map is blank after you have changed something in the .yaml, you may have entered an errant value that Tangram cannot interpret. Undo your edit and save it again, or roll back all changes to return to the original state of the scene file.

1. Open `scene.yaml` in a text editing application and scroll through the elements.
2. Notice that the elements are arranged in a hierarchy, with the top level elements being `cameras`, `lights`, `sources`, and `layers`. Each of these has additional subelements underneath them. The [scene file documentation](https://github.com/tangrams/tangram/wiki/Scene-file) has more information about the top-level elements in a scene file. (Some of the code has been omitted in the block below.) 

	```
	cameras:
   		camera1:

	lights:
    	light1:

	sources:
    	osm:

	layers:
    	earth:
	```
This part of the walkthrough has given you an introduction to Tangram and the contents of the scene file.  Now, you will edit the scene file to change the map's lighting and symbols. 

###Update the scene lighting

Lighting enables visual effects like making the map appear as if it is being illuminated by the sun, viewed after dark, or lit only by the beam of a flashlight. The appearance of light is also affected by the materials it shines on, but setting properties of materials is beyond the scope of this walkthrough. 

Currently, the map has a light source defined as `directional`, which you can think of as being sunlight. In these steps, you will add a new `light` element that resembles a flashlight shining from above. Changing lighting parameters is a quick way to simulate night conditions, but you should consider updating the symbols as well if you are truly designing a map for viewing at night.

1. In `scene.yaml`, under `lights:`, add a  new `light2:` element at the same level as `light1:`. 
2. Define `light2` with the following parameters, being careful to indent the lines under `light2:`.

	```
	light2:
		visible: true
		type: point
		position: [-74.0170, 40.7031, 100]
		origin: world
		ambient: .3
		diffuse: 1
		specular: .2
	```
3. Save `scene.yaml` and refresh the map.

The `position` parameter defines a light originating at an x-,y- coordinate location and at a z-value in meters from the ground, giving the appearance of a light pointed at the tip of Manhattan. You can learn more about lights and their parameters from the [lights documentation](https://github.com/tangrams/tangram/wiki/lights).

![simple-demo with new light](/images/simple-demo-new-light.png)

The updated map looks washed out and the new spot light is barely visible, so you can adjust `light1` to make the map look better.

1. Under `light1:`, change the `diffuse:` parameter to `.1`.
2. Change `ambient:` to `.3`.
3. Save `scene.yaml` and refresh the map.

	![simple-demo with combined lights](/images/simple-demo-mod-light.png)

In these steps, you blended lights to achieve different effects. However, if you want to turn off a light completely, you can set its `visible` property to `false.`

###Update the layers in the map

Tangram can render data from different vector tile formats, as well as from individual files, such as a GeoJSON. The simple-demo map uses vector tiles that display OpenStreetMap data from Mapzen’s servers. You specify the URL to the data in the `sources:` block. 

1. In `scene.yaml`, review the `sources:` block. 
2. Note that `sources:` requires a type (a designation for the type of tiles) and a URL to the server. You can find more examples in the [sources documentation](https://github.com/tangrams/tangram/wiki/sources).

After you specify the source, you need to list the layers from that source that you want to draw on the map. Optionally, you can include filters based on attribute values within a layer, such as to draw only major roads, and styling information about how the features should be symbolized. To learn more about the available layers, see the [Mapzen vector tile service documentation](https://github.com/mapzen/vector-datasource/wiki/Mapzen-Vector-Tile-Service#layers). 

You specify how the display the features in the layers in the `draw:` block. There, you can enter basic information about colors and symbol sizes, as well as use more complex drawing techniques. For example, you can define shading or animations, enter code blocks, or reference other `.yaml` files. You can also specify the drawing order of layers to put certain layers on top of others. For example, in `scene.yaml`, the earth polygon layer, which represents landmasses, has an order of 0, meaning it will be underneath all other layers. Layers with order values of greater numbers are drawn on top of those with smaller numbers. 

1. In `scene.yaml`, review the items under `layers:` to see which layers and feature types (`kind:`) are displayed in the map, and review the `draw` block under each layer. 
2. Under `water:`, change the `color:` value to `'#003366'`. 
3. Save `scene.yaml` and refresh the browser to see the updates.

	![Water with a darker color](/images/change-water-color.png)

If you want to continue experimenting with Tangram symbols, try changing the `draw` values of other layers. For more on available drawing parameters, see the [styles documentation](https://github.com/tangrams/tangram/wiki/styles). 

###Clean up and next steps

You have now explored the basics of mapping with Tangram and the structure of the scene file. 

1. If you are done with the exercise, close the terminal window to shutdown the server and close your browser. 
2. Optionally, delete the simple-demo repository you used in this exercise. 

If you want to put this or other Tangram maps into production beyond your local machine, you'll need to put the files on a server and also [sign up for a free API key](https://mapzen.com/developers/) if you want to use the Mapzen vector tiles for the data. 

To see other maps built with Tangram, visit the [Tangram website](https://www.mapzen.com/projects/tangram) and get links to sample code so you can start styling your own maps. 
