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
function buildTags(fileconfig, filename): Tags {

    var retTag = new Tags();

    //Define the method that taks one key and adds a tag for that one tag category. 
    //if curr object is Array  call addTags if not call addTag
    const buildkeys = curr => {
        R.propIs(Array, curr, configtags) ?
            retTag.addTags(curr, configtags[curr]) : retTag.addTag(curr, configtags[curr]);
    }

    var configtags = R.path('N/A', [filename, 'tags'], fileconfig);
    if (configtags != 'N/A') {
        //loop through each tag category and build keys for each category
        R.forEach(buildkeys, R.keys(configtags));
    }
    return retTag;
}

//Process each cell of the line
module.exports.processFile = function (err, data, filename: string) {
    if (err) throw err;

    var lines: string[] = data.split("\r\n");
    var headers: string[] = lines.shift().split("\t");
    var fileTag: Tags = buildTags(fileconfig, filename);
    log.debug("File tags", filename, fileTag);

    const processCell = (accum, currCell, col) => {
        var currentNode: BudNode = accum[0];
        var currentLink: Link = accum[1];
        var currentTag: Tags = accum[2];

        if (headers[col].startsWith("~")) {//this is a tag

            currentTag.addTag(headers[col].substring(1), currCell)
            log.debug("Adding tag", currentTag.getAllTags());
            return accum; //skip rest of logic
        }

        if (!headers[col].startsWith("*")) {//Not a new node, only a property, add it and return
            if (currentNode) currentNode.addUserProperty(headers[col], currCell);
            return accum; //skip rest of the logic
        }

        var node: BudNode = loadedData.budNodesInstance.getOrAddNode(headers[col].substring(1),
            currCell.trim(), loadedData.configData, currentTag);

        if (currentNode == null) {//first item being processed; just add node as current node and return
            return [node, currentLink, currentTag];
        }

        // if current node is not empty, then either add it as a child or
        // add a link between current node and this node
        if (node.isDependentLevel()) {
            currentNode.addChild(node);
            //replace parent node with child node (ex: 4th column in api-function2api-function.txt)
            if (currentLink != null && currentLink.getDestNode().equals(currentNode)) {
                currentLink.setDestNode(node);
            }
        } else {
            //Node is of parent level, hence create the link with previous node
            currentLink = new Link(currentNode, node, currentTag);
            loadedData.linksInstance.addLink(currentLink);
        }

        return [node, currentLink, currentTag];
    }

    // Process each line
    const processLine = (currLine) => {
        var currentNode: BudNode = null;
        var currentLink: Link = null;
        var currentTag: Tags = fileTag.clone(); //clone file level tags to add any line level tags
        if (currLine.startsWith("***")) return; //ignore comment lines

        var dataArray = currLine.split("\t");
        //reduce the array of cells by passing output of one cell to next as they are interdependent
        dataArray.reduce(processCell, [currentNode, currentLink, currentTag]);

    }


    lines.forEach(processLine);
}