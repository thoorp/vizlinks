import { VizNode } from "./VizNode";



/**
 * DOT/GraphViz Edges (a.k.a Connection)
 */
export class Edge {

	
	private  srcNode:VizNode;
	
	private  tgtNode:VizNode;
	
	private  dir:string;
	
	private  arrowHead:string;
	
	private  lhead:string;
	
	private  ltail:string;
	
	static readonly  DIR_FORWARD:string = "forward";

	
	

	public constructor( srcNode:VizNode,  tgtNode:VizNode) {
		
		this.srcNode = srcNode;
		this.tgtNode = tgtNode;
	}

	

	
	public  equals( edge:Edge):boolean {
	
		if (!this.srcNode.equals(edge.srcNode))
			return false;
		if (!this.tgtNode.equals(edge.tgtNode))
			return false;

		return true;
	}

	public  getSrcNode():VizNode {
		return this.srcNode;
	}

	public  getTgtNode():VizNode {
		return this.tgtNode;
	}


	public  setDir( dir:string) {
		this.dir = dir;
	}

	
	public  toString():string {
		//generate DOT representation of edge
		var result:string = "";
		if (this.srcNode != null && this.tgtNode != null) {
				result = "\"" + this.srcNode.getName() + "\"->\"" + this.tgtNode.getName() + "\"" + this.generateStyleBox() + "\n";
		}
		return result;
	}
	
	public  generateStyleBox():string {
		var styling:String = new String("[");
		styling.concat("style=\"dotted\",");
		this.styleDir(styling);
		this.styleTargetCluster(styling);
		this.styleSourceCluster(styling);
		styling.concat("edgeURL=\"#\"]");
		return styling.toString();
	}


	public  styleDir( styling:String) {
		if (this.dir != null) {
			styling.concat("dir=\"");
			styling.concat(this.dir);
			styling.concat("\",");
		}
	}

	public  styleSourceCluster( styling:String) {
		// if srcNode is a self node, show the connection originate at cluster level		
		if(this.isSelfNode(this.srcNode)){
			styling.concat("ltail=\"");
			styling.concat(this.srcNode.getCluster().getName());
			styling.concat("\",");
		}
	}

	public  styleTargetCluster( styling:String) {
		// if tgtNode is a self node, show the connection originate at cluster level
		if(this.isSelfNode(this.tgtNode)){
			styling.concat("arrowhead=\"vee\",");
			
			styling.concat("lhead=\"");
			styling.concat(this.tgtNode.getCluster().getName());
			styling.concat("\",");
		}
	}

	public  isSelfNode( node:VizNode):boolean {
		return node.getCluster() != null && node.getName()==node.getCluster().getLabel();
	}

	public  getDir():string {
		return this.dir;
	}
}
