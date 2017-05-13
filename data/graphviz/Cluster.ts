import { BudNode } from "../BudNode";
import { Base } from "./Base";
import { VizNode } from "./VizNode";

var loadedData = require("../../LoadedData");

/**
 * DOT/GraphViz Cluster
 */
export class Cluster extends Base {

	public static createCluster(budnode: BudNode, counter: number): Cluster {
		// based on the property files
		//Properties properties = BudNodeTypeMetaData.INSTANCE.TYPEMETADATA.get(budnode.getType()).getProperties();
		var clusterName: string = "cluster_" + (counter + 1);
		var result: Cluster = new Cluster(clusterName, budnode.getName());
		result.color = loadedData.configData[budnode.getType()].graphvizClusterColor;

		result.fontColor = loadedData.configData[budnode.getType()].graphvizClusterFontColor;
		result.fontName = loadedData.configData[budnode.getType()].graphvizClusterFontName;
		result.fontSize = loadedData.configData[budnode.getType()].graphvizClusterFontSize;
		result.style = loadedData.configData[budnode.getType()].graphvizClusterStyle;
		result.iconFont = loadedData.configData[budnode.getType()].graphvizClusterIconFont;
		result.url = Base.VIZDOTSAPI_ROOT_URL + budnode.getName();
		return result;
	}

	/**
	 * useful in generating highlevel flows
	 * 
	 * @param graph
	 * @param includeSelfNode
	 * @return
	 */
	public static createClusterWithSelfNode(budnode: BudNode, counter: number): Cluster {
		// based on the property files
		var result: Cluster = Cluster.createCluster(budnode, counter);
		// for high-level graphs, create a self node with no label and invis
		var selfNode: VizNode = new VizNode(budnode.getName(), null);
		selfNode.setStyle( Base.STYLE_INVIS);
		selfNode.setCluster(result);
		result.nodes.push(selfNode);
		return result;
	}

	protected clusters: Array<Cluster>;
	private nodes: Array<VizNode>;




	public constructor(name: string, label: string) {
		super(name, label);
		this.nodes = [];
		this.clusters = [];
	}

	public clone() {
		//super.clone();
		var result: Cluster = new Cluster(this.name, this.label);

		if (this.nodes != null)
			result.nodes = [];
		for (var i: number = 0; i < this.nodes.length; i++) {
			result.nodes.push(this.nodes[i].clone());
		}

		return result;
	}


	public equals(cluster: Cluster): boolean {



		//important - label is what really identifies a cluster; 
		if (this.label != null ? !(this.label == cluster.label) : cluster.label != null)
			return false;

		return true;
	}

	public findCluster(cluster: Cluster): Cluster {
		var result: Cluster = null;
		if (this.clusters != null && cluster != null)
			if (cluster.label != null)
				result = this.findClusterByLabel(cluster.label);
		return result;
	}

	public findClusterByLabel(searchLabel: string): Cluster {
		var result: Cluster = null;
		if (this.clusters != null && searchLabel != null)
			for (var i: number = 0; i < this.clusters.length; i++) {
				var c: Cluster = this.clusters[i]

				if (c.label != null && c.label == searchLabel) {
					result = c;
					break;
				}
				if (c.clusters != null) {
					result = c.findClusterByLabel(searchLabel);
					if (result != null)
						break;
				}
			}
		return result;
	}

	public findNode(pname: string): VizNode {
		var result: VizNode = null;
		if (pname != null && this.nodes != null)
			for (var i: number = 0; i < this.nodes.length; i++) {
				var node: VizNode = this.nodes[i];
				if (pname == node.getName()) {
					result = node;
					break;

				}

			}
		return result;

	}

	public findSelfNode(): VizNode {
		return this.findNode(this.label);
	}

	/**
	 * Utility method to add a cluster if it does not already exist, add
	 * 
	 * @param isDetailed
	 * @param reqBudNode
	 * @param counter
	 */
	public findOrAddCluster(isDetailed: boolean, reqBudNode: BudNode, counter: number) {
		var srcNodeCluster: Cluster = this.findClusterByLabel(reqBudNode.getName());
		if (srcNodeCluster == null) {
			srcNodeCluster = Cluster.createClusterWithSelfNode(reqBudNode, counter);
			this.clusters.push(srcNodeCluster);
		}
	}

	public findOrAddClusterByLabel(budnode: BudNode, counter: number): Cluster {
		var result: Cluster = null;
		var searchLabel: string = budnode.getName();
		if (this.clusters == null) {
			this.clusters = [];
		}
		if (searchLabel != null)
			result = this.findClusterByLabel(searchLabel);
		if (result == null) {
			result = Cluster.createClusterWithSelfNode(budnode, counter);
			this.clusters.push(result);
		}
		return result;
	}

	public getClusters(): Array<Cluster> {
		return this.clusters;
	}

	/**
	 * calculate cluster size
	 */
	public getClusterSize(): number {
		var result: number = 0;
		if (this.clusters != null) {
			result = this.clusters.length;
			this.clusters.forEach(function (c: Cluster) {
				if (c.getClusters() != null )
					result = result + c.getClusterSize();
			});


		}
		return result;
	}

	/**
	 * recursively count cluster size
	 */
	// public static getClusterSize(cluster: Cluster): number {
	// 	var result: number = 0;
	// 	var clusterList: Array<Cluster> = cluster.getClusters();
	// 	if (clusterList != null) {
	// 		result = clusterList.length;
	// 		clusterList.forEach(function (c: Cluster) { result = result + this.getClusterSize(c); });

	// 	}
	// 	return result;
	// }

	public getIconAndLabel(): string {
		// refer http://fontawesome.io/cheatsheet/
		return this.label + (this.iconFont == null ? "" : " " + this.iconFont);
	}

	public getNodes(): Array<VizNode> {
		return this.nodes;
	}



	// public  hashCode():number {
	// 	return this.label != null ? this.label.hashCode() : 0;
	// }

	/**
	 * Do UI processing of showing the node as a common node.
	 */
	public setColorToHighlightCommonNode() {
		this.color = "blue";
		this.style = "";
	}
	public setNodes(nodes: Array<VizNode>) {
		this.nodes = nodes;
	}


	public toString(): string {
		var result: String = new String("subgraph ");

		result.concat(name);
		result.concat(" {\n");
		if (this.url != null) {
			result.concat("URL=\"");
			result.concat(this.url);
			result.concat("\"\n");
		}
		result.concat("style=\"");
		if (this.style != null) {
			result.concat(this.style);
		} else
			result.concat("filled");
		result.concat("\"\n");

		result.concat("color=\"");
		if (this.color != null)
			result.concat(this.color);
		else
			result.concat("#F2F2F2");
		result.concat("\"\n");

		if (this.fontSize != null)
			result.concat("fontsize=\"" + this.fontSize + "\"\n");

		if (this.highlight)
			result.concat("fontcolor=\"" + Base.COLOR_HIGHLIGHT + "\"\n");
		else
			result.concat("fontcolor=\"" + this.fontColor + "\"\n");
		result.concat("fontname=\"" + this.fontName + "\"\n");
		if (this.nodes != null) {
			//Collections.sort(nodes);
			this.nodes.forEach(function (node: VizNode) {
				result.concat(node.toString());
			})
		}
		result.concat("label = \"");
		if (this.label != null)
			result.concat(this.getIconAndLabel());

		result.concat("\"\n\n");

		if (this.clusters != null)
			this.clusters.forEach(function (cluster: Cluster) {
				if (cluster != null)
					result.concat(cluster.toString());
			})


		result.concat(" }\n\n");
		return result.toString();
	}
}
