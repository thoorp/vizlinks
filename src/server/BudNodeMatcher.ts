import { BudNode } from "./data/BudNode";
import { Link } from "./data/Link";
import { BudNodes } from "./data/BudNodes";
import { Links } from "./data/Links";
import { Cluster } from "./data/graphviz/Cluster";
import { Graph } from "./data/graphviz/Graph";
import { VizNode } from "./data/graphviz/VizNode";
import { VizdotsConstants } from "./VizdotsConstants";
import * as Logger from "bunyan";
import {Tags} from "./data/Tags"

var loadedData = require("./LoadedData");


var log = Logger.createLogger({name: 'vizLinks'});
log.level("info");

export class BudNodeMatcher {
    reqTags: Tags;


    graph: Graph = new Graph();
    isDetailed: boolean = false;
    requestedMaxLevels: number; //Stores the number of levels up/down stream that we should navigate from active node
    calcMaxLevels: number = 0;
    direction: number = 0; //Keeps track of current direction
    currentLevel: number = 0; // transient variable that always track the level in which the current processing is happening
    //BudNode toNode = null; //if the graph is requested between 2 nodes, this stores the destination node to which graph should be drawn
    //activeNodes are the ones that will be processed for both up&downstream. Earlier it was single node, but now multiple
    activeBudNodes: Array<BudNode> = [];
    //commonNodes that are connected to all active nodes; applicable when there is more than one active node
    commonBudNodes: Array<BudNode> = [];
    activeBudNode: BudNode; // to store the active node(node that is requested) so
    // it is available through the recursion
    //Store all up/down stream nodes for each active node


    dependentBudNodes: Map<BudNode, Set<BudNode>> = new Map<BudNode, Set<BudNode>>();

    //Show common nodes only
    showCommonOnly: boolean = false;
    public static DIRECTION_UP: number = 1;
    public static DIRECTION_DOWN: number = 2;



    public addActiveNodes(reqNode: BudNode, activeNodeNames: Array<string>) {
        this.activeBudNodes.push(reqNode);
        if (activeNodeNames != null)
            for (var i = 0; i < activeNodeNames.length; i++) {
                var budNode: BudNode = loadedData.budNodesInstance.getNodeByName(activeNodeNames[i],this.reqTags);
                if (budNode != null)
                    this.activeBudNodes.push(budNode);
            }
    }

    protected addLateralNode(reqBudNodeForLaterals: BudNode, lateralBudNode: BudNode, srcNodeCluster: Cluster) {
        var lateralNodeName: string = this.getLateralNodeName(reqBudNodeForLaterals, lateralBudNode);
        if (srcNodeCluster.findNode(lateralNodeName) == null) {
            var lateralNode: VizNode = VizNode.createNode(lateralBudNode);
            lateralNode.setName(lateralNodeName);
            srcNodeCluster.getNodes().push(lateralNode);
        }
    }


    protected addLateralNodeWithItsParent(lateralBudNode: BudNode, lateralParentBudNode: BudNode,
        srcNodeCluster: Cluster, graphClusterSize: number) {
        var lateralParentCluster: Cluster = Cluster.createCluster(lateralParentBudNode, graphClusterSize);
        var lateralNode: VizNode = VizNode.createNode(lateralBudNode);
        lateralParentCluster.getNodes().push(lateralNode);
        lateralNode.setCluster(lateralParentCluster);
        srcNodeCluster.getClusters().push(lateralParentCluster);
    }

    protected buildDestNode(updownBudNode: BudNode) {
        //Note: reqSrcNode is already present in the graph. 
        //if detailed or parent node then build edges and nodes as is	
        if (this.isDetailedOrTopIndependentLevel(updownBudNode)) {
            this.graph.buildNode(this.isDetailed, updownBudNode);
        }
        // if high level and current node is a child, then build edges for its parent
        else {
            this.graph.buildNode(this.isDetailed, updownBudNode.getParent());
        }
    }

