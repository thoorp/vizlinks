/**
 * http://usejsdoc.org/
 */


var finish = require("finish");
var path = require('path');
var loadedData = require("../LoadedData");
import { BudNode } from "./BudNode";
import { Link } from "./Link";
import {Tags} from "./Tags"

var pf = require("./processFile");
//var Promise = require('bluebird');

import * as fs from 'fs';
//var fs = require('fs');
import * as Logger from "bunyan";


let log: Logger = Logger.createLogger({ name: 'vizLinks', level: 'debug' });





//read config files
module.exports.readConfigFiles = function () {

        var configfile = path.join(__dirname, '..', 'configfiles', 'NodeTypeConfig.json');
        var configdata = fs.readFileSync(configfile, 'utf8');
        loadedData.configData = JSON.parse(configdata);
            log.info("Config parsed", loadedData.configData["app"].level);
        
}



        //Process the read lines


        // console.log(dataArray);
module.exports.readData = function () {
  
        var datafilespath = path.join(__dirname, '..', 'datafiles');
        var err;
        fs.readdirSync(datafilespath).map(function (f) {
            // Promise.map awaits for returned promises as well.
            f = path.join(datafilespath, f);
            return pf.processFile(err,fs.readFileSync(f, 'utf8'))
        });
        log.debug(loadedData.budNodesInstance)
        
} 


