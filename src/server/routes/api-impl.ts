const vizJs = require('viz.js');
const loadedData = require("../LoadedData");
const util = require('util');
import { BudNode } from "../data/BudNode";
import { BudNodeMatcher } from "../BudNodeMatcher";

module.exports = {
    types(req, res) {
        var types: Array<string> = loadedData.budNodesInstance.getNodeTypes();
        res.send(types.sort());
    },

    typeDetails(req, res) {
        res.send("not ready to return config for - " + req.params.name);
    },

    nodesByType(req, res) {
        var budNodes: Array<BudNode> = loadedData.budNodesInstance.getNodes(req.params.type);
        var names: Array<string> = new Array();
        for (let budNode of budNodes) {
            names.push(budNode.getName());
        }

        res.send(names.sort());
    },

    connectDots(req, res) {
        var nodeName = decodeURIComponent(decodeURIComponent(req.params.name)).replace(/\+/g, ' ');
        var reqNode: BudNode = loadedData.budNodesInstance.getNodeByName(nodeName);
        //console.log("Success is sweat!", reqNode);
        var matcher: BudNodeMatcher = new BudNodeMatcher();
        var activeNodeNames: Array<string> = new Array();
        activeNodeNames.push(req.query.activeNodes);
        var maxLevel = req.query.level == 0 ? 100 : req.query.level;
        matcher.buildGraph(nodeName, (req.query.view == "detailed"), maxLevel, activeNodeNames, req.query.showCommonOnly);
        //console.log(" Cluster sizes", matcher.getGraph().toString());
        if (req.accepts('application/svg+xml')) {
            res.send(vizJs(matcher.getGraph().toString()));
        }
        if (req.accepts('application/json')) {            
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.parse(JSON.stringify(matcher.getGraph(), function (key, val) {
                if (key !== "cluster")
                    return val;
            },2)));
        }
    }
}