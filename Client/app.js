//simple test app, to use load up the server and enter a url in the
//input area

var main = function(){
    window.document.querySelector("button").addEventListener("click",()=>{
        var url = window.document.querySelector('input').value;
        var request = new XMLHttpRequest();
        request.open("PUT", window.location.origin + "/screencap");
        request.setRequestHeader("Content-Type", "text/plain");
        request.responseType = 'blob';

        request.onload = async ()=>{
            console.log('loading image');
            var blob = request.response;
            blob = blob.slice(0, blob.size, "image/png");
            console.log(blob);
            window.document.querySelector('img').src = window.URL.createObjectURL(blob);
        }
        request.send(url);
    })
}

window.addEventListener("load", main);