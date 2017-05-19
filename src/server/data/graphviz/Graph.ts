
import { BudNode } from "../BudNode";
import { BudNodes } from "../BudNodes";
import { VizNode } from "./VizNode";
import { Cluster } from "./Cluster";
import { Edge } from "./Edge";
import { VizdotsConstants } from "../../VizdotsConstants"
import * as Logger from "bunyan";

//var VizdotsConstants = require( "../../VizdotsConstants")
var loadedData = require("../../LoadedData");


var log = Logger.createLogger({name: 'vizLinks'});
/**
 * DOT/GraphViz Graph
 */

export class Graph extends Cluster {

	private edges: Array<Edge>;

	public constructor() {
		super("Graph", null);
		this.clusters = [];
		this.edges = [];
	}

	protected addEdgeIfNotFound(edge: Edge) {
		if (this.findEdge(edge) == null)
			this.getEdges().push(edge);
	}

	/**
	 * This method builds edges based on 2 bud nodes given and the direction
	 * @param isDetailed
	 * @param updownNode1
	 * @param updownNode2
	 * @param direction
	 */
	public buildEdge(isDetailed: boolean, updownNode1: BudNode, updownNode2: BudNode, direction: number): Edge {
		var edge: Edge;
		//console.log(" vizdotsConstants.DIRECTION_DOWN is ",  VizdotsConstants.DIRECTION_DOWN)

		if (direction == VizdotsConstants.DIRECTION_DOWN) {
			//console.log ("Building edge direction down",updownNode1.getName(),updownNode2.getName());

			edge = this.buildEdgeByDirection(isDetailed, updownNode1, updownNode2);
		}
		else {
			//console.log ("Building edge direction up",updownNode2.getName(),updownNode1.getName());
			edge = this.buildEdgeByDirection(isDetailed, updownNode2, updownNode1);
		}
		this.addEdgeIfNotFound(edge);
		return edge;
	}

	protected buildEdgeByDirection(isDetailed: boolean, updownNode1: BudNode, updownNode2: BudNode): Edge {
		var edge: Edge;
		//TODO - why are we creating a new node in one case and finding existing node in another?
		if (isDetailed)
			edge = new Edge(VizNode.createNode(updownNode1), VizNode.createNode(updownNode2));
		else {
			var updownNode1Cluster: Cluster = this.findClusterByLabel(updownNode1.getName());
			var updownNode2Cluster: Cluster = this.findClusterByLabel(updownNode2.getName());
			edge = new Edge(updownNode1Cluster.findSelfNode(),
				updownNode2Cluster.findSelfNode());
		}
		edge.setDir(Edge.DIR_FORWARD);
		return edge;
	}

	/**
	 * This takes a BudNode and builds corresponding graphviz VizNode as required
	 * @param isDetailed
	 * @param reqBudNode
	 */
	public buildNode(isDetailed: boolean, reqBudNode: BudNode) {
		// if request bud node has parent, then add it to graph if it does not
		// exist already.
		if (reqBudNode.isDependentLevel()) {
			this.findOrAddNode(reqBudNode);
		} else {
			// for high-level graphs; check if the cluster already exists in
			// graph
			this.findOrAddCluster(isDetailed, reqBudNode, this.getClusterSize());
		}

	}

	protected findOrAddNode(reqBudNode: BudNode) {
		var reqNode: VizNode = VizNode.createNode(reqBudNode);
		// pass graph to generate cluster name using cluster size
		var reqNodeParentCluster: Cluster = Cluster.createClusterWithSelfNode(reqBudNode.getParent(), this.getClusterSize());
		var nodeParentCluster: Cluster = this.findOrAddNodeParentCluster(reqNodeParentCluster);

		if (nodeParentCluster.findNode(reqNode.getName()) == null) {
			nodeParentCluster.getNodes().push(reqNode);
			reqNode.setCluster(nodeParentCluster);
		}
	}

	public findOrAddNodeParentCluster(reqNodeParentCluster: Cluster): Cluster {
		// check if the parent cluster already exists in graph
		var graphCluster: Cluster = this.findCluster(reqNodeParentCluster);
		if (graphCluster == null) {
			this.getClusters().push(reqNodeParentCluster);
			graphCluster = reqNodeParentCluster;
		}
		return graphCluster;
	}

	protected findEdge(edge: Edge): Edge {
		var result: Edge = null;
		if (edge != null)
			for (var i: number = 0; i < this.edges.length; i++) {
				var e: Edge = this.edges[i];

				if ((e != null) && e.equals(edge)) {
					return e;
				}
			}
		return result;
	}

	public findorAddClusterByLabel(budNode: BudNode): Cluster {
		return super.findOrAddClusterByLabel(budNode, this.getClusterSize());
	}

	public getEdges(): Array<Edge> {
		return this.edges;
	}

	protected removeEdgeByLabel(label: string) {
		for (var i: number = 0; i < this.edges.length; i++) {
			var e: Edge = this.edges[i];
			if ((e != null) && (e.getSrcNode().getName() == label || e.getTgtNode().getName() == label)) {
				this.edges.splice(i);

			}
		}
	}

	/**
	 * This method is called only when user requests path between 2 nodes only.
	 * In that case we need to remove all the clusters from the graph that are
	 * not in the path between 2 nodes the nodes between 2 nodes is present in
	 * activePath list. So loop through activePath and remove all clusters that
	 * are not in activePath
	 * @param activePath TODO
	 */
	public removeNonActiveNodes(activePath: Array<BudNode>) {
		// Loop through each cluster and identify the cluster that is not in
		// activeNodes
		for (var i: number = 0; i < this.getClusters().length; i++) {
			var cl: Cluster = this.getClusters()[i];
			var found: boolean = this.searchCluster(activePath, cl);
			log.debug("RemoveNonActiveNodes",cl.getLabel(),found);
			if (!found) {
				
				this.getClusters().splice(i, 1);
				this.removeEdgesToClusterAndItsNodes(cl);
				i--;//Move counter back as array has changed and next element moved to current spot
			}
		}

	}

	public removeEdgesToClusterAndItsNodes(cl: Cluster) {
		this.removeEdgeByLabel(cl.getLabel());
		//TODO - setup BudNodes.INSTANCE and then write test case.
		var reqNode: BudNode = loadedData.budNodesInstance.getNodeByName(cl.getLabel());
		if (reqNode != null) {
			for(var i=0; i<reqNode.getChildren().length; i++){
				 this.removeEdgeByLabel(reqNode.getChildren()[i].getName());
			}
		}
	}

	public searchCluster(activePath: Array<BudNode>, cl: Cluster): boolean {
		var found: boolean = false;
		for (var i = 0; i < activePath.length; i++) {
			var nodeLabel: string = this.getBudNodeTopLevelName(activePath[i]);
			if (nodeLabel != null && nodeLabel == cl.getLabel()) {
				found = true;
				break;
			}
		}

		return found;
	}

	public getBudNodeTopLevelName(node: BudNode): string {
		if (node.isDependentLevel()) {
			return node.getParent().getName();
		} else {
			return node.getName();
		}
	}

	/**
	 * generates dot graph
	 */

	public toString(): string {
		var result: string = "digraph G {\n";
		result += "compound=true\n";
		result += "nodesep=.1\n";
		this.clusters.forEach(function (cluster: Cluster) { result += cluster.toString(); });

		this.edges.forEach(function (edge: Edge) { result += edge.toString(); });


		result += "rankdir=LR\n";
		result += "}\n";
		return result;
	}

}
