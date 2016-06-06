/************************************************************************
 * This module sends the json file to the server
 * @authors Guy Melancon, Benjamin Renoust
 * @created May 2012
 ***********************************************************************/

var url = document.URL
var xhr = new XMLHttpRequest();
var xhr2 = new XMLHttpRequest();

// uploads the file and send it to TulipPosy
var file_object;
//console.log(url)

TulipPosy()

document.getElementById('files').addEventListener('change', function (e) {
    var file = this.files[0];
    //console.log('logging file before sending: ', this.files[0])
    xhr.file = file; // not necessary if you create scopes like this
    xhr.addEventListener('progress', function (e) {
        var done = e.position || e.loaded,
            total = e.totalSize || e.total;
        //console.log('xhr progress: ' + (Math.floor(done / total * 1000) / 10) + '%');
    }, false);
    if (xhr.upload) {
        xhr.upload.onprogress = function (e) {
            var done = e.position || e.loaded,
                total = e.totalSize || e.total;
            //console.log('xhr.upload progress: ' + done + ' / ' + total + ' = ' + (Math.floor(done / total * 1000) / 10) + '%');
        };
    }

    xhr.onreadystatechange = function (e) {
        if (4 == this.readyState && this.status == 200) {
            //console.log(['xhr upload complete', e]);
            /*
             remove("svg_substrate");
             remove("svg_combined");
             remove("svg_catalyst");
             remove("svg_combined");*/

            TulipPosy({file: xhr.responseText})

        }


    };

    xhr.open('post', url, true);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.setRequestHeader("X-File-Name", encodeURIComponent(this.files[0].name));
    xhr.setRequestHeader("Content-Type", "application/octet-stream");
    xhr.send(xhr.file)

}, false); 

document.getElementById('fileCSV').addEventListener('change', function(e) {
    var file = this.files[0]
    
    console.log('le fichier de test est le suivant', this.files[0])
    xhr2.file = this.files[0];
    
    
    xhr2.addEventListener('progress', function(e) {
        var done = e.position || e.loaded,
            total = e.totalSize || e.total;
        console.log('xhr progress: ' + (Math.floor(done/total*1000)/10)+'%');
    }, false);
    
    if (xhr2.upload) {
        xhr2.upload.onprogress = function (e) {
            var done = e.position || e.loaded,
                total = e.totalSize || e.total;
            console.log('xhr2.upload progress: ' + done + ' / ' + total + ' = ' + (Math.floor(done / total * 1000) / 10) + '%');
        };
    }
    

    xhr2.onreadystatechange = function (e) {
        assert(true, "state changed")
        if (4 == this.readyState && this.status == 200) {
            console.log(['xhr2 upload complete', e]);
            
            var okCSV = true
            console.log("xhr2.responseText : ")
            console.log(xhr2);
            console.log(xhr2.responseText);
            TulipPosy({file: xhr2.responseText},okCSV)
        }
    };
    
    xhr2.open('post', url, true);
    xhr2.setRequestHeader("Cache-Control", "no-cache");
    xhr2.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr2.setRequestHeader("X-File-Name",encodeURIComponent(this.files[0].name));
    xhr2.setRequestHeader("Content-Type", "text/csv")
    //xhr2.setRequestHeader("X-File-Size",encodeURIComponent(this.files[0].size));
    //xhr2.setRequestHeader("Content-Type", "application/octet-stream");
    xhr2.send(xhr2.file)
    
    
    
}, false);
