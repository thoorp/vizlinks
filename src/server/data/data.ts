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

var fs: any = Promise.promisifyAll(require('fs'));



module.exports.readData = function () {
    return new Promise((resolve, reject) => {
        var datafilespath = path.join(__dirname, '..', 'datafiles');
        var err;
        fs.readdirAsync(datafilespath).map(function (f) {
            // Promise.map awaits for returned promises as well.
            f = path.join(datafilespath, f);
            return fs.readFileAsync(f, 'utf8').then((fileData) => {
                return processFile(err, fileData)
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



function processFile(err, data) {
    return new Promise((resolve, reject) => {
        if (err) throw err;
        var dataArray = [];

        var i = 0;
        var lines = data.split("\n");
        var headers = lines[0].split("\t");
        //read all the data into a array(row) of arrays(col)
        for (i = 0; i < lines.length - 1; i++) {
            var currentNode: BudNode = null;
            var currentLink: Link = null;
            if (lines[i + 1].startsWith("***")) {//ignore comment lines
            } else {
                dataArray[i] = lines[i + 1].split("\t");
                for (var col = 0; col < dataArray[i].length; col++) {
                    // console.log(loadedData.configData);

                    if (headers[col].startsWith("*")) {
                        console.log("data element", dataArray[i][col]);
                        var node = loadedData.budNodesInstance.getOrAddNode(headers[col].substring(1), dataArray[i][col],loadedData.configData);
                       // console.log(node);
                        if (currentNode != null) {
                            // if current node is not empty, then either add it
                            // as a child or
                            // add a link between current node and this node
                            if (node.isDependentLevel()) {
                                currentNode.addChild(node);
                                if (currentLink != null && currentLink.getDestNode().equals(currentNode)) {
                                    //replace parent node with child node (ex: 4th column in api-function2api-function.txt)
                                    currentLink.setDestNode(node);
                                }

                            } else {

                                currentLink = new Link(currentNode, node);

                                loadedData.linksInstance.addLink(currentLink); // TODO
                            }
                        }
                       // console.log("Current Node",currentNode);
                        currentNode = node;
                        
                    } else {
                        // call addproperty on current node
                        currentNode.addUserProperty(headers[col], dataArray[i][col]);
                    }

                }
            }
        }

        //Process the read lines


        // console.log(dataArray);
        return resolve();
    });
}
