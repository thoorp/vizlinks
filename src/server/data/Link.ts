
import { BudNode } from "./BudNode";
import { Tags } from "./Tags";

 export class Link {

	 srcNode:BudNode;
	destNode:BudNode;
	tags:Tags;

	 constructor( srcNode:BudNode,  destNode:BudNode, tags:Tags) {
		this.srcNode = srcNode;
		this.destNode = destNode;
		this.tags = tags;
		//console.log("Link created src dest",srcNode.getName(),destNode.getName())
	}

	public  toString():string {
		return "Link [srcNode=" + this.srcNode.toString() + ", destNode=" + this.destNode.toString() + ", tags= "+this.tags.toString()+ "]";
	}

	
	public  equals( obj:any):boolean {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		
		 var other:Link =  obj;
		if (this.destNode == null) {
			if (other.destNode != null)
				return false;
		} else if (!this.destNode.equals(other.destNode))
			return false;
		if (this.srcNode == null) {
			if (other.srcNode != null)
				return false;
		} else if (!this.srcNode.equals(other.srcNode))
			return false;
		return true;
	}
	
	
	public  hashCode():number {
		var  prime:number = 31;
		var result = 1;
		result = prime * result + ((this.destNode == null) ? 0 : this.destNode.hashCode());
		result = prime * result + ((this.srcNode == null) ? 0 : this.srcNode.hashCode());
		return result;
	}
	
	public  getDestNode():BudNode {
		return this.destNode;
	}

	public  getSrcNode():BudNode {
		return this.srcNode;
	}

	public  isDestLateral():boolean {
		return this.destNode.isLateral();
	}

	public  setDestNode( destNode:BudNode) {
		this.destNode = destNode;
	}

	public getTags():Tags{
		return this.tags;
	}
}
