
/**
 * Module dependencies.
 */

var express = require('express')
 // , user = require('./routes/user')
  , http = require('http')
 // , routes = require('./routes/index')
  , path = require('path');
//
import  * as Promise from 'bluebird';
//var Promise = require('bluebird');
var fs:any = Promise.promisifyAll(require('fs'));
var app = express();

var data = require('./data/data');
var loadedData = require("./LoadedData");

Promise.config({
    // Enable warnings
    warnings: true,
    // Enable long stack traces
    longStackTraces: true,
    // Enable cancellation
    cancellation: true,
    // Enable monitoring
    monitoring: false
});


function loadData() {


  //Load config files
  data.readConfigFiles()
    .then(() => { console.log("about to call read data",loadedData.configData); return data.readData() })
    .then(() => { console.log("Read dir completed - Links",loadedData.linksInstance);
    console.log("Read complete - Nodes",  loadedData.budNodesInstance)  });
//     .then(()=>{
//         http.createServer(app).listen(app.get('port'), function(){
//   console.log('Express server listening on port ' + app.get('port'));
// });

 //   });
 

}




// all environments
app.set('port', process.env.PORT || 3000);
//app.set('views', __dirname + '/views');
//app.set('view engine', 'jade');
//app.use(express.favicon());
//app.use(express.logger('dev'));
//app.use(express.bodyParser());
//app.use(express.methodOverride());
//app.use(app.router);
//app.use(express.static(path.join(__dirname, 'public')));

// development only
//if ('development' == app.get('env')) {
//  app.use(express.errorHandler());
//}


//app.use('/', routes);


loadData();

//
