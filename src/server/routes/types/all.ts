var vizJs = require('viz.js');
import { BudNode } from "../../data/BudNode";
import { BudNodeMatcher } from "../../BudNodeMatcher";
var loadedData = require("../../LoadedData");

module.exports = {
    test(req, res) {
        //console.log("hahahha");
        //res.send("hahaha");

        var reqNode: BudNode = loadedData.budNodesInstance.getNodeByName("accounts-api");
        console.log("Success is sweat!", reqNode);
        var matcher: BudNodeMatcher = new BudNodeMatcher();
        matcher.buildGraph("accounts-api", false, 0, null, false);
        console.log(" Cluster sizes", matcher.getGraph().toString());
        res.send(vizJs(matcher.getGraph().toString()));
        //res.send('hahaha');
    }
}