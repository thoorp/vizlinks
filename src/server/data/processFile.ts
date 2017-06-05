var path = require('path');
var loadedData = require("../LoadedData");
import { BudNode } from "./BudNode";
import { Link } from "./Link";
import { Tags } from "./Tags";
import * as Logger from "bunyan";


let log: Logger = Logger.createLogger({ name: 'vizLinks', level: 'debug' });

module.exports.processFile =function (err, data) {
        if (err) throw err;
        var dataArray = [];

        var i = 0;
        var lines:string[] = data.split("\r\n");
        var headers:string[] = lines[0].split("\t");
        //read all the data into a array(row) of arrays(col)
        for (i = 0; i < lines.length - 1; i++) {
            var currentNode: BudNode = null;
            var currentLink: Link = null;
            var currentTag:Tags=new Tags();
            //log.debug(lines[i+1]);
            if (lines[i + 1].startsWith("***")) {//ignore comment lines
            } else {
                dataArray[i] = lines[i + 1].split("\t");
                for (var col = 0; col < dataArray[i].length; col++) {
                    // console.log(loadedData.configData);
                    if(headers[col].startsWith("~")){//this is a tag
                        
                        currentTag.addTag(headers[col].substring(1),dataArray[i][col])
                        log.debug("Adding tag",currentTag.getAllTags());
                        continue; //skip rest of logic
                    }    
                    if (headers[col].startsWith("*")) {
                      //  console.log("data element", dataArray[i][col]);
                        var node = loadedData.budNodesInstance.getOrAddNode(headers[col].substring(1),
                         dataArray[i][col],loadedData.configData,currentTag);
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

                                currentLink = new Link(currentNode, node,currentTag);

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

}