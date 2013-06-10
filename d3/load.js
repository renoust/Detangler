/************************************************************************
 * This module sends the json file to the server
 * @authors Guy Melancon, Benjamin Renoust
 * @created May 2012
 ***********************************************************************/

var url = 'http://localhost:8085'
var xhr = new XMLHttpRequest();

// uploads the file and send it to TulipPosy
var file_object;


document.getElementById('files').addEventListener('change', function (e) {
    var file = this.files[0];
    console.log('logging file before sending: ', this.files[0])
    xhr.file = file; // not necessary if you create scopes like this
    xhr.addEventListener('progress', function (e) {
        var done = e.position || e.loaded,
            total = e.totalSize || e.total;
        console.log('xhr progress: ' + (Math.floor(done/total*1000)/10)+'%');
    }, false);
    if (xhr.upload) {
        xhr.upload.onprogress = function (e) {
            var done = e.position || e.loaded,
                total = e.totalSize || e.total;
            console.log('xhr.upload progress: ' + done + ' / ' + total + ' = ' + (Math.floor(done / total * 1000) / 10) + '%');
        };
    }

    xhr.onreadystatechange = function (e) {
        if (4 == this.readyState && this.status == 200) {
            console.log(['xhr upload complete', e]);/*
            remove("svg_substrate");
            remove("svg_combined");
            remove("svg_catalyst");
            remove("svg_combined");*/

            TulipPosy({file: xhr.responseText})
        }
    };

    xhr.open('post', url, true);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.setRequestHeader("X-File-Name",encodeURIComponent(this.files[0].name));
    xhr.setRequestHeader("Content-Type", "application/octet-stream");
    xhr.send(xhr.file)
}, false);