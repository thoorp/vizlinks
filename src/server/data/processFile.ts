var path = require('path');
var loadedData = require("../LoadedData");
import { BudNode } from "./BudNode";
import { Link } from "./Link";
import { Tags } from "./Tags";
import * as Logger from "bunyan";

const R = require("ramda");
var fileconfig = require("../configfiles/FileConfig.json");

let log: Logger = Logger.createLogger({ name: 'vizLinks', level: 'info' });

/**
 * Takes the file name and reads corresponding tags from fileconfig if they exist 
 * create Tags objects from the same.
 * @param fileconfig fileconfig file json into a object
 * @param filename just filename wthout the path
 */
function buildTags(fileconfig,filename):Tags {
  
    var retTag = new Tags();
  
    //Define the method that taks one key and adds a tag for that one tag category. 
    const buildkeys = curr => {
          R.propIs(Array, curr, configtags) ?
            retTag.addTags(curr, configtags[curr]) : retTag.addTag(curr, configtags[curr]);
    }


    if (fileconfig != null && fileconfig[filename] != null && fileconfig[filename].tags != null) {
        var configtags = fileconfig[filename].tags;
    //loop through each tag category and build keys for each category
        R.forEach(buildkeys, R.keys(configtags));
    }
    return retTag;
    //console.log(retTag);
}


module.exports.processFile = function (err, data,filename:string) {
    if (err) throw err;
    var dataArray = [];

    var i = 0;
    var lines: string[] = data.split("\r\n");
    var headers: string[] = lines[0].split("\t");
    var fileTag:Tags= buildTags(fileconfig,filename);
    log.debug("File tags",filename,fileTag);
   
    //read all the data into a array(row) of arrays(col)
    for (i = 0; i < lines.length - 1; i++) {
        var currentNode: BudNode = null;
        var currentLink: Link = null;
        var currentTag: Tags = fileTag.clone();
        //log.debug(lines[i+1]);
        if (lines[i + 1].startsWith("***")) {//ignore comment lines
        } else {
            dataArray[i] = lines[i + 1].split("\t");
            for (var col = 0; col < dataArray[i].length; col++) {
                // console.log(loadedData.configData);
                if (headers[col].startsWith("~")) {//this is a tag

                    currentTag.addTag(headers[col].substring(1), dataArray[i][col])
                    log.debug("Adding tag", currentTag.getAllTags());
                    continue; //skip rest of logic
                }
                if (headers[col].startsWith("*")) {
                    //  console.log("data element", dataArray[i][col]);
                    var node: BudNode = loadedData.budNodesInstance.getOrAddNode(headers[col].substring(1),
                        dataArray[i][col].trim(), loadedData.configData, currentTag);
   //                 if (currentTag.hasTags()) log.debug("processing cl",node.getName(), "children", R.map(x => x.getName(), node.getChildren()));
                    // console.log(node);
                    if (currentNode != null) {
                        //if (currentTag.hasTags()) log.debug("current node", currentNode.getName());
                        // if current node is not empty, then either add it
                        // as a child or
                        // add a link between current node and this node
                        if (node.isDependentLevel()) {
                            currentNode.addChild(node);
     //                       if (currentTag.hasTags()) log.debug("isdependent level", currentNode.getName(), "children", R.map(x => x.getName(), currentNode.getChildren()));
                            if (currentLink != null && currentLink.getDestNode().equals(currentNode)) {
                                //replace parent node with child node (ex: 4th column in api-function2api-function.txt)
                                currentLink.setDestNode(node);
                            }
       //                     if (currentTag.hasTags() && currentLink != null) log.debug("currentLink is dep", currentLink.getSrcNode().getName(), currentLink.getDestNode().getName());

                        } else {

                            currentLink = new Link(currentNode, node, currentTag);

                            loadedData.linksInstance.addLink(currentLink); // TODO
         //                   if (currentTag.hasTags()) log.debug("currentLink else", currentLink.getSrcNode().getName(), currentLink.getDestNode().getName());
                        }
                    }
           //          if(currentNode && currentTag.hasTags()) console.log("Current Node name parent",currentNode.getName(),
           //          currentNode.getParent()!=null?currentNode.getParent().getName():null);
                    currentNode = node;

                } else {
                    // call addproperty on current node
                    currentNode.addUserProperty(headers[col], dataArray[i][col]);
                }

            }
        }
    }

}