    //TODO: This method needs to be refactored
    protected buildEdge(reqSrcBudNode: BudNode, updownBudNode: BudNode) {
        //Note: reqSrcNode is already present in the graph. 
        //if detailed or parent node then build edges and nodes as is
        var req: BudNode = reqSrcBudNode;
        var updown: BudNode = updownBudNode;
        if (this.isDetailedOrTopIndependentLevel(updownBudNode)) {
            if (reqSrcBudNode.isDependentLevel() && !this.isDetailed)
                req = reqSrcBudNode.getParent();
        }
        // if high level and current node is a child, then build edges for its parent
        else {
            //Handle condition if one side of edge is to a dependent node and other side is to a independent node
            if (reqSrcBudNode.isDependentLevel()) {
                req = reqSrcBudNode.getParent();
                updown = updownBudNode.getParent();
            }
            else
                updown = updownBudNode.getParent();
        }
        this.graph.buildEdge(this.isDetailed, req, updown, this.direction);
    }

	/**
	 * This is the primary method that acts as a entry into the graph traversal logic.
	 * @param reqNodeName	is the requested active node
	 * @param isDetailed  to specifiy whether requested graph is detailed graph or high level graph
	 * @param maxLevelsParam specifies number of levels of connections on each sides is required from active node.
	 * @param activeNodeNames specifies list of nodes to merge graph and identify common nodes
	 * @param showCommonOnly if true will hide all nodes that are not common between supplied activeNodes. Applicable only if activeNodes parameter is not empty
	 */
    public buildGraph(reqNodeName: string, isDetailed: boolean, maxLevelsParam: number, activeNodeNames: Array<string>,
     showCommonOnly: boolean, passedTags:Tags=new Tags()) {
        this.reqTags = passedTags;
        var reqNode: BudNode = loadedData.budNodesInstance.getNodeByName(reqNodeName, this.reqTags);
        if (reqNode == null)  //current node invalid, stop proessing
        {
             log.warn("Cannot find passed node", reqNodeName);
            return;
        }
        //Sets detailed graph flag based on what is passed and if implicit decision made to show detailed
        this.isDetailed = isDetailed;
        this.requestedMaxLevels = maxLevelsParam;
        this.showCommonOnly = showCommonOnly;

        //Get corresponding BudNode for all the activeNodes requested.s
        this.addActiveNodes(reqNode, activeNodeNames);

        //Generate graph for each activeNode
        this.generateGraphForActiveNodes();
        //console.log("After generate graph",this.graph);
        //To highlight the passed active nodes (the heading/text)		
        this.highlightActiveNodes();

        //Process the common nodes highlighting only if I have more than 1 node
        if (this.activeBudNodes.length > 1)
            this.processCommonNodes();

    }

	/**
	 * build lateral node connection/containment with reqBudNodeForLaterals
	 * 
	 * @param reqBudNodeForLaterals
	 *            node for which we populate the lateral nodes
	 * @param lateralNode
	 *            lateral node
	 * @param upstreamlaterals
	 */
    buildLateralNode(reqBudNodeForLaterals: BudNode, lateralNode: BudNode, upstreamlaterals: boolean) {
        // to be able to capture both the destBudNode and it's parent (if
        // exists) inside the srcBudNode
        //console.log("Building Lateral node",lateralNode.getName());

        var destParentBudNode: BudNode = lateralNode.getParent();
        var srcParentBudNode: BudNode = reqBudNodeForLaterals.getParent();

        var srcNodeCluster: Cluster = this.getSrcNodeCluster(reqBudNodeForLaterals, srcParentBudNode);
        // check if dest node is not present inside src node cluster, add it.
        // the below code will ensure dbuser node becomes part of database
        // cluster which in turn gets added to srcBudNode cluster
        if (destParentBudNode == null) {
            // Below condition is reached when a lateral node is the requested
            // node and getting first level of upstream lateral node.
            // This will enable put them in a single cluster and make it
            // visible.
            if (upstreamlaterals) {
                this.processUpStreamLaterals(reqBudNodeForLaterals, lateralNode, srcNodeCluster);
            } else { // concatenate srcNode name to lateral node so that same
                // lateral
                // node can be displayed in different srcnodes
                this.addLateralNode(reqBudNodeForLaterals, lateralNode, srcNodeCluster);
            }

        } else {
            this.addLateralNodeWithItsParent(lateralNode, destParentBudNode, srcNodeCluster, this.graph.getClusterSize());
        }

    }

