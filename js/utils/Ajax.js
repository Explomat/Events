var Promise = require('es6-promise').Promise;
var AJAX_TIME_OVER = 10000;
var CACHE_MAX_REQUESTS = 10;
var cache = {};

function isCacheOverflow(){
    return Object.keys(cache).length > CACHE_MAX_REQUESTS;
}

function getCacheRequest(url){
    if (isCacheOverflow()) {
        cache = {};
        return null;
    }
    else if (cache[url]) return cache[url];
    return null;
}

module.exports = {

    getXmlHttp: function(){
        var xmlHttp;
        try { xmlHttp = new ActiveXObject("Msxml2.XMLHTTP"); }
        catch (e) {
            try { xmlHttp = new ActiveXObject("Microsoft.XMLHTTP"); }
            catch (err) { xmlHttp = false; }
        }
        if (!xmlHttp && typeof(XMLHttpRequest) != 'undefined')
            xmlHttp = new XMLHttpRequest();
        xmlHttp.withCredentials = true;
        return xmlHttp;
    },

    uploadFile: function(url, fileName, fileData){
        var self = this;

        return new Promise(function(resolve, reject){
            var xmlHttp = self.getXmlHttp();

            xmlHttp.onreadystatechange = function() {
              if (xmlHttp.readyState == 4) {

                if(xmlHttp.status == 200){
                   resolve(xmlHttp.responseText);
                }
                else {
                    console.log(xmlHttp.status);
                    reject(xmlHttp.statusText || "Upload file error");
                }
              }
            };

            xmlHttp.open('POST', url);

            var boundary = "xxxxxxxxx";   
            xmlHttp.setRequestHeader("Content-Type", "multipart/form-data, boundary=" + boundary);
            

             // Формируем тело запроса
            var body = "--" + boundary + "\r\n";
            body += "Content-Disposition: form-data; name='myFile'; filename='" + fileName + "'\r\n";
            body += "Content-Type: application/octet-stream\r\n\r\n";
            body += fileData + "\r\n";
            body += "--" + boundary + "--";

            if(xmlHttp.sendAsBinary) {
              // только для firefox
                xmlHttp.sendAsBinary(body);
            } else {
              // chrome (так гласит спецификация W3C)
                xmlHttp.send(body);
            }  
        });
    },

    uploadFiles: function(eventTarget, url) {
        return new Promise(function(resolve, reject){
            if (!url)
                reject(Error("Unknown url"));
            var files = FileAPI.getFiles(eventTarget);
            clearTimeout(timeout);
            var xmlHttp = FileAPI.upload({
                url: url,
                files: { file_upload: files },
                complete: function (err, xhr){
                    if (err){
                        reject(err);
                    }
                    else {
                        resolve(JSON.parse(xhr.responseText));
                    }
                }
            });
             var timeout = setTimeout( function(){ 
                xmlHttp.abort();
                reject("Upload file time over");
            }, AJAX_TIME_OVER);
        });
    },

    sendRequest: function(url, data, isCache, isSync, xmlHttpRequest, requestType) {
        var cacheRequest = getCacheRequest(url);
        if (cacheRequest) return cacheRequest;
        if (!url) return Promise.reject(Error("Unknown url"));
        url = isCache === false ? encodeURI(url + "&r=" + Math.round(Math.random() * 10000)) : encodeURI(url);
        
        cache[url] = new Promise(function(resolve, reject){

            var xmlHttp = xmlHttpRequest || this.getXmlHttp();
            requestType = requestType || 'GET';
            isSync = isSync || true;

            xmlHttp.open(requestType, url, isSync);
            //xmlHttp.setRequestHeader("Authorization", 'Basic ' + btoa('matveev.s:matveev.s'));
            xmlHttp.onreadystatechange = function() {
              if (xmlHttp.readyState == 4) {
                if (timeout)
                    clearTimeout(timeout);

                if(xmlHttp.status == 200){
                   resolve(xmlHttp.responseText);
                }
                else {
                    console.log(xmlHttp.status);
                    reject(xmlHttp.statusText || "Ajax request error");
                }
              }
            };
            xmlHttp.send(data || null);

            if (isSync){
                var timeout = setTimeout( function(){ 
                    xmlHttp.abort();
                    reject("Ajax request time over");
                }, AJAX_TIME_OVER);
            }
        }.bind(this));
        
        return cache[url];
    }
}     
