/*
tutorial-embeds.js
tutorial-embeds.css
author: Peter Richardson 2017
contact: peter@mapzen.com

This code was written for use in Tangram tutorials pages to allow multiple Tangram Play embeds on a page while limiting resource usage. It expects a number of target divs on a page, each with class="demo" and a "source" attribute which is to be the "src" of a loaded iframe.

It creates a number of iframes (set by the numberOfFrames variable) and moves them from place to place, setting the src of each. It then saves any changes made in the Play editor to a blob, and sets a new "source" attribute with a BlobURL.

Example div:

    <div class="demo" id="demo6" source="http://localhost:8080/embed/?go=👌&scene=https://tangrams.github.io/tangram-docs/tutorials/custom/custom6.yaml#17/40.76442/-73.98058"></div>
    </div>

*/

// set number of editor frames to use
var editorheight = document.getElementsByClassName("demo")[0].offsetHeight;
var numberOfFrames = Math.floor(window.innerHeight / editorheight);
// minimum of 1, maximum of 3
numberOfFrames = Math.min(4, Math.max(1, numberOfFrames));

// set variables
var frames = [];
var winners = [];
var loaders = [];

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

// moveFrameToElement's 'load' event callback
function loadFunction() {
    // hide Play embed's "refresh" button
    // todo: figure out a way to make this load the original source
    this.contentDocument.getElementsByClassName("refresh-button")[0].style.display = "none";
    el = this.element;
    if (typeof el != 'undefined') {
        // remove any loaders
        while (el.getElementsByClassName('demo-loading').length > 0) el.removeChild(el.getElementsByClassName('demo-loading')[0]);
    }
    checkVis();
}

// move iframe to target element
function moveFrameToElement(frame, el) {
    if (typeof el == 'undefined') return false;

    // empty the iframe
    frame.contentDocument.write("<div height='100%'>&nbsp;</div>");
    // position iframe
    newtop = el.offsetTop;
    frame.style.top = newtop+"px";
    frame.style.left = el.offsetLeft+"px";
    // show the iframe once it's loaded
    frame.addEventListener('load', loadFunction, false);

    // set the source of the iframe from the saved property
    if (typeof el.getAttribute("source") != 'undefined') {
        frame.src = el.getAttribute("source");
    } else {
        return new Error("no src set for demo frame:", frame);
    }
}

// replace the value of a parameter in a url
// http://stackoverflow.com/a/20420424/738675
function replaceUrlParam(url, paramName, paramValue){
    if(paramValue == null)
        paramValue = '';
    var pattern = new RegExp('\\b('+paramName+'=).*?(&|$|#)')
    if(url.search(pattern)>=0){
        return url.replace(pattern,'$1' + paramValue + '$2');
    }
    return url + (url.indexOf('?')>0 ? '&' : '?') + paramName + '=' + paramValue 
}

function makeBlobURL(str) {
    blob = new Blob([str], {type: "text/plain"});
    if(window.navigator.msSaveOrOpenBlob) {
        // ie/edge can't do it >:/
        return false;
    } else {
        var urlCreator = window.URL || window.webkitURL; 
        return urlCreator.createObjectURL(blob);
    }
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

            // remove any event listeners in case it's in the middle of loading something
            frames[j].removeEventListener('load', loadFunction, false);
            // save current code state to a BlobURL, set it as the parent's new "source"
            if (typeof frames[j].contentWindow.scene != 'undefined') {
                newsrc = makeBlobURL(frames[j].contentWindow.editor.getValue());
                if (newsrc) {
                    newsource = replaceUrlParam(frames[j].element.getAttribute("source"), "scene", newsrc);
                    frames[j].element.setAttribute("source", newsource);
                }
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

window.onload = function() {
    // create links
    var demos = document.getElementsByClassName('demo-wrap');
    for (x=0; x < demos.length; x++) {
        var demo = demos[x];
        href = demo.getElementsByClassName('demo')[0].getAttribute("source");
        link = "<span class='caption'><a target='_blank' href='"+href+"'>( Open in Play ▶ )</a></span>";
        demo.innerHTML += link;
    }

    // create new iframes
    for (x = 0; x < numberOfFrames; x++) {
        frames[x] = document.createElement("iframe");
        frames[x].classList.add("demoframeclass");
        frames[x].setAttribute("id", "frame"+x);
        document.getElementsByClassName("documentation-content")[0].appendChild(frames[x]);
        loaders[x] = document.createElement("div");
        loaders[x].classList.add("demo-loading");
    }

    checkVis();

    // throttle checkVis function
    window.onscroll = throttle(function() {checkVis()}, 250);

    function throttle(fn, threshhold, scope) {
      threshhold || (threshhold = 250);
      var last, deferTimer;
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
}