
/*
 *  Fetch for files
 */
function fetchHTTP(url, methood){
    var request = new XMLHttpRequest(), response;

    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            response = request.responseText;
        }
    }
    request.open(methood ? methood : 'GET', url, false);
    request.send();
    return response;
}

function loadMarkdown(){
    var mdText = fetchHTTP("README.md");
    content.innerHTML = marked(mdText);
}

window.onload = function(){
    loadMarkdown();
};