/**
 * http://usejsdoc.org/
 */


var finish = require("finish");
var path = require('path');
var loadedData = require("../LoadedData");
import { BudNode } from "./BudNode";
import { Link } from "./Link";

//var Promise = require('bluebird');
import * as Promise from 'bluebird';

var pf = require("./processFile");

var fs: any = Promise.promisifyAll(require('fs'));



module.exports.readData = function () {
    return new Promise((resolve, reject) => {
        var datafilespath = path.join(__dirname, '..', 'datafiles');
        var err;
        fs.readdirAsync(datafilespath).map(function (f) {
            // Promise.map awaits for returned promises as well.
            var fullpath = path.join(datafilespath, f);
            return fs.readFileAsync(fullpath, 'utf8').then((fileData) => {
                return processFile(err, fileData,f)
            });

        }).then(function () {
            console.log("all files processed");
            //This is to return resolve to calling program so that its promise is completed
            return resolve();
        });
    }
    )
}

//read config files
module.exports.readConfigFiles = function () {
    return new Promise((resolve, reject) => {

        var configfile = path.join(__dirname, '..', 'configfiles', 'NodeTypeConfig.json');
        fs.readFileAsync(configfile, 'utf8').then((configdata) => {
            loadedData.configData = JSON.parse(configdata);
            console.log("Config parsed", loadedData.configData["app"].level);
            return resolve();
        });
    })
}



function processFile(err, data,f) {
    return new Promise((resolve, reject) => {
        pf.processFile(err, data,f);
        //Process the read lines
        return resolve();
    });
}