	/**
	 * This method is to process lateral nodes (like db, domain etc)
	 * @param isActiveNode
	 * @param reqBudNodeForLaterals
	 */
    private findAndBuildLateralNodes(isActiveNode: boolean, reqBudNodeForLaterals: BudNode) {

        // You get lateral only through down stream in both directions. Only
        // for active node, you go upstream for lateral nodes;
        // Ex: For a database/domain you get one level of upstream laterals and
        // then for each node it is downstream.

        var lateralNodes: Array<BudNode> = loadedData.linksInstance.getLateralNodes(isActiveNode, reqBudNodeForLaterals, 
        this.direction,this.reqTags);

        var upstreamlaterals: boolean = (this.direction == BudNodeMatcher.DIRECTION_UP && isActiveNode);
        //  console.log ("findAndBuildLateralNodes",reqBudNodeForLaterals.getName(),lateralNodes.length);

        for (var i: number = 0; i < lateralNodes.length; i++) {

            var lateralNode: BudNode = lateralNodes[i];
            // use displayForNonActiveNode to determine whether to build lateral
            // nodes or not for non-active nodes
            if ((isActiveNode || lateralNode.isDisplayForNonActiveNode())
                // the below condition prevents infinite recursive loop.?
                && !this.activeBudNode.equals(lateralNode)) {
                this.buildLateralNode(reqBudNodeForLaterals, lateralNode, upstreamlaterals);
                this.populateDetailedDependency(lateralNode, false);
            }
        }
    }

    private generateGraphForActiveNodes() {
        var reqNode: BudNode;
        for (var i: number = 0; i < this.activeBudNodes.length; i++) {
            var currentactivenode: BudNode = this.activeBudNodes[i];
            if (currentactivenode != null) {
                this.activeBudNode = currentactivenode;
                //Create a empty hash set for each active node to store all the up/downstream nodes

                this.dependentBudNodes.set(currentactivenode, new Set<BudNode>());
                reqNode = currentactivenode;
                // Build graphically the active node
                this.graph.buildNode(this.isDetailed, reqNode);
                // Traverse the tree down
                this.direction = BudNodeMatcher.DIRECTION_DOWN;
               log.info("Direction Down", reqNode.getName());

                this.populateDetailedDependency(reqNode, true);
                // Traverse the tree up
                this.direction = BudNodeMatcher.DIRECTION_UP;
                log.info("Direction up", reqNode.getName());
                this.populateDetailedDependency(reqNode, true);
            }
        }
    }


    public getActivenodes(): Array<BudNode> {
        return this.activeBudNodes;
    }

    public getCalcMaxLevels(): number {
        return this.calcMaxLevels;
    }

    public getCommonNodes(): Array<BudNode> {
        return this.commonBudNodes;
    }

    public getGraph(): Graph {
        return this.graph;
    }

    public getLateralNodeName(reqBudNodeForLaterals: BudNode, lateralNode: BudNode): string {
        return reqBudNodeForLaterals.getName() + ":" + lateralNode.getName();
    }

    protected getSrcNodeCluster(reqBudNodeForLaterals: BudNode, srcParentBudNode: BudNode): Cluster {
        var srcNodeCluster: Cluster = null;
        // check if the cluster already exists in graph
        // code added to put containment of a cluster inside a cluster (dbuser
        // in a db)
        if (srcParentBudNode != null) {
            var srcParentNodeCluster: Cluster = this.graph.findorAddClusterByLabel(srcParentBudNode);
            srcNodeCluster = srcParentNodeCluster.findOrAddClusterByLabel(reqBudNodeForLaterals, this.graph.getClusterSize());
        } else {
            srcNodeCluster = this.graph.findorAddClusterByLabel(reqBudNodeForLaterals);
        }
        return srcNodeCluster;
    }

    protected highlightActiveNodeParent(activeBudNode: BudNode) {
        if (activeBudNode.getParent() != null) {
            var activeNodeCluster: Cluster = this.graph.findClusterByLabel(activeBudNode.getParent().getName());
            if (activeNodeCluster != null) {
                //high light parent node
                activeNodeCluster.setHighlight(true);
                //highlight child node
                var activeNode: VizNode = activeNodeCluster.findNode(activeBudNode.getName());
                if (activeNode != null) activeNode.setHighlight(true);
            }
        }
    }


	/**
	 * Highlights active/requested nodes
	 * If child node is requested, both parent & child are highlighted
	 */
    protected highlightActiveNodes() {
        for (var i = 0; i < this.activeBudNodes.length; i++) {
            var activeBudNode: BudNode = this.activeBudNodes[i];
            var srcNodeCluster: Cluster = this.graph.findClusterByLabel(activeBudNode.getName());
            // highlight text; finds if requested node is of high level;
            //returns null if a child node requested
            if (srcNodeCluster != null) {
                srcNodeCluster.setHighlight(true);
            } else { //Not found, check if it has a parent
                this.highlightActiveNodeParent(activeBudNode);
            }
        }
    }


