import { BudNodes } from "./data/BudNodes";
import { Links } from "./data/Links";
var config = require("./configfiles/NodeTypeConfig.json");

module.exports = {
    budNodesInstance: new BudNodes(),
    linksInstance: new Links(),
    configData: config
}