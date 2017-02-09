/*
tutorial-embeds.js
tutorial-embeds.css
author: Peter Richardson 2017
contact: peter@mapzen.com

This code was written for use in Tangram tutorials pages to allow multiple Tangram Play embeds on a page while limiting resource usage. It expects a number of target divs on a page, each with class="demo", an empty "code" attribute, and a "source" attribute which is to be the "src" of a loaded iframe.

It creates a number of iframes (set by the numberOfFrames variable) and moves them from place to place, setting the src of each. It then saves any changes made in the Play editor to the "code" attribute, and if that frame is loaded again later it uses that attribute to restore the code.

Example div:

    <div class="demo" id="demo6" code="" source="http://localhost:8080/embed/?go=👌&scene=https://tangrams.github.io/tangram-docs/tutorials/custom/custom6.yaml#17/40.76442/-73.98058"></div>
    </div>

*/

var frames = [];
var winners = [];
var loaders = [];
var numberOfFrames = 3;

// find distance of element from center of viewport
function distanceFromCenter(el) {
    var top = el.offsetTop;
    var height = el.offsetHeight;

    while(el.offsetParent) {
        el = el.offsetParent;
        top += el.offsetTop;
    }

    var windowCenter = window.pageYOffset + window.innerHeight/2;
    var elementCenter = top + height/2;

    return Math.abs(windowCenter - elementCenter);
}

function moveFrameToElement(frame, el) {
    if (typeof el == 'undefined') return false;
    newtop = el.offsetTop;
    frame.style.top = newtop+"px";
    frame.style.left = el.offsetLeft+"px";
    // get the source if it has been set
    if (typeof el.getAttribute("source") != 'undefined') {
        frame.src = el.getAttribute("source");
    }
    // if code was saved previously, load it
    if (el.getAttribute("code") !='' && el.getAttribute("code") != 'null') {
        loadOldCode(frame, el);
    } else {
        // show the iframe once it's loaded
        frame.onload = function() {
            frame.style.visibility = "visible";
        }
    }
}

function loadOldCode(frame, el) {
    // get source from the previously-saved blobURL
    var code = el.getAttribute("code");
    if (typeof code == 'undefined') return false;
    frame.onload = function() {
        // if the contentWindow doesn't exist, bail
        if (typeof frame.contentWindow == 'undefined') {
            console.log('is frame.contentWindow undefined?', frame.contentWindow);
            return false;
        }
        // set the value of the codeMirror editor
        var editor = frame.contentWindow.editor;
        var scene;
        var load_event = { load: function() {
                // set it again to force a Tangram update
                // console.log('setvalue2', frame, new Date().getTime() / 1000)
                scene.unsubscribe(this);
                editor.doc.setValue(code);
            }};

        function setCode(code) {
            scene = frame.contentWindow.layer.scene;
            if (scene.initializing) {
                scene.subscribe(load_event);
            } else {
                editor.doc.setValue(code);
            }
        }

        setTimeout(function() {
            // use a setTimeout 0 to make this a separate entry in the browser's event queue, so it won't happen until the editor is ready
            setCode(code);
        }, 0);
        // show iframe
        frame.style.visibility = "visible";
    }
}

window.onload = function() {
    // create new iframes
    for (x = 0; x < numberOfFrames; x++) {
        frames[x] = document.createElement("iframe");
        frames[x].classList.add("demoframeclass");
        // debugg   er
        frames[x].setAttribute("id", "frame"+x);
        document.getElementsByClassName("documentation-content")[0].appendChild(frames[x]);
        loaders[x] = document.createElement("div");
        loaders[x].classList.add("demo-loading");
    }

    checkVis();

    // throttle checkVis function
    window.onscroll = throttle(function() {checkVis()}, 1000);

    function throttle(fn, threshhold, scope) {
      threshhold || (threshhold = 250);
      var last,
          deferTimer;
      return function () {
        var context = scope || this;

        var now = +new Date,
            args = arguments;
        if (last && now < last + threshhold) {
          // hold on to it
          clearTimeout(deferTimer);
          deferTimer = setTimeout(function () {
            last = now;
            fn.apply(context, args);
          }, threshhold);
        } else {
          last = now;
          fn.apply(context, args);
        }
      };
    }

    // check visibility of demos - show ones closest to the center of the viewport and hide the others to go easy on the GPU
    function checkVis() {
        var elements = document.getElementsByClassName("demo");
        var ranking = [];
        // sort frame wrappers by distance from center of screen
        for (var i=0; i < elements.length; i++) {
            el = elements[i];
            dist = distanceFromCenter(el);
            ranking.push([el, dist]);
            if (typeof el.demoframe == 'undefined') el.demoframe = null;
        }
        ranking.sort(function(a, b) {
            return a[1] - b[1]
        });
        // add the top ranked to the winners list
        for (var i=0; i < frames.length; i++) {
            winners[i] = ranking[i][0];
        }
        // clear the demoframe property of the others
        for (var i=winners.length; i < ranking.length; i++) {
            ranking[i][0].demoframe = null;
        }
        // for each winner, place a frame
        for (var i=0; i < winners.length; i++) {
            // if there's already a frame there, move on
            if (winners[i].demoframe != null) {
                continue;
            }
            // place each frame at a winner
            for (var j=0; j < frames.length; j++) {
                var safeword = false;
                // check to see if it's already at one of the winners
                for (var k=0; k < winners.length; k++) {
                    // if so, skip it
                    if (frames[j].element == winners[k]) {
                        safeword = true;
                        break;
                    }
                }
                // if the safeword was triggered, move to the next winner
                if (safeword) continue;
                // hide the demoframe
                frames[j].style.visibility = "hidden";
                // remove any onloads in case it's in the middle of loading something
                frames[j].onload = null;
                // save current code state in a property called "code" on the parent div
                if (typeof frames[j].contentWindow.scene != 'undefined') {
                    frames[j].element.setAttribute("code", frames[j].contentWindow.editor.getValue());
                }
                // add demoframe and winner as properties of each other for tracking
                frames[j].element = winners[i];
                winners[i].demoframe = frames[j];

                // add a loading bar to the destination element
                winners[i].appendChild(loaders[i]);
                // move the demoframe
                moveFrameToElement(frames[j], winners[i]);
                break;
            }
        }
    };
}