    protected highlightCommonNodes() {
        for (var i: number = 0; i < this.commonBudNodes.length; i++) {
            //Rank condition is to bypass the domain, db, db user nodes from showing as common.
            //TODO should this condition be removed?
            var b: BudNode = this.commonBudNodes[i];
            if (b.isHighlight()) {
                var srcNodeCluster: Cluster = this.graph.findClusterByLabel(b.getName());
                if (srcNodeCluster != null) {
                    srcNodeCluster.setColorToHighlightCommonNode();
                }
            }
        }
    }

    // public  isDetailed():boolean {
    // 	return this.isDetailed;
    // }

    public isDetailedOrTopIndependentLevel(updownBudNode: BudNode): boolean {
        return this.isDetailed || updownBudNode.isTopIndependentLevel();
    }

    protected populateCommonNodes(dependentBudNodes: Map<BudNode, Set<BudNode>>) {
        var commonNodesSet: Set<BudNode> = null;
        var iter: IterableIterator<BudNode> = dependentBudNodes.keys();
        for (var type: IteratorResult<BudNode> = iter.next(); !type.done; type = iter.next()) {

            //while (itr.hasNext()) {
            var sdependentNodes: Set<BudNode> = dependentBudNodes.get(type.value);
            if (commonNodesSet == null) {
                commonNodesSet = sdependentNodes;
            }
            //This method retains only those nodes that are also in the passed set (intersection)
            commonNodesSet = new Set(Array.from(commonNodesSet).filter(x => sdependentNodes.has(x)));
            
            
        }
        if (commonNodesSet != null) {
            //Needs to do a union instead of push; convert array into set 
            var tempset: Set<BudNode> = new Set(this.commonBudNodes);
            commonNodesSet.forEach(element => tempset.add(element));
            this.commonBudNodes = Array.from(tempset);

        }
    }


	/**
	 * This method is the main recursive method that traverses the graph.  
	 * It controls the number of levels to recurse & notes down the paths that are between required 2 nodes.
	 *  
	 * @param reqBudNode current node that is being processed, for first call it will be active node
	 * @param isActiveNode will be true only for first call to tell this is active node
	 */
    populateDetailedDependency(reqBudNode: BudNode, isActiveNode: boolean) {

        // Building lateral nodes should happen even if the level has crossed.
        // Hence extracted it separately to beginning before checking for
        // levels.
        if (reqBudNode.isDependentLevel()) {
            this.findAndBuildLateralNodes(isActiveNode, reqBudNode.getParent());
        }
        //console.log("Levels current max",this.currentLevel,this.requestedMaxLevels);
        if (this.currentLevel >= this.requestedMaxLevels)
            return; // return without processing if the required number of
        // levels is met.
        this.currentLevel++;
        if (this.calcMaxLevels < this.currentLevel) this.calcMaxLevels = this.currentLevel;
        //QUESTION: why parent is tracked as dependent?
        this.dependentBudNodes.get(this.activeBudNode).add(reqBudNode.isDependentLevel() ? reqBudNode.getParent() : reqBudNode);
        //Process current node.
        this.processBudNode(reqBudNode);
        //if it is high level node, process all its children
        if (reqBudNode.isTopIndependentLevel()) {
            this.processChildNodes(reqBudNode, isActiveNode);
        }

        // set reqBudNodeForLaterals to the reqBudNode(if it's parent already)
        // or its parent to get lateral nodes and display them within the parent
        // node.
        this.findAndBuildLateralNodes(isActiveNode, reqBudNode);
        this.currentLevel--;  //Since we are returning, decrease the depth variable. 
    }

	/**
	 * This method actually processes the current node by getting its downstream/upstream
	 * dependencies and then call the buildEdge and then for each node pass control to recursion
	 * @param reqSrcBudNode
	 */
    private processBudNode(reqSrcBudNode: BudNode) {

        var updownBudNodes: Array<BudNode> = loadedData.linksInstance.getUpOrDownBudNodes(reqSrcBudNode, this.direction,this.reqTags);
        log.debug("ProcessBudNode", this.currentLevel, reqSrcBudNode.getName(), this.direction);
        for (var i: number = 0; i < updownBudNodes.length; i++) {
            var updownBudNode: BudNode = updownBudNodes[i];
            log.debug("updownBudNode", updownBudNode.getName());
            this.buildDestNode(updownBudNode);
            this.buildEdge(reqSrcBudNode, updownBudNode);
            this.populateDetailedDependency(updownBudNode, false);
        }
    }

