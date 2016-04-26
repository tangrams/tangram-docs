#Walkthrough: Add a Tangram map to an Android application

With the Tangram Android SDK, you can quickly add beautiful and useful 2D and 3D maps to an Android application. Tangram uses customizable scenes that enable fine control over almost every aspect of your map's appearance, including symbols, lighting, geometry, and feature labels. The Tangram Android SDK is [open source](https://github.com/tangrams/tangram-es), and supports several vector data formats.

Follow this guide to add a Tangram map to your Android application. If you're looking for a simple way to add a pre-configured map and related geographic services to your application, you should check out the [Mapzen Android SDK](https://mapzen.com/documentation/android/).

The Tangram Android SDK can be used with any Android build system that supports Gradle. For this guide we will use [Android Studio](http://developer.android.com/sdk/index.html).

> This guide will assume some knowledge of Android software development. If you want an introduction to writing Android applications, visit the [Android developer site](http://developer.android.com/training/index.html).

###Run the Simple Map demo application

First, let's look at a sample application that demonstrates simple usage of a Tangram map.

Start by downloading the repository of Tangram Android demos. You can do this in a terminal window with the following command:

```
git clone --recursive https://github.com/tangrams/tangram-android-demos.git
```

Next, import the project by opening Android Studio, choosing "Import project", and selecting the "tangram-android-demos" folder.

With the project open, choose `simplemap` from the run menu and run the demo on a device or an emulator. Your device will show a map that responds to dragging, pinching, and rotating gestures.

Finally, open the `simplemap` module in Android Studio to see the code used for the demo. In the next section, we will look at all of the steps needed to add a map like this to your application.

###Steps to add Tangram to an Android application

1. **Add Tangram as a Gradle dependency.**

  In the `build.gradle` file for your application's module, add the following dependency:

  ```
  compile 'com.mapzen.tangram:tangram:0.2'
  ```

2. **Add a scene file to your application assets.**

  The scene file is a YAML document that specifies the behavior and appearance of your map. You can write your own scene file or use one of the Mapzen styles like [Bubble Wrap](https://github.com/tangrams/bubble-wrap), [Cinnabar](https://github.com/tangrams/cinnabar-style), or [Refill](https://github.com/tangrams/refill-style). Add the scene file to your application's assets. In the demo applications, assets are specified in the Gradle build file:

  ```
  sourceSets.main.assets.srcDirs = ['../styles']
  ```

3. **Declare a MapView in your layout.**

  In your layout XML, add a View with the class `com.mapzen.tangram.MapView`. The XML used in the demo applications is:

  ```
  <com.mapzen.tangram.MapView
        android:id="@+id/map"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"/>
  ```

4. **Forward your Activity lifecycle events to the MapView.**

  For MapView to work correctly, your Activity must call the matching methods on MapView for lifecycle events, including `onCreate()`, `onResume()`, `onPause()`, `onDestroy()`, and `onLowMemory()`.

5. **Implement onMapReady.**

  Tangram maps are initialized asynchronously. When the map is ready for display and use, it calls `onMapReady(MapController)` on a listener that you give it. In this callback you can save a reference to the MapController and use it to begin interacting with the map.

6. **Initialize the map with getMapAsync.**

  With the MapView declared in your layout, you can start a background task that will prepare the map. Call `getMapAsync` on your MapView, providing a listener for the `onMapReady` callback and a String containing the path to your scene file within your application's assets.

That's it! You're ready to start using a Tangram map in your application.

###Using Mapzen's vector tile service

Mapzen provides a free vector tile service with GeoJSON, TopoJSON, and MVT tiles that you can use with Tangram. Mapzen scene files use this service as their data source. If you want to use Mapzen vector tiles for more than a demo, you will need to sign up for a free API key at [mapzen.com/developers](https://mapzen.com/developers). Then add your API key to the data source in your scene file:

```
sources:
  mapzen:
    type: MVT
    url:  https://vector.mapzen.com/osm/all/{z}/{x}/{y}.mvt
    url_params:
      api_key: [YOUR API KEY HERE]
```

> Tip: For Tangram on Android, MVT is usually the fastest and most efficient data format.

###Next steps

In this guide, you learned how to add a Tangram map to your Android application. Now you can:

 - Learn how to write or edit a Tangram [scene file](https://mapzen.com/documentation/tangram/Scene-file/),
 - See [more examples](https://github.com/tangrams/tangram-android-demos) of things your application can do with the map, or
 - Look at the [reference documentation](https://mapzen.com/documentation/tangram/android-sdk/0.2/) for the Tangram Android SDK.

