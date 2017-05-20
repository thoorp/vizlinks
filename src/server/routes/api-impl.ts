var vizJs = require('viz.js');
var loadedData = require("../LoadedData");
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
        var reqNode: BudNode = loadedData.budNodesInstance.getNodeByName(req.params.name);
        //console.log("Success is sweat!", reqNode);
        var matcher: BudNodeMatcher = new BudNodeMatcher();
        var activeNodeNames: Array<string> = new Array();
        console.log(req.query.activeNodeNames);
        var maxLevel = req.query.level == 0 ? 100 : req.query.level;
        matcher.buildGraph(req.params.name, (req.query.view == "detailed"), maxLevel, null, req.query.showCommonOnly);
        //console.log(" Cluster sizes", matcher.getGraph().toString());
        res.send(vizJs(matcher.getGraph().toString()));
    }
}