    protected processChildNodes(reqBudNode: BudNode, isActiveNode: boolean) {
        var reqBudNodeChildren: Array<BudNode> = reqBudNode.getChildren(this.reqTags);
        

        for (var i: number = 0; i < reqBudNodeChildren.length; i++) {
            var reqBudNodeChild: BudNode = reqBudNodeChildren[i];
            //In the case of highlevel view, we do not need individual child nodes as we use selfnode
            if (this.isDetailed)
                this.graph.buildNode(this.isDetailed, reqBudNodeChild);
            // build laterals for each child node. currently applicable for
            // db users. same method outside will do it for parent node
            this.findAndBuildLateralNodes(isActiveNode, reqBudNodeChild);
            //console.log("ProcessChildNodes",reqBudNodeChild.getName());
            this.processBudNode(reqBudNodeChild);
        }
    }

	/**
	 * This method is to highlight commonNodes between all the paths of the 2 nodes given
	 * Do it only if more than one node given in input - TODO is this condition not implemented?
	 * @param showCommonOnly if true removes all other nodes. 
	 */
    protected processCommonNodes() {
        //Identify common nodes using set
        this.populateCommonNodes(this.dependentBudNodes);
        //Now loop through common nodes, get its cluster from graph and set color to highlight.
        this.highlightCommonNodes();
        //Remove nodes that are not common if show common flag is true 
        this.showCommonNodes();
    }

    protected processUpStreamLaterals(reqBudNodeForLaterals: BudNode, lateralNode: BudNode, srcNodeCluster: Cluster) {
        srcNodeCluster.setStyle("");
        //This is to distinguish between domain vs dbuser to show the UI containment

        if (loadedData.configData[reqBudNodeForLaterals.getType()].containment == "Y")
            //for domain, do not create edge but only add laternal nodes under domain
            srcNodeCluster.findOrAddCluster(false, lateralNode, this.graph.getClusterSize());
        else {
            //this is for DBuser, create lateral nodes at highest level so that db node is outside
            this.graph.findOrAddCluster(false, lateralNode, this.graph.getClusterSize());
            //show the edge to the db user node 
            this.graph.buildEdge(this.isDetailed, reqBudNodeForLaterals, lateralNode, BudNodeMatcher.DIRECTION_UP);
            //make the hidden node visible			
            this.unhideInvisibleSelfNode(reqBudNodeForLaterals, srcNodeCluster);
        }
    }


    public setActiveBudNodes(activeBudNodes: Array<BudNode>) {
        this.activeBudNodes = activeBudNodes;
    }


    public setCommonBudNodes(commonBudNodes: Array<BudNode>) {
        this.commonBudNodes = commonBudNodes;
    }

    public setDetailed(isDetailed: boolean) {
        this.isDetailed = isDetailed;
    }

    public setShowCommonOnly(showCommonOnly: boolean) {
        this.showCommonOnly = showCommonOnly;
    }


    public showCommonNodes() {
        //if show common flag is true
        if (this.showCommonOnly) {
            //Adding the passed nodes so that they are retained even if they are not common
            this.commonBudNodes = this.commonBudNodes.concat(this.activeBudNodes);
            this.graph.removeNonActiveNodes(this.commonBudNodes);
        }
    }

    protected unhideInvisibleSelfNode(reqBudNodeForLaterals: BudNode, srcNodeCluster: Cluster): VizNode {
        var hiddenNode: VizNode = srcNodeCluster.findNode(srcNodeCluster.getLabel());
        if (hiddenNode != null) {
            hiddenNode.copyDesign(VizNode.createNode(reqBudNodeForLaterals));
            hiddenNode.setUrl(srcNodeCluster.getUrl());
        }
        return hiddenNode;
    }

    protected intersection(setA: Set<BudNode>, setB: Set<BudNode>): Set<BudNode> {
        var intersection = new Set<BudNode>();
        for (var elem of setB) {
            if (setA.has(elem)) {
                intersection.add(elem);
            }
        }
        return intersection;
    }

}


