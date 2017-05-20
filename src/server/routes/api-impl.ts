var vizJs = require('viz.js');
import { BudNode } from "../data/BudNode";
import { BudNodeMatcher } from "../BudNodeMatcher";
//import {Request, Response, NextFunction} from "express";
var loadedData = require("../LoadedData");

module.exports = {
    types(req, res) {
        var types: Array<string> = loadedData.budNodesInstance.getNodeTypes();
        res.send(types);
    },

    //typeDetails(req: Request, res: Response) {
    typeDetails(req, res) {
        res.send("not ready to return config for - " + req.params.name);
    },

    test(req, res) {
        var reqNode: BudNode = loadedData.budNodesInstance.getNodeByName("accounts-api");
        //console.log("Success is sweat!", reqNode);
        var matcher: BudNodeMatcher = new BudNodeMatcher();
        matcher.buildGraph("accounts-api", false, 3, null, false);
        //console.log(" Cluster sizes", matcher.getGraph().toString());
        res.send(vizJs(matcher.getGraph().toString()));
    }